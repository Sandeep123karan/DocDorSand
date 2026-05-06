const express = require("express");

const router = express.Router();

const upload = require("../middleware/upload");

const {

  createPetProduct,
  getPetProducts,
  getPetProductById,
  updatePetProduct,
  deletePetProduct,

} = require("../controllers/petProductController");


// CREATE
router.post(
  "/",
  upload.fields([
    {
      name: "image",
      maxCount: 1,
    },
  ]),
  createPetProduct
);


// GET ALL
router.get("/", getPetProducts);


// GET SINGLE
router.get("/:id", getPetProductById);


// UPDATE
router.put(
  "/:id",
  upload.fields([
    {
      name: "image",
      maxCount: 1,
    },
  ]),
  updatePetProduct
);


// DELETE
router.delete("/:id", deletePetProduct);


module.exports = router;