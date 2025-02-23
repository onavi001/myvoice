import React, { useState } from 'react';

const WorkoutForm = () => {
  const [exercise, setExercise] = useState('');
  const [sets, setSets] = useState(0);
  const [reps, setReps] = useState(0);
  const [weight, setWeight] = useState(0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Aquí se gestionaría la lógica de guardar el ejercicio
    console.log({ exercise, sets, reps, weight });
  };

  return (
    <form className="p-4" onSubmit={handleSubmit}>
      <label className="block text-sm font-medium text-gray-700">Exercise</label>
      <input
        type="text"
        value={exercise}
        onChange={(e) => setExercise(e.target.value)}
        className="mt-1 p-2 w-full border rounded"
        placeholder="Enter exercise name"
      />
      <label className="block text-sm font-medium text-gray-700 mt-2">Sets</label>
      <input
        type="number"
        value={sets}
        onChange={(e) => setSets(Number(e.target.value))}
        className="mt-1 p-2 w-full border rounded"
        placeholder="Number of sets"
      />
      <label className="block text-sm font-medium text-gray-700 mt-2">Reps</label>
      <input
        type="number"
        value={reps}
        onChange={(e) => setReps(Number(e.target.value))}
        className="mt-1 p-2 w-full border rounded"
        placeholder="Number of reps"
      />
      <label className="block text-sm font-medium text-gray-700 mt-2">Weight (kg)</label>
      <input
        type="number"
        value={weight}
        onChange={(e) => setWeight(Number(e.target.value))}
        className="mt-1 p-2 w-full border rounded"
        placeholder="Weight lifted"
      />
      <button type="submit" className="mt-4 bg-blue-500 text-white p-2 rounded">
        Log Workout
      </button>
    </form>
  );
};

export default WorkoutForm;