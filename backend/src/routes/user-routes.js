import express from "express";
import {register,login,googleAuth,logout } from "../controllers/auth.controller.js";
import { verifyJwt } from "../middlewares/authMiddleware.js";
import { forgotPassword,verifyOtp, resetPassword,getPremiumStatus } from "../controllers/auth.controller.js";
//import { authMiddleware } from "../middleware/authMiddleware.js";



const router = express.Router();


router.post("/register", register);
router.post("/login", login);
router.post("/google", googleAuth);
router.post("/logout", verifyJwt,logout);
router.post("/forgot-password", forgotPassword);
router.post("/verify-otp", verifyOtp);
router.post("/reset-password", resetPassword);
router.get("/premium-status",verifyJwt,getPremiumStatus);
// router.put("/user_setting")

export default router; 