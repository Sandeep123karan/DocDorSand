// models/medicineOrderModel.js

const mongoose = require("mongoose");

const medicineOrderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    items: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Medicine",
          required: true,
        },

        name: {
          type: String,
          required: true,
        },

        image: {
          type: String,
          default: "",
        },

        quantity: {
          type: Number,
          required: true,
          default: 1,
        },

        price: {
          type: Number,
          required: true,
        },

        totalPrice: {
          type: Number,
          required: true,
        },
      },
    ],

    totalAmount: {
      type: Number,
      required: true,
    },

    paymentMethod: {
      type: String,
      enum: ["COD", "ONLINE", "WALLET"],
      default: "COD",
    },

    paymentStatus: {
      type: String,
      enum: ["PENDING", "PAID", "FAILED"],
      default: "PENDING",
    },

    orderStatus: {
      type: String,
      enum: [
        "PLACED",
        "CONFIRMED",
        "PROCESSING",
        "SHIPPED",
        "DELIVERED",
        "CANCELLED",
      ],
      default: "PLACED",
    },

    deliveryAddress: {
      type: String,
      required: true,
      trim: true,
    },

    // Razorpay Details
    razorpayOrderId: {
      type: String,
      default: "",
    },

    razorpayPaymentId: {
      type: String,
      default: "",
    },

    razorpaySignature: {
      type: String,
      default: "",
    },

    paidAt: {
      type: Date,
    },

    deliveredAt: {
      type: Date,
    },

    isCompleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "MedicineOrder",
  medicineOrderSchema
);