import User from "../models/user.model.js";

const signup=async(req,res)=>{
    const {firstname,lastname,email,password}=req.body;

    if(!firstname || !lastname || !email || !password) {
         return res.status(400).json({ message: "All fields are required" });
    }

 try{
  const existingUser=await User.findOne({email})
  if(existingUser){
    return res.status(409).json({
        message:"User already registered"
    })
  }

  const user=await User.create({
     firstname,
     lastname,
     email,
     password,
  })

   const token=await user.generateAuthToken();

     const cookieOptions = {
      httpOnly: true,
      secure: true,
      maxAge: 24 * 60 * 60 * 1000,
    };
    res.cookie("token", token, cookieOptions);

       return res.status(201).json({
      success: true,
      user,
      message: "User registered successfully",
    });

   
  }catch(err){
    console.log('Error in signup:', err)
    return res.status(500).json({
        message: "User not registered : ",
        err,
        success: false,
    })
}
}

const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      message: "All fields are required",
    });
  }

  try {
    const user = await User.findOne({ email }).select("+password");

     if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const isPasswordValid = await user.validatePassword(password);

     if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }


    const token = await user.generateAuthToken();

    const cookieOptions = {
      httpOnly: true,
      secure: true,
      maxAge: 24 * 60 * 60 * 1000,
    };

    res.cookie("token", token, cookieOptions);

    user.password = undefined;

    return res.status(200).json({
      success: true,
      user,
    });

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

const logout = async (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: true,
  });

  return res.status(200).json({
    success: true,
    message: "User logged out successfully",
  });
};


export {signup,login,logout}