import { configureStore } from '@reduxjs/toolkit';
import userReducer from './user/userSlice';
import routineReducer from './routine/routineSlice';
import progressSlice from './progress/progressSlice';

const store = configureStore({
  reducer: {
    user: userReducer,
    routine: routineReducer,
    progress :progressSlice,
  },
});

export default store;
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;