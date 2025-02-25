import React from "react";
import { useNavigate } from "react-router-dom";

const Navbar: React.FC = () => {
  const navigate = useNavigate();

  return (
    <nav className="bg-[#1A1A1A] p-2 shadow-sm border-b border-[#4A4A4A]">
      <div className="max-w-md mx-auto flex justify-between items-center">
        <h1
          className="text-sm font-sans font-semibold text-white cursor-pointer truncate"
          onClick={() => navigate("/")}
        >
          MyVoice
        </h1>
        <div className="space-x-2">
          <button
            onClick={() => navigate("/")}
            className="text-[#B0B0B0] hover:text-white transition-colors text-xs"
          >
            Inicio
          </button>
          <button
            onClick={() => navigate("/routine")}
            className="text-[#B0B0B0] hover:text-white transition-colors text-xs"
          >
            Rutina
          </button>
          <button
            onClick={() => navigate("/progress")}
            className="text-[#B0B0B0] hover:text-white transition-colors text-xs"
          >
            Progreso
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;