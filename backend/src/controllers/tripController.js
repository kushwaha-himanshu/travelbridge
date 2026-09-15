import axios from "axios";

export const generateTrip = async (req, res) => {
  try {
    console.log("Trip request received:", req.body);

    const response = await axios.post(
      "http://localhost:8001/generate_trip",
      req.body
    );

    console.log("AI response received");

    return res.status(200).json({
      success: true,
      plan: response.data.plan
    });

  } catch (error) {
    console.error(
      "AI service error:",
      error.response?.data || error.message
    );

    return res.status(500).json({
      success: false,
      message: "Failed to generate trip"
    });
  }
};