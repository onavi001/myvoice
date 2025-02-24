import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { defaultResponse } from "./const";

export interface RoutineExercise {
  name: string;
  muscle_group: string;
  sets: number;
  reps: number;
  weight: string;
  rest: string;
  notes?: string;
}

interface RoutineDay {
  day: string;
  exercises: RoutineExercise[];
  explanation?: string;
}

interface Routine {
  routine: RoutineDay[];
}

interface RoutineState {
  routine: Routine | null;
  loading: boolean;
  error: string | null;
}

const initialState: RoutineState = {
  routine: localStorage.getItem("routine")
    ? JSON.parse(localStorage.getItem("routine") as string)
    : null,
  loading: false,
  error: null,
};
export const fetchRoutine = createAsyncThunk(
  "routine/fetchRoutine",
  async (
    formData: { level: string; goal: string; days: string; equipment: string },
    { rejectWithValue }
  ) => {
    try {
      return defaultResponse as unknown as Routine;
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

      const routine: Routine = await response.json();
      return routine;
    } catch (err) {
      return rejectWithValue(err instanceof Error ? err.message : "Error desconocido");
    }
  }
);
// Acción para actualizar un ejercicio
interface UpdateExercisePayload {
  dayIndex: number;
  exerciseIndex: number;
  updatedExercise: Partial<RoutineExercise>;
}
const routineSlice = createSlice({
  name: "routine",
  initialState,
  reducers: {
    clearRoutine(state) {
      state.routine = null;
      state.error = null;
      localStorage.removeItem("routine");
    },
    updateExercise(state, action: PayloadAction<UpdateExercisePayload>) {
      if (state.routine) {
        const { dayIndex, exerciseIndex, updatedExercise } = action.payload;
        const exercise = state.routine.routine[dayIndex].exercises[exerciseIndex];
        state.routine.routine[dayIndex].exercises[exerciseIndex] = {
          ...exercise,
          ...updatedExercise,
        };
        // Actualizar Local Storage
        localStorage.setItem("routine", JSON.stringify(state.routine));
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
        state.routine = action.payload;
        localStorage.setItem("routine", JSON.stringify(action.payload));
      })
      .addCase(fetchRoutine.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearRoutine, updateExercise } = routineSlice.actions;
export default routineSlice.reducer;