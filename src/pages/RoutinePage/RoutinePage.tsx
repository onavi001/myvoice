import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "../../slices/store";
import { RoutineExercise, updateExercise } from "../../slices/routine/routineSlice";
import { useNavigate } from "react-router-dom";

export const RoutinePage: React.FC = () => {
  const { routine } = useSelector((state: RootState) => state.routine);
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const handleBack = () => {
    navigate("/");
  };

  const handleInputChange = (
    dayIndex: number,
    exerciseIndex: number,
    field: keyof RoutineExercise,
    value: string | number
  ) => {
    dispatch(
      updateExercise({
        dayIndex,
        exerciseIndex,
        updatedExercise: { [field]: value },
      })
    );
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
              {day.exercises.map((exercise, exerciseIndex) => (
                <li key={exerciseIndex} className="bg-white p-4 rounded-lg shadow-md border-l-4 border-blue-500">
                  <p className="text-lg font-semibold">{exercise.name}</p>
                  <p className="text-gray-700">{exercise.muscle_group}</p>
                  <div className="mt-2 space-y-2">
                    <div>
                      <label className="text-gray-600">Series: </label>
                      <input
                        type="number"
                        value={exercise.sets}
                        onChange={(e) =>
                          handleInputChange(dayIndex, exerciseIndex, "sets", Number(e.target.value))
                        }
                        className="w-20 p-1 border rounded"
                      />
                    </div>
                    <div>
                      <label className="text-gray-600">Repeticiones: </label>
                      <input
                        type="number"
                        value={exercise.reps}
                        onChange={(e) =>
                          handleInputChange(dayIndex, exerciseIndex, "reps", Number(e.target.value))
                        }
                        className="w-20 p-1 border rounded"
                      />
                    </div>
                    <div>
                      <label className="text-gray-600">Peso: </label>
                      <input
                        type="text"
                        value={exercise.weight}
                        onChange={(e) =>
                          handleInputChange(dayIndex, exerciseIndex, "weight", e.target.value)
                        }
                        className="w-32 p-1 border rounded"
                      />
                    </div>
                    <div>
                      <label className="text-gray-600">Descanso: </label>
                      <input
                        type="text"
                        value={exercise.rest}
                        onChange={(e) =>
                          handleInputChange(dayIndex, exerciseIndex, "rest", e.target.value)
                        }
                        className="w-32 p-1 border rounded"
                      />
                    </div>
                    <div>
                      <label className="text-gray-600">Notas: </label>
                      <textarea
                        value={exercise.notes || ""}
                        onChange={(e) =>
                          handleInputChange(dayIndex, exerciseIndex, "notes", e.target.value)
                        }
                        className="w-full p-1 border rounded"
                        rows={2}
                      />
                    </div>
                  </div>
                </li>
              ))}
            </ul>
            {day.explanation && (
              <p className="mt-2 text-gray-600 italic">{day.explanation}</p>
            )}
          </div>
        ))}
        <button
          onClick={handleBack}
          className="mt-6 w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
        >
          Volver al formulario
        </button>
      </div>
    </div>
  );
};