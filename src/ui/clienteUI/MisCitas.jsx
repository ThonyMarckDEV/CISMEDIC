import { useState, useEffect } from "react";
import { Calendar, Clock, XCircle } from "lucide-react";
import SidebarCliente from "../../components/clienteComponents/SidebarCliente";
import API_BASE_URL from "../../js/urlHelper";
import jwtUtils from "../../utilities/jwtUtils";
import CardMisCitas from "../../components/clienteComponents/CardMisCitas"; // Importamos el componente
import WelcomeHeader from '../../components/WelcomeHeader';

const MisCitas = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const token = jwtUtils.getTokenFromCookie();
  const userId = jwtUtils.getIdUsuario(token);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        if (!userId || !token) {
          throw new Error("User ID or token not found");
        }
        const response = await fetch(`${API_BASE_URL}/api/citas/${userId}`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        if (!response.ok) {
          throw new Error(`Error ${response.status}: ${response.statusText}`);
        }
        const data = await response.json();
        setAppointments(data);
      } catch (err) {
        setError(err.message || "Error fetching appointments");
      } finally {
        setLoading(false);
      }
    };
    fetchAppointments();
  }, [userId, token]);

  return (
    <SidebarCliente>
      <div className="flex flex-col p-6 gap-6 md:-ml-64">

        <WelcomeHeader 
          customMessage="Aquí están tus citas médicas programadas."
        />

        {/* Loading State */}
        {loading && (
          <div className="text-center text-gray-500 flex flex-col items-center justify-center gap-2">
            <Clock className="h-8 w-8 animate-spin text-green-600" />
            <p>Cargando tus citas...</p>
          </div>
        )}
        {/* Appointment Cards */}
        {!loading && !error && appointments.length === 0 ? (
          <div className="text-center text-gray-500 flex flex-col items-center justify-center gap-2">
            <Calendar className="h-8 w-8 text-gray-500" />
            <p>No tienes citas programadas.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {appointments.map((appointment) => (
              <CardMisCitas key={appointment.idCita} appointment={appointment} />
            ))}
          </div>
        )}
      </div>
    </SidebarCliente>
  );
};

export default MisCitas;