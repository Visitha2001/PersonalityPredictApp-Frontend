import axios from 'axios';

const API_BASE_URL = 'http://localhost:8008/api/v1';

export const predictPersonality = async (data) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/predict`, data);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.detail || 'Prediction failed');
  }
};