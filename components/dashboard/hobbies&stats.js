"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "../ui/card";
import { ResponsiveContainer, LineChart, XAxis, YAxis, Tooltip, Line } from "recharts";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Calendar } from "../ui/calendar";
import { MdDeleteOutline } from "react-icons/md";

export default function HobbiesStatsModal({
  hobbyOpen,
  setHobbyOpen,
  hobbyInput,
  setHobbyInput,
  addHobby,
  deleteHobby,
  dailyTasks,
  statsOpen,
  setStatsOpen,
  efficiencyData = [],
  selectedDate,
  setSelectedDate,
  getDayColor,
}) {
  return (
    <>
      {/* HOBBIES MODAL */}
      <Dialog open={hobbyOpen} onOpenChange={setHobbyOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Manage Daily Hobbies</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            {/* Add Hobby Input */}
            <div className="flex gap-2">
              <Input
                placeholder="Add hobby"
                value={hobbyInput}
                onChange={(e) => setHobbyInput(e.target.value)}
              />
              <Button onClick={addHobby}>Add</Button>
            </div>

            {/* List of Hobbies */}
            {dailyTasks.map((task, i) => (
              <div
                key={i}
                className="flex items-center justify-between border rounded-md px-3 py-2"
              >
                <span>{task.text}</span>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => deleteHobby(i)}
                  className="text-red-500"
                >
                  <MdDeleteOutline className="w-5 h-5" />
                </Button>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      {/* STATS MODAL */}
      <Dialog open={statsOpen} onOpenChange={setStatsOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Your Productivity Stats</DialogTitle>
          </DialogHeader>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Efficiency Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Efficiency</CardTitle>
              </CardHeader>
              <CardContent className="h-[240px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={efficiencyData}>
                    <XAxis dataKey="day" />
                    <YAxis />
                    <Tooltip />
                    <Line dataKey="value" stroke="#4ade80" strokeWidth={3} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Calendar */}
            <Card>
              <CardHeader>
                <CardTitle>Calendar</CardTitle>
              </CardHeader>
              <CardContent>
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  modifiers={{
                    completed: (date) => getDayColor(date),
                  }}
                  modifiersClassNames={{
                    completed: (date) => getDayColor(date),
                  }}
                />
              </CardContent>
            </Card>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
