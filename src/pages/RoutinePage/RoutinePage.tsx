import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../slices/store";
import { useNavigate } from "react-router-dom";

export const RoutinePage: React.FC = () => {
  const { routine } = useSelector((state: RootState) => state.routine);
  const navigate = useNavigate();

  const handleBack = () => {
    navigate("/"); // Volver a FormPage
  };

  // Si no hay rutina, mostrar mensaje
  if (!routine) {
    return (
      <div className="min-h-screen bg-gray-100">
        <div className="p-6 max-w-md mx-auto">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Tu Rutina</h2>
          <p className="text-gray-600">No hay rutina generada. Por favor, genera una desde la página principal.</p>
          <button
            onClick={handleBack}
            className="mt-4 w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
          >
            Volver al formulario
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="p-6 max-w-md mx-auto">
        <h2 className="text-2xl font-bold text-blue-900 mb-4">Tu Rutina Personalizada</h2>
        {routine.routine.map((day, index) => (
          <div key={index} className="mt-4">
            <h3 className="font-semibold text-lg text-gray-800">{day.day}</h3>
            <ul className="mt-2 space-y-2">
              {day.exercises.map((exercise, exIndex) => (
                <li key={exIndex} className="bg-white p-4 rounded-lg shadow-md border-l-4 border-blue-500">
                  <p className="text-lg font-semibold">{exercise.name}</p>
                  <p className="text-gray-700">{exercise.muscle_group}</p>
                  <p className="text-gray-600">
                    {exercise.sets} series x {exercise.reps} reps - Peso: {exercise.weight}
                  </p>
                  <p className="text-gray-500">Descanso: {exercise.rest}</p>
                </li>
              ))}
            </ul>
            {day.explanation && (
              <p className="mt-2 text-gray-600 italic">{day.explanation}</p>
            )}
          </div>
        ))}
        <button
          onClick={handleBack}
          className="mt-6 w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
        >
          Volver al formulario
        </button>
      </div>
    </div>
  );
};