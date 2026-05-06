// routes/profileRoutes.js

const express = require("express");

const router = express.Router();



// ================= MIDDLEWARE =================

const upload = require(
  "../middleware/upload"
);



// ================= CONTROLLER =================

const {
  createProfile,
  getProfiles,
  getProfileById,
  updateProfile,
  deleteProfile,
} = require(
  "../controllers/profileController"
);



// ================= CREATE PROFILE =================

router.post(
  "/create",

  upload.fields([
    {
      name: "profileImage",
      maxCount: 1,
    },
  ]),

  createProfile
);



// ================= GET ALL PROFILES =================

router.get(
  "/all",
  getProfiles
);



// ================= GET SINGLE PROFILE =================

router.get(
  "/:id",
  getProfileById
);



// ================= UPDATE PROFILE =================

router.put(
  "/update/:id",

  upload.fields([
    {
      name: "profileImage",
      maxCount: 1,
    },
  ]),

  updateProfile
);



// ================= DELETE PROFILE =================

router.delete(
  "/delete/:id",
  deleteProfile
); 

module.exports = router;