import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import connectDB from "./src/config/db.config.js";
import AuthRouter from "./src/routers/auth.route.js";
import UserRouter from "./src/routers/user.route.js";

import http from "http";
import { Server } from "socket.io";
import WebSocket from "./src/config/webSocket.js";

const app = express();

// Security: Disable X-Powered-By header
app.disable("x-powered-by");

// Middlewares
app.use(
  cors({
    origin: ["http://localhost:5173"],
    credentials: true,
  }),
);
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(morgan("dev"));

// Routes
app.use("/auth", AuthRouter);
app.use("/user", UserRouter);

import { emailServiceState } from "./src/config/email.config.js";

// Health check
app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok", timestamp: new Date().toISOString() });
});

app.get("/", (req, res) => {
  res.status(200).json({
    message: "Mingo Chat API is running 🚀",
    emailService: {
      isConfigured: emailServiceState.isConfigured,
      isReady: emailServiceState.isReady,
      mode: emailServiceState.isConfigured ? "Gmail SMTP" : "Development Simulator",
    },
  });
});

// Global error handler
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  console.error("❌ Error:", err);
  res.status(statusCode).json({ success: false, message });
});

const PORT = process.env.PORT || 5000;

const httpServer = http.createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: ["http://localhost:5173"],
    credentials: true,
    methods: ["GET", "POST"],
  },
});

WebSocket(io);

httpServer.on("error", (err) => {
  if (err.code === "EADDRINUSE") {
    console.error(`❌ Port ${PORT} is busy. Please close other running instances.`);
  } else {
    console.error("❌ Server error:", err);
  }
});

httpServer.listen(PORT, async () => {
  await connectDB();
  console.log(`✨ Mingo Server started at port: ${PORT}`);
});
