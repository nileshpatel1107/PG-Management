// Import Dependencies
import { useEffect, useReducer } from "react";
import isObject from "lodash/isObject";
import PropTypes from "prop-types";
import isString from "lodash/isString";

// Local Imports
import { authApi, userApi } from "server/api";
import { isTokenValid, setSession } from "utils/jwt";
import { AuthContext } from "./context";

// ----------------------------------------------------------------------

const initialState = {
  isAuthenticated: false,
  isLoading: false,
  isInitialized: false,
  errorMessage: null,
  user: null,
};

const reducerHandlers = {
  INITIALIZE: (state, action) => {
    const { isAuthenticated, user } = action.payload;
    return {
      ...state,
      isAuthenticated,
      isInitialized: true,
      user,
    };
  },

  LOGIN_REQUEST: (state) => {
    return {
      ...state,
      isLoading: true,
    };
  },

  LOGIN_SUCCESS: (state, action) => {
    const { user } = action.payload;
    return {
      ...state,
      isAuthenticated: true,
      isLoading: false,
      user,
    };
  },

  LOGIN_ERROR: (state, action) => {
    const { errorMessage } = action.payload;

    return {
      ...state,
      errorMessage,
      isLoading: false,
    };
  },

  LOGOUT: (state) => ({
    ...state,
    isAuthenticated: false,
    user: null,
  }),
};

const reducer = (state, action) => {
  const handler = reducerHandlers[action.type];
  if (handler) {
    return handler(state, action);
  }
  return state;
};

export function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    const init = async () => {
      try {
        const authToken = window.localStorage.getItem("authToken");

        if (authToken && isTokenValid(authToken)) {
          setSession(authToken);

          // Fetch current user data
          // Backend returns: { success: true, message: "...", data: UserDto }
          const userData = await userApi.getMe();
          const user = userData.data || userData.user || userData;

          if (user && isObject(user)) {
            dispatch({
              type: "INITIALIZE",
              payload: {
                isAuthenticated: true,
                user,
              },
            });
          } else {
            // Token valid but user data not available
            dispatch({
              type: "INITIALIZE",
              payload: {
                isAuthenticated: false,
                user: null,
              },
            });
          }
        } else {
          dispatch({
            type: "INITIALIZE",
            payload: {
              isAuthenticated: false,
              user: null,
            },
          });
        }
      } catch (err) {
        console.error("Auth initialization error:", err);
        // Clear invalid token
        setSession(null);
        dispatch({
          type: "INITIALIZE",
          payload: {
            isAuthenticated: false,
            user: null,
          },
        });
      }
    };

    init();
  }, []);

  const login = async ({ email, username, password }) => {
    dispatch({
      type: "LOGIN_REQUEST",
    });

    try {
      // Support both email and username for login
      const loginData = email ? { email, password } : { username, password };
      const response = await authApi.login(loginData);

      // Backend returns: { success: true, message: "...", data: { accessToken, refreshToken, expiresAt } }
      const responseData = response.data || response;
      const accessToken = responseData.accessToken || response.accessToken || response.authToken;
      const refreshToken = responseData.refreshToken || response.refreshToken;

      if (!isString(accessToken)) {
        throw new Error("Invalid response: access token not found");
      }

      // Store the access token
      setSession(accessToken);

      // Store refresh token if provided (backend may also set it as http-only cookie)
      if (refreshToken && isString(refreshToken)) {
        localStorage.setItem("refreshToken", refreshToken);
      }

      // Fetch user data after successful login
      // Backend returns: { success: true, message: "...", data: UserDto }
      try {
        const userData = await userApi.getMe();
        const user = userData.data || userData.user || userData;

        if (!isObject(user)) {
          throw new Error("Invalid response: user data not found");
        }

        dispatch({
          type: "LOGIN_SUCCESS",
          payload: {
            user,
          },
        });
      } catch (userErr) {
        // If user fetch fails, still mark as logged in (token is valid)
        // User data will be fetched on next page load
        console.warn("Failed to fetch user data after login:", userErr);
        dispatch({
          type: "LOGIN_SUCCESS",
          payload: {
            user: null, // Will be fetched on initialization
          },
        });
      }
    } catch (err) {
      const errorMessage =
        err?.message || 
        err?.response?.data?.message || 
        err?.data?.message ||
        "Login failed";
      dispatch({
        type: "LOGIN_ERROR",
        payload: {
          errorMessage: {
            message: errorMessage,
          },
        },
      });
      throw err; // Re-throw so login page can handle it
    }
  };

  const logout = async () => {
    try {
      const refreshToken = localStorage.getItem("refreshToken");
      const accessToken = localStorage.getItem("authToken");
      
      if (refreshToken && accessToken) {
        await authApi.logout({
          accessToken,
          refreshToken,
        });
      }
    } catch (err) {
      console.error("Logout error:", err);
    } finally {
      setSession(null);
      localStorage.removeItem("refreshToken");
      dispatch({ type: "LOGOUT" });
    }
  };

  if (!children) {
    return null;
  }

  return (
    <AuthContext
      value={{
        ...state,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext>
  );
}

AuthProvider.propTypes = {
  children: PropTypes.node,
};
