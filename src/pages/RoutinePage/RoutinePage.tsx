import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "../../slices/store";
import { updateExercise } from "../../slices/routine/routineSlice";
import { addProgress } from "../../slices/progress/progressSlice"; // Importar addProgress
import { useNavigate } from "react-router-dom";

export const RoutinePage: React.FC = () => {
  const { routine } = useSelector((state: RootState) => state.routine);
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const [editData, setEditData] = useState<Record<string, any>>({});

  const handleBack = () => {
    navigate("/");
  };

  const handleProgress = () => {
    navigate("/progress");
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
        {routine.routine.map((day, dayIndex) => (
          <div key={dayIndex} className="mt-4">
            <h3 className="font-semibold text-lg text-gray-800">{day.day}</h3>
            <ul className="mt-2 space-y-4">
              {day.exercises.map((exercise, exerciseIndex) => {
                const key = `${dayIndex}-${exerciseIndex}`;
                const edited = editData[key] || {};
                const currentExercise = {
                  ...exercise,
                  ...edited,
                };

                return (
                  <li key={exerciseIndex} className="bg-white p-4 rounded-lg shadow-md border-l-4 border-blue-500">
                    <p className="text-lg font-semibold">{exercise.name}</p>
                    <p className="text-gray-700">{exercise.muscle_group}</p>
                    <div className="mt-2 space-y-2">
                      <div>
                        <label className="text-gray-600">Series: </label>
                        <input
                          type="number"
                          value={currentExercise.sets}
                          onChange={(e) =>
                            handleInputChange(dayIndex, exerciseIndex, "sets", Number(e.target.value))
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
                            handleInputChange(dayIndex, exerciseIndex, "reps", Number(e.target.value))
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
                            handleInputChange(dayIndex, exerciseIndex, "weight", e.target.value)
                          }
                          className="w-32 p-1 border rounded"
                        />
                      </div>
                      <div>
                        <label className="text-gray-600">Notas: </label>
                        <textarea
                          value={currentExercise.notes || ""}
                          onChange={(e) =>
                            handleInputChange(dayIndex, exerciseIndex, "notes", e.target.value)
                          }
                          className="w-full p-1 border rounded"
                          rows={2}
                        />
                      </div>
                    </div>
                    <button
                      onClick={() => handleSave(dayIndex, exerciseIndex)}
                      className="mt-2 bg-green-500 text-white p-1 rounded hover:bg-green-600"
                    >
                      Guardar cambios y registrar progreso
                    </button>
                  </li>
                );
              })}
            </ul>
            {day.explanation && (
              <p className="mt-2 text-gray-600 italic">{day.explanation}</p>
            )}
          </div>
        ))}
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