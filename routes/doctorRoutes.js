const express = require("express");
const router = express.Router();
const multer = require("multer");
const upload = multer({ storage: multer.memoryStorage() });

const doctorController = require("../controllers/doctorController");

// ✅ CREATE DOCTOR with image upload
router.post("/", upload.fields([{ name: "image", maxCount: 1 }]), doctorController.createDoctor);

// ✅ GET ALL DOCTORS
router.get("/", doctorController.getDoctors);

// ✅ GET SINGLE DOCTOR
router.get("/:id", doctorController.getDoctorById);

// ✅ UPDATE DOCTOR with image upload
router.put("/:id", upload.fields([{ name: "image", maxCount: 1 }]), doctorController.updateDoctor);

// ✅ DELETE DOCTOR
router.delete("/:id", doctorController.deleteDoctor);

module.exports = router;