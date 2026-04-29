const Appointment = require("../models/appointmentModel");
const Doctor = require("../models/doctorModel");


/* =========================
   📅 BOOK APPOINTMENT
========================= */
exports.bookAppointment = async (req, res) => {
  try {
    const { doctorId, date, time, type } = req.body;

    // ✅ Validation
    if (!doctorId || !date || !time || !type) {
      return res.status(400).json({
        success: false,
        message: "All fields are required"
      });
    }

    // ✅ Check doctor exists
    const doctor = await Doctor.findById(doctorId);
    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: "Doctor not found"
      });
    }

    // ✅ Prevent duplicate booking (same time)
    const existing = await Appointment.findOne({
      doctorId,
      date,
      time
    });

    if (existing) {
      return res.status(400).json({
        success: false,
        message: "Slot already booked"
      });
    }

    // ✅ Create appointment
    const appointment = await Appointment.create({
      userId: req.user._id,
      doctorId,
      date,
      time,
      type
    });

    res.status(201).json({
      success: true,
      message: "Appointment booked successfully",
      data: appointment
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};



/* =========================
   📄 GET MY APPOINTMENTS
========================= */
exports.getMyAppointments = async (req, res) => {
  try {
    const data = await Appointment.find({ userId: req.user._id })
      .populate("doctorId", "name specialization fees type")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: data.length,
      data
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};



/* =========================
   🔍 GET SINGLE APPOINTMENT
========================= */
exports.getAppointmentById = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id)
      .populate("doctorId", "name specialization fees");

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: "Appointment not found"
      });
    }

    res.json({
      success: true,
      data: appointment
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};



/* =========================
   ❌ CANCEL APPOINTMENT
========================= */
exports.cancelAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: "Appointment not found"
      });
    }

    // ✅ only owner can cancel
    if (appointment.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Not authorized"
      });
    }

    appointment.status = "cancelled";
    await appointment.save();

    res.json({
      success: true,
      message: "Appointment cancelled"
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};