import axios from "axios";
import { isTokenValid, setSession } from "utils/jwt";

//const API_BASE_URL = "http://localhost:5000/api";
const API_BASE_URL = import.meta.env.VITE_API_URL;
// Create axios instance
const http = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // Important for http-only cookies (refresh token)
  headers: {
    "Content-Type": "application/json",
  },
});

// Flag to prevent multiple simultaneous refresh requests
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

// Request interceptor - attach access token
http.interceptors.request.use(
  (config) => {
    const authToken = localStorage.getItem("authToken");
    if (authToken && isTokenValid(authToken)) {
      config.headers.Authorization = `Bearer ${authToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - handle token refresh
http.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If error is 401 and we haven't tried to refresh yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // If already refreshing, queue this request
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return http(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // Get current tokens for refresh request
        const currentAccessToken = localStorage.getItem("authToken");
        const currentRefreshToken = localStorage.getItem("refreshToken");

        // Attempt to refresh token (use raw axios to avoid interceptor loop)
        const response = await axios.post(
          `${API_BASE_URL}/auth/refresh-token`,
          {
            accessToken: currentAccessToken,
            refreshToken: currentRefreshToken,
          },
          {
            baseURL: API_BASE_URL,
            withCredentials: true,
          }
        );

        // Backend returns: { success: true, message: "...", data: { accessToken, refreshToken, expiresAt } }
        const responseData = response.data?.data || response.data;
        const accessToken = responseData?.accessToken || response.data?.accessToken;
        const refreshToken = responseData?.refreshToken || response.data?.refreshToken;

        if (accessToken) {
          setSession(accessToken);
          // Store new refresh token if provided
          if (refreshToken && typeof refreshToken === "string") {
            localStorage.setItem("refreshToken", refreshToken);
          }
          processQueue(null, accessToken);
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
          isRefreshing = false;
          return http(originalRequest);
        }
      } catch (refreshError) {
        processQueue(refreshError, null);
        isRefreshing = false;
        // Clear session and redirect to login
        setSession(null);
        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }

    // Handle other errors
    const errorMessage =
      error.response?.data?.message ||
      error.response?.data?.error ||
      error.message ||
      "Something went wrong";

    return Promise.reject({
      message: errorMessage,
      status: error.response?.status,
      data: error.response?.data,
    });
  }
);

export default http;

