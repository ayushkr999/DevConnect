import User from "../models/user.model.js"
import mongoose from "mongoose";

const profileView = async (req, res) => {
  try {
    const userId = req.user._id;

    const user = await User.findById(userId).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      user,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

const editProfile = async (req, res) => {
  try {
    const userId = req.user._id; // logged-in user
  
    // Only allow these fields to be updated
    const allowedFields = ["firstname", "lastname", "age", "gender","skills","photoUrl","AboutUs"];
    const updates = {};

    allowedFields.forEach(field => {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    });

    // Update the user in the DB
    const updatedUser = await User.findByIdAndUpdate(userId, updates, {
      new: true, // return the updated document
      runValidators: true, // ensure schema validations
    }).select("-password"); 

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user: updatedUser,
    });
  } catch (err) {
    console.error(err.message);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

export {profileView,editProfile}