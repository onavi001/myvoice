import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "../../slices/store";
import { updateExercise, setExerciseVideo, selectRoutine, deleteRoutine } from "../../slices/routine/routineSlice";
import { addProgress } from "../../slices/progress/progressSlice";
import { useNavigate } from "react-router-dom";
import Loader from "../../components/Loader";
import Toast from "../../components/Toast"; // Importa el componente Toast

export const RoutinePage: React.FC = () => {
  const { routines, selectedRoutineIndex } = useSelector((state: RootState) => state.routine);
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const [selectedDayIndex, setSelectedDayIndex] = useState(0);
  const [expandedExercises, setExpandedExercises] = useState<Record<number, boolean>>({});
  const [editData, setEditData] = useState<Record<string, any>>({});
  const [loadingVideos, setLoadingVideos] = useState<Record<number, boolean>>({});
  const [toastMessage, setToastMessage] = useState<string | null>(null); // Estado para la notificación

  const YOUTUBE_API_KEY = import.meta.env.VITE_YOUTUBE_API_KEY || "TU_CLAVE_API_YOUTUBE";

  const handleBack = () => navigate("/");
  const handleProgress = () => navigate("/progress");
  const handleAddRoutine = () => navigate("/add-routine");
  const handleEditRoutine = () => {
    if (selectedRoutineIndex !== null) {
      navigate(`${selectedRoutineIndex}`);
    }
  };
  const handleDeleteRoutine = () => {
    if (selectedRoutineIndex !== null) {
      dispatch(deleteRoutine(selectedRoutineIndex));
    }
  };

  const fetchExerciseVideo = async (exerciseName: string, routineIndex: number, dayIndex: number, exerciseIndex: number) => {
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
        dispatch(setExerciseVideo({ routineIndex, dayIndex, exerciseIndex, videoUrl: url }));
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

    if (selectedRoutineIndex !== null) {
      const exercise = routines[selectedRoutineIndex].routine[selectedDayIndex].exercises[exerciseIndex];
      if (isExpanding && !exercise.videoUrl) {
        fetchExerciseVideo(exerciseName, selectedRoutineIndex, selectedDayIndex, exerciseIndex);
      }
    }
  };

  const handleInputChange = (
    dayIndex: number,
    exerciseIndex: number,
    field: string,
    value: string | number
  ) => {
    if (selectedRoutineIndex !== null) {
      const key = `${dayIndex}-${exerciseIndex}`;
      setEditData((prev) => ({
        ...prev,
        [key]: { ...prev[key] || {}, [field]: value },
      }));
    }
  };

  const handleSave = (dayIndex: number, exerciseIndex: number) => {
    if (selectedRoutineIndex !== null) {
      const key = `${dayIndex}-${exerciseIndex}`;
      const updatedExercise = editData[key];
      if (updatedExercise) {
        dispatch(updateExercise({ routineIndex: selectedRoutineIndex, dayIndex, exerciseIndex, updatedExercise }));
        const currentExercise = routines[selectedRoutineIndex].routine[dayIndex].exercises[exerciseIndex];
        const progressData = {
          routineIndex: selectedRoutineIndex,
          dayIndex,
          exerciseIndex,
          sets: Number(updatedExercise.sets || currentExercise.sets),
          reps: Number(updatedExercise.reps || currentExercise.reps),
          weight: updatedExercise.weight || currentExercise.weight,
          notes: updatedExercise.notes || currentExercise.notes || "",
          date: new Date().toISOString(),
        };
        dispatch(addProgress(progressData));
        setToastMessage("Progreso guardado correctamente"); // Mostrar notificación
        setEditData((prev) => {
          const newData = { ...prev };
          delete newData[key];
          return newData;
        });
      }
    }
  };

  const handleCloseToast = () => {
    setToastMessage(null);
  };

  if (routines.length === 0) {
    return (
      <div className="min-h-screen bg-[#1A1A1A] text-white">
        <div className="p-4 max-w-md mx-auto">
          <h2 className="text-sm font-sans font-semibold text-white mb-3 truncate">Tu Rutina</h2>
          <p className="text-[#B0B0B0] text-xs">No hay rutinas generadas. Genera una desde la página principal.</p>
          <button
            onClick={handleAddRoutine}
            className="mt-3 w-full bg-[#34C759] text-black py-1 rounded hover:bg-[#2DBF4E] transition-colors text-xs shadow-sm"
          >
            Agregar Rutina Manual
          </button>
          <button
            onClick={handleBack}
            className="mt-3 w-full bg-white text-black py-1 rounded hover:bg-[#E0E0E0] transition-colors text-xs shadow-sm"
          >
            Volver
          </button>
        </div>
      </div>
    );
  }

  if (selectedRoutineIndex === null || !routines[selectedRoutineIndex]) {
    return (
      <div className="min-h-screen bg-[#1A1A1A] text-white">
        <div className="p-4 max-w-md mx-auto">
          <h2 className="text-sm font-sans font-semibold text-white mb-3 truncate">Tu Rutina</h2>
          <p className="text-[#B0B0B0] text-xs">Selecciona una rutina para ver los detalles.</p>
          <button
            onClick={handleAddRoutine}
            className="mt-3 w-full bg-[#34C759] text-black py-1 rounded hover:bg-[#2DBF4E] transition-colors text-xs shadow-sm"
          >
            Agregar Rutina Manual
          </button>
          <button
            onClick={handleBack}
            className="mt-3 w-full bg-white text-black py-1 rounded hover:bg-[#E0E0E0] transition-colors text-xs shadow-sm"
          >
            Volver
          </button>
        </div>
      </div>
    );
  }

  const selectedRoutine = routines[selectedRoutineIndex];
  const selectedDay = selectedRoutine.routine[selectedDayIndex];

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
      <div className="p-4 max-w-full mx-auto flex-1">
        {/* Selector de rutinas */}
        <div className="flex overflow-x-auto space-x-2 mb-4 scrollbar-hidden">
          {routines.map((routine, index) => (
            <button
              key={index}
              onClick={() => {
                dispatch(selectRoutine(index));
                setSelectedDayIndex(0);
                setExpandedExercises({});
              }}
              className={`px-2 py-1 rounded-full text-xs font-sans font-medium transition-colors shadow-sm truncate max-w-[120px] ${
                selectedRoutineIndex === index
                  ? "bg-white text-black"
                  : "bg-[#2D2D2D] text-[#B0B0B0] hover:bg-[#4A4A4A]"
              }`}
            >
              {routine.name}
            </button>
          ))}
        </div>

        {/* Tabs de días */}
        <div className="flex overflow-x-auto space-x-2 mb-4 scrollbar-hidden">
          {selectedRoutine.routine.map((day, index) => (
            <button
              key={index}
              onClick={() => setSelectedDayIndex(index)}
              className={`px-2 py-1 rounded-full text-xs font-sans font-medium transition-colors shadow-sm truncate max-w-[120px] ${
                selectedDayIndex === index
                  ? "bg-white text-black"
                  : "bg-[#2D2D2D] text-[#B0B0B0] hover:bg-[#4A4A4A]"
              }`}
            >
              {day.day}
            </button>
          ))}
        </div>

        {/* Detalles del día */}
        <div className="bg-[#2D2D2D] p-2 rounded-lg shadow-sm mb-4 max-h-24 overflow-y-auto scrollbar-hidden">
          <div className="flex flex-col space-y-1">
            <div className="flex items-center">
              <span className="text-[#B0B0B0] font-semibold text-xs min-w-[100px]">🏋️ Músculos:</span>
              <span className="text-[#FFFFFF] text-xs flex-1">{selectedDay.musclesWorked.join(", ")}</span>
            </div>
            <div className="flex items-center">
              <span className="text-[#B0B0B0] font-semibold text-xs min-w-[100px]">🔥 Calentamiento:</span>
              <span className="text-[#FFFFFF] text-xs flex-1">{selectedDay.warmUpOptions.join(", ")}</span>
            </div>
          </div>
        </div>

        {/* Lista de ejercicios */}
        <ul className="space-y-2">
          {selectedDay.exercises.map((exercise, exerciseIndex) => {
            const key = `${selectedDayIndex}-${exerciseIndex}`;
            const edited = editData[key] || {};
            const currentExercise = { ...exercise, ...edited };
            const isExpanded = expandedExercises[exerciseIndex] || false;
            const isLoading = loadingVideos[exerciseIndex] || false;

            return (
              <li
                key={exerciseIndex}
                className="bg-[#2D2D2D] rounded-lg shadow-sm overflow-hidden"
              >
                <button
                  onClick={() => toggleExerciseExpand(exerciseIndex, exercise.name)}
                  className="w-full flex justify-between items-center p-2 text-left hover:bg-[#4A4A4A] transition-colors"
                >
                  <span className="text-sm font-sans font-semibold text-white truncate">
                    {exercise.name}
                  </span>
                  <span className="text-[#B0B0B0] text-xs">{isExpanded ? "▲" : "▼"}</span>
                </button>
                {isExpanded && (
                  <div className="p-2 bg-[#4A4A4A] text-xs space-y-2">
                    <div className="grid grid-cols-2 gap-1">
                      <div>
                        <span className="text-[#B0B0B0] font-semibold">Músculo:</span>
                        <p className="text-[#FFFFFF]">{currentExercise.muscle_group}</p>
                      </div>
                      {currentExercise.tips && currentExercise.tips.length > 0 && (
                        <div>
                          <span className="text-[#B0B0B0] font-semibold">Consejos:</span>
                          <ul className="list-disc pl-3 text-[#FFFFFF] max-w-full">
                            {currentExercise.tips.map((tip: string, index: number) => (
                              <li key={index}>{tip}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                    {currentExercise.videoUrl ? (
                      <iframe
                        src={currentExercise.videoUrl}
                        title={`Demostración de ${exercise.name}`}
                        className="w-full h-32 rounded border border-[#4A4A4A]"
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    ) : isLoading ? (
                      <div className="text-center">
                        <Loader />
                        <p className="text-[#B0B0B0] italic">Cargando video...</p>
                      </div>
                    ) : (
                      <p className="text-[#B0B0B0] italic text-center">Video no disponible</p>
                    )}
                    <div className="grid grid-cols-2 gap-1">
                      <div>
                        <label className="text-[#B0B0B0]">Series:</label>
                        <input
                          type="number"
                          value={currentExercise.sets}
                          onChange={(e) =>
                            handleInputChange(selectedDayIndex, exerciseIndex, "sets", Number(e.target.value))
                          }
                          className="w-full p-1 border border-[#4A4A4A] rounded bg-[#1A1A1A] text-white text-xs focus:outline-none focus:ring-1 focus:ring-[#34C759]"
                        />
                      </div>
                      <div>
                        <label className="text-[#B0B0B0]">Reps:</label>
                        <input
                          type="number"
                          value={currentExercise.reps}
                          onChange={(e) =>
                            handleInputChange(selectedDayIndex, exerciseIndex, "reps", Number(e.target.value))
                          }
                          className="w-full p-1 border border-[#4A4A4A] rounded bg-[#1A1A1A] text-white text-xs focus:outline-none focus:ring-1 focus:ring-[#34C759]"
                        />
                      </div>
                      <div>
                        <label className="text-[#B0B0B0]">Peso:</label>
                        <input
                          type="text"
                          value={currentExercise.weight}
                          onChange={(e) =>
                            handleInputChange(selectedDayIndex, exerciseIndex, "weight", e.target.value)
                          }
                          className="w-full p-1 border border-[#4A4A4A] rounded bg-[#1A1A1A] text-white text-xs focus:outline-none focus:ring-1 focus:ring-[#34C759]"
                        />
                      </div>
                      <div>
                        <label className="text-[#B0B0B0]">Notas:</label>
                        <textarea
                          value={currentExercise.notes || ""}
                          onChange={(e) =>
                            handleInputChange(selectedDayIndex, exerciseIndex, "notes", e.target.value)
                          }
                          className="w-full p-1 border border-[#4A4A4A] rounded bg-[#1A1A1A] text-white text-xs h-8 resize-none focus:outline-none focus:ring-1 focus:ring-[#34C759]"
                        />
                      </div>
                    </div>
                    <button
                      onClick={() => handleSave(selectedDayIndex, exerciseIndex)}
                      className="w-full bg-[#34C759] text-black py-1 rounded hover:bg-[#2DBF4E] transition-colors text-xs shadow-sm"
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
          <p className="mt-3 text-[#B0B0B0] italic text-xs font-sans bg-[#2D2D2D] p-2 rounded shadow-sm">
            {selectedDay.explanation}
          </p>
        )}
      </div>

      {/* Barra fija inferior */}
      <div className="fixed bottom-0 left-0 right-0 bg-[#1A1A1A] p-1 shadow-sm border-t border-[#4A4A4A]">
        <div className="max-w-md mx-auto flex space-x-2">
          <button
            onClick={handleBack}
            className="w-full bg-white text-black py-1 rounded hover:bg-[#E0E0E0] transition-colors text-xs shadow-sm"
          >
            Volver
          </button>
          <button
            onClick={handleEditRoutine}
            className="w-full bg-[#34C759] text-black py-1 rounded hover:bg-[#2DBF4E] transition-colors text-xs shadow-sm"
            disabled={selectedRoutineIndex === null}
          >
            Editar Rutina
          </button>
          <button
            onClick={handleDeleteRoutine}
            className="w-full bg-red-600 text-white py-1 rounded hover:bg-red-700 transition-colors text-xs shadow-sm"
            disabled={selectedRoutineIndex === null}
          >
            Eliminar Rutina
          </button>
          <button
            onClick={handleProgress}
            className="w-full bg-white text-black py-1 rounded hover:bg-[#E0E0E0] transition-colors text-xs shadow-sm"
          >
            Progreso
          </button>
        </div>
      </div>

      {/* Notificación Toast */}
      {toastMessage && <Toast message={toastMessage} onClose={handleCloseToast} />}
    </div>
  );
};