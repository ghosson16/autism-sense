// services/authService.js
import axios from 'axios';

const apiUrl = import.meta.env.VITE_BACKEND_URL; // Set in .env file

// Login request
export const login = async (email, password) => {
  try {
    const response = await axios.post(`${apiUrl}/api/auth/login`, { email, password }, {
      withCredentials: true,
    });
    const { token, user } = response.data;
    localStorage.setItem("token", token);
    return { message: "Login successful", user };
  } catch (error) {
    console.error("Login error:", error);
    throw error.response?.data?.message || "An error occurred during login.";
  }
};

// Sign-up request
export const signUp = async (userData) => {
  try {
    const response = await axios.post(`${apiUrl}/api/auth/signup`, userData);
    return response.data;
  } catch (error) {
    console.error("Sign-up error:", error);
    throw error.response?.data?.message || "An error occurred during sign-up.";
  }
};

// Send reset password email request
export const sendResetPasswordEmail = async (email) => {
  try {
    const response = await axios.post(`${apiUrl}/api/auth/forgot-password`, { email });
    return response.data;
  } catch (error) {
    console.error("Reset password email error:", error);
    throw error.response?.data?.message || "An error occurred while sending the reset password email.";
  }
};

// Reset password
export const resetPassword = async (token, newPassword) => {
  try {
    const response = await axios.post(`${apiUrl}/api/auth/reset-password/${token}`, { password: newPassword });
    return response.data;
  } catch (error) {
    console.error("Reset password error:", error);
    throw error.response?.data?.message || "An error occurred while resetting the password.";
  }
};

// Logout request
export const logout = async () => {
  try {
    const response = await axios.post(`${apiUrl}/api/auth/logout`, {}, {
      withCredentials: true, // Include credentials for session-based logout
    });
    localStorage.removeItem("token"); // Clear token from localStorage on logout
    return response.data;
  } catch (error) {
    console.error("Logout error:", error);
    throw error.response?.data?.message || "An error occurred during logout.";
  }
};
