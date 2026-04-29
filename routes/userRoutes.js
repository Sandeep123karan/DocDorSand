const express = require("express");
const router = express.Router();

const {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
  deleteUser,
} = require("../controllers/userController");

const { protect, adminOnly } = require("../middleware/authMiddleware");

/* =========================
   🔓 PUBLIC ROUTES
========================= */

// Register User
router.post("/register", registerUser);

// Login User
router.post("/login", loginUser);


/* =========================
   🔒 PROTECTED ROUTES
========================= */

// Get Profile
router.get("/profile", protect, getUserProfile);

// Update Profile
router.put("/profile", protect, updateUserProfile);


/* =========================
   👑 ADMIN ONLY ROUTES
========================= */

// Delete User
router.delete("/:id", protect, adminOnly, deleteUser);


module.exports = router;