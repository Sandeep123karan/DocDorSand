const MedicineItem = require("../models/medicineItem.model");
const { uploadFile, deleteFile } = require("../utils/bunnyUpload");


// ================= CREATE =================
exports.createMedicine = async (req, res) => {
  try {
    const { name, description, price } = req.body;  // ✅ REMOVED subCategory

    // 🔹 validation - ONLY name and price required
    if (!name || !price) {
      return res.status(400).json({
        success: false,
        message: "Name & price required"
      });
    }

    let imageData = null;

    // ✅ CASE 1: FILE (form-data)
    if (req.files && req.files.image && req.files.image.length > 0) {
      const uploadRes = await uploadFile(req.files.image[0]);

      imageData = {
        url: uploadRes.url,
        publicId: uploadRes.publicId
      };
    }

    // ✅ CASE 2: JSON (raw body)
    else if (req.body.image) {
      let img = req.body.image;

      // agar string me aaye (kabhi form-data se)
      if (typeof img === "string") {
        try {
          img = JSON.parse(img);
        } catch (e) {}
      }

      if (img?.url && img?.publicId) {
        imageData = img;
      }
    }

    // ❌ image required
    if (!imageData) {
      return res.status(400).json({
        success: false,
        message: "Image required"
      });
    }

    const data = await MedicineItem.create({
      name,
      description: description || "",
      price,
      image: imageData
      // ❌ NO subCategory field here
    });

    res.status(201).json({
      success: true,
      data
    });

  } catch (err) {
    console.error("Create error:", err);
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
};

// ================= GET ALL =================
exports.getMedicines = async (req, res) => {
  try {
    const page = Math.max(parseInt(req.query.page) || 1, 1);
    const limit = Math.max(parseInt(req.query.limit) || 10, 1);
    const search = req.query.search || "";

    const skip = (page - 1) * limit;

    const query = {
      name: { $regex: search, $options: "i" }
    };

    const total = await MedicineItem.countDocuments(query);

    const medicines = await MedicineItem.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const formatted = medicines.map((item) => {
      const oldPrice = item.price || 0;
      const discount = Math.floor(Math.random() * 10) + 5;

      const newPrice = Math.round(
        oldPrice - (oldPrice * discount) / 100
      );

      return {
        id: item._id,
        name: item.name,
        description: item.description,
        type: "Strip of tablets",
        delivery: "Delivery by Tomorrow 9 PM",
        oldPrice,
        newPrice,
        discount: `${discount}% off`,
        prescription: false,
        imageUrl: item.image?.url || "",
        image: item.image
      };
    });

    res.json({
      success: true,
      page,
      limit,
      total,
      data: formatted
    });

  } catch (err) {
    console.error("Get all error:", err);
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
};

// ================= GET BY SUBCATEGORY =================
// Note: This endpoint will work only if you add subCategory back to schema
// For now, either remove this or return empty array
exports.getBySubCategory = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Since schema has no subCategory, return empty array
    // Or you can remove this endpoint entirely
    res.json({
      success: true,
      count: 0,
      data: []
    });

  } catch (err) {
    console.error("Get by subcategory error:", err);
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
};

// ================= GET ONE =================
exports.getMedicineById = async (req, res) => {
  try {
    const item = await MedicineItem.findById(req.params.id);

    if (!item) {
      return res.status(404).json({
        success: false,
        message: "Medicine not found"
      });
    }

    res.json({
      success: true,
      data: item
    });

  } catch (err) {
    console.error("Get by ID error:", err);
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
};

// ================= UPDATE =================
exports.updateMedicine = async (req, res) => {
  try {
    const item = await MedicineItem.findById(req.params.id);

    if (!item) {
      return res.status(404).json({
        success: false,
        message: "Medicine not found"
      });
    }

    const { name, description, price } = req.body;  // ✅ REMOVED subCategory

    if (name) item.name = name;
    if (description !== undefined) item.description = description;
    if (price) item.price = price;

    // 🔹 image update (file)
    if (req.files?.image?.length > 0) {
      if (item.image?.publicId) {
        await deleteFile(item.image.publicId);
      }

      const uploadRes = await uploadFile(req.files.image[0]);

      item.image = {
        url: uploadRes.url,
        publicId: uploadRes.publicId
      };
    }

    // 🔹 image update (JSON)
    else if (req.body.image) {
      let img = req.body.image;

      if (typeof img === "string") {
        try {
          img = JSON.parse(img);
        } catch (e) {}
      }

      if (img?.url && img?.publicId) {
        if (item.image?.publicId && item.image.publicId !== img.publicId) {
          await deleteFile(item.image.publicId);
        }
        item.image = img;
      }
    }

    await item.save();

    res.json({
      success: true,
      data: item
    });

  } catch (err) {
    console.error("Update error:", err);
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
};

// ================= DELETE =================
exports.deleteMedicine = async (req, res) => {
  try {
    const item = await MedicineItem.findById(req.params.id);

    if (!item) {
      return res.status(404).json({
        success: false,
        message: "Medicine not found"
      });
    }

    if (item.image?.publicId) {
      await deleteFile(item.image.publicId);
    }

    await item.deleteOne();

    res.json({
      success: true,
      message: "Medicine deleted successfully"
    });

  } catch (err) {
    console.error("Delete error:", err);
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
};