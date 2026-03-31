import User from "../models/user.model.js";
import  ConnectionRequest from "../models/connectionRequest.model.js" 
import mongoose from "mongoose";

const sendConnectionRequest = async (req, res) => {
  try {
    const fromUserId = req.user._id;
    const { toUserId, status } = req.params;

    //  Validate status
    const allowedStatus = ["ignored", "interested"];
    if (!allowedStatus.includes(status)) {
      return res.status(400).json({
        message: "Invalid status"
      });
    }
    //  Prevent self request
    if (fromUserId.toString() === toUserId) {
      return res.status(400).json({
        message: "You cannot send request to yourself"
      });
    }
    //  Check target user exists
    const user = await User.findById(toUserId);
    if (!user) {
      return res.status(404).json({
        message: "User not found"
      });
    }
    //  Check existing connection request (both directions)
    const existingConnectionRequest = await ConnectionRequest.findOne({
      $or: [
        { fromUserId, toUserId },
        { fromUserId: toUserId, toUserId: fromUserId }
      ]
    });

    if (existingConnectionRequest) {
      return res.status(409).json({
        message: "Connection request already exists"
      });
    }
    //  Create new connection request
    const connectionRequest = await ConnectionRequest.create({
      fromUserId,
      toUserId,
      status
    });

   const message =
     status === "interested"
     ? "Connection request sent successfully"
    : "User ignored successfully";

    return res.status(201).json({
     message,
     data: connectionRequest
});

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Internal server error"
    });
  }
};


const reviewConnectionRequest=async(req,res)=>{
  try{
  const {status,requestId}=req.params;
  const userId=req.user._id;

  if (!mongoose.Types.ObjectId.isValid(requestId)) {
  return res.status(400).json({ message: "Invalid request ID" });
}

  const allowedStatus=["accepted","rejected"]
  if(!allowedStatus.includes(status)){
    return res.status(400).json({
      message:"Status not valid"
    })
  }
  const connectionRequest=await ConnectionRequest.findOne({
    _id:requestId,
    toUserId:userId,
    status:"interested"
  })
  if(!connectionRequest){
    return res.status(404).json({
      message:"Connection request not found"
    })
  }
  connectionRequest.status=status;
  const data=await connectionRequest.save();
  return res.json({
      message: `Connection request ${status}`,
    })
  } catch (error) {
    console.log(error.message)
    return res.status(500).json({
      message: "Server error",
    });
  }
}

export { sendConnectionRequest,reviewConnectionRequest}
