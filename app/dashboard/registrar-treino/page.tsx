// aqui é a página de registrar treino 
// ૮₍´˶• . • ⑅ ₎ა

"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ChevronRight, Check, Dumbbell, RotateCcw, CheckCircle2 } from "lucide-react";
import { useApp } from "@/context/app-context";
import type { Workout } from "@/types";

// estrutura de uma série individual ( 💕 ŐωŐ 💕 )
interface SerieLog {
  serie: number;
  reps: number | string;
  weight: number | string;
  done: boolean;
}

// o que disseste cachorro chupetao
// mapa de séries por exercício
type ExerciseLog = Record<string, SerieLog[]>;

function buildInitialLog(workout: Workout): ExerciseLog {
  const log: ExerciseLog = {};
  workout.exercises.forEach((ex) => {
    log[ex.id] = Array.from({ length: ex.sets }, (_, i) => ({
      serie: i + 1,
      reps: ex.reps,
      weight: ex.weight ?? "",
      done: false,
    }));
  });
  return log;
}

// tela pra selecionar o:[ {---> TREINO <---}
// tela de seleção de treinos 
function WorkoutList({
  workouts,
  onSelect,
}: {
  workouts: Workout[];
  onSelect: (w: Workout) => void;
}) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Registrar Treino</h1>
        <p className="text-muted-foreground">
          Selecione o treino de hoje para anotar séries e cargas
        </p>
      </div>

      <div className="grid gap-4">
        {workouts.map((workout) => (
          <Card
            key={workout.id}
            className="bg-card border-border hover:border-primary/50 transition-colors cursor-pointer"
            onClick={() => onSelect(workout)}
          >
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-lg bg-secondary flex items-center justify-center">
                    <Dumbbell className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium text-foreground">{workout.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {workout.exercises.length} exercícios • {workout.dayOfWeek}
                    </p>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
//
//te//la
//pra//
//re////gistrar
//as/
//séries///
function WorkoutLogger({
  workout,
  onBack,
  onFinish,
}: {
  workout: Workout;
  onBack: () => void;
  onFinish: (log: ExerciseLog) => void;
}) {
  const [log, setLog] = useState<ExerciseLog>(() => buildInitialLog(workout));
  const [activeExercise, setActiveExercise] = useState<string>(
    workout.exercises[0]?.id ?? ""
  );

  const updateSerie = (
    exerciseId: string,
    serieIdx: number,
    field: "reps" | "weight",
    value: string
  ) => {
    setLog((prev) => ({
      ...prev,
      [exerciseId]: prev[exerciseId].map((s, i) =>
        i === serieIdx ? { ...s, [field]: value } : s
      ),
    }));
  };

  const toggleDone = (exerciseId: string, serieIdx: number) => {
    setLog((prev) => ({
      ...prev,
      [exerciseId]: prev[exerciseId].map((s, i) =>
        i === serieIdx ? { ...s, done: !s.done } : s
      ),
    }));
  };

  const resetExercise = (exerciseId: string) => {
    const ex = workout.exercises.find((e) => e.id === exerciseId)!;
    setLog((prev) => ({
      ...prev,
      [exerciseId]: Array.from({ length: ex.sets }, (_, i) => ({
        serie: i + 1,
        reps: ex.reps,
        weight: ex.weight ?? "",
        done: false,
      })),
    }));
  };

  const totalSeries = Object.values(log).flat().length;
  const doneSeries = Object.values(log).flat().filter((s) => s.done).length;
  const allDone = doneSeries === totalSeries;

  const activeEx = workout.exercises.find((e) => e.id === activeExercise)!;
  const activeSeries = log[activeExercise] ?? [];
  const exerciseDone = activeSeries.every((s) => s.done);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <Button
            variant="ghost"
            onClick={onBack}
            className="text-muted-foreground hover:text-foreground mb-2 -ml-4"
          >
            Voltar
          </Button>
          <h1 className="text-2xl font-bold text-foreground">{workout.name}</h1>
          <p className="text-muted-foreground">{workout.dayOfWeek}</p>
        </div>
        <div className="text-right">
          <span className="text-3xl font-bold text-primary">{doneSeries}</span>
          <span className="text-muted-foreground text-sm">/{totalSeries} séries</span>
          <div className="w-32 h-2 bg-secondary rounded-full mt-1">
            <div
              className="h-2 bg-primary rounded-full transition-all"
              style={{ width: `${(doneSeries / totalSeries) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* seletor de exercicios */}
      <div className="flex gap-2 flex-wrap">
        {workout.exercises.map((ex) => {
          const series = log[ex.id] ?? [];
          const done = series.every((s) => s.done);
          const partial = series.some((s) => s.done) && !done;

          return (
            <button
              key={ex.id}
              onClick={() => setActiveExercise(ex.id)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors border ${
                activeExercise === ex.id
                  ? "bg-primary text-primary-foreground border-primary"
                  : done
                  ? "bg-primary/10 text-primary border-primary/30"
                  : partial
                  ? "bg-secondary text-foreground border-primary/20"
                  : "bg-secondary text-muted-foreground border-border hover:border-primary/30"
              }`}
            >
              {done && <Check className="w-3 h-3 inline mr-1" />}
              {ex.name}
            </button>
          );
        })}
      </div>

      {/* card ne do exercicio ativo */}
      <Card className="bg-card border-border">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg text-foreground">{activeEx.name}</CardTitle>
              <p className="text-sm text-muted-foreground mt-0.5">
                {activeEx.sets} séries · {activeEx.reps} repetições ·{" "}
                {activeEx.weight ?? "—"} kg referência
              </p>
            </div>
            <div className="flex items-center gap-2">
              {exerciseDone && (
                <Badge className="bg-primary/20 text-primary border-0">
                  <CheckCircle2 className="w-3 h-3 mr-1" /> Completo
                </Badge>
              )}
              <Button
                variant="ghost"
                size="icon"
                onClick={() => resetExercise(activeExercise)}
                className="text-muted-foreground hover:text-foreground w-8 h-8"
                title="Reiniciar exercício"
              >
                <RotateCcw className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          {/* cabeçalho*/}
          <div className="grid grid-cols-[40px_1fr_1fr_48px] gap-3 mb-3 px-1">
            <span className="text-xs font-medium text-muted-foreground text-center">
              Série
            </span>
            <span className="text-xs font-medium text-muted-foreground text-center">
              Repetições
            </span>
            <span className="text-xs font-medium text-muted-foreground text-center">
              Carga (kg)
            </span>
            <span className="text-xs font-medium text-muted-foreground text-center">
              ✓
            </span>
          </div>

          {/* linhas de série */}
          <div className="space-y-2">
            {activeSeries.map((serie, idx) => (
              <div
                key={idx}
                className={`grid grid-cols-[40px_1fr_1fr_48px] gap-3 items-center p-2 rounded-lg transition-colors ${
                  serie.done ? "bg-primary/5 border border-primary/20" : "bg-secondary/40"
                }`}
              >
                {/* número da série (085...) */}
                <div className="flex items-center justify-center">
                  <span
                    className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                      serie.done
                        ? "bg-primary text-primary-foreground"
                        : "bg-secondary text-muted-foreground"
                    }`}
                  >
                    {serie.serie}
                  </span>
                </div>

                {/* input repetições */}
                <Input
                  type="number"
                  value={serie.reps}
                  onChange={(e) =>
                    updateSerie(activeExercise, idx, "reps", e.target.value)
                  }
                  disabled={serie.done}
                  className="bg-input border-border text-foreground text-center h-9 disabled:opacity-60"
                  placeholder="reps"
                  min={1}
                />

                {/* input carga */}
                <Input
                  type="number"
                  value={serie.weight}
                  onChange={(e) =>
                    updateSerie(activeExercise, idx, "weight", e.target.value)
                  }
                  disabled={serie.done}
                  className="bg-input border-border text-foreground text-center h-9 disabled:opacity-60"
                  placeholder="kg"
                  min={0}
                  step={0.5}
                />

                {/* butão concluir série */}
                <button
                  onClick={() => toggleDone(activeExercise, idx)}
                  className={`w-10 h-9 rounded-lg flex items-center justify-center transition-colors border ${
                    serie.done
                      ? "bg-primary border-primary text-primary-foreground"
                      : "bg-secondary border-border text-muted-foreground hover:border-primary/50 hover:text-foreground"
                  }`}
                  title={serie.done ? "Desmarcar série" : "Marcar como feita"}
                >
                  <Check className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>

          {/* avançar pro próximo exercício */}
          {exerciseDone && (() => {
            const currentIdx = workout.exercises.findIndex(
              (e) => e.id === activeExercise
            );
            const next = workout.exercises[currentIdx + 1];
            return next ? (
              <Button
                variant="outline"
                className="w-full mt-4 border-primary/30 text-primary hover:bg-primary/10"
                onClick={() => setActiveExercise(next.id)}
              >
                Próximo: {next.name}
                <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            ) : null;
          })()}
        </CardContent>
      </Card>

      {/* butão acabou */}
      {allDone && (
        <Button
          className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
          onClick={() => onFinish(log)}
        >
          <CheckCircle2 className="w-4 h-4 mr-2" />
          Finalizar Treino
        </Button>
      )}
    </div>
  );
}

//telinha de resumo ଘ(੭◌ˊᵕˋ)੭* ੈ♡‧₊˚
function WorkoutSummary({
  workout,
  log,
  onReset,
}: {
  workout: Workout;
  log: ExerciseLog;
  onReset: () => void;
}) {
  return (
    <div className="space-y-6">
      <div className="text-center py-6">
        <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-4">
          <CheckCircle2 className="w-8 h-8 text-primary" />
        </div>
        <h1 className="text-2xl font-bold text-foreground">Treino Concluído!</h1>
        <p className="text-muted-foreground mt-1">{workout.name}</p>
      </div>

      <div className="space-y-4">
        {workout.exercises.map((ex) => {
          const series = log[ex.id] ?? [];
          return (
            <Card key={ex.id} className="bg-card border-border">
              <CardHeader className="pb-2">
                <CardTitle className="text-base text-foreground">{ex.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-[40px_1fr_1fr] gap-3 mb-2 px-1">
                  <span className="text-xs text-muted-foreground text-center">Série</span>
                  <span className="text-xs text-muted-foreground text-center">Reps</span>
                  <span className="text-xs text-muted-foreground text-center">Carga</span>
                </div>
                {series.map((s, i) => (
                  <div
                    key={i}
                    className="grid grid-cols-[40px_1fr_1fr] gap-3 py-1.5 border-b border-border last:border-0 text-sm"
                  >
                    <span className="text-center font-medium text-primary">{s.serie}</span>
                    <span className="text-center text-foreground">{s.reps} reps</span>
                    <span className="text-center text-foreground">{s.weight || "—"} kg</span>
                  </div>
                ))}
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Button
        variant="outline"
        className="w-full border-border text-foreground hover:bg-secondary"
        onClick={onReset}
      >
        Registrar outro treino
      </Button>
    </div>
  );
}

// pagina principal 
export default function RegistrarTreinoPage() {
  const { workouts, markWorkoutComplete } = useApp();
  const [selectedWorkout, setSelectedWorkout] = useState<Workout | null>(null);
  const [finishedLog, setFinishedLog] = useState<ExerciseLog | null>(null);

  const handleFinish = (log: ExerciseLog) => {
    if (selectedWorkout) {
      markWorkoutComplete(selectedWorkout.id);
      setFinishedLog(log);
    }
  };

  const handleReset = () => {
    setSelectedWorkout(null);
    setFinishedLog(null);
  };

  if (finishedLog && selectedWorkout) {
    return (
      <WorkoutSummary
        workout={selectedWorkout}
        log={finishedLog}
        onReset={handleReset}
      />
    );
  }

  if (selectedWorkout) {
    return (
      <WorkoutLogger
        workout={selectedWorkout}
        onBack={() => setSelectedWorkout(null)}
        onFinish={handleFinish}
      />
    );
  }

  return <WorkoutList workouts={workouts} onSelect={setSelectedWorkout} />;
}
