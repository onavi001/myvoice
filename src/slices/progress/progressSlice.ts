import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface ProgressEntry {
  id?: number;
  routineIndex: number;
  dayIndex: number;
  exerciseIndex: number;
  sets: number;
  reps: number;
  weight: string;
  notes: string;
  date: string;
}

interface ProgressState {
  progress: ProgressEntry[];
}

const loadProgressFromStorage = (): ProgressEntry[] => {
  const storedProgress = localStorage.getItem("progress");
  return storedProgress ? JSON.parse(storedProgress) : [];
};

const initialState: ProgressState = {
  progress: loadProgressFromStorage(),
};

const progressSlice = createSlice({
  name: "progress",
  initialState,
  reducers: {
    addProgress(state, action: PayloadAction<ProgressEntry>) {
      const newProgress = action.payload;
      const today = newProgress.date.split("T")[0]; // Obtener solo la fecha (YYYY-MM-DD)
      const existingProgressIndex = state.progress.findIndex(
        (entry) =>
          entry.routineIndex === newProgress.routineIndex &&
          entry.dayIndex === newProgress.dayIndex &&
          entry.exerciseIndex === newProgress.exerciseIndex &&
          entry.date.split("T")[0] === today
      );

      if (existingProgressIndex !== -1) {
        // Si ya existe un progreso para este ejercicio hoy, actualizarlo
        state.progress[existingProgressIndex] = {
          ...state.progress[existingProgressIndex],
          ...newProgress,
        };
      } else {
        // Si no existe, añadir uno nuevo
        state.progress.push(newProgress);
      }
      localStorage.setItem("progress", JSON.stringify(state.progress));
    },
    clearProgress(state) {
      state.progress = [];
      localStorage.setItem("progress", JSON.stringify([]));
    },
  },
});

export const { addProgress, clearProgress } = progressSlice.actions;
export default progressSlice.reducer;