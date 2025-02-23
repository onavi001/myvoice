import React from "react";

interface Exercise {
  name: string;
  sets: number;
  reps: number;
  weight?: string;
}

interface ExerciseCardProps {
  exercise: Exercise;
  onUpdate: (updatedExercise: Exercise) => void;
}

export const ExerciseCard: React.FC<ExerciseCardProps> = ({ exercise, onUpdate }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-4">
      <h3 className="text-lg font-bold text-gray-800">{exercise.name}</h3>
      <p className="text-gray-600">
        {exercise.sets} series x {exercise.reps} reps {exercise.weight && `- ${exercise.weight}`}
      </p>
      <div className="mt-2">
        <input
          type="text"
          placeholder="Peso real"
          className="border rounded p-1 mr-2"
          onChange={(e) => onUpdate({ ...exercise, weight: e.target.value })}
        />
        <input
          type="number"
          placeholder="Reps reales"
          className="border rounded p-1 mr-2"
          onChange={(e) => onUpdate({ ...exercise, reps: Number(e.target.value) })}
        />
        <textarea
          placeholder="Notas"
          className="border rounded p-1 w-full mt-2"
        />
      </div>
    </div>
  );
};