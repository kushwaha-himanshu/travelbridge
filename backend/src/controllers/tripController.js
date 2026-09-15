import * as aiTripService from "../services/aiTripService.js";
import Tripplanner from "../models/tripplanner.model.js";

/**
 * Validates trip request input parameters
 */
const validateTripInput = (data) => {
  const errors = [];

  if (!data.destination || typeof data.destination !== "string" || !data.destination.trim()) {
    errors.push("Destination is required and cannot be empty.");
  }

  const days = Number(data.days);
  if (isNaN(days) || days < 1 || days > 30) {
    errors.push("Trip duration must be between 1 and 30 days.");
  }

  const travelers = Number(data.travelers);
  if (isNaN(travelers) || travelers < 1) {
    errors.push("Number of travelers must be at least 1.");
  }

  const budget = Number(data.budget);
  if (isNaN(budget) || budget < 0) {
    errors.push("Budget must be a non-negative number.");
  }

  if (data.check_in && data.check_out) {
    const dIn = new Date(data.check_in);
    const dOut = new Date(data.check_out);
    if (dOut < dIn) {
      errors.push("Check-out date cannot precede check-in date.");
    }
  }

  return errors;
};

/**
 * POST /api/trips/plan or POST /api/trip/generate
 */
export const generateTrip = async (req, res) => {
  try {
    console.log("[tripController] Received trip plan request:", req.body);

    const validationErrors = validateTripInput(req.body);
    if (validationErrors.length > 0) {
      return res.status(400).json({
        success: false,
        message: validationErrors.join(" "),
        errors: validationErrors,
      });
    }

    const payload = {
      destination: req.body.destination.trim(),
      days: Number(req.body.days) || 3,
      travelers: Number(req.body.travelers) || 2,
      budget: Number(req.body.budget) || 40000,
      currency: req.body.currency || "INR",
      interests: Array.isArray(req.body.interests) ? req.body.interests : [],
      travel_style: req.body.travel_style || "moderate",
      check_in: req.body.check_in || "",
      check_out: req.body.check_out || "",
      starting_location: req.body.starting_location || null,
      dietary_preferences: req.body.dietary_preferences || [],
    };

    const aiResponse = await aiTripService.planTrip(payload);
    const tripData = aiResponse.data;

    // Persist to MongoDB if user is authenticated
    let savedTripId = null;
    if (req.user && req.user._id) {
      try {
        const savedDoc = await Tripplanner.create({
          userId: req.user._id,
          destination: payload.destination,
          days: payload.days,
          travelers: payload.travelers,
          budget: payload.budget,
          currency: payload.currency,
          travelStyle: payload.travel_style,
          interests: payload.interests,
          tripData: tripData,
        });
        savedTripId = savedDoc._id;
      } catch (dbErr) {
        console.warn("[tripController] Failed to persist trip to DB:", dbErr.message);
      }
    }

    return res.status(200).json({
      success: true,
      trip_id: savedTripId,
      data: tripData,
      plan: tripData, // legacy frontend compatibility
    });
  } catch (error) {
    console.error("[tripController] Error in generateTrip:", error.message);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to generate trip plan.",
    });
  }
};

/**
 * POST /api/trips/refine
 */
export const refineTrip = async (req, res) => {
  try {
    const { message, current_trip, trip_id } = req.body;

    if (!message || typeof message !== "string" || !message.trim()) {
      return res.status(400).json({
        success: false,
        message: "A refinement instruction message is required.",
      });
    }

    if (!current_trip || typeof current_trip !== "object") {
      return res.status(400).json({
        success: false,
        message: "The current trip context is required for refinement.",
      });
    }

    const aiResponse = await aiTripService.refineTrip({
      message: message.trim(),
      current_trip: current_trip,
      trip_id: trip_id || null,
    });

    // Update in MongoDB if trip_id exists and user is authenticated
    if (trip_id && req.user && req.user._id) {
      try {
        await Tripplanner.findByIdAndUpdate(trip_id, {
          tripData: aiResponse.data.updated_trip,
        });
      } catch (dbErr) {
        console.warn("[tripController] Could not update trip in DB:", dbErr.message);
      }
    }

    return res.status(200).json({
      success: true,
      message: aiResponse.message,
      data: aiResponse.data,
    });
  } catch (error) {
    console.error("[tripController] Error in refineTrip:", error.message);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to refine trip.",
    });
  }
};

/**
 * GET /api/trips/health
 */
export const getHealth = async (req, res) => {
  const pythonStatus = await aiTripService.checkHealth();
  return res.status(200).json({
    status: "ok",
    node_backend: "online",
    python_service: pythonStatus,
  });
};

/**
 * GET /api/trips/my-trips (requires auth)
 */
export const getUserTrips = async (req, res) => {
  try {
    if (!req.user || !req.user._id) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }
    const trips = await Tripplanner.find({ userId: req.user._id }).sort({ createdAt: -1 }).limit(20);
    return res.status(200).json({ success: true, trips });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};