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
  const [filter, setFilter] = useState("all");

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

  /* -------- APPLY SEARCH + FILTER -------- */
  const filteredTasks = useMemo(() => {
    return completedTasks.filter((task) => {
      const matchesSearch = task.task
        .toLowerCase()
        .includes(search.toLowerCase());

      const matchesFilter =
        filter === "all" ||
        (filter === "withImage" && task.image) ||
        (filter === "noImage" && !task.image);

      return matchesSearch && matchesFilter;
    });
  }, [completedTasks, search, filter]);

  /* -------- GROUP BY DATE -------- */
  const groupedByDate = filteredTasks.reduce((acc, task) => {
    if (!acc[task.date]) acc[task.date] = [];
    acc[task.date].push(task);
    return acc;
  }, {});

  return (
    <div className="min-h-screen bg-muted/40 p-6">
      <h1 className="text-2xl font-bold mb-6">Task History</h1>

      {/* SEARCH + FILTER BAR */}
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <Input
          placeholder="Search tasks..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="md:w-1/2"
        />

        <Select value={filter} onValueChange={setFilter}>
          <SelectTrigger className="md:w-1/4">
            <SelectValue placeholder="Filter" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Tasks</SelectItem>
            <SelectItem value="withImage">With Image</SelectItem>
            <SelectItem value="noImage">No Image</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {filteredTasks.length === 0 ? (
        <p className="text-center text-gray-500 mt-10">
          No tasks match your search 
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
                      <CardTitle className="text-sm">{task.task}</CardTitle>
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
                      <span className="text-xs text-green-600 font-medium">
                        ✔ Completed
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
