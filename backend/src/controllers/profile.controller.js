import User from "../models/user.model.js";

const profileView = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    return res.status(200).json({ success: true, user });
  } catch (err) {
    console.error("Profile view error:", err.message);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

const editProfile = async (req, res) => {
  try {
    const allowedFields = ["firstname", "lastname", "age", "gender", "skills", "photoUrl", "AboutUs"];
    const updates = {};

    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    });

    const updatedUser = await User.findByIdAndUpdate(req.user._id, updates, {
      returnDocument: "after",
      runValidators: true,
    }).select("-password");

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user: updatedUser,
    });
  } catch (err) {
    console.error("Profile edit error:", err.message);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

export { profileView, editProfile };