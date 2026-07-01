import { Server } from "socket.io";
import crypto from "crypto";
import Chat from "../models/chat.js";

// Deterministic private room ID for any two users regardless of who initiates
const getSecretRoomId = (userId, targetUserId) =>
  crypto
    .createHash("sha256")
    .update([userId, targetUserId].sort().join("-"))
    .digest("hex");

const initializeSocket = (server) => {
  const allowedOrigins = process.env.ALLOWED_ORIGINS
    ? process.env.ALLOWED_ORIGINS.split(",").map((o) => o.trim())
    : ["http://localhost:5173"];

  const io = new Server(server, {
    cors: {
      origin: allowedOrigins,
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    // ── Join a private chat room ───────────────────────────────────────────
    socket.on("joinChat", ({ userId, targetUserId }) => {
      const roomId = getSecretRoomId(userId, targetUserId);
      socket.join(roomId);
    });

    // ── Send a message ────────────────────────────────────────────────────
    socket.on("sendMessage", async ({ firstname, userId, targetUserId, text }) => {
      const roomId = getSecretRoomId(userId, targetUserId);

      try {
        let chat = await Chat.findOne({
          participants: { $all: [userId, targetUserId] },
        });

        if (!chat) {
          chat = new Chat({ participants: [userId, targetUserId], messages: [] });
        }

        chat.messages.push({ senderId: userId, text });
        await chat.save();

        io.to(roomId).emit("messageReceived", {
          firstname,
          text,
          timestamp: new Date(),
        });
      } catch (err) {
        // Surface error back to the sender only
        socket.emit("messageError", { message: "Failed to send message" });
      }
    });

    // ── Disconnect ────────────────────────────────────────────────────────
    socket.on("disconnect", () => {
      // No-op — kept for clarity; socket rooms are cleaned up automatically
    });
  });
};

export default initializeSocket;