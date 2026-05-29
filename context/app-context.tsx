"use client";
import { getTreinos, registrarExecucao, getHistoricoExecucao } from "@/lib/api";
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
  markWorkoutComplete: (workoutId: string) => Promise<void>; // Mudou para Promise
  exerciseProgress: ExerciseProgress[];
  weightHistory: WeightEntry[];
  completedWorkouts: CompletedWorkout[];
  updateExerciseWeight: (
    workoutId: string,
    exerciseId: string,
    weight: number
  ) => void;
  isLoadingData: boolean;
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
    ],
  },
];

const mockWeightHistory: WeightEntry[] = [
  { date: "Seg", weight: 58.5 },
  { date: "Ter", weight: 59 },
];

const mockCompletedWorkouts: CompletedWorkout[] = [
  { date: "2026-03-10", workoutId: "1", workoutName: "Peito + Tríceps" },
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
        completed: false,
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
  const [completedWorkouts, setCompletedWorkouts] = useState<CompletedWorkout[]>([]);
  const [isLoadingData, setIsLoadingData] = useState<boolean>(true);

  // Constante do ID temporário até a autenticação final rodar
  const ID_ALUNO_TEMPORARIO = "522a1f07-9408-4f3f-b90c-783862846f3e";

  useEffect(() => {
    async function carregarDadosIniciais() {
      setIsLoadingData(true);
      try {
        // Busca Treinos e Histórico de Execuções em paralelo
        const [treinosData, historicoData] = await Promise.all([
          getTreinos(ID_ALUNO_TEMPORARIO),
          getHistoricoExecucao(ID_ALUNO_TEMPORARIO).catch(() => null) 
        ]);

        setWorkouts(mapTreinos(treinosData));

        if (historicoData && Array.isArray(historicoData)) {
          const historicoMapeado: CompletedWorkout[] = historicoData.map((exec: any) => ({
            date: exec.data_execucao?.split("T")[0] ?? new Date().toISOString().split("T")[0],
            workoutId: exec.id_treino,
            workoutName: exec.treinos?.nome_treino ?? "Treino Concluído",
          }));
          setCompletedWorkouts(historicoMapeado);
        } else {
          setCompletedWorkouts(mockCompletedWorkouts);
        }
      } catch (error) {
        console.error("Erro ao carregar dados da API, usando mocks:", error);
        setWorkouts(mockWorkouts);
        setCompletedWorkouts(mockCompletedWorkouts);
      } finally {
        setIsLoadingData(false);
      }
    }

    carregarDadosIniciais();
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
    const days = ["Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"];
    return days[new Date().getDay()];
  };

  const todayWorkout =
    workouts.find((w) => w.dayOfWeek === getDayOfWeek()) || workouts[0] || null;

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

  const markWorkoutComplete = async (workoutId: string) => {
    const workout = workouts.find((w) => w.id === workoutId);
    if (!workout) return;

    // 1. Atualização Otimista no Estado Local da UI
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

    // 2. Envio do Payload Real para o Backend
    try {
      const payload = {
        id_treino: workoutId,
        id_aluno: ID_ALUNO_TEMPORARIO,
        duracao: null, // Pode ser expandido futuramente se a UI cronometrar o treino
        exercicios: workout.exercises.map((ex) => ({
          id: ex.id,
          series_realizadas: ex.sets,
          reps_realizadas: ex.reps,
          peso_utilizado: ex.weight || 0,
        })),
      };

      await registrarExecucao(payload);
      console.log("Execução salva com sucesso no backend!");
    } catch (error) {
      console.error("Falha ao persistir a execução no banco de dados:", error);
      // Aqui você poderia reverter o estado local se fizesse questão de consistência estrita
    }
  };

  const updateExerciseWeight = (workoutId: string, exerciseId: string, weight: number) => {
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
        isLoadingData,
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
