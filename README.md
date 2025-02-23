# MyVoice - Workout Routine Generator

![React](https://img.shields.io/badge/React-18.2.0-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)
![Redux](https://img.shields.io/badge/Redux_Toolkit-1.9-purple)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4-teal)
![Groq API](https://img.shields.io/badge/Groq_API-Free-green)

**MyVoice** es una aplicación web construida con React, TypeScript, Redux Toolkit y Tailwind CSS, diseñada para generar rutinas de gimnasio personalizadas utilizando la inteligencia artificial de la Groq API. Originalmente enfocada en funcionalidades relacionadas con canciones y autenticación, la aplicación ha evolucionado para incluir un generador de rutinas que adapta los entrenamientos a tus objetivos, nivel de condición física, días disponibles y equipo.

## Características

- **Generación de rutinas personalizadas:** Ingresa tu nivel (principiante, intermedio, avanzado), objetivo (fuerza, hipertrofia, resistencia), días de entrenamiento y equipo disponible para obtener una rutina detallada en formato JSON.
- **Interfaz intuitiva:** Formulario simple y visualización clara de las rutinas con ejercicios, series, repeticiones, pesos, descansos y explicaciones.
- **Estado global con Redux:** Manejo eficiente del estado usando Redux Toolkit para gestionar las rutinas y otras funcionalidades.
- **Diseño responsivo:** Estilizado con Tailwind CSS para una experiencia fluida en dispositivos móviles y de escritorio.
- **Autenticación y canciones:** Funcionalidades heredadas para gestionar usuarios y canciones (en desarrollo).

## Tecnologías utilizadas

- **Frontend:** React 18.2.0, TypeScript 5.0, Tailwind CSS 3.4
- **Gestión de estado:** Redux Toolkit 1.9
- **IA:** Groq API (nivel gratuito) con el modelo `llama3-8b-8192`
- **Enrutamiento:** React Router DOM

## Instalación

Sigue estos pasos para configurar el proyecto localmente:

### Prerrequisitos

- Node.js (v16 o superior)
- npm (v8 o superior)
- Una clave API de Groq (obténla en [Groq Console](https://console.groq.com))

### Pasos

1. **Clona el repositorio:**
   ```bash
   git clone https://github.com/onavi001/myvoice.git
   cd myvoice
   ```

2. **Instala las dependencias:**
   ```bash
   npm install
   ```

3. **Configura la clave API de Groq:**
   - Crea un archivo `.env` en la raíz del proyecto y añade tu clave:
     ```
     REACT_APP_GROQ_API_KEY=tu_clave_aqui
     ```
   - El proyecto ya está configurado para usar esta variable en `routineSlice.ts`.

4. **Inicia la aplicación:**
   ```bash
   npm start
   ```
   La aplicación se abrirá en `http://localhost:3000`.

## Uso

1. **Accede al formulario:**
   - Navega a la página principal (`/`) para ver el formulario de entrada.

2. **Ingresa tus datos:**
   - **Nivel:** Elige entre principiante, intermedio o avanzado.
   - **Objetivo:** Selecciona fuerza, hipertrofia o resistencia.
   - **Días:** Especifica cuántos días por semana quieres entrenar (1-7).
   - **Equipo:** Indica el equipo disponible (gym, casa, pesas).

3. **Genera la rutina:**
   - Haz clic en "Generar Rutina" para obtener una rutina personalizada generada por la Groq API.

4. **Visualiza el resultado:**
   - La rutina aparecerá en pantalla con días, ejercicios, series, repeticiones, pesos, tiempos de descanso y una explicación.

## Estructura del proyecto

```
src/
├── components/         # Componentes reutilizables (Navbar, ExerciseCard, etc.)
├── pages/             # Páginas de la aplicación (FormPage, RoutinePage, etc.)
│   ├── FormPage/
│   └── RoutinePage/
├── slices/            # Slices de Redux (auth, song, ui, routine)
├── store/             # Configuración del store de Redux
└── App.tsx            # Componente principal con enrutamiento
```

## Ejemplo de rutina generada

Para un usuario con `level: principiante`, `goal: fuerza`, `days: 3`, `equipment: gym`:

```json
{
  "routine": [
    {
      "day": "Day 1",
      "exercises": [
        {
          "name": "Bench Press",
          "muscle_group": "Chest",
          "sets": 3,
          "reps": 12,
          "weight": "Light 5-10kg",
          "rest": "60 seconds"
        },
        {
          "name": "Leg Press",
          "muscle_group": "Quads",
          "sets": 3,
          "reps": 12,
          "weight": "Light 10-20kg",
          "rest": "60 seconds"
        }
      ],
      "explanation": "These exercises build foundational strength for beginners."
    }
  ]
}
```

## Contribuir

¡Las contribuciones son bienvenidas! Si quieres mejorar el proyecto:

1. Haz un fork del repositorio.
2. Crea una rama para tu funcionalidad (`git checkout -b feature/nueva-funcionalidad`).
3. Commitea tus cambios (`git commit -m "Añade nueva funcionalidad"`).
4. Sube tu rama (`git push origin feature/nueva-funcionalidad`).
5. Abre un Pull Request.

## Próximos pasos

- Integrar la rutina generada en `RoutinePage` para una vista dedicada.
- Añadir validaciones al formulario.
- Mejorar el diseño con estilos avanzados de Tailwind CSS.
- Implementar persistencia con localStorage o una base de datos.

## Licencia

Este proyecto está bajo la [Licencia MIT](LICENSE).

## Autor

- **Oscar Ivan Perez Ibarra** - [GitHub](https://github.com/onavi001)

---
