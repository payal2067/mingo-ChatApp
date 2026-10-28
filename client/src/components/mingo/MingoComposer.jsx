import React, { useState, useRef, useEffect } from "react";
import {
  Smile,
  Paperclip,
  Mic,
  Send,
  X,
  FileText
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import toast from "react-hot-toast";

const MingoComposer = ({
  onSendMessage,
  onTyping,
  replyingTo,
  onCancelReply
}) => {
  const [text, setText] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [attachment, setAttachment] = useState(null);
  const textareaRef = useRef(null);

  // Auto resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
    }
  }, [text]);

  // Voice recording timer
  useEffect(() => {
    let timer;
    if (isRecording) {
      timer = setInterval(() => setRecordingSeconds((s) => s + 1), 1000);
    } else {
      setRecordingSeconds(0);
    }
    return () => clearInterval(timer);
  }, [isRecording]);

  const handleSend = () => {
    if (!text.trim() && !attachment && !isRecording) return;

    if (isRecording) {
      onSendMessage(`🎤 Voice Message (${recordingSeconds}s)`);
      setIsRecording(false);
      return;
    }

    let fullMsg = text;
    if (attachment) {
      fullMsg = `📎 [${attachment.name}] ${text}`;
    }

    onSendMessage(fullMsg);
    setText("");
    setAttachment(null);
    if (onCancelReply) onCancelReply();
    if (textareaRef.current) textareaRef.current.style.height = "auto";
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const emojis = [
    "😊", "😂", "🔥", "❤️", "👍", "🎉",
    "🙌", "✨", "🚀", "💡", "💯", "👋",
    "😍", "😎", "🤝", "🙏", "🍕", "☕"
  ];

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setAttachment({
        name: file.name,
        size: (file.size / 1024).toFixed(1) + " KB",
        type: file.type
      });
      toast.success(`Attached ${file.name}`, {
        style: { borderRadius: "12px", background: "#0B0F17", color: "#fff" }
      });
    }
  };

  return (
    <footer className="p-3 md:p-4 bg-base-100/90 border-t border-base-content/10 backdrop-blur-md relative z-10">
      {/* Replying Banner */}
      <AnimatePresence>
        {replyingTo && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="flex items-center justify-between p-2.5 mb-2 rounded-xl bg-emerald-500/10 border-l-4 border-emerald-500 text-xs text-base-content"
          >
            <div className="truncate">
              <span className="font-semibold text-emerald-600 dark:text-emerald-400">Replying to message: </span>
              <span className="text-base-content/70 italic">"{replyingTo.message}"</span>
            </div>
            <button
              onClick={onCancelReply}
              className="p-1 rounded-full hover:bg-base-content/10 text-base-content/50"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Attachment Preview Banner */}
      <AnimatePresence>
        {attachment && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="flex items-center justify-between p-2 mb-2 rounded-xl bg-base-200 border border-base-content/10 text-xs"
          >
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-emerald-500" />
              <span className="font-medium text-base-content truncate max-w-xs">{attachment.name}</span>
              <span className="text-base-content/50">({attachment.size})</span>
            </div>
            <button onClick={() => setAttachment(null)} className="p-1 hover:text-rose-500">
              <X className="w-3.5 h-3.5" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Emoji Picker Popover */}
      <AnimatePresence>
        {showEmojiPicker && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 10 }}
            className="absolute bottom-20 left-4 z-30 p-3 rounded-2xl bg-base-100 border border-base-content/10 shadow-2xl grid grid-cols-6 gap-2"
          >
            {emojis.map((em) => (
              <button
                key={em}
                onClick={() => {
                  setText((prev) => prev + em);
                  setShowEmojiPicker(false);
                }}
                className="w-8 h-8 flex items-center justify-center hover:scale-125 transition-transform text-lg"
              >
                {em}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Composer Bar */}
      <div className="flex items-end gap-2 bg-base-200/80 rounded-2xl p-1.5 border border-base-content/10 focus-within:border-emerald-500/40 focus-within:ring-2 focus-within:ring-emerald-500/15 transition-all">
        {/* Emoji Button */}
        <button
          type="button"
          onClick={() => setShowEmojiPicker((v) => !v)}
          className={`p-2 rounded-xl transition ${
            showEmojiPicker ? "text-emerald-500 bg-emerald-500/10" : "text-base-content/60 hover:text-base-content"
          }`}
          title="Add Emoji"
        >
          <Smile className="w-5 h-5" />
        </button>

        {/* Attachment Button */}
        <label
          className="p-2 rounded-xl text-base-content/60 hover:text-base-content cursor-pointer transition"
          title="Attach file"
        >
          <Paperclip className="w-5 h-5" />
          <input type="file" onChange={handleFileSelect} className="hidden" />
        </label>

        {/* Text Area or Recording Waveform */}
        {isRecording ? (
          <div className="flex-1 flex items-center gap-3 py-2 px-3">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping" />
            <span className="text-sm font-semibold text-rose-500">
              Recording 00:{recordingSeconds < 10 ? `0${recordingSeconds}` : recordingSeconds}
            </span>
            {/* Visual Waveform bars */}
            <div className="flex-1 flex items-center gap-1 h-5 overflow-hidden">
              {[40, 70, 20, 90, 60, 30, 80, 50, 90, 40, 70, 30].map((h, i) => (
                <div
                  key={i}
                  className="w-1 bg-emerald-500 rounded-full animate-pulse"
                  style={{ height: `${h}%`, animationDelay: `${i * 0.1}s` }}
                />
              ))}
            </div>
            <button
              onClick={() => setIsRecording(false)}
              className="text-xs font-medium text-base-content/50 hover:text-rose-500"
            >
              Cancel
            </button>
          </div>
        ) : (
          <textarea
            ref={textareaRef}
            rows={1}
            value={text}
            onChange={(e) => {
              setText(e.target.value);
              onTyping?.();
            }}
            onKeyDown={handleKeyDown}
            placeholder="Type a message in Mingo..."
            className="flex-1 py-2 px-2 bg-transparent text-sm text-base-content placeholder:text-base-content/40 resize-none outline-none leading-relaxed min-h-[38px] max-h-[120px] mingo-scrollbar font-normal"
          />
        )}

        {/* Voice Note Trigger */}
        {!text.trim() && !attachment && (
          <button
            type="button"
            onClick={() => setIsRecording((v) => !v)}
            className={`p-2 rounded-xl transition ${
              isRecording
                ? "text-rose-500 bg-rose-500/10"
                : "text-base-content/60 hover:text-base-content"
            }`}
            title="Hold or click to record voice note"
          >
            <Mic className="w-5 h-5" />
          </button>
        )}


        {/* Send Button */}
        <button
          type="button"
          onClick={handleSend}
          disabled={!text.trim() && !attachment && !isRecording}
          className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-emerald-500 text-white flex items-center justify-center shadow-md shadow-emerald-500/25 hover:scale-105 active:scale-95 disabled:opacity-40 disabled:hover:scale-100 transition shrink-0"
          title="Send message"
        >
          <Send className="w-4 h-4 ml-0.5" />
        </button>
      </div>
    </footer>
  );
};

export default MingoComposer;
