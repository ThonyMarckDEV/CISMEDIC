import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import './index.css';
import API_BASE_URL from './js/urlHelper';
import WhatsAppIcon from './components/home/WhatsAppIcon'; // Asegúrate de importar el icono de WhatsApp
import jwtUtils from './utilities/jwtUtils';
import ErrorPage from './components/home/ErrorPage'; // Asegúrate de que la ruta sea correcta
//Contextos
//CONTEXT CLIENTE
import { CitasProvider } from './context/CitasContext';
import { PagosProvider } from './context/PagosContext';
//CONTEXT DOCTOR
import { CitasProviderDoctor } from './context/CitasContextDoctor';

import ScrollToTopButton from './components/home/ScrollToTopButton';
// Componentes Home
import Home from './ui/Home';
import Contacto from './ui/Contacto';
import StaffMedico from './ui/StaffMedico';
// UIS
import Login from './ui/Login';
import VerificarCorreoToken from './ui/VerificarCorreoToken';
// UI Cliente
import Cliente from './ui/clienteUI/Cliente';
import ClienteNuevaCita from './ui/clienteUI/ClienteNuevaCita';
import ClienteMisCitas from './ui/clienteUI/MisCitas';
import ClienteMisPagos from './ui/clienteUI/MisPagos';
import ClienteFamiliares from './ui/clienteUI/Familiares';
import ClienteResultados from './ui/clienteUI/ResultadosLaboratorio';
import HistorialCitasCliente from './ui/clienteUI/HistorialCitas';
import HistorialPagosCliente from './ui/clienteUI/HistorialPagos';
// UI Doctor
import Doctor from './ui/doctorUI/Doctor';
import MisCitasDoctor from './ui/doctorUI/MisCitasDoctor';
import HistorialCitasAtendidasDoctor from './ui/doctorUI/HistorialCitasAtendidasDoctor';
import HorariosDoctor from './ui/doctorUI/MisHorarios';

// UI AUTH
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
        user: 'Usuario actual',
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
        user: 'Usuario actual',
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
      {/* Rutas públicas */}
      <Route path="/" element={<ProtectedRouteHome element={<><WhatsAppIcon /><ScrollToTopButton /><Home /></>} />} />
      <Route path="/login" element={<ProtectedRouteHome element={<Login />} />} />
      <Route path="/register" element={<ProtectedRouteHome element={<Register />} />} />
      <Route path="/verificar-correo-token" element={<VerificarCorreoToken />} />
      <Route path="/contacto" element={<Contacto />} />
      <Route path="/staffmedico" element={<StaffMedico />} />
      

      {/* Rutas del cliente (envueltas en PagosProvider y CitasProvider) */}
      <Route
        path="/cliente"
        element={
          <PagosProvider>
            <CitasProvider>
              <ProtectedRouteCliente element={<Cliente />} />
            </CitasProvider>
          </PagosProvider>
        }
      />
      <Route
        path="/cliente/nuevacita"
        element={
          <PagosProvider>
            <CitasProvider>
              <ProtectedRouteCliente element={<ClienteNuevaCita />} />
            </CitasProvider>
          </PagosProvider>
        }
      />
      <Route
        path="/cliente/miscitas"
        element={
          <PagosProvider>
            <CitasProvider>
              <ProtectedRouteCliente element={<ClienteMisCitas />} />
            </CitasProvider>
          </PagosProvider>
        }
      />
      <Route
        path="/cliente/mispagos"
        element={
          <PagosProvider>
            <CitasProvider>
              <ProtectedRouteCliente element={<ClienteMisPagos />} />
            </CitasProvider>
          </PagosProvider>
        }
      />
      <Route
        path="/cliente/familiares"
        element={
          <PagosProvider>
            <CitasProvider>
              <ProtectedRouteCliente element={<ClienteFamiliares />} />
            </CitasProvider>
          </PagosProvider>
        }
      />
      <Route
        path="/cliente/resultadoslaboratorio"
        element={
          <PagosProvider>
            <CitasProvider>
              <ProtectedRouteCliente element={<ClienteResultados />} />
            </CitasProvider>
          </PagosProvider>
        }
      />
      <Route
        path="/cliente/historialcitas"
        element={
          <PagosProvider>
            <CitasProvider>
              <ProtectedRouteCliente element={<HistorialCitasCliente />} />
            </CitasProvider>
          </PagosProvider>
        }
      />
      <Route
        path="/cliente/historialpagos"
        element={
          <PagosProvider>
            <CitasProvider>
              <ProtectedRouteCliente element={<HistorialPagosCliente />} />
            </CitasProvider>
          </PagosProvider>
        }
      />



      {/* Rutas del doctor */}
      <Route
        path="/doctor"
        element={
            <CitasProviderDoctor>
              <ProtectedRouteRolDoctor element={<Doctor />} />
            </CitasProviderDoctor>
        }
      />

      <Route
        path="/doctor/miscitas"
        element={
            <CitasProviderDoctor>
              <ProtectedRouteRolDoctor element={<MisCitasDoctor />} />
            </CitasProviderDoctor>
        }
      />

      <Route
        path="/doctor/historialcitas"
        element={
            <CitasProviderDoctor>
              <ProtectedRouteRolDoctor element={<HistorialCitasAtendidasDoctor />} />
            </CitasProviderDoctor>
        }
      />

      <Route
        path="/doctor/mishorarios"
        element={
            <CitasProviderDoctor>
              <ProtectedRouteRolDoctor element={<HorariosDoctor />} />
            </CitasProviderDoctor>
        }
      />

      {/* Ruta de error */}
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