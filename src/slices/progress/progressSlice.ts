import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface ProgressEntry {
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

const initialState: ProgressState = {
  progress: localStorage.getItem("progress")
    ? JSON.parse(localStorage.getItem("progress") as string)
    : [],
};

const progressSlice = createSlice({
  name: "progress",
  initialState,
  reducers: {
    addProgress(state, action: PayloadAction<ProgressEntry>) {
      state.progress.push(action.payload);
      localStorage.setItem("progress", JSON.stringify(state.progress));
    },
    updateProgress(
      state,
      action: PayloadAction<{ index: number; updatedEntry: Partial<ProgressEntry> }>
    ) {
      const { index, updatedEntry } = action.payload;
      state.progress[index] = { ...state.progress[index], ...updatedEntry };
      localStorage.setItem("progress", JSON.stringify(state.progress));
    },
    clearProgress(state) {
      state.progress = [];
      localStorage.removeItem("progress");
    },
  },
});

export const { addProgress, updateProgress, clearProgress } = progressSlice.actions;
export default progressSlice.reducer;