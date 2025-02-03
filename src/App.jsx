import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import './index.css';
import API_BASE_URL from './js/urlHelper';
import WhatsAppIcon from './components/home/WhatsAppIcon'; // Asegúrate de importar el icono de WhatsApp
import jwtUtils from './utilities/jwtUtils';
import ErrorPage from './components/home/ErrorPage'; // Asegúrate de que la ruta sea correcta
import { FavoritosProvider } from './context/FavoritosContext';
import ScrollToTopButton from './components/home/ScrollToTopButton';

// Componentes Home
import Home from './ui/Home';

// UIS
import Login from './ui/Login';

  //UI SUPER ADMIN

  
  //UI ADMIN


// Utilities
import ProtectedRouteHome from './utilities/ProtectedRouteHome';
import ProtectedRouteRolSuperAdmin from './utilities/ProtectedRouteRolSuperAdmin';
import ProtectedRouteRolAdmin from './utilities/ProtectedRouteRolAdmin';


// Scripts
 import { updateLastActivity } from './js/lastActivity';

function AppContent() {
  const location = useLocation();
  const [globalError, setGlobalError] = useState(null);

  useEffect(() => {
    const token = jwtUtils.getTokenFromCookie();
  
    if (token) {
      updateLastActivity();
  
      const intervalId = setInterval(() => {
        updateLastActivity();
      }, 10000);
  
      return () => clearInterval(intervalId);
    }
  }, [location.pathname]);
  
    // Capturar errores globales
    useEffect(() => {
      const handleGlobalError = (event) => {
        const newError = {
          message: event.error?.message || 'Error desconocido',
          severity: 'critical',
          location: event.filename || 'Unknown location',
          timestamp: new Date().toISOString(),
          stack: event.error?.stack,
          user: 'Usuario actual'
        };
        setGlobalError(newError);
      };

      const handleUnhandledRejection = (event) => {
        const newError = {
          message: event.reason?.message || 'Promise rejection no manejada',
          severity: 'warning',
          location: 'Promise rejection',
          timestamp: new Date().toISOString(),
          stack: event.reason?.stack,
          user: 'Usuario actual'
        };
        setGlobalError(newError);
      };
  
      window.addEventListener('error', handleGlobalError);
      window.addEventListener('unhandledrejection', handleUnhandledRejection);
  
      return () => {
        window.removeEventListener('error', handleGlobalError);
        window.removeEventListener('unhandledrejection', handleUnhandledRejection);
      };
    }, []);

    return (
        <Routes>
          <Route path="/" element={<ProtectedRouteHome element={<><WhatsAppIcon /><ScrollToTopButton /><Home /></>} />} />


          <Route path="/login" element={<ProtectedRouteHome element={<Login />} />} />
  
          {/* Rutas SuperAdmin */}

  
          {/* Rutas Admin */}

  
          <Route path="*" element={<ErrorPage />} />
        </Routes>
    );
  }
  
  function App() {
    return (
        <Router>
          <AppContent />
        </Router>
    );
  }
  
  export default App;