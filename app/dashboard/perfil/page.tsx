"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { useApp } from "@/context/app-context";

export default function ProfilePage() {
  const { user, weightHistory, completedWorkouts } = useApp();

  // Aggregate completed workouts by day of week
  const workoutsByDayOfWeek = [
    { day: "Seg", count: 2 },
    { day: "Ter", count: 1 },
    { day: "Qua", count: 2 },
    { day: "Qui", count: 1 },
    { day: "Sex", count: 2 },
    { day: "Sáb", count: 1 },
    { day: "Dom", count: 0 },
  ];

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
        <h1 className="text-2xl font-bold text-foreground">Meu Perfil</h1>
        <p className="text-muted-foreground">Gerencie suas informações</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* User Info */}
        <Card className="bg-card border-border lg:col-span-1">
          <CardContent className="p-6">
            <div className="flex flex-col items-center text-center">
              <Avatar className="w-24 h-24 mb-4">
                <AvatarImage src="/placeholder-avatar.jpg" alt={user?.name} />
                <AvatarFallback className="bg-primary text-primary-foreground text-2xl">
                  {user?.name?.charAt(0) || "U"}
                </AvatarFallback>
              </Avatar>
              <h2 className="text-xl font-semibold text-foreground">
                {user?.name || "Usuário"}
              </h2>
              <p className="text-sm text-muted-foreground">{user?.email}</p>

              <div className="w-full mt-6 space-y-4">
                <div className="flex justify-between py-2 border-b border-border">
                  <span className="text-muted-foreground">Altura</span>
                  <span className="text-foreground">{user?.height} cm</span>
                </div>
                <div className="flex justify-between py-2 border-b border-border">
                  <span className="text-muted-foreground">Peso</span>
                  <span className="text-foreground">{user?.weight} kg</span>
                </div>
                <div className="flex justify-between py-2 border-b border-border">
                  <span className="text-muted-foreground">Idade</span>
                  <span className="text-foreground">{user?.age} anos</span>
                </div>
                <div className="flex justify-between py-2 border-b border-border">
                  <span className="text-muted-foreground">Objetivo</span>
                  <span className="text-primary capitalize">{user?.goal}</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-muted-foreground">Nível</span>
                  <span className="text-foreground capitalize">
                    {user?.experienceLevel}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Charts */}
        <div className="lg:col-span-2 space-y-6">
          {/* Weight Chart */}
          <Card className="bg-card border-border">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg text-foreground">
                Peso Corporal
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={weightHistory}>
                    <XAxis
                      dataKey="date"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 11, fill: "#a1a1a1" }}
                    />
                    <YAxis
                      hide
                      domain={["dataMin - 2", "dataMax + 2"]}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#1f1f1f",
                        border: "1px solid #2a2a2a",
                        borderRadius: "8px",
                        color: "#fafafa",
                      }}
                      formatter={(value: number) => [`${value} kg`, "Peso"]}
                    />
                    <Bar
                      dataKey="weight"
                      fill="#6b7a3d"
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Workouts Chart */}
          <Card className="bg-card border-border">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg text-foreground">
                  Treinos Concluídos
                </CardTitle>
                <span className="text-sm text-muted-foreground">
                  {thisMonthWorkouts} este mês
                </span>
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={workoutsByDayOfWeek}>
                    <XAxis
                      dataKey="day"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 11, fill: "#a1a1a1" }}
                    />
                    <YAxis
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 11, fill: "#a1a1a1" }}
                      domain={[0, 10]}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#1f1f1f",
                        border: "1px solid #2a2a2a",
                        borderRadius: "8px",
                        color: "#fafafa",
                      }}
                      formatter={(value: number) => [value, "Treinos"]}
                    />
                    <Line
                      type="monotone"
                      dataKey="count"
                      stroke="#6b7a3d"
                      strokeWidth={2}
                      dot={{ fill: "#6b7a3d", strokeWidth: 0, r: 4 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
