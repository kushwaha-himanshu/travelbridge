import Groq from "groq-sdk";
import dotenv from "dotenv";

dotenv.config({
    path:"./.env"
});
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
const trip={
        
      destination: 'Paris',
      startDate: '2025-06-01',
      endDate: '2025-06-05',
      budget: 50000,
      travelers: 2,
      interests: [
        'food',
        'history'
      ],
      accommodation: 'mid-range'
    
}
const prompt = `
const prompt=You are an expert AI travel planner. Generate a detailed travel itinerary. DESTINATION: ${trip.destination} DATES: ${trip.startDate} to ${trip.endDate} BUDGET: ${trip.budget} TRAVELERS: ${trip.travelers} INTERESTS: ${trip.interests.join(', ')} ACCOMMODATION: ${trip.accommodation} IMPORTANT: - Use REAL attractions - Use REAL restaurants - Stay within budget - Include transport - Include local food - Include hotel suggestions - Include emergency tips Return ONLY valid JSON. JSON FORMAT: { "destination": "", "totalDays": 0, "days": [ { "day": 1, "title": "", "morning": { "activity": "", "location": "", "cost": "" }, "afternoon": { "activity": "", "location": "", "cost": "" }, "evening": { "activity": "", "location": "", "cost": "" }, "hotel": { "name": "", "price": "" }, "food": [ { "restaurant": "", "dish": "" } ] } ], "budgetBreakdown": { "hotel": "", "food": "", "transport": "", "activities": "" }, "packingList": [], "travelTips": [], "emergencyContacts": { "police": "", "ambulance": "" } }`;

export async function main() {
  const chatCompletion = await getGroqChatCompletion();
  // Print the completion returned by the LLM.
  console.log(chatCompletion.choices[0]?.message?.content || "");
  return chatCompletion.choices[0]?.message?.content || "";
}


export async function getGroqChatCompletion() {
  return groq.chat.completions.create({
    messages: [
      {
        role: "user",
        content: prompt,
      },
    ],
      temperature: 0.7,

      response_format: {
        type: 'json_object'
      },

    model: "llama-3.3-70b-versatile",
  });
}
