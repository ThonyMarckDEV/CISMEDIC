import React, { useEffect, useState } from 'react';
import Sidebar from '../../components/home/Sidebar';
import jwtUtils from '../../utilities/jwtUtils';

const Cliente = () => {
  // Estado para almacenar el nombre del usuario
  const [nombreUsuario, setNombreUsuario] = useState('');

  // Obtener el nombre del usuario desde el token JWT
  useEffect(() => {
    const token = jwtUtils.getTokenFromCookie(); // Obtener el token desde la cookie
    if (token) {
      const nombre = jwtUtils.getNombres(token); // Pasar el token a getNombres
      if (nombre) {
        setNombreUsuario(nombre);
      }
    }
  }, []);

  return (
    <Sidebar>
      <div className="p-4">
        {/* Mostrar el nombre del usuario en el mensaje de bienvenida */}
        <h1 className="text-2xl font-bold mb-4">Bienvenido, {nombreUsuario || 'Usuario'}</h1>
        <p>Esta es la página principal del cliente.</p>
      </div>
    </Sidebar>
  );
};

export default Cliente;