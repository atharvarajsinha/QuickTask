import axios from "axios";

const analyticsApi = axios.create({
  baseURL: import.meta.env.VITE_ANALYTICS_API_URL,
});

analyticsApi.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) req.headers.Authorization = `Bearer ${token}`;
  return req;
});

// Analytics API calls
export const analyticsAPI = {
  getUserStats: async (startDate, endDate) => {
    const params = new URLSearchParams();
    if (startDate) params.append("start_date", startDate);
    if (endDate) params.append("end_date", endDate);

    const queryString = params.toString() ? `?${params.toString()}` : "";
    const response = await analyticsApi.get(`/analytics/stats/${queryString}`);
    return response;
  },
  getProductivityAnalytics: async (days = 7) => {
    const response = await analyticsApi.get(
      `/analytics/productivity?days=${days}`,
    );
    return response;
  },
  getPublicStats: () => analyticsApi.get("/analytics/public-stats/"),
};

export default analyticsApi;