
# MyVoice - Workout Routine Generator

![React](https://img.shields.io/badge/React-18.2.0-blue) ![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue) ![Redux](https://img.shields.io/badge/Redux_Toolkit-1.9-purple) ![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4-teal) ![Groq API](https://img.shields.io/badge/Groq_API-Free-green) ![Netlify](https://img.shields.io/badge/Netlify_Functions-Free-orange)

**MyVoice** es una aplicación web construida con React, TypeScript, Redux Toolkit y Tailwind CSS, diseñada para generar rutinas de gimnasio personalizadas utilizando la inteligencia artificial de la Groq API. Originalmente enfocada en funcionalidades relacionadas con canciones y autenticación, la aplicación ha evolucionado para incluir un generador de rutinas que adapta los entrenamientos a tus objetivos, nivel de condición física, días disponibles y equipo, con un backend seguro implementado mediante Netlify Functions.

## Características

- **Generación de rutinas personalizadas:** Ingresa tu nivel (principiante, intermedio, avanzado), objetivo (fuerza, hipertrofia, resistencia), días de entrenamiento y equipo disponible para obtener una rutina detallada en formato JSON.
- **Interfaz intuitiva:** Formulario simple y visualización clara de las rutinas con ejercicios, series, repeticiones, pesos, descansos y explicaciones.
- **Estado global con Redux:** Manejo eficiente del estado usando Redux Toolkit para gestionar las rutinas y otras funcionalidades.
- **Diseño responsivo:** Estilizado con Tailwind CSS para una experiencia fluida en dispositivos móviles y de escritorio.
- **Backend seguro:** Las solicitudes a la Groq API se manejan a través de Netlify Functions para proteger la clave API.
- **Autenticación y canciones:** Funcionalidades heredadas para gestionar usuarios y canciones (en desarrollo).

## Tecnologías utilizadas

- **Frontend:** React 18.2.0, TypeScript 5.0, Tailwind CSS 3.4
- **Gestión de estado:** Redux Toolkit 1.9
- **IA:** Groq API (nivel gratuito) con el modelo `llama3-8b-8192`
- **Backend:** Netlify Functions (nivel gratuito)
- **Enrutamiento:** React Router DOM

## Instalación

Sigue estos pasos para configurar el proyecto localmente:

### Prerrequisitos

- Node.js (v16 o superior)
- npm (v8 o superior)
- Netlify CLI (`npm install -g netlify-cli`)
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

3. **Configura la clave API de Groq localmente:**
   - Crea un archivo `.env` en la raíz del proyecto (no lo subas a GitHub):
     ```
     GROQ_API_KEY=tu_clave_aqui
     ```
   - Este archivo se usará para pruebas locales con Netlify Functions.

4. **Inicia la aplicación:**
   ```bash
   netlify dev
   ```
   La aplicación se abrirá en `http://localhost:8888`, con las funciones disponibles.

## Uso

1. **Accede al formulario:**
   - Navega a la página principal (`/`) para ver el formulario de entrada.

2. **Ingresa tus datos:**
   - **Nivel:** Elige entre principiante, intermedio o avanzado.
   - **Objetivo:** Selecciona fuerza, hipertrofia o resistencia.
   - **Días:** Especifica cuántos días por semana quieres entrenar (1-7).
   - **Equipo:** Indica el equipo disponible (gym, casa, pesas).

3. **Genera la rutina:**
   - Haz clic en "Generar Rutina" para obtener una rutina personalizada generada por la Groq API a través de Netlify Functions.

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
├── functions/         # Funciones de Netlify (generateRoutine.js)
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

## Configuración segura de la clave API de Groq

Este proyecto utiliza la Groq API mediante un backend seguro con Netlify Functions para proteger la clave `GROQ_API_KEY`:

### Uso de Netlify Functions

1. **No expongas la clave en el frontend:**
   - La clave `GROQ_API_KEY` no se incluye en el código del cliente ni en un archivo `.env` subido a GitHub.

2. **Configura la clave en Netlify:**
   - Ve a tu sitio en [Netlify Dashboard](https://app.netlify.com).
   - Navega a **Settings** > **Environment variables**.
   - Añade:
     ```
     Key: GROQ_API_KEY
     Value: tu_clave_de_groq
     ```
   - Esta variable estará disponible en las funciones de Netlify como `process.env.GROQ_API_KEY`.

3. **Desarrollo local:**
   - Instala Netlify CLI:
     ```bash
     npm install -g netlify-cli
     ```
   - Crea un archivo `.env` local (no lo subas a GitHub):
     ```
     GROQ_API_KEY=tu_clave_aqui
     ```
   - Ejecuta localmente con:
     ```bash
     netlify dev
     ```
   - Esto inicia el servidor en `http://localhost:8888` y hace que las funciones estén disponibles.

4. **Llamada desde el frontend:**
   - El archivo `routineSlice.ts` está configurado para llamar a la función Netlify (`/.netlify/functions/generateRoutine`), que maneja la interacción con la Groq API de forma segura.

### Nota de seguridad

Al usar Netlify Functions, la clave API nunca se expone en el frontend, ya que las solicitudes a la Groq API se realizan desde el servidor. Esto es mucho más seguro que incrustar la clave en el build de React.

Consulta la documentación de [Netlify Functions](https://docs.netlify.com/functions/overview/) y [Groq API](https://console.groq.com/docs) para más detalles.

## Despliegue

1. Conecta tu repositorio a Netlify:
   - Ve a [Netlify](https://app.netlify.com), selecciona "Add new site" > "Import an existing project", y elige tu repositorio `myvoice`.
2. Configura el build:
   - Build command: `npm run build`
   - Publish directory: `build`
   - Environment variables: Añade `GROQ_API_KEY` como se explicó.
3. Despliega:
   - Haz clic en "Deploy site".

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

