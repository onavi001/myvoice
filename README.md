# MyVoice - Workout Routine Generator

![React](https://img.shields.io/badge/React-18.2.0-blue) ![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue) ![Redux](https://img.shields.io/badge/Redux_Toolkit-1.9-purple) ![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4-teal) ![Groq API](https://img.shields.io/badge/Groq_API-Free-green) ![YouTube API](https://img.shields.io/badge/YouTube_API-Free-red) ![Netlify](https://img.shields.io/badge/Netlify_Functions-Free-orange)

**MyVoice** es una aplicación web construida con React, TypeScript, Redux Toolkit y Tailwind CSS, diseñada para generar rutinas de gimnasio personalizadas utilizando la inteligencia artificial de la Groq API. Incluye videos educativos de YouTube cargados dinámicamente para cada ejercicio, optimizados para evitar solicitudes repetidas mediante almacenamiento local.

## Características

- **Generación de rutinas personalizadas:** Ingresa tu nivel (principiante, intermedio, avanzado), objetivo (fuerza, hipertrofia, resistencia), días de entrenamiento y equipo para obtener una rutina detallada en formato JSON.
- **Interfaz intuitiva:** Lista colapsable de ejercicios por día con videos de YouTube que muestran la técnica correcta y los músculos trabajados.
- **Persistencia local:** Las rutinas y el progreso se almacenan en Local Storage, incluyendo URLs de videos para evitar múltiples solicitudes a la YouTube API.
- **Estado global con Redux:** Manejo eficiente del estado con reducers modulares (`routine` y `progress`) para una arquitectura escalable.
- **Diseño responsivo:** Optimizado para dispositivos móviles con Tailwind CSS.
- **Backend seguro:** Solicitudes a la Groq API manejadas por Netlify Functions.
- **Autenticación y canciones:** Funcionalidades heredadas para gestionar usuarios y canciones (en desarrollo).

## Tecnologías utilizadas

- **Frontend:** React 18.2.0, TypeScript 5.0, Tailwind CSS 3.4
- **Gestión de estado:** Redux Toolkit 1.9
- **IA:** Groq API (nivel gratuito) con el modelo `llama3-8b-8192`
- **Videos dinámicos:** YouTube Data API v3
- **Backend:** Netlify Functions (nivel gratuito)
- **Enrutamiento:** React Router DOM
- **Bundler:** Vite

## Instalación

Sigue estos pasos para configurar el proyecto localmente:

### Prerrequisitos

- Node.js (v16 o superior)
- npm (v8 o superior)
- Netlify CLI (`npm install -g netlify-cli`)
- Una clave API de Groq (obténla en [Groq Console](https://console.groq.com))
- Una clave API de YouTube (obténla en [Google Cloud Console](https://console.cloud.google.com/))

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
   Nota: Asegúrate de que `node-fetch` esté instalado en la versión 2.x para compatibilidad con Netlify Functions:
   ```bash
   npm install node-fetch@2
   ```

3. **Configura las claves API localmente:**
   - Crea un archivo `.env` en la raíz del proyecto (no lo subas a GitHub):
     ```
     GROQ_API_KEY=tu_clave_groq
     VITE_YOUTUBE_API_KEY=tu_clave_youtube
     ```
   - Estas claves se usan para las pruebas locales con Netlify Functions y la integración de YouTube.

4. **Inicia la aplicación:**
   ```bash
   netlify dev
   ```
   La aplicación se abrirá en `http://localhost:8888`, con las funciones y videos disponibles.

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

4. **Visualiza y edita la rutina:**
   - Serás redirigido a `/routine`, donde puedes seleccionar un día específico de la rutina usando el menú desplegable.
   - Los ejercicios del día elegido aparecen como una lista colapsable. Haz clic en el nombre de un ejercicio para expandirlo y ver/editar sus detalles (series, repeticiones, peso, notas), o colapsarlo para ahorrar espacio, ideal para móviles.
   - Al expandir un ejercicio, se muestra un video de YouTube educativo cargado dinámicamente desde la YouTube Data API la primera vez y almacenado en Local Storage para evitar solicitudes repetidas, acompañado de una descripción sobre los músculos trabajados.
   - Haz clic en "Guardar cambios y registrar progreso" para actualizar la rutina y añadir una entrada al historial de progreso en Local Storage.

5. **Registra y edita tu progreso:**
   - Desde `/routine`, haz clic en "Ver Progreso" para ir a `/progress`.
   - Usa el formulario para registrar nuevo progreso manualmente, o edita entradas existentes en la tabla haciendo clic en "Editar" y guardando los cambios.
   - El historial de progreso persiste en Local Storage y puede ser limpiado con "Limpiar Historial".

6. **Limpia la rutina:**
   - Desde la página principal, haz clic en "Limpiar Rutina" para eliminar la rutina actual del estado y del Local Storage (no afecta el progreso).

## Estructura del proyecto

```
src/
├── components/         # Componentes reutilizables (Navbar, etc.)
├── pages/             # Páginas de la aplicación (FormPage, RoutinePage, ProgressPage, etc.)
│   ├── FormPage/
│   ├── RoutinePage/
│   └── ProgressPage/
├── slices/            # Slices de Redux (routine, progress)
│   ├── routineSlice.ts
│   └── progressSlice.ts
├── store/             # Configuración del store de Redux
├── functions/         # Funciones de Netlify (generateRoutine.cjs)
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
          "rest": "60 seconds",
          "videoUrl": "https://www.youtube.com/embed/vthMCtgQ_TY"
        },
        {
          "name": "Leg Press",
          "muscle_group": "Quads",
          "sets": 3,
          "reps": 12,
          "weight": "Light 10-20kg",
          "rest": "60 seconds",
          "videoUrl": "https://www.youtube.com/embed/IZxyjW7MPJQ"
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
   - Navega a **Settings > Environment variables**.
   - Añade:
     ```
     Key: GROQ_API_KEY
     Value: tu_clave_groq
     ```

3. **Desarrollo local:**
   - Usa el `.env` local como se describe en la sección de instalación.

### Nota técnica

Netlify Functions usa CommonJS por defecto. El archivo `generateRoutine.cjs` está escrito en CommonJS para compatibilidad con `node-fetch@2`.

## Despliegue

1. Conecta tu repositorio a Netlify:
   - Ve a [Netlify](https://app.netlify.com), selecciona "Add new site" > "Import an existing project", y elige tu repositorio `myvoice`.
2. Configura el build:
   - Build command: `npm run build`
   - Publish directory: `build`
   - Environment variables:
     ```
     Key: GROQ_API_KEY
     Value: tu_clave_groq
     Key: VITE_YOUTUBE_API_KEY
     Value: tu_clave_youtube
     ```
3. Despliega:
   - Haz clic en "Deploy site".

## Contribuir

¡Las contribuciones son bienvenidas! Si quieres mejorar el proyecto:

1. Haz un fork del repositorio.
2. Crea una rama para tu funcionalidad (`git checkout -b feature/nueva-funcionalidad`).
3. Commitea tus cambios (`git commit -m "Añade nueva funcionalidad"`).
4. Sube tu rama (`git push origin feature/nueva-funcionalidad`).
5. Abre un Pull Request.

## Licencia

Este proyecto está bajo la [Licencia MIT](LICENSE).

## Autor

- **Oscar Ivan Perez Ibarra** - [GitHub](https://github.com/onavi001)
```

