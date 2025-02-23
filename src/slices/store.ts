import { configureStore } from '@reduxjs/toolkit';
import userReducer from './user/userSlice';
import exerciseReducer from './exercise/exerciseSlice';
import statisticsReducer from './statistics/statisticsSlice';
import routineReducer from './routine/routineSlice';

const store = configureStore({
  reducer: {
    user: userReducer,
    exercise: exerciseReducer,
    statistics: statisticsReducer,
    routine: routineReducer,
  },
});

export default store;
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;