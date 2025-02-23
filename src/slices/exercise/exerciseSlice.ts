import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Exercise } from './exerciseTypes';

// Estado inicial
const initialState: Exercise[] = [];

// Crear el slice
const exerciseSlice = createSlice({
  name: 'exercise',
  initialState,
  reducers: {
    addExercise: (state, action: PayloadAction<Exercise>) => {
      state.push(action.payload);
    },
    removeExercise: (state, action: PayloadAction<string>) => {
      return state.filter(exercise => exercise.id !== action.payload);
    },
    updateExercise: (state, action: PayloadAction<Exercise>) => {
      const index = state.findIndex(exercise => exercise.id === action.payload.id);
      if (index !== -1) {
        state[index] = action.payload;
      }
    },
  },
});

// Exportar las acciones generadas
export const { addExercise, removeExercise, updateExercise } = exerciseSlice.actions;

// Exportar el reducer
export default exerciseSlice.reducer;