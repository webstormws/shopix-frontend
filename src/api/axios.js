import axios from "axios";

// Django backend manzili — .env orqali ham berish mumkin
export const BASE_URL = import.meta.env.VITE_API_URL || "https://hearty-learning-production-d991.up.railway.app/api";
export const MEDIA_URL = BASE_URL.replace(/\/api\/?$/, "/");

const api = axios.create({ baseURL: BASE_URL });

// Har bir so'rovga tokenni avtomatik qo'shib boradi
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("access_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Token muddati tugasa (401), refresh token bilan avtomatik yangilaydi
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const refresh = localStorage.getItem("refresh_token");
      if (refresh) {
        try {
          const { data } = await axios.post(`${BASE_URL}/accounts/login/refresh/`, { refresh });
          localStorage.setItem("access_token", data.access);
          originalRequest.headers.Authorization = `Bearer ${data.access}`;
          return api(originalRequest);
        } catch (e) {
          localStorage.removeItem("access_token");
          localStorage.removeItem("refresh_token");
          window.location.href = "/login";
        }
      }
    }
    return Promise.reject(error);
  }
);

export default api;
