import express from "express";
const router=express.Router();

import { getConnectionRequest, getReceivedRequests,getUserFeed } from "../controllers/user.view.controller.js";
import { isLoggedIn } from "../middlewares/auth.middleware.js";

router.get("/user/requests/received",isLoggedIn,getReceivedRequests)
router.get("/user/connections",isLoggedIn,getConnectionRequest)
router.get("/user/feed",isLoggedIn,getUserFeed)

export default router;