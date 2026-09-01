import OpenAI from "openai";


const client = new OpenAI({
    apiKey: process.env.GROQ_API_KEY,
    baseURL: "https://api.groq.com/openai/v1"
});

export async function translateText(text, language) {

    const response = await client.chat.completions.create({
        model: "openai/gpt-oss-safeguard-20b",
        messages: [
            {
                role: "system",
                content: `Translate the following text to ${language}. Only return the translated text.`
            },
            {
                role: "user",
                content: text
            }
        ]
    });

    return response.choices[0].message.content;
}