
import { useCallback, useState } from "react";
import { getGymRoutine, getGymRoutineDefault } from "../../api/ollama";
export const GymRoutine: React.FC = () => {
    const [goal, setGoal] = useState('');
    const [level, setLevel] = useState('');
    const [preferences, setPreferences] = useState('');
    const [routine, setRoutine] = useState<any[]>([]);
    const handleSubmit = useCallback(async(e: React.FormEvent) => {
      console.log("aqui")
      e.preventDefault();
      const userData = {
          goal,
          level,
          preferences,
      };
      try {
        const result = await getGymRoutineDefault(userData);
        const jsonMatch = result.match(/\{[\s\S]*\}/);
        if (!jsonMatch) {
          throw new Error("No valid JSON found in the response.");
        }
  
        let jsonString = jsonMatch[0];
  
        // Intentar limpiar el JSON (eliminar caracteres extraños si es necesario)
        jsonString = jsonString.replace(/“|”/g, '"'); // Reemplazar comillas curvas por comillas estándar
        jsonString = jsonString.trim(); // Eliminar espacios en blanco innecesarios
  
        // Intentar parsear el JSON
        console.log(jsonString)
        const parsedData = JSON.parse(jsonString);
        
        if (!parsedData.routine) {
          console.log("error")
          throw new Error("JSON does not contain 'routine' key.");
        }
  
        setRoutine(parsedData.routine);
      } catch (error) {
        
      }
    },[goal,level,preferences]);
  
    return (
      <form onSubmit={handleSubmit} className="space-y-4">
        <label>
          Goal:
          <input type="text" value={goal} onChange={(e) => setGoal(e.target.value)} className="border p-2" />
        </label>
        <label>
          Fitness Level:
          <input type="text" value={level} onChange={(e) => setLevel(e.target.value)} className="border p-2" />
        </label>
        <label>
          Preferences:
          <input type="text" value={preferences} onChange={(e) => setPreferences(e.target.value)} className="border p-2" />
        </label>
        <button type="submit" className="bg-blue-500 text-white p-2 rounded">Get Routine</button>
      </form>
    );
};
