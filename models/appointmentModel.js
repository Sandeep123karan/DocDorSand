const mongoose = require("mongoose");

const appointmentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  doctorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Doctor",
    required: true
  },

  date: {
    type: String,
    required: true
  },

  time: {
    type: String,
    required: true
  },

  type: {
    type: String,
    enum: ["online", "in-person"],
    required: true
  },

  status: {
    type: String,
    enum: ["pending", "confirmed", "completed"],
    default: "pending"
  }

}, { timestamps: true });

module.exports = mongoose.model("Appointment", appointmentSchema);