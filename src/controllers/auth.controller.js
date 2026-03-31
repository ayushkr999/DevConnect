import User from "../models/user.model.js"

const signup=async(req,res)=>{
    const {
     firstname,
     lastname,
     email,
     password,
     age,
     gender
    }=req.body;

    if (!firstname || !lastname || !email || !password) {
    return res.status(400).json({
      message: "All required fields must be filled"
    });
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
     age,
     gender
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

const login=async(req,res)=>{
  const {email,password}=req.body;

  if(!email || !password){
    return res.status(400).json({
      message:"All required fields must be filled "
    })
  }

  try{
      const user = await User.findOne({ email }).select("+password");
    if(!user){
      return res.status(401).json({
        message:"You are not registered"
      })
    }

    const isPasswordValid=await user.validatePassword(password);

     if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const token=await user.generateAuthToken();
     const cookieOptions = {
      httpOnly: true,
      secure: true,
      maxAge: 24 * 60 * 60 * 1000,
    };
    res.cookie("token", token, cookieOptions);

   res.send(user)
  } catch (error) {
  console.error(error);
  res.status(500).json({
    success: false,
    message: "Server error",
  });
}
}

// logout
const logout=async(req,res)=>{
  res.cookie("token",null,{
    expires : new Date(Date.now())
  })
 return res.status(200).json({
    success: true,
    message: "User logged out successfully"
})
}

export {signup,login,logout}