import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { defaultResponse } from "./const";

interface RoutineExercise {
  name: string;
  muscle_group: string;
  sets: number;
  reps: number;
  weight: string;
  rest: string;
  notes?: string;
  videoUrls?: string[];
  currentVideoIndex?: number;
  tips?: string[];
}

interface RoutineDay {
  day: string;
  exercises: RoutineExercise[];
  musclesWorked: string[];
  warmUpOptions: string[];
  explanation?: string;
}

interface Routine {
  id?: number;
  name: string;
  routine: RoutineDay[];
}

interface RoutineState {
  routines: Routine[];
  selectedRoutineIndex: number | null;
  loading: boolean;
  error: string | null;
}

const loadRoutinesFromStorage = (): Routine[] => {
  const storedRoutines = localStorage.getItem("routines");
  return storedRoutines ? JSON.parse(storedRoutines) : [];
};

const loadSelectedRoutineIndexFromStorage = (): number | null => {
  const storedIndex = localStorage.getItem("selectedRoutineIndex");
  return storedIndex !== null ? Number(storedIndex) : null;
};

const initialState: RoutineState = {
  routines: loadRoutinesFromStorage(),
  selectedRoutineIndex: loadSelectedRoutineIndexFromStorage(),
  loading: false,
  error: null,
};

export const fetchRoutine = createAsyncThunk(
  "routine/fetchRoutine",
  async (
    formData: { level: string; goal: string; days: string; equipment: string; name?: string; notes?: string },
    { rejectWithValue }
  ) => {
    try {
      if (formData.notes === "navi") {
        return defaultResponse[0] as unknown as Routine;
      }
      const response = await fetch("/.netlify/functions/generateRoutine", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const routine: RoutineDay[] = await response.json();
      return { name: formData.name || "Rutina sin nombre", routine };
    } catch (err) {
      return rejectWithValue(err instanceof Error ? err.message : "Error desconocido");
    }
  }
);

const routineSlice = createSlice({
  name: "routine",
  initialState,
  reducers: {
    clearRoutines(state) {
      state.routines = [];
      state.selectedRoutineIndex = null;
      state.error = null;
      localStorage.setItem("routines", JSON.stringify([]));
      localStorage.setItem("selectedRoutineIndex", JSON.stringify(null));
    },
    selectRoutine(state, action: PayloadAction<number>) {
      state.selectedRoutineIndex = action.payload;
      localStorage.setItem("selectedRoutineIndex", JSON.stringify(action.payload));
    },
    addRoutine(state, action: PayloadAction<Routine>) {
      state.routines.push(action.payload);
      state.selectedRoutineIndex = state.routines.length - 1;
      localStorage.setItem("routines", JSON.stringify(state.routines));
      localStorage.setItem("selectedRoutineIndex", JSON.stringify(state.selectedRoutineIndex));
    },
    editRoutine(state, action: PayloadAction<{ routineIndex: number; updatedRoutine: Routine }>) {
      const { routineIndex, updatedRoutine } = action.payload;
      if (state.routines[routineIndex]) {
        state.routines[routineIndex] = updatedRoutine;
        localStorage.setItem("routines", JSON.stringify(state.routines));
      }
    },
    deleteRoutine(state, action: PayloadAction<number>) {
      const routineIndex = action.payload;
      state.routines.splice(routineIndex, 1);
      if (state.routines.length === 0) {
        state.selectedRoutineIndex = null;
      } else if (state.selectedRoutineIndex === routineIndex) {
        state.selectedRoutineIndex = routineIndex > 0 ? routineIndex - 1 : 0;
      } else if (state.selectedRoutineIndex && state.selectedRoutineIndex > routineIndex) {
        state.selectedRoutineIndex -= 1;
      }
      localStorage.setItem("routines", JSON.stringify(state.routines));
      localStorage.setItem("selectedRoutineIndex", JSON.stringify(state.selectedRoutineIndex));
    },
    updateExercise(
      state,
      action: PayloadAction<{
        routineIndex: number;
        dayIndex: number;
        exerciseIndex: number;
        updatedExercise: Partial<RoutineExercise>;
      }>
    ) {
      const { routineIndex, dayIndex, exerciseIndex, updatedExercise } = action.payload;
      if (state.routines[routineIndex]) {
        const exercise = state.routines[routineIndex].routine[dayIndex].exercises[exerciseIndex];
        state.routines[routineIndex].routine[dayIndex].exercises[exerciseIndex] = {
          ...exercise,
          ...updatedExercise,
        };
        localStorage.setItem("routines", JSON.stringify(state.routines));
      }
    },
    setExerciseVideo(
      state,
      action: PayloadAction<{
        routineIndex: number;
        dayIndex: number;
        exerciseIndex: number;
        videoUrls: string[];
        currentVideoIndex?: number;
      }>
    ) {
      const { routineIndex, dayIndex, exerciseIndex, videoUrls, currentVideoIndex = 0 } = action.payload;
      if (state.routines[routineIndex]) {
        state.routines[routineIndex].routine[dayIndex].exercises[exerciseIndex].videoUrls = videoUrls;
        state.routines[routineIndex].routine[dayIndex].exercises[exerciseIndex].currentVideoIndex = currentVideoIndex;
        localStorage.setItem("routines", JSON.stringify(state.routines));
      }
    },
    changeExerciseVideoIndex(
      state,
      action: PayloadAction<{
        routineIndex: number;
        dayIndex: number;
        exerciseIndex: number;
        direction: "next" | "prev";
      }>
    ) {
      const { routineIndex, dayIndex, exerciseIndex, direction } = action.payload;
      const exercise = state.routines[routineIndex]?.routine[dayIndex]?.exercises[exerciseIndex];
      if (exercise && exercise.videoUrls && exercise.videoUrls.length > 0) {
        const currentIndex = exercise.currentVideoIndex || 0;
        const newIndex =
          direction === "next"
            ? (currentIndex + 1) % exercise.videoUrls.length
            : (currentIndex - 1 + exercise.videoUrls.length) % exercise.videoUrls.length;
        exercise.currentVideoIndex = newIndex;
        localStorage.setItem("routines", JSON.stringify(state.routines));
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchRoutine.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRoutine.fulfilled, (state, action: PayloadAction<Routine>) => {
        state.loading = false;
        state.routines.push(action.payload);
        state.selectedRoutineIndex = state.routines.length - 1;
        localStorage.setItem("routines", JSON.stringify(state.routines));
        localStorage.setItem("selectedRoutineIndex", JSON.stringify(state.selectedRoutineIndex));
      })
      .addCase(fetchRoutine.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const {
  clearRoutines,
  selectRoutine,
  addRoutine,
  editRoutine,
  deleteRoutine,
  updateExercise,
  setExerciseVideo,
  changeExerciseVideoIndex,
} = routineSlice.actions;

export default routineSlice.reducer;