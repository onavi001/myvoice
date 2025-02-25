// generateRoutine.cjs
const fetch = require("node-fetch");

module.exports.handler = async (event) => {
  try {
    const body = JSON.parse(event.body);
    const { level, goal, days, equipment } = body;

    const prompt = `
      Genera una rutina de entrenamiento personalizada y detallada para un usuario con:
      - Objetivo: ${goal}
      - Nivel de condición física: ${level}
      - Días de entrenamiento: ${days}
      - Equipo: ${equipment}
      **Incluye:**
      - Ejercicios (con nombres y grupos musculares)
      - Series, repeticiones y rangos de peso sugeridos (por ejemplo, "Ligero 5-10kg")
      - Tiempos de descanso entre series (por ejemplo, "60 segundos")
      - Una lista de 2-3 consejos específicos para cada ejercicio (por ejemplo, ["Mantén la espalda recta", "Respira al bajar"])
      - Una lista de músculos trabajados cada día (por ejemplo, "pectorales, tríceps")
      - Una lista de 2-3 opciones de calentamiento por día (por ejemplo, "5 min cinta, círculos de brazos")
      - Una breve explicación de por qué estos ejercicios se ajustan al objetivo del usuario
      **Nombra cada día de forma descriptiva y breve según el enfoque del entrenamiento de ese día (por ejemplo, "Pecho y Piernas", "Espalda y Bíceps") en lugar de usar números o días de la semana.**
      **Formatea la respuesta en JSON con esta estructura:**
      {
        "routine": [
          {
            "day": "Entrenamiento Descriptivo",
            "exercises": [
              {
                "name": "Nombre del Ejercicio",
                "muscle_group": "Grupo Muscular",
                "sets": 4,
                "reps": 12,
                "weight": "Moderado",
                "rest": "60 segundos",
                "tips": ["Consejo 1", "Consejo 2"]
              }
            ],
            "musclesWorked": ["músculo1", "músculo2"],
            "warmUpOptions": ["opción1", "opción2"],
            "explanation": "Texto de explicación"
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
        model: "llama3-8b-8192",
        messages: [
          { role: "system", content: "You are a fitness expert generating workout routines in JSON format." },
          { role: "user", content: prompt },
        ],
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    const routine = data.choices[0]?.message.content;
    console.log(routine);
    return {
      statusCode: 200,
      body: routine,
    };
  } catch (error) {
    console.error(error)
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};