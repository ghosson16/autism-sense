// src/services/childService.js
import axios from 'axios';

const apiUrl = import.meta.env.VITE_BACKEND_URL; // Backend URL from .env

// Fetch child data by ID
export const fetchChildData = async (childId) => {
  const response = await axios.get(`${apiUrl}/api/child/child-profile/${childId}`, { withCredentials: true });
  return response.data;
};

// Update child data
export const updateChildData = async (childId, updatedChildData) => {
  const response = await axios.put(`${apiUrl}/api/child/update-child/${childId}`, updatedChildData, { withCredentials: true });
  return response;
};

// Delete child account
export const deleteChildAccount = async (childId) => {
  const response = await axios.delete(`${apiUrl}/api/child/delete/${childId}`, { withCredentials: true });
  return response.data;
};
