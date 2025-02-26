const fetch = require("node-fetch");

module.exports.handler = async (event) => {
  try {
    const body = JSON.parse(event.body);
    const { level, goal, days, equipment, name = "Rutina sin nombre", notes = "" } = body;

    const prompt = `
      Genera una rutina de entrenamiento personalizada y detallada llamada "${name}" para un usuario con:
      - Objetivo: ${goal} (fuerza: levantamientos pesados; hipertrofia: volumen; resistencia: alta repetición)
      - Nivel: ${level} (principiante: básico; intermedio: mixto; avanzado: complejo)
      - Días: ${days} (exactamente este número)
      - Equipo: ${equipment} (gym: máquinas y pesas; casa: peso corporal; pesas: pesas libres)
      ${notes ? `- Notas (obligatorio seguir): "${notes}"` : ""}
      **Instrucciones:**
      - Genera ${days} días, cada uno con 6 ejercicios únicos y específicos (no repitas entre días).
      - Por ejercicio: nombre exacto (ej. "Press de banca con barra"), grupo muscular principal, series (3-5), repeticiones (6-15 según objetivo), peso sugerido (ej. "10-15kg"), descanso (60-120s), 2 consejos específicos.
      - Por día: 3 músculos trabajados, 3 calentamientos relevantes, explicación breve (15-20 palabras).
      - Nombra días descriptivamente (ej. "Pecho y Tríceps").
      **Formato JSON:**
      {
        "routine": [
          {
            "day": "...",
            "exercises": [{"name": "...", "muscle_group": "...", "sets": 4, "reps": 8, "weight": "...", "rest": "...", "tips": ["...", "..."]}],
            "musclesWorked": ["...", "...", "..."],
            "warmUpOptions": ["...", "...", "..."],
            "explanation": "..."
          }
        ]
      }
      Devuelve solo el objeto JSON, sin texto adicional fuera del JSON.
    `;

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "mixtral-8x7b-32768",
        messages: [
          { role: "system", content: "Eres un experto en fitness que genera rutinas precisas en JSON." },
          { role: "user", content: prompt },
        ],
        max_tokens: 5500,
        temperature: 0.1,
      }),
    });

    if (!response.ok) throw new Error(`Error ${response.status}: ${response.statusText}`);
    const data = await response.json();
    const routine = data.choices[0]?.message.content;
    return { statusCode: 200, body: routine };
  } catch (error) {
    return { statusCode: 500, body: JSON.stringify({ error: error.message }) };
  }
};