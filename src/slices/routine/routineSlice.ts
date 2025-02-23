import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Routine, Exercise } from '../exercise/exerciseTypes';

// Estado inicial con una lista de rutinas
const initialState: Routine[] = [];

// Crear el slice
const routineSlice = createSlice({
  name: 'routine',
  initialState,
  reducers: {
    addRoutine: (state, action: PayloadAction<Routine>) => {
      state.push(action.payload);
    },
    assignRoutineToUser: (state, action: PayloadAction<{ userId: string, routineId: string }>) => {
      const routine = state.find(r => r.id === action.payload.routineId);
      if (routine) {
        // Aquí puedes manejar la asignación de una rutina a un usuario
        // Por ejemplo, actualizar el estado del usuario o crear una propiedad en el slice de usuario.
      }
    },
    updateExerciseInRoutine: (state, action: PayloadAction<{ routineId: string, exercise: Exercise }>) => {
      const routine = state.find(r => r.id === action.payload.routineId);
      if (routine) {
        const exerciseIndex = routine.exercises.findIndex(e => e.id === action.payload.exercise.id);
        if (exerciseIndex !== -1) {
          routine.exercises[exerciseIndex] = action.payload.exercise;
        }
      }
    },
  },
});

// Exportar las acciones generadas
export const { addRoutine, assignRoutineToUser, updateExerciseInRoutine } = routineSlice.actions;

// Exportar el reducer
export default routineSlice.reducer;