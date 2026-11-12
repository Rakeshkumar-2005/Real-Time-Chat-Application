
import Conversation from "../models/conversationModels.js";
import Message from "../models/messageModels.js";

export const sendMessage = async (req, res) => {
  try {
    const { message } = req.body;
    const { id: receiverId } = req.params;
    const senderId = req.user._id;

    // Check message
    if (!message || !message.trim()) {
      return res.status(400).json({
        success: false,
        message: "Message cannot be empty"
      });
    }

    // Find conversation
    let chats = await Conversation.findOne({
      participants: {
        $all: [senderId, receiverId]
      }
    });

    // Create conversation if not found
    if (!chats) {
      chats = await Conversation.create({
        participants: [senderId, receiverId]
      });
    }

    // Create new message
    const newMessage = new Message({
      senderId,
      receiverId,
      message,
      conversationId: chats._id
    });

    // Add message ID to conversation
    chats.messages.push(newMessage._id);

    // Save both documents
    await Promise.all([
      newMessage.save(),
      chats.save()
    ]);

    return res.status(201).json({
      success: true,
      message: "Message sent successfully",
      newMessage
    });

  } catch (error) {
    console.log("Send Message Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};



export const getMessages = async (req, res) => {
  try {
    const { id: receiverId } = req.params;
    const senderId = req.user._id;

    const chats = await Conversation.findOne({
      participants: {
        $all: [senderId, receiverId]
      }
    }).populate("messages");

    if (!chats) {
      return res.status(200).json({
        success: true,
        messages: []
      });
    }

    const messages = chats.messages;

    return res.status(200).json({
      success: true,
      messages
    });

  } catch (error) {
    console.log("Get Messages Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
