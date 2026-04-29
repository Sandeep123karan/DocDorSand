const mongoose = require("mongoose");

const medicineItemSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Medicine name required"],
      trim: true
    },

    description: {
      type: String,
      default: ""
    },

    image: {
      url: {
        type: String,
        required: [true, "Image URL required"]
      },
      publicId: {
        type: String,
        required: [true, "Image publicId required"]
      }
    },

    price: {
      type: Number,
      required: [true, "Price required"],
      min: 0
    },

   
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("MedicineItem", medicineItemSchema);