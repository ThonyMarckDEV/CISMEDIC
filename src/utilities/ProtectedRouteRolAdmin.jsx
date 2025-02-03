// src/components/ProtectedRoute.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import jwtUtils from '../utilities/jwtUtils'; // Utilidad para emailVerified

const ProtectedRouteRolAdmin = ({ element }) => {
  // Obtener el JWT desde localStorage
  const token = jwtUtils.getTokenFromCookie();

  if (!token) {
    // Si no hay token, redirigir al login
    return <Navigate to="/" />;
  }

  try {
    // Decodificar el JWT
    const userRole = jwtUtils.getUserRole(token); // Extraer el rol del token
   
     if (userRole === 'superAdmin'){
      return <Navigate to="/superAdmin/dashboard" />;
    }
    return element;
  } catch (error) {
    console.error('Error al decodificar el token:', error);
    return <Navigate to="/" />; // Token inválido
  }
};

export default ProtectedRouteRolAdmin;
