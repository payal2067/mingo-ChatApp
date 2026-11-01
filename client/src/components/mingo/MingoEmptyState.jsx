import React from "react";
import { motion } from "motion/react";
import { UserPlus, MessageSquare } from "lucide-react";

const MingoEmptyState = ({ onNewChat }) => {
  return (
    <div className="flex-1 h-full flex flex-col items-center justify-center p-6 bg-gradient-to-br from-base-100 via-base-100 to-base-200/50 select-none">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="flex flex-col items-center text-center space-y-4 max-w-sm"
      >
        <div className="w-16 h-16 rounded-3xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center mb-2 shadow-inner">
          <MessageSquare className="w-8 h-8" />
        </div>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-base-content tracking-tight">
          Welcome to{" "}
          <span className="bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-400 bg-clip-text text-transparent">
            Mingo
          </span>
        </h2>
        <p className="text-sm text-base-content/60">
          Select a contact from the left, or save a friend's mobile number to start chatting.
        </p>
        {onNewChat && (
          <button
            onClick={onNewChat}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white font-semibold text-sm shadow-md shadow-emerald-500/20 active:scale-95 transition mt-2"
          >
            <UserPlus className="w-4 h-4" /> Save New Contact
          </button>
        )}
      </motion.div>
    </div>
  );
};

export default MingoEmptyState;
