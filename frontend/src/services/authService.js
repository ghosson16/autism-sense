import axios from 'axios';

const apiUrl = import.meta.env.VITE_BACKEND_URL; // Ensure this is set correctly in your .env file

// Login request
export const login = async (email, password) => {
  const response = await axios.post(`${apiUrl}/api/auth/login`, { email, password }, {
    withCredentials: true,
  });
  return response.data;
};

// Sign-up request
export const signUp = async (userData) => {
  const response = await axios.post(`${apiUrl}/api/auth/signup`, userData);
  return response.data;
};

// Send reset password email request
export const sendResetPasswordEmail = async (email) => {
  const response = await axios.post(`${apiUrl}/api/auth/forgot-password`, { email });
  return response.data;
};

// Reset password
export const resetPassword = async (token, newPassword) => {
  const response = await axios.post(`${apiUrl}/api/auth/reset-password/${token}`, { password: newPassword });
  return response;
};

// Logout request
export const logout = async () => {
  const response = await axios.post(`${apiUrl}/api/auth/logout`, {}, {
    withCredentials: true, // Include this for session management during logout
  });
  return response.data;
};
