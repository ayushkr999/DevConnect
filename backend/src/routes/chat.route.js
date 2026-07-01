import express from "express";
import { isLoggedIn } from "../middlewares/auth.middleware.js";
import Chat from "../models/chat.js";

const chatRouter = express.Router();

chatRouter.get("/chat/:targetUserId", isLoggedIn, async (req, res) => {
  const { targetUserId } = req.params;
  const userId = req.user._id;

  try {
    let chat = await Chat.findOne({
      participants: { $all: [userId, targetUserId] },
    }).populate({
      path: "messages.senderId",
      select: "firstname lastname",
    });

    if (!chat) {
      chat = new Chat({ participants: [userId, targetUserId], messages: [] });
      await chat.save();
    }

    res.status(200).json(chat);
  } catch (err) {
    console.error("Fetch chat error:", err.message);
    res.status(500).json({ success: false, message: "Failed to fetch chat" });
  }
});

export default chatRouter;