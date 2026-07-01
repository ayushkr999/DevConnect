import ConnectionRequest from "../models/connectionRequest.model.js";
import User from "../models/user.model.js";

// Received connection requests (pending/interested)
const getReceivedRequests = async (req, res) => {
  try {
    const connectionRequests = await ConnectionRequest.find({
      toUserId: req.user._id,
      status: "interested",
    }).populate("fromUserId", ["firstname", "lastname", "skills", "age", "photoUrl", "AboutUs"]);

    res.status(200).json({
      success: true,
      message: "Data fetched successfully",
      data: connectionRequests,
    });
  } catch (err) {
    console.error("Get received requests error:", err.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Accepted connections
const getConnectionRequest = async (req, res) => {
  try {
    const loggedUser = req.user;

    const connectionRequests = await ConnectionRequest.find({
      $or: [
        { toUserId: loggedUser._id, status: "accepted" },
        { fromUserId: loggedUser._id, status: "accepted" },
      ],
    })
      .populate("fromUserId", ["firstname", "lastname", "skills", "photoUrl", "AboutUs", "age", "gender"])
      .populate("toUserId", ["firstname", "lastname", "skills", "photoUrl", "AboutUs", "age", "gender"]);

    const data = connectionRequests.map((row) =>
      row.fromUserId._id.toString() === loggedUser._id.toString()
        ? row.toUserId
        : row.fromUserId
    );

    res.status(200).json({ success: true, data });
  } catch (err) {
    console.error("Get connections error:", err.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Feed — users not yet interacted with
const getUserFeed = async (req, res) => {
  try {
    const loggedUser = req.user._id;

    const page = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit) || 10;
    limit = limit > 50 ? 50 : limit;
    const skip = (page - 1) * limit;

    const connectionRequests = await ConnectionRequest.find({
      $or: [{ fromUserId: loggedUser }, { toUserId: loggedUser }],
    }).select("fromUserId toUserId");

    const hideUsersFromFeed = new Set();
    connectionRequests.forEach((connection) => {
      hideUsersFromFeed.add(connection.fromUserId.toString());
      hideUsersFromFeed.add(connection.toUserId.toString());
    });

    const users = await User.find({
      $and: [
        { _id: { $nin: Array.from(hideUsersFromFeed) } },
        { _id: { $ne: loggedUser } },
      ],
    })
      .select("-password -email -createdAt -updatedAt")
      .skip(skip)
      .limit(limit);

    res.status(200).json({ success: true, count: users.length, data: users });
  } catch (err) {
    console.error("Get user feed error:", err.message);
    res.status(500).json({ success: false, message: "Failed to fetch user feed" });
  }
};

export { getReceivedRequests, getConnectionRequest, getUserFeed };