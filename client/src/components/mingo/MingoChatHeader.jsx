import React from "react";
import {
  Phone,
  Video,
  Info,
  ChevronLeft,
  Pencil
} from "lucide-react";
import toast from "react-hot-toast";

const MingoChatHeader = ({
  friend,
  isOnline = false,
  onBack,
  onToggleDetails,
  isDetailsOpen,
  onEditContact
}) => {
  const handleStartCall = (type) => {
    toast(`Initiating ${type} call with ${friend?.fullName || "friend"}...`, {
      icon: type === "video" ? "📹" : "📞",
      style: {
        borderRadius: "16px",
        background: "#0B0F17",
        color: "#fff",
      },
    });
  };

  return (
    <header className="h-16 px-4 flex items-center justify-between border-b border-base-content/10 bg-base-100/80 backdrop-blur-md sticky top-0 z-10">
      {/* Left: Back (Mobile) + Friend Info */}
      <div className="flex items-center gap-3">
        {onBack && (
          <button
            onClick={onBack}
            className="md:hidden p-1.5 -ml-1 rounded-xl text-base-content/70 hover:bg-base-200 transition"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
        )}

        <div className="relative">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500/20 to-teal-500/20 text-emerald-600 dark:text-emerald-400 font-bold flex items-center justify-center text-sm border border-emerald-500/20">
            {(friend?.displayName || friend?.fullName)?.charAt(0).toUpperCase() || "U"}
          </div>
          {isOnline && (
            <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 rounded-full border-2 border-base-100 ring-1 ring-emerald-500/40 animate-pulse" />
          )}
        </div>

        <div>
          <div className="flex items-center gap-1.5">
            <h2 className="text-sm md:text-base font-bold text-base-content leading-tight">
              {friend?.displayName || friend?.fullName || "Conversation"}
            </h2>
            {friend?.isBlocked && (
              <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-md bg-rose-500/15 text-rose-500 border border-rose-500/20">
                Blocked
              </span>
            )}
            {onEditContact && friend && (
              <button
                onClick={() => onEditContact(friend)}
                className="p-1 rounded-lg text-base-content/40 hover:text-emerald-500 hover:bg-base-200 transition"
                title="Edit contact name"
              >
                <Pencil className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
          <div className="flex items-center gap-1.5">
            {friend?.isBlocked ? (
              <>
                <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                <span className="text-xs text-rose-500 font-semibold">Blocked contact</span>
              </>
            ) : (
              <>
                <span className={`w-1.5 h-1.5 rounded-full ${isOnline ? "bg-emerald-500" : "bg-base-content/30"}`} />
                <span className="text-xs text-base-content/60 font-medium">
                  {isOnline ? "Online now" : "Last seen recently"}
                </span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-1 sm:gap-2">
        <button
          onClick={() => handleStartCall("audio")}
          className="p-2 rounded-xl text-base-content/70 hover:text-base-content hover:bg-base-200 transition"
          title="Voice Call"
        >
          <Phone className="w-4 h-4" />
        </button>

        <button
          onClick={() => handleStartCall("video")}
          className="p-2 rounded-xl text-base-content/70 hover:text-base-content hover:bg-base-200 transition"
          title="Video Call"
        >
          <Video className="w-4 h-4" />
        </button>

        <button
          onClick={onToggleDetails}
          className={`p-2 rounded-xl transition ${
            isDetailsOpen
              ? "bg-emerald-500 text-white shadow-sm shadow-emerald-500/20"
              : "text-base-content/70 hover:text-base-content hover:bg-base-200"
          }`}
          title="Conversation Details"
        >
          <Info className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
};

export default MingoChatHeader;
