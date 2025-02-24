import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "../../slices/store";
import { updateExercise } from "../../slices/routine/routineSlice";
import { addProgress } from "../../slices/progress/progressSlice";
import { useNavigate } from "react-router-dom";

export const RoutinePage: React.FC = () => {
  const { routine } = useSelector((state: RootState) => state.routine);
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const [selectedDayIndex, setSelectedDayIndex] = useState(0); // Día seleccionado por defecto: 0
  const [expandedExercises, setExpandedExercises] = useState<Record<number, boolean>>({}); // Estado de expansión por ejercicio
  const [editData, setEditData] = useState<Record<string, any>>({});

  const handleBack = () => {
    navigate("/");
  };

  const handleProgress = () => {
    navigate("/progress");
  };

  const handleDayChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedDayIndex(Number(e.target.value));
    setExpandedExercises({}); // Reiniciar expansión al cambiar de día
  };

  const toggleExerciseExpand = (exerciseIndex: number) => {
    setExpandedExercises((prev) => ({
      ...prev,
      [exerciseIndex]: !prev[exerciseIndex],
    }));
  };

  const handleInputChange = (
    dayIndex: number,
    exerciseIndex: number,
    field: string,
    value: string | number
  ) => {
    const key = `${dayIndex}-${exerciseIndex}`;
    setEditData((prev) => ({
      ...prev,
      [key]: {
        ...(prev[key] || {}),
        [field]: value,
      },
    }));
  };

  const handleSave = (dayIndex: number, exerciseIndex: number) => {
    const key = `${dayIndex}-${exerciseIndex}`;
    const updatedExercise = editData[key];
    if (updatedExercise) {
      // Actualizar la rutina
      dispatch(updateExercise({ dayIndex, exerciseIndex, updatedExercise }));

      // Registrar progreso con los valores editados
      const currentExercise = routine!.routine[dayIndex].exercises[exerciseIndex];
      const progressData = {
        dayIndex,
        exerciseIndex,
        sets: Number(updatedExercise.sets || currentExercise.sets),
        reps: Number(updatedExercise.reps || currentExercise.reps),
        weight: updatedExercise.weight || currentExercise.weight,
        notes: updatedExercise.notes || currentExercise.notes || "",
      };
      dispatch(addProgress(progressData));

      // Limpiar el estado local después de guardar
      setEditData((prev) => {
        const newData = { ...prev };
        delete newData[key];
        return newData;
      });
    }
  };

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

        {/* Selector de días */}
        <div className="mb-4">
          <label className="block text-gray-700 font-semibold mb-1">Seleccionar Día:</label>
          <select
            value={selectedDayIndex}
            onChange={handleDayChange}
            className="w-full p-2 border rounded bg-white"
          >
            {routine.routine.map((day, index) => (
              <option key={index} value={index}>
                {day.day}
              </option>
            ))}
          </select>
        </div>

        {/* Día seleccionado con ejercicios colapsables */}
        <div className="mt-4">
          <h3 className="font-semibold text-lg text-gray-800 mb-2">
            {routine.routine[selectedDayIndex].day}
          </h3>
          <ul className="space-y-2">
            {routine.routine[selectedDayIndex].exercises.map((exercise, exerciseIndex) => {
              const key = `${selectedDayIndex}-${exerciseIndex}`;
              const edited = editData[key] || {};
              const currentExercise = {
                ...exercise,
                ...edited,
              };
              const isExpanded = expandedExercises[exerciseIndex] || false;

              return (
                <li key={exerciseIndex} className="bg-white rounded-lg shadow-md border-l-4 border-blue-500">
                  <button
                    onClick={() => toggleExerciseExpand(exerciseIndex)}
                    className="w-full flex justify-between items-center p-4 text-left focus:outline-none"
                  >
                    <span className="text-lg font-semibold">{exercise.name}</span>
                    <span>{isExpanded ? "▲" : "▼"}</span>
                  </button>
                  {isExpanded && (
                    <div className="p-4 pt-0 space-y-2">
                      <p className="text-gray-700">{exercise.muscle_group}</p>
                      <div>
                        <label className="text-gray-600">Series: </label>
                        <input
                          type="number"
                          value={currentExercise.sets}
                          onChange={(e) =>
                            handleInputChange(selectedDayIndex, exerciseIndex, "sets", Number(e.target.value))
                          }
                          className="w-16 p-1 border rounded"
                        />
                      </div>
                      <div>
                        <label className="text-gray-600">Repeticiones: </label>
                        <input
                          type="number"
                          value={currentExercise.reps}
                          onChange={(e) =>
                            handleInputChange(selectedDayIndex, exerciseIndex, "reps", Number(e.target.value))
                          }
                          className="w-16 p-1 border rounded"
                        />
                      </div>
                      <div>
                        <label className="text-gray-600">Peso: </label>
                        <input
                          type="text"
                          value={currentExercise.weight}
                          onChange={(e) =>
                            handleInputChange(selectedDayIndex, exerciseIndex, "weight", e.target.value)
                          }
                          className="w-32 p-1 border rounded"
                        />
                      </div>
                      <div>
                        <label className="text-gray-600">Notas: </label>
                        <textarea
                          value={currentExercise.notes || ""}
                          onChange={(e) =>
                            handleInputChange(selectedDayIndex, exerciseIndex, "notes", e.target.value)
                          }
                          className="w-full p-1 border rounded"
                          rows={2}
                        />
                      </div>
                      <button
                        onClick={() => handleSave(selectedDayIndex, exerciseIndex)}
                        className="mt-2 bg-green-500 text-white p-1 rounded hover:bg-green-600"
                      >
                        Guardar cambios y registrar progreso
                      </button>
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
          {routine.routine[selectedDayIndex].explanation && (
            <p className="mt-2 text-gray-600 italic">{routine.routine[selectedDayIndex].explanation}</p>
          )}
        </div>

        <div className="mt-6 flex space-x-4">
          <button
            onClick={handleBack}
            className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
          >
            Volver al formulario
          </button>
          <button
            onClick={handleProgress}
            className="w-full bg-purple-500 text-white p-2 rounded hover:bg-purple-600"
          >
            Ver Progreso
          </button>
        </div>
      </div>
    </div>
  );
};