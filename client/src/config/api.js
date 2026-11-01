import axios from "axios";

const rawBackendUrl = import.meta.env?.VITE_BACKEND_URL || "http://localhost:5000";
const baseURL = rawBackendUrl.replace(/\/+$/, "");

const api = axios.create({
  baseURL,
  withCredentials: true,
});

export default api;
