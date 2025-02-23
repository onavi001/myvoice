import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";

interface RoutineExercise {
  name: string;
  muscle_group: string;
  sets: number;
  reps: number;
  weight: string;
  rest: string;
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
  routine: null,
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

const routineSlice = createSlice({
  name: "routine",
  initialState,
  reducers: {
    clearRoutine(state) {
      state.routine = null;
      state.error = null;
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
      })
      .addCase(fetchRoutine.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearRoutine } = routineSlice.actions;
export default routineSlice.reducer;