import ConnectionRequest from "../models/connectionRequest.model.js";
import User from "../models/user.model.js"


// Fetches all pending connection requests received by the logged-in user a
const getReceivedRequests = async (req, res) => {
  try {
    const loggedUser = req.user;

    const connectionRequests = await ConnectionRequest.find({
      toUserId: loggedUser._id, 
      status: "interested" 
    }).populate("fromUserId", ["firstname", "lastname", "skills","age","photoUrl","AboutUs"]);

    res.status(200).json({
      success: true,
      message: "Data fetched successfully",
      data: connectionRequests
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};

// This function fetches all accepted connections of the logged-in user, 
// whether the user sent or received the request, and returns an array of the other user’s info.
const getConnectionRequest=async(req,res)=>{
    try{
        const loggedUser=req.user;

        const connectionRequests=await ConnectionRequest.find({
            $or:[
                {toUserId:loggedUser._id, status:"accepted"},
                {fromUserId:loggedUser._id, status:"accepted"}
            ]
        })
        .populate("fromUserId", ["firstname", "lastname", "skills","photoUrl","AboutUs","age","gender"])
        .populate("toUserId", ["firstname", "lastname", "skills","photoUrl","AboutUs","age","gender"]);

     const data=connectionRequests.map((row)=> {
        if(row.fromUserId._id.toString()===loggedUser._id.toString()){
            return row.toUserId;
        }
        return row.fromUserId
     })
     res.status(200).json({
      success: true,
      data
    });

     } catch (err) {
    console.error(err.message);
    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
}


const getUserFeed = async (req, res) => {
  try {
    const loggedUser= req.user._id;
  
    const page=parseInt(req.query.page)||1;
    let limit =parseInt(req.query.limit)|| 10;
    limit=limit>50 ? 50 : limit;
    const skip=(page-1)*limit;

    // 1. Find all interactions (sent + received)
    const connectionRequests = await ConnectionRequest.find({
      $or: [
        { fromUserId: loggedUser },
        { toUserId: loggedUser }
      ]
    }).select("fromUserId toUserId");

    // 2. Collect users to hide
    const hideUsersFromFeed = new Set();

    connectionRequests.forEach((connection) => {
      hideUsersFromFeed.add(connection.fromUserId.toString());
      hideUsersFromFeed.add(connection.toUserId.toString());
    });

    // 3. Fetch users not interacted with
    const users = await User.find({
      $and:[ {_id: {$nin : Array.from(hideUsersFromFeed)}}, {_id: {$ne: loggedUser} } ]
    }).select("-password -email -createdAt -updatedAt").skip(skip).limit(limit);

    res.status(200).json({
      success: true,
      count: users.length,
      data: users
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch user feed",
      error: err.message
    });
  }
};

export {getReceivedRequests,getConnectionRequest,getUserFeed}


