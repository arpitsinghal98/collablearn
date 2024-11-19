import axios from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000"; // Backend URL

// Create an Axios instance for consistent configuration
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 5000, // Timeout after 5 seconds
  headers: {
    "Content-Type": "application/json",
  },
});

// Example of handling the error globally
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // You can log or handle errors here globally
    console.error("API Error:", error.response || error.message);
    return Promise.reject(error.response || error.message);
  }
);

// Export reusable API methods
export const api = {

  // ------------------------ Authentication ------------------------
  login: async (email: string, password: string) => {
    const response = await apiClient.post("/auth/login", { email, password });
    return response.data; // Return data from the response
  },

  checkEmail: async (email: string) => {
    const response = await apiClient.post("/auth/check-email", { email });
    return response.data;
  },

  register: async (userData: { email: string; password: string; firstname?: string; lastname?: string }) => {
    const response = await apiClient.post("/auth/register", userData);
    return response.data;
  },

  // ------------------------ Groups ------------------------
  createGroup: async (groupData: { name: string; description: string }, token: string) => {
    const response = await apiClient.post("/groups", groupData, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  },

  listGroups: async () => {
    const response = await apiClient.get("/groups"); // Use Axios for consistency
    return response.data; // Return parsed JSON
  },

  updateGroup: async (groupId: number, groupData: { name: string; description: string }, token: string) => {
    const response = await apiClient.put(`/groups/${groupId}`, groupData, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  },

  deleteGroup: async (groupId: number, token: string) => {
    const response = await apiClient.delete(`/groups/${groupId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  },


};

export default api;