// Tipo para un único ejercicio
export interface Exercise {
    id: string;
    name: string;
    sets: number;
    reps: number;
    weight: number;
    date: string;  // Fecha en que se realizó el ejercicio
  }
  
  // Tipo para el estado global
  export interface GymState {
    exercises: Exercise[];
    statistics: {
      totalWorkouts: number;
      totalSets: number;
      totalReps: number;
      totalWeight: number;
    };
    user: {
      name: string;
      preferences: string[];
    };
  }