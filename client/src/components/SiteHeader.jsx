import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { MessageSquare, Sun, Moon, LogIn, UserPlus } from "lucide-react";

const SiteHeader = () => {
  const { user, isLogin } = useAuth();
  const navigate = useNavigate();
  const [selectedTheme, setSelectedTheme] = useState("dark");

  useEffect(() => {
    const savedTheme = localStorage.getItem("mingoTheme") || "dark";
    document.documentElement.setAttribute("data-theme", savedTheme);
    setSelectedTheme(savedTheme);
  }, []);

  const toggleTheme = () => {
    const nextTheme = selectedTheme === "dark" ? "light" : "dark";
    setSelectedTheme(nextTheme);
    localStorage.setItem("mingoTheme", nextTheme);
    document.documentElement.setAttribute("data-theme", nextTheme);
  };

  return (
    <header className="sticky top-0 z-30 px-4 md:px-8 py-3 bg-base-100/80 backdrop-blur-md border-b border-base-content/10 flex items-center justify-between">
      {/* Brand Logo */}
      <div
        className="flex items-center gap-2.5 cursor-pointer group"
        onClick={() => navigate("/")}
      >
        <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-400 text-white font-extrabold flex items-center justify-center text-lg shadow-md shadow-emerald-500/20 group-hover:scale-105 transition-transform">
          M
        </div>
        <div className="flex items-center gap-1.5">
          <span className="text-xl font-extrabold tracking-tight text-base-content">
            Mingo
          </span>
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1" />
        </div>
      </div>

      {/* Navigation Controls */}
      <div className="flex items-center gap-3">
        {isLogin ? (
          <div className="flex items-center gap-2">
            <button
              onClick={() => navigate("/chat")}
              className="px-3.5 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-semibold flex items-center gap-1.5 shadow-md shadow-emerald-500/20 active:scale-95 transition"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Open Chat</span>
            </button>
            <button
              onClick={() => navigate("/dashboard")}
              className="px-3 py-1.5 rounded-xl bg-base-200 hover:bg-base-300 text-xs font-semibold text-base-content transition"
            >
              {user?.fullName?.split(" ")[0] || "Account"}
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <button
              className="px-3 py-1.5 rounded-xl text-xs font-semibold text-base-content hover:bg-base-200 transition flex items-center gap-1.5"
              onClick={() => navigate("/login")}
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Login</span>
            </button>
            <button
              className="px-3.5 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-semibold shadow-md shadow-emerald-500/20 flex items-center gap-1.5 transition"
              onClick={() => navigate("/register")}
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>Register</span>
            </button>
          </div>
        )}

        {/* Quick Theme Switcher */}
        <button
          onClick={toggleTheme}
          className="p-2 rounded-xl text-base-content/70 hover:bg-base-200 transition"
          title={`Switch to ${selectedTheme === "dark" ? "Light" : "Dark"} mode`}
        >
          {selectedTheme === "dark" ? (
            <Sun className="w-4 h-4 text-amber-400" />
          ) : (
            <Moon className="w-4 h-4 text-indigo-500" />
          )}
        </button>
      </div>
    </header>
  );
};

export default SiteHeader;
