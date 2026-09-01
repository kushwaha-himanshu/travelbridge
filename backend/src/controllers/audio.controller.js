// import fs from "fs";
// import openai from "openai";
// import { translateText } from "../utils/translate.js";

// const Openai=new openai.OpenAI({
//     apiKey: process.env.OPENAI_API_KEY
// });


// export const uploadAudio = async (req, res) => {
//     try {

//         // 1. Check file
//         if (!req.file) {
//             return res.status(400).json({
//                 success: false,
//                 message: "Audio file is required"
//             });
//         }

//         // 2. Get audio path
//          console.log("Audio file:", req.file.path);

//         const audioFile = fs.createReadStream(req.file.path);

//         const transcription = await Openai.audio.transcriptions.create({
//             file: audioFile,
//             model: "whisper-1",
//         });

//         console.log("Transcription:", transcription.text);

//         res.status(200).json({
//             success: true,
//             text: transcription.text,
//         });

//     } catch (error) {

//         console.error("AUDIO ERROR:", error);

//         res.status(500).json({
//             success: false,
//             message: error.message,
//         });
//     }
// };


// // 3. Translate text

// export const translateAudioText = async (req, res) => {
//     try {
//         const { text, targetLanguage } = req.body;

//         const translatedText = await translateText(text, targetLanguage);

//         res.status(200).json({
//             success: true,
//             text: translatedText
//         });
//     } catch (error) {
//         console.error("TRANSLATION ERROR:", error);

//         res.status(500).json({
//             success: false,
//             message: error.message
//         });
//     }
// };

// // afetr translation convert the translated text to audio using TTS and send it back to the frontend.

// export const textToSpeech = async (req, res) => {
//     try {
//         const { text, targetLanguage } = req.body;

//         const audioFile = await Openai.audio.speech.create({
//             model: "tts-1",
//             voice: "alloy",
//             input: text
//         });

//         res.status(200).json({
//             success: true,
//             text: translatedText,
//             audio: audioFile
//         });

// const buffer = Buffer.from(await speech.arrayBuffer());

// const fileName = `translated-${Date.now()}.mp3`;

// const filePath = `uploads/audio/${fileName}`;

// fs.writeFileSync(filePath, buffer);
//     } 
    
//     catch (error) {
//         console.error("TTS ERROR:", error);

//         res.status(500).json({
//             success: false,
//             message: error.message
//         });
//     }
// };


import fs from "fs";
import Groq from "groq-sdk";
import { translateText } from "../utils/translate.js";

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY
});


// ==========================================
// 1. AUDIO → TEXT
// ==========================================

export const uploadAudio = async (req, res) => {
    try {

        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: "Audio file is required"
            });
        }

        console.log("Audio file:", req.file.path);

        const audioFile = fs.createReadStream(
            req.file.path
        );

        const transcription =
            await groq.audio.transcriptions.create({
                file: audioFile,
                model: "whisper-large-v3-turbo",
                response_format: "json"
            });

        console.log(
            "Transcription:",
            transcription.text
        );

        return res.status(200).json({
            success: true,
            text: transcription.text
        });

    } catch (error) {

        console.error(
            "AUDIO TRANSCRIPTION ERROR:",
            error
        );

        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


// ==========================================
// 2. TEXT → TRANSLATION
// ==========================================

export const translateAudioText = async (req, res) => {

    try {

        const {
            text,
            targetLanguage
        } = req.body;

        if (!text) {
            return res.status(400).json({
                success: false,
                message: "Text is required"
            });
        }

        const translatedText =
            await translateText(
                text,
                targetLanguage
            );

        console.log(
            "Translated text:",
            translatedText
        );

        return res.status(200).json({
            success: true,
            text: translatedText
        });

    } catch (error) {

        console.error(
            "TRANSLATION ERROR:",
            error
        );

        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


// ==========================================
// 3. TEXT → SPEECH
// ==========================================

export const textToSpeech = async (req, res) => {
    try {

        const { text } = req.body;

        if (!text) {
            return res.status(400).json({
                success: false,
                message: "Text is required"
            });
        }

        console.log("TTS input:", text);

        const speech = await groq.audio.speech.create({
            model: "canopylabs/orpheus-v1-english",
            voice: "troy",
            input: text,
            response_format: "wav"
        });

        const buffer = Buffer.from(
            await speech.arrayBuffer()
        );

        const fileName =
            `translated-${Date.now()}.wav`;

        const filePath =
            `uploads/audio/${fileName}`;

        await fs.promises.writeFile(
            filePath,
            buffer
        );

        console.log(
            "TTS saved:",
            filePath
        );

        return res.status(200).json({
            success: true,
            audio: `/uploads/audio/${fileName}`
        });

    } catch (error) {

        console.error(
            "TTS ERROR:",
            error
        );

        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};