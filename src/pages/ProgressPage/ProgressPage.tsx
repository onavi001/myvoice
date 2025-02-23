import React from "react";
import { ProgressTable } from "../../components/ProgressTable";

export const ProgressPage: React.FC = () => {
  const progressData = [
    { exercise: "Bench Press", weight: "50kg", reps: 8, notes: "Buen esfuerzo" },
    { exercise: "Push-ups", weight: "N/A", reps: 15, notes: "Fácil" },
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Progreso Semanal</h2>
        <div className="mb-6">
          <p className="text-gray-600">Gráfica de progreso (pendiente)</p>
        </div>
        <ProgressTable entries={progressData} />
        <button className="w-full bg-green-500 text-white p-2 rounded mt-4 hover:bg-green-600">
          Guardar Progreso
        </button>
      </div>
    </div>
  );
};