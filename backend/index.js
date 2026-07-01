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
import chatRoutes from "./src/routes/chat.route.js"
import initializeSocket from "./src/config/socket.js";

dotenv.config();

const app = express();

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://dev-connect-liart.vercel.app",
    ],
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());

dbConnect();

const server = http.createServer(app);

initializeSocket(server);

app.use("/api/auth", authRoutes);
app.use("/api", profileRoutes);
app.use("/api", connectionRequestRouter);
app.use("/api", networkRoutes);
app.use("/api",chatRoutes)

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server is listening at port ${PORT}`);
});