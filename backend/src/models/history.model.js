import mongoose from "mongoose";

const historySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    require:true,
  },

  type: {
    type: String,
    enum: [
      "text_upload",
      "voice_upload",
      "image_upload",
      "trip_planner",
    ],
    required: true,
  },

  title: {
    type: String,
  },

  description: {
    type: String,
  },

  metadata: {
    type: Object,
    default: {},
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const History = mongoose.model("History", historySchema);

export default History;