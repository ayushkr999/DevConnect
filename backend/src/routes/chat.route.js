import express from "express"
import { isLoggedIn } from "../middlewares/auth.middleware.js";
import Chat from "../models/chat.js";

const chatRouter = express.Router();

chatRouter.get("/chat/:targetUserId",isLoggedIn, async (req, res) => {
 const { targetUserId } = req.params;
  const userId = req.user._id;

  try {
    let chat =await Chat.findOne({
      participants: { $all: [userId, targetUserId] },
    }).populate({
      path: "messages.senderId",
     select: "firstname lastname",
    });

    if (!chat) {
      chat = new Chat({
        participants: [userId, targetUserId],
        messages: [],
      });
      await chat.save();
    }
    res.json(chat)
  } catch (err) {
    console.error(err);
  }
});

export default chatRouter