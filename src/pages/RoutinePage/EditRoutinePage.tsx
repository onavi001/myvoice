import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { editRoutine } from "../../slices/routine/routineSlice";
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

export const EditRoutinePage: React.FC = () => {
  const { routines } = useSelector((state: RootState) => state.routine);
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { routineIndex } = useParams<{ routineIndex: string }>();

  const [formData, setFormData] = useState<RoutineForm>({
    name: "",
    days: [{ day: "", exercises: [], musclesWorked: [], warmUpOptions: [], explanation: "" }],
  });

  useEffect(() => {
    const index = Number(routineIndex);
    if (routines[index]) {
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
  }, [routineIndex, routines]);

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
    dispatch(editRoutine({ routineIndex: Number(routineIndex), updatedRoutine: routine }));
    navigate("/routine");
  };

  return (
    <div className="min-h-screen bg-[#1A1A1A] text-white flex flex-col">
      <div className="p-4 max-w-md mx-auto flex-1">
        <h2 className="text-sm font-sans font-semibold text-white mb-4 truncate">Editar Rutina</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            name="name"
            placeholder="Nombre de la rutina"
            value={formData.name}
            onChange={handleRoutineChange}
            className="w-full p-2 border border-[#4A4A4A] rounded bg-[#1A1A1A] text-white text-xs placeholder-[#B0B0B0] focus:outline-none focus:ring-1 focus:ring-[#34C759]"
          />
          {formData.days.map((day, dayIndex) => (
            <div key={dayIndex} className="bg-[#2D2D2D] p-2 rounded-lg shadow-sm space-y-2">
              <input
                placeholder="Nombre del día"
                value={day.day}
                onChange={(e) => handleDayChange(dayIndex, "day", e.target.value)}
                className="w-full p-2 border border-[#4A4A4A] rounded bg-[#1A1A1A] text-white text-xs placeholder-[#B0B0B0] focus:outline-none focus:ring-1 focus:ring-[#34C759]"
              />
              <div className="space-y-2">
                {day.exercises.map((exercise, exerciseIndex) => (
                  <div key={exerciseIndex} className="bg-[#4A4A4A] p-2 rounded-lg space-y-1">
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
                      placeholder="Peso"
                      value={exercise.weight}
                      onChange={(e) => handleExerciseChange(dayIndex, exerciseIndex, "weight", e.target.value)}
                      className="w-full p-1 border border-[#4A4A4A] rounded bg-[#1A1A1A] text-white text-xs placeholder-[#B0B0B0] focus:outline-none focus:ring-1 focus:ring-[#34C759]"
                    />
                    <input
                      placeholder="Descanso"
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
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => addExercise(dayIndex)}
                  className="w-full bg-[#34C759] text-black py-1 rounded hover:bg-[#2DBF4E] transition-colors text-xs shadow-sm"
                >
                  Agregar Ejercicio
                </button>
              </div>
              <input
                placeholder="Músculos trabajados (separados por coma)"
                value={day.musclesWorked.join(", ")}
                onChange={(e) => handleDayChange(dayIndex, "musclesWorked", e.target.value.split(", "))}
                className="w-full p-2 border border-[#4A4A4A] rounded bg-[#1A1A1A] text-white text-xs placeholder-[#B0B0B0] focus:outline-none focus:ring-1 focus:ring-[#34C759]"
              />
              <input
                placeholder="Calentamientos (separados por coma)"
                value={day.warmUpOptions.join(", ")}
                onChange={(e) => handleDayChange(dayIndex, "warmUpOptions", e.target.value.split(", "))}
                className="w-full p-2 border border-[#4A4A4A] rounded bg-[#1A1A1A] text-white text-xs placeholder-[#B0B0B0] focus:outline-none focus:ring-1 focus:ring-[#34C759]"
              />
              <textarea
                placeholder="Explicación"
                value={day.explanation}
                onChange={(e) => handleDayChange(dayIndex, "explanation", e.target.value)}
                className="w-full p-2 border border-[#4A4A4A] rounded bg-[#1A1A1A] text-white text-xs h-16 resize-none placeholder-[#B0B0B0] focus:outline-none focus:ring-1 focus:ring-[#34C759]"
              />
            </div>
          ))}
          <button
            type="button"
            onClick={addDay}
            className="w-full bg-[#34C759] text-black py-1 rounded hover:bg-[#2DBF4E] transition-colors text-xs shadow-sm"
          >
            Agregar Día
          </button>
          <button
            type="submit"
            className="w-full bg-[#34C759] text-black py-2 rounded hover:bg-[#2DBF4E] transition-colors text-xs shadow-sm"
          >
            Guardar Cambios
          </button>
        </form>
      </div>
    </div>
  );
};