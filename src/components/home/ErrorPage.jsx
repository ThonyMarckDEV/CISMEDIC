import React from 'react';
import { FaRegSadTear } from 'react-icons/fa'; 
import Navbar from './NavBar';

const ErrorPage = () => {
  return (
    <div className="bg-white min-h-screen flex flex-col">
      {/* Navbar */}
      <Navbar />

      {/* Contenido principal */}
      <div className="flex-grow flex justify-center items-center">
        <div className="text-center p-6 md:p-12">
          {/* Ícono */}
          <FaRegSadTear className="text-8xl text-yellow-500 mb-8 mx-auto" />

          {/* Título "404" en amarillo */}
          <h1 className="text-9xl font-bold text-yellow-500 mb-4">
            404
          </h1>

          {/* Texto en negro */}
          <p className="text-2xl text-black mb-8 max-w-2xl mx-auto">
            La página que buscas no existe o se ha movido. Verifica la URL o regresa al inicio.
          </p>

          {/* Botón elegante */}
          <a
            href="/"
            className="inline-block px-8 py-4 bg-black text-white text-lg font-semibold rounded-lg shadow-md hover:bg-gray-900 transition-all duration-300 transform hover:scale-105"
          >
            Volver al inicio
          </a>
        </div>
      </div>
    </div>
  );
};

export default ErrorPage;