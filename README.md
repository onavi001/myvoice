# MyVoice - Generador de Rutinas de Entrenamiento Personalizadas

![React](https://img.shields.io/badge/React-18.2.0-blue) ![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue) ![Redux](https://img.shields.io/badge/Redux_Toolkit-1.9-purple) ![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4-teal) ![Groq API](https://img.shields.io/badge/Groq_API-Free-green) ![YouTube API](https://img.shields.io/badge/YouTube_API-Free-red) ![Netlify](https://img.shields.io/badge/Netlify_Functions-Free-orange)

**MyVoice** es una aplicación web construida con React, TypeScript, Redux Toolkit y Tailwind CSS, diseñada para generar y gestionar múltiples rutinas de entrenamiento personalizadas utilizando inteligencia artificial (Groq API) a través de Netlify Functions. Optimizada para móviles con un elegante tema negro predominante y detalles en blanco, permite crear, editar y eliminar rutinas manualmente, incluye videos educativos de YouTube cargados dinámicamente, y almacena datos en Local Storage para una experiencia sin interrupciones.

## Características

- **Generación de rutinas con IA:** Crea rutinas personalizadas ingresando nivel, objetivo, días, equipo y notas, usando `mixtral-8x7b-32768` de Groq API.
- **Gestión manual de rutinas:** Agrega, edita y elimina rutinas manualmente con control total sobre días, ejercicios, músculos trabajados, calentamientos y explicaciones.
- **Interfaz elegante para móviles:** Selector de rutinas, días y ejercicios colapsables con videos de YouTube, optimizado para pantallas pequeñas.
- **Persistencia local:** Rutinas y progreso almacenados en Local Storage, incluyendo URLs de videos para eficiencia.
- **Estado global con Redux:** Reducers modulares (`routine` y `progress`) para escalabilidad y soporte multi-rutina.
- **Diseño responsivo:** Tema negro predominante con Tailwind CSS en toda la aplicación.

## Tecnologías utilizadas

- **Frontend:** React 18.2.0, TypeScript 5.0, Tailwind CSS 3.4
- **Gestión de estado:** Redux Toolkit 1.9
- **IA:** Groq API (nivel gratuito) con el modelo `mixtral-8x7b-32768`
- **Videos dinámicos:** YouTube Data API v3
- **Backend:** Netlify Functions (nivel gratuito)
- **Enrutamiento:** React Router DOM con rutas como objetos (`RouteObject[]`)
- **Bundler:** Vite

## Instalación

### Prerrequisitos

- Node.js (v16 o superior)
- npm (v8 o superior)
- Netlify CLI (`npm install -g netlify-cli`)
- Clave API de Groq ([Groq Console](https://console.groq.com))
- Clave API de YouTube ([Google Cloud Console](https://console.cloud.google.com/))

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
   Nota: Asegúrate de que `node-fetch` esté en versión 2.x para Netlify Functions:
   ```bash
   npm install node-fetch@2
   ```

3. **Configura las claves API localmente:**
   - Crea un archivo `.env` en la raíz del proyecto (no lo subas a GitHub):
     ```
     GROQ_API_KEY=tu_clave_groq
     VITE_YOUTUBE_API_KEY=tu_clave_youtube
     ```

4. **Inicia la aplicación:**
   ```bash
   netlify dev
   ```
   La aplicación se abrirá en `http://localhost:8888`.

## Uso

1. **Accede al formulario:**
   - Navega a `/` para generar una rutina con IA o agregar una manualmente.

2. **Genera una rutina con IA:**
   - Ingresa nivel (principiante/intermedio/avanzado), objetivo (fuerza/hipertrofia/resistencia), días (1-7), equipo (gym/casa/pesas) y notas opcionales.
   - Haz clic en "Generar Rutina" para crear una rutina con IA.

3. **Agrega una rutina manualmente:**
   - Desde `/`, haz clic en "Agregar Rutina Manual" para ir a `/routine/add-routine`.
   - Completa el formulario con nombre, días, ejercicios (nombre, músculo, series, repeticiones, peso, descanso, consejos), músculos trabajados, calentamientos y explicación.
   - Guarda para añadirla a tus rutinas.

4. **Visualiza y gestiona rutinas:**
   - En `/routine`, selecciona una rutina y un día desde las pestañas.
   - Expande ejercicios para ver videos de YouTube, editar detalles (series, repeticiones, peso, notas) y guardar en progreso.
   - Usa "Editar Rutina" (`/routine/edit-routine/:index`) para modificarla o "Eliminar Rutina" para borrarla.

5. **Registra progreso:**
   - En `/progress`, registra y edita tu historial de progreso para cada rutina.

## Estructura del proyecto

```
src/
├── components/         # Componentes reutilizables (Navbar, Layout, etc.)
├── pages/             # Páginas y sus rutas como objetos
│   ├── FormPage/       # Formulario de generación automática
│   ├── RoutinePage/    # Visualización y gestión de rutinas
|   │   ├── AddRoutinePage/ # Página para agregar rutinas manualmente
|   │   ├── EditRoutinePage/ # Página para editar rutinas
│   └── ProgressPage/   # Registro de progreso
├── slices/            # Slices de Redux (routine, progress)
│   ├── routine/
│   └── progress/
├── store/             # Configuración del store de Redux
├── functions/         # Funciones de Netlify (generateRoutine.cjs)
└── App.tsx            # Componente principal con enrutamiento
```

## Ejemplo de rutina

Para `name: "Rutina de Fuerza"`, `level: "principiante"`, `goal: "fuerza"`, `days: "3"`, `equipment: "gym"`, `notes: "Incluir más ejercicios de peso libre"`:

```json
{
  "routine": [
    {
      "day": "Pecho y Tríceps",
      "exercises": [
        {
          "name": "Press de banca con barra",
          "muscle_group": "Pecho",
          "sets": 4,
          "reps": 8,
          "weight": "15-20kg",
          "rest": "90s",
          "tips": ["Codas a 45°", "Controla el descenso"]
        },
        {
          "name": "Fondos en paralelas",
          "muscle_group": "Tríceps",
          "sets": 3,
          "reps": 10,
          "weight": "Peso corporal",
          "rest": "60s",
          "tips": ["Cuerpo recto", "Baja a 90°"]
        },
        {
          "name": "Aperturas con mancuernas",
          "muscle_group": "Pecho",
          "sets": 3,
          "reps": 12,
          "weight": "8-12kg",
          "rest": "75s",
          "tips": ["Abre controladamente", "No bajes mucho"]
        }
      ],
      "musclesWorked": ["pectorales", "tríceps", "hombros"],
      "warmUpOptions": ["5 min cinta", "rotaciones de hombros", "flexiones ligeras"],
      "explanation": "Fuerza para pecho y tríceps con peso libre, ideal para principiantes."
    }
  ]
}
```

## Configuración segura de la clave API de Groq

1. **No expongas la clave en el frontend:**
   - `GROQ_API_KEY` se usa solo en Netlify Functions.

2. **Configura en Netlify:**
   - En [Netlify Dashboard](https://app.netlify.com), ve a **Settings > Environment variables**.
   - Añade:
     ```
     Key: GROQ_API_KEY
     Value: tu_clave_groq
     ```

3. **Desarrollo local:**
   - Usa el `.env` local como se describe en "Instalación".

## Despliegue

1. Conecta tu repositorio a Netlify:
   - En [Netlify](https://app.netlify.com), selecciona "Add new site" > "Import an existing project".
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

¡Las contribuciones son bienvenidas!

1. Haz un fork del repositorio.
2. Crea una rama (`git checkout -b feature/nueva-funcionalidad`).
3. Commitea tus cambios (`git commit -m "Añade nueva funcionalidad"`).
4. Sube tu rama (`git push origin feature/nueva-funcionalidad`).
5. Abre un Pull Request.

## Próximos pasos

- Añadir validaciones a los formularios en `FormPage`, `AddRoutinePage`, y `EditRoutinePage`.
- Integrar gráficas en `ProgressPage` con Chart.js.
- Mejorar la gestión de rutinas con confirmaciones para eliminar (ej. modal).
- Explorar IndexedDB para almacenamiento avanzado.

## Licencia

Este proyecto está bajo la [Licencia MIT](LICENSE).

## Autor

- **Oscar Ivan Perez Ibarra** - [GitHub](https://github.com/onavi001)
