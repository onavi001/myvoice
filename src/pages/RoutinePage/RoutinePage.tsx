import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "../../slices/store";
import { updateExercise, setExerciseVideo } from "../../slices/routine/routineSlice";
import { addProgress } from "../../slices/progress/progressSlice";
import { useNavigate } from "react-router-dom";

export const RoutinePage: React.FC = () => {
  const { routine } = useSelector((state: RootState) => state.routine);
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const [selectedDayIndex, setSelectedDayIndex] = useState(0);
  const [expandedExercises, setExpandedExercises] = useState<Record<number, boolean>>({});
  const [editData, setEditData] = useState<Record<string, any>>({});
  const [loadingVideos, setLoadingVideos] = useState<Record<number, boolean>>({});
  const [showDayDetails, setShowDayDetails] = useState(false);

  const YOUTUBE_API_KEY = import.meta.env.VITE_YOUTUBE_API_KEY || "TU_CLAVE_API_YOUTUBE";

  const handleBack = () => {
    navigate("/");
  };

  const handleProgress = () => {
    navigate("/progress");
  };

  const handleDayChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedDayIndex(Number(e.target.value));
    setExpandedExercises({});
    setLoadingVideos({});
    setShowDayDetails(false);
  };

  const toggleDayDetails = () => {
    setShowDayDetails((prev) => !prev);
  };

  const fetchExerciseVideo = async (exerciseName: string, dayIndex: number, exerciseIndex: number) => {
    setLoadingVideos((prev) => ({ ...prev, [exerciseIndex]: true }));
    try {
      const response = await fetch(
        `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(
          `${exerciseName} exercise technique muscles`
        )}&type=video&maxResults=1&key=${YOUTUBE_API_KEY}`
      );
      const data = await response.json();
      if (data.items && data.items.length > 0) {
        const videoId = data.items[0].id.videoId;
        const url = `https://www.youtube.com/embed/${videoId}`;
        dispatch(setExerciseVideo({ dayIndex, exerciseIndex, videoUrl: url }));
      }
    } catch (error) {
      console.error("Error fetching YouTube video:", error);
    } finally {
      setLoadingVideos((prev) => ({ ...prev, [exerciseIndex]: false }));
    }
  };

  const toggleExerciseExpand = (exerciseIndex: number, exerciseName: string) => {
    const isExpanding = !expandedExercises[exerciseIndex];
    setExpandedExercises((prev) => ({
      ...prev,
      [exerciseIndex]: isExpanding,
    }));

    const exercise = routine!.routine[selectedDayIndex].exercises[exerciseIndex];
    if (isExpanding && !exercise.videoUrl) {
      fetchExerciseVideo(exerciseName, selectedDayIndex, exerciseIndex);
    }
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
      dispatch(updateExercise({ dayIndex, exerciseIndex, updatedExercise }));

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
        <div className="p-4 max-w-md mx-auto">
          <h2 className="text-xl font-bold text-gray-800 mb-3">Tu Rutina</h2>
          <p className="text-gray-600 text-sm">No hay rutina generada. Genera una desde la página principal.</p>
          <button
            onClick={handleBack}
            className="mt-3 w-full bg-blue-500 text-white py-1 rounded hover:bg-blue-600 text-sm"
          >
            Volver
          </button>
        </div>
      </div>
    );
  }

  const selectedDay = routine.routine[selectedDayIndex];

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="p-4 max-w-md mx-auto">
        <h2 className="text-xl font-bold text-blue-900 mb-3">Tu Rutina</h2>

        <div className="mb-3">
          <select
            value={selectedDayIndex}
            onChange={handleDayChange}
            className="w-full p-1 border rounded bg-white text-sm"
          >
            {routine.routine.map((day, index) => (
              <option key={index} value={index}>
                {day.day}
              </option>
            ))}
          </select>
        </div>

        <div>
          <button
            onClick={toggleDayDetails}
            className="w-full flex justify-between items-center bg-blue-500 text-white p-2 rounded hover:bg-blue-600 text-sm mb-2"
          >
            <span>{selectedDay.day}</span>
            <span>{showDayDetails ? "▲" : "▼"}</span>
          </button>
          {showDayDetails && (
            <div className="mb-3 text-sm">
              <p className="text-gray-700 font-semibold">Músculos:</p>
              <p className="text-gray-600">{selectedDay.musclesWorked.join(", ")}</p>
              <p className="text-gray-700 font-semibold mt-1">Calentamiento:</p>
              <ul className="list-disc pl-4 text-gray-600">
                {selectedDay.warmUpOptions.map((option, index) => (
                  <li key={index} className="truncate">{option}</li>
                ))}
              </ul>
            </div>
          )}
          <ul className="space-y-2">
            {selectedDay.exercises.map((exercise, exerciseIndex) => {
              const key = `${selectedDayIndex}-${exerciseIndex}`;
              const edited = editData[key] || {};
              const currentExercise = { ...exercise, ...edited };
              const isExpanded = expandedExercises[exerciseIndex] || false;
              const isLoading = loadingVideos[exerciseIndex] || false;

              return (
                <li key={exerciseIndex} className="bg-white rounded-lg shadow-md border-l-4 border-blue-500">
                  <button
                    onClick={() => toggleExerciseExpand(exerciseIndex, exercise.name)}
                    className="w-full flex justify-between items-center p-2 text-left focus:outline-none"
                  >
                    <span className="text-base font-semibold truncate">{exercise.name}</span>
                    <span>{isExpanded ? "▲" : "▼"}</span>
                  </button>
                  {isExpanded && (
                    <div className="p-2 space-y-1 text-sm">
                      <p className="text-gray-700 truncate">{exercise.muscle_group}</p>
                      {currentExercise.tips && currentExercise.tips.length > 0 && (
                        <div>
                          <p className="text-gray-600 font-semibold">Consejos:</p>
                          <ul className="list-disc pl-4 text-gray-600">
                            {currentExercise.tips.map((tip:string, index: React.Key) => (
                              <li key={index} className="truncate">{tip}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                      {currentExercise.videoUrl ? (
                        <iframe
                          src={currentExercise.videoUrl}
                          title={`Demostración de ${exercise.name}`}
                          className="w-full h-32 rounded"
                          frameBorder="0"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                        />
                      ) : isLoading ? (
                        <p className="text-gray-500 italic">Buscando video...</p>
                      ) : (
                        <p className="text-gray-500 italic">Video no disponible</p>
                      )}
                      <div className="flex items-center space-x-1">
                        <label className="text-gray-600">Series:</label>
                        <input
                          type="number"
                          value={currentExercise.sets}
                          onChange={(e) =>
                            handleInputChange(selectedDayIndex, exerciseIndex, "sets", Number(e.target.value))
                          }
                          className="w-12 p-1 border rounded text-sm"
                        />
                      </div>
                      <div className="flex items-center space-x-1">
                        <label className="text-gray-600">Reps:</label>
                        <input
                          type="number"
                          value={currentExercise.reps}
                          onChange={(e) =>
                            handleInputChange(selectedDayIndex, exerciseIndex, "reps", Number(e.target.value))
                          }
                          className="w-12 p-1 border rounded text-sm"
                        />
                      </div>
                      <div className="flex items-center space-x-1">
                        <label className="text-gray-600">Peso:</label>
                        <input
                          type="text"
                          value={currentExercise.weight}
                          onChange={(e) =>
                            handleInputChange(selectedDayIndex, exerciseIndex, "weight", e.target.value)
                          }
                          className="w-20 p-1 border rounded text-sm"
                        />
                      </div>
                      <div className="flex flex-col">
                        <label className="text-gray-600">Notas:</label>
                        <textarea
                          value={currentExercise.notes || ""}
                          onChange={(e) =>
                            handleInputChange(selectedDayIndex, exerciseIndex, "notes", e.target.value)
                          }
                          className="w-full p-1 border rounded text-sm h-12 resize-none"
                        />
                      </div>
                      <button
                        onClick={() => handleSave(selectedDayIndex, exerciseIndex)}
                        className="mt-1 w-full bg-green-500 text-white py-1 rounded hover:bg-green-600 text-sm"
                      >
                        Guardar
                      </button>
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
          {selectedDay.explanation && (
            <p className="mt-2 text-gray-600 italic text-sm">{selectedDay.explanation}</p>
          )}
        </div>

        <div className="mt-4 flex space-x-2">
          <button
            onClick={handleBack}
            className="w-full bg-blue-500 text-white py-1 rounded hover:bg-blue-600 text-sm"
          >
            Volver
          </button>
          <button
            onClick={handleProgress}
            className="w-full bg-purple-500 text-white py-1 rounded hover:bg-purple-600 text-sm"
          >
            Progreso
          </button>
        </div>
      </div>
    </div>
  );
};