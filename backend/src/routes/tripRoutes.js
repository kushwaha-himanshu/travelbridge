import express from "express";
import { generateTrip } from "../controllers/tripController.js";

const router = express.Router();

router.post("/generate", generateTrip);

export default router;