import axios from "axios";

const nodeApi = axios.create({
  baseURL: import.meta.env.VITE_NODE_API_URL,
});

nodeApi.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) req.headers.Authorization = `Bearer ${token}`;
  return req;
});

// Task-related API calls
export const taskAPI = {
  getAllTasks: (queryString = "") => nodeApi.get(`/tasks/${queryString ? `?${queryString}` : ""}`),
  getTaskById: (id) => nodeApi.get(`/tasks/${id}`),
  createTask: (taskData) => nodeApi.post("/tasks/", taskData),
  updateTask: (id, taskData) => nodeApi.put(`/tasks/${id}/update`, taskData),
  deleteTask: (id) => nodeApi.delete(`/tasks/${id}/delete`),
  updateTaskStatus: (id, status) => nodeApi.patch(`/tasks/${id}/status`, { status }),
  exportTasksCSV: () => nodeApi.get("/tasks/export/csv"),
};

// Category-relayed API calls
export const categoryAPI = {
  getAllCategories: () => nodeApi.get("/category"),
  getCategoryById: (id) => nodeApi.get(`/category/${id}`),
  createCategory: (categoryData) => nodeApi.post("/category", categoryData),
  updateCategory: (id, categoryData) => nodeApi.put(`/category/${id}/update`, categoryData),
  deleteCategory: (id) => nodeApi.delete(`/category/${id}/delete`),
};

// User-related API calls
export const userAPI = {
  login: (credentials) => nodeApi.post("/auth/login", credentials),
  register: (userData) => nodeApi.post("/auth/register", userData),
  getProfile: () => nodeApi.get("/user/profile"),
  updateProfile: (profileData) => nodeApi.put("/user/profile", profileData),
  changePassword: (passwordData) => nodeApi.post("/user/change-password", passwordData),
  deleteAccount: () => nodeApi.delete("/user/delete-account"),
  toggleDarkMode: () => nodeApi.patch("/user/toggle-mode"),
};

export default nodeApi;