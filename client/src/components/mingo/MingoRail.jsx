import React from "react";
import {
  MessageSquare,
  Phone,
  Users,
  Archive,
  Settings,
  Sun,
  Moon,
  LogOut,
  Command
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const MingoRail = ({ activeTab, onSelectTab, onOpenCommand, currentTheme, onToggleTheme }) => {
  const navigate = useNavigate();
  const { user, setUser, setIsLogin } = useAuth();

  const handleLogout = () => {
    sessionStorage.removeItem("AppUser");
    setUser(null);
    setIsLogin(false);
    navigate("/login");
  };

  const navItems = [
    { id: "chats", label: "Chats", icon: MessageSquare, badge: 2 },
    { id: "groups", label: "Groups", icon: Users },
    { id: "calls", label: "Calls", icon: Phone },
    { id: "archive", label: "Archive", icon: Archive },
  ];

  return (
    <aside className="w-16 md:w-18 h-full flex flex-col items-center justify-between py-4 bg-base-100 border-r border-base-content/10 shrink-0 z-20 select-none">
      {/* Top: Logo & Main Navigation */}
      <div className="flex flex-col items-center gap-6 w-full">
        {/* Mingo Logo Icon */}
        <button
          onClick={() => onSelectTab("chats")}
          className="relative group flex items-center justify-center w-11 h-11 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-400 text-white shadow-lg shadow-emerald-500/25 hover:scale-105 active:scale-95 transition-all"
          title="Mingo Messaging"
        >
          <span className="font-extrabold text-xl tracking-tighter">M</span>
          <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-emerald-400 rounded-full border-2 border-base-100" />
        </button>

        {/* Navigation List */}
        <nav className="flex flex-col items-center gap-2 w-full px-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSelectTab(item.id)}
                className={`relative w-11 h-11 rounded-xl flex items-center justify-center transition-all group ${
                  isActive
                    ? "bg-emerald-500 text-white shadow-md shadow-emerald-500/20 font-semibold"
                    : "text-base-content/60 hover:text-base-content hover:bg-base-200"
                }`}
                title={item.label}
              >
                <Icon className={`w-5 h-5 transition-transform duration-200 ${isActive ? "scale-110" : "group-hover:scale-110"}`} />
                {isActive && (
                  <span className="absolute -left-2 top-1/2 -translate-y-1/2 w-1.5 h-5 bg-emerald-500 rounded-r-full" />
                )}
                {item.badge && !isActive && (
                  <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-base-100" />
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom: Command Palette, Theme & User */}
      <div className="flex flex-col items-center gap-3 w-full px-2">
        {/* Command shortcut */}
        <button
          onClick={onOpenCommand}
          className="w-10 h-10 rounded-xl flex items-center justify-center text-base-content/50 hover:text-emerald-500 hover:bg-emerald-500/10 transition"
          title="Command Palette (Ctrl+K)"
        >
          <Command className="w-5 h-5" />
        </button>

        {/* Theme Toggle */}
        <button
          onClick={onToggleTheme}
          className="w-10 h-10 rounded-xl flex items-center justify-center text-base-content/60 hover:text-base-content hover:bg-base-200 transition"
          title={`Switch to ${currentTheme === "dark" ? "Light" : "Dark"} Mode`}
        >
          {currentTheme === "dark" ? (
            <Sun className="w-5 h-5 text-amber-400" />
          ) : (
            <Moon className="w-5 h-5 text-indigo-500" />
          )}
        </button>

        {/* User Avatar & Logout */}
        <div className="relative pt-2 border-t border-base-content/10 w-full flex flex-col items-center gap-2">
          <button
            onClick={() => navigate("/dashboard")}
            className="w-10 h-10 rounded-full ring-2 ring-emerald-500/30 overflow-hidden bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-bold flex items-center justify-center text-sm hover:ring-emerald-500 transition"
            title={`${user?.fullName || "Account"} - Settings`}
          >
            {user?.fullName?.charAt(0).toUpperCase() || "U"}
          </button>
          
          <button
            onClick={handleLogout}
            className="p-2 rounded-lg text-rose-500/70 hover:text-rose-500 hover:bg-rose-500/10 transition"
            title="Log out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
};

export default MingoRail;
