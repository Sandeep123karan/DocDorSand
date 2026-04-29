// const Category = require("../models/category");
// const { uploadToBunny } = require("../utils/bunnyUpload");
// const axios = require("axios");

// // ==========================================
// // 🔥 DELETE IMAGE FROM BUNNY
// // ==========================================
// const deleteFromBunny = async (publicId) => {
//   try {
//     if (!publicId) return;

//     const url = `${process.env.BUNNY_STORAGE}/${publicId}`;

//     await axios.delete(url, {
//       headers: {
//         AccessKey: process.env.BUNNY_API_KEY,
//       },
//     });
//   } catch (err) {
//     console.log("Bunny delete error:", err.message);
//   }
// };

// // ==========================================
// // 🔥 CREATE CATEGORY
// // ==========================================
// exports.createCategory = async (req, res) => {
//   try {
//     const { title, image, isFree } = req.body;
    

//     if (!title || title.trim() === "") {
//       return res.status(400).json({
//         success: false,
//         message: "Title is required",
//       });
//     }

//     // duplicate check
//     const exists = await Category.findOne({ title: title.trim() });
//     if (exists) {
//       return res.status(400).json({
//         success: false,
//         message: "Category already exists",
//       });
//     }

//     let imageData = {
//       url: "",
//       publicId: "",
//     };

//     // ✅ CASE 1: file upload (Bunny CDN)
//     if (req.file) {
//       imageData = await uploadToBunny(req.file);
//     }

//     // ✅ CASE 2: direct image URL
//     else if (image) {
//       imageData = {
//         url: image,
//         publicId: "",
//       };
//     }

//     const category = await Category.create({
//       title: title.trim(),
//       image: imageData,
//       isFree: isFree ?? false,
//     });

//     return res.status(201).json({
//       success: true,
//       message: "Category created successfully",
//       data: category,
//     });
//   } catch (error) {
//     return res.status(500).json({
//       success: false,
//       message: error.message,
//     });
//   }
// };

// // ==========================================
// // 🔥 GET ALL CATEGORIES
// // ==========================================
// exports.getCategories = async (req, res) => {
//   try {
//     const categories = await Category.find({ isActive: true })
//       .sort({ createdAt: -1 })
//       .lean();

//     return res.status(200).json({
//       success: true,
//       count: categories.length,
//       data: categories,
//     });
//   } catch (error) {
//     return res.status(500).json({
//       success: false,
//       message: error.message,
//     });
//   }
// };

// // ==========================================
// // 🔥 GET CATEGORY BY ID
// // ==========================================
// exports.getCategoryById = async (req, res) => {
//   try {
//     const category = await Category.findById(req.params.id).lean();

//     if (!category) {
//       return res.status(404).json({
//         success: false,
//         message: "Category not found",
//       });
//     }

//     return res.status(200).json({
//       success: true,
//       data: category,
//     });
//   } catch (error) {
//     return res.status(500).json({
//       success: false,
//       message: error.message,
//     });
//   }
// };

// // ==========================================
// // 🔥 UPDATE CATEGORY
// // ==========================================
// exports.updateCategory = async (req, res) => {
//   try {
//   const { title, isActive, image, isFree } = req.body;
//   if (typeof isFree !== "undefined") {
//   updateData.isFree = isFree;
// }

//     let updateData = {};

//     if (title && title.trim() !== "") {
//       updateData.title = title.trim();
//     }

//     if (typeof isActive !== "undefined") {
//       updateData.isActive = isActive;
//     }

//     const existing = await Category.findById(req.params.id);

//     if (!existing) {
//       return res.status(404).json({
//         success: false,
//         message: "Category not found",
//       });
//     }

//     // ✅ CASE 1: new file upload
//     if (req.file) {
//       if (existing?.image?.publicId) {
//         await deleteFromBunny(existing.image.publicId);
//       }

//       const imageData = await uploadToBunny(req.file);
//       updateData.image = imageData;
//     }

//     // ✅ CASE 2: image URL update
//     else if (image) {
//       updateData.image = {
//         url: image,
//         publicId: "",
//       };
//     }

//     const updated = await Category.findByIdAndUpdate(
//       req.params.id,
//       updateData,
//       { new: true, runValidators: true }
//     );

//     return res.status(200).json({
//       success: true,
//       message: "Category updated successfully",
//       data: updated,
//     });
//   } catch (error) {
//     return res.status(500).json({
//       success: false,
//       message: error.message,
//     });
//   }
// };

// // ==========================================
// // 🔥 DELETE CATEGORY
// // ==========================================
// exports.deleteCategory = async (req, res) => {
//   try {
//     const category = await Category.findById(req.params.id);

//     if (!category) {
//       return res.status(404).json({
//         success: false,
//         message: "Category not found",
//       });
//     }

//     // delete image from bunny
//     if (category?.image?.publicId) {
//       await deleteFromBunny(category.image.publicId);
//     }

//     await Category.findByIdAndDelete(req.params.id);

//     return res.status(200).json({
//       success: true,
//       message: "Category deleted successfully",
//     });
//   } catch (error) {
//     return res.status(500).json({
//       success: false,
//       message: error.message,
//     });
//   }
// };

// // ==========================================
// // 🔥 TOGGLE STATUS
// // ==========================================
// exports.toggleCategoryStatus = async (req, res) => {
//   try {
//     const category = await Category.findById(req.params.id);

//     if (!category) {
//       return res.status(404).json({
//         success: false,
//         message: "Category not found",
//       });
//     }

//     category.isActive = !category.isActive;
//     await category.save();

//     return res.status(200).json({
//       success: true,
//       message: "Category status updated",
//       data: category,
//     });
//   } catch (error) {
//     return res.status(500).json({
//       success: false,
//       message: error.message,
//     });
//   }
// };



const Category = require("../models/category");
const { uploadToBunny } = require("../utils/bunnyUpload");
const axios = require("axios");

// ==========================================
// 🔥 DELETE IMAGE FROM BUNNY
// ==========================================
const deleteFromBunny = async (publicId) => {
  try {
    if (!publicId) return;
    const url = `${process.env.BUNNY_STORAGE}/${publicId}`;
    await axios.delete(url, {
      headers: { AccessKey: process.env.BUNNY_API_KEY },
    });
  } catch (err) {
    console.log("Bunny delete error:", err.message);
  }
};

// ==========================================
// 🔥 CREATE CATEGORY
// ==========================================
exports.createCategory = async (req, res) => {
  try {
    const { title, image, isFree } = req.body;

    if (!title || title.trim() === "") {
      return res.status(400).json({ success: false, message: "Title is required" });
    }

    const exists = await Category.findOne({ title: title.trim() });
    if (exists) {
      return res.status(400).json({ success: false, message: "Category already exists" });
    }

    let imageData = { url: "", publicId: "" };

    if (req.file) {
      imageData = await uploadToBunny(req.file);
    } else if (image) {
      imageData = { url: image, publicId: "" };
    }

    const category = await Category.create({
      title: title.trim(),
      image: imageData,
      isFree: isFree === "true" || isFree === true || false,
    });

    return res.status(201).json({
      success: true,
      message: "Category created successfully",
      data: category,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// ==========================================
// 🔥 GET ALL CATEGORIES
// ==========================================
exports.getCategories = async (req, res) => {
  try {
    const categories = await Category.find()
      .sort({ createdAt: -1 })
      .lean();

    return res.status(200).json({
      success: true,
      count: categories.length,
      data: categories,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// ==========================================
// 🔥 GET CATEGORY BY ID
// ==========================================
exports.getCategoryById = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id).lean();

    if (!category) {
      return res.status(404).json({ success: false, message: "Category not found" });
    }

    return res.status(200).json({ success: true, data: category });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// ==========================================
// 🔥 UPDATE CATEGORY  ← BUG FIXED HERE
// ==========================================
exports.updateCategory = async (req, res) => {
  try {
    const { title, isActive, image, isFree } = req.body;

    // ✅ FIX: updateData pehle declare karo
    let updateData = {};

    if (title && title.trim() !== "") {
      updateData.title = title.trim();
    }

    if (typeof isActive !== "undefined") {
      updateData.isActive = isActive === "true" || isActive === true;
    }

    // ✅ FIX: isFree string bhi ho sakta hai FormData se
    if (typeof isFree !== "undefined") {
      updateData.isFree = isFree === "true" || isFree === true;
    }

    const existing = await Category.findById(req.params.id);

    if (!existing) {
      return res.status(404).json({ success: false, message: "Category not found" });
    }

    if (req.file) {
      if (existing?.image?.publicId) {
        await deleteFromBunny(existing.image.publicId);
      }
      const imageData = await uploadToBunny(req.file);
      updateData.image = imageData;
    } else if (image) {
      updateData.image = { url: image, publicId: "" };
    }

    const updated = await Category.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    return res.status(200).json({
      success: true,
      message: "Category updated successfully",
      data: updated,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// ==========================================
// 🔥 DELETE CATEGORY
// ==========================================
exports.deleteCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);

    if (!category) {
      return res.status(404).json({ success: false, message: "Category not found" });
    }

    if (category?.image?.publicId) {
      await deleteFromBunny(category.image.publicId);
    }

    await Category.findByIdAndDelete(req.params.id);

    return res.status(200).json({ success: true, message: "Category deleted successfully" });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// ==========================================
// 🔥 TOGGLE STATUS
// ==========================================
exports.toggleCategoryStatus = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);

    if (!category) {
      return res.status(404).json({ success: false, message: "Category not found" });
    }

    category.isActive = !category.isActive;
    await category.save();

    return res.status(200).json({
      success: true,
      message: `Category ${category.isActive ? "activated" : "deactivated"}`,
      data: category,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};