import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Search,
  Sun,
  Moon,
  X,
  ArrowRight
} from "lucide-react";

const MingoCommand = ({ isOpen, onClose, onSelectFriend, users = [], onToggleTheme, currentTheme }) => {
  const [query, setQuery] = useState("");

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        onClose(!isOpen);
      }
      if (e.key === "Escape" && isOpen) {
        onClose(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const filteredUsers = users.filter((u) =>
    u.fullName?.toLowerCase().includes(query.toLowerCase()) ||
    u.email?.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-start justify-center pt-24 px-4 bg-black/60 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: -20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: -20 }}
          transition={{ type: "spring", damping: 25, stiffness: 350 }}
          className="w-full max-w-xl rounded-2xl bg-base-100 border border-base-content/10 shadow-2xl overflow-hidden"
        >
          {/* Header Input */}
          <div className="flex items-center gap-3 px-4 py-3.5 border-b border-base-content/10 bg-base-200/50">
            <Search className="w-5 h-5 text-emerald-500 shrink-0" />
            <input
              type="text"
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Ask Mingo, search friends, commands..."
              className="w-full bg-transparent outline-none text-base text-base-content placeholder:text-base-content/40 font-medium"
            />
            <kbd className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 text-xs font-semibold rounded bg-base-300 text-base-content/60">
              ESC
            </kbd>
            <button
              onClick={() => onClose(false)}
              className="p-1 rounded-lg hover:bg-base-content/10 text-base-content/60 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Results List */}
          <div className="max-h-80 overflow-y-auto p-2 mingo-scrollbar space-y-1">
            {/* Quick Actions */}
            <div className="px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-base-content/50">
              Mingo Actions
            </div>


            <button
              onClick={() => {
                onToggleTheme?.();
                onClose(false);
              }}
              className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl hover:bg-base-200 text-left transition group"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-base-300 flex items-center justify-center text-base-content">
                  {currentTheme === "dark" ? <Sun className="w-4 h-4 text-amber-500" /> : <Moon className="w-4 h-4 text-indigo-500" />}
                </div>
                <div>
                  <div className="text-sm font-medium text-base-content">Toggle Theme</div>
                  <div className="text-xs text-base-content/50">Switch to {currentTheme === "dark" ? "Light" : "Dark"} mode</div>
                </div>
              </div>
              <span className="text-xs font-medium px-2 py-0.5 rounded bg-base-300 text-base-content/70">Theme</span>
            </button>

            {/* People */}
            {filteredUsers.length > 0 && (
              <>
                <div className="px-3 pt-3 pb-1.5 text-xs font-semibold uppercase tracking-wider text-base-content/50">
                  Friends & Conversations ({filteredUsers.length})
                </div>
                {filteredUsers.map((u) => (
                  <button
                    key={u._id}
                    onClick={() => {
                      onSelectFriend(u);
                      onClose(false);
                    }}
                    className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl hover:bg-base-200 text-left transition group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-bold flex items-center justify-center text-xs">
                        {u.fullName?.charAt(0).toUpperCase() || "U"}
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-base-content">{u.fullName}</div>
                        <div className="text-xs text-base-content/50">{u.email}</div>
                      </div>
                    </div>
                    <span className="text-xs text-emerald-500 font-medium flex items-center gap-1 opacity-0 group-hover:opacity-100 transition">
                      Chat <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </button>
                ))}
              </>
            )}

            {filteredUsers.length === 0 && query && (
              <div className="py-8 text-center text-sm text-base-content/50">
                No matching friends found for "{query}"
              </div>
            )}
          </div>

          {/* Footer note */}
          <div className="px-4 py-2 bg-base-200/50 border-t border-base-content/10 flex items-center justify-between text-xs text-base-content/50">
            <span>Tip: Press <kbd className="px-1.5 py-0.5 bg-base-300 rounded font-mono">Ctrl+K</kbd> anywhere in Mingo</span>
            <span className="flex items-center gap-1 font-semibold text-emerald-500">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" /> Mingo Core
            </span>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default MingoCommand;
