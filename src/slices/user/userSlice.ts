import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { UserState } from './userTypes';

// Estado inicial
const initialState: UserState = {
  name: '',
  preferences: [],
  assignedRoutine: {
    id: '',
    name: '',
    exercises: []
  },
};

// Crear el slice
const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUserName: (state, action: PayloadAction<string>) => {
      state.name = action.payload;
    },
    addUserPreference: (state, action: PayloadAction<string>) => {
      state.preferences.push(action.payload);
    }
  },
});

// Exportar las acciones generadas
export const { setUserName, addUserPreference } = userSlice.actions;

// Exportar el reducer
export default userSlice.reducer;