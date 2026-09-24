"use client";
import { getTreinos, registrarExecucao, getHistoricoExecucao, loginApi, registerApi, getAnamnese } from "@/lib/api";
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
  register: (nome: string, email: string, senha: string) => Promise<boolean>;
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
  authError: string;
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
function mapAnamneseParaUser(base: User, anamnese: any): User {
  const objetivos = Array.isArray(anamnese.objetivo) ? anamnese.objetivo : [anamnese.objetivo];
  return {
    ...base,
    height: anamnese.altura ?? base.height,
    weight: anamnese.peso ?? base.weight,
    age: anamnese.idade ?? base.age,
    sexo: anamnese.sexo ?? base.sexo,
    goal: (objetivos[0] as User["goal"]) ?? base.goal,
    goals: objetivos,
    experienceLevel: anamnese.experiencia ?? base.experienceLevel,
    trainingFrequency: anamnese.dias_treino ?? base.trainingFrequency,
    limitations: anamnese.lesoes ?? base.limitations,
    equipment: anamnese.equipamentos ?? base.equipment,
    preferences: anamnese.preferencias ?? base.preferences,
  };
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [onboardingStep, setOnboardingStep] = useState<OnboardingStep>("account");
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [exerciseProgress] = useState<ExerciseProgress[]>(mockExerciseProgress);
  const [weightHistory] = useState<WeightEntry[]>(mockWeightHistory);
  const [completedWorkouts, setCompletedWorkouts] = useState<CompletedWorkout[]>([]);
  const [isLoadingData, setIsLoadingData] = useState<boolean>(true);
  const [authError, setAuthError] = useState<string>("");

  // Hidrata usuário e token do localStorage ao recarregar a página
  useEffect(() => {
  const savedUser = localStorage.getItem("user");
  const savedToken = localStorage.getItem("token");
  if (savedUser && savedToken) {
    try {
      const parsedUser = JSON.parse(savedUser);
      setUser(parsedUser);
      getAnamnese()
        .then((anamnese) => {
          const updated = mapAnamneseParaUser(parsedUser, anamnese);
          setUser(updated);
          localStorage.setItem("user", JSON.stringify(updated));
        })
        .catch(() => {});
    } catch {
      localStorage.removeItem("user");
      localStorage.removeItem("token");
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
          setCompletedWorkouts([]);
        }
      } catch (error) {
        console.error("Erro ao carregar dados da API:", error);
        setWorkouts([]);
        setCompletedWorkouts([]);
      } finally {
        setIsLoadingData(false);
      }
    }

    carregarDados();
  }, [user]);

  const isAuthenticated = user !== null;

  const login = async (email: string, password: string): Promise<boolean> => {
  setAuthError("");
  if (!email || !password) return false;

  try {
    const { access_token, aluno } = await loginApi(email, password);
    localStorage.setItem("token", access_token);

    let loggedUser: User = {
      id: aluno.id_aluno,
      name: aluno.nome,
      email: aluno.email,
      height: 0,
      weight: 0,
      age: 0,
      goal: "hipertrofia",
      experienceLevel: "iniciante",
    };

    try {
      const anamnese = await getAnamnese();
      loggedUser = mapAnamneseParaUser(loggedUser, anamnese);
    } catch {
      // Sem anamnese ainda (usuário novo) — segue com os valores padrão
    }

    localStorage.setItem("user", JSON.stringify(loggedUser));
    setUser(loggedUser);
    return true;
  } catch (err: any) {
    console.error("Falha no login:", err);
    setAuthError(err.message || "Erro ao autenticar.");
    return false;
  }
};

  const register = async (nome: string, email: string, senha: string): Promise<boolean> => {
    setAuthError("");
    try {
      const { access_token, aluno } = await registerApi(nome, email, senha);

      localStorage.setItem("token", access_token);

      const newUser: User = {
        id: aluno.id_aluno,
        name: aluno.nome,
        email: aluno.email,
        height: 0,
        weight: 0,
        age: 0,
        goal: "hipertrofia",
        experienceLevel: "iniciante",
      };
      localStorage.setItem("user", JSON.stringify(newUser));
      setUser(newUser);

      return true;
    } catch (err: any) {
      console.error("Falha no registro:", err);
      setAuthError(err.message || "Erro ao criar conta.");
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
        register,
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
        authError,
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