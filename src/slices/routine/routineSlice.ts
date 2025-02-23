import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { defaultResponse } from "./const";

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
    const prompt = `
      Generate a detailed personalized workout routine for a user with:
      - Goal: ${formData.goal}
      - Fitness Level: ${formData.level}
      - Days: ${formData.days}
      - Equipment: ${formData.equipment}
      **Include:**
      - Exercises (names and muscle groups)
      - Sets, reps, weight ranges
      - Rest times
      - Explanation
      **Format as JSON:**
      {
        "routine": [
          {
            "day": "Day 1",
            "exercises": [
              {
                "name": "Exercise Name",
                "muscle_group": "Muscle Group",
                "sets": 4,
                "reps": "12",
                "weight": "Moderate",
                "rest": "60 seconds"
              }
            ],
            "explanation": "Why this fits the goal"
          }
        ]
      }
      Return only the JSON object, no additional text.
    `;

    try {
      return defaultResponse as unknown as Routine;
      const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": "Bearer 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", // Reemplaza con tu clave de Groq
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "llama3-8b-8192", // Modelo gratuito disponible
          messages: [
            { role: "system", content: "You are a fitness expert generating workout routines." },
            { role: "user", content: prompt },
          ],
          max_tokens: 1500,
          temperature: 0.7,
        }),
      });
      console.log(response)
      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      console.log(data)
      const generatedText = data.choices[0]?.message.content;

      if (!generatedText) {
        throw new Error("Respuesta vacía de la API");
      }

      const routine: Routine = JSON.parse(generatedText);
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