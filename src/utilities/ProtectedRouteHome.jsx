import React from 'react';
import { Navigate } from 'react-router-dom';
import jwtUtils from '../utilities/jwtUtils'; // Asegúrate de tener esta utilidad para decodificar el token

const ProtectedRoute = ({ element }) => {
  // Obtener el JWT desde localStorage
  const token = jwtUtils.getTokenFromCookie();
  
  if (token) {
    // Si hay token, decodificar el JWT y verificar el estado de emailVerified
    const role = jwtUtils.getUserRole(token); // Extraer el rol del token

     // Redirigir según el rol del usuario
     switch (role) {
      case 'superadmin':
        return <Navigate to="/superAdmin/dashboard" />;
        return element;
      case 'admin':
        return <Navigate to="/admin/productos/agregar" />;
        return element;
    }
  }

  // Si no hay token, se muestra el elemento original
  return element;
};

export default ProtectedRoute;
