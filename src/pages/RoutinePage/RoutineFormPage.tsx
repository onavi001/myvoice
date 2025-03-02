import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addRoutine, editRoutine } from "../../slices/routine/routineSlice";
import { useNavigate, useParams } from "react-router-dom";
import { RootState, AppDispatch } from "../../slices/store";

interface ExerciseForm {
  name: string;
  muscle_group: string;
  sets: number;
  reps: number;
  weight: string;
  rest: string;
  tips: string[];
}

interface DayForm {
  day: string;
  exercises: ExerciseForm[];
  musclesWorked: string[];
  warmUpOptions: string[];
  explanation: string;
}

interface RoutineForm {
  name: string;
  days: DayForm[];
}

export const RoutineFormPage: React.FC = () => {
  const { routines } = useSelector((state: RootState) => state.routine);
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { routineIndex } = useParams<{ routineIndex: string }>();

  const isEditMode = !!routineIndex;
  const index = Number(routineIndex);

  const [formData, setFormData] = useState<RoutineForm>({
    name: "",
    days: [{ day: "", exercises: [], musclesWorked: [], warmUpOptions: [], explanation: "" }],
  });
  const [expandedDay, setExpandedDay] = useState<number | null>(isEditMode ? 0 : null);
  const [expandedExercises, setExpandedExercises] = useState<Record<number, number[]>>({});

  useEffect(() => {
    if (isEditMode && routines[index]) {
      const routine = routines[index];
      setFormData({
        name: routine.name,
        days: routine.routine.map((day) => ({
          day: day.day,
          exercises: day.exercises.map((ex) => ({
            name: ex.name,
            muscle_group: ex.muscle_group,
            sets: ex.sets,
            reps: ex.reps,
            weight: ex.weight,
            rest: ex.rest,
            tips: ex.tips || ["", ""],
          })),
          musclesWorked: day.musclesWorked,
          warmUpOptions: day.warmUpOptions,
          explanation: day.explanation || "",
        })),
      });
    }
  }, [isEditMode, index, routines]);

  const handleRoutineChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleDayChange = (dayIndex: number, field: string, value: string | string[]) => {
    const updatedDays = [...formData.days];
    updatedDays[dayIndex] = { ...updatedDays[dayIndex], [field]: value };
    setFormData({ ...formData, days: updatedDays });
  };

  const handleExerciseChange = (
    dayIndex: number,
    exerciseIndex: number,
    field: string,
    value: string | number | string[]
  ) => {
    const updatedDays = [...formData.days];
    const updatedExercises = [...updatedDays[dayIndex].exercises];
    updatedExercises[exerciseIndex] = { ...updatedExercises[exerciseIndex], [field]: value };
    updatedDays[dayIndex].exercises = updatedExercises;
    setFormData({ ...formData, days: updatedDays });
  };

  const addDay = () => {
    setFormData({
      ...formData,
      days: [...formData.days, { day: "", exercises: [], musclesWorked: [], warmUpOptions: [], explanation: "" }],
    });
    setExpandedDay(formData.days.length);
  };

  const deleteDay = (dayIndex: number) => {
    if (formData.days.length <= 1) return;
    const updatedDays = formData.days.filter((_, idx) => idx !== dayIndex);
    setFormData({ ...formData, days: updatedDays });
    setExpandedDay((prev) => (prev === dayIndex ? null : prev && prev > dayIndex ? prev - 1 : prev));
    setExpandedExercises((prev) => {
      const newExpanded = { ...prev };
      delete newExpanded[dayIndex];
      return Object.keys(newExpanded).reduce((acc: Record<number, number[]>, key) => {
        const newKey = Number(key) > dayIndex ? Number(key) - 1 : Number(key);
        acc[newKey] = newExpanded[Number(key)];
        return acc;
      }, {} as Record<number, number[]>);
    });
  };

  const addExercise = (dayIndex: number) => {
    const updatedDays = [...formData.days];
    updatedDays[dayIndex].exercises.push({
      name: "",
      muscle_group: "",
      sets: 0,
      reps: 0,
      weight: "",
      rest: "",
      tips: ["", ""],
    });
    setFormData({ ...formData, days: updatedDays });
    setExpandedExercises((prev) => ({
      ...prev,
      [dayIndex]: [...(prev[dayIndex] || []), updatedDays[dayIndex].exercises.length - 1],
    }));
  };

  const deleteExercise = (dayIndex: number, exerciseIndex: number) => {
    const updatedDays = [...formData.days];
    updatedDays[dayIndex].exercises = updatedDays[dayIndex].exercises.filter((_, idx) => idx !== exerciseIndex);
    setFormData({ ...formData, days: updatedDays });
    setExpandedExercises((prev) => ({
      ...prev,
      [dayIndex]: (prev[dayIndex] || []).filter((idx) => idx !== exerciseIndex).map(idx => idx > exerciseIndex ? idx - 1 : idx),
    }));
  };

  const toggleDay = (dayIndex: number) => {
    setExpandedDay((prev) => (prev === dayIndex ? null : dayIndex));
  };

  const toggleExercise = (dayIndex: number, exerciseIndex: number) => {
    setExpandedExercises((prev) => {
      const dayExercises = prev[dayIndex] || [];
      if (dayExercises.includes(exerciseIndex)) {
        return { ...prev, [dayIndex]: dayExercises.filter((idx) => idx !== exerciseIndex) };
      } else {
        return { ...prev, [dayIndex]: [...dayExercises, exerciseIndex] };
      }
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const routine = {
      name: formData.name,
      routine: formData.days.map((day) => ({
        day: day.day,
        exercises: day.exercises.map((ex) => ({
          name: ex.name,
          muscle_group: ex.muscle_group,
          sets: ex.sets,
          reps: ex.reps,
          weight: ex.weight,
          rest: ex.rest,
          tips: ex.tips.filter((tip) => tip.trim() !== ""),
        })),
        musclesWorked: day.musclesWorked.filter((m) => m.trim() !== ""),
        warmUpOptions: day.warmUpOptions.filter((w) => w.trim() !== ""),
        explanation: day.explanation,
      })),
    };

    if (isEditMode) {
      dispatch(editRoutine({ routineIndex: index, updatedRoutine: routine }));
    } else {
      dispatch(addRoutine(routine));
    }
    navigate("/routine");
  };

  return (
    <div className="min-h-screen bg-[#1A1A1A] text-white flex flex-col">
      <div className="p-4 max-w-md mx-auto flex-1 overflow-y-auto">
        <h2 className="text-sm font-sans font-semibold text-white mb-4 truncate">
          {isEditMode ? "Editar Rutina" : "Agregar Rutina Manual"}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-2">
          <input
            name="name"
            placeholder="Nombre de la rutina"
            value={formData.name}
            onChange={handleRoutineChange}
            className="w-full p-2 border border-[#4A4A4A] rounded bg-[#1A1A1A] text-white text-xs placeholder-[#B0B0B0] focus:outline-none focus:ring-1 focus:ring-[#34C759]"
          />
          {formData.days.map((day, dayIndex) => {
            const isExpanded = expandedDay === dayIndex;
            return (
              <div
                key={dayIndex}
                className={`rounded-lg shadow-sm ${dayIndex % 2 === 0 ? "bg-[#2D2D2D]" : "bg-[#3A3A3A]"}`}
              >
                <button
                  type="button"
                  onClick={() => toggleDay(dayIndex)}
                  className="w-full flex justify-between items-center p-2 text-left hover:bg-[#4A4A4A] transition-colors"
                >
                  <span className="text-xs font-semibold text-white truncate">
                    {day.day || `Día ${dayIndex + 1}`}
                  </span>
                  <span className="text-[#B0B0B0] text-xs">{isExpanded ? "▲" : "▼"}</span>
                </button>
                {isExpanded && (
                  <div className="p-2 space-y-2">
                    <input
                      placeholder="Nombre del día"
                      value={day.day}
                      onChange={(e) => handleDayChange(dayIndex, "day", e.target.value)}
                      className="w-full p-1 border border-[#4A4A4A] rounded bg-[#1A1A1A] text-white text-xs placeholder-[#B0B0B0] focus:outline-none focus:ring-1 focus:ring-[#34C759]"
                    />
                    {day.exercises.map((exercise, exerciseIndex) => {
                      const isExerciseExpanded = expandedExercises[dayIndex]?.includes(exerciseIndex);
                      return (
                        <div
                          key={exerciseIndex}
                          className={`rounded-lg ${exerciseIndex % 2 === 0 ? "bg-[#4A4A4A]" : "bg-[#5A5A5A]"}`}
                        >
                          <button
                            type="button"
                            onClick={() => toggleExercise(dayIndex, exerciseIndex)}
                            className="w-full flex justify-between items-center p-2 text-left hover:bg-[#6A6A6A] transition-colors"
                          >
                            <span className="text-xs font-semibold text-white truncate">
                              {exercise.name || `Ejercicio ${exerciseIndex + 1}`}
                            </span>
                            <span className="text-[#B0B0B0] text-xs">{isExerciseExpanded ? "▲" : "▼"}</span>
                          </button>
                          {isExerciseExpanded && (
                            <div className="p-2 space-y-1">
                              <input
                                placeholder="Nombre del ejercicio"
                                value={exercise.name}
                                onChange={(e) => handleExerciseChange(dayIndex, exerciseIndex, "name", e.target.value)}
                                className="w-full p-1 border border-[#4A4A4A] rounded bg-[#1A1A1A] text-white text-xs placeholder-[#B0B0B0] focus:outline-none focus:ring-1 focus:ring-[#34C759]"
                              />
                              <input
                                placeholder="Grupo muscular"
                                value={exercise.muscle_group}
                                onChange={(e) => handleExerciseChange(dayIndex, exerciseIndex, "muscle_group", e.target.value)}
                                className="w-full p-1 border border-[#4A4A4A] rounded bg-[#1A1A1A] text-white text-xs placeholder-[#B0B0B0] focus:outline-none focus:ring-1 focus:ring-[#34C759]"
                              />
                              <input
                                type="number"
                                placeholder="Series"
                                value={exercise.sets || ""}
                                onChange={(e) => handleExerciseChange(dayIndex, exerciseIndex, "sets", Number(e.target.value))}
                                className="w-full p-1 border border-[#4A4A4A] rounded bg-[#1A1A1A] text-white text-xs placeholder-[#B0B0B0] focus:outline-none focus:ring-1 focus:ring-[#34C759]"
                              />
                              <input
                                type="number"
                                placeholder="Repeticiones"
                                value={exercise.reps || ""}
                                onChange={(e) => handleExerciseChange(dayIndex, exerciseIndex, "reps", Number(e.target.value))}
                                className="w-full p-1 border border-[#4A4A4A] rounded bg-[#1A1A1A] text-white text-xs placeholder-[#B0B0B0] focus:outline-none focus:ring-1 focus:ring-[#34C759]"
                              />
                              <input
                                placeholder="Peso (ej. 10-15kg)"
                                value={exercise.weight}
                                onChange={(e) => handleExerciseChange(dayIndex, exerciseIndex, "weight", e.target.value)}
                                className="w-full p-1 border border-[#4A4A4A] rounded bg-[#1A1A1A] text-white text-xs placeholder-[#B0B0B0] focus:outline-none focus:ring-1 focus:ring-[#34C759]"
                              />
                              <input
                                placeholder="Descanso (ej. 60s)"
                                value={exercise.rest}
                                onChange={(e) => handleExerciseChange(dayIndex, exerciseIndex, "rest", e.target.value)}
                                className="w-full p-1 border border-[#4A4A4A] rounded bg-[#1A1A1A] text-white text-xs placeholder-[#B0B0B0] focus:outline-none focus:ring-1 focus:ring-[#34C759]"
                              />
                              <input
                                placeholder="Consejo 1"
                                value={exercise.tips[0] || ""}
                                onChange={(e) => {
                                  const updatedTips = [...exercise.tips];
                                  updatedTips[0] = e.target.value;
                                  handleExerciseChange(dayIndex, exerciseIndex, "tips", updatedTips);
                                }}
                                className="w-full p-1 border border-[#4A4A4A] rounded bg-[#1A1A1A] text-white text-xs placeholder-[#B0B0B0] focus:outline-none focus:ring-1 focus:ring-[#34C759]"
                              />
                              <input
                                placeholder="Consejo 2"
                                value={exercise.tips[1] || ""}
                                onChange={(e) => {
                                  const updatedTips = [...exercise.tips];
                                  updatedTips[1] = e.target.value;
                                  handleExerciseChange(dayIndex, exerciseIndex, "tips", updatedTips);
                                }}
                                className="w-full p-1 border border-[#4A4A4A] rounded bg-[#1A1A1A] text-white text-xs placeholder-[#B0B0B0] focus:outline-none focus:ring-1 focus:ring-[#34C759]"
                              />
                              <button
                                type="button"
                                onClick={() => deleteExercise(dayIndex, exerciseIndex)}
                                className="w-full bg-red-600 text-white py-1 rounded hover:bg-red-700 transition-colors text-xs mt-2"
                              >
                                Eliminar Ejercicio
                              </button>
                            </div>
                          )}
                        </div>
                      );
                    })}
                    <button
                      type="button"
                      onClick={() => addExercise(dayIndex)}
                      className="w-full bg-[#34C759] text-black py-1 rounded hover:bg-[#2DBF4E] transition-colors text-xs shadow-sm mt-2"
                    >
                      Agregar Ejercicio
                    </button>
                    <input
                      placeholder="Músculos trabajados (separados por coma)"
                      value={day.musclesWorked.join(", ")}
                      onChange={(e) => handleDayChange(dayIndex, "musclesWorked", e.target.value.split(", "))}
                      className="w-full p-1 border border-[#4A4A4A] rounded bg-[#1A1A1A] text-white text-xs placeholder-[#B0B0B0] focus:outline-none focus:ring-1 focus:ring-[#34C759] mt-2"
                    />
                    <input
                      placeholder="Calentamientos (separados por coma)"
                      value={day.warmUpOptions.join(", ")}
                      onChange={(e) => handleDayChange(dayIndex, "warmUpOptions", e.target.value.split(", "))}
                      className="w-full p-1 border border-[#4A4A4A] rounded bg-[#1A1A1A] text-white text-xs placeholder-[#B0B0B0] focus:outline-none focus:ring-1 focus:ring-[#34C759]"
                    />
                    <textarea
                      placeholder="Explicación"
                      value={day.explanation}
                      onChange={(e) => handleDayChange(dayIndex, "explanation", e.target.value)}
                      className="w-full p-1 border border-[#4A4A4A] rounded bg-[#1A1A1A] text-white text-xs h-12 resize-none placeholder-[#B0B0B0] focus:outline-none focus:ring-1 focus:ring-[#34C759]"
                    />
                    <button
                      type="button"
                      onClick={() => deleteDay(dayIndex)}
                      disabled={formData.days.length <= 1}
                      className="w-full bg-red-600 text-white py-1 rounded hover:bg-red-700 transition-colors text-xs mt-2 disabled:opacity-50"
                    >
                      Eliminar Día
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </form>
      </div>

      {/* Botón flotante para agregar día */}
      <div className="fixed bottom-4 right-4 z-10">
        <button
          type="button"
          onClick={addDay}
          className="bg-[#34C759] text-black p-3 rounded-full shadow-lg hover:bg-[#2DBF4E] transition-colors"
        >
          +
        </button>
      </div>

      {/* Botón fijo para guardar */}
      <div className="fixed bottom-4 left-4 z-10">
        <button
          onClick={handleSubmit}
          className="bg-[#34C759] text-black p-3 rounded-full shadow-lg hover:bg-[#2DBF4E] transition-colors"
        >
          ✓
        </button>
      </div>
    </div>
  );
};