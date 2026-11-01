import { io } from "socket.io-client";

const rawBackendUrl = import.meta.env?.VITE_BACKEND_URL || "http://localhost:5000";
const backendUrl = rawBackendUrl.replace(/\/+$/, "");

const socketAPI = io(backendUrl, {
  withCredentials: true,
  transports: ["websocket", "polling"],
  reconnectionAttempts: 5,
});

export default socketAPI;
