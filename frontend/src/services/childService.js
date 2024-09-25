import axios from 'axios';

const apiUrl = import.meta.env.VITE_BACKEND_URL;

// Fetch child data by ID
export const fetchChildData = async (childId) => {
  
  try {
    const response = await axios.get(`${apiUrl}/api/child/child-profile/${childId}`, { withCredentials: true });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Update child data
export const updateChildData = async (childId, updatedChildData) => {
  
  try {
    const response = await axios.put(`${apiUrl}/api/child/update-child/${childId}`, updatedChildData, { withCredentials: true });
    return response;
  } catch (error) {
    throw error;
  }
};
