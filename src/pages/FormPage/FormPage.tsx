import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchRoutine, clearRoutine } from "../../slices/routine/routineSlice";
import { RootState, AppDispatch } from "../../slices/store";
import { useNavigate } from "react-router-dom";

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
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(fetchRoutine(formData)).then((result) => {
      if (fetchRoutine.fulfilled.match(result)) {
        navigate("/routine");
      }
    });
  };

  const handleClear = () => {
    dispatch(clearRoutine());
    setFormData({ level: "", goal: "", days: "", equipment: "" });
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="p-4 max-w-md mx-auto">
        <h2 className="text-xl font-sans font-semibold text-white mb-3">Datos Iniciales</h2>
        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            name="level"
            placeholder="Nivel (principiante/intermedio/avanzado)"
            value={formData.level}
            onChange={handleChange}
            className="w-full p-2 border border-gray-700 rounded bg-black text-white text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500"
          />
          <input
            name="goal"
            placeholder="Objetivo (fuerza/hipertrofia/resistencia)"
            value={formData.goal}
            onChange={handleChange}
            className="w-full p-2 border border-gray-700 rounded bg-black text-white text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500"
          />
          <input
            name="days"
            placeholder="Días por semana (1-7)"
            value={formData.days}
            onChange={handleChange}
            className="w-full p-2 border border-gray-700 rounded bg-black text-white text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500"
          />
          <input
            name="equipment"
            placeholder="Equipo (gym/casa/pesas)"
            value={formData.equipment}
            onChange={handleChange}
            className="w-full p-2 border border-gray-700 rounded bg-black text-white text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500"
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-white text-black py-2 rounded hover:bg-gray-200 transition-colors disabled:bg-gray-600 disabled:text-gray-400 text-sm shadow-sm"
          >
            {loading ? "Generando..." : "Generar Rutina"}
          </button>
        </form>

        {error && (
          <div className="mt-3 p-2 bg-gray-900 text-red-400 rounded shadow-sm text-sm">
            {error}
          </div>
        )}

        {routine && !loading && (
          <div className="mt-4">
            <h3 className="text-lg font-sans font-semibold text-white mb-2">Tu Rutina Personalizada</h3>
            <p className="text-gray-300 text-sm">Rutina generada. Redirigiendo a la página de detalles...</p>
            <button
              onClick={handleClear}
              className="mt-3 w-full bg-gray-700 text-white py-1 rounded hover:bg-gray-600 transition-colors text-sm shadow-sm"
            >
              Limpiar Rutina
            </button>
          </div>
        )}
      </div>
    </div>
  );
};