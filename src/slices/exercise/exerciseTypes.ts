export interface Exercise {
    id: string;
    name: string;
    muscle_group: string;
    sets: number;
    reps: number;
    weight: number;
    date: string;
    notes:string;
  }
  export interface Routine {
    id: string;
    name: string;
    exercises: Exercise[];
  }