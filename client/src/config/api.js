import axios from "axios";

const defaultBackendUrl =
  import.meta.env?.MODE === "production"
    ? "https://mingo-chatapp-1.onrender.com"
    : "http://localhost:5000";

const rawBackendUrl = import.meta.env?.VITE_BACKEND_URL || defaultBackendUrl;
const baseURL = rawBackendUrl.replace(/\/+$/, "");

const api = axios.create({
  baseURL,
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token =
      sessionStorage.getItem("token") || localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

export default api;
