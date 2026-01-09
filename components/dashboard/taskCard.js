"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export default function TaskCard({
  title,
  tasks,
  toggleTask,
  inputValue,
  setInputValue,
  addTask,
  showInput,
  onTaskDone, // optional
}) {
  // Keep track of which task is currently "loading"
  const [loadingTasks, setLoadingTasks] = useState({});

  const handleCheckboxChange = async (index, task) => {
    if (!task.done && onTaskDone) {
      try {
        // Set loading state for this task
        setLoadingTasks((prev) => ({ ...prev, [task.id]: true }));

        // Wait for the async action (image upload)
        await onTaskDone(task.id);
      } catch (err) {
        console.error("Error handling task:", err);
      } finally {
        // Remove loading state
        setLoadingTasks((prev) => ({ ...prev, [task.id]: false }));
      }
    } else {
      toggleTask(index);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        {showInput && (
          <div className="flex gap-2">
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Add a new task"
            />
            <Button onClick={addTask}>Add</Button>
          </div>
        )}

        {tasks.map((task, i) => (
          <div key={task.id || i} className="flex items-center gap-3">
            <div className="relative flex items-center">
              <Checkbox
                checked={task.done}
                disabled={loadingTasks[task.id]} // disable during loading
                onCheckedChange={() => handleCheckboxChange(i, task)}
              />

              {loadingTasks[task.id] && (
                <div className="absolute left-6 w-4 h-4 border-2 border-t-transparent border-gray-500 rounded-full animate-spin"></div>
              )}
            </div>

            <span className={task.done ? "line-through text-muted-foreground" : ""}>
              {task.text}
            </span>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
