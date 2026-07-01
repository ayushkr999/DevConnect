import { Server } from "socket.io";
import crypto from "crypto"
import { timeStamp } from "console";
import Chat from "../models/chat.js";

const getSecretRoomId=(userId,targetUserId)=>{
    return crypto
    .createHash("sha256")
    .update([userId,targetUserId].sort().join("-"))
    .digest("hex")
}

const initializeSocket = (server) => {
const io = new Server(server, {
  cors: {
    origin: [
      "http://localhost:5173",
      "https://dev-connect-liart.vercel.app",
    ],
    credentials: true,
  },
});

  io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

 socket.on("joinChat", ({ firstname, userId, targetUserId }) => {
  const roomId = getSecretRoomId(userId, targetUserId);

  console.log("firstname:", firstname);
  console.log("userId:", userId);
  console.log("targetUserId:", targetUserId);
  console.log("roomId:", roomId);

  socket.join(roomId);
});


    // Send message
   socket.on(
  "sendMessage",
  async ({ firstname, userId, targetUserId, text }) => {
    const roomId = getSecretRoomId(userId, targetUserId);

    try {
      let chat = await Chat.findOne({
        participants: { $all: [userId, targetUserId] },
      });

      if (!chat) {
        chat = new Chat({
          participants: [userId, targetUserId],
          messages: [],
        });
      }

      chat.messages.push({
        senderId: userId,
        text,
      });

      await chat.save();

      io.to(roomId).emit("messageReceived", {
        firstname,
        text,
        timestamp: new Date(),
      });

    } catch (err) {
      console.log(err);
    }
  }
);


    // Disconnect
    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);
    });
  });
};

export default initializeSocket;






   