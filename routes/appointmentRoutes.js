const express = require("express");
const router = express.Router();

const controller = require("../controllers/appointmentController");
const { protect, adminOnly } = require("../middleware/authMiddleware");


/* =========================
   👤 USER ROUTES
========================= */

// Book appointment
router.post("/", protect, controller.bookAppointment);

// Get my appointments
router.get("/my", protect, controller.getMyAppointments);

// Get single appointment
router.get("/:id", protect, controller.getAppointmentById);

// Cancel appointment
router.put("/:id/cancel", protect, controller.cancelAppointment);



/* =========================
   👑 ADMIN ROUTES (OPTIONAL)
========================= */

// Get all appointments (admin)
router.get("/admin/all", protect, adminOnly, async (req, res) => {
  const Appointment = require("../models/appointmentModel");

  const data = await Appointment.find()
    .populate("doctorId", "name specialization")
    .populate("userId", "name email");

  res.json({
    success: true,
    count: data.length,
    data
  });
});


module.exports = router;