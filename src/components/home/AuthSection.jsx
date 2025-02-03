import React from 'react';
import { Link } from 'react-router-dom';

const AuthSection = () => {
  return (
    <div className="w-full bg-gray-200 py-2">
      <div className="container mx-auto flex justify-end items-center px-4">
        {/* Botón de Registrarse */}
        <Link
          to="/registro"
          className="bg-black text-white px-4 py-1 rounded-md text-sm font-medium mr-4 transition duration-300 hover:bg-gray-800"
        >
          Registrarse
        </Link>

        {/* Botón de Iniciar sesión */}
        <Link
          to="/login"
          className="bg-black text-white px-4 py-1 rounded-md text-sm font-medium transition duration-300 hover:bg-gray-800"
        >
          Iniciar sesión
        </Link>
      </div>
    </div>
  );
};

export default AuthSection;
