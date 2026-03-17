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

export function ProgressCard() {
  const { weightHistory } = useApp();

  const currentWeight = weightHistory[weightHistory.length - 1]?.weight || 0;
  const initialWeight = weightHistory[0]?.weight || 0;
  const weightGain = currentWeight - initialWeight;

  return (
    <Card className="bg-card border-border">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg text-foreground">Seu Progresso</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-baseline gap-4 mb-4">
          <span className="text-3xl font-bold text-foreground">
            {currentWeight.toFixed(1)}
            <span className="text-lg font-normal text-muted-foreground">kg</span>
          </span>
          <span
            className={`text-sm font-medium ${
              weightGain >= 0 ? "text-primary" : "text-destructive"
            }`}
          >
            {weightGain >= 0 ? "+" : ""}
            {weightGain.toFixed(1)} kg
          </span>
        </div>

        <div className="h-24">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={weightHistory}>
              <XAxis
                dataKey="date"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 10, fill: "#a1a1a1" }}
              />
              <YAxis hide domain={["dataMin - 1", "dataMax + 1"]} />
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
                dataKey="weight"
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
