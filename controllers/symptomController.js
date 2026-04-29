const Symptom = require("../models/symptomModel");
const { uploadFile, deleteFile } = require("../utils/bunnyUpload");

// 🔥 COMMON FUNCTION (STRING → ARRAY FIX)
const parseDoctors = (doctors) => {
  if (!doctors) return [];
  if (Array.isArray(doctors)) return doctors;
  if (typeof doctors === "string") {
    try {
      return JSON.parse(doctors);
    } catch {
      return [doctors];
    }
  }
  return [];
};

// ✅ CREATE SYMPTOM
exports.createSymptom = async (req, res) => {
  try {
    console.log("📝 Creating symptom...");
    console.log("Body:", req.body);
    console.log("Files:", req.files ? "Has files" : "No files");
    
    const { name, color, doctors } = req.body;

    if (!name) {
      return res.status(400).json({
        success: false,
        message: "Name is required"
      });
    }

    let imageData = {
      url: "https://via.placeholder.com/400x400?text=Symptom",
      publicId: "default"
    };

    // Handle image upload
    if (req.files && req.files.image && req.files.image.length > 0) {
      const file = req.files.image[0];
      console.log("📸 Processing image:", file.originalname);
      
      try {
        const uploadRes = await uploadFile(file);
        imageData = {
          url: uploadRes.url,
          publicId: uploadRes.publicId
        };
        console.log("✅ Image processed successfully");
      } catch (uploadError) {
        console.error("❌ Image processing error:", uploadError);
        // Keep default image
      }
    }

    const symptom = await Symptom.create({
      name,
      color: color || "#3b82f6",
      doctors: parseDoctors(doctors),
      image: imageData
    });

    console.log("✅ Symptom created:", symptom._id);

    res.status(201).json({
      success: true,
      data: symptom,
      message: "Symptom created successfully"
    });

  } catch (error) {
    console.error("❌ CREATE SYMPTOM ERROR:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to create symptom"
    });
  }
};

// ✅ UPDATE SYMPTOM
exports.updateSymptom = async (req, res) => {
  try {
    console.log("✏️ Updating symptom:", req.params.id);
    
    const symptom = await Symptom.findById(req.params.id);

    if (!symptom) {
      return res.status(404).json({ 
        success: false, 
        message: "Symptom not found" 
      });
    }

    const { name, color, doctors } = req.body;

    if (name) symptom.name = name;
    if (color) symptom.color = color;
    if (doctors) symptom.doctors = parseDoctors(doctors);

    // Handle image update
    if (req.files && req.files.image && req.files.image.length > 0) {
      const file = req.files.image[0];
      console.log("📸 Updating image:", file.originalname);
      
      try {
        const uploadRes = await uploadFile(file);
        symptom.image = {
          url: uploadRes.url,
          publicId: uploadRes.publicId
        };
        console.log("✅ Image updated successfully");
      } catch (uploadError) {
        console.error("❌ Image update error:", uploadError);
        // Keep old image if update fails
      }
    }

    await symptom.save();

    console.log("✅ Symptom updated:", symptom._id);

    res.json({ 
      success: true, 
      data: symptom,
      message: "Symptom updated successfully"
    });

  } catch (error) {
    console.error("❌ UPDATE SYMPTOM ERROR:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to update symptom"
    });
  }
};

// GET ALL SYMPTOMS (Keep as is)
exports.getSymptoms = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 9;
    const skip = (page - 1) * limit;

    const total = await Symptom.countDocuments();
    const data = await Symptom.find()
      .populate("doctors")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.json({
      success: true,
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      data
    });

  } catch (error) {
    console.error("GET SYMPTOMS ERROR:", error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// GET SINGLE SYMPTOM
exports.getSymptomById = async (req, res) => {
  try {
    const data = await Symptom.findById(req.params.id).populate("doctors");

    if (!data) {
      return res.status(404).json({ 
        success: false, 
        message: "Symptom not found" 
      });
    }

    res.json({ success: true, data });

  } catch (error) {
    console.error("GET SYMPTOM ERROR:", error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// DELETE SYMPTOM
exports.deleteSymptom = async (req, res) => {
  try {
    const symptom = await Symptom.findById(req.params.id);

    if (!symptom) {
      return res.status(404).json({ 
        success: false, 
        message: "Symptom not found" 
      });
    }

    await symptom.deleteOne();

    res.json({ 
      success: true, 
      message: "Symptom deleted successfully" 
    });

  } catch (error) {
    console.error("DELETE SYMPTOM ERROR:", error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};