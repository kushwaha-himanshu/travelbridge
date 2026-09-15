import mongoose from "mongoose";

const tripSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false,
      index: true,
    },
    destination: {
      type: String,
      required: true,
      trim: true,
    },
    days: {
      type: Number,
      required: true,
      min: 1,
    },
    travelers: {
      type: Number,
      default: 2,
    },
    budget: {
      type: Number,
      default: 0,
    },
    currency: {
      type: String,
      default: "INR",
    },
    travelStyle: {
      type: String,
      default: "moderate",
    },
    interests: {
      type: [String],
      default: [],
    },
    tripData: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
    },
  },
  { timestamps: true }
);

const Tripplanner = mongoose.model("Tripplanner", tripSchema);
export default Tripplanner;