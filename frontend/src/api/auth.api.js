import { API_ENDPOINTS } from './config';

/**
 * API Helper function to handle fetch requests
 * @param {string} url - API endpoint
 * @param {object} options - Fetch options
 * @returns {Promise} - Response data
 */
async function apiRequest(url, options = {}) {
  const config = {
    credentials: 'include', // Important for session cookies
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  const response = await fetch(url, config);
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Something went wrong');
  }

  return data;
}

/**
 * Authentication API Service
 */
export const authAPI = {
  /**
   * Register a new user
   * @param {object} userData - { email, password, name }
   */
  register: async (userData) => {
    return apiRequest(API_ENDPOINTS.REGISTER, {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  },

  /**
   * Login user
   * @param {object} credentials - { email, password }
   */
  login: async (credentials) => {
    return apiRequest(API_ENDPOINTS.LOGIN, {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  },

  /**
   * Get user profile
   */
  getProfile: async () => {
    return apiRequest(API_ENDPOINTS.PROFILE, {
      method: 'GET',
    });
  },

  /**
   * Logout user
   */
  logout: async () => {
    return apiRequest(API_ENDPOINTS.LOGOUT, {
      method: 'POST',
    });
  },
};
