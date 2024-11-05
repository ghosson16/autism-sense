import axios from 'axios';

const apiUrl = import.meta.env.VITE_BACKEND_URL;

// Fetch child data by ID
export const fetchChildData = async (childId) => {
  try {
    const response = await axios.get(`${apiUrl}/api/child/child-profile/${childId}`, { withCredentials: true });
    return response.data;
  } catch (error) {
    console.error('Error fetching child data:', error);
    throw error; // rethrow to handle in the component
  }
};

// Update child data
export const updateChildData = async (childId, updatedChildData) => {
  try {
    const response = await axios.put(`${apiUrl}/api/child/update-child/${childId}`, updatedChildData, { withCredentials: true });
    return response.data;
  } catch (error) {
    console.error('Error updating child data:', error);
    throw error;
  }
};

// Delete child account
export const deleteChildAccount = async (childId) => {
  try {
    const response = await axios.delete(`${apiUrl}/api/child/delete-child/${childId}`, { withCredentials: true });
    return response.data;
  } catch (error) {
    console.error('Error deleting child account:', error);
    throw error;
  }
};
