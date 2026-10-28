import React, { useEffect, useState, useRef } from "react";
import { useAuth } from "../../context/AuthContext";
import api from "../../config/api";
import socketAPI from "../../config/webSocket.jsx";
import MingoChatHeader from "../mingo/MingoChatHeader";
import MingoBubble from "../mingo/MingoBubble";
import MingoComposer from "../mingo/MingoComposer";
import MingoDetails from "../mingo/MingoDetails";
import { motion } from "motion/react";
import toast from "react-hot-toast";

const Chatting = ({
  selectedFriend,
  _currentUser,
  onBack,
  onlineUsers = {}
}) => {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [replyingTo, setReplyingTo] = useState(null);
  const [isFriendTyping, setIsFriendTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  const isFriendOnline = !!onlineUsers[selectedFriend?._id];

  const scrollToBottom = (smooth = true) => {
    messagesEndRef.current?.scrollIntoView({ behavior: smooth ? "smooth" : "auto" });
  };

  // Fetch conversation messages
  const fetchChatData = async () => {
    if (!selectedFriend?._id) return;
    setIsLoading(true);
    try {
      const res = await api.get(`/user/get-messages/${selectedFriend._id}`);
      setMessages(res.data.data || []);
      setTimeout(() => scrollToBottom(false), 50);
    } catch (error) {
      console.error("Failed to fetch chat data", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle incoming real-time socket message
  const handleReceiveMessage = (newMessagePack) => {
    // Only append if it belongs to current conversation
    if (
      newMessagePack.senderId === selectedFriend?._id ||
      newMessagePack.receiverId === selectedFriend?._id
    ) {
      setMessages((prev) => [...prev, newMessagePack]);
      setTimeout(() => scrollToBottom(true), 50);
    }
  };

  // Handle typing notification
  const handleIncomingTyping = (senderId) => {
    if (senderId === selectedFriend?._id) {
      setIsFriendTyping(true);
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = setTimeout(() => {
        setIsFriendTyping(false);
      }, 2500);
    }
  };

  useEffect(() => {
    fetchChatData();

    if (selectedFriend) {
      socketAPI.on("receive", handleReceiveMessage);
      socketAPI.on("userTyping", handleIncomingTyping);
    }

    return () => {
      socketAPI.off("receive", handleReceiveMessage);
      socketAPI.off("userTyping", handleIncomingTyping);
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedFriend]);

  // Sending message
  const handleSendMessage = async (text) => {
    if (!text.trim()) return;

    const timeStamp = new Date().toISOString();
    const payload = {
      senderID: user._id,
      receiverID: selectedFriend._id,
      message: text,
    };

    // Optimistic UI update
    const optimisticMsg = {
      _id: `temp-${Date.now()}`,
      senderId: user._id,
      receiverId: selectedFriend._id,
      message: text,
      createdAt: timeStamp,
      updatedAt: timeStamp,
    };

    setMessages((prev) => [...prev, optimisticMsg]);
    setTimeout(() => scrollToBottom(true), 50);

    try {
      if (socketAPI.connected) {
        socketAPI.emit("send", payload);
      } else {
        // Fallback to REST API
        await api.post("/user/send-message", {
          receiverID: selectedFriend._id,
          message: text,
        });
      }
    } catch (error) {
      console.error("Failed to send message", error);
      toast.error("Failed to deliver message. Retrying...");
    }
  };

  const handleBroadcastTyping = () => {
    if (socketAPI.connected && selectedFriend) {
      socketAPI.emit("typing", {
        senderID: user._id,
        receiverID: selectedFriend._id,
      });
    }
  };

  return (
    <div className="flex-1 h-full flex overflow-hidden bg-base-100">
      {/* Main Conversation Column */}
      <div className="flex-1 h-full flex flex-col min-w-0">
        {/* Top Header */}
        <MingoChatHeader
          friend={selectedFriend}
          isOnline={isFriendOnline}
          onBack={onBack}
          onToggleDetails={() => setIsDetailsOpen((v) => !v)}
          isDetailsOpen={isDetailsOpen}
        />

        {/* Message Stream */}
        <div className="flex-1 overflow-y-auto p-4 space-y-1 mingo-scrollbar bg-mingo-aurora">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center h-full text-base-content/40 space-y-2">
              <div className="w-8 h-8 rounded-full border-2 border-emerald-500 border-t-transparent animate-spin" />
              <span className="text-xs font-medium">Loading conversation...</span>
            </div>
          ) : messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center p-6 space-y-3">
              <div className="w-16 h-16 rounded-2xl bg-emerald-500/15 text-emerald-500 flex items-center justify-center font-bold text-2xl">
                💬
              </div>
              <h4 className="font-bold text-base-content text-base">Say hello to {selectedFriend.fullName}!</h4>
              <p className="text-xs text-base-content/50 max-w-xs">
                This is the start of your private, secure conversation on Mingo.
              </p>
            </div>
          ) : (
            messages.map((chat, idx) => {
              const isSender = chat.senderId === user?._id || chat.senderId === user?._id?.toString();
              return (
                <MingoBubble
                  key={chat._id || idx}
                  chat={chat}
                  isSender={isSender}
                  onReply={(msg) => setReplyingTo(msg)}
                />
              );
            })
          )}

          {/* Typing Indicator */}
          {isFriendTyping && (
            <motion.div
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 5 }}
              className="flex items-center gap-2 p-2 rounded-2xl bg-base-200/80 w-fit text-xs text-base-content/70"
            >
              <div className="flex items-center gap-1 px-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-bounce" />
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-bounce [animation-delay:0.15s]" />
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-bounce [animation-delay:0.3s]" />
              </div>
              <span className="font-medium text-[11px] text-emerald-600 dark:text-emerald-400">
                {selectedFriend.fullName} is typing...
              </span>
            </motion.div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Composer Bar */}
        <MingoComposer
          onSendMessage={handleSendMessage}
          onTyping={handleBroadcastTyping}
          replyingTo={replyingTo}
          onCancelReply={() => setReplyingTo(null)}
        />
      </div>

      {/* Details Slide-over Drawer */}
      <MingoDetails
        isOpen={isDetailsOpen}
        onClose={() => setIsDetailsOpen(false)}
        friend={selectedFriend}
        isOnline={isFriendOnline}
        onClearChat={() => setMessages([])}
      />

    </div>
  );
};

export default Chatting;
