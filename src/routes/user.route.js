import express from "express"
const router=express.Router();
import { isLoggedIn } from "../middlewares/auth.middleware.js";
import { signup,login,logout } from "../controllers/auth.controller.js";
import { profileView ,editProfile} from "../controllers/profile.contoller.js";
import { sendConnectionRequest,reviewConnectionRequest } from "../controllers/request.controller.js";
import { getReceivedRequests,getConnectionRequest,getUserFeed } from "../controllers/user.view.controller.js";

router.post("/auth/signup",signup)
router.post("/auth/login",login)
router.post("/auth/logout",isLoggedIn,logout);


router.get("/profile/view",isLoggedIn,profileView)
router.patch("/profile/edit",isLoggedIn,editProfile)

router.post("/request/send/:status/:toUserId",isLoggedIn,sendConnectionRequest)
router.post("/request/review/:status/:requestId",isLoggedIn,reviewConnectionRequest)

router.get("/user/requests/received",isLoggedIn,getReceivedRequests)
router.get("/user/connections",isLoggedIn,getConnectionRequest)
router.get("/user/feed",isLoggedIn,getUserFeed)

export default router;