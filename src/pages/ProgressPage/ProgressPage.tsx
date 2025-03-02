import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "../../slices/store";
import { addProgress, editProgress, deleteProgress, clearProgress } from "../../slices/progress/progressSlice";
import { useNavigate } from "react-router-dom";
import Toast from "../../components/Toast";
import { Line } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from "chart.js";

// Registrar componentes de Chart.js
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

export const ProgressPage: React.FC = () => {
  const { progress } = useSelector((state: RootState) => state.progress);
  const { routines } = useSelector((state: RootState) => state.routine);
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [expandedCardKey, setExpandedCardKey] = useState<string | null>(null);
  const [showChart, setShowChart] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [editData, setEditData] = useState<Record<string, any>>({});
  const [showAddForm, setShowAddForm] = useState<boolean>(false);
  const [newProgress, setNewProgress] = useState({
    routineIndex: 0,
    dayIndex: 0,
    exerciseIndex: 0,
    sets: 0,
    reps: 0,
    weight: "",
    notes: "",
    date: new Date().toISOString().split("T")[0], // Fecha actual por defecto
  });
  const itemsPerPage = 5;

  const handleBack = () => navigate("/routine");

  const handleClear = () => {
    dispatch(clearProgress());
    setToastMessage("Progreso limpiado correctamente");
  };

  const handleCloseToast = () => {
    setToastMessage(null);
  };

  const toggleExpandCard = (key: string) => {
    setExpandedCardKey((prev) => (prev === key ? null : key));
  };

  const handleEditChange = (cardKey: string, field: string, value: string | number) => {
    setEditData((prev) => ({
      ...prev,
      [cardKey]: { ...prev[cardKey], [field]: value },
    }));
  };

  const handleSaveEdit = (cardKey: string, entry: any) => {
    const updatedEntry = { ...entry, ...editData[cardKey] };
    // Asegurarse de que la fecha esté en formato ISO completo
    if (updatedEntry.date && !updatedEntry.date.includes("T")) {
      updatedEntry.date = `${updatedEntry.date}T00:00:00Z`;
    }
    dispatch(editProgress({ cardKey, updatedEntry }));
    setToastMessage("Progreso actualizado correctamente");
    setEditData((prev) => {
      const newData = { ...prev };
      delete newData[cardKey];
      return newData;
    });
  };

  const handleDelete = (cardKey: string) => {
    dispatch(deleteProgress(cardKey));
    setToastMessage("Progreso eliminado correctamente");
    setExpandedCardKey(null);
  };

  const handleAddChange = (field: string, value: string | number) => {
    setNewProgress((prev) => ({ ...prev, [field]: value }));
  };

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const fullDate = `${newProgress.date}T00:00:00Z`; // Convertir a formato ISO
    dispatch(addProgress({ ...newProgress, date: fullDate }));
    setToastMessage("Progreso agregado correctamente");
    setShowAddForm(false);
    setNewProgress({
      routineIndex: 0,
      dayIndex: 0,
      exerciseIndex: 0,
      sets: 0,
      reps: 0,
      weight: "",
      notes: "",
      date: new Date().toISOString().split("T")[0],
    });
  };

  // Filtrar progreso por búsqueda
  const filteredProgress = progress.filter((entry) => {
    const routine = routines[entry.routineIndex];
    const day = routine?.routine[entry.dayIndex];
    const exercise = day?.exercises[entry.exerciseIndex];
    const query = searchQuery.toLowerCase();
    return (
      !query ||
      routine?.name.toLowerCase().includes(query) ||
      day?.day.toLowerCase().includes(query) ||
      exercise?.name.toLowerCase().includes(query) ||
      exercise?.muscle_group.toLowerCase().includes(query)
    );
  });

  // Paginación
  const totalPages = Math.ceil(filteredProgress.length / itemsPerPage);
  const paginatedProgress = filteredProgress.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Datos para la gráfica (peso por fecha)
  const chartData = {
    labels: filteredProgress.map((entry) => new Date(entry.date).toLocaleDateString()),
    datasets: [
      {
        label: "Peso (kg)",
        data: filteredProgress.map((entry) => parseFloat(entry.weight) || 0),
        borderColor: "#34C759",
        backgroundColor: "rgba(52, 199, 89, 0.2)",
        fill: true,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      title: { display: true, text: "Progreso", color: "#FFFFFF", font: { size: 12 } },
    },
    scales: {
      x: { ticks: { color: "#B0B0B0", font: { size: 10 } } },
      y: { ticks: { color: "#B0B0B0", font: { size: 10 } } },
    },
  };

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

      {/* Barra superior fija */}
      <div className="bg-[#1A1A1A] p-2 shadow-sm z-30">
        <div className="max-w-md mx-auto">
          <input
            type="text"
            placeholder="Buscar (músculo, ejercicio...)"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full p-2 border border-[#4A4A4A] rounded bg-[#2D2D2D] text-white text-xs placeholder-[#B0B0B0] focus:outline-none focus:ring-1 focus:ring-[#34C759]"
          />
          <div className="flex justify-between mt-2">
            <label className="flex items-center text-[#B0B0B0] text-xs">
              <input
                type="checkbox"
                checked={showChart}
                onChange={() => setShowChart(!showChart)}
                className="mr-2"
              />
              Ver gráfica
            </label>
            <button
              onClick={() => setShowAddForm(true)}
              className="bg-[#34C759] text-black px-2 py-1 rounded text-xs hover:bg-[#2DBF4E]"
            >
              Agregar Progreso
            </button>
          </div>
        </div>
      </div>

      {/* Contenido con margen superior ajustado */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-4 max-w-md mx-auto">
          {/* Gráfica */}
          {showChart && filteredProgress.length > 0 && (
            <div className="mb-4 bg-[#2D2D2D] p-2 rounded-lg shadow-sm h-32 relative z-0">
              <Line data={chartData} options={chartOptions} />
            </div>
          )}

          {/* Lista de progreso */}
          {filteredProgress.length === 0 ? (
            <p className="text-[#B0B0B0] text-xs mt-2">No hay progreso registrado con este filtro.</p>
          ) : (
            <>
              <ul className="space-y-2">
                {paginatedProgress.map((entry) => {
                  const routine = routines[entry.routineIndex];
                  const day = routine?.routine[entry.dayIndex];
                  const exercise = day?.exercises[entry.exerciseIndex];
                  const cardKey = `${entry.routineIndex}-${entry.dayIndex}-${entry.exerciseIndex}-${entry.date}`;
                  const isExpanded = expandedCardKey === cardKey;
                  const edited = editData[cardKey] || {};
                  const currentEntry = { ...entry, ...edited };

                  return (
                    <li
                      key={cardKey}
                      className="bg-[#2D2D2D] rounded-lg shadow-sm overflow-hidden"
                    >
                      <button
                        onClick={() => toggleExpandCard(cardKey)}
                        className="w-full flex justify-between items-center p-2 text-left hover:bg-[#4A4A4A] transition-colors"
                      >
                        <span className="text-xs font-sans font-semibold text-white truncate">
                          {exercise?.name || "Ejercicio desconocido"}
                        </span>
                        <span className="text-[#B0B0B0] text-xs">{isExpanded ? "▲" : "▼"}</span>
                      </button>
                      {isExpanded && (
                        <div className="p-2 bg-[#4A4A4A] text-xs space-y-1 relative z-0">
                          <p className="text-[#FFFFFF]">
                            {routine?.name || "Rutina desconocida"} - {day?.day || "Día desconocido"}
                          </p>
                          <p className="text-[#B0B0B0]">Músculo: {exercise?.muscle_group || "Desconocido"}</p>
                          <div className="grid grid-cols-2 gap-1">
                            <div>
                              <label className="text-[#B0B0B0]">Fecha:</label>
                              <input
                                type="date"
                                value={currentEntry.date.split("T")[0]} // Mostrar solo la parte de la fecha
                                onChange={(e) => handleEditChange(cardKey, "date", e.target.value)}
                                className="w-full p-1 border border-[#4A4A4A] rounded bg-[#1A1A1A] text-white text-xs focus:outline-none focus:ring-1 focus:ring-[#34C759]"
                              />
                            </div>
                            <div>
                              <label className="text-[#B0B0B0]">Series:</label>
                              <input
                                type="number"
                                value={currentEntry.sets}
                                onChange={(e) => handleEditChange(cardKey, "sets", Number(e.target.value))}
                                className="w-full p-1 border border-[#4A4A4A] rounded bg-[#1A1A1A] text-white text-xs focus:outline-none focus:ring-1 focus:ring-[#34C759]"
                              />
                            </div>
                            <div>
                              <label className="text-[#B0B0B0]">Reps:</label>
                              <input
                                type="number"
                                value={currentEntry.reps}
                                onChange={(e) => handleEditChange(cardKey, "reps", Number(e.target.value))}
                                className="w-full p-1 border border-[#4A4A4A] rounded bg-[#1A1A1A] text-white text-xs focus:outline-none focus:ring-1 focus:ring-[#34C759]"
                              />
                            </div>
                            <div>
                              <label className="text-[#B0B0B0]">Peso:</label>
                              <input
                                type="text"
                                value={currentEntry.weight}
                                onChange={(e) => handleEditChange(cardKey, "weight", e.target.value)}
                                className="w-full p-1 border border-[#4A4A4A] rounded bg-[#1A1A1A] text-white text-xs focus:outline-none focus:ring-1 focus:ring-[#34C759]"
                              />
                            </div>
                            <div className="col-span-2">
                              <label className="text-[#B0B0B0]">Notas:</label>
                              <textarea
                                value={currentEntry.notes || ""}
                                onChange={(e) => handleEditChange(cardKey, "notes", e.target.value)}
                                className="w-full p-1 border border-[#4A4A4A] rounded bg-[#1A1A1A] text-white text-xs h-8 resize-none focus:outline-none focus:ring-1 focus:ring-[#34C759]"
                              />
                            </div>
                          </div>
                          <div className="flex space-x-2 mt-2">
                            <button
                              onClick={() => handleSaveEdit(cardKey, entry)}
                              className="w-full bg-[#34C759] text-black py-1 rounded hover:bg-[#2DBF4E] text-xs"
                            >
                              Guardar
                            </button>
                            <button
                              onClick={() => handleDelete(cardKey)}
                              className="w-full bg-red-600 text-white py-1 rounded hover:bg-red-700 text-xs"
                            >
                              Eliminar
                            </button>
                          </div>
                        </div>
                      )}
                    </li>
                  );
                })}
              </ul>

              {/* Paginación */}
              {totalPages > 1 && (
                <div className="mt-4 flex justify-between items-center">
                  <button
                    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="p-2 bg-[#4A4A4A] text-[#B0B0B0] rounded-full disabled:opacity-50 text-xs"
                  >
                    ◄
                  </button>
                  <span className="text-[#B0B0B0] text-xs">
                    {currentPage}/{totalPages}
                  </span>
                  <button
                    onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="p-2 bg-[#4A4A4A] text-[#B0B0B0] rounded-full disabled:opacity-50 text-xs"
                  >
                    ►
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Formulario para agregar progreso */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-40">
          <div className="bg-[#2D2D2D] p-4 rounded-lg max-w-md w-full">
            <h3 className="text-sm font-semibold text-white mb-2">Agregar Progreso</h3>
            <form onSubmit={handleAddSubmit} className="space-y-2">
              <div>
                <label className="text-[#B0B0B0] text-xs">Rutina:</label>
                <select
                  value={newProgress.routineIndex}
                  onChange={(e) => handleAddChange("routineIndex", Number(e.target.value))}
                  className="w-full p-1 border border-[#4A4A4A] rounded bg-[#1A1A1A] text-white text-xs"
                >
                  {routines.map((routine, idx) => (
                    <option key={idx} value={idx}>{routine.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-[#B0B0B0] text-xs">Día:</label>
                <select
                  value={newProgress.dayIndex}
                  onChange={(e) => handleAddChange("dayIndex", Number(e.target.value))}
                  className="w-full p-1 border border-[#4A4A4A] rounded bg-[#1A1A1A] text-white text-xs"
                >
                  {routines[newProgress.routineIndex]?.routine.map((day, idx) => (
                    <option key={idx} value={idx}>{day.day}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-[#B0B0B0] text-xs">Ejercicio:</label>
                <select
                  value={newProgress.exerciseIndex}
                  onChange={(e) => handleAddChange("exerciseIndex", Number(e.target.value))}
                  className="w-full p-1 border border-[#4A4A4A] rounded bg-[#1A1A1A] text-white text-xs"
                >
                  {routines[newProgress.routineIndex]?.routine[newProgress.dayIndex]?.exercises.map((exercise, idx) => (
                    <option key={idx} value={idx}>{exercise.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-[#B0B0B0] text-xs">Series:</label>
                <input
                  type="number"
                  value={newProgress.sets}
                  onChange={(e) => handleAddChange("sets", Number(e.target.value))}
                  className="w-full p-1 border border-[#4A4A4A] rounded bg-[#1A1A1A] text-white text-xs"
                />
              </div>
              <div>
                <label className="text-[#B0B0B0] text-xs">Reps:</label>
                <input
                  type="number"
                  value={newProgress.reps}
                  onChange={(e) => handleAddChange("reps", Number(e.target.value))}
                  className="w-full p-1 border border-[#4A4A4A] rounded bg-[#1A1A1A] text-white text-xs"
                />
              </div>
              <div>
                <label className="text-[#B0B0B0] text-xs">Peso:</label>
                <input
                  type="text"
                  value={newProgress.weight}
                  onChange={(e) => handleAddChange("weight", e.target.value)}
                  className="w-full p-1 border border-[#4A4A4A] rounded bg-[#1A1A1A] text-white text-xs"
                />
              </div>
              <div>
                <label className="text-[#B0B0B0] text-xs">Notas:</label>
                <textarea
                  value={newProgress.notes}
                  onChange={(e) => handleAddChange("notes", e.target.value)}
                  className="w-full p-1 border border-[#4A4A4A] rounded bg-[#1A1A1A] text-white text-xs h-8 resize-none"
                />
              </div>
              <div>
                <label className="text-[#B0B0B0] text-xs">Fecha:</label>
                <input
                  type="date"
                  value={newProgress.date}
                  onChange={(e) => handleAddChange("date", e.target.value)}
                  className="w-full p-1 border border-[#4A4A4A] rounded bg-[#1A1A1A] text-white text-xs"
                />
              </div>
              <div className="flex space-x-2">
                <button type="submit" className="w-full bg-[#34C759] text-black py-1 rounded text-xs hover:bg-[#2DBF4E]">
                  Guardar
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="w-full bg-[#4A4A4A] text-white py-1 rounded text-xs hover:bg-[#5A5A5A]"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Botón flotante para limpiar */}
      <div className="fixed bottom-4 right-4 z-10">
        <button
          onClick={handleClear}
          className="bg-red-600 text-white p-3 rounded-full shadow-lg hover:bg-red-700 transition-colors"
        >
          🗑️
        </button>
      </div>

      {/* Botón de volver */}
      <div className="fixed bottom-4 left-4 z-10">
        <button
          onClick={handleBack}
          className="bg-white text-black p-3 rounded-full shadow-lg hover:bg-[#E0E0E0] transition-colors"
        >
          ←
        </button>
      </div>

      {/* Notificación Toast */}
      {toastMessage && <Toast message={toastMessage} onClose={handleCloseToast} />}
    </div>
  );
};