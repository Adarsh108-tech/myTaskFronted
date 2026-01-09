"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { authFetch } from "@/lib/api";

export default function ProfileModal({
  open,
  setOpen,
  userName = "Adarsh",
  profilePicture,
  refreshProfile,
  onUpload,
  onDelete,
}) {
  const [name, setName] = useState(userName);
  const [password, setPassword] = useState("");

  // Update local state if userName changes
  useEffect(() => {
    setName(userName);
  }, [userName]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Update name
      if (name.trim() && name !== userName) {
        await authFetch("/ChangeName", {
          method: "PUT",
          body: JSON.stringify({ name }),
        });
      }

      // Update password
      if (password.trim()) {
        await authFetch("/ChangePassword", {
          method: "PUT",
          body: JSON.stringify({ newPassword: password }),
        });
      }

      // Refresh parent state
      refreshProfile();
      setPassword("");
      setOpen(false);
    } catch (err) {
      console.error("Error updating profile:", err);
    }
  };

  if (!open) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black bg-opacity-40 z-40"
        onClick={() => setOpen(false)}
      />

      {/* Modal */}
      <div className="fixed inset-0 flex items-center justify-center z-50">
        <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg w-96 p-6 relative">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
            Profile Settings
          </h2>

          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            {/* User Picture */}
            <div className="flex flex-col items-center gap-2">
              <Image
                src={profilePicture || "/KingAdarsh.png"}
                alt="User"
                width={80}
                height={80}
                className="rounded-full border-2 border-gray-300 dark:border-gray-600"
              />

              <div className="flex gap-2 mt-2">
                <Button type="button" onClick={onUpload}>
                  Upload
                </Button>
                {profilePicture && (
                  <Button type="button" onClick={onDelete} variant="destructive">
                    Delete
                  </Button>
                )}
              </div>
            </div>

            {/* Name */}
            <div className="flex flex-col">
              <label className="text-gray-700 dark:text-gray-300 mb-1">Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="px-3 py-2 rounded-md border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            {/* Password */}
            <div className="flex flex-col">
              <label className="text-gray-700 dark:text-gray-300 mb-1">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="New Password"
                className="px-3 py-2 rounded-md border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Submit */}
            <Button type="submit" className="mt-2">
              Save Changes
            </Button>
          </form>

          {/* Close Button */}
          <button
            onClick={() => setOpen(false)}
            className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 dark:hover:text-gray-200"
          >
            ✕
          </button>
        </div>
      </div>
    </>
  );
}
