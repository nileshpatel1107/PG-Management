import http from "./http";

/**
 * User API endpoints
 */

export const userApi = {
  /**
   * Get current authenticated user
   * @returns {Promise<Object>} User data
   */
  getMe: async () => {
    const response = await http.get("/users/me");
    return response.data;
  },

  /**
   * Get all users
   * @returns {Promise<Object>} List of users
   */
  getAll: async () => {
    const response = await http.get("/users");
    return response.data;
  },

  /**
   * Create a new user
   * @param {Object} userData - User data
   * @returns {Promise<Object>} Created user data
   */
  create: async (userData) => {
    const response = await http.post("/users", userData);
    return response.data;
  },

  /**
   * Update user
   * @param {string|number} id - User ID
   * @param {Object} userData - Updated user data
   * @returns {Promise<Object>} Updated user data
   */
  update: async (id, userData) => {
    const response = await http.put(`/users/${id}`, userData);
    return response.data;
  },

  /**
   * Delete user
   * @param {string|number} id - User ID
   * @returns {Promise<void>}
   */
  delete: async (id) => {
    await http.delete(`/users/${id}`);
  },
};
