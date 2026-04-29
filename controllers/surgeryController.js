const Surgery = require("../models/surgeryModel");
const { uploadFile, deleteFile } = require("../utils/bunnyUpload");


// 🔥 parse doctors
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


// 🔥 parse benefits
const parseBenefits = (benefits) => {
  if (!benefits) return [];

  if (Array.isArray(benefits)) return benefits;

  if (typeof benefits === "string") {
    try {
      return JSON.parse(benefits);
    } catch {
      return [benefits];
    }
  }

  return [];
};


// ✅ CREATE
exports.createSurgery = async (req, res) => {
  try {
    const {
      name,
      category,
      duration,
      benefits,
      priceRange,
      doctors,
      icon
    } = req.body;

    if (!name || !category || !duration) {
      return res.status(400).json({
        success: false,
        message: "Name, category, duration required"
      });
    }

    let iconData = null;

    if (req.files?.icon?.length > 0) {
      const uploadRes = await uploadFile(req.files.icon[0]);
      iconData = {
        url: uploadRes.url,
        publicId: uploadRes.publicId
      };
    } else if (icon?.url && icon?.publicId) {
      iconData = icon;
    }

    if (!iconData) {
      return res.status(400).json({
        success: false,
        message: "Icon required"
      });
    }

    const data = await Surgery.create({
      name,
      category,
      duration,
      benefits: parseBenefits(benefits),
      priceRange,
      doctors: parseDoctors(doctors),
      icon: iconData
    });

    res.json({ success: true, data });

  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};


// ✅ GET ALL (PAGINATION + SEARCH)
exports.getSurgeries = async (req, res) => {
  try {
    const page = Math.max(parseInt(req.query.page) || 1, 1);
    const limit = Math.max(parseInt(req.query.limit) || 10, 1);
    const search = req.query.search || "";

    const skip = (page - 1) * limit;

    const query = {
      name: { $regex: search, $options: "i" }
    };

    const total = await Surgery.countDocuments(query);

    const data = await Surgery.find(query)
      .populate("doctors")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const totalPages = Math.max(Math.ceil(total / limit), 1);

    res.json({
      success: true,
      page,
      limit,
      total,
      totalPages,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1,
      nextPage: page < totalPages ? page + 1 : null,
      prevPage: page > 1 ? page - 1 : null,
      data
    });

  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};


// ✅ GET ONE
exports.getSurgeryById = async (req, res) => {
  const data = await Surgery.findById(req.params.id).populate("doctors");

  if (!data) return res.status(404).json({ success: false });

  res.json({ success: true, data });
};


// ✅ UPDATE
exports.updateSurgery = async (req, res) => {
  const item = await Surgery.findById(req.params.id);

  if (!item) return res.status(404).json({ success: false });

  const {
    name,
    category,
    duration,
    benefits,
    priceRange,
    doctors,
    icon
  } = req.body;

  if (name) item.name = name;
  if (category) item.category = category;
  if (duration) item.duration = duration;
  if (priceRange) item.priceRange = priceRange;

  if (benefits) item.benefits = parseBenefits(benefits);
  if (doctors) item.doctors = parseDoctors(doctors);

  if (req.files?.icon?.length > 0) {
    if (item.icon?.publicId) await deleteFile(item.icon.publicId);

    const uploadRes = await uploadFile(req.files.icon[0]);

    item.icon = {
      url: uploadRes.url,
      publicId: uploadRes.publicId
    };
  }

  else if (icon?.url && icon?.publicId) {
    if (item.icon?.publicId) await deleteFile(item.icon.publicId);
    item.icon = icon;
  }

  await item.save();

  res.json({ success: true, data: item });
};


// ✅ DELETE
exports.deleteSurgery = async (req, res) => {
  const item = await Surgery.findById(req.params.id);

  if (!item) return res.status(404).json({ success: false });

  if (item.icon?.publicId) await deleteFile(item.icon.publicId);

  await item.deleteOne();

  res.json({ success: true });
};