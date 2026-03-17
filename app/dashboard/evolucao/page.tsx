"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
  BarChart,
  Bar,
} from "recharts";
import { useApp } from "@/context/app-context";

export default function EvolutionPage() {
  const { exerciseProgress, completedWorkouts, weightHistory } = useApp();

  // Aggregate completed workouts by day
  const workoutsByDay = completedWorkouts.reduce(
    (acc, workout) => {
      const date = new Date(workout.date).toLocaleDateString("pt-BR", {
        weekday: "short",
      });
      acc[date] = (acc[date] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );

  const workoutsChartData = Object.entries(workoutsByDay).map(
    ([date, count]) => ({
      date,
      count,
    })
  );

  const thisMonthWorkouts = completedWorkouts.filter((w) => {
    const workoutDate = new Date(w.date);
    const now = new Date();
    return (
      workoutDate.getMonth() === now.getMonth() &&
      workoutDate.getFullYear() === now.getFullYear()
    );
  }).length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">
          Dashboard de Evolução Completa
        </h1>
        <p className="text-muted-foreground">
          Acompanhe seu progresso detalhado
        </p>
      </div>

      {/* Top Stats */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Carga no Supino Card */}
        <Card className="bg-card border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg text-foreground">
              Carga no Supino
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline gap-4 mb-4">
              <span className="text-3xl font-bold text-foreground">
                {exerciseProgress[0]?.currentWeight || 61}
                <span className="text-lg font-normal text-muted-foreground">
                  kg
                </span>
              </span>
              <Badge className="bg-primary/20 text-primary border-0">
                +2.5 kg
              </Badge>
            </div>
            <div className="h-32">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={exerciseProgress[0]?.history || []}>
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

        {/* Treinos Concluídos Card */}
        <Card className="bg-card border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg text-foreground">
              Treinos Concluídos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-6 mb-4">
              <div>
                <span className="text-3xl font-bold text-foreground">
                  {thisMonthWorkouts}
                </span>
                <p className="text-sm text-muted-foreground">este mês</p>
              </div>
              <div className="flex-1 flex justify-end">
                <div className="relative w-20 h-20">
                  <svg className="w-20 h-20 -rotate-90" viewBox="0 0 36 36">
                    <circle
                      cx="18"
                      cy="18"
                      r="15.915"
                      fill="none"
                      stroke="#1f1f1f"
                      strokeWidth="3"
                    />
                    <circle
                      cx="18"
                      cy="18"
                      r="15.915"
                      fill="none"
                      stroke="#6b7a3d"
                      strokeWidth="3"
                      strokeDasharray={`${(thisMonthWorkouts / 20) * 100} 100`}
                      strokeLinecap="round"
                    />
                  </svg>
                  <span className="absolute inset-0 flex items-center justify-center text-sm font-medium text-foreground">
                    {Math.round((thisMonthWorkouts / 20) * 100)}%
                  </span>
                </div>
              </div>
            </div>
            <p className="text-sm text-muted-foreground">Progresso Mensal</p>
            <div className="h-24 mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={workoutsChartData.slice(-7)}>
                  <XAxis
                    dataKey="date"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 10, fill: "#a1a1a1" }}
                  />
                  <Bar dataKey="count" fill="#6b7a3d" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Second Row */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Carga no Supino Detailed */}
        <Card className="bg-card border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg text-foreground">
              Carga no Supino
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline gap-4 mb-4">
              <span className="text-3xl font-bold text-foreground">
                65
                <span className="text-lg font-normal text-muted-foreground">
                  kg
                </span>
              </span>
              <Badge className="bg-primary/20 text-primary border-0">
                +5 kg
              </Badge>
            </div>
            <div className="h-32">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={exerciseProgress[0]?.history || []}>
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

        {/* Progress Table */}
        <Card className="bg-card border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg text-foreground">
              Evolução por Exercício
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-4 text-sm font-medium text-muted-foreground border-b border-border pb-2">
                <span>Exercício</span>
                <span className="text-center">Inicial</span>
                <span className="text-center">Atual</span>
                <span className="text-right">Progresso</span>
              </div>
              {exerciseProgress.map((exercise) => (
                <div
                  key={exercise.exerciseId}
                  className="grid grid-cols-4 text-sm py-2 border-b border-border last:border-0"
                >
                  <span className="text-foreground">{exercise.exerciseName}</span>
                  <span className="text-center text-muted-foreground">
                    {exercise.initialWeight} kg
                  </span>
                  <span className="text-center text-foreground">
                    {exercise.currentWeight} kg
                  </span>
                  <span className="text-right text-primary">
                    +{exercise.progress}%
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
