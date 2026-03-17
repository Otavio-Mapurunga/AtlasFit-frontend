"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { useApp } from "@/context/app-context";

export function TodayWorkoutCard() {
  const { todayWorkout, markExerciseComplete, markWorkoutComplete } = useApp();

  if (!todayWorkout) {
    return (
      <Card className="bg-card border-border">
        <CardContent className="p-6 text-center text-muted-foreground">
          Nenhum treino para hoje
        </CardContent>
      </Card>
    );
  }

  const allCompleted = todayWorkout.exercises.every((ex) => ex.completed);

  return (
    <Card className="bg-card border-border">
      <CardHeader className="flex flex-row items-center justify-between pb-4">
        <CardTitle className="text-lg text-foreground">Treino de Hoje</CardTitle>
        <Badge
          variant="outline"
          className="bg-secondary border-border text-foreground"
        >
          {todayWorkout.name}
        </Badge>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          {todayWorkout.exercises.map((exercise) => (
            <div
              key={exercise.id}
              className="flex items-center justify-between py-2 border-b border-border last:border-0"
            >
              <div className="flex items-center gap-3">
                <Checkbox
                  checked={exercise.completed}
                  onCheckedChange={() =>
                    markExerciseComplete(todayWorkout.id, exercise.id)
                  }
                  className="border-border data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                />
                <span
                  className={`text-sm ${
                    exercise.completed
                      ? "text-muted-foreground line-through"
                      : "text-foreground"
                  }`}
                >
                  {exercise.name}
                </span>
              </div>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <span>{exercise.sets} x {exercise.reps}</span>
                <span className="w-16 text-right">
                  {exercise.sets} x {exercise.reps}
                </span>
              </div>
            </div>
          ))}
        </div>

        <Button
          className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
          onClick={() => markWorkoutComplete(todayWorkout.id)}
          disabled={allCompleted}
        >
          {allCompleted ? "Treino Concluído" : "Marcar como concluído"}
        </Button>
      </CardContent>
    </Card>
  );
}
