import { useState, useEffect } from "react";
import { Calendar, Clock, XCircle } from "lucide-react";
import SidebarCliente from "../../components/doctorComponents/SidebarDoctor";
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
      <div className="md:-ml-64">
        <PerfilDoctorComponent />
      </div>
    </SidebarCliente>
  );
};

export default PerfilDoctor;