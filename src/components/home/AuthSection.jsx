import React from 'react';
import { Link } from 'react-router-dom';

const AuthSection = () => {
  return (
    <div className="w-full bg-green-700 py-2">
      <div className="container mx-auto flex justify-end items-center px-4">
        {/* Botón de Registrarse */}
        <Link
          to="/register"
          className="bg-white text-black px-4 py-1 rounded-md text-sm font-medium mr-4 transition duration-300 hover:bg-gray-200"
        >
          Registrarse
        </Link>

        {/* Botón de Iniciar sesión */}
        <Link
          to="/login"
          className="bg-white text-black px-4 py-1 rounded-md text-sm font-medium transition duration-300 hover:bg-gray-200"
        >
          Iniciar sesión
        </Link>
      </div>
    </div>
  );
};

export default AuthSection;
