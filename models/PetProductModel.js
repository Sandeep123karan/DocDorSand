const mongoose = require("mongoose");

const petProductSchema = new mongoose.Schema({

  title: {
    type: String,
    required: true,
  },

  shortDescription: {
    type: String,
    default: "",
  },

  description: {
    type: String,
    default: "",
  },

  // DYNAMIC CATEGORY
  petCategory: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "PetCategory",
    required: true,
  },

  // STATIC TYPE
  needType: {
    type: String,

    enum: [
      "medicines",
      "food",
      "toys",
      "accessories"
    ],

    required: true,
  },

  // PRODUCT IMAGE
  image: {

    url: String,

    publicId: String,
  },

  // PRICE
  price: {
    type: Number,
    required: true,
  },

  // WEIGHT
  weight: {
    type: String,
    default: "",
  },

  // FLAVOR
  flavor: {
    type: String,
    default: "",
  },

  // AGE TYPE
  ageType: {
    type: String,

    enum: [
      "kids",
      "adult",
      "all"
    ],

    default: "all",
  },

  // RATING
  rating: {
    type: Number,
    default: 4.5,
  },

  // STOCK
  stock: {
    type: Number,
    default: 1,
  },

}, {
  timestamps: true,
});

module.exports = mongoose.model(
  "PetProduct",
  petProductSchema
);