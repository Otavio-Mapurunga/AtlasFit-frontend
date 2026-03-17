"use client";

import { TodayWorkoutCard } from "@/components/dashboard/today-workout-card";
import { ProgressCard } from "@/components/dashboard/progress-card";
import { ExerciseProgressCard } from "@/components/dashboard/exercise-progress-card";

export default function DashboardPage() {
  return (
    <div className="grid lg:grid-cols-2 gap-6">
      <div className="space-y-6">
        <TodayWorkoutCard />
      </div>
      <div className="space-y-6">
        <ProgressCard />
        <ExerciseProgressCard exerciseName="Supino Reto" />
      </div>
    </div>
  );
}
