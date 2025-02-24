import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import './index.css';
import API_BASE_URL from './js/urlHelper';
import WhatsAppIcon from './components/home/WhatsAppIcon'; 
import jwtUtils from './utilities/jwtUtils';
import ErrorPage from './components/home/ErrorPage'; 
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
import PerfilDoctorSeleccionado from './ui/PerfilDoctorSeleccionado';
import SolicitarRestablecerPassword from './components/home/SolicitarRestablecerContraseña';
import RestablecerPassword from './components/home/RestablecerContraseña';

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
import PerfilCliente from './ui/clienteUI/PerfilCliente';
import SettingsCliente from './ui/clienteUI/Settings';

// UI Doctor
import Doctor from './ui/doctorUI/Doctor';
import MisCitasDoctor from './ui/doctorUI/MisCitasDoctor';
import HistorialCitasAtendidasDoctor from './ui/doctorUI/HistorialCitasAtendidasDoctor';
import HorariosDoctor from './ui/doctorUI/MisHorarios';
import PerfilDoctor from './ui/doctorUI/PerfilDoctor';

// UI Admin
import Admin from './ui/adminUI/Admin';
import SubirResultados from './ui/adminUI/SubirResultados';
import ResultadosLaboratoriosClientes from './ui/adminUI/ResultadosLaboratorioClientes';
import DisponibilidadDoctores from './ui/adminUI/DisponibilidadDoctores';
import AgendarCitaCliente from './ui/adminUI/AgendarCitaCliente';
import HistorialPagosClientes from './ui/adminUI/HistorialPagosClientes';

//UI SuperAdmin
import SuperAmin from './ui/superadminUI/SuperAdmin';
import GestionarUsuarios from './ui/superadminUI/GestionarUsuarios';
import GestionarEspecialidades from './ui/superadminUI/GestionarEspecialidades';
import AsignarEspecialidadDoctor from './ui/superadminUI/AsignarEspecialidad';
import SettingsSuperAdmin from './ui/superadminUI/SettingsSuperAdmin';
import HistorialPagosClientesSuperAdmin from './ui/superadminUI/HistorialPagosClientes';

// UI AUTH
import Register from './ui/Register';

// Utilities
import ProtectedRouteHome from './utilities/ProtectedRouteHome';
import ProtectedRouteCliente from './utilities/ProtectedRouteRolCliente';
import ProtectedRouteRolSuperAdmin from './utilities/ProtectedRouteRolSuperAdmin';
import ProtectedRouteRolDoctor from './utilities/ProtectedRouteRolDoctor';
import ProtectedRouteRolAdmin from './utilities/ProtectedRouteRolAdmin';

// Scripts
import { updateLastActivity } from './js/lastActivity';




function AppContent() {
  const location = useLocation();

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


  return (
    <Routes>
      {/* Rutas públicas */}
      <Route path="/" element={<ProtectedRouteHome element={<><WhatsAppIcon /><ScrollToTopButton /><Home /></>} />} />
      <Route path="/login" element={<ProtectedRouteHome element={<Login />} />} />
      <Route path="/register" element={<ProtectedRouteHome element={<Register />} />} />
      <Route path="/verificar-correo-token" element={<VerificarCorreoToken />} />
      <Route path="/contacto" element={<Contacto />} />
      <Route path="/staffmedico" element={<StaffMedico />} />
      {/* Ruta dinámica para el perfil del doctor */}
      <Route path="/perfildoctor/:idDoctor" element={<PerfilDoctorSeleccionado />} />
      {/* Ruta para restablecimeinto contrasena*/}
      <Route path="/solicitar-restablecer-password" element={<SolicitarRestablecerPassword />} />
      <Route path="/restablecer-password" element={<RestablecerPassword />} />

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

      <Route
        path="/cliente/perfil"
        element={
          <PagosProvider>
            <CitasProvider>
              <ProtectedRouteCliente element={<PerfilCliente />} />
            </CitasProvider>
          </PagosProvider>
        }
      />

     <Route
        path="/cliente/settings"
        element={
          <PagosProvider>
            <CitasProvider>
              <ProtectedRouteCliente element={<SettingsCliente />} />
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
      <Route
        path="/doctor/perfil"
        element={
            <CitasProviderDoctor>
              <ProtectedRouteRolDoctor element={<PerfilDoctor />} />
            </CitasProviderDoctor>
        }
      />


      {/* Rutas del admin */}
      <Route
        path="/admin"
        element={
          <ProtectedRouteRolAdmin element={<Admin />} />
        }
      />

      {/* Rutas del admin */}
      <Route
        path="/admin/subirresultados"
        element={
          <ProtectedRouteRolAdmin element={<SubirResultados />} />
        }
      />

      <Route
        path="/admin/resultadosclientes"
        element={
          <ProtectedRouteRolAdmin element={<ResultadosLaboratoriosClientes />} />
        }
      />

      <Route
        path="/admin/disponibilidaddoctores"
        element={
          <ProtectedRouteRolAdmin element={<DisponibilidadDoctores />} />
        }
      />

      <Route
        path="/admin/agendarcitacliente"
        element={
          <ProtectedRouteRolAdmin element={<AgendarCitaCliente />} />
        }
      />

      <Route
        path="/admin/pagosclientes"
        element={
          <ProtectedRouteRolAdmin element={<HistorialPagosClientes />} />
        }
      />


    {/* Rutas del superadmin */}
      <Route
        path="/superadmin"
        element={
          <ProtectedRouteRolSuperAdmin element={<SuperAmin />} />
        }
      />

      <Route
        path="/superadmin/gestionarusuarios"
        element={
          <ProtectedRouteRolSuperAdmin element={<GestionarUsuarios />} />
        }
      />

      <Route
        path="/superadmin/gestionarespecialidades"
        element={
          <ProtectedRouteRolSuperAdmin element={<GestionarEspecialidades />} />
        }
      />

      <Route
        path="/superadmin/asignarespecialidad"
        element={
          <ProtectedRouteRolSuperAdmin element={<AsignarEspecialidadDoctor />} />
        }
      />

      <Route
        path="/superadmin/pagosclientes"
        element={
          <ProtectedRouteRolSuperAdmin element={<HistorialPagosClientesSuperAdmin />} />
        }
      />

      <Route
        path="/superadmin/settings"
        element={
          <ProtectedRouteRolSuperAdmin element={<SettingsSuperAdmin />} />
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