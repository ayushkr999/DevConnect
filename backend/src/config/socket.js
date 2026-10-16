import { Server } from "socket.io";
import crypto from "crypto";
import Chat from "../models/chat.js";
import ConnectionRequest from "../models/connectionRequest.model.js";

// Deterministic private room ID for any two users regardless of who initiates
const getSecretRoomId = (userId, targetUserId) =>
  crypto
    .createHash("sha256")
    .update([userId.toString(), targetUserId.toString()].sort().join("-"))
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

  // Track online users: userId -> Set of socketIds
  const onlineUsers = new Map();

  io.on("connection", (socket) => {
    // ── User presence registration ─────────────────────────────────────────
    socket.on("registerUser", (userId) => {
      if (!userId) return;
      const uId = userId.toString();
      socket.userId = uId;

      if (!onlineUsers.has(uId)) {
        onlineUsers.set(uId, new Set());
      }
      onlineUsers.get(uId).add(socket.id);

      // Send the current list of online user IDs to this client
      socket.emit("onlineUsersList", Array.from(onlineUsers.keys()));

      // Broadcast to others that this user came online
      socket.broadcast.emit("userStatusChange", {
        userId: uId,
        status: "online",
      });
    });

    socket.on("getOnlineUsers", () => {
      socket.emit("onlineUsersList", Array.from(onlineUsers.keys()));
    });

    // ── Join a private chat room ───────────────────────────────────────────
    socket.on("joinChat", ({ userId, targetUserId }) => {
      if (!userId || !targetUserId) return;
      const uId = userId.toString();
      socket.userId = uId;

      if (!onlineUsers.has(uId)) {
        onlineUsers.set(uId, new Set());
      }
      onlineUsers.get(uId).add(socket.id);

      const roomId = getSecretRoomId(userId, targetUserId);
      socket.join(roomId);
    });

    // ── Send a message ────────────────────────────────────────────────────
    socket.on("sendMessage", async ({ firstname, userId, targetUserId, text }) => {
      if (!userId || !targetUserId || !text || !text.trim()) return;

      try {
        // Authorization: Check if users are connected
        const isConnected = await ConnectionRequest.findOne({
          $or: [
            { fromUserId: userId, toUserId: targetUserId, status: "accepted" },
            { fromUserId: targetUserId, toUserId: userId, status: "accepted" },
          ],
        });

        if (!isConnected) {
          socket.emit("messageError", {
            message: "You can only message established connections",
          });
          return;
        }

        const roomId = getSecretRoomId(userId, targetUserId);

        let chat = await Chat.findOne({
          participants: { $all: [userId, targetUserId] },
        });

        if (!chat) {
          chat = new Chat({ participants: [userId, targetUserId], messages: [] });
        }

        const newMessage = {
          senderId: userId,
          text: text.trim(),
        };

        chat.messages.push(newMessage);
        await chat.save();

        const savedMsg = chat.messages[chat.messages.length - 1];

        io.to(roomId).emit("messageReceived", {
          _id: savedMsg?._id,
          senderId: userId,
          firstname,
          text: text.trim(),
          createdAt: savedMsg?.createdAt || new Date(),
        });
      } catch (err) {
        console.error("Socket sendMessage error:", err.message);
        socket.emit("messageError", { message: "Failed to send message" });
      }
    });

    // ── Disconnect ────────────────────────────────────────────────────────
    socket.on("disconnect", () => {
      if (socket.userId && onlineUsers.has(socket.userId)) {
        const userSockets = onlineUsers.get(socket.userId);
        userSockets.delete(socket.id);

        if (userSockets.size === 0) {
          onlineUsers.delete(socket.userId);
          io.emit("userStatusChange", {
            userId: socket.userId,
            status: "offline",
          });
        }
      }
    });
  });
};

export default initializeSocket;