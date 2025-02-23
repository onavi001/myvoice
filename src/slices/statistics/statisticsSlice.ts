import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { StatisticsState } from './statisticsTypes';

// Estado inicial
const initialState: StatisticsState = {
  totalWorkouts: 0,
  totalSets: 0,
  totalReps: 0,
  totalWeight: 0,
};

// Crear el slice
const statisticsSlice = createSlice({
  name: 'statistics',
  initialState,
  reducers: {
    updateStatistics: (state, action: PayloadAction<any[]>) => {
      const exercises = action.payload;
      state.totalWorkouts = exercises.length;
      state.totalSets = exercises.reduce((sum, exercise) => sum + exercise.sets, 0);
      state.totalReps = exercises.reduce((sum, exercise) => sum + exercise.reps, 0);
      state.totalWeight = exercises.reduce((sum, exercise) => sum + exercise.weight, 0);
    },
  },
});

// Exportar las acciones generadas
export const { updateStatistics } = statisticsSlice.actions;

// Exportar el reducer
export default statisticsSlice.reducer;