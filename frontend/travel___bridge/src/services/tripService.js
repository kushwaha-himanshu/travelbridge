import axios from "axios";

// Base URL points to Node.js backend API
const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  (import.meta.env.VITE_API_BASE_URL ? import.meta.env.VITE_API_BASE_URL.replace(/\/api\/?$/, "") : "") ||
  "http://localhost:8000";

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  timeout: 120000, // 120s for multi-agent graph execution
  headers: {
    "Content-Type": "application/json",
  },
});

/**
 * Dispatches trip plan generation to the Node.js backend.
 * Architecture: React -> Node.js (POST /api/trips/plan) -> Python (POST /api/v1/trips/plan)
 */
export const planTrip = async (tripData) => {
  try {
    console.log(`[TripPlanner] Submitting trip request to Node.js backend at ${API_BASE_URL}/api/trips/plan:`, tripData);
    const response = await apiClient.post("/api/trips/plan", tripData);

    console.log("[TripPlanner] Trip response received from Node.js backend:", response.data);
    if (!response.data || (!response.data.success && !response.data.data && !response.data.plan)) {
      throw new Error(response.data?.message || "Trip planning service returned an invalid response.");
    }

    return response.data;
  } catch (error) {
    console.error("[TripPlanner] Request error:", error.response?.data || error.message);
    // User-friendly error message; do not expose internal URLs, Python traces, or raw axios errors
    const backendMsg = error.response?.data?.message || error.response?.data?.error?.message;
    const userMsg = backendMsg || "Unable to generate your trip right now. Please check your connection and try again.";
    throw new Error(userMsg);
  }
};

// Legacy compatibility alias
export const generateTripPlan = planTrip;

/**
 * Refines an existing trip plan using the Rechat refinement assistant
 */
export const refineTripPlan = async ({ message, currentTrip, tripId = null }) => {
  try {
    console.log(`[TripPlanner] Submitting refine request to Node.js backend at ${API_BASE_URL}/api/trips/refine:`, message);
    const response = await apiClient.post("/api/trips/refine", {
      message,
      current_trip: currentTrip,
      trip_id: tripId,
    });

    console.log("[TripPlanner] Refine response received from Node.js backend:", response.data);
    if (!response.data || (!response.data.success && !response.data.data)) {
      throw new Error(response.data?.message || "Trip refinement returned an invalid response.");
    }

    return response.data;
  } catch (error) {
    console.error("[TripPlanner] Refine error:", error.response?.data || error.message);
    const backendMsg = error.response?.data?.message || error.response?.data?.error?.message;
    const userMsg = backendMsg || "Failed to refine your trip plan. Please try again.";
    throw new Error(userMsg);
  }
};
