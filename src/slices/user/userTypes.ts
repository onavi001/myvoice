import { Routine } from "../exercise/exerciseTypes";

export interface UserState {
    name: string;
    preferences: string[];
    assignedRoutine: Routine;
  }