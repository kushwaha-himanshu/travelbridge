import User from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const generateAccessAndRefreshToken=async (userId)=>{
try {
  
  const user=await User.findById(userId);
  //small check for userr
  const accessToken=user.generateAccessToken()
  const refreshToken=user.generateRefreshToken()
  user.refreshToken=refreshToken
  await user.save({validateBeforeSave:false})
  return {accessToken,refreshToken}
  
} catch (error) {
  console.error("Error generating tokens:",error);
  throw new Error("Error generating tokens");
}
}
export const register = async (req, res) => {
const {fullname,email,password}=req.body;
if(!fullname||!email||!password){
    return res.status(400).json({message:"All fields are required"});
 
}
const existingUser=await User.findOne({
  email:email
})
if(existingUser){
  throw new Error("User with this email already exists");
}
//create user
try{
  
  const user=await User.create({
    fullname,
    email,
    password
  })
  const {accessToken,refreshToken}=await generateAccessAndRefreshToken(user._id);
  res.cookie("accessToken",accessToken,{httpOnly:true,secure:false,sameSite:"lax"});
  res.cookie("refreshToken",refreshToken,{httpOnly:true,secure:false,sameSite:"lax"});
  return res.status(200).json({
    message:"User registered successfully",
    user:{
      id:user._id,
      fullname:user.fullname,
      email:user.email,
      accessToken,
      refreshToken
    }
  });


}catch(err){
  console.error("Error creating user:",err);
  throw new Error("Error creating user");
}

}




export const login =async (req , res) =>{

  try {

    const {email, password } = req.body;
    if (!email || !password) {
      throw new Error("Email and password are required");}

    const user= await User.findOne({
      email:email
    })

    if(!user){
      return res.status(404).json({message:"Invalid Credential"})
    }
    const isValidPassword= await user.isPasswordCorrect(password);

    if(!isValidPassword){
       return res.status(400).json({message:"invalid Credential"})
    }
    const {accessToken,refreshToken}=await generateAccessAndRefreshToken(user._id);
    const userData=await User.findById(user._id).select("-password -refreshToken");
    if(!userData){
      return res.status(404).json({message:"User not found"})
    }
    res.cookie("accessToken",accessToken,{httpOnly:true,secure:false,sameSite:"lax"});
    res.cookie("refreshToken",refreshToken,{httpOnly:true,secure:false,sameSite:"lax"});

return res.status(200).json({
  message:"Login successful",
  user:userData,
  accessToken,
  refreshToken
})
   


    
    
  }catch (error) {

    console.error(error);

    res.status(500).json({
      message: "Server error"
    });

  }
}

export const googleAuth=async(req,res)=>{
  try{
     const {fullname,email}=req.body;
     let user=await User.findOne({email:email});
     if(!user){
      user=await User.create({fullname,email,authProvider:"google"});
     }
      const {accessToken,refreshToken}=await generateAccessAndRefreshToken(user._id);
      res.cookie("accessToken",accessToken,{httpOnly:true,secure:false,sameSite:"lax"});
      res.cookie("refreshToken",refreshToken,{httpOnly:true,secure:false,sameSite:"lax"});
      return res.status(200).json({
        message:"Google Authentication successful",
        user:{
          id:user._id,
          fullname:user.fullname,
          authProvider:user.authProvider,
          email:user.email,
          accessToken,
          refreshToken
        }
      });

  }catch(err){
    console.error("Google Authentication error:",err);
    return res.status(500).json({message:"Server error during Google Authentication"});
  }
}
 
export const logout=async(req,res)=>{
  try{
   const user=await User.findByIdAndUpdate(
    req.user._id,
    {
      $set:{
        refreshToken:"",
      }
    },
    {new:true}
  )
  console.log("User logged out successfully", user);
res.clearCookie("accessToken",{httpOnly:true,secure:false,sameSite:"lax"});
res.clearCookie("refreshToken",{httpOnly:true,secure:false,sameSite:"lax"});
return res.status(200).json({message:"Logout successful"});
  }catch(err){
    console.error("Logout error:",err);
    return res.status(500).json({message:"Server error during logout"});
  }
}