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

// ===================== CORS =====================

const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(",").map((origin) => origin.trim())
  : ["http://localhost:5173"];

console.log("Allowed Origins:", allowedOrigins);

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);

// ===================== Middleware =====================

app.use(express.json());
app.use(cookieParser());

// ===================== Health Check =====================

app.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Server is running",
  });
});

// ===================== Database =====================

dbConnect();

// ===================== HTTP + Socket =====================

const server = http.createServer(app);

initializeSocket(server);

// ===================== Routes =====================

app.use("/api/auth", authRoutes);
app.use("/api", profileRoutes);
app.use("/api", connectionRequestRouter);
app.use("/api", networkRoutes);
app.use("/api", chatRoutes);

// ===================== Error Handler =====================

app.use((err, req, res, next) => {
  console.error(err);

  res.status(500).json({
    success: false,
    message: "Internal Server Error",
  });
});

// ===================== Start Server =====================

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});