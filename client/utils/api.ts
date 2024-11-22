import axios from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000"; // Backend URL

// Create an Axios instance for consistent configuration
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 5000, // Timeout after 5 seconds
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // Enable cookies for refresh tokens
});

// Token handling: Store access token in memory (not localStorage for security)
let accessToken: string | null = null;

// Function to set the access token
export const setAccessToken = (token: string) => {
  accessToken = token;
};

// Add Authorization header to each request if accessToken is available
apiClient.interceptors.request.use((config) => {
  if (accessToken) {
    config.headers["Authorization"] = `Bearer ${accessToken}`;
  }
  return config;
});

// Automatically refresh the access token if it expires
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Check if the error is due to an expired token and retry with a refreshed token
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Call the refresh endpoint to get a new access token
        const refreshResponse = await axios.post(`${API_BASE_URL}/auth/refresh`, {}, { withCredentials: true });
        accessToken = refreshResponse.data.access_token; // Update access token in memory

        // Retry the original request with the new token
        originalRequest.headers["Authorization"] = `Bearer ${accessToken}`;
        return apiClient(originalRequest);
      } catch (refreshError) {
        console.error("Token refresh failed:", refreshError);
        // Optional: Redirect to login if refresh fails
        window.location.href = "/auth/login";
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

// Export reusable API methods
export const api = {
  // ------------------------ Authentication ------------------------
  login: async (email: string, password: string) => {
    const response = await apiClient.post("/auth/login", { email, password });
    setAccessToken(response.data.access_token); // Store the new access token
    return response.data;
  },

  checkEmail: async (email: string) => {
    const response = await apiClient.post("/auth/check-email", { email });
    return response.data;
  },

  register: async (userData: { email: string; password: string; firstname?: string; lastname?: string }) => {
    const response = await apiClient.post("/auth/register", userData);
    return response.data;
  },

  logout: async () => {
    await apiClient.post("/auth/logout");
    accessToken = null; // Clear access token
  },

  // ------------------------ Groups ------------------------
  createGroup: async (groupData: { name: string; description: string }) => {
    const response = await apiClient.post("/groups", groupData);
    return response.data;
  },

  listGroups: async () => {
    const response = await apiClient.get("/groups");
    return response.data;
  },

  updateGroup: async (groupId: number, groupData: { name: string; description: string }) => {
    const response = await apiClient.put(`/groups/${groupId}`, groupData);
    return response.data;
  },

  deleteGroup: async (groupId: number) => {
    const response = await apiClient.delete(`/groups/${groupId}`);
    return response.data;
  },

  // ------------------------ User-Specific ------------------------
  getUserInfo: async () => {
    const response = await apiClient.get("/auth/user"); // Updated to match the backend route
    return response.data;
  },

  getJoinedGroups: async () => {
    const response = await apiClient.get("/group-members/user/groups");
    return response.data;
  },

  getSuggestedGroups: async () => {
    // Separate method to fetch suggested groups (can call listGroups or a specific endpoint)
    const response = await apiClient.get("/groups/suggestions"); // Update based on backend implementation
    return response.data;
  },

  getRecentActivity: async () => {
    const response = await apiClient.get("/activity/user/activity");
    return response.data.activities;
  },
};

export default api;