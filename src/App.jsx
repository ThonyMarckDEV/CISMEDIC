import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import './index.css';
import API_BASE_URL from './js/urlHelper';
import WhatsAppIcon from './components/home/WhatsAppIcon'; // Asegúrate de importar el icono de WhatsApp
import jwtUtils from './utilities/jwtUtils';
import ErrorPage from './components/home/ErrorPage'; // Asegúrate de que la ruta sea correcta
import { CitasProvider } from './context/CitasContext';
import { PagosProvider } from './context/PagosContext';
import ScrollToTopButton from './components/home/ScrollToTopButton';

// Componentes Home
import Home from './ui/Home';
import Contacto from './ui/Contacto';

// UIS
import Login from './ui/Login';
import VerificarCorreoToken from './ui/VerificarCorreoToken';

//UI SUPER ADMIN


//UI Cliente
import Cliente from './ui/clienteUI/Cliente';
import ClienteNuevaCita from './ui/clienteUI/ClienteNuevaCita';
import ClienteMisCitas from './ui/clienteUI/MisCitas';
import ClienteMisPagos from './ui/clienteUI/MisPagos';
import ClienteFamiliares from './ui/clienteUI/Familiares';
import ClienteResultados from './ui/clienteUI/ResultadosLaboratorio';

//UI AUTH
import Register from './ui/Register';


// Utilities
import ProtectedRouteHome from './utilities/ProtectedRouteHome';
import ProtectedRouteCliente from './utilities/ProtectedRouteRolCliente';
import ProtectedRouteRolSuperAdmin from './utilities/ProtectedRouteRolSuperAdmin';
import ProtectedRouteRolDoctor from './utilities/ProtectedRouteRolDoctor';


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

          <Route path="/register" element={<ProtectedRouteHome element={<Register />} />} />

          <Route path="/verificar-correo-token" element={<VerificarCorreoToken />} />

          <Route path="/contacto" element={<Contacto />} />

          {/* Rutas SuperAdmin */}

  
          {/* Rutas cliente */}
            <Route path="/cliente" element={<ProtectedRouteCliente  element={<Cliente />} />} />
            <Route path="/cliente/nuevacita" element={<ProtectedRouteCliente element={<ClienteNuevaCita />}  />} />
            <Route path="/cliente/miscitas" element={<ProtectedRouteCliente element={<ClienteMisCitas />} />}/>
            <Route path="/cliente/mispagos" element={<ProtectedRouteCliente element={<ClienteMisPagos />} />}/>
            <Route path="/cliente/familiares" element={<ProtectedRouteCliente element={<ClienteFamiliares />} />}/>
            <Route path="/cliente/resultadoslaboratorio" element={<ProtectedRouteCliente element={<ClienteResultados />} />}/>
            

          <Route path="*" element={<ErrorPage />} />
        </Routes>
    );
  }
  
  function App() {
    return (
      <PagosProvider>
          <CitasProvider>
            <Router>
              <AppContent />
            </Router>
          </CitasProvider>
      </PagosProvider>
    );
  }
  
  export default App;