import React from "react";
import { motion } from "motion/react";

const MingoEmptyState = () => {
  return (
    <div className="flex-1 h-full flex flex-col items-center justify-center p-6 bg-gradient-to-br from-base-100 via-base-100 to-base-200/50 select-none">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="flex flex-col items-center text-center space-y-4"
      >
        <h2 className="text-3xl sm:text-4xl font-extrabold text-base-content tracking-tight">
          Welcome to{" "}
          <span className="bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-400 bg-clip-text text-transparent">
            Mingo
          </span>
        </h2>
      </motion.div>
    </div>
  );
};

export default MingoEmptyState;
