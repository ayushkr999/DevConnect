import express from "express";
const router=express.Router();

import { isLoggedIn } from "../middlewares/auth.middleware.js";
import { sendConnectionRequest, reviewConnectionRequest} from "../controllers/request.controller.js";

router.post("/request/send/:status/:toUserId",isLoggedIn,sendConnectionRequest);
router.post("/request/review/:status/:requestId",isLoggedIn,reviewConnectionRequest);


export default router;



