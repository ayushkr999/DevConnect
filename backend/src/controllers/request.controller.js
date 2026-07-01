import User from "../models/user.model.js";
import ConnectionRequest from "../models/connectionRequest.model.js";
import mongoose from "mongoose";

const sendConnectionRequest = async (req, res) => {
  try {
    const fromUserId = req.user._id;
    const { toUserId, status } = req.params;

    const allowedStatus = ["ignored", "interested"];
    if (!allowedStatus.includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    if (fromUserId.toString() === toUserId) {
      return res.status(400).json({ message: "You cannot send a request to yourself" });
    }

    const user = await User.findById(toUserId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const existingConnectionRequest = await ConnectionRequest.findOne({
      $or: [
        { fromUserId, toUserId },
        { fromUserId: toUserId, toUserId: fromUserId },
      ],
    });

    if (existingConnectionRequest) {
      return res.status(409).json({ message: "Connection request already exists" });
    }

    const connectionRequest = await ConnectionRequest.create({ fromUserId, toUserId, status });

    const message =
      status === "interested"
        ? "Connection request sent successfully"
        : "User ignored successfully";

    return res.status(201).json({ message, data: connectionRequest });
  } catch (error) {
    console.error("Send connection request error:", error.message);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const reviewConnectionRequest = async (req, res) => {
  try {
    const { status, requestId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(requestId)) {
      return res.status(400).json({ message: "Invalid request ID" });
    }

    const allowedStatus = ["accepted", "rejected"];
    if (!allowedStatus.includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const connectionRequest = await ConnectionRequest.findOne({
      _id: requestId,
      toUserId: req.user._id,
      status: "interested",
    });

    if (!connectionRequest) {
      return res.status(404).json({ message: "Connection request not found" });
    }

    connectionRequest.status = status;
    await connectionRequest.save();

    return res.json({ message: `Connection request ${status}` });
  } catch (error) {
    console.error("Review connection request error:", error.message);
    return res.status(500).json({ message: "Server error" });
  }
};

export { sendConnectionRequest, reviewConnectionRequest };
