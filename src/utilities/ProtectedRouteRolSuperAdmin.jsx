// src/components/ProtectedRoute.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import jwtUtils from '../utilities/jwtUtils'; // Utilidad para emailVerified


const ProtectedRouteRolSuperAdmin = ({ element }) => {
  // Obtener el JWT desde la cookie
  const token = jwtUtils.getTokenFromCookie();

  if (!token) {
    // Si no hay token, redirigir al login
    return <Navigate to="/" />;
  }

  try {
    // Decodificar el JWT
    const userRole = jwtUtils.getUserRole(token); // Extraer el rol del token

    if (userRole === 'admin') {
      return <Navigate to="/admin" />;
    }
    return element;
  } catch (error) {
    console.error('Error al decodificar el token:', error);
    return <Navigate to="/" />; // Token inválido
  }
};

export default ProtectedRouteRolSuperAdmin;
