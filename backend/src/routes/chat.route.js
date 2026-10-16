import express from "express";
import mongoose from "mongoose";
import { isLoggedIn } from "../middlewares/auth.middleware.js";
import Chat from "../models/chat.js";
import ConnectionRequest from "../models/connectionRequest.model.js";
import User from "../models/user.model.js";

const chatRouter = express.Router();

// GET recent conversations for logged-in user
chatRouter.get("/chat/recent/conversations", isLoggedIn, async (req, res) => {
  const userId = req.user._id;

  try {
    const chats = await Chat.find({
      participants: userId,
    })
      .populate("participants", "firstname lastname photoUrl AboutUs skills age gender")
      .populate({
        path: "messages.senderId",
        select: "firstname lastname photoUrl",
      })
      .sort({ updatedAt: -1 });

    const conversations = chats.map((chat) => {
      const otherParticipant = chat.participants.find(
        (p) => p && p._id.toString() !== userId.toString()
      );
      const lastMessage =
        chat.messages && chat.messages.length > 0
          ? chat.messages[chat.messages.length - 1]
          : null;

      return {
        chatId: chat._id,
        targetUser: otherParticipant,
        lastMessage: lastMessage
          ? {
              text: lastMessage.text,
              senderId: lastMessage.senderId?._id || lastMessage.senderId,
              createdAt: lastMessage.createdAt,
            }
          : null,
        updatedAt: chat.updatedAt || (lastMessage ? lastMessage.createdAt : null),
      };
    });

    res.status(200).json({ success: true, conversations });
  } catch (err) {
    console.error("Fetch conversations error:", err.message);
    res.status(500).json({ success: false, message: "Failed to fetch conversations" });
  }
});

// GET conversation with target user
chatRouter.get("/chat/:targetUserId", isLoggedIn, async (req, res) => {
  const { targetUserId } = req.params;
  const userId = req.user._id;

  if (!mongoose.Types.ObjectId.isValid(targetUserId)) {
    return res.status(400).json({ success: false, message: "Invalid user ID" });
  }

  try {
    // Authorization: Verify users have an accepted connection
    const isConnected = await ConnectionRequest.findOne({
      $or: [
        { fromUserId: userId, toUserId: targetUserId, status: "accepted" },
        { fromUserId: targetUserId, toUserId: userId, status: "accepted" },
      ],
    });

    if (!isConnected) {
      return res.status(403).json({
        success: false,
        message: "You can only chat with established connections",
      });
    }

    // Fetch target user info
    const targetUser = await User.findById(targetUserId).select(
      "firstname lastname photoUrl AboutUs skills age gender"
    );

    if (!targetUser) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    let chat = await Chat.findOne({
      participants: { $all: [userId, targetUserId] },
    }).populate({
      path: "messages.senderId",
      select: "firstname lastname photoUrl",
    });

    if (!chat) {
      chat = new Chat({ participants: [userId, targetUserId], messages: [] });
      await chat.save();
    }

    res.status(200).json({
      success: true,
      _id: chat._id,
      participants: chat.participants,
      messages: chat.messages,
      targetUser,
    });
  } catch (err) {
    console.error("Fetch chat error:", err.message);
    res.status(500).json({ success: false, message: "Failed to fetch chat" });
  }
});

export default chatRouter;