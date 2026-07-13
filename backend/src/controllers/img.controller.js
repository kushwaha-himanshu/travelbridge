import Tesseract from "tesseract.js";
import { translateText } from "../utils/translate.js";
export const uploadImage = async (req, res) => {

  try {

   const imagePath=req.file.path
  console.log(imagePath)

  const targetLanguage=req.body.targetLanguage

  const result =await Tesseract.recognize(
    imagePath,
    "eng"
  )

  const extractedText = result.data.text;

console.log(extractedText);
const translated = await translateText(
    extractedText,
     targetLanguage
);

    res.status(200).json({
      success: true,
      file: req.file,
      original:extractedText,
      translated:translated
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};