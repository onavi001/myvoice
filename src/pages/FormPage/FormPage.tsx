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
    <div className="min-h-screen bg-[#1A1A1A] text-white flex flex-col">
      <div className="p-4 max-w-md mx-auto flex-1">
        <h2 className="text-sm font-sans font-semibold text-white mb-4 truncate">Datos Iniciales</h2>
        <form onSubmit={handleSubmit} className="space-y-2">
          <input
            name="level"
            placeholder="Nivel (principiante/intermedio/avanzado)"
            value={formData.level}
            onChange={handleChange}
            className="w-full p-2 border border-[#4A4A4A] rounded bg-[#1A1A1A] text-white text-xs placeholder-[#B0B0B0] focus:outline-none focus:ring-1 focus:ring-[#34C759]"
          />
          <input
            name="goal"
            placeholder="Objetivo (fuerza/hipertrofia/resistencia)"
            value={formData.goal}
            onChange={handleChange}
            className="w-full p-2 border border-[#4A4A4A] rounded bg-[#1A1A1A] text-white text-xs placeholder-[#B0B0B0] focus:outline-none focus:ring-1 focus:ring-[#34C759]"
          />
          <input
            name="days"
            placeholder="Días por semana (1-7)"
            value={formData.days}
            onChange={handleChange}
            className="w-full p-2 border border-[#4A4A4A] rounded bg-[#1A1A1A] text-white text-xs placeholder-[#B0B0B0] focus:outline-none focus:ring-1 focus:ring-[#34C759]"
          />
          <input
            name="equipment"
            placeholder="Equipo (gym/casa/pesas)"
            value={formData.equipment}
            onChange={handleChange}
            className="w-full p-2 border border-[#4A4A4A] rounded bg-[#1A1A1A] text-white text-xs placeholder-[#B0B0B0] focus:outline-none focus:ring-1 focus:ring-[#34C759]"
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#34C759] text-black py-2 rounded hover:bg-[#2DBF4E] transition-colors disabled:bg-[#4A4A4A] disabled:text-[#B0B0B0] text-xs shadow-sm"
          >
            {loading ? "Generando..." : "Generar Rutina"}
          </button>
        </form>

        {error && (
          <div className="mt-2 p-2 bg-[#2D2D2D] text-red-400 rounded shadow-sm text-xs">
            {error}
          </div>
        )}

        {routine && !loading && (
          <div className="mt-4">
            <h3 className="text-sm font-sans font-semibold text-white mb-2 truncate">Tu Rutina Personalizada</h3>
            <p className="text-[#B0B0B0] text-xs">Rutina generada. Redirigiendo a la página de detalles...</p>
            <button
              onClick={handleClear}
              className="mt-2 w-full bg-white text-black py-1 rounded hover:bg-[#E0E0E0] transition-colors text-xs shadow-sm"
            >
              Limpiar Rutina
            </button>
          </div>
        )}
      </div>
    </div>
  );
};