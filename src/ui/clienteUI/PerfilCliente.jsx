import { useState, useEffect } from "react";
import { Calendar, Clock, XCircle } from "lucide-react";
import SidebarCliente from "../../components/clienteComponents/SidebarCliente";
import API_BASE_URL from "../../js/urlHelper";
import jwtUtils from "../../utilities/jwtUtils";
import PerfilClienteComponent from "../../components/clienteComponents/PerfilClienteComponent";

const PerfilCliente = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const token = jwtUtils.getTokenFromCookie();
  const userId = jwtUtils.getIdUsuario(token);
  const userName = jwtUtils.getNombres(token);

  return (
    <SidebarCliente>
      <div className="md:-ml-64">
        <PerfilClienteComponent />
      </div>
    </SidebarCliente>
  );
};

export default PerfilCliente;