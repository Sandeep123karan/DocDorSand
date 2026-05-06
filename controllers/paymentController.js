const crypto = require("crypto");
const razorpay = require("../utils/razorpay");

exports.createOrder = async (req, res) => {
  try {
    const { amount } = req.body;

    const options = {
      amount: amount * 100,
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);

    res.status(200).json({
      success: true,
      order,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.verifyPayment = async (req, res) => {
  try {

    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    } = req.body;

    const body = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest("hex");

    const isAuthentic =
      expectedSignature === razorpay_signature;

    if (!isAuthentic) {
      return res.status(400).json({
        success: false,
        message: "Invalid Signature",
      });
    }

    res.status(200).json({
      success: true,
      message: "Payment Verified Successfully",
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};