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

   

    isActive: {
      type: Boolean,
      default: true
    }

  },
  { timestamps: true }
);


// 🔥 SAFE EXPORT (Overwrite error avoid karega)
module.exports =
  mongoose.models.Doctor || mongoose.model("Doctor", doctorSchema);