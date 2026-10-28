import React, { useState } from "react";
import {
  X,
  Bell,
  BellOff,
  Shield,
  Trash2,
  Image as ImageIcon,
  FileText,
  Link2,
  ExternalLink,
  ChevronRight
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import toast from "react-hot-toast";

const MingoDetails = ({
  isOpen,
  onClose,
  friend,
  isOnline = false,
  onClearChat
}) => {
  const [isMuted, setIsMuted] = useState(false);
  const [activeMediaTab, setActiveMediaTab] = useState("media"); // 'media' | 'files' | 'links'

  if (!isOpen) return null;

  const mockSharedMedia = [
    { id: 1, type: "image", url: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=300&q=80" },
    { id: 2, type: "image", url: "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=300&q=80" },
    { id: 3, type: "image", url: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=300&q=80" },
    { id: 4, type: "image", url: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=300&q=80" },
  ];

  const mockFiles = [
    { id: 1, name: "Project-Proposal-v2.pdf", size: "2.4 MB", date: "Yesterday" },
    { id: 2, name: "Design-Tokens-Mingo.zip", size: "14.8 MB", date: "May 12" },
  ];

  const mockLinks = [
    { id: 1, title: "Mingo Design Specifications", url: "https://mingo.chat/docs" },
    { id: 2, title: "GitHub Repository", url: "https://github.com/mingo/app" },
  ];

  return (
    <AnimatePresence>
      <motion.aside
        initial={{ x: "100%", opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: "100%", opacity: 0 }}
        transition={{ type: "spring", damping: 26, stiffness: 320 }}
        className="w-full sm:w-80 lg:w-96 h-full bg-base-100 border-l border-base-content/10 flex flex-col z-20 shrink-0"
      >
        {/* Header */}
        <div className="h-16 px-4 border-b border-base-content/10 flex items-center justify-between">
          <h3 className="font-bold text-base text-base-content">Contact Info</h3>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl hover:bg-base-200 text-base-content/60 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Profile Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-6 mingo-scrollbar">
          {/* Avatar & Name */}
          <div className="flex flex-col items-center text-center">
            <div className="relative mb-3">
              <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-emerald-500/20 to-teal-500/20 text-emerald-600 dark:text-emerald-400 font-extrabold flex items-center justify-center text-3xl border-2 border-emerald-500/20 shadow-lg shadow-emerald-500/10">
                {friend?.fullName?.charAt(0).toUpperCase() || "U"}
              </div>
              {isOnline && (
                <span className="absolute bottom-0 right-0 w-4 h-4 bg-emerald-500 rounded-full border-2 border-base-100 ring-2 ring-emerald-500/40" />
              )}
            </div>

            <h4 className="text-lg font-bold text-base-content">{friend?.fullName || "Friend"}</h4>
            <p className="text-xs text-base-content/60 mt-0.5">{friend?.email}</p>
            <span className="mt-2 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              {isOnline ? "Active on Mingo" : "Offline"}
            </span>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => {
                setIsMuted(!isMuted);
                toast.success(isMuted ? "Notifications Unmuted" : "Notifications Muted", {
                  style: { borderRadius: "12px", background: "#0B0F17", color: "#fff" }
                });
              }}
              className="flex flex-col items-center justify-center gap-1.5 p-3 rounded-2xl bg-base-200/70 hover:bg-base-200 text-xs font-medium text-base-content transition"
            >
              {isMuted ? <BellOff className="w-4 h-4 text-rose-500" /> : <Bell className="w-4 h-4 text-emerald-500" />}
              <span>{isMuted ? "Unmute" : "Mute"}</span>
            </button>

            <button
              onClick={() => {
                toast("Contact blocked", {
                  icon: "🛡️",
                  style: { borderRadius: "12px", background: "#0B0F17", color: "#fff" }
                });
              }}
              className="flex flex-col items-center justify-center gap-1.5 p-3 rounded-2xl bg-base-200/70 hover:bg-base-200 text-xs font-medium text-base-content transition"
            >
              <Shield className="w-4 h-4 text-base-content/60" />
              <span>Block</span>
            </button>
          </div>

          {/* Shared Media Tabs */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h5 className="text-xs font-bold uppercase tracking-wider text-base-content/50">
                Shared Media & Files
              </h5>
            </div>

            {/* Sub-tabs */}
            <div className="flex border-b border-base-content/10 text-xs font-medium">
              <button
                onClick={() => setActiveMediaTab("media")}
                className={`flex-1 py-1.5 border-b-2 transition ${
                  activeMediaTab === "media"
                    ? "border-emerald-500 text-emerald-600 dark:text-emerald-400 font-semibold"
                    : "border-transparent text-base-content/60"
                }`}
              >
                Media
              </button>
              <button
                onClick={() => setActiveMediaTab("files")}
                className={`flex-1 py-1.5 border-b-2 transition ${
                  activeMediaTab === "files"
                    ? "border-emerald-500 text-emerald-600 dark:text-emerald-400 font-semibold"
                    : "border-transparent text-base-content/60"
                }`}
              >
                Docs
              </button>
              <button
                onClick={() => setActiveMediaTab("links")}
                className={`flex-1 py-1.5 border-b-2 transition ${
                  activeMediaTab === "links"
                    ? "border-emerald-500 text-emerald-600 dark:text-emerald-400 font-semibold"
                    : "border-transparent text-base-content/60"
                }`}
              >
                Links
              </button>
            </div>

            {/* Media Tab Body */}
            {activeMediaTab === "media" && (
              <div className="grid grid-cols-2 gap-2">
                {mockSharedMedia.map((m) => (
                  <div key={m.id} className="aspect-square rounded-xl overflow-hidden bg-base-300">
                    <img src={m.url} alt="Shared" className="w-full h-full object-cover hover:scale-105 transition" />
                  </div>
                ))}
              </div>
            )}

            {activeMediaTab === "files" && (
              <div className="space-y-2">
                {mockFiles.map((f) => (
                  <div key={f.id} className="flex items-center justify-between p-2.5 rounded-xl bg-base-200/60 hover:bg-base-200 transition text-xs">
                    <div className="flex items-center gap-2 truncate">
                      <FileText className="w-4 h-4 text-emerald-500 shrink-0" />
                      <div className="truncate">
                        <p className="font-semibold text-base-content truncate">{f.name}</p>
                        <p className="text-[11px] text-base-content/50">{f.size}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeMediaTab === "links" && (
              <div className="space-y-2">
                {mockLinks.map((l) => (
                  <a
                    key={l.id}
                    href={l.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-2.5 rounded-xl bg-base-200/60 hover:bg-base-200 transition text-xs group"
                  >
                    <div className="flex items-center gap-2 truncate">
                      <Link2 className="w-4 h-4 text-emerald-500 shrink-0" />
                      <div className="truncate">
                        <p className="font-semibold text-base-content truncate group-hover:text-emerald-500 transition">{l.title}</p>
                        <p className="text-[11px] text-base-content/50 truncate">{l.url}</p>
                      </div>
                    </div>
                    <ExternalLink className="w-3.5 h-3.5 text-base-content/40 group-hover:text-emerald-500 shrink-0" />
                  </a>
                ))}
              </div>
            )}
          </div>

          {/* Danger Zone */}
          <div className="pt-4 border-t border-base-content/10">
            <button
              onClick={() => {
                if (window.confirm("Clear all messages in this conversation?")) {
                  onClearChat?.();
                  toast.success("Chat history cleared");
                }
              }}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-rose-500 hover:bg-rose-500/10 text-xs font-semibold transition"
            >
              <Trash2 className="w-4 h-4" />
              <span>Clear Chat History</span>
            </button>
          </div>
        </div>
      </motion.aside>
    </AnimatePresence>
  );
};

export default MingoDetails;
