"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { FiBarChart2 } from "react-icons/fi";
import { Sun, Moon } from "lucide-react";

export default function Navbar({
  mounted,
  isDark,
  setTheme,
  setHobbyOpen,
  setStatsOpen,
  setSidebarOpen,
  userName,
  profilePicture, // NEW
}) {
  return (
    <nav className="sticky top-0 z-50 bg-background border-b">
      <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
        {/* USER PROFILE */}
        <div
          className="flex items-center gap-3 cursor-pointer"
          onClick={() => setSidebarOpen(true)}
        >
          <Image
            src={profilePicture || "/KingAdarsh.png"} // fallback if no profile pic
            alt="User"
            width={36}
            height={36}
            className="rounded-full object-cover"
          />
          <span className="font-semibold">{userName}</span>
        </div>

        {/* ACTIONS */}
        <div className="flex items-center gap-3">
          {mounted && (
            <button
              onClick={() => setTheme(isDark ? "light" : "dark")}
              className="relative w-14 h-8 rounded-full bg-muted flex items-center px-1 transition"
            >
              <div
                className={`w-6 h-6 rounded-full bg-background shadow-md flex items-center justify-center transition-transform duration-300
                ${isDark ? "translate-x-6" : ""}`}
              >
                {isDark ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
              </div>
            </button>
          )}

          <Button variant="outline" onClick={() => setHobbyOpen(true)}>
            Hobbies
          </Button>

          <Button variant="ghost" size="icon" onClick={() => setStatsOpen(true)}>
            <FiBarChart2 className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </nav>
  );
}
