import React from "react";

export const Navbar: React.FC = () => {
  return (
    <nav className="bg-blue-900 text-white p-4 flex justify-between items-center">
      <h1 className="text-xl font-bold">My Voice</h1>
      <div className="space-x-4">
        <a href="/" className="hover:text-orange-500">Inicio</a>
        <a href="/routine" className="hover:text-orange-500">Rutinas</a>
        <a href="/progress" className="hover:text-orange-500">Progreso</a>
        <a href="/profile" className="hover:text-orange-500">Perfil</a>
      </div>
    </nav>
  );
};
