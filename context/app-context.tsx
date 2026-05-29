"use client";
import { getTreinos, registrarExecucao, getHistoricoExecucao, loginApi } from "@/lib/api";
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
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  workouts: Workout[];
  setWorkouts: (workouts: Workout[]) => void;
  todayWorkout: Workout | null;
  markExerciseComplete: (workoutId: string, exerciseId: string) => void;
  markWorkoutComplete: (workoutId: string) => Promise<void>;
  exerciseProgress: ExerciseProgress[];
  weightHistory: WeightEntry[];
  completedWorkouts: CompletedWorkout[];
  updateExerciseWeight: (workoutId: string, exerciseId: string, weight: number) => void;
  isLoadingData: boolean;
}

// Mantidos como fallback caso a API falhe (apresentação segura)
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

// Usuário demo usado apenas como fallback visual (não autentica no back)
const mockUser: User = {
  id: "522a1f07-9408-4f3f-b90c-783862846f3e",
  name: "Luis",
  email: "luis@email.com",
  height: 175,
  weight: 70,
  age: 22,
  goal: "hipertrofia",
  experienceLevel: "intermediario",
};

const AppContext = createContext<AppContextType | undefined>(undefined);

function mapTreinos(data: any[]): Workout[] {
  return data.map((treino) => ({
    id: treino.id_treino,
    name: treino.nome_treino,
    dayOfWeek: treino.treino_dias?.[0]?.nome_dia ?? "Segunda",
    exercises:
      treino.treino_dias?.flatMap((dia: any) =>
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

  // Hidrata usuário e token do localStorage ao recarregar a página
  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch {
        localStorage.removeItem("user");
      }
    }
  }, []);

  // Carrega treinos e histórico assim que o usuário estiver disponível
  useEffect(() => {
    if (!user) {
      setIsLoadingData(false);
      return;
    }

    async function carregarDados() {
      setIsLoadingData(true);
      try {
        const [treinosRaw, historicoData] = await Promise.all([
          getTreinos(),
          getHistoricoExecucao().catch(() => null),
        ]);

        // getTreinos() retorna { treinos: [...] }
        const lista = Array.isArray(treinosRaw)
          ? treinosRaw
          : treinosRaw?.treinos ?? [];
        setWorkouts(mapTreinos(lista));

        if (historicoData && Array.isArray(historicoData)) {
          setCompletedWorkouts(
            historicoData.map((exec: any) => ({
              date:
                exec.data_execucao?.split("T")[0] ??
                new Date().toISOString().split("T")[0],
              workoutId: exec.id_treino,
              workoutName: exec.treinos?.nome_treino ?? "Treino Concluído",
            }))
          );
        } else {
          setCompletedWorkouts(mockCompletedWorkouts);
        }
      } catch (error) {
        console.error("Erro ao carregar dados da API:", error);
        setCompletedWorkouts(mockCompletedWorkouts);
      } finally {
        setIsLoadingData(false);
      }
    }

    carregarDados();
  }, [user]);

  const isAuthenticated = user !== null;

  const login = async (email: string, password: string): Promise<boolean> => {
    if (!email || !password) return false;

    try {
      // Para a apresentação: usa o ID do usuário demo conhecido no banco.
      // Quando o back tiver cadastro real, trocar pelo ID retornado pelo endpoint de registro.
      const userId = mockUser.id;
      const { access_token } = await loginApi(userId);

      localStorage.setItem("token", access_token);

      const loggedUser: User = { ...mockUser, id: userId };
      localStorage.setItem("user", JSON.stringify(loggedUser));
      setUser(loggedUser);

      return true;
    } catch (err) {
      console.error("Falha no login:", err);
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    setWorkouts([]);
    setCompletedWorkouts([]);
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

    // Atualização otimista
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
          ? { ...w, completed: true, exercises: w.exercises.map((ex) => ({ ...ex, completed: true })) }
          : w
      )
    );

    try {
      await registrarExecucao({
        id_treino: workoutId,
        duracao: null,
        exercicios: workout.exercises.map((ex) => ({
          id: ex.id,
          series_realizadas: ex.sets,
          // reps pode ser "8-10" — manda null se não for número puro
          reps_realizadas: typeof ex.reps === "number" ? ex.reps : null,
          peso_utilizado: ex.weight || 0,
        })),
      });
    } catch (error) {
      console.error("Falha ao registrar execução no backend:", error);
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
