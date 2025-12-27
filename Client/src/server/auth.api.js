import http from "./http";

/**
 * Authentication API endpoints
 */

export const authApi = {
  /**
   * Login user
   * @param {Object} credentials - Login credentials
   * @param {string} credentials.email - User email
   * @param {string} credentials.password - User password
   * @returns {Promise<Object>} Response with accessToken and user data
   */
  login: async (credentials) => {
    const response = await http.post("/auth/login", credentials);
    return response.data;
  },

  /**
   * Register new user
   * @param {Object} userData - Registration data
   * @returns {Promise<Object>} Response with accessToken and user data
   */
  register: async (userData) => {
    const response = await http.post("/auth/register", userData);
    return response.data;
  },

  /**
   * Refresh access token using refresh token (http-only cookie)
   * @returns {Promise<Object>} Response with new accessToken
   */
  refreshToken: async () => {
    const response = await http.post("/auth/refresh-token");
    return response.data;
  },

  /**
   * Logout user
   * @param {Object} tokens - Access and refresh tokens
   * @param {string} tokens.accessToken - Current access token
   * @param {string} tokens.refreshToken - Current refresh token
   * @returns {Promise<void>}
   */
  logout: async (tokens) => {
    await http.post("/auth/logout", tokens);
  },
};

