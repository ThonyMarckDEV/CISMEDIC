// MisPagos.jsx
import React, { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import SidebarCliente from "../../components/clienteComponents/SidebarCliente";
import jwtUtils from "../../utilities/jwtUtils";
import SweetAlert from "../../components/SweetAlert";
import AppointmentsList from "../../components/clienteComponents/AppointmentsList";

const MisPagos = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const token = jwtUtils.getTokenFromCookie();
  const userId = jwtUtils.getIdUsuario(token);
  const userName = jwtUtils.getNombres(token);

  useEffect(() => {
    const status = searchParams.get("status");
    
    if (status) {
      const messages = {
        approved: { title: 'Éxito', text: '¡Pago exitoso! Tu cita está confirmada.', icon: 'success' },
        failure: { title: 'Error', text: 'No se pudo procesar el pago. Inténtalo nuevamente.', icon: 'error' },
        pending: { title: 'Pendiente', text: 'Pago en proceso. Te notificaremos cuando se complete.', icon: 'warning' }
      };

      const message = messages[status];
      if (message) {
        SweetAlert.showMessageAlert(message.title, message.text, message.icon);
      }

      setSearchParams({}, { replace: true });
    }
  }, [searchParams, setSearchParams]);

  return (
    <SidebarCliente>
      <div className="flex flex-col p-6 gap-6 md:-ml-64">
        {/* Header */}
        <div className="mb-8 bg-gradient-to-r from-blue-700 to-indigo-600 rounded-3xl shadow-lg overflow-hidden">
          <div className="px-8 py-12 relative">
            <div className="relative z-10">
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
                Bienvenido, {userName || "Usuario"}
              </h1>
              <p className="text-violet-100 text-lg">
                Administra tus pagos y citas médicas
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

        <AppointmentsList userId={userId} token={token} />
      </div>
    </SidebarCliente>
  );
};

export default MisPagos;