import jwt from "jsonwebtoken";

export const authMiddleware = async (req, res, next) => {

    // const authHeader = req.headers.authorization;

    // // Check token exists
    // if (!authHeader || !authHeader.startsWith('Bearer ')) {

    //     return res.status(401).json({
    //         message: 'Unauthorized'
    //     });

    // }

    // try {

    //     // Extract token
    //     const token = authHeader.split(' ')[1];

    //     // Verify token
    //     const decoded = jwt.verify(
    //         token,
    //         process.env.JWT_SECRET
    //     );

    //     // Store user data in request
    //     req.user = decoded;

    //     // Move to next middleware/controller
    //     next();

    // }
    // catch (error) {

    //     return res.status(401).json({
    //         message: 'Invalid Token'
    //     });

    // }

//using cookie
try{
 let {token}= req.cookies; // token=req.cookies.token
 if(!token){
    return res.status(400).json({message:"Unauthorized:Token not found"});
 }
 let decoded=jwt.verify(token,process.env.JWT_SECRET);
 if(!decoded){
    return res.status(400).json({message:"Unauthorized:Invalid token"});
 }
    req.userId=decoded.id;
    if(!req.userId){
        return res.status(400).json({message:"Unauthorized:User ID not found in token"});
    }
    next();

}catch(err){
    return res.status(400).json({message:"Unauthorized:Error occurred while verifying token",error:err.message});
}

}
    
     
