import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { CheckCheck, Copy, Reply } from "lucide-react";
import toast from "react-hot-toast";

const MingoBubble = ({
  chat,
  isSender,
  onReply,
  _onDelete
}) => {
  const [showActions, setShowActions] = useState(false);
  const [reactions, setReactions] = useState([]);

  const formatTime = (ts) => {
    if (!ts) return "";
    try {
      const date = new Date(ts);
      return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    } catch {
      return "";
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(chat.message);
    toast.success("Copied to clipboard", {
      style: { borderRadius: "12px", background: "#0B0F17", color: "#fff" }
    });
    setShowActions(false);
  };

  const addReaction = (emoji) => {
    setReactions((prev) => {
      const existing = prev.find((r) => r.emoji === emoji);
      if (existing) {
        return prev.map((r) => r.emoji === emoji ? { ...r, count: r.count + 1 } : r);
      }
      return [...prev, { emoji, count: 1 }];
    });
    setShowActions(false);
  };

  const quickReactions = ["❤️", "👍", "🔥", "😂", "🎉"];

  return (
    <motion.div
      initial={{ opacity: 0, y: 8, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.18, ease: "easeOut" }}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
      className={`relative group flex flex-col mb-3 ${
        isSender ? "items-end" : "items-start"
      }`}
    >
      <div className={`relative max-w-[85%] sm:max-w-[70%] flex flex-col ${isSender ? "items-end" : "items-start"}`}>
        {/* Floating Quick Action Menu */}
        <AnimatePresence>
          {showActions && (
            <motion.div
              initial={{ opacity: 0, y: 4, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 4, scale: 0.95 }}
              transition={{ duration: 0.12 }}
              className={`absolute -top-9 z-20 flex items-center gap-1 px-2 py-1 rounded-full bg-base-100 border border-base-content/10 shadow-lg ${
                isSender ? "right-0" : "left-0"
              }`}
            >
              {quickReactions.map((emoji) => (
                <button
                  key={emoji}
                  onClick={() => addReaction(emoji)}
                  className="hover:scale-125 transition-transform text-sm px-1"
                >
                  {emoji}
                </button>
              ))}
              <div className="w-px h-3.5 bg-base-content/15 mx-1" />
              <button
                onClick={handleCopy}
                className="p-1 rounded-full hover:bg-base-200 text-base-content/60 transition"
                title="Copy"
              >
                <Copy className="w-3.5 h-3.5" />
              </button>
              {onReply && (
                <button
                  onClick={() => onReply(chat)}
                  className="p-1 rounded-full hover:bg-base-200 text-base-content/60 transition"
                  title="Reply"
                >
                  <Reply className="w-3.5 h-3.5" />
                </button>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Message Bubble Body */}
        <div
          className={`px-4 py-2.5 rounded-[20px] text-sm leading-relaxed transition-all break-words ${
            isSender
              ? "bg-gradient-to-tr from-emerald-600 to-emerald-500 text-white rounded-br-sm shadow-md shadow-emerald-500/20"
              : "bg-base-200 text-base-content rounded-bl-sm border border-base-content/5 shadow-sm"
          }`}
        >
          <p className="whitespace-pre-wrap">{chat.message}</p>

          {/* Time & Delivery Check */}
          <div
            className={`flex items-center justify-end gap-1 mt-1 text-[10px] select-none ${
              isSender ? "text-emerald-100/80" : "text-base-content/50"
            }`}
          >
            <span>{formatTime(chat.createdAt || chat.updatedAt || new Date())}</span>
            {isSender && (
              <CheckCheck className="w-3.5 h-3.5 text-emerald-200 inline" />
            )}
          </div>
        </div>

        {/* Reaction Badges */}
        {reactions.length > 0 && (
          <div className="flex items-center gap-1 -mt-2 z-10">
            {reactions.map((r, i) => (
              <span
                key={i}
                className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-base-100 border border-base-content/10 text-xs shadow-sm"
              >
                <span>{r.emoji}</span>
                {r.count > 1 && <span className="font-semibold text-[10px] text-base-content/70">{r.count}</span>}
              </span>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default MingoBubble;
