const PetProduct = require("../models/PetProductModel");

const {
  uploadFile,
  deleteFile,
} = require("../utils/bunnyUpload");



// ================= CREATE =================

exports.createPetProduct = async (req, res) => {

  try {

    const {
      title,
      shortDescription,
      description,

      petCategory,

      needType,

      price,

      weight,     // ✅ ADD
      flavor,     // ✅ ADD
      ageType,    // ✅ ADD

      rating,
      stock,

    } = req.body;


    let imageData = {};

    // IMAGE
    if (req.files?.image?.[0]) {

      const uploaded = await uploadFile(
        req.files.image[0]
      );

      imageData = {
        url: uploaded.url,
        publicId: uploaded.publicId,
      };
    }


    const data = await PetProduct.create({

      title,

      shortDescription,

      description,

      petCategory,

      needType,

      price,

      // ✅ ADD THESE
      weight,
      flavor,
      ageType,

      rating,

      stock,

      image: imageData,
    });


    res.status(201).json({

      success: true,

      message: "Product created successfully",

      data,
    });

  } catch (err) {

    console.log(err);

    res.status(500).json({

      success: false,

      message: err.message,
    });
  }
};



// ================= GET ALL =================

exports.getPetProducts = async (req, res) => {

  try {

    let filter = {};


    // CATEGORY FILTER
    if (req.query.petCategory) {

      filter.petCategory =
        req.query.petCategory;
    }


    // NEED TYPE FILTER
    if (req.query.needType) {

      filter.needType =
        req.query.needType;
    }


    // ✅ AGE TYPE FILTER
    if (req.query.ageType) {

      filter.ageType =
        req.query.ageType;
    }


    const data = await PetProduct.find(filter)

      .populate("petCategory")

      .sort({ createdAt: -1 });


    res.json({

      success: true,

      count: data.length,

      data,
    });

  } catch (err) {

    res.status(500).json({

      success: false,

      message: err.message,
    });
  }
};



// ================= GET SINGLE =================

exports.getPetProductById = async (req, res) => {

  try {

    const item = await PetProduct.findById(
      req.params.id
    ).populate("petCategory");


    if (!item) {

      return res.status(404).json({

        success: false,

        message: "Product not found",
      });
    }


    res.json({

      success: true,

      data: item,
    });

  } catch (err) {

    res.status(500).json({

      success: false,

      message: err.message,
    });
  }
};



// ================= UPDATE =================

exports.updatePetProduct = async (req, res) => {

  try {

    const item = await PetProduct.findById(
      req.params.id
    );

    if (!item) {

      return res.status(404).json({

        success: false,

        message: "Product not found",
      });
    }


    const {
      title,
      shortDescription,
      description,

      petCategory,

      needType,

      price,

      weight,     // ✅ ADD
      flavor,     // ✅ ADD
      ageType,    // ✅ ADD

      rating,
      stock,

    } = req.body;


    item.title =
      title || item.title;

    item.shortDescription =
      shortDescription || item.shortDescription;

    item.description =
      description || item.description;

    item.petCategory =
      petCategory || item.petCategory;

    item.needType =
      needType || item.needType;

    item.price =
      price || item.price;

    // ✅ ADD THESE
    item.weight =
      weight || item.weight;

    item.flavor =
      flavor || item.flavor;

    item.ageType =
      ageType || item.ageType;

    item.rating =
      rating || item.rating;

    item.stock =
      stock || item.stock;


    // IMAGE UPDATE
    if (req.files?.image?.[0]) {

      // DELETE OLD
      if (item.image?.publicId) {

        await deleteFile(
          item.image.publicId
        );
      }

      const uploaded = await uploadFile(
        req.files.image[0]
      );

      item.image = {

        url: uploaded.url,

        publicId: uploaded.publicId,
      };
    }


    await item.save();

    res.json({

      success: true,

      message: "Product updated successfully",

      data: item,
    });

  } catch (err) {

    res.status(500).json({

      success: false,

      message: err.message,
    });
  }
};



// ================= DELETE =================

exports.deletePetProduct = async (req, res) => {

  try {

    const item = await PetProduct.findById(
      req.params.id
    );

    if (!item) {

      return res.status(404).json({

        success: false,

        message: "Product not found",
      });
    }


    // DELETE IMAGE
    if (item.image?.publicId) {

      await deleteFile(
        item.image.publicId
      );
    }

    await item.deleteOne();

    res.json({

      success: true,

      message: "Product deleted successfully",
    });

  } catch (err) {

    res.status(500).json({

      success: false,

      message: err.message,
    });
  }
};