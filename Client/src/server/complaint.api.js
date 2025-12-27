import http from "./http";

/**
 * Complaint API endpoints
 */

export const complaintApi = {
  /**
   * Create a new complaint
   * @param {Object} complaintData - Complaint data
   * @returns {Promise<Object>} Created complaint data
   */
  create: async (complaintData) => {
    const response = await http.post("/complaints", complaintData);
    return response.data;
  },

  /**
   * Get current user's complaints
   * @param {Object} params - Query parameters
   * @returns {Promise<Object>} List of user's complaints
   */
  getMyComplaints: async (params = {}) => {
    const response = await http.get("/complaints/my", { params });
    return response.data;
  },

  /**
   * Get complaint by ID
   * @param {string|number} id - Complaint ID
   * @returns {Promise<Object>} Complaint data
   */
  getById: async (id) => {
    const response = await http.get(`/complaints/${id}`);
    return response.data;
  },

  /**
   * Update complaint
   * @param {string|number} id - Complaint ID
   * @param {Object} complaintData - Updated complaint data
   * @returns {Promise<Object>} Updated complaint data
   */
  update: async (id, complaintData) => {
    const response = await http.put(`/complaints/${id}`, complaintData);
    return response.data;
  },

  /**
   * Delete complaint
   * @param {string|number} id - Complaint ID
   * @returns {Promise<void>}
   */
  delete: async (id) => {
    await http.delete(`/complaints/${id}`);
  },
};






