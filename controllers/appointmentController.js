// const Appointment = require(
//   "../models/appointmentModel"
// );

// const Doctor = require(
//   "../models/doctorModel"
// );



// /* =========================
//    📅 BOOK APPOINTMENT
// ========================= */

// exports.bookAppointment =
//   async (req, res) => {

//     try {

//       const {

//         doctorId,

//         patientName,
//         age,
//         gender,
//         reason,

//         date,
//         time,
//         type,

//         latitude,
//         longitude,

//         // ✅ VITALS
//         bloodPressure,
//         weight,
//         temperature,

//       } = req.body;


//       /* =========================
//          ✅ VALIDATION
//       ========================= */

//       if (
//         !doctorId ||
//         !patientName ||
//         !age ||
//         !gender ||
//         !date ||
//         !time ||
//         !type
//       ) {
//         return res.status(400).json({
//           success: false,
//           message:
//             "All fields are required",
//         });
//       }


//       /* =========================
//          ✅ CHECK DOCTOR
//       ========================= */

//       const doctor =
//         await Doctor.findById(
//           doctorId
//         );

//       if (!doctor) {

//         return res.status(404).json({
//           success: false,
//           message:
//             "Doctor not found",
//         });

//       }


//       /* =========================
//          ✅ CHECK SLOT
//       ========================= */

//       const existingAppointment =
//         await Appointment.findOne({

//           doctorId,
//           date,
//           time,

//           status: {
//             $ne: "cancelled",
//           },

//         });

//       if (existingAppointment) {

//         return res.status(400).json({
//           success: false,
//           message:
//             "Slot already booked",
//         });

//       }


//       /* =========================
//          ✅ GENERATE TOKEN
//       ========================= */

//       const totalAppointments =
//         await Appointment.countDocuments({

//           doctorId,
//           date,

//         });

//       const token =
//         totalAppointments + 1;


//       /* =========================
//          ✅ CREATE APPOINTMENT
//       ========================= */

//       const appointment =
//         await Appointment.create({

//           userId:
//             req.user._id,

//           doctorId,

//           patientName,
//           age,
//           gender,
//           reason,

//           token,

//           date,
//           time,
//           type,

//           latitude,
//           longitude,

//           // ✅ VITALS
//           bloodPressure,
//           weight,
//           temperature,

//         });


//       /* =========================
//          ✅ RESPONSE
//       ========================= */

//       res.status(201).json({

//         success: true,

//         message:
//           "Appointment booked successfully",

//         data: appointment,

//       });

//     } catch (error) {

//       console.log(
//         "BOOK APPOINTMENT ERROR =>",
//         error
//       );

//       res.status(500).json({

//         success: false,

//         message:
//           error.message,

//       });

//     }

//   };





// /* =========================
//    📄 GET MY APPOINTMENTS
// ========================= */

// exports.getMyAppointments =
//   async (req, res) => {

//     try {

//       const appointments =
//         await Appointment.find({

//           userId:
//             req.user._id,

//         })

//           .populate(
//             "doctorId",
//             "name speciality fees image"
//           )

//           .sort({
//             createdAt: -1,
//           });


//       res.json({

//         success: true,

//         count:
//           appointments.length,

//         data:
//           appointments,

//       });

//     } catch (error) {

//       res.status(500).json({

//         success: false,

//         message:
//           error.message,

//       });

//     }

//   };





// /* =========================
//    👨‍⚕️ GET DOCTOR APPOINTMENTS
// ========================= */

// exports.getDoctorAppointments =
//   async (req, res) => {

//     try {

//       const appointments =
//         await Appointment.find({

//           doctorId:
//             req.doctor._id,

//         })

//           .populate(
//             "userId",
//             "fullname email phone"
//           )

//           .sort({
//             createdAt: -1,
//           });


//       res.json({

//         success: true,

//         count:
//           appointments.length,

//         data:
//           appointments,

//       });

//     } catch (error) {

//       res.status(500).json({

//         success: false,

//         message:
//           error.message,

//       });

//     }

//   };





// /* =========================
//    🔍 GET SINGLE APPOINTMENT
// ========================= */

// exports.getAppointmentById =
//   async (req, res) => {

//     try {

//       const appointment =
//         await Appointment.findById(
//           req.params.id
//         )

//           .populate(
//             "doctorId",
//             "name speciality fees image"
//           )

//           .populate(
//             "userId",
//             "fullname email phone"
//           );


//       if (!appointment) {

//         return res.status(404).json({

//           success: false,

//           message:
//             "Appointment not found",

//         });

//       }


//       res.json({

//         success: true,

//         data:
//           appointment,

//       });

//     } catch (error) {

//       res.status(500).json({

//         success: false,

//         message:
//           error.message,

//       });

//     }

//   };





// /* =========================
//    ❌ CANCEL APPOINTMENT
// ========================= */

// exports.cancelAppointment =
//   async (req, res) => {

//     try {

//       const appointment =
//         await Appointment.findById(
//           req.params.id
//         );

//       if (!appointment) {

//         return res.status(404).json({

//           success: false,

//           message:
//             "Appointment not found",

//         });

//       }


//       appointment.status =
//         "cancelled";

//       await appointment.save();


//       res.json({

//         success: true,

//         message:
//           "Appointment cancelled successfully",

//         data:
//           appointment,

//       });

//     } catch (error) {

//       res.status(500).json({

//         success: false,

//         message:
//           error.message,

//       });

//     }

//   };





// /* =========================
//    ✅ COMPLETE APPOINTMENT
// ========================= */

// exports.completeAppointment =
//   async (req, res) => {

//     try {

//       const appointment =
//         await Appointment.findById(
//           req.params.id
//         );

//       if (!appointment) {

//         return res.status(404).json({

//           success: false,

//           message:
//             "Appointment not found",

//         });

//       }


//       appointment.status =
//         "completed";

//       await appointment.save();


//       res.json({

//         success: true,

//         message:
//           "Appointment completed successfully",

//         data:
//           appointment,

//       });

//     } catch (error) {

//       res.status(500).json({

//         success: false,

//         message:
//           error.message,

//       });

//     }

//   };





// /* =========================
//    🩺 UPDATE VITALS
// ========================= */

// exports.updateVitals =
//   async (req, res) => {

//     try {

//       const {

//         bloodPressure,
//         weight,
//         temperature,

//       } = req.body;


//       const appointment =
//         await Appointment.findById(
//           req.params.id
//         );


//       if (!appointment) {

//         return res.status(404).json({

//           success: false,

//           message:
//             "Appointment not found",

//         });

//       }


//       appointment.bloodPressure =
//         bloodPressure ||
//         appointment.bloodPressure;

//       appointment.weight =
//         weight ||
//         appointment.weight;

//       appointment.temperature =
//         temperature ||
//         appointment.temperature;


//       await appointment.save();


//       res.json({

//         success: true,

//         message:
//           "Vitals updated successfully",

//         data:
//           appointment,

//       });

//     } catch (error) {

//       res.status(500).json({

//         success: false,

//         message:
//           error.message,

//       });

//     }

//   };


const Appointment = require(
  "../models/appointmentModel"
);

const Doctor = require(
  "../models/doctorModel"
);

// ✅ IMPORTANT
require("../models/userModel");





/* =========================
   📅 BOOK APPOINTMENT
========================= */

exports.bookAppointment =
  async (req, res) => {

    try {

      const {

        doctorId,

        patientName,
        age,
        gender,
        reason,

        date,
        time,
        type,

        latitude,
        longitude,

        bloodPressure,
        weight,
        temperature,

      } = req.body;





      /* =========================
         ✅ VALIDATION
      ========================= */

      if (

        !doctorId ||
        !patientName ||
        !age ||
        !gender ||
        !date ||
        !time ||
        !type

      ) {

        return res.status(400).json({

          success: false,

          message:
            "All fields are required",

        });

      }





      /* =========================
         ✅ CHECK DOCTOR
      ========================= */

      const doctor =
        await Doctor.findById(
          doctorId
        );



      if (!doctor) {

        return res.status(404).json({

          success: false,

          message:
            "Doctor not found",

        });

      }





      /* =========================
         ✅ CHECK SLOT
      ========================= */

      const existingAppointment =
        await Appointment.findOne({

          doctorId,
          date,
          time,

          status: {
            $ne: "cancelled",
          },

        });





      if (existingAppointment) {

        return res.status(400).json({

          success: false,

          message:
            "Slot already booked",

        });

      }





      /* =========================
         ✅ GENERATE TOKEN
      ========================= */

      const totalAppointments =
        await Appointment.countDocuments({

          doctorId,
          date,

        });





      const token =
        totalAppointments + 1;





      /* =========================
         ✅ CREATE APPOINTMENT
      ========================= */

      const appointment =
        await Appointment.create({

          userId:
            req.user._id,

          doctorId,

          patientName,
          age,
          gender,
          reason,

          token,

          date,
          time,
          type,

          latitude,
          longitude,

          bloodPressure,
          weight,
          temperature,

          status:
            "approved",

        });





      /* =========================
         ✅ RESPONSE
      ========================= */

      res.status(201).json({

        success: true,

        message:
          "Appointment booked successfully",

        data:
          appointment,

      });

    } catch (error) {

      console.log(
        "BOOK APPOINTMENT ERROR =>",
        error
      );

      res.status(500).json({

        success: false,

        message:
          error.message,

      });

    }

  };







/* =========================
   📄 GET MY APPOINTMENTS
========================= */

exports.getMyAppointments =
  async (req, res) => {

    try {

      const appointments =
        await Appointment.find({

          userId:
            req.user._id,

        })

          .populate(

            "doctorId",

            "name speciality fees image"

          )

          .sort({
            createdAt: -1,
          });





      res.status(200).json({

        success: true,

        count:
          appointments.length,

        data:
          appointments,

      });

    } catch (error) {

      console.log(error);

      res.status(500).json({

        success: false,

        message:
          error.message,

      });

    }

  };







/* =========================
   👨‍⚕️ GET DOCTOR APPOINTMENTS
========================= */

exports.getDoctorAppointments =
  async (req, res) => {

    try {

      const appointments =
        await Appointment.find({

          doctorId:
            req.doctor._id,

        })

          .populate(

            "userId",

            "fullname email phone profileImage"

          )

          .populate(

            "doctorId",

            "name speciality fees image"

          )

          .sort({
            createdAt: -1,
          });





      res.status(200).json({

        success: true,

        count:
          appointments.length,

        data:
          appointments,

      });

    } catch (error) {

      console.log(
        "GET DOCTOR APPOINTMENTS ERROR =>",
        error
      );

      res.status(500).json({

        success: false,

        message:
          error.message,

      });

    }

  };







/* =========================
   🔍 GET SINGLE APPOINTMENT
========================= */

exports.getAppointmentById =
  async (req, res) => {

    try {

      const appointment =
        await Appointment.findById(
          req.params.id
        )

          .populate(

            "doctorId",

            "name speciality fees image"

          )

          .populate(

            "userId",

            "fullname email phone profileImage"

          );





      if (!appointment) {

        return res.status(404).json({

          success: false,

          message:
            "Appointment not found",

        });

      }





      res.status(200).json({

        success: true,

        data:
          appointment,

      });

    } catch (error) {

      console.log(error);

      res.status(500).json({

        success: false,

        message:
          error.message,

      });

    }

  };







/* =========================
   ❌ CANCEL APPOINTMENT
========================= */

exports.cancelAppointment =
  async (req, res) => {

    try {

      const appointment =
        await Appointment.findById(
          req.params.id
        );





      if (!appointment) {

        return res.status(404).json({

          success: false,

          message:
            "Appointment not found",

        });

      }





      appointment.status =
        "cancelled";





      await appointment.save();





      res.status(200).json({

        success: true,

        message:
          "Appointment cancelled successfully",

        data:
          appointment,

      });

    } catch (error) {

      console.log(error);

      res.status(500).json({

        success: false,

        message:
          error.message,

      });

    }

  };







/* =========================
   ✅ COMPLETE APPOINTMENT
========================= */

exports.completeAppointment =
  async (req, res) => {

    try {

      const appointment =
        await Appointment.findById(
          req.params.id
        );





      if (!appointment) {

        return res.status(404).json({

          success: false,

          message:
            "Appointment not found",

        });

      }





      appointment.status =
        "completed";





      await appointment.save();





      res.status(200).json({

        success: true,

        message:
          "Appointment completed successfully",

        data:
          appointment,

      });

    } catch (error) {

      console.log(error);

      res.status(500).json({

        success: false,

        message:
          error.message,

      });

    }

  };







/* =========================
   🩺 UPDATE VITALS
========================= */

exports.updateVitals =
  async (req, res) => {

    try {

      const {

        bloodPressure,
        weight,
        temperature,

      } = req.body;





      const appointment =
        await Appointment.findById(
          req.params.id
        );





      if (!appointment) {

        return res.status(404).json({

          success: false,

          message:
            "Appointment not found",

        });

      }





      appointment.bloodPressure =
        bloodPressure ||
        appointment.bloodPressure;

      appointment.weight =
        weight ||
        appointment.weight;

      appointment.temperature =
        temperature ||
        appointment.temperature;





      await appointment.save();





      res.status(200).json({

        success: true,

        message:
          "Vitals updated successfully",

        data:
          appointment,

      });

    } catch (error) {

      console.log(error);

      res.status(500).json({

        success: false,

        message:
          error.message,

      });

    }

  };
