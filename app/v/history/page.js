"use client";

import { useEffect, useState, useMemo } from "react";
import Image from "next/image";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { authFetch } from "@/lib/api";

export default function History() {
  const [completedTasks, setCompletedTasks] = useState([]);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [selectedDate, setSelectedDate] = useState("all");

  useEffect(() => {
    const fetchTaskHistory = async () => {
      try {
        const res = await authFetch("/GetTaskHistory");
        const data = await res.json();
        setCompletedTasks(data || []);
      } catch (err) {
        console.error("Failed to load task history:", err);
      }
    };
    fetchTaskHistory();
  }, []);

  /* -------- FILTER TASKS -------- */
  const filteredTasks = useMemo(() => {
    return completedTasks.filter((task) => {
      const matchSearch = task.task
        .toLowerCase()
        .includes(search.toLowerCase());

      const matchStatus =
        status === "all"
          ? true
          : status === "completed"
          ? task.completed
          : !task.completed;

      const matchDate =
        selectedDate === "all"
          ? true
          : task.date === selectedDate;

      return matchSearch && matchStatus && matchDate;
    });
  }, [completedTasks, search, status, selectedDate]);

  /* -------- GROUP BY DATE -------- */
  const groupedByDate = filteredTasks.reduce((acc, task) => {
    if (!acc[task.date]) acc[task.date] = [];
    acc[task.date].push(task);
    return acc;
  }, {});

  /* UNIQUE DATES FOR FILTER */
  const uniqueDates = [...new Set(completedTasks.map((t) => t.date))];

  return (
    <div className="min-h-screen bg-muted/40 p-6">
      <h1 className="text-2xl font-bold mb-6">Task History</h1>

      {/* FILTER BAR */}
      <div className="flex flex-wrap gap-4 mb-8">
        <Input
          placeholder="Search task..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-xs"
        />

        <Select value={status} onValueChange={setStatus}>
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
          </SelectContent>
        </Select>

        <Select value={selectedDate} onValueChange={setSelectedDate}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by date" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Dates</SelectItem>
            {uniqueDates.map((d) => (
              <SelectItem key={d} value={d}>
                {new Date(d).toDateString()}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {filteredTasks.length === 0 ? (
        <p className="text-center text-gray-500 mt-10">
          No tasks match your filters
        </p>
      ) : (
        <div className="space-y-10">
          {Object.entries(groupedByDate).map(([date, tasks]) => (
            <div key={date}>
              <h2 className="text-lg font-semibold mb-4 text-primary">
                {new Date(date).toDateString()}
              </h2>

              <div className="flex gap-4 overflow-x-auto pb-3">
                {tasks.map((task) => (
                  <Card key={task._id} className="min-w-[220px] shrink-0">
                    <CardHeader>
                      <CardTitle className="text-sm">
                        {task.task}
                      </CardTitle>
                    </CardHeader>

                    <CardContent className="flex flex-col items-center gap-2">
                      {task.image ? (
                        <Image
                          src={task.image}
                          alt={task.task}
                          width={180}
                          height={120}
                          className="rounded-md object-cover"
                        />
                      ) : (
                        <div className="w-[180px] h-[120px] bg-gray-200 rounded-md flex items-center justify-center text-gray-400 text-xs">
                          No Image
                        </div>
                      )}
                      <span
                        className={`text-xs font-medium ${
                          task.completed
                            ? "text-green-600"
                            : "text-yellow-600"
                        }`}
                      >
                        {task.completed ? "✔ Completed" : "⏳ Pending"}
                      </span>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
