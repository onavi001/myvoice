# MyVoice App

A web application to track gym routines, weight, and workout statistics. The app is built with **Vite**, **React**, **TypeScript**, and **Tailwind CSS**.

## Project Structure

The project structure follows a standard convention, organized for easy development and future scalability:
myvoice/
├── public/
│   ├── index.html                  # Main HTML file
│   └── favicon.ico                 # App icon
├── src/
│   ├── assets/                     # Static files like images or fonts
│   ├── components/                 # Reusable React components
│   │   ├── WorkoutForm.tsx         # Workout registration form
│   │   ├── WorkoutHistory.tsx      # List or table showing workout history
│   │   ├── Statistics.tsx          # Progress graphs and statistics
│   │   └── Header.tsx              # App header component
│   ├── hooks/                      # Custom hooks
│   │   └── useLocalStorage.ts      # Hook for persisting data in localStorage
│   ├── utils/                      # Utility functions (e.g., progress calculations)
│   │   └── dataTransformations.ts  # Functions for transforming data (averages, etc.)
│   ├── App.tsx                     # Main app component
│   ├── index.tsx                   # Entry point for the app
│   └── index.css                   # Global styles, including Tailwind CSS
├── tailwind.config.js              # Tailwind CSS configuration
├── postcss.config.js               # PostCSS configuration
├── tsconfig.json                   # TypeScript configuration
├── package.json                    # Dependencies and project scripts
└── README.md                       # This file

## Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your_username/myvoice.git
   cd myvoice
   npm install
   npm run dev