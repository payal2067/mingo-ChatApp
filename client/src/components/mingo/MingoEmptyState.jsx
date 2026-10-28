import React from "react";
import { MessageSquare, ShieldCheck, Zap, Command } from "lucide-react";
import { motion } from "motion/react";

const MingoEmptyState = ({ onOpenCommand, onNewChat }) => {
  return (
    <div className="flex-1 h-full flex flex-col items-center justify-center p-6 bg-gradient-to-br from-base-100 via-base-100 to-base-200/50 select-none">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="max-w-md w-full flex flex-col items-center text-center space-y-6"
      >
        {/* Animated Brand Mascot / Badge */}
        <div className="relative">
          <div className="w-24 h-24 rounded-3xl bg-gradient-to-tr from-emerald-600 via-emerald-500 to-teal-400 p-0.5 shadow-2xl shadow-emerald-500/30 flex items-center justify-center">
            <div className="w-full h-full bg-base-100 rounded-[22px] flex items-center justify-center">
              <span className="text-4xl font-black tracking-tighter bg-gradient-to-tr from-emerald-600 to-teal-400 bg-clip-text text-transparent">
                M
              </span>
            </div>
          </div>
          <span className="absolute -top-1 -right-1 flex h-4 w-4">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-4 w-4 bg-emerald-500" />
          </span>
        </div>

        {/* Title & Headline */}
        <div>
          <h2 className="text-2xl font-bold text-base-content tracking-tight">
            Welcome to Mingo
          </h2>
          <p className="text-sm text-base-content/60 mt-1 max-w-sm">
            A fast, human, and premium messaging experience. Connect with friends and converse effortlessly.
          </p>
        </div>

        {/* Feature Badges */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 w-full">
          <div className="p-3 rounded-2xl bg-base-200/70 border border-base-content/5 flex flex-col items-center gap-1.5 text-center">
            <ShieldCheck className="w-5 h-5 text-emerald-500" />
            <span className="text-xs font-semibold text-base-content">Secure</span>
            <span className="text-[10px] text-base-content/50">Private cloud chat</span>
          </div>

          <div className="p-3 rounded-2xl bg-base-200/70 border border-base-content/5 flex flex-col items-center gap-1.5 text-center">
            <Zap className="w-5 h-5 text-emerald-500" />
            <span className="text-xs font-semibold text-base-content">Fast</span>
            <span className="text-[10px] text-base-content/50">Real-time sockets</span>
          </div>

          <div className="p-3 rounded-2xl bg-base-200/70 border border-base-content/5 flex flex-col items-center gap-1.5 text-center">
            <MessageSquare className="w-5 h-5 text-emerald-500" />
            <span className="text-xs font-semibold text-base-content">Rich Media</span>
            <span className="text-[10px] text-base-content/50">Emoji, files & more</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-2.5 w-full pt-2">
          <button
            onClick={onOpenCommand}
            className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-base-200 hover:bg-base-300 text-xs font-semibold text-base-content transition border border-base-content/10 shadow-sm"
          >
            <Command className="w-4 h-4 text-emerald-500" />
            <span>Open Command Palette</span>
            <kbd className="px-1.5 py-0.5 rounded bg-base-100 text-[10px] font-mono text-base-content/60">Ctrl+K</kbd>
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default MingoEmptyState;
