const mongoose = require("mongoose")

const MedicationSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  name: {
    type: String,
    required: true,
    trim: true,
  },
  dosage: {
    type: String,
    required: true,
    trim: true,
  },
  frequency: {
    type: String,
    required: true,
    enum: ["once_daily", "twice_daily", "three_times_daily", "four_times_daily", "as_needed", "weekly"],
  },
  timeOfDay: [
    {
      type: String,
      enum: ["morning", "afternoon", "evening", "bedtime"],
    },
  ],
  startDate: {
    type: Date,
    required: true,
  },
  endDate: {
    type: Date,
  },
  instructions: {
    type: String,
    trim: true,
  },
  refillDate: {
    type: Date,
  },
  refillReminder: {
    type: Boolean,
    default: false,
  },
  adherence: [
    {
      date: {
        type: Date,
        required: true,
      },
      taken: {
        type: Boolean,
        default: false,
      },
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
})

module.exports = mongoose.model("Medication", MedicationSchema)

