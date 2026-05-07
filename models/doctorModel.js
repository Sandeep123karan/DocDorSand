const mongoose = require("mongoose");

const doctorSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Doctor name is required"],
      trim: true
    },

    degree: {
      type: String,
      trim: true
    },

    speciality: {
      type: String,
      trim: true
    },

    experience: {
      type: String,
      trim: true
    },

    fees: {
      type: Number,
      default: 0
    },

    // 🔥 IMAGE
    image: {
      url: {
        type: String,
        default: ""
      },
      publicId: {
        type: String,
        default: ""
      }
    },

    // ⭐ RATING SYSTEM
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5
    },

    reviews: {
      type: Number,
      default: 0
    },

    // =====================================
    // 📍 LOCATION
    // =====================================

    location: {
      type: {
        type: String,
        enum: ["Point"],
        default: "Point"
      },

      coordinates: {
        type: [Number], // [longitude, latitude]
        required: true
      }
    },

    address: {
      type: String,
      default: ""
    },

    city: {
      type: String,
      default: ""
    },

    state: {
      type: String,
      default: ""
    },

    pincode: {
      type: String,
      default: ""
    },

    isActive: {
      type: Boolean,
      default: true
    }

  },
  { timestamps: true }
);

// =====================================
// 📍 GEO INDEX
// =====================================

doctorSchema.index({
  location: "2dsphere"
});

// 🔥 SAFE EXPORT
module.exports =
  mongoose.models.Doctor ||
  mongoose.model(
    "Doctor",
    doctorSchema
  );
