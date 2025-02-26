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
  videoUrl?: string;
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
  name: string;
  routine: RoutineDay[];
}

interface RoutineState {
  routines: Routine[];
  selectedRoutineIndex: number | null;
  loading: boolean;
  error: string | null;
}

const initialState: RoutineState = {
  routines: localStorage.getItem("routines")
    ? JSON.parse(localStorage.getItem("routines") as string)
    : [],
  selectedRoutineIndex: localStorage.getItem("selectedRoutineIndex")
    ? Number(localStorage.getItem("selectedRoutineIndex"))
    : null,
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
      return defaultResponse[0] as unknown as Routine;
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

      const routine: RoutineDay[] = (await response.json()).routine;
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
      localStorage.removeItem("routines");
      localStorage.removeItem("selectedRoutineIndex");
    },
    selectRoutine(state, action: PayloadAction<number>) {
      state.selectedRoutineIndex = action.payload;
      localStorage.setItem("selectedRoutineIndex", action.payload.toString());
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
        videoUrl: string;
      }>
    ) {
      const { routineIndex, dayIndex, exerciseIndex, videoUrl } = action.payload;
      if (state.routines[routineIndex]) {
        state.routines[routineIndex].routine[dayIndex].exercises[exerciseIndex].videoUrl = videoUrl;
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
        localStorage.setItem("selectedRoutineIndex", state.selectedRoutineIndex.toString());
      })
      .addCase(fetchRoutine.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearRoutines, selectRoutine, updateExercise, setExerciseVideo } = routineSlice.actions;
export default routineSlice.reducer;