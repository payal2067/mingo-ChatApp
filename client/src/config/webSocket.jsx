import { io } from "socket.io-client";

const socketAPI = io(import.meta.env?.VITE_BACKEND_URL || "http://localhost:5000", {
  withCredentials: true,
});

export default socketAPI;
