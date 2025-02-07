import axios from "axios";
console.log(process.env.EXPO_PUBLIC_BASE_URL);
const baseURL = process.env.EXPO_PUBLIC_BASE_URL
  ? process.env.EXPO_PUBLIC_BASE_URL
  : "http://localhost:8000/api/";
export const apiClient = axios.create({
  baseURL: baseURL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Function to fetch data by endpoint
export const fetchDataByEndpoint = async (endpoint) => {
  try {
    const response = await apiClient.get(endpoint);
    return response.data;
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
};

export const postDataToEndpoint = async (endpoint, data) => {
  try {
    const response = await apiClient.post(endpoint, data);
    return response.data;
  } catch (error) {
    console.error("Error posting data:", error);
    throw error;
  }
};
