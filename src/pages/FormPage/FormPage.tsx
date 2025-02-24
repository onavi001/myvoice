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

        {error && (
          <div className="mt-4 p-2 bg-red-100 text-red-700 rounded">
            {error}
          </div>
        )}

        {routine && !loading && (
          <div className="mt-6">
            <h3 className="text-xl font-bold text-blue-900">Tu Rutina Personalizada</h3>
            <p>Rutina generada. Redirigiendo a la página de detalles...</p>
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