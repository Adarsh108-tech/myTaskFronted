"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import Navbar from "@/components/dashboard/navbar";
import TaskCard from "@/components/dashboard/taskCard";
import HobbiesStatsModal from "@/components/dashboard/hobbies&stats";
import Sidebar from "@/components/dashboard/sidebar";
import ProfileModal from "@/components/dashboard/profile";
import { authFetch } from "@/lib/api";

export default function Dashboard() {
  const { setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const isDark = resolvedTheme === "dark";

  const [dailyTasks, setDailyTasks] = useState([]);
  const [todayTasks, setTodayTasks] = useState([]);
  const [todayInput, setTodayInput] = useState("");
  const [hobbyInput, setHobbyInput] = useState("");
  const [hobbyOpen, setHobbyOpen] = useState(false);
  const [statsOpen, setStatsOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [userName, setUserName] = useState("");
  const [profilePicture, setProfilePicture] = useState("");

  const [efficiencyData, setEfficiencyData] = useState([]);
  const [calendarData, setCalendarData] = useState({});

  useEffect(() => {
    setMounted(true);
    loadProfile();
    loadTodayTasks();
    loadTaskHistory();
  }, []);

  /* ---------------- API ---------------- */
  const loadProfile = async () => {
    const res = await authFetch("/me");
    const data = await res.json();
    setUserName(data.name);
    setProfilePicture(data.profilePicture || "");
    setDailyTasks(data.hobbies.map((h) => ({ text: h, done: false })));
  };

  const loadTodayTasks = async () => {
    const res = await authFetch("/GetDailyTasks");
    const data = await res.json();
    setTodayTasks(
      data.map((t) => ({ id: t._id, text: t.task, done: t.completed, image: t.image }))
    );
  };

  const loadTaskHistory = async () => {
    try {
      const res = await authFetch("/GetTaskHistory");
      const data = await res.json();

      const weekMap = { Mon: [], Tue: [], Wed: [], Thu: [], Fri: [], Sat: [], Sun: [] };
      const calMap = {};

      data.forEach((t) => {
        const date = new Date(t.date);
        const dayName = date.toLocaleDateString("en-US", { weekday: "short" });
        const completed = t.completed ? 1 : 0;
        if (weekMap[dayName]) weekMap[dayName].push(completed);
        calMap[t.date] = t.completed;
      });

      const efficiency = Object.entries(weekMap).map(([day, values]) => {
        const total = values.length;
        const sum = values.reduce((a, b) => a + b, 0);
        const percent = total ? Math.round((sum / total) * 100) : 0;
        return { day, value: percent };
      });

      setEfficiencyData(efficiency);
      setCalendarData(calMap);
    } catch (err) {
      console.error("Failed to load task history:", err);
    }
  };

  /* ---------------- TASK HANDLERS ---------------- */
  const addTodayTask = async () => {
    if (!todayInput.trim()) return;

    try {
      const res = await authFetch("/AddDailyTasks", {
        method: "POST",
        body: JSON.stringify({ task: todayInput }),
      });
      const data = await res.json();

      setTodayTasks((prev) => [...prev, { id: data._id, text: data.task, done: false }]);
      setTodayInput("");
    } catch (err) {
      console.error("Error adding task:", err);
    }
  };

  const toggleTask = (tasks, setTasks, index) => {
    const updated = [...tasks];
    updated[index].done = !updated[index].done;
    setTasks(updated);
  };

  const addHobby = async () => {
    if (!hobbyInput.trim()) return;

    try {
      await authFetch("/AddHobbies", {
        method: "POST",
        body: JSON.stringify({ hobby: hobbyInput }),
      });
      setDailyTasks((prev) => [...prev, { text: hobbyInput, done: false }]);
      setHobbyInput("");
    } catch (err) {
      console.error("Error adding hobby:", err);
    }
  };

  const deleteHobby = (index) => {
    setDailyTasks((prev) => prev.filter((_, i) => i !== index));
  };

  const getDayColor = (date) => {
    const key = date.toISOString().split("T")[0];
    if (calendarData[key] === true) return "bg-green-500";
    if (calendarData[key] === false) return "bg-red-500";
    return "";
  };

  /* ---------------- TASK DONE + IMAGE UPLOAD ---------------- */
  const handleTaskDone = async (taskId) => {
    try {
      const fileInput = document.createElement("input");
      fileInput.type = "file";
      fileInput.accept = "image/*";

      fileInput.onchange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append("image", file);
        formData.append("taskId", taskId);

        const res = await fetch("http://localhost:5000/TaskDoneUploadPicture", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: formData,
        });

        const data = await res.json();

        if (data.imageUrl) {
          setTodayTasks((prev) =>
            prev.map((t) =>
              t.id === taskId ? { ...t, done: true, image: data.imageUrl } : t
            )
          );
        }
      };

      fileInput.click();
    } catch (err) {
      console.error("Error uploading task image:", err);
    }
  };

  /* ---------------- PROFILE PICTURE HANDLERS ---------------- */
  const handleProfilePictureUpload = async () => {
    try {
      const fileInput = document.createElement("input");
      fileInput.type = "file";
      fileInput.accept = "image/*";

      fileInput.onchange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append("image", file);

        const res = await fetch("http://localhost:5000/SetProfilePicture", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: formData,
        });

        const data = await res.json();
        if (data.profilePicture) {
          setProfilePicture(data.profilePicture);
        }
      };

      fileInput.click();
    } catch (err) {
      console.error("Error uploading profile picture:", err);
    }
  };

  const handleProfilePictureDelete = async () => {
    try {
      const res = await fetch("http://localhost:5000/DeleteProfilePicture", {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      const data = await res.json();
      if (data.message === "Profile picture deleted") {
        setProfilePicture("");
      }
    } catch (err) {
      console.error("Error deleting profile picture:", err);
    }
  };

  return (
    <div className="min-h-screen bg-muted/40">
      <ProfileModal
        open={profileOpen}
        setOpen={setProfileOpen}
        userName={userName}
        profilePicture={profilePicture}
        refreshProfile={loadProfile}
        onUpload={handleProfilePictureUpload}
        onDelete={handleProfilePictureDelete}
      />

      <Navbar
        mounted={mounted}
        isDark={isDark}
        setTheme={setTheme}
        setHobbyOpen={setHobbyOpen}
        setStatsOpen={setStatsOpen}
        setSidebarOpen={setSidebarOpen}
        setProfileOpen={setProfileOpen}
        userName={userName}
        profilePicture={profilePicture}
      />

      <Sidebar
        open={sidebarOpen}
        setOpen={setSidebarOpen}
        setProfileOpen={setProfileOpen}
        userName={userName}
        profilePicture={profilePicture}
      />

      <div className="max-w-7xl mx-auto p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        <TaskCard
          title="Daily Habits"
          tasks={dailyTasks}
          toggleTask={(i) => toggleTask(dailyTasks, setDailyTasks, i)}
        />

        <TaskCard
          title="Today Tasks"
          tasks={todayTasks}
          toggleTask={(i) => toggleTask(todayTasks, setTodayTasks, i)}
          inputValue={todayInput}
          setInputValue={setTodayInput}
          addTask={addTodayTask}
          showInput
          onTaskDone={handleTaskDone} // only for today tasks
        />
      </div>

      <HobbiesStatsModal
        hobbyOpen={hobbyOpen}
        setHobbyOpen={setHobbyOpen}
        hobbyInput={hobbyInput}
        setHobbyInput={setHobbyInput}
        addHobby={addHobby}
        deleteHobby={deleteHobby}
        dailyTasks={dailyTasks}
        statsOpen={statsOpen}
        setStatsOpen={setStatsOpen}
        efficiencyData={efficiencyData}
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
        getDayColor={getDayColor}
      />
    </div>
  );
}
