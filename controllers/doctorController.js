// const Doctor = require("../models/doctorModel");
// const { uploadFile, deleteFile } = require("../utils/bunnyUpload");

// // ✅ CREATE DOCTOR
// exports.createDoctor = async (req, res) => {
//   try {
//     console.log("Request Body:", req.body);
//     console.log("Request Files:", req.files);
//     console.log("Headers:", req.headers["content-type"]);

//     const {
//       name,
//       degree,
//       speciality,
//       experience,
//       fees
//     } = req.body;

//     // 🔥 validation
//     if (!name) {
//       return res.status(400).json({
//         success: false,
//         message: "Name is required"
//       });
//     }

//     let imageData = null;

//     // ✅ Check for file upload
//     if (req.files && req.files.image && req.files.image.length > 0) {
//       const file = req.files.image[0];
//       console.log("File received:", file.originalname, file.size);
      
//       try {
//         const uploadRes = await uploadFile(file);
//         imageData = {
//           url: uploadRes.url,
//           publicId: uploadRes.publicId
//         };
//         console.log("Image uploaded successfully:", imageData);
//       } catch (uploadError) {
//         console.error("Upload error:", uploadError);
//         return res.status(500).json({
//           success: false,
//           message: "Failed to upload image: " + uploadError.message
//         });
//       }
//     } else {
//       console.log("No image file received");
//       // Check if image is in body (JSON)
//       if (req.body.image && typeof req.body.image === 'object') {
//         imageData = req.body.image;
//       }
//     }

//     // Create doctor object
//     const doctorData = {
//       name,
//       degree: degree || "",
//       speciality: speciality || "",
//       experience: experience || "",
//       fees: fees || 0
//     };

//     // Only add image if we have it
//     if (imageData) {
//       doctorData.image = imageData;
//     }

//     const doctor = await Doctor.create(doctorData);

//     res.status(201).json({
//       success: true,
//       message: "Doctor created successfully",
//       data: doctor
//     });

//   } catch (error) {
//     console.error("CREATE DOCTOR ERROR:", error);
//     res.status(500).json({
//       success: false,
//       message: error.message,
//       stack: process.env.NODE_ENV === "development" ? error.stack : undefined
//     });
//   }
// };

// // ✅ UPDATE DOCTOR
// exports.updateDoctor = async (req, res) => {
//   try {
//     const doctor = await Doctor.findById(req.params.id);

//     if (!doctor) {
//       return res.status(404).json({
//         success: false,
//         message: "Doctor not found"
//       });
//     }

//     const {
//       name,
//       degree,
//       speciality,
//       experience,
//       fees
//     } = req.body;

//     // 🔥 update fields
//     if (name) doctor.name = name;
//     if (degree !== undefined) doctor.degree = degree;
//     if (speciality !== undefined) doctor.speciality = speciality;
//     if (experience !== undefined) doctor.experience = experience;
//     if (fees !== undefined) doctor.fees = fees;

//     // ✅ Handle image update
//     if (req.files && req.files.image && req.files.image.length > 0) {
//       // Delete old image if exists
//       if (doctor.image?.publicId) {
//         try {
//           await deleteFile(doctor.image.publicId);
//         } catch (deleteError) {
//           console.error("Error deleting old image:", deleteError);
//         }
//       }

//       // Upload new image
//       const file = req.files.image[0];
//       const uploadRes = await uploadFile(file);
      
//       doctor.image = {
//         url: uploadRes.url,
//         publicId: uploadRes.publicId
//       };
//     }

//     await doctor.save();

//     res.status(200).json({
//       success: true,
//       message: "Doctor updated successfully",
//       data: doctor
//     });

//   } catch (error) {
//     console.error("UPDATE DOCTOR ERROR:", error);
//     res.status(500).json({
//       success: false,
//       message: error.message
//     });
//   }
// };

// // ✅ GET ALL DOCTORS
// exports.getDoctors = async (req, res) => {
//   try {
//     const { search } = req.query;

//     let filter = {};

//     if (search) {
//       filter.name = { $regex: search, $options: "i" };
//     }

//     const doctors = await Doctor.find(filter).sort({ createdAt: -1 });

//     res.status(200).json({
//       success: true,
//       count: doctors.length,
//       data: doctors
//     });

//   } catch (error) {
//     console.error("GET DOCTORS ERROR:", error);
//     res.status(500).json({
//       success: false,
//       message: error.message
//     });
//   }
// };

// // ✅ GET SINGLE DOCTOR
// exports.getDoctorById = async (req, res) => {
//   try {
//     const doctor = await Doctor.findById(req.params.id);

//     if (!doctor) {
//       return res.status(404).json({
//         success: false,
//         message: "Doctor not found"
//       });
//     }

//     res.status(200).json({
//       success: true,
//       data: doctor
//     });

//   } catch (error) {
//     console.error("GET DOCTOR ERROR:", error);
//     res.status(500).json({
//       success: false,
//       message: error.message
//     });
//   }
// };

// // ✅ DELETE DOCTOR
// exports.deleteDoctor = async (req, res) => {
//   try {
//     const doctor = await Doctor.findById(req.params.id);

//     if (!doctor) {
//       return res.status(404).json({
//         success: false,
//         message: "Doctor not found"
//       });
//     }

//     // Delete image from CDN if exists
//     if (doctor.image?.publicId) {
//       try {
//         await deleteFile(doctor.image.publicId);
//       } catch (deleteError) {
//         console.error("Error deleting image from CDN:", deleteError);
//       }
//     }

//     await doctor.deleteOne();

//     res.status(200).json({
//       success: true,
//       message: "Doctor deleted successfully"
//     });

//   } catch (error) {
//     console.error("DELETE DOCTOR ERROR:", error);
//     res.status(500).json({
//       success: false,
//       message: error.message
//     });
//   }
// };





const Doctor = require("../models/doctorModel");

const {
  uploadFile,
  deleteFile,
} = require("../utils/bunnyUpload");


// =====================================
// ✅ CREATE DOCTOR
// =====================================

exports.createDoctor = async (
  req,
  res
) => {
  try {
    console.log("BODY =>", req.body);

    const {
      name,
      degree,
      speciality,
      experience,
      fees,

      // ✅ LOCATION
      latitude,
      longitude,
      address,
      city,
      state,
      pincode,
    } = req.body;

    // ✅ Validation
    if (!name) {
      return res.status(400).json({
        success: false,
        message: "Name is required",
      });
    }

    if (!latitude || !longitude) {
      return res.status(400).json({
        success: false,
        message:
          "Latitude & longitude required",
      });
    }

    let imageData = null;

    // =====================================
    // ✅ IMAGE UPLOAD
    // =====================================

    if (
      req.files &&
      req.files.image &&
      req.files.image.length > 0
    ) {
      const file = req.files.image[0];

      const uploadRes =
        await uploadFile(file);

      imageData = {
        url: uploadRes.url,
        publicId:
          uploadRes.publicId,
      };
    }

    // =====================================
    // ✅ CREATE DOCTOR
    // =====================================

    const doctor =
      await Doctor.create({
        name,

        degree:
          degree || "",

        speciality:
          speciality || "",

        experience:
          experience || "",

        fees: fees || 0,

        // ✅ LOCATION
        location: {
          type: "Point",
          coordinates: [
            parseFloat(longitude),
            parseFloat(latitude),
          ],
        },

        address:
          address || "",

        city: city || "",

        state: state || "",

        pincode:
          pincode || "",

        image: imageData,
      });

    res.status(201).json({
      success: true,
      message:
        "Doctor created successfully",
      data: doctor,
    });
  } catch (error) {
    console.log(
      "CREATE ERROR =>",
      error
    );

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// =====================================
// ✅ UPDATE DOCTOR
// =====================================

exports.updateDoctor = async (
  req,
  res
) => {
  try {
    const doctor =
      await Doctor.findById(
        req.params.id
      );

    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: "Doctor not found",
      });
    }

    const {
      name,
      degree,
      speciality,
      experience,
      fees,

      // ✅ LOCATION
      latitude,
      longitude,
      address,
      city,
      state,
      pincode,
    } = req.body;

    // =====================================
    // ✅ UPDATE FIELDS
    // =====================================

    if (name) doctor.name = name;

    if (degree !== undefined)
      doctor.degree = degree;

    if (
      speciality !== undefined
    )
      doctor.speciality =
        speciality;

    if (
      experience !== undefined
    )
      doctor.experience =
        experience;

    if (fees !== undefined)
      doctor.fees = fees;

    // =====================================
    // ✅ UPDATE LOCATION
    // =====================================

    if (
      latitude &&
      longitude
    ) {
      doctor.location = {
        type: "Point",
        coordinates: [
          parseFloat(longitude),
          parseFloat(latitude),
        ],
      };
    }

    if (address !== undefined)
      doctor.address = address;

    if (city !== undefined)
      doctor.city = city;

    if (state !== undefined)
      doctor.state = state;

    if (pincode !== undefined)
      doctor.pincode =
        pincode;

    // =====================================
    // ✅ UPDATE IMAGE
    // =====================================

    if (
      req.files &&
      req.files.image &&
      req.files.image.length > 0
    ) {
      // delete old image
      if (
        doctor.image?.publicId
      ) {
        try {
          await deleteFile(
            doctor.image.publicId
          );
        } catch (err) {
          console.log(err);
        }
      }

      // upload new image
      const file =
        req.files.image[0];

      const uploadRes =
        await uploadFile(file);

      doctor.image = {
        url: uploadRes.url,
        publicId:
          uploadRes.publicId,
      };
    }

    await doctor.save();

    res.status(200).json({
      success: true,
      message:
        "Doctor updated successfully",
      data: doctor,
    });
  } catch (error) {
    console.log(
      "UPDATE ERROR =>",
      error
    );

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// =====================================
// ✅ GET ALL DOCTORS
// =====================================

exports.getDoctors = async (
  req,
  res
) => {
  try {
    const { search } =
      req.query;

    let filter = {
      isActive: true,
    };

    // ✅ SEARCH
    if (search) {
      filter.name = {
        $regex: search,
        $options: "i",
      };
    }

    const doctors =
      await Doctor.find(filter).sort({
        createdAt: -1,
      });

    res.status(200).json({
      success: true,
      count: doctors.length,
      data: doctors,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// =====================================
// ✅ GET SINGLE DOCTOR
// =====================================

exports.getDoctorById =
  async (req, res) => {
    try {
      const doctor =
        await Doctor.findById(
          req.params.id
        );

      if (!doctor) {
        return res.status(404).json({
          success: false,
          message:
            "Doctor not found",
        });
      }

      res.status(200).json({
        success: true,
        data: doctor,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  };


// =====================================
// ✅ GET NEARBY DOCTORS
// =====================================

exports.getNearbyDoctors =
  async (req, res) => {
    try {
      const {
        latitude,
        longitude,
      } = req.query;

      // ✅ validation
      if (
        !latitude ||
        !longitude
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Latitude & longitude required",
        });
      }

      // ✅ 10 KM nearby doctors
      const doctors =
        await Doctor.find({
          isActive: true,

          location: {
            $near: {
              $geometry: {
                type: "Point",

                coordinates: [
                  parseFloat(
                    longitude
                  ),
                  parseFloat(
                    latitude
                  ),
                ],
              },

              $maxDistance: 10000,
            },
          },
        });

      res.status(200).json({
        success: true,
        count: doctors.length,
        data: doctors,
      });
    } catch (error) {
      console.log(
        "NEARBY ERROR =>",
        error
      );

      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  };


// =====================================
// ✅ DELETE DOCTOR
// =====================================

exports.deleteDoctor = async (
  req,
  res
) => {
  try {
    const doctor =
      await Doctor.findById(
        req.params.id
      );

    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: "Doctor not found",
      });
    }

    // delete image
    if (
      doctor.image?.publicId
    ) {
      try {
        await deleteFile(
          doctor.image.publicId
        );
      } catch (err) {
        console.log(err);
      }
    }

    await doctor.deleteOne();

    res.status(200).json({
      success: true,
      message:
        "Doctor deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
