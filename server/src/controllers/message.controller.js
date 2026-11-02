import Message from "../models/message.model.js";
import User from "../models/user.model.js";

export const SendMessage = async (req, res, next) => {
  try {
    const { receiverID, message } = req.body;
    const currentUser = req.user;

    console.log("Receiver ID:", receiverID);
    console.log("Message:", message);

    if (!receiverID || !message) {
      const error = new Error("All fields required");
      error.statusCode = 400;
      return next(error);
    }

    // Check if sender has blocked receiver
    const sender = await User.findById(currentUser._id).select("blockedUsers");
    if (sender?.blockedUsers?.some((id) => id.toString() === receiverID.toString())) {
      const error = new Error("You have blocked this contact. Unblock to send messages.");
      error.statusCode = 400;
      return next(error);
    }

    // Check if receiver has blocked sender
    const receiver = await User.findById(receiverID).select("blockedUsers");
    if (receiver?.blockedUsers?.some((id) => id.toString() === currentUser._id.toString())) {
      const error = new Error("You cannot send messages to this contact because you have been blocked.");
      error.statusCode = 403;
      return next(error);
    }

    const newMessage = await Message.create({
      senderId: currentUser._id,
      receiverId: receiverID,
      message,
    });
    res
      .status(201)
      .json({ message: "Message sent successfully", data: newMessage });
  } catch (error) {
    console.log(error.message);
    next(error);
  }
};

export const GetMessages = async (req, res, next) => {
  try {
    const { friendId } = req.params;
    const currentUser = req.user;

    const messages = await Message.find({
      $or: [
        { senderId: currentUser._id, receiverId: friendId },
        { senderId: friendId, receiverId: currentUser._id },
      ],
    })
      .sort({ createdAt: 1 })
      .select("-_id -__v");

    res.status(200).json({ data: messages });
  } catch (error) {
    console.log(error.message);
    next(error);
  }
};
