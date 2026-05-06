// controllers/medicineOrderController.js

const crypto = require("crypto");
const Razorpay = require("razorpay");

const MedicineOrder = require("../models/medicineOrderModel");
const {
  debitWallet,
  creditWallet,
} = require("../services/walletService");

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});


// ==========================================
// CREATE ORDER
// ==========================================

exports.createMedicineOrder = async (req, res) => {
  try {
    const {
      user,
      items,
      totalAmount,
      paymentMethod,
      getMyMedicineOrders,
      deliveryAddress,
    } = req.body;

    // COD ORDER
    if (paymentMethod === "COD") {

   const order = await MedicineOrder.create({
  user: req.user._id,
        items,
        totalAmount,
        paymentMethod,
        deliveryAddress,
        paymentStatus: "PENDING",
      });

      return res.status(201).json({
        success: true,
        message: "COD Order Placed",
        order,
      });
    }// ==========================================
// WALLET PAYMENT
// ==========================================

if (paymentMethod === "WALLET") {

  // USER WALLET SE MONEY CUT

  await debitWallet({

    userId: req.user._id,

    amount: totalAmount,

    title: "Medicine Order Payment",

    subtitle: "Medicine Purchase",
  });


  // ADMIN WALLET ME MONEY ADD

  await creditWallet({

    userId: process.env.ADMIN_ID,

    amount: totalAmount,

    title: "Medicine Order Received",

    subtitle: "Medicine Purchase",
  });


  // ORDER CREATE

  const order = await MedicineOrder.create({

    user: req.user._id,

    items,

    totalAmount,

    paymentMethod: "WALLET",

    deliveryAddress,

    paymentStatus: "PAID",

    orderStatus: "CONFIRMED",
  });


  return res.status(201).json({

    success: true,

    message: "Wallet Payment Successful",

    order,
  });
}

    // ONLINE PAYMENT ORDER

    const razorpayOrder = await razorpay.orders.create({
      amount: totalAmount * 100,
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    });

    const order = await MedicineOrder.create({
  user: req.user._id,
      items,
      totalAmount,
      paymentMethod: "ONLINE",
      deliveryAddress,

      razorpayOrderId: razorpayOrder.id,

      paymentStatus: "PENDING",
    });

    res.status(201).json({
      success: true,
      message: "Razorpay Order Created",
      order,
      razorpayOrder,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// ==========================================
// VERIFY PAYMENT
// ==========================================

exports.verifyMedicinePayment = async (req, res) => {
  try {

    const {
      orderId,
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    } = req.body;

    const body =
      razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto
      .createHmac(
        "sha256",
        process.env.RAZORPAY_KEY_SECRET
      )
      .update(body.toString())
      .digest("hex");

    const isAuthentic =
      expectedSignature === razorpay_signature;

    if (!isAuthentic) {
      return res.status(400).json({
        success: false,
        message: "Invalid Payment Signature",
      });
    }

    const order = await MedicineOrder.findByIdAndUpdate(
      orderId,
      {
        razorpayPaymentId: razorpay_payment_id,
        razorpaySignature: razorpay_signature,

        paymentStatus: "PAID",

        orderStatus: "CONFIRMED",

        paidAt: new Date(),
      },
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: "Payment Verified Successfully",
      order,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// ==========================================
// GET ALL ORDERS
// ==========================================

exports.getAllMedicineOrders = async (req, res) => {
  try {

    const orders = await MedicineOrder.find()
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: orders.length,
      data: orders,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// ==========================================
// GET SINGLE ORDER
// ==========================================

exports.getSingleMedicineOrder = async (req, res) => {
  try {

    const order = await MedicineOrder.findById(
      req.params.id
    );

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    res.status(200).json({
      success: true,
      data: order,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
// ==========================================
// GET MY ORDERS
// ==========================================

exports.getMyMedicineOrders = async (req, res) => {

  try {

    const orders = await MedicineOrder.find({
      user: req.user._id,
    })

    .sort({ createdAt: -1 });

    res.status(200).json({

      success: true,

      count: orders.length,

      data: orders,

    });

  } catch (error) {

    res.status(500).json({

      success: false,

      message: error.message,

    });

  }

};