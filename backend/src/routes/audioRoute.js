import express from "express"
import upload from "../middlewares/upload.js";
import { uploadAudio } from "../controllers/audio.controller.js";

const router =express.Router();

router.post(
    "/upload-audio",
    upload.single("audio"),
    uploadAudio
);

export default router;