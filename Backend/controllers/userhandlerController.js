
import Conversation from "../models/conversationModels.js";
import User from "../models/userModels.js";

export const getUserBySearch = async (req, res) => {
  try {
    const search = req.query.search || "";
    const currentUserID = req.user._id;

    const users = await User.find({
      $and: [
        {
          $or: [
            { username: { $regex: search, $options: "i" } },
            { fullname: { $regex: search, $options: "i" } }
          ]
        },
        {
          _id: { $ne: currentUserID }
        }
      ]
    }).select("-password");

    return res.status(200).json(users);

  } catch (error) {
    console.log("Search User Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};


export const getCurrentChatters = async (req, res) => {
  try {
    const currentUserID = req.user._id;

    const currentChatters = await Conversation.find({
      participants: currentUserID
    }).sort({ updatedAt: -1 });

    if (currentChatters.length === 0) {
      return res.status(200).json([]);
    }

    // Get other participants IDs
    const participantsIDS = currentChatters.reduce(
      (ids, conversation) => {
        const otherParticipants = conversation.participants.filter(
          id => id.toString() !== currentUserID.toString()
        );

        return [...ids, ...otherParticipants];
      },
      []
    );

    // Remove duplicate IDs
    const otherParticipantsIDS = [
      ...new Set(participantsIDS.map(id => id.toString()))
    ];

    // Find users
    const users = await User.find({
      _id: { $in: otherParticipantsIDS }
    }).select("-password");

    return res.status(200).json(users);

  } catch (error) {
    console.log("Get Current Chatters Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
