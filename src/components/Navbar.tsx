import React from "react";
import { useNavigate } from "react-router-dom";

const Navbar: React.FC = () => {
  const navigate = useNavigate();

  return (
    <nav className="bg-black p-4 shadow-sm border-b border-gray-700">
      <div className="max-w-md mx-auto flex justify-between items-center">
        <h1
          className="text-xl font-sans font-semibold text-white cursor-pointer"
          onClick={() => navigate("/")}
        >
          MyVoice
        </h1>
        <div className="space-x-2">
          <button
            onClick={() => navigate("/")}
            className="text-gray-300 hover:text-white transition-colors text-sm"
          >
            Inicio
          </button>
          <button
            onClick={() => navigate("/routine")}
            className="text-gray-300 hover:text-white transition-colors text-sm"
          >
            Rutina
          </button>
          <button
            onClick={() => navigate("/progress")}
            className="text-gray-300 hover:text-white transition-colors text-sm"
          >
            Progreso
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;