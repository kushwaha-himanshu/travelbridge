import express from "express";
import {
  generateTrip,
  refineTrip,
  getHealth,
  getUserTrips,
} from "../controllers/tripController.js";
import { verifyJwt } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Optional JWT extractor middleware that doesn't reject unauthenticated guests
const optionalJwt = (req, res, next) => {
  const token = req.cookies?.accessToken || req.headers.authorization?.replace("Bearer ", "");
  if (!token) return next();
  return verifyJwt(req, res, next);
};

// Health check
router.get("/health", getHealth);

// Plan trip endpoints
router.post("/plan", optionalJwt, generateTrip);
router.post("/generate", optionalJwt, generateTrip); // legacy alias

// Refine trip endpoint (Rechat)
router.post("/refine", optionalJwt, refineTrip);

// User trip history (protected)
router.get("/my-trips", verifyJwt, getUserTrips);

export default router;