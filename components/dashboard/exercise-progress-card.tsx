"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { useApp } from "@/context/app-context";

interface ExerciseProgressCardProps {
  exerciseName?: string;
}

export function ExerciseProgressCard({
  exerciseName = "Supino Reto",
}: ExerciseProgressCardProps) {
  const { exerciseProgress } = useApp();

  const exercise = exerciseProgress.find(
    (ex) => ex.exerciseName === exerciseName
  ) || exerciseProgress[0];

  if (!exercise) return null;

  const weightGain = exercise.currentWeight - exercise.initialWeight;

  return (
    <Card className="bg-card border-border">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg text-foreground">
          Carga no {exercise.exerciseName.split(" ")[0]}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-baseline gap-4 mb-4">
          <span className="text-3xl font-bold text-foreground">
            {exercise.currentWeight}
            <span className="text-lg font-normal text-muted-foreground">kg</span>
          </span>
          <span className="text-sm font-medium text-primary">
            +{weightGain} kg
          </span>
        </div>

        <div className="h-24">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={exercise.history}>
              <XAxis
                dataKey="date"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 10, fill: "#a1a1a1" }}
              />
              <YAxis hide domain={["dataMin - 2", "dataMax + 2"]} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1f1f1f",
                  border: "1px solid #2a2a2a",
                  borderRadius: "8px",
                  color: "#fafafa",
                }}
                labelStyle={{ color: "#a1a1a1" }}
              />
              <Line
                type="monotone"
                dataKey="value"
                stroke="#6b7a3d"
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
