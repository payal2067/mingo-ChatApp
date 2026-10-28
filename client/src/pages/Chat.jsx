import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../config/api";
import socketAPI from "../config/webSocket.jsx";
import MingoRail from "../components/mingo/MingoRail";
import MingoChatList from "../components/mingo/MingoChatList";
import Chatting from "../components/chat/Chatting";
import MingoEmptyState from "../components/mingo/MingoEmptyState";
import MingoCommand from "../components/mingo/MingoCommand";
import toast from "react-hot-toast";

const Chat = () => {
  const navigate = useNavigate();
  const { user, isLogin } = useAuth();
  const [users, setUsers] = useState([]);
  const [selectedFriend, setSelectedFriend] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState({});
  const [isLoadingUsers, setIsLoadingUsers] = useState(true);
  const [activeRailTab, setActiveRailTab] = useState("chats");
  const [isCommandOpen, setIsCommandOpen] = useState(false);
  const [currentTheme, setCurrentTheme] = useState(
    localStorage.getItem("mingoTheme") || "dark"
  );

  // Sync theme
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", currentTheme);
    localStorage.setItem("mingoTheme", currentTheme);
  }, [currentTheme]);

  const toggleTheme = () => {
    setCurrentTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };

  const fetchUsers = async () => {
    setIsLoadingUsers(true);
    try {
      const res = await api.get("/user/allUsers");
      const allUsers = res.data.data || [];
      const filtered = allUsers.filter((u) => u._id !== user?._id);
      setUsers(filtered);
    } catch (error) {
      console.error("Failed to fetch users", error);
    } finally {
      setIsLoadingUsers(false);
    }
  };

  useEffect(() => {
    if (!isLogin) {
      navigate("/login");
      return;
    }

    if (isLogin && user?._id) {
      socketAPI.emit("OmBhramyaNamah", user._id);
      fetchUsers();

      // Listen for real-time online presence
      const handleOnlineUsers = (activeMap) => {
        setOnlineUsers(activeMap || {});
      };
      socketAPI.on("onlineUsers", handleOnlineUsers);

      return () => {
        socketAPI.emit("OmNamahShivay", user._id);
        socketAPI.off("onlineUsers", handleOnlineUsers);
      };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLogin, user]);

  return (
    <div className="w-screen h-screen flex overflow-hidden bg-base-100 font-sans select-none">
      {/* 1. Mingo Collapsible Rail */}
      <MingoRail
        activeTab={activeRailTab}
        onSelectTab={(tab) => {
          setActiveRailTab(tab);
          if (tab !== "chats") {
            toast(`Tab "${tab}" selected`, {
              style: { borderRadius: "12px", background: "#0B0F17", color: "#fff" }
            });
          }
        }}
        onOpenCommand={() => setIsCommandOpen(true)}
        currentTheme={currentTheme}
        onToggleTheme={toggleTheme}
      />

      {/* 2. Searchable Chat Inbox */}
      <div className={`${selectedFriend ? "hidden md:flex" : "flex"} h-full`}>
        <MingoChatList
          users={users}
          selectedFriend={selectedFriend}
          onSelectFriend={(friend) => setSelectedFriend(friend)}
          onlineUsers={onlineUsers}
          isLoading={isLoadingUsers}
          onNewChat={() => setIsCommandOpen(true)}
        />
      </div>

      {/* 3. Main Conversation View or Empty State */}
      <main className={`flex-1 h-full min-w-0 ${!selectedFriend ? "hidden md:flex" : "flex"}`}>
        {selectedFriend ? (
          <Chatting
            selectedFriend={selectedFriend}
            currentUser={user}
            onBack={() => setSelectedFriend(null)}
            onlineUsers={onlineUsers}
          />
        ) : (
          <MingoEmptyState
            onOpenCommand={() => setIsCommandOpen(true)}
            onNewChat={() => setIsCommandOpen(true)}
          />
        )}
      </main>

      {/* 4. Global Command Palette (Ctrl+K) */}
      <MingoCommand
        isOpen={isCommandOpen}
        onClose={setIsCommandOpen}
        users={users}
        onSelectFriend={(f) => setSelectedFriend(f)}
        onToggleTheme={toggleTheme}
        currentTheme={currentTheme}
      />
    </div>
  );
};

export default Chat;
