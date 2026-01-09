"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { authFetch } from "@/lib/api"; // same helper as in Dashboard

export default function History() {
  const [completedTasks, setCompletedTasks] = useState([]);

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

  /* -------- GROUP TASKS BY DATE -------- */
  const groupedByDate = completedTasks.reduce((acc, task) => {
    if (!acc[task.date]) acc[task.date] = [];
    acc[task.date].push(task);
    return acc;
  }, {});

  return (
    <div className="min-h-screen bg-muted/40 p-6">
      <h1 className="text-2xl font-bold mb-8">Task History</h1>

      {completedTasks.length === 0 ? (
        <p className="text-center text-gray-500 mt-10">
          Do some tasks first man! 📝
        </p>
      ) : (
        <div className="space-y-10">
          {Object.entries(groupedByDate).map(([date, tasks]) => (
            <div key={date}>
              {/* DATE HEADER */}
              <h2 className="text-lg font-semibold mb-4 text-primary">
                {new Date(date).toDateString()}
              </h2>

              {/* ONE-LINE TASK ROW */}
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
