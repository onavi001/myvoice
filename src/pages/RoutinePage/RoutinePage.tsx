import React, { useState } from "react";
import { ExerciseCard } from "../../components/ExerciseCard";

export const RoutinePage: React.FC = () => {
  const [exercises, setExercises] = useState([
    { name: "Bench Press", sets: 4, reps: 8, weight: "50kg" },
    { name: "Push-ups", sets: 3, reps: 15 },
  ]);

  const handleUpdateExercise = (index: number, updatedExercise: any) => {
    const newExercises = [...exercises];
    newExercises[index] = updatedExercise;
    setExercises(newExercises);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="p-6">
        <h2 className="text-2xl font-bold text-blue-900 mb-4">Lunes - Pecho y Tríceps</h2>
        {exercises.map((exercise, index) => (
          <ExerciseCard
            key={index}
            exercise={exercise}
            onUpdate={(updated) => handleUpdateExercise(index, updated)}
          />
        ))}
        <button className="w-full bg-green-500 text-white p-2 rounded hover:bg-green-600">
          Completar Día
        </button>
      </div>
    </div>
  );
};