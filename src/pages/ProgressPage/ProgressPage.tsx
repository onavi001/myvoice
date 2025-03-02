import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "../../slices/store";
import { clearProgress } from "../../slices/progress/progressSlice";
import { useNavigate } from "react-router-dom";
import Toast from "../../components/Toast"; // Importamos Toast para la notificación

export const ProgressPage: React.FC = () => {
  const { progress } = useSelector((state: RootState) => state.progress);
  const { routines } = useSelector((state: RootState) => state.routine);
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const [toastMessage, setToastMessage] = useState<string | null>(null); // Estado para la notificación

  const handleBack = () => navigate("/routine");

  const handleClear = () => {
    dispatch(clearProgress());
    setToastMessage("Progreso limpiado correctamente"); // Mostrar notificación al limpiar
  };

  const handleCloseToast = () => {
    setToastMessage(null);
  };

  return (
    <div className="min-h-screen bg-[#1A1A1A] text-white flex flex-col">
      <div className="p-4 max-w-md mx-auto flex-1">
        <h2 className="text-sm font-sans font-semibold text-white mb-3 truncate">Tu Progreso</h2>
        {progress.length === 0 ? (
          <p className="text-[#B0B0B0] text-xs">Aún no has registrado progreso.</p>
        ) : (
          <ul className="space-y-2">
            {progress.map((entry) => {
              const routine = routines[entry.routineIndex];
              const day = routine?.routine[entry.dayIndex];
              const exercise = day?.exercises[entry.exerciseIndex];

              return (
                <li key={entry.id} className="bg-[#2D2D2D] p-2 rounded-lg shadow-sm">
                  <div className="text-xs">
                    <p className="text-[#FFFFFF] font-semibold">
                      {routine?.name || "Rutina desconocida"} - {day?.day || "Día desconocido"}
                    </p>
                    <p className="text-[#B0B0B0]">{exercise?.name || "Ejercicio desconocido"}</p>
                    <p className="text-[#B0B0B0]">{new Date(entry.date).toLocaleDateString()}</p>
                    <p className="text-[#FFFFFF]">
                      Series: {entry.sets}, Reps: {entry.reps}, Peso: {entry.weight}
                    </p>
                    {entry.notes && <p className="text-[#FFFFFF]">Notas: {entry.notes}</p>}
                  </div>
                </li>
              );
            })}
          </ul>
        )}
        <button
          onClick={handleClear}
          className="mt-4 w-full bg-red-600 text-white py-1 rounded hover:bg-red-700 transition-colors text-xs shadow-sm"
        >
          Limpiar Todo el Progreso
        </button>
        <button
          onClick={handleBack}
          className="mt-2 w-full bg-white text-black py-1 rounded hover:bg-[#E0E0E0] transition-colors text-xs shadow-sm"
        >
          Volver
        </button>
      </div>

      {/* Notificación Toast */}
      {toastMessage && <Toast message={toastMessage} onClose={handleCloseToast} />}
    </div>
  );
};