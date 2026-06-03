import jwt from "jsonwebtoken";
import  User  from "../models/user.js";
import bcrypt from "bcrypt";


// export const authMiddleware = async (req, res, next) => {

//     // const authHeader = req.headers.authorization;

//     // // Check token exists
//     // if (!authHeader || !authHeader.startsWith('Bearer ')) {

//     //     return res.status(401).json({
//     //         message: 'Unauthorized'
//     //     });

//     // }

//     // try {

//     //     // Extract token
//     //     const token = authHeader.split(' ')[1];

//     //     // Verify token
//     //     const decoded = jwt.verify(
//     //         token,
//     //         process.env.JWT_SECRET
//     //     );

//     //     // Store user data in request
//     //     req.user = decoded;

//     //     // Move to next middleware/controller
//     //     next();

//     // }
//     // catch (error) {

//     //     return res.status(401).json({
//     //         message: 'Invalid Token'
//     //     });

//     // }

// //using cookie

//  let token=req.cookies.token||req.headers.authorization?.split(" ")[1];
//  if(!token){
//     return res.status(400).json({message:"Unauthorized:Token not found"});
//  }
//  try{
//  let decoded=jwt.verify(token,process.env.JWT_SECRET);
//  if(!decoded){
//     return res.status(401).json({message:"Unauthorized:Invalid token"});
//  }
//     req.userId=decoded.id;
//     if(!req.userId){
//         return res.status(402).json({message:"Unauthorized:User ID not found in token"});
//     }
//     next();

// }catch(err){
//     return res.status(403).json({message:"Unauthorized:Error occurred while verifying token",error:err.message});
// }

// }
    
export const verifyJwt = async (req, res, next) => {
    
  const token =
    req.cookies?.accessToken ||
    req.headers.authorization?.replace("Bearer ", "");
    console.log("Token from request:", token); // Debugging log

  if (!token) {
    return res.status(400).json({
      message: "Unauthorized: Token not found",
    });
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.ACCESS_TOKEN_SECRET
    );

    const user = await User.findById(decoded._id)
      .select("-password -refreshToken");
      

    if (!user) {
      return res.status(401).json({
        message: "Unauthorized: User not found",
      });
    }
console.log("Decoded JWT payload:", decoded); // Debugging log
    req.user = user;

    next();
  } catch (err) {
    return res.status(401).json({
      message: "Invalid or expired token",
      error: err.message,
    });
  }
};