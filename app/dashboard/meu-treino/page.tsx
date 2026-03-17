"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ChevronRight, Check } from "lucide-react";
import { useApp } from "@/context/app-context";
import type { Workout } from "@/types";

export default function MyWorkoutPage() {
  const { workouts, updateExerciseWeight } = useApp();
  const [selectedWorkout, setSelectedWorkout] = useState<Workout | null>(null);
  const [weights, setWeights] = useState<Record<string, number>>({});

  const handleWeightChange = (exerciseId: string, weight: string) => {
    const numWeight = parseFloat(weight) || 0;
    setWeights((prev) => ({ ...prev, [exerciseId]: numWeight }));
  };

  const handleSaveWeights = () => {
    if (!selectedWorkout) return;
    Object.entries(weights).forEach(([exerciseId, weight]) => {
      updateExerciseWeight(selectedWorkout.id, exerciseId, weight);
    });
    setSelectedWorkout(null);
    setWeights({});
  };

  if (selectedWorkout) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <Button
              variant="ghost"
              onClick={() => setSelectedWorkout(null)}
              className="text-muted-foreground hover:text-foreground mb-2 -ml-4"
            >
              Voltar
            </Button>
            <h1 className="text-2xl font-bold text-foreground">
              {selectedWorkout.name}
            </h1>
            <p className="text-muted-foreground">{selectedWorkout.dayOfWeek}</p>
          </div>
        </div>

        <Card className="bg-card border-border">
          <CardContent className="p-6">
            <div className="space-y-4">
              {selectedWorkout.exercises.map((exercise) => (
                <div
                  key={exercise.id}
                  className="flex items-center justify-between py-4 border-b border-border last:border-0"
                >
                  <div className="flex-1">
                    <h3 className="font-medium text-foreground">
                      {exercise.name}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {exercise.sets} séries x {exercise.reps} repetições
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <Input
                        type="number"
                        placeholder={exercise.weight?.toString() || "0"}
                        value={weights[exercise.id] ?? exercise.weight ?? ""}
                        onChange={(e) =>
                          handleWeightChange(exercise.id, e.target.value)
                        }
                        className="w-20 bg-input border-border text-foreground text-center"
                      />
                      <span className="text-sm text-muted-foreground">kg</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <Button
              className="w-full mt-6 bg-primary hover:bg-primary/90 text-primary-foreground"
              onClick={handleSaveWeights}
            >
              <Check className="w-4 h-4 mr-2" />
              Salvar
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Meu Treino</h1>
        <p className="text-muted-foreground">
          Seu plano de treino semanal personalizado
        </p>
      </div>

      <div className="grid gap-4">
        {workouts.map((workout) => (
          <Card
            key={workout.id}
            className="bg-card border-border hover:border-primary/50 transition-colors cursor-pointer"
            onClick={() => setSelectedWorkout(workout)}
          >
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-lg bg-secondary flex items-center justify-center">
                    <span className="text-sm font-medium text-primary">
                      {workout.dayOfWeek.slice(0, 3)}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-medium text-foreground">
                      {workout.name}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {workout.exercises.length} exercícios •{" "}
                      {workout.dayOfWeek}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  {workout.completed && (
                    <Badge className="bg-primary/20 text-primary border-0">
                      Concluído
                    </Badge>
                  )}
                  <ChevronRight className="w-5 h-5 text-muted-foreground" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
