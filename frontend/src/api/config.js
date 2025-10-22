// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

export const API_ENDPOINTS = {
  REGISTER: `${API_BASE_URL}/auth/register-session`,
  LOGIN: `${API_BASE_URL}/auth/login-session`,
  PROFILE: `${API_BASE_URL}/auth/profile-session`,
  LOGOUT: `${API_BASE_URL}/auth/logout-session`,
};

// export const API_ENDPOINTS = {
//   REGISTER: `${API_BASE_URL}/auth/register-jwt`,
//   LOGIN: `${API_BASE_URL}/auth/login-jwt`,
//   PROFILE: `${API_BASE_URL}/auth/profile-jwt`,
//   LOGOUT: `${API_BASE_URL}/auth/logout-jwt`,
// };

export default API_BASE_URL;
