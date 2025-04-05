const mongoose = require("mongoose")

const ConsultationSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  doctorName: {
    type: String,
    required: true,
    trim: true,
  },
  specialty: {
    type: String,
    required: true,
    trim: true,
  },
  date: {
    type: Date,
    required: true,
  },
  type: {
    type: String,
    required: true,
    enum: ["video", "phone"],
  },
  status: {
    type: String,
    required: true,
    enum: ["pending", "confirmed", "completed", "cancelled"],
    default: "pending",
  },
  reason: {
    type: String,
    trim: true,
  },
  notes: {
    type: String,
    trim: true,
  },
  followUp: {
    recommended: {
      type: Boolean,
      default: false,
    },
    date: Date,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
})

module.exports = mongoose.model("Consultation", ConsultationSchema)

