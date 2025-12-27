import http from "./http";

/**
 * Room API endpoints
 */

export const roomApi = {
  /**
   * Get rooms by PG ID
   * @param {string|number} pgId - PG ID
   * @returns {Promise<Object>} List of rooms
   */
  getByPgId: async (pgId) => {
    const response = await http.get(`/rooms/${pgId}`);
    return response.data;
  },

  /**
   * Get room by ID
   * @param {string|number} id - Room ID
   * @returns {Promise<Object>} Room data
   */
  getById: async (id) => {
    const response = await http.get(`/rooms/${id}`);
    return response.data;
  },

  /**
   * Create a new room
   * @param {Object} roomData - Room data
   * @returns {Promise<Object>} Created room data
   */
  create: async (roomData) => {
    const response = await http.post("/rooms", roomData);
    return response.data;
  },

  /**
   * Update room
   * @param {string|number} id - Room ID
   * @param {Object} roomData - Updated room data
   * @returns {Promise<Object>} Updated room data
   */
  update: async (id, roomData) => {
    const response = await http.put(`/rooms/${id}`, roomData);
    return response.data;
  },

  /**
   * Delete room
   * @param {string|number} id - Room ID
   * @returns {Promise<void>}
   */
  delete: async (id) => {
    await http.delete(`/rooms/${id}`);
  },
};






