import http from "./http";

/**
 * Role API endpoints
 */

export const roleApi = {
  /**
   * Get all roles
   * @returns {Promise<Object>} List of roles
   */
  getAll: async () => {
    const response = await http.get("/roles");
    return response.data;
  },

  /**
   * Get role by ID
   * @param {string|number} id - Role ID
   * @returns {Promise<Object>} Role data
   */
  getById: async (id) => {
    const response = await http.get(`/roles/${id}`);
    return response.data;
  },
};



