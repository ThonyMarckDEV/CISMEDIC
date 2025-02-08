import { useState, useEffect } from "react";
import { Calendar, Clock, XCircle } from "lucide-react";
import SidebarCliente from "../../components/clienteComponents/SidebarCliente";
import API_BASE_URL from "../../js/urlHelper";
import jwtUtils from "../../utilities/jwtUtils";
import PerfilDoctorComponent from "../../components/doctorComponents/ProfileDoctorComponent";

const PerfilDoctor = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const token = jwtUtils.getTokenFromCookie();
  const userId = jwtUtils.getIdUsuario(token);
  const userName = jwtUtils.getNombres(token);

  return (
    <SidebarCliente>
      <div className="flex flex-col p-6 gap-6 md:-ml-64">
       
        {/* Loading State */}
        {loading && (
          <div className="text-center text-gray-500 flex flex-col items-center justify-center gap-2">
            <Clock className="h-8 w-8 animate-spin text-green-600" />
            <p>Cargando tu perfil...</p>
          </div>
        )}
        <PerfilDoctorComponent />
      </div>
    </SidebarCliente>
  );
};

export default PerfilDoctor;