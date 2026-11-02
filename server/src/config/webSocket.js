import Message from "../models/message.model.js";
import User from "../models/user.model.js";

export const OnlineUsers = {};

const WebSocket = (io) => {
  console.log("🔌 Socket Connected");

  io.on("connection", (socket) => {
    socket.on("OmBhramyaNamah", async (userID) => {
      if (userID) {
        OnlineUsers[userID] = socket.id;
        console.log("Path Created", userID);
        console.log("Online User :", OnlineUsers);
        io.emit("onlineUsers", OnlineUsers);

        // When user comes online, deliver any undelivered messages sent to them
        try {
          const pending = await Message.find({
            receiverId: userID,
            status: "sent",
          }).select("_id senderId");

          if (pending && pending.length > 0) {
            await Message.updateMany(
              { receiverId: userID, status: "sent" },
              { $set: { status: "delivered" } },
            );

            // Notify online senders that their messages have been delivered (double tick)
            const senderIds = [
              ...new Set(pending.map((m) => m.senderId?.toString())),
            ];
            senderIds.forEach((sId) => {
              const senderSockId = OnlineUsers[sId];
              if (senderSockId) {
                io.to(senderSockId).emit("messagesDelivered", {
                  receiverId: userID,
                });
              }
            });
          }
        } catch (err) {
          console.error("Error marking messages as delivered on connect:", err);
        }
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

    socket.on("markDelivered", async (payload) => {
      if (!payload?.senderId || !payload?.receiverId) return;
      try {
        const updateRes = await Message.updateMany(
          {
            senderId: payload.senderId,
            receiverId: payload.receiverId,
            status: "sent",
          },
          { $set: { status: "delivered" } },
        );

        if (updateRes.modifiedCount > 0) {
          const senderSockId = OnlineUsers[payload.senderId];
          if (senderSockId) {
            io.to(senderSockId).emit("messagesDelivered", {
              receiverId: payload.receiverId,
            });
          }
        }
      } catch (err) {
        console.error("markDelivered error:", err);
      }
    });

    socket.on("send", async (payload) => {
      console.log("Message Pack", payload);
      if (!payload?.senderID || !payload?.receiverID || !payload?.message) return;

      try {
        const [sender, receiver] = await Promise.all([
          User.findById(payload.senderID).select("blockedUsers"),
          User.findById(payload.receiverID).select("blockedUsers"),
        ]);

        const isSenderBlocked = sender?.blockedUsers?.some(
          (id) => id.toString() === payload.receiverID.toString(),
        );
        const isReceiverBlocked = receiver?.blockedUsers?.some(
          (id) => id.toString() === payload.senderID.toString(),
        );

        if (isSenderBlocked || isReceiverBlocked) {
          console.log("Message delivery blocked by user block list");
          socket.emit("blockedNotice", {
            error: isSenderBlocked
              ? "You have blocked this contact. Unblock to send messages."
              : "Message not delivered.",
          });
          return;
        }

        const reciversSocketID = OnlineUsers[payload.receiverID];
        const isReceiverOnline = !!reciversSocketID;
        const status = isReceiverOnline ? "delivered" : "sent";

        const newMessage = await Message.create({
          senderId: payload.senderID,
          receiverId: payload.receiverID,
          message: payload.message,
          status,
        });

        console.log("Message Saved to DB", newMessage);

        const newMessagePack = newMessage.toObject();
        delete newMessagePack.__v;

        if (reciversSocketID) {
          console.log("NewMessagePack : ", newMessagePack);
          io.to(reciversSocketID).emit("receive", newMessagePack);
        }

        // Acknowledge back to sender with delivery status
        socket.emit("messageSentAck", {
          tempId: payload.tempId,
          message: newMessagePack,
          status,
        });
      } catch (err) {
        console.error("Socket send message error:", err);
      }
    });
  });
};

export default WebSocket;
