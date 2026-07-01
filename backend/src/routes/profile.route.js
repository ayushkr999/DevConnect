import express from "express";
import { profileView,editProfile } from "../controllers/profile.controller.js";
import { isLoggedIn } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.get("/profile/view", isLoggedIn, profileView);
router.patch("/profile/edit",isLoggedIn,editProfile)

export default router;