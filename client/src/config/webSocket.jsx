import { io } from "socket.io-client";

const defaultBackendUrl =
  import.meta.env?.MODE === "production"
    ? "https://mingo-chatapp-1.onrender.com"
    : "http://localhost:5000";

const rawBackendUrl = import.meta.env?.VITE_BACKEND_URL || defaultBackendUrl;
const backendUrl = rawBackendUrl.replace(/\/+$/, "");

const socketAPI = io(backendUrl, {
  withCredentials: true,
  transports: ["websocket", "polling"],
  reconnectionAttempts: 5,
});

export default socketAPI;
