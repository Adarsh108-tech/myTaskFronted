"use client";

import { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
export default function Sidebar({ open, setOpen , setProfileOpen , userName , profilePicture}) {
  // Prevent scrolling when sidebar is open
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "auto";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [open]);

  return (
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 bg-black bg-opacity-40 transition-opacity duration-300 ${
          open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setOpen(false)}
      />

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 h-full w-72 bg-white dark:bg-gray-900
          shadow-xl border-r border-gray-200 dark:border-gray-700
          transform transition-transform duration-300
          ${open ? "translate-x-0" : "-translate-x-full"}
          z-50 flex flex-col p-6 overflow-y-auto
        `}
      >
        {/* User Profile Section */}
        <div className="flex flex-col items-center gap-3 mb-8 border-b border-gray-200 dark:border-gray-700 pb-6">
          <Image
            src={profilePicture || "/KingAdarsh.png"}
            alt="User"
            width={80}
            height={80}
            className="rounded-full border-2 border-gray-300 dark:border-gray-600"
          />
          <h2 className="font-semibold text-lg text-gray-800 dark:text-gray-200">
            {userName}
          </h2>
        </div>

        {/* Menu */}
        <div className="flex flex-col gap-3 mt-4">
          <Link href="/v/history">
            <Button
              variant="ghost"
              className="w-full justify-start text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800"
              onClick={() => setOpen(false)}
            >
              History
            </Button>
          </Link>

            <Button
            variant="ghost"
            className="w-full justify-start text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800"
            onClick={() => {
                setProfileOpen(true);
                setOpen(false); // close sidebar if needed
            }}
            >
            Profile Settings
            </Button>
        </div>
      </aside>
    </>
  );
}
