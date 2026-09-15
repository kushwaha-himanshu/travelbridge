import axios from "axios";

const PYTHON_AI_SERVICE_URL = process.env.PYTHON_AI_SERVICE_URL || "http://127.0.0.1:8002";
const PYTHON_SERVICE_TOKEN = process.env.PYTHON_SERVICE_TOKEN || "";

const apiClient = axios.create({
  baseURL: PYTHON_AI_SERVICE_URL,
  timeout: 90000, // 90 second timeout for complex graph runs
  headers: {
    "Content-Type": "application/json",
    ...(PYTHON_SERVICE_TOKEN ? { Authorization: `Bearer ${PYTHON_SERVICE_TOKEN}` } : {}),
  },
});

export const planTrip = async (tripRequest) => {
  try {
    console.log(`[aiTripService] Forwarding plan request to ${PYTHON_AI_SERVICE_URL}/api/v1/trips/plan`);
    const response = await apiClient.post("/api/v1/trips/plan", tripRequest);
    return response.data;
  } catch (error) {
    console.error("[aiTripService] Plan error:", error.response?.data || error.message);
    const detail = error.response?.data?.error?.message || error.response?.data?.detail || "AI Trip Service is currently unavailable.";
    throw new Error(detail);
  }
};

export const refineTrip = async (refineRequest) => {
  try {
    console.log(`[aiTripService] Forwarding refine request to ${PYTHON_AI_SERVICE_URL}/api/v1/trips/refine`);
    const response = await apiClient.post("/api/v1/trips/refine", refineRequest);
    return response.data;
  } catch (error) {
    console.error("[aiTripService] Refine error:", error.response?.data || error.message);
    const detail = error.response?.data?.error?.message || error.response?.data?.detail || "Failed to refine trip.";
    throw new Error(detail);
  }
};

export const checkHealth = async () => {
  try {
    const response = await apiClient.get("/health", { timeout: 5000 });
    return response.data;
  } catch (error) {
    return { status: "unreachable", error: error.message };
  }
};
