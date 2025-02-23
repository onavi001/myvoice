import React from "react";

interface ProgressEntry {
  exercise: string;
  weight: string;
  reps: number;
  notes: string;
}

interface ProgressTableProps {
  entries: ProgressEntry[];
}

export const ProgressTable: React.FC<ProgressTableProps> = ({ entries }) => {
  return (
    <table className="w-full bg-white rounded-lg shadow-md">
      <thead>
        <tr className="bg-gray-200 text-gray-700">
          <th className="p-2">Ejercicio</th>
          <th className="p-2">Peso</th>
          <th className="p-2">Reps</th>
          <th className="p-2">Notas</th>
        </tr>
      </thead>
      <tbody>
        {entries.map((entry, index) => (
          <tr key={index} className="border-t">
            <td className="p-2">{entry.exercise}</td>
            <td className="p-2">{entry.weight}</td>
            <td className="p-2">{entry.reps}</td>
            <td className="p-2">{entry.notes}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};