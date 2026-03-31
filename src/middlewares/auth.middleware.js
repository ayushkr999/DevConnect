import jwt from "jsonwebtoken"


export const isLoggedIn=async(req,res,next)=>{
    try{
        let token=req.cookies?.token
        if(!token){
            console.log("No Token")
            return res.status(401).send("Please Login!")
        }
        const decoded=jwt.verify(token,process.env.JWT_SECRET);
        req.user=decoded;
        next();

    }catch (error) {
  return res.status(401).json({
    success: false,
    message: "Invalid or expired token",
  });
}
}