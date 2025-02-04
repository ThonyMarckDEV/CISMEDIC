import React, { useEffect, useState } from 'react';
import Sidebar from '../../components/home/Sidebar';
import jwtUtils from '../../utilities/jwtUtils';

const Cliente = () => {
  const [nombreUsuario, setNombreUsuario] = useState('');

  useEffect(() => {
    const token = jwtUtils.getTokenFromCookie();
    if (token) {
      const nombre = jwtUtils.getNombres(token);
      if (nombre) {
        setNombreUsuario(nombre);
      }
    }
  }, []);

  return (
    <Sidebar>
      <div className="p-4">
        {/* Rectángulo con bordes redondos, color celeste oscuro y letras blancas */}
        <div className="bg-blue-400 text-white p-4 rounded-lg w-full max-w-xs -ml-40">
          <h1 className="text-2xl font-bold mb-4">Bienvenido, {nombreUsuario || 'Usuario'}</h1>
          <p>Esta es la página principal del cliente.</p>
        </div>
      </div>
    </Sidebar>
  );
};

export default Cliente;