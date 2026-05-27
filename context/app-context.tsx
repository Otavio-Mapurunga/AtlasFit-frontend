"use client";
import { getTreinos, registrarExecucao } from "@/lib/api";
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import type {
  User,
  Workout,
  ExerciseProgress,
  WeightEntry,
  CompletedWorkout,
  OnboardingStep,
} from "@/types";

interface AppContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  isAuthenticated: boolean;
  onboardingStep: OnboardingStep;
  setOnboardingStep: (step: OnboardingStep) => void;
  login: (email: string, password: string) => boolean;
  logout: () => void;
  workouts: Workout[];
  setWorkouts: (workouts: Workout[]) => void;
  todayWorkout: Workout | null;
  markExerciseComplete: (workoutId: string, exerciseId: string) => void;
  markWorkoutComplete: (workoutId: string) => void;
  exerciseProgress: ExerciseProgress[];
  weightHistory: WeightEntry[];
  completedWorkouts: CompletedWorkout[];
  updateExerciseWeight: (
    workoutId: string,
    exerciseId: string,
    weight: number
  ) => void;
}

const mockUser: User = {
  id: "1",
  name: "Luis",
  email: "luis@email.com",
  height: 175,
  weight: 70,
  age: 22,
  goal: "hipertrofia",
  experienceLevel: "intermediario",
};

const mockWorkouts: Workout[] = [
  {
    id: "1",
    name: "Peito + Tríceps",
    dayOfWeek: "Segunda",
    exercises: [
      { id: "1", name: "Supino Reto", sets: 4, reps: 8, weight: 65 },
      { id: "2", name: "Supino Inclinado", sets: 3, reps: 10, weight: 55 },
      { id: "3", name: "Crossover", sets: 3, reps: 12, weight: 25 },
      { id: "4", name: "Tríceps Corda", sets: 3, reps: 12, weight: 20 },
    ],
  },
  {
    id: "2",
    name: "Costas + Bíceps",
    dayOfWeek: "Terça",
    exercises: [
      { id: "5", name: "Puxada Frontal", sets: 4, reps: 10, weight: 50 },
      { id: "6", name: "Remada Curvada", sets: 3, reps: 10, weight: 40 },
      { id: "7", name: "Remada Baixa", sets: 3, reps: 12, weight: 45 },
      { id: "8", name: "Rosca Direta", sets: 3, reps: 12, weight: 15 },
    ],
  },
  {
    id: "3",
    name: "Pernas",
    dayOfWeek: "Quarta",
    exercises: [
      { id: "9", name: "Agachamento", sets: 4, reps: 8, weight: 80 },
      { id: "10", name: "Leg Press", sets: 3, reps: 12, weight: 150 },
      { id: "11", name: "Cadeira Extensora", sets: 3, reps: 12, weight: 40 },
      { id: "12", name: "Cadeira Flexora", sets: 3, reps: 12, weight: 35 },
    ],
  },
  {
    id: "4",
    name: "Ombros + Trapézio",
    dayOfWeek: "Quinta",
    exercises: [
      {
        id: "13",
        name: "Desenvolvimento",
        sets: 4,
        reps: 10,
        weight: 30,
      },
      { id: "14", name: "Elevação Lateral", sets: 3, reps: 12, weight: 10 },
      { id: "15", name: "Elevação Frontal", sets: 3, reps: 12, weight: 10 },
      { id: "16", name: "Encolhimento", sets: 3, reps: 15, weight: 25 },
    ],
  },
  {
    id: "5",
    name: "Peito + Tríceps",
    dayOfWeek: "Sexta",
    exercises: [
      { id: "17", name: "Supino Reto", sets: 4, reps: 8, weight: 65 },
      { id: "18", name: "Supino Inclinado", sets: 3, reps: 10, weight: 55 },
      { id: "19", name: "Crossover", sets: 3, reps: 12, weight: 25 },
      { id: "20", name: "Tríceps Corda", sets: 3, reps: 12, weight: 20 },
    ],
  },
];

const mockExerciseProgress: ExerciseProgress[] = [
  {
    exerciseId: "1",
    exerciseName: "Supino Reto",
    initialWeight: 57,
    currentWeight: 65,
    progress: 14,
    history: [
      { date: "Seg", value: 57 },
      { date: "Ter", value: 58 },
      { date: "Qua", value: 60 },
      { date: "Qui", value: 61 },
      { date: "Sex", value: 63 },
      { date: "Sáb", value: 64 },
      { date: "Dom", value: 65 },
    ],
  },
  {
    exerciseId: "9",
    exerciseName: "Agachamento",
    initialWeight: 60,
    currentWeight: 80,
    progress: 33,
    history: [
      { date: "Seg", value: 60 },
      { date: "Ter", value: 65 },
      { date: "Qua", value: 70 },
      { date: "Qui", value: 72 },
      { date: "Sex", value: 75 },
      { date: "Sáb", value: 78 },
      { date: "Dom", value: 80 },
    ],
  },
];

const mockWeightHistory: WeightEntry[] = [
  { date: "Seg", weight: 58.5 },
  { date: "Ter", weight: 59 },
  { date: "Qua", weight: 59.5 },
  { date: "Qui", weight: 60 },
  { date: "Sex", weight: 60.5 },
  { date: "Sáb", weight: 61 },
  { date: "Dom", weight: 61 },
];

const mockCompletedWorkouts: CompletedWorkout[] = [
  { date: "2026-03-10", workoutId: "1", workoutName: "Peito + Tríceps" },
  { date: "2026-03-11", workoutId: "2", workoutName: "Costas + Bíceps" },
  { date: "2026-03-12", workoutId: "3", workoutName: "Pernas" },
  { date: "2026-03-13", workoutId: "4", workoutName: "Ombros + Trapézio" },
  { date: "2026-03-14", workoutId: "5", workoutName: "Peito + Tríceps" },
  { date: "2026-03-15", workoutId: "1", workoutName: "Peito + Tríceps" },
  { date: "2026-03-16", workoutId: "2", workoutName: "Costas + Bíceps" },
];

const AppContext = createContext<AppContextType | undefined>(undefined);

function mapTreinos(data: any[]): Workout[] {
  return data.map((treino) => ({
    id: treino.id_treino,
    name: treino.nome_treino,
    dayOfWeek: treino.treino_dias?.[0]?.nome_dia ?? "Segunda",
    exercises: treino.treino_dias?.flatMap((dia: any) =>
      dia.treino_exercicios?.map((ex: any) => ({
        id: ex.id_treino_exercicio,
        name: ex.exercicios?.name ?? ex.id,
        sets: ex.series,
        reps: ex.repeticoes,
        weight: 0,
      })) ?? []
    ) ?? [],
  }));
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [onboardingStep, setOnboardingStep] = useState<OnboardingStep>("account");
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [exerciseProgress] = useState<ExerciseProgress[]>(mockExerciseProgress);
  const [weightHistory] = useState<WeightEntry[]>(mockWeightHistory);
  const [completedWorkouts, setCompletedWorkouts] = useState<CompletedWorkout[]>(
    mockCompletedWorkouts
  );
  useEffect(() => {
  const idAluno = "522a1f07-9408-4f3f-b90c-783862846f3e"; // temporário até Sam entregar auth
  getTreinos(idAluno)
    .then((data) => setWorkouts(mapTreinos(data)))
    .catch(() => setWorkouts(mockWorkouts)); // fallback pros mocks se API falhar
}, []);

  const isAuthenticated = user !== null;

  const login = (email: string, password: string): boolean => {
    if (email && password) {
      setUser(mockUser);
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
  };

  const getDayOfWeek = (): string => {
    const days = [
      "Domingo",
      "Segunda",
      "Terça",
      "Quarta",
      "Quinta",
      "Sexta",
      "Sábado",
    ];
    return days[new Date().getDay()];
  };

  const todayWorkout =
    workouts.find((w) => w.dayOfWeek === getDayOfWeek()) || workouts[0];

  const markExerciseComplete = (workoutId: string, exerciseId: string) => {
    setWorkouts((prev) =>
      prev.map((workout) =>
        workout.id === workoutId
          ? {
              ...workout,
              exercises: workout.exercises.map((ex) =>
                ex.id === exerciseId ? { ...ex, completed: !ex.completed } : ex
              ),
            }
          : workout
      )
    );
  };

  const markWorkoutComplete = (workoutId: string) => {
    const workout = workouts.find((w) => w.id === workoutId);
    if (workout) {
      setCompletedWorkouts((prev) => [
        ...prev,
        {
          date: new Date().toISOString().split("T")[0],
          workoutId,
          workoutName: workout.name,
        },
      ]);
      setWorkouts((prev) =>
        prev.map((w) =>
          w.id === workoutId
            ? {
                ...w,
                completed: true,
                exercises: w.exercises.map((ex) => ({ ...ex, completed: true })),
              }
            : w
        )
      );
    }
  };

  const updateExerciseWeight = (
    workoutId: string,
    exerciseId: string,
    weight: number
  ) => {
    setWorkouts((prev) =>
      prev.map((workout) =>
        workout.id === workoutId
          ? {
              ...workout,
              exercises: workout.exercises.map((ex) =>
                ex.id === exerciseId ? { ...ex, weight } : ex
              ),
            }
          : workout
      )
    );
  };

  return (
    <AppContext.Provider
      value={{
        user,
        setUser,
        isAuthenticated,
        onboardingStep,
        setOnboardingStep,
        login,
        logout,
        workouts,
        setWorkouts,
        todayWorkout,
        markExerciseComplete,
        markWorkoutComplete,
        exerciseProgress,
        weightHistory,
        completedWorkouts,
        updateExerciseWeight,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
}
