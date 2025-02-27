// MisPagos.jsx
import React, { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import SidebarCliente from "../../components/clienteComponents/SidebarCliente";
import jwtUtils from "../../utilities/jwtUtils";
import SweetAlert from "../../components/SweetAlert";
import PagoLista from "../../components/clienteComponents/PagoLista";
import WelcomeHeader from '../../components/WelcomeHeader';

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
      <div className="bg-white flex flex-col p-6 gap-6 md:-ml-64">

        <WelcomeHeader 
          customMessage="Administra tus pagos."
        />

        <PagoLista userId={userId} token={token} />
      </div>
    </SidebarCliente>
  );
};

export default MisPagos;