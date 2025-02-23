import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchRoutine, clearRoutine } from "../../slices/routine/routineSlice";
import { RootState, AppDispatch } from "../../slices/store";

// Interfaz para los datos del formulario
interface FormData {
  level: string;
  goal: string;
  days: string;
  equipment: string;
}

export const FormPage: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    level: "",
    goal: "",
    days: "",
    equipment: "",
  });

  const dispatch = useDispatch<AppDispatch>();
  const { routine, loading, error } = useSelector((state: RootState) => state.routine);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(fetchRoutine(formData));
  };

  const handleClear = () => {
    dispatch(clearRoutine());
    setFormData({ level: "", goal: "", days: "", equipment: "" });
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="p-6 max-w-md mx-auto">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Datos Iniciales</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            name="level"
            placeholder="Nivel (principiante/intermedio/avanzado)"
            value={formData.level}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
          <input
            name="goal"
            placeholder="Objetivo (fuerza/hipertrofia/resistencia)"
            value={formData.goal}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
          <input
            name="days"
            placeholder="Días por semana (1-7)"
            value={formData.days}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
          <input
            name="equipment"
            placeholder="Equipo (gym/casa/pesas)"
            value={formData.equipment}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-orange-500 text-white p-2 rounded hover:bg-orange-600 disabled:bg-orange-300"
          >
            {loading ? "Generando..." : "Generar Rutina"}
          </button>
        </form>

        {/* Mostrar error si ocurre */}
        {error && (
          <div className="mt-4 p-2 bg-red-100 text-red-700 rounded">
            {error}
          </div>
        )}

        {/* Mostrar rutina si existe */}
        {routine && (
          <div className="mt-6">
            <h3 className="text-xl font-bold text-blue-900">Tu Rutina Personalizada</h3>
            {routine.routine.map((day, index) => (
              <div key={index} className="mt-4">
                <h4 className="font-semibold text-lg">{day.day}</h4>
                <ul className="mt-2 space-y-2">
                  {day.exercises.map((exercise, exIndex) => (
                    <li key={exIndex} className="bg-white p-2 rounded shadow">
                      <p>
                        <strong>{exercise.name}</strong> ({exercise.muscle_group})
                      </p>
                      <p>
                        {exercise.sets} series x {exercise.reps} reps - Peso: {exercise.weight}
                      </p>
                      <p>Descanso: {exercise.rest}</p>
                    </li>
                  ))}
                </ul>
                {day.explanation && (
                  <p className="mt-2 text-gray-600 italic">{day.explanation}</p>
                )}
              </div>
            ))}
            <button
              onClick={handleClear}
              className="mt-4 w-full bg-gray-500 text-white p-2 rounded hover:bg-gray-600"
            >
              Limpiar Rutina
            </button>
          </div>
        )}
      </div>
    </div>
  );
};