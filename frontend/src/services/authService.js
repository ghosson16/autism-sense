import axios from 'axios';

const apiUrl = import.meta.env.VITE_BACKEND_URL; // Ensure this is set correctly in your .env file

// Login request
export const login = async (email, password) => {
  try {
    const response = await axios.post(`${apiUrl}/api/auth/login`, { email, password }, {
      withCredentials: true,
    });
    return response.data;
  } catch (err) {
    console.error('Error during login:', err); // Improved error logging
    throw err;
  }
};

// Sign-up request
export const signUp = async (userData) => {
  try {
    const response = await axios.post(`${apiUrl}/api/auth/signup`, userData);
    return response.data;
  } catch (err) {
    console.error('Error during sign-up:', err); // Improved error logging
    throw err;
  }
};

// Send reset password email request
export const sendResetPasswordEmail = async (email) => {
  try {
    const response = await axios.post(`${apiUrl}/api/auth/forgot-password`, { email });
    return response.data;
  } catch (err) {
    console.error('Error during password reset request:', err); // Improved error logging
    throw err;
  }
};

// reset password
export const resetPassword = async (token, newPassword) => {
  try {
    const response = await axios.post(`${apiUrl}/api/auth/reset-password/${token}`, { password: newPassword });
    return response;
  } catch (err) {
    throw err;
  }
};

// Logout request
export const logout = async () => {
  try {
    const response = await axios.post(`${apiUrl}/api/auth/logout`, {}, {
      withCredentials: true, // Include this for session management during logout
    });
    return response.data;
  } catch (err) {
    console.error('Error during logout:', err); // Improved error logging
    throw err;
  }
};
