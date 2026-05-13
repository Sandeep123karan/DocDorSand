// const mongoose = require("mongoose");

// const appointmentSchema =
//   new mongoose.Schema(
//     {
//       userId: {
//         type:
//           mongoose.Schema.Types.ObjectId,
//         ref: "User",
//         required: true,
//       },

//       doctorId: {
//         type:
//           mongoose.Schema.Types.ObjectId,
//         ref: "Doctor",
//         required: true,
//       },

//       patientName: String,
//       age: Number,
//       gender: String,
//       reason: String,

//       token: Number,

//       date: {
//         type: String,
//         required: true,
//       },

//       time: {
//         type: String,
//         required: true,
//       },

//       type: {
//         type: String,
//         enum: [
//           "online",
//           "in-person",
//         ],
//         required: true,
//       },

//       latitude: Number,
//       longitude: Number,

//       // ✅ VITALS
//       bloodPressure: {
//         type: String,
//         default: "",
//       },

//       weight: {
//         type: String,
//         default: "",
//       },

//       temperature: {
//         type: String,
//         default: "",
//       },

//       // ✅ STATUS
//       status: {
//         type: String,
//         enum: [
//           "approved",
//           "completed",
//           "cancelled",
//         ],
//         default: "approved",
//       },
//     },
//     { timestamps: true }
//   );

// module.exports =
//   mongoose.model(
//     "Appointment",
//     appointmentSchema
//   );



const mongoose =
  require("mongoose");



const appointmentSchema =
  new mongoose.Schema(

    {

      // ✅ USER
      userId: {

        type:
          mongoose.Schema.Types.ObjectId,

        ref: "User",

        required: true,

      },



      // ✅ DOCTOR
      doctorId: {

        type:
          mongoose.Schema.Types.ObjectId,

        ref: "Doctor",

        required: true,

      },



      // ✅ PATIENT DETAILS
      patientName: {
        type: String,
        default: "",
      },

      age: {
        type: Number,
        default: 0,
      },

      gender: {
        type: String,
        default: "",
      },

      reason: {
        type: String,
        default: "",
      },



      // ✅ TOKEN
      token: {
        type: Number,
        default: 0,
      },



      // ✅ DATE & TIME
      date: {

        type: String,

        required: true,

      },

      time: {

        type: String,

        required: true,

      },



      // ✅ TYPE
      type: {

        type: String,

        enum: [
          "online",
          "in-person",
        ],

        required: true,

      },



      // ✅ LOCATION
      latitude: {
        type: Number,
        default: 0,
      },

      longitude: {
        type: Number,
        default: 0,
      },



      // ✅ VITALS
      bloodPressure: {

        type: String,

        default: "",

      },

      weight: {

        type: String,

        default: "",

      },

      temperature: {

        type: String,

        default: "",

      },



      // ✅ STATUS
      status: {

        type: String,

        enum: [

          "approved",

          "completed",

          "cancelled",

        ],

        default: "approved",

      },

    },

    {

      timestamps: true,

    }

  );





module.exports =

  mongoose.models.Appointment ||

  mongoose.model(
    "Appointment",
    appointmentSchema
  );
