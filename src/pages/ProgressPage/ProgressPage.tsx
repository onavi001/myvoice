import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "../../slices/store";
import { addProgress, updateProgress, clearProgress, ProgressEntry } from "../../slices/progress/progressSlice";
import { useNavigate } from "react-router-dom";

export const ProgressPage: React.FC = () => {
  const { routines, selectedRoutineIndex } = useSelector((state: RootState) => state.routine);
  const { progress } = useSelector((state: RootState) => state.progress);
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    dayIndex: 0,
    exerciseIndex: 0,
    sets: "",
    reps: "",
    weight: "",
    notes: "",
  });

  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [editData, setEditData] = useState<Partial<ProgressEntry>>({});

  const handleBack = () => navigate("/routine");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEditData((prev) => ({
      ...prev,
      [name]: name === "sets" || name === "reps" ? Number(value) : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedRoutineIndex !== null) {
      dispatch(
        addProgress({
          routineIndex: selectedRoutineIndex,
          dayIndex: Number(formData.dayIndex),
          exerciseIndex: Number(formData.exerciseIndex),
          sets: Number(formData.sets),
          reps: Number(formData.reps),
          weight: formData.weight,
          notes: formData.notes,
          date: new Date().toISOString(),
        })
      );
      setFormData({ dayIndex: 0, exerciseIndex: 0, sets: "", reps: "", weight: "", notes: "" });
    }
  };

  const handleEdit = (index: number) => {
    setEditIndex(index);
    setEditData(progress[index]);
  };

  const handleSaveEdit = (index: number) => {
    dispatch(updateProgress({ index, updatedEntry: editData }));
    setEditIndex(null);
    setEditData({});
  };

  const handleClearProgress = () => {
    dispatch(clearProgress());
  };

  if (routines.length === 0) {
    return (
      <div className="min-h-screen bg-[#1A1A1A] text-white flex flex-col">
        <div className="p-4 max-w-md mx-auto flex-1">
          <h2 className="text-sm font-sans font-semibold text-white mb-3 truncate">Progreso</h2>
          <p className="text-[#B0B0B0] text-xs">No hay rutinas generadas. Genera una desde la página principal.</p>
          <button
            onClick={() => navigate("/")}
            className="mt-3 w-full bg-white text-black py-1 rounded hover:bg-[#E0E0E0] transition-colors text-xs shadow-sm"
          >
            Ir al formulario
          </button>
        </div>
      </div>
    );
  }

  if (selectedRoutineIndex === null || !routines[selectedRoutineIndex]) {
    return (
      <div className="min-h-screen bg-[#1A1A1A] text-white flex flex-col">
        <div className="p-4 max-w-md mx-auto flex-1">
          <h2 className="text-sm font-sans font-semibold text-white mb-3 truncate">Progreso</h2>
          <p className="text-[#B0B0B0] text-xs">Selecciona una rutina en la página de rutinas para ver el progreso.</p>
          <button
            onClick={handleBack}
            className="mt-3 w-full bg-white text-black py-1 rounded hover:bg-[#E0E0E0] transition-colors text-xs shadow-sm"
          >
            Volver a la rutina
          </button>
        </div>
      </div>
    );
  }

  const selectedRoutine = routines[selectedRoutineIndex];

  return (
    <div className="min-h-screen bg-[#1A1A1A] text-white flex flex-col">
      <style>
        {`
          .scrollbar-hidden::-webkit-scrollbar {
            display: none;
          }
          .scrollbar-hidden {
            -ms-overflow-style: none;
            scrollbar-width: none;
          }
        `}
      </style>
      <div className="p-4 max-w-md mx-auto flex-1">
        <h2 className="text-sm font-sans font-semibold text-white mb-4 truncate">Progreso Semanal - {selectedRoutine.name}</h2>

        <form onSubmit={handleSubmit} className="mb-4 p-2 bg-[#2D2D2D] rounded-lg shadow-sm space-y-2">
          <h3 className="text-sm font-sans font-semibold text-white mb-2 truncate">Registrar Progreso</h3>
          <div className="grid grid-cols-2 gap-1 text-xs">
            <div>
              <label className="text-[#B0B0B0]">Día:</label>
              <select
                name="dayIndex"
                value={formData.dayIndex}
                onChange={handleInputChange}
                className="w-full p-1 border border-[#4A4A4A] rounded bg-[#1A1A1A] text-white text-xs focus:outline-none focus:ring-1 focus:ring-[#34C759]"
              >
                {selectedRoutine.routine.map((day, index) => (
                  <option key={index} value={index} className="bg-[#1A1A1A] text-white">
                    {day.day}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-[#B0B0B0]">Ejercicio:</label>
              <select
                name="exerciseIndex"
                value={formData.exerciseIndex}
                onChange={handleInputChange}
                className="w-full p-1 border border-[#4A4A4A] rounded bg-[#1A1A1A] text-white text-xs focus:outline-none focus:ring-1 focus:ring-[#34C759]"
              >
                {selectedRoutine.routine[formData.dayIndex].exercises.map((exercise, index) => (
                  <option key={index} value={index} className="bg-[#1A1A1A] text-white">
                    {exercise.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-[#B0B0B0]">Series:</label>
              <input
                type="number"
                name="sets"
                value={formData.sets}
                onChange={handleInputChange}
                className="w-full p-1 border border-[#4A4A4A] rounded bg-[#1A1A1A] text-white text-xs focus:outline-none focus:ring-1 focus:ring-[#34C759]"
              />
            </div>
            <div>
              <label className="text-[#B0B0B0]">Repeticiones:</label>
              <input
                type="number"
                name="reps"
                value={formData.reps}
                onChange={handleInputChange}
                className="w-full p-1 border border-[#4A4A4A] rounded bg-[#1A1A1A] text-white text-xs focus:outline-none focus:ring-1 focus:ring-[#34C759]"
              />
            </div>
            <div>
              <label className="text-[#B0B0B0]">Peso:</label>
              <input
                type="text"
                name="weight"
                value={formData.weight}
                onChange={handleInputChange}
                className="w-full p-1 border border-[#4A4A4A] rounded bg-[#1A1A1A] text-white text-xs focus:outline-none focus:ring-1 focus:ring-[#34C759]"
              />
            </div>
            <div>
              <label className="text-[#B0B0B0]">Notas:</label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleInputChange}
                className="w-full p-1 border border-[#4A4A4A] rounded bg-[#1A1A1A] text-white text-xs h-8 resize-none focus:outline-none focus:ring-1 focus:ring-[#34C759]"
              />
            </div>
          </div>
          <button
            type="submit"
            className="mt-2 w-full bg-[#34C759] text-black py-1 rounded hover:bg-[#2DBF4E] transition-colors text-xs shadow-sm"
          >
            Registrar
          </button>
        </form>

        {progress.length > 0 && (
          <div className="mt-4">
            <h3 className="text-sm font-sans font-semibold text-white mb-2 truncate">Historial de Progreso</h3>
            <div className="overflow-x-auto scrollbar-hidden">
              <table className="w-full bg-[#2D2D2D] rounded-lg shadow-sm text-xs">
                <thead>
                  <tr className="bg-[#4A4A4A] text-[#B0B0B0]">
                    <th className="p-2">Rutina</th>
                    <th className="p-2">Fecha</th>
                    <th className="p-2">Día</th>
                    <th className="p-2">Ejercicio</th>
                    <th className="p-2">Series</th>
                    <th className="p-2">Reps</th>
                    <th className="p-2">Peso</th>
                    <th className="p-2">Notas</th>
                    <th className="p-2">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {progress.map((entry, index) => (
                    <tr key={index} className="border-t border-[#4A4A4A]">
                      <td className="p-2 text-[#FFFFFF] truncate">{routines[entry.routineIndex]?.name || "Rutina eliminada"}</td>
                      <td className="p-2 text-[#FFFFFF]">{new Date(entry.date).toLocaleDateString()}</td>
                      <td className="p-2 text-[#FFFFFF] truncate">{routines[entry.routineIndex]?.routine[entry.dayIndex]?.day || "-"}</td>
                      <td className="p-2 text-[#FFFFFF] truncate">{routines[entry.routineIndex]?.routine[entry.dayIndex]?.exercises[entry.exerciseIndex]?.name || "-"}</td>
                      {editIndex === index ? (
                        <>
                          <td className="p-2">
                            <input
                              type="number"
                              name="sets"
                              value={editData.sets !== undefined ? editData.sets : entry.sets}
                              onChange={handleEditInputChange}
                              className="w-12 p-1 border border-[#4A4A4A] rounded bg-[#1A1A1A] text-white text-xs focus:outline-none focus:ring-1 focus:ring-[#34C759]"
                            />
                          </td>
                          <td className="p-2">
                            <input
                              type="number"
                              name="reps"
                              value={editData.reps !== undefined ? editData.reps : entry.reps}
                              onChange={handleEditInputChange}
                              className="w-12 p-1 border border-[#4A4A4A] rounded bg-[#1A1A1A] text-white text-xs focus:outline-none focus:ring-1 focus:ring-[#34C759]"
                            />
                          </td>
                          <td className="p-2">
                            <input
                              type="text"
                              name="weight"
                              value={editData.weight !== undefined ? editData.weight : entry.weight}
                              onChange={handleEditInputChange}
                              className="w-16 p-1 border border-[#4A4A4A] rounded bg-[#1A1A1A] text-white text-xs focus:outline-none focus:ring-1 focus:ring-[#34C759]"
                            />
                          </td>
                          <td className="p-2">
                            <textarea
                              name="notes"
                              value={editData.notes !== undefined ? editData.notes : entry.notes || ""}
                              onChange={handleEditInputChange}
                              className="w-full p-1 border border-[#4A4A4A] rounded bg-[#1A1A1A] text-white text-xs h-8 resize-none focus:outline-none focus:ring-1 focus:ring-[#34C759]"
                            />
                          </td>
                          <td className="p-2">
                            <button
                              onClick={() => handleSaveEdit(index)}
                              className="bg-[#34C759] text-black p-1 rounded hover:bg-[#2DBF4E] transition-colors text-xs shadow-sm"
                            >
                              Guardar
                            </button>
                          </td>
                        </>
                      ) : (
                        <>
                          <td className="p-2 text-[#FFFFFF]">{entry.sets}</td>
                          <td className="p-2 text-[#FFFFFF]">{entry.reps}</td>
                          <td className="p-2 text-[#FFFFFF]">{entry.weight}</td>
                          <td className="p-2 text-[#FFFFFF] truncate">{entry.notes || "-"}</td>
                          <td className="p-2">
                            <button
                              onClick={() => handleEdit(index)}
                              className="bg-white text-black p-1 rounded hover:bg-[#E0E0E0] transition-colors text-xs shadow-sm"
                            >
                              Editar
                            </button>
                          </td>
                        </>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <button
              onClick={handleClearProgress}
              className="mt-2 w-full bg-white text-black py-1 rounded hover:bg-[#E0E0E0] transition-colors text-xs shadow-sm"
            >
              Limpiar Historial
            </button>
          </div>
        )}

        {/* Barra fija inferior */}
        <div className="fixed bottom-0 left-0 right-0 bg-[#1A1A1A] p-1 shadow-sm border-t border-[#4A4A4A]">
          <div className="max-w-md mx-auto flex space-x-2">
            <button
              onClick={handleBack}
              className="w-full bg-white text-black py-1 rounded hover:bg-[#E0E0E0] transition-colors text-xs shadow-sm"
            >
              Volver a la rutina
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};