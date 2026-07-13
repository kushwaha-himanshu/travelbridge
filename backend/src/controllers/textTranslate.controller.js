import { translateText } from "../utils/translate.js";

export const textTranslatefxn = async (req, res) => {
    try {

        const { text, targetLanguagetext } = req.body;

        const translated = await translateText(
            text,
           targetLanguagetext
        );
        console.log(targetLanguagetext)
        console.log(text)

        return res.status(200).json({
            success: true,
            original: text,
            translated
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};