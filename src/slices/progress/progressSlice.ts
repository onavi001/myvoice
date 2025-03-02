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
      const today = newProgress.date.split("T")[0];
      const existingProgressIndex = state.progress.findIndex(
        (entry) =>
          entry.routineIndex === newProgress.routineIndex &&
          entry.dayIndex === newProgress.dayIndex &&
          entry.exerciseIndex === newProgress.exerciseIndex &&
          entry.date.split("T")[0] === today
      );

      if (existingProgressIndex !== -1) {
        state.progress[existingProgressIndex] = {
          ...state.progress[existingProgressIndex],
          ...newProgress,
        };
      } else {
        state.progress.push(newProgress);
      }
      localStorage.setItem("progress", JSON.stringify(state.progress));
    },
    editProgress(state, action: PayloadAction<{ cardKey: string; updatedEntry: ProgressEntry }>) {
      const { cardKey, updatedEntry } = action.payload;
      const index = state.progress.findIndex(
        (entry) =>
          `${entry.routineIndex}-${entry.dayIndex}-${entry.exerciseIndex}-${entry.date}` === cardKey
      );
      if (index !== -1) {
        state.progress[index] = { ...state.progress[index], ...updatedEntry };
        localStorage.setItem("progress", JSON.stringify(state.progress));
      }
    },
    deleteProgress(state, action: PayloadAction<string>) {
      const cardKey = action.payload;
      state.progress = state.progress.filter(
        (entry) =>
          `${entry.routineIndex}-${entry.dayIndex}-${entry.exerciseIndex}-${entry.date}` !== cardKey
      );
      localStorage.setItem("progress", JSON.stringify(state.progress));
    },
    clearProgress(state) {
      state.progress = [];
      localStorage.setItem("progress", JSON.stringify([]));
    },
  },
});

export const { addProgress, editProgress, deleteProgress, clearProgress } = progressSlice.actions;
export default progressSlice.reducer;