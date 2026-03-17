export interface User {
  id: string;
  name: string;
  email: string;
  height: number;
  weight: number;
  age: number;
  goal: 'hipertrofia' | 'emagrecimento' | 'forca' | 'resistencia';
  experienceLevel: 'iniciante' | 'intermediario' | 'avancado';
  trainingFrequency?: number;
  limitations?: string[];
  equipment?: string[];
  preferences?: string;
}

export type OnboardingStep = 'account' | 'anamnese' | 'limitacoes' | 'complete';

export interface Exercise {
  id: string;
  name: string;
  sets: number;
  reps: number | string;
  weight?: number;
  completed?: boolean;
}

export interface Workout {
  id: string;
  name: string;
  dayOfWeek: string;
  exercises: Exercise[];
  completed?: boolean;
}

export interface WeeklyPlan {
  id: string;
  workouts: Workout[];
}

export interface ProgressEntry {
  date: string;
  value: number;
}

export interface ExerciseProgress {
  exerciseId: string;
  exerciseName: string;
  initialWeight: number;
  currentWeight: number;
  progress: number;
  history: ProgressEntry[];
}

export interface WeightEntry {
  date: string;
  weight: number;
}

export interface CompletedWorkout {
  date: string;
  workoutId: string;
  workoutName: string;
}
