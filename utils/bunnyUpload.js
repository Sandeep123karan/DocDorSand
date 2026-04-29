const axios = require('axios');
const FormData = require('form-data');

// Simple working upload without BunnyCDN for now
const uploadFile = async (file) => {
  try {
    console.log("📤 Uploading file:", file.originalname, file.size, "bytes");
    
    // For now, return a data URL (base64) that works directly
    const base64Image = file.buffer.toString('base64');
    const dataUrl = `data:${file.mimetype};base64,${base64Image}`;
    
    // Create a unique ID
    const uniqueId = Date.now() + '_' + Math.random().toString(36).substring(7);
    
    // Return image data that will be stored in database
    return {
      url: dataUrl, // Store the actual image data in DB
      publicId: uniqueId
    };
    
  } catch (error) {
    console.error("❌ Upload error:", error);
    // Return a default image
    return {
      url: "https://via.placeholder.com/400x400?text=No+Image",
      publicId: "default_" + Date.now()
    };
  }
};

const deleteFile = async (publicId) => {
  try {
    console.log("🗑️ Deleting file:", publicId);
    // Since images are stored in DB, nothing to delete from CDN
    return true;
  } catch (error) {
    console.error("Delete error:", error);
    return false;
  }
};

module.exports = { uploadFile, deleteFile };