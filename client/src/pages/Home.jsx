import React from "react";
import { motion } from "motion/react";
import { useNavigate } from "react-router-dom";
import {
  MessageSquare,
  Sparkles,
  Zap,
  ShieldCheck,
  ArrowRight,
  Command,
  Users,
  CheckCircle2
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

const Home = () => {
  const navigate = useNavigate();
  const { isLogin } = useAuth();

  return (
    <div className="min-h-[calc(100vh-60px)] flex flex-col items-center justify-center px-4 py-12 bg-gradient-to-b from-base-100 via-base-100 to-base-200/50 relative overflow-hidden">
      {/* Background Aurora Orbs */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-emerald-500/15 via-teal-500/10 to-indigo-500/10 blur-[100px] pointer-events-none rounded-full" />

      <div className="max-w-5xl w-full flex flex-col items-center text-center space-y-10 relative z-10">
        {/* Brand Tag Pill */}
        <motion.div
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-semibold shadow-sm"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Next-Generation Messaging Experience</span>
        </motion.div>

        {/* Hero Title & Subtitle */}
        <div className="space-y-4 max-w-3xl">
          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl sm:text-6xl font-extrabold tracking-tight text-base-content leading-tight"
          >
            Chatting reimagined with{" "}
            <span className="bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-400 bg-clip-text text-transparent">
              Mingo
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-base sm:text-lg text-base-content/70 max-w-2xl mx-auto leading-relaxed"
          >
            A fast, human, and modern messaging platform. Built with selective glassmorphism, real-time WebSockets, intelligent draft suggestions, and keyboard-first command controls.
          </motion.p>
        </div>

        {/* CTA Actions */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center gap-3.5 w-full sm:w-auto"
        >
          <button
            onClick={() => navigate(isLogin ? "/chat" : "/register")}
            className="w-full sm:w-auto px-7 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white font-bold text-sm shadow-xl shadow-emerald-500/25 flex items-center justify-center gap-2 active:scale-95 transition"
          >
            <span>{isLogin ? "Open Mingo Chat" : "Get Started Free"}</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          {!isLogin && (
            <button
              onClick={() => navigate("/login")}
              className="w-full sm:w-auto px-7 py-3.5 rounded-2xl bg-base-200 hover:bg-base-300 text-base-content font-bold text-sm border border-base-content/10 transition"
            >
              Sign In to Account
            </button>
          )}
        </motion.div>

        {/* Feature Cards Grid */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full pt-6"
        >
          <div className="p-6 rounded-3xl bg-base-100 border border-base-content/10 shadow-lg flex flex-col items-start text-left space-y-3 hover:border-emerald-500/30 transition group">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/15 flex items-center justify-center text-emerald-500 group-hover:scale-110 transition-transform">
              <Zap className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-base-content">Instant Sockets</h3>
            <p className="text-xs text-base-content/60 leading-relaxed">
              Sub-millisecond real-time message delivery and instant online presence indicators powered by Socket.IO.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-base-100 border border-base-content/10 shadow-lg flex flex-col items-start text-left space-y-3 hover:border-emerald-500/30 transition group">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/15 flex items-center justify-center text-emerald-500 group-hover:scale-110 transition-transform">
              <Sparkles className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-base-content">Mingo AI Drafts</h3>
            <p className="text-xs text-base-content/60 leading-relaxed">
              Generate replies, summarize long threads, and translate conversations with your built-in AI assistant.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-base-100 border border-base-content/10 shadow-lg flex flex-col items-start text-left space-y-3 hover:border-emerald-500/30 transition group">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/15 flex items-center justify-center text-emerald-500 group-hover:scale-110 transition-transform">
              <Command className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-base-content">Command Palette</h3>
            <p className="text-xs text-base-content/60 leading-relaxed">
              Press <kbd className="px-1 py-0.5 rounded bg-base-200 font-mono text-[11px]">Ctrl+K</kbd> to search friends, trigger actions, and navigate with high-speed keyboard shortcuts.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Home;
