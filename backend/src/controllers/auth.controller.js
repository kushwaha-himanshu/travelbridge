import User from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const register = async (req, res) => {

  try {

    const { fullname, email, password } = req.body;

    // Check existing user
    const existingUser = await User.findOne({

      $or: [{ email }, { fullname }]

    });

    if (existingUser) {

      return res.status(400).json({
        message: "User with this email or fullname already exists"
      });

    }

    // Hash password
    const salt = await bcrypt.genSalt(10);

    const hashedPassword = await bcrypt.hash(
      password,
      salt
    );

    // Create user
    const newUser = new User({

      fullname,
      email,
      password: hashedPassword

    });

    // Save user
    await newUser.save();

    // Generate token
    const token = jwt.sign(

      {
        id: newUser._id
      },

      process.env.JWT_SECRET,

      {
        expiresIn: "7d"
      }

    );

    // Save token in cookie
    res.cookie("token", token, {

      httpOnly: true,

      secure: false,

      sameSite: "strict"

    });

    // Final response
    res.status(201).json({

      success: true,

      message: "User registered successfully",

      token,

      user: newUser

    });

  }
  catch (error) {

    console.error(error);

    res.status(500).json({
      message: "Server error"
    });

  }

}



export const login =async (req , res) =>{

  try {

    const {fullname, email, password } = req.body;

    const user= await User.findOne({
      email:email
    })

    if(!user){
      return res.status(400).json({message:"invalid Credential"})
    }
    const isValidPassword= await bcrypt.compare(password,user.password);

    if(!isValidPassword){
       return res.status(400).json({message:"invalid Credential"})
    }

    // Generate token
    const token = jwt.sign(

      {
        id: user._id
      },

      process.env.JWT_SECRET,

      {
        expiresIn: "7d"
      }

    );

    // Save token in cookie
    res.cookie("token", token, {

      httpOnly: true,

      secure: false,

      sameSite: "strict"

    });
   
    res.status(200).json({
      message:"User Logged In successfully",
      user:{
        id:user._id,
        fullname:user.userfullname,
        email:user.email

      }


    })


    
  }catch (error) {

    console.error(error);

    res.status(500).json({
      message: "Server error"
    });

  }
}

