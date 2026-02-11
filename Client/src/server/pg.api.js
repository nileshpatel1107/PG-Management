import http from "./http";

/**
 * PG (Pay Guest) API endpoints
 */

export const pgApi = {
  /**
   * Create a new PG
   * @param {Object} pgData - PG data
   * @returns {Promise<Object>} Created PG data
   */
  create: async (pgData) => {
    const response = await http.post("/pg", pgData);
    return response.data;
  },

  /**
   * Get PG by ID
   * @param {string|number} id - PG ID
   * @returns {Promise<Object>} PG data
   */
  getById: async (id) => {
    const response = await http.get(`/pg/${id}`);
    return response.data;
  },

  /**
   * Get all PGs (if endpoint exists)
   * @param {Object} params - Query parameters
   * @returns {Promise<Object>} List of PGs
   */
  getAll: async (params = {}) => {
    const response = await http.get("/pg", { params });
    return response.data;
  },

  /**
   * Update PG
   * @param {string|number} id - PG ID
   * @param {Object} pgData - Updated PG data
   * @returns {Promise<Object>} Updated PG data
   */
  update: async (id, pgData) => {
    const response = await http.put(`/pg/${id}`, pgData);
    return response.data;
  },

  /**
   * Delete PG
   * @param {string|number} id - PG ID
   * @returns {Promise<void>}
   */
  delete: async (id) => {
    await http.delete(`/pg/${id}`);
  },
};







