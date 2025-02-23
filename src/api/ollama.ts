export const getGymRoutine = async (userData: { goal: string, level: string, preferences: string }) => {
    const prompt = `
    Generate a detailed personalized workout routine for a user with the following details:
        - Goal: ${userData.goal}  
        - Fitness Level: ${userData.level}  
        - Preferences: ${userData.preferences}  
        **Include:**
        - Exercises (with names and muscle groups)  
        - Sets, reps, and suggested weight ranges  
        - Rest times between sets  
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
            ]
            }
        ]
        }
    `;
    try {
        const response = await fetch("http://localhost:11434/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
                model: "llama3.2",
                messages: [{ role: "user", content: prompt }],
                stream: false 
            }),
        });
        if (!response.ok) {
            throw new Error(`Error: ${response.status}`);
        }
        const data = await response.json();
        return data.message?.content || "No response from AI";
    } catch (error) {
        console.error("Error fetching from Ollama:", error);
        return "Failed to generate routine.";
    }
};
export const getGymRoutineDefault = async (userData: { goal: string, level: string, preferences: string }) => {
    return `
        
Here's a detailed, personalized workout routine in JSON format based on your requirements:
{
  "routine": [
    {
      "day": "Day 1: Chest and Triceps",
      "exercises": [
        {
          "name": "Bench Press",
          "muscle_group": "Chest",
          "sets": 4,
          "reps": 8-12,
          "weight": "Heavy",
          "rest": "60 seconds"
        },
        {
          "name": "Incline Dumbbell Press",
          "muscle_group": "Upper Chest",
          "sets": 3,
          "reps": 10-15,
          "weight": "Moderate",
          "rest": "45 seconds"
        },
        {
          "name": "Tricep Pushdowns",
          "muscle_group": "Triceps",
          "sets": 3,
          "reps": 12-15,
          "weight": "Heavy",
          "rest": "60 seconds"
        },
        {
          "name": "Overhead Dumbbell Extension",
          "muscle_group": "Triceps",
          "sets": 3,
          "reps": 12-15,
          "weight": "Moderate",
          "rest": "45 seconds"
        }
      ]
    },
    {
      "day": "Day 2: Back and Biceps",
      "exercises": [
        {
          "name": "Deadlifts",
          "muscle_group": "Back",
          "sets": 4,
          "reps": 8-12,
          "weight": "Heavy",
          "rest": "60 seconds"
        },
        {
          "name": "Bent-Over Barbell Rows",
          "muscle_group": "Back",
          "sets": 3,
          "reps": 8-12,
          "weight": "Moderate",
          "rest": "45 seconds"
        },
        {
          "name": "Dumbbell Bicep Curls",
          "muscle_group": "Biceps",
          "sets": 3,
          "reps": 12-15,
          "weight": "Heavy",
          "rest": "60 seconds"
        },
        {
          "name": "Hammer Curls",
          "muscle_group": "Biceps",
          "sets": 3,
          "reps": 10-12,
          "weight": "Moderate",
          "rest": "45 seconds"
        }
      ]
    },
    {
      "day": "Day 3: Rest",
      "exercises": [
        {}
      ]
    },
    {
      "day": "Day 4: Legs",
      "exercises": [
        {
          "name": "Squats",
          "muscle_group": "Legs",
          "sets": 4,
          "reps": 8-12,
          "weight": "Heavy",
          "rest": "60 seconds"
        },
        {
          "name": "Leg Press",
          "muscle_group": "Legs",
          "sets": 3,
          "reps": 10-12,
          "weight": "Moderate",
          "rest": "45 seconds"
        },
        {
          "name": "Lunges",
          "muscle_group": "Legs",
          "sets": 3,
          "reps": 10-12,
          "weight": "Heavy",
          "rest": "60 seconds"
        },
        {
          "name": "Leg Extensions",
          "muscle_group": "Legs",
          "sets": 3,
          "reps": 12-15,
          "weight": "Moderate",
          "rest": "45 seconds"
        }
      ]
    },
    {
      "day": "Day 5: Shoulders and Abs",
      "exercises": [
        {
          "name": "Standing Military Press",
          "muscle_group": "Shoulders",
          "sets": 3,
          "reps": 8-12,
          "weight": "Heavy",
          "rest": "45 seconds"
        },
        {
          "name": "Lateral Raises",
          "muscle_group": "Shoulders",
          "sets": 3,
          "reps": 10-12,
          "weight": "Moderate",
          "rest": "60 seconds"
        },
        {
          "name": "Reverse Flys",
          "muscle_group": "Back and Shoulders",
          "sets": 3,
          "reps": 12-15,
          "weight": "Light",
          "rest": "45 seconds"
        },
        {
          "name": "Plank",
          "muscle_group": "Abs",
          "sets": 4,
          "reps": 30-60,
          "weight": "None",
          "rest": "90 seconds"
        }
      ]
    },
    {
      "day": "Day 6 and 7: Rest",
      "exercises": [
        {}
      ]
    }
  ]
}
The routine is divided into four days, with at least one day of rest in between. This will allow for proper recovery and muscle growth.

Here are some explanations about the exercises:
1. **Bench Press**: Works on the chest muscles (pectoralis major) to build overall muscle mass.
2.  **Incline Dumbbell Press**: Targets the upper part of the chest, specifically the pectoralis major's upper head, for better definition and separation between the shoulders and chest.
3.  **Tricep Pushdowns**: Works on the triceps brachii to build the back of the arm for overall muscle mass and size.
4.  **Overhead Dumbbell Extension**: Targets the long head of the triceps brachii, which is less active during everyday activities but crucial for overall strength and muscle size.
5.  **Deadlifts**: Works on multiple muscle groups including back (latissimus dorsi, rhomboids), legs ( quadriceps, hamstrings) and glutes to build overall muscle mass.
6.  **Bent-Over Barbell Rows**: Specifically targets the latissimus dorsi for larger muscles, more defined upper body, while supporting lower back strength.
7.  **Dumbbell Bicep Curls** : Works on the biceps brachii to build both size and muscle definition in the front of the arm.
8.  **Hammer Curls**: Targets the biceps brachii with a variation that helps prevent muscle imbalance, especially for those new to lifting weights.
9.  **Squats**: Works on multiple lower body muscles such as quadriceps, hamstrings and glutes to build overall leg strength and size.
10. **Leg Press**: Targets both legs in unison by applying pressure through a machine that simulates weightlifting without the need for any actual lifting to reduce injury risk and build strength throughout each step in the leg movement.
11. **Lunges** : Works on multiple lower body muscles including quadriceps, hamstrings, glutes to build overall leg strength, size and muscle definition.
12. **Leg Extensions**: Targets quadriceps specifically but provides additional benefits to those who incorporate them into their routine by strengthening knee joint stability and helping with injury prevention for the knee area. 
13.  **Standing Military Press**: Works on the shoulder muscles (deltoids) primarily, building overall shoulder strength, size and muscle definition.
14.  **Lateral Raises** : Targets deltoid side muscles to build a balanced look in the shoulders while also contributing to an overall increase in arm and body mass through increased strength levels across the upper body.
15.  **Reverse Flys**: Works on both the back and shoulder areas by stretching the muscle to improve range of motion, increase flexibility and build overall strength across the upper body through targeted movements that isolate key muscles for optimal growth. 
16.  **Plank**: Strengthens core muscles (abdominals) by engaging the transverse abdominis, helping improve posture, reduce back pain and increase overall core strength.
17. **High-Intensity Interval Training (HIIT)**: This type of workout is ideal for those with an advanced fitness level as it enhances cardiovascular endurance while also building muscle mass through the combination of both intense intervals and short rest periods.

Remember to always warm up before a workout, stretch after completing your routine, and prioritize proper nutrition along with sufficient sleep each night.

    `;
}
/**
To provide a personalized workout routine, I'll need to know more about your goals, fitness level, and preferences. Please provide me with the following information:

1. Goal:
What is your primary goal? (Choose one or multiple)
	* Weight loss
	* Muscle gain
	* Increased endurance
	* Improved overall health

2. Fitness Level:
How would you describe your current fitness level?
	* Beginner (little to no exercise experience)
	* Intermediate (some exercise experience, but not consistent)
	* Advanced (regular exercise routine)

3. Preferences:
Do any of the following preferences apply to you?
	* I prefer cardio exercises
	* I enjoy strength training with free weights
	* I like bodyweight exercises
	* I prefer high-intensity interval training (HIIT)
	* I have a physical disability or injury that requires modifications

Once I have this information, I can generate a customized workout routine for you.

(Note: Please provide specific details about your goals, fitness level, and preferences. This will help me create a more accurate and effective workout plan tailored to your needs.)
 */