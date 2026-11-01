import Message from "../models/message.model.js";

const OnlineUsers = {};

const WebSocket = (io) => {
  console.log("🔌 Socket Connected");

  io.on("connection", (socket) => {
    socket.on("OmBhramyaNamah", (userID) => {
      if (userID) {
        OnlineUsers[userID] = socket.id;
        console.log("Path Created", userID);
        console.log("Online User :", OnlineUsers);
        io.emit("onlineUsers", OnlineUsers);
      }
    });

    socket.on("OmNamahShivay", (userID) => {
      if (userID && OnlineUsers[userID]) {
        delete OnlineUsers[userID];
        console.log("Path Destroyed", userID);
        console.log("Online User :", OnlineUsers);
        io.emit("onlineUsers", OnlineUsers);
      }
    });

    socket.on("disconnect", () => {
      let changed = false;
      for (const [userId, sockId] of Object.entries(OnlineUsers)) {
        if (sockId === socket.id) {
          delete OnlineUsers[userId];
          changed = true;
          break;
        }
      }
      if (changed) {
        console.log("User disconnected, Online Users:", OnlineUsers);
        io.emit("onlineUsers", OnlineUsers);
      }
    });

    socket.on("send", async (payload) => {
      console.log("Massage Pack", payload);

      const newMessage = await Message.create({
        senderId: payload.senderID,
        receiverId: payload.receiverID,
        message: payload.message,
      });

      console.log("Message Saved to DB", newMessage);

      const newMessagePack = newMessage.toObject();
      delete newMessagePack._id;
      delete newMessagePack.__v;

      const reciversSocketID = OnlineUsers[payload.receiverID];

      if (reciversSocketID) {
        console.log("NewMessagePack : ", newMessagePack);

        io.to(reciversSocketID).emit("receive", newMessagePack);
      }
    });
  });
};

export default WebSocket;
