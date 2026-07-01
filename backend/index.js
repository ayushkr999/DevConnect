import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import http from "http";

import dbConnect from "./src/config/db.js";
import authRoutes from "./src/routes/auth.route.js";
import profileRoutes from "./src/routes/profile.route.js";
import connectionRequestRouter from "./src/routes/connectionRequest.routes.js";
import networkRoutes from "./src/routes/network.routes.js";
import chatRoutes from "./src/routes/chat.route.js";
import initializeSocket from "./src/config/socket.js";

dotenv.config();

const app = express();

// ── CORS ──────────────────────────────────────────────────────────────────────
// Parse comma-separated origins from ALLOWED_ORIGINS env var.
const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(",").map((o) => o.trim())
  : ["http://localhost:5173"];

console.log("Allowed origins:", allowedOrigins);

const corsOptions = {
  origin: allowedOrigins,
  credentials: true,
};

// Handle preflight OPTIONS requests for ALL routes
app.options("*", cors(corsOptions));

// Apply CORS to all routes
app.use(cors(corsOptions));

// ── Body / Cookie parsers ─────────────────────────────────────────────────────
app.use(express.json());
app.use(cookieParser());

// ── Health-check route (Render pings this to confirm the server is up) ────────
app.get("/health", (_req, res) => res.status(200).json({ status: "ok" }));

// ── Database ──────────────────────────────────────────────────────────────────
dbConnect();

// ── HTTP server + Socket.IO ───────────────────────────────────────────────────
const server = http.createServer(app);
initializeSocket(server);

// ── API Routes ────────────────────────────────────────────────────────────────
app.use("/api/auth", authRoutes);
app.use("/api", profileRoutes);
app.use("/api", connectionRequestRouter);
app.use("/api", networkRoutes);
app.use("/api", chatRoutes);

// ── Global error handler ──────────────────────────────────────────────────────
app.use((err, _req, res, _next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, message: "Internal server error" });
});

// ── Start ─────────────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server is listening at port ${PORT}`);
});