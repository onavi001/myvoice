// generateRoutine.cjs
const fetch = require("node-fetch");

module.exports.handler = async (event) => {
  try {
    const body = JSON.parse(event.body);
    const { level, goal, days, equipment } = body;

    const prompt = `
      Generate a detailed personalized workout routine for a user with:
      - Goal: ${goal}
      - Fitness Level: ${level}
      - Training Days: ${days}
      - Equipment: ${equipment}
      **Include:**
      - Exercises (with names and muscle groups)
      - Sets, reps, and suggested weight ranges (e.g., "Light 5-10kg")
      - Rest times between sets (e.g., "60 seconds")
      - A short explanation of why these exercises fit the user's goal
      **Format the response as JSON with this structure:**
      {
        "routine": [
          {
            "day": "Day 1",
            "exercises": [
              {
                "name": "Exercise Name",
                "muscle_group": "Muscle Group",
                "sets": 4,
                "reps": 12,
                "weight": "Moderate",
                "rest": "60 seconds"
              }
            ],
            "explanation": "Explanation text"
          }
        ]
      }
      Return only the JSON object, no additional text outside the JSON.
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
        max_tokens: 1500,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    const routine = data.choices[0]?.message.content;

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