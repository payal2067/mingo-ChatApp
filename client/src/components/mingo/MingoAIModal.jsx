import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Sparkles, X, Check, Copy, Wand2, RefreshCw, Languages, MessageSquare } from "lucide-react";
import toast from "react-hot-toast";

const MingoAIModal = ({ isOpen, onClose, onInsertText, friendName = "Friend" }) => {
  const [activeMode, setActiveMode] = useState("draft"); // 'draft' | 'summarize' | 'translate'
  const [promptInput, setPromptInput] = useState("");
  const [selectedTone, setSelectedTone] = useState("friendly");
  const [generatedText, setGeneratedText] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  if (!isOpen) return null;

  const handleGenerate = () => {
    setIsGenerating(true);
    setTimeout(() => {
      let output = "";
      if (activeMode === "draft") {
        if (selectedTone === "professional") {
          output = `Hello ${friendName}, thank you for reaching out. Let's touch base on the updates later today.`;
        } else if (selectedTone === "casual") {
          output = `Hey ${friendName}! Sounds good, let's catch up soon! 🙌`;
        } else {
          output = `Hey ${friendName}, hope you're having a wonderful day! Let me know when you're free to chat. 😊`;
        }
      } else if (activeMode === "summarize") {
        output = `Summary of recent conversation with ${friendName}: Agreed on the project timeline, files exchanged, and next sync scheduled for tomorrow.`;
      } else if (activeMode === "translate") {
        output = `Namaste ${friendName}, aapse baat karke accha laga! (Translated to Hindi)`;
      }
      setGeneratedText(output);
      setIsGenerating(false);
    }, 700);
  };

  const handleApply = () => {
    if (generatedText) {
      onInsertText(generatedText);
      toast.success("Inserted into message bar!", {
        style: { borderRadius: "12px", background: "#0B0F17", color: "#fff" }
      });
      onClose();
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="w-full max-w-lg rounded-3xl bg-base-100 border border-emerald-500/20 shadow-2xl overflow-hidden"
        >
          {/* Header */}
          <div className="p-4 border-b border-base-content/10 bg-gradient-to-r from-emerald-500/10 via-teal-500/5 to-transparent flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-emerald-500 flex items-center justify-center text-white shadow-md shadow-emerald-500/30">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-base-content flex items-center gap-1.5">
                  Mingo AI Assistant
                  <span className="text-[10px] uppercase font-bold px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-600 dark:text-emerald-400">
                    Beta
                  </span>
                </h3>
                <p className="text-[11px] text-base-content/60">Fast suggestions & summaries for {friendName}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl hover:bg-base-200 text-base-content/60"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Mode Switcher */}
          <div className="grid grid-cols-3 p-2 gap-1 bg-base-200/50 text-xs font-semibold border-b border-base-content/10">
            <button
              onClick={() => {
                setActiveMode("draft");
                setGeneratedText("");
              }}
              className={`py-2 rounded-xl transition ${
                activeMode === "draft"
                  ? "bg-base-100 text-emerald-600 dark:text-emerald-400 shadow-sm"
                  : "text-base-content/60 hover:text-base-content"
              }`}
            >
              Draft Reply
            </button>
            <button
              onClick={() => {
                setActiveMode("summarize");
                setGeneratedText("");
              }}
              className={`py-2 rounded-xl transition ${
                activeMode === "summarize"
                  ? "bg-base-100 text-emerald-600 dark:text-emerald-400 shadow-sm"
                  : "text-base-content/60 hover:text-base-content"
              }`}
            >
              Summarize
            </button>
            <button
              onClick={() => {
                setActiveMode("translate");
                setGeneratedText("");
              }}
              className={`py-2 rounded-xl transition ${
                activeMode === "translate"
                  ? "bg-base-100 text-emerald-600 dark:text-emerald-400 shadow-sm"
                  : "text-base-content/60 hover:text-base-content"
              }`}
            >
              Translate
            </button>
          </div>

          {/* Body */}
          <div className="p-4 space-y-4">
            {activeMode === "draft" && (
              <div className="space-y-3">
                <label className="text-xs font-semibold text-base-content/70">Select Tone:</label>
                <div className="flex gap-2">
                  {["friendly", "casual", "professional"].map((t) => (
                    <button
                      key={t}
                      onClick={() => setSelectedTone(t)}
                      className={`px-3 py-1.5 rounded-xl text-xs capitalize transition ${
                        selectedTone === t
                          ? "bg-emerald-500 text-white font-semibold shadow-sm"
                          : "bg-base-200 text-base-content/70 hover:bg-base-300"
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Generate Trigger */}
            <button
              onClick={handleGenerate}
              disabled={isGenerating}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 text-white font-semibold text-xs shadow-md shadow-emerald-500/20 active:scale-98 transition disabled:opacity-50"
            >
              <Wand2 className="w-4 h-4" />
              <span>{isGenerating ? "Mingo AI is thinking..." : "Generate Suggestion"}</span>
            </button>

            {/* Generated Result Container */}
            {generatedText && (
              <div className="space-y-2 pt-2">
                <div className="flex items-center justify-between text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold">
                  <span className="flex items-center gap-1">
                    <Sparkles className="w-3 h-3" /> Suggested by Mingo AI
                  </span>
                  <span className="text-base-content/40">Review before sending</span>
                </div>
                <div className="p-3.5 rounded-2xl bg-base-200 border border-emerald-500/20 text-xs text-base-content leading-relaxed">
                  {generatedText}
                </div>

                <div className="flex items-center justify-end gap-2 pt-1">
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(generatedText);
                      toast.success("Copied!");
                    }}
                    className="p-2 rounded-xl text-xs font-medium text-base-content/60 hover:bg-base-200 flex items-center gap-1.5 transition"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy</span>
                  </button>
                  <button
                    onClick={handleApply}
                    className="px-4 py-2 rounded-xl bg-emerald-500 text-white text-xs font-semibold flex items-center gap-1.5 hover:bg-emerald-600 transition shadow-sm"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>Use in Message</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default MingoAIModal;
