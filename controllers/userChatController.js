// controllers/userChatController.js

const UserChatConversation =
  require(
    "../models/userChatConversationModel"
  );

const UserChatMessage =
  require(
    "../models/userChatMessageModel"
  );

const Appointment =
  require(
    "../models/appointmentModel"
  );





/* =====================================================
   💬 START CHAT
===================================================== */

exports.startChat =
  async (req, res) => {

    try {

      const {
        appointmentId
      } = req.body;



      // ✅ FIND APPOINTMENT
      const appointment =
        await Appointment.findById(
          appointmentId
        );



      if (!appointment) {

        return res.status(404).json({

          success: false,

          message:
            "Appointment not found",

        });

      }



      // ✅ CHECK EXISTING CHAT
      let conversation =
        await UserChatConversation.findOne({

          appointmentId,

        });



      // ✅ CREATE NEW CHAT
      if (!conversation) {

        conversation =
          await UserChatConversation.create({

            appointmentId,

            userId:
              appointment.userId,

            doctorId:
              appointment.doctorId,

            lastMessage:
              "",

          });

      }



      // ✅ RESPONSE
      res.status(200).json({

        success: true,

        message:
          "Chat started successfully",

        data:
          conversation,

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







/* =====================================================
   📩 SEND MESSAGE
===================================================== */

exports.sendMessage =
  async (req, res) => {

    try {

      const {

        conversationId,

        message,

        messageType,

        fileUrl,

      } = req.body;



      // ✅ CHECK CHAT
      const conversation =
        await UserChatConversation.findById(
          conversationId
        );



      if (!conversation) {

        return res.status(404).json({

          success: false,

          message:
            "Conversation not found",

        });

      }



      // ✅ CREATE MESSAGE
      const newMessage =
        await UserChatMessage.create({

          conversationId,

          senderId:
            req.user._id,

          senderType:
            "user",

          message,

          messageType:
            messageType || "text",

          fileUrl:
            fileUrl || "",

        });



      // ✅ UPDATE CHAT
      conversation.lastMessage =
        message;

      conversation.lastMessageTime =
        new Date();



      // ✅ INCREASE DOCTOR UNREAD
      conversation.unreadDoctorCount += 1;



      await conversation.save();



      // ✅ RESPONSE
      res.status(201).json({

        success: true,

        message:
          "Message sent successfully",

        data:
          newMessage,

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







/* =====================================================
   📨 GET MESSAGES
===================================================== */

exports.getMessages =
  async (req, res) => {

    try {

      // ✅ FIND CHAT
      const conversation =
        await UserChatConversation.findById(
          req.params.conversationId
        );



      if (!conversation) {

        return res.status(404).json({

          success: false,

          message:
            "Conversation not found",

        });

      }



      // ✅ SECURITY CHECK
      if (

        conversation.userId.toString() !==

        req.user._id.toString()

      ) {

        return res.status(403).json({

          success: false,

          message:
            "Not authorized",

        });

      }



      // ✅ GET ALL MESSAGES
      const messages =
        await UserChatMessage.find({

          conversationId:
            req.params.conversationId,

        })

        .sort({
          createdAt: 1,
        });



      // ✅ MARK AS SEEN
      await UserChatMessage.updateMany(

        {

          conversationId:
            req.params.conversationId,

          senderType:
            "doctor",

          isSeen:
            false,

        },

        {

          isSeen:
            true,

        }

      );



      // ✅ RESET UNREAD COUNT
      conversation.unreadUserCount =
        0;

      await conversation.save();



      // ✅ RESPONSE
      res.status(200).json({

        success: true,

        count:
          messages.length,

        data:
          messages,

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







/* =====================================================
   💬 GET MY CHATS
===================================================== */

exports.getMyChats =
  async (req, res) => {

    try {

      // ✅ GET USER CHATS
      const chats =
        await UserChatConversation.find({

          userId:
            req.user._id,

        })

        .populate(

          "doctorId",

          "name speciality doctorImagePath"

        )

        .sort({
          updatedAt: -1,
        });



      // ✅ RESPONSE
      res.status(200).json({

        success: true,

        count:
          chats.length,

        data:
          chats,

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







/* =====================================================
   ❌ DELETE CHAT
===================================================== */

exports.deleteChat =
  async (req, res) => {

    try {

      const conversation =
        await UserChatConversation.findById(
          req.params.id
        );



      if (!conversation) {

        return res.status(404).json({

          success: false,

          message:
            "Chat not found",

        });

      }



      // ✅ SECURITY
      if (

        conversation.userId.toString() !==

        req.user._id.toString()

      ) {

        return res.status(403).json({

          success: false,

          message:
            "Not authorized",

        });

      }



      // ✅ DELETE MESSAGES
      await UserChatMessage.deleteMany({

        conversationId:
          conversation._id,

      });



      // ✅ DELETE CHAT
      await conversation.deleteOne();



      // ✅ RESPONSE
      res.status(200).json({

        success: true,

        message:
          "Chat deleted successfully",

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
