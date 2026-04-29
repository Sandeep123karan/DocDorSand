const express = require("express");
const router = express.Router();

const multer = require("multer");
const upload = multer({ storage: multer.memoryStorage() });

const {
  createSurgery,
  getSurgeries,
  getSurgeryById,
  updateSurgery,
  deleteSurgery
} = require("../controllers/surgeryController");

router.post("/", upload.fields([{ name: "icon", maxCount: 1 }]), createSurgery);

router.get("/", getSurgeries);

router.get("/:id", getSurgeryById);

router.put("/:id", upload.fields([{ name: "icon", maxCount: 1 }]), updateSurgery);

router.delete("/:id", deleteSurgery);

module.exports = router;