const mongoose = require("mongoose")

const HealthMetricSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  type: {
    type: String,
    required: true,
    enum: ["bloodPressure", "bloodGlucose", "weight", "heartRate"],
  },
  date: {
    type: Date,
    required: true,
  },
  time: {
    type: String,
    required: true,
  },
  values: {
    // For blood pressure
    systolic: Number,
    diastolic: Number,

    // For blood glucose, weight, heart rate
    value: Number,
    unit: String,

    // For blood glucose
    mealStatus: {
      type: String,
      enum: ["fasting", "before_meal", "after_meal"],
    },

    // For heart rate
    activityLevel: {
      type: String,
      enum: ["resting", "light_activity", "after_exercise"],
    },
  },
  notes: {
    type: String,
    trim: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
})

module.exports = mongoose.model("HealthMetric", HealthMetricSchema)

