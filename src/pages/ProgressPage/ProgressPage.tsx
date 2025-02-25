import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "../../slices/store";
import { addProgress, updateProgress, clearProgress, ProgressEntry } from "../../slices/progress/progressSlice";
import { useNavigate } from "react-router-dom";

export const ProgressPage: React.FC = () => {
  const { routine } = useSelector((state: RootState) => state.routine);
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

  const handleBack = () => {
    navigate("/routine");
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
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
    dispatch(
      addProgress({
        dayIndex: Number(formData.dayIndex),
        exerciseIndex: Number(formData.exerciseIndex),
        sets: Number(formData.sets),
        reps: Number(formData.reps),
        weight: formData.weight,
        notes: formData.notes,
      })
    );
    setFormData({ dayIndex: 0, exerciseIndex: 0, sets: "", reps: "", weight: "", notes: "" });
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

  if (!routine) {
    return (
      <div className="min-h-screen bg-black text-white">
        <div className="p-4 max-w-md mx-auto">
          <h2 className="text-xl font-sans font-semibold text-white mb-3">Progreso</h2>
          <p className="text-gray-300 text-sm">No hay rutina generada. Genera una desde la página principal.</p>
          <button
            onClick={() => navigate("/")}
            className="mt-3 w-full bg-white text-black py-1 rounded hover:bg-gray-200 transition-colors text-sm shadow-sm"
          >
            Ir al formulario
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="p-4 max-w-4xl mx-auto">
        <h2 className="text-xl font-sans font-semibold text-white mb-3">Progreso Semanal</h2>

        <form onSubmit={handleSubmit} className="mb-4 p-2 bg-gray-900 rounded-lg shadow-sm">
          <h3 className="text-lg font-sans font-semibold text-white mb-2">Registrar Progreso</h3>
          <div className="grid grid-cols-1 gap-2 text-sm">
            <div>
              <label className="text-gray-200">Día:</label>
              <select
                name="dayIndex"
                value={formData.dayIndex}
                onChange={handleInputChange}
                className="w-full p-1 border border-gray-700 rounded bg-black text-white focus:outline-none focus:ring-2 focus:ring-gray-500"
              >
                {routine.routine.map((day, index) => (
                  <option key={index} value={index} className="bg-black text-white">
                    {day.day}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-gray-200">Ejercicio:</label>
              <select
                name="exerciseIndex"
                value={formData.exerciseIndex}
                onChange={handleInputChange}
                className="w-full p-1 border border-gray-700 rounded bg-black text-white focus:outline-none focus:ring-2 focus:ring-gray-500"
              >
                {routine.routine[formData.dayIndex].exercises.map((exercise, index) => (
                  <option key={index} value={index} className="bg-black text-white">
                    {exercise.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-gray-200">Series:</label>
              <input
                type="number"
                name="sets"
                value={formData.sets}
                onChange={handleInputChange}
                className="w-full p-1 border border-gray-700 rounded bg-black text-white focus:outline-none focus:ring-2 focus:ring-gray-500"
              />
            </div>
            <div>
              <label className="text-gray-200">Repeticiones:</label>
              <input
                type="number"
                name="reps"
                value={formData.reps}
                onChange={handleInputChange}
                className="w-full p-1 border border-gray-700 rounded bg-black text-white focus:outline-none focus:ring-2 focus:ring-gray-500"
              />
            </div>
            <div>
              <label className="text-gray-200">Peso:</label>
              <input
                type="text"
                name="weight"
                value={formData.weight}
                onChange={handleInputChange}
                className="w-full p-1 border border-gray-700 rounded bg-black text-white focus:outline-none focus:ring-2 focus:ring-gray-500"
              />
            </div>
            <div>
              <label className="text-gray-200">Notas:</label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleInputChange}
                className="w-full p-1 border border-gray-700 rounded bg-black text-white h-12 resize-none focus:outline-none focus:ring-2 focus:ring-gray-500"
              />
            </div>
          </div>
          <button
            type="submit"
            className="mt-3 w-full bg-white text-black py-1 rounded hover:bg-gray-200 transition-colors text-sm shadow-sm"
          >
            Registrar
          </button>
        </form>

        {progress.length > 0 && (
          <div className="mt-4">
            <h3 className="text-lg font-sans font-semibold text-white mb-2">Historial de Progreso</h3>
            <div className="overflow-x-auto">
              <table className="w-full bg-gray-900 rounded-lg shadow-sm text-sm">
                <thead>
                  <tr className="bg-gray-800 text-gray-200">
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
                    <tr key={index} className="border-t border-gray-700">
                      <td className="p-2 text-gray-300">{new Date(entry.date).toLocaleDateString()}</td>
                      <td className="p-2 text-gray-300">{routine.routine[entry.dayIndex].day}</td>
                      <td className="p-2 text-gray-300">{routine.routine[entry.dayIndex].exercises[entry.exerciseIndex].name}</td>
                      {editIndex === index ? (
                        <>
                          <td className="p-2">
                            <input
                              type="number"
                              name="sets"
                              value={editData.sets !== undefined ? editData.sets : entry.sets}
                              onChange={handleEditInputChange}
                              className="w-12 p-1 border border-gray-700 rounded bg-black text-white text-sm focus:outline-none focus:ring-2 focus:ring-gray-500"
                            />
                          </td>
                          <td className="p-2">
                            <input
                              type="number"
                              name="reps"
                              value={editData.reps !== undefined ? editData.reps : entry.reps}
                              onChange={handleEditInputChange}
                              className="w-12 p-1 border border-gray-700 rounded bg-black text-white text-sm focus:outline-none focus:ring-2 focus:ring-gray-500"
                            />
                          </td>
                          <td className="p-2">
                            <input
                              type="text"
                              name="weight"
                              value={editData.weight !== undefined ? editData.weight : entry.weight}
                              onChange={handleEditInputChange}
                              className="w-16 p-1 border border-gray-700 rounded bg-black text-white text-sm focus:outline-none focus:ring-2 focus:ring-gray-500"
                            />
                          </td>
                          <td className="p-2">
                            <textarea
                              name="notes"
                              value={editData.notes !== undefined ? editData.notes : entry.notes || ""}
                              onChange={handleEditInputChange}
                              className="w-full p-1 border border-gray-700 rounded bg-black text-white text-sm h-10 resize-none focus:outline-none focus:ring-2 focus:ring-gray-500"
                            />
                          </td>
                          <td className="p-2">
                            <button
                              onClick={() => handleSaveEdit(index)}
                              className="bg-white text-black p-1 rounded hover:bg-gray-200 transition-colors text-sm shadow-sm"
                            >
                              Guardar
                            </button>
                          </td>
                        </>
                      ) : (
                        <>
                          <td className="p-2 text-gray-300">{entry.sets}</td>
                          <td className="p-2 text-gray-300">{entry.reps}</td>
                          <td className="p-2 text-gray-300">{entry.weight}</td>
                          <td className="p-2 text-gray-300">{entry.notes || "-"}</td>
                          <td className="p-2">
                            <button
                              onClick={() => handleEdit(index)}
                              className="bg-white text-black p-1 rounded hover:bg-gray-200 transition-colors text-sm shadow-sm"
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
              className="mt-3 w-full bg-gray-700 text-white py-1 rounded hover:bg-gray-600 transition-colors text-sm shadow-sm"
            >
              Limpiar Historial
            </button>
          </div>
        )}

        <button
          onClick={handleBack}
          className="mt-4 w-full bg-white text-black py-1 rounded hover:bg-gray-200 transition-colors text-sm shadow-sm"
        >
          Volver a la rutina
        </button>
      </div>
    </div>
  );
};