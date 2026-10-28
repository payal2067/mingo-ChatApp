import React, { useState } from "react";
import { Search, Plus, MessageSquare } from "lucide-react";
import { motion } from "motion/react";

const MingoChatList = ({
  users = [],
  selectedFriend,
  onSelectFriend,
  onlineUsers = {},
  isLoading = false,
  onNewChat
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterTab, setFilterTab] = useState("all"); // 'all' | 'unread' | 'favorites'

  const filteredUsers = users.filter((friend) => {
    const matchesSearch =
      friend.fullName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      friend.email?.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (!matchesSearch) return false;
    if (filterTab === "unread") return friend.unreadCount > 0;
    if (filterTab === "favorites") return friend.isFavorite;
    return true;
  });

  return (
    <div className="w-full md:w-80 lg:w-96 h-full flex flex-col bg-base-100/90 border-r border-base-content/10 shrink-0">
      {/* Inbox Header */}
      <div className="p-4 border-b border-base-content/10 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h2 className="text-xl font-bold tracking-tight text-base-content">
            Messages
          </h2>
          <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
            {users.length}
          </span>
        </div>

        <button
          onClick={onNewChat}
          className="w-8 h-8 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white flex items-center justify-center shadow-md shadow-emerald-500/20 active:scale-95 transition"
          title="New conversation"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>

      {/* Search Input */}
      <div className="px-4 pt-3 pb-2">
        <div className="relative flex items-center">
          <Search className="w-4 h-4 absolute left-3 text-base-content/40 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search conversations..."
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-base-200/70 border border-base-content/10 text-sm focus:outline-none focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/15 transition placeholder:text-base-content/40"
          />
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1.5 px-4 pb-2 border-b border-base-content/5 text-xs font-medium">
        <button
          onClick={() => setFilterTab("all")}
          className={`px-3 py-1 rounded-lg transition ${
            filterTab === "all"
              ? "bg-base-200 text-base-content font-semibold"
              : "text-base-content/60 hover:text-base-content"
          }`}
        >
          All
        </button>
        <button
          onClick={() => setFilterTab("unread")}
          className={`px-3 py-1 rounded-lg transition ${
            filterTab === "unread"
              ? "bg-base-200 text-base-content font-semibold"
              : "text-base-content/60 hover:text-base-content"
          }`}
        >
          Unread
        </button>
        <button
          onClick={() => setFilterTab("favorites")}
          className={`px-3 py-1 rounded-lg transition ${
            filterTab === "favorites"
              ? "bg-base-200 text-base-content font-semibold"
              : "text-base-content/60 hover:text-base-content"
          }`}
        >
          Favorites
        </button>
      </div>

      {/* Chat Contacts List */}
      <div className="flex-1 overflow-y-auto p-2 space-y-1 mingo-scrollbar">
        {isLoading ? (
          // Shimmer Skeleton Loading
          Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="flex items-center gap-3 p-3 rounded-2xl animate-pulse">
              <div className="w-12 h-12 rounded-2xl bg-base-300 shrink-0" />
              <div className="flex-1 space-y-2">
                <div className="h-4 w-28 bg-base-300 rounded" />
                <div className="h-3 w-40 bg-base-300/60 rounded" />
              </div>
            </div>
          ))
        ) : filteredUsers.length > 0 ? (
          filteredUsers.map((friend) => {
            const isSelected = selectedFriend?._id === friend._id;
            const isOnline = !!onlineUsers[friend._id];

            return (
              <motion.div
                key={friend._id}
                whileTap={{ scale: 0.98 }}
                onClick={() => onSelectFriend(friend)}
                className={`relative flex items-center gap-3 p-3 rounded-2xl cursor-pointer transition-all ${
                  isSelected
                    ? "bg-emerald-500/10 border border-emerald-500/30 shadow-sm"
                    : "hover:bg-base-200/70 border border-transparent"
                }`}
              >
                {/* Avatar with Presence Indicator */}
                <div className="relative shrink-0">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-500/20 to-teal-500/20 text-emerald-600 dark:text-emerald-400 font-bold flex items-center justify-center text-base border border-emerald-500/20">
                    {friend.fullName?.charAt(0).toUpperCase() || "U"}
                  </div>
                  {isOnline ? (
                    <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-500 rounded-full border-2 border-base-100 ring-2 ring-emerald-500/30" />
                  ) : (
                    <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-base-content/20 rounded-full border-2 border-base-100" />
                  )}
                </div>

                {/* Info & Snippet */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-0.5">
                    <h3 className={`text-sm truncate font-semibold ${isSelected ? "text-emerald-600 dark:text-emerald-400" : "text-base-content"}`}>
                      {friend.fullName}
                    </h3>
                    <span className="text-[11px] text-base-content/40 shrink-0">
                      {isOnline ? "Online" : "Recently"}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-xs text-base-content/60">
                    <p className="truncate pr-2">
                      {friend.lastMessage || "Tap to start conversation"}
                    </p>
                    {isOnline && (
                      <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
                    )}
                  </div>
                </div>

                {/* Selection Accent */}
                {isSelected && (
                  <span className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-7 bg-emerald-500 rounded-l-full" />
                )}
              </motion.div>
            );
          })
        ) : (
          <div className="p-8 text-center text-base-content/50 space-y-2">
            <MessageSquare className="w-8 h-8 mx-auto opacity-30 text-emerald-500" />
            <p className="text-sm font-medium">No conversations found</p>
            <p className="text-xs text-base-content/40">Try searching for another friend</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MingoChatList;
