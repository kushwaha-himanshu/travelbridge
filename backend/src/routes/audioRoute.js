// import express from "express"
// import upload from "../middlewares/upload.js";
// import { uploadAudio } from "../controllers/audio.controller.js";

// const router =express.Router();

// router.post(
//     "/upload-audio",
//     upload.single("audio"),
//     uploadAudio
// );

// export default router;

import express from "express";

import upload from "../middlewares/upload.js";

import {
    uploadAudio,
    translateAudioText,
    textToSpeech
} from "../controllers/audio.controller.js";

const router = express.Router();


// Audio → Text
router.post(
    "/upload-audio",
    upload.single("audio"),
    uploadAudio
);


// Text → Translation
router.post(
    "/translate-audio",
    translateAudioText
);


// Translation → Audio
router.post(
    "/text-to-speech",
    textToSpeech
);


export default router;