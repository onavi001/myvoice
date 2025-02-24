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
      <div className="min-h-screen bg-gray-100">
        <div className="p-6 max-w-md mx-auto">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Progreso</h2>
          <p className="text-gray-600">No hay rutina generada. Por favor, genera una desde la página principal.</p>
          <button
            onClick={() => navigate("/")}
            className="mt-4 w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
          >
            Ir al formulario
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="p-6 max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Progreso Semanal</h2>

        {/* Formulario para agregar progreso */}
        <form onSubmit={handleSubmit} className="mb-6 p-4 bg-white rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-2">Registrar Nuevo Progreso</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700">Día:</label>
              <select
                name="dayIndex"
                value={formData.dayIndex}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
              >
                {routine.routine.map((day, index) => (
                  <option key={index} value={index}>
                    {day.day}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-gray-700">Ejercicio:</label>
              <select
                name="exerciseIndex"
                value={formData.exerciseIndex}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
              >
                {routine.routine[formData.dayIndex].exercises.map((exercise, index) => (
                  <option key={index} value={index}>
                    {exercise.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-gray-700">Series:</label>
              <input
                type="number"
                name="sets"
                value={formData.sets}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
              />
            </div>
            <div>
              <label className="block text-gray-700">Repeticiones:</label>
              <input
                type="number"
                name="reps"
                value={formData.reps}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
              />
            </div>
            <div>
              <label className="block text-gray-700">Peso:</label>
              <input
                type="text"
                name="weight"
                value={formData.weight}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-gray-700">Notas:</label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
                rows={2}
              />
            </div>
          </div>
          <button
            type="submit"
            className="mt-4 w-full bg-green-500 text-white p-2 rounded hover:bg-green-600"
          >
            Registrar Progreso
          </button>
        </form>

        {/* Tabla de progreso */}
        {progress.length > 0 && (
          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-2">Historial de Progreso</h3>
            <table className="w-full bg-white rounded-lg shadow-md">
              <thead>
                <tr className="bg-gray-200 text-gray-700">
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
                  <tr key={index} className="border-t">
                    <td className="p-2">{new Date(entry.date).toLocaleDateString()}</td>
                    <td className="p-2">{routine.routine[entry.dayIndex].day}</td>
                    <td className="p-2">{routine.routine[entry.dayIndex].exercises[entry.exerciseIndex].name}</td>
                    {editIndex === index ? (
                      <>
                        <td className="p-2">
                          <input
                            type="number"
                            name="sets"
                            value={editData.sets !== undefined ? editData.sets : entry.sets}
                            onChange={handleEditInputChange}
                            className="w-16 p-1 border rounded"
                          />
                        </td>
                        <td className="p-2">
                          <input
                            type="number"
                            name="reps"
                            value={editData.reps !== undefined ? editData.reps : entry.reps}
                            onChange={handleEditInputChange}
                            className="w-16 p-1 border rounded"
                          />
                        </td>
                        <td className="p-2">
                          <input
                            type="text"
                            name="weight"
                            value={editData.weight !== undefined ? editData.weight : entry.weight}
                            onChange={handleEditInputChange}
                            className="w-24 p-1 border rounded"
                          />
                        </td>
                        <td className="p-2">
                          <textarea
                            name="notes"
                            value={editData.notes !== undefined ? editData.notes : entry.notes || ""}
                            onChange={handleEditInputChange}
                            className="w-full p-1 border rounded"
                            rows={1}
                          />
                        </td>
                        <td className="p-2">
                          <button
                            onClick={() => handleSaveEdit(index)}
                            className="bg-green-500 text-white p-1 rounded hover:bg-green-600"
                          >
                            Guardar
                          </button>
                        </td>
                      </>
                    ) : (
                      <>
                        <td className="p-2">{entry.sets}</td>
                        <td className="p-2">{entry.reps}</td>
                        <td className="p-2">{entry.weight}</td>
                        <td className="p-2">{entry.notes || "-"}</td>
                        <td className="p-2">
                          <button
                            onClick={() => handleEdit(index)}
                            className="bg-yellow-500 text-white p-1 rounded hover:bg-yellow-600"
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
            <button
              onClick={handleClearProgress}
              className="mt-4 w-full bg-red-500 text-white p-2 rounded hover:bg-red-600"
            >
              Limpiar Historial
            </button>
          </div>
        )}

        <button
          onClick={handleBack}
          className="mt-6 w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
        >
          Volver a la rutina
        </button>
      </div>
    </div>
  );
};