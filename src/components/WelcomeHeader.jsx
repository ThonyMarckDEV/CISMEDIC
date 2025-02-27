import React, { useState, useEffect } from 'react';
import jwtUtils from '../utilities/jwtUtils';

const WelcomeHeader = ({ customMessage }) => {
  const [nombreUsuario, setNombreUsuario] = useState('Usuario');
  
  useEffect(() => {
    const token = jwtUtils.getTokenFromCookie();
    const nombre = jwtUtils.getNombres(token);
    if (nombre) setNombreUsuario(nombre);
  }, []);
  
  return (
    <div className="mb-8 bg-gradient-to-r from-green-600 to-green-800 rounded-2xl shadow-lg overflow-hidden">
      <div className="px-8 py-10 relative">
        <div className="relative z-10">
          <h1 className="text-3xl md:text-3xl font-light text-white mb-2">
            Bienvenido, <span className="font-medium">{nombreUsuario || "Usuario"}</span>
          </h1>
          <p className="text-green-100 text-lg font-light">
           {customMessage}
          </p>
        </div>
        <div className="absolute right-0 top-0 w-1/3 h-full opacity-10">
          <svg viewBox="0 0 100 100" className="h-full">
            <circle cx="80" cy="20" r="15" fill="white"/>
            <circle cx="20" cy="80" r="25" fill="white"/>
          </svg>
        </div>
      </div>
    </div>
  );
};

export default WelcomeHeader;