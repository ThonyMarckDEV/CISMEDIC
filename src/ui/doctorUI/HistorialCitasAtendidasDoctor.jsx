import { useState, useEffect } from "react";
import { Calendar, Clock, XCircle } from "lucide-react";
import SidebarDoctor from "../../components/doctorComponents/SidebarDoctor";
import API_BASE_URL from "../../js/urlHelper";
import jwtUtils from "../../utilities/jwtUtils";
import CardHistorialCitasDoctor from "../../components/doctorComponents/CardHistorialCitasDoctor";

const HistorialCitasAtendidasDoctor = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filtroEstado, setFiltroEstado] = useState("todas"); // Estado del filtro
  const token = jwtUtils.getTokenFromCookie();
  const userId = jwtUtils.getIdUsuario(token);
  const userName = jwtUtils.getNombres(token);

  // Función para obtener las citas del doctor
  const fetchAppointments = async (estadoFiltro) => {
    try {
      if (!userId || !token) {
        throw new Error("User ID or token not found");
      }
      const response = await fetch(
        `${API_BASE_URL}/api/doctor/historialcitas/${userId}?estado=${estadoFiltro}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
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

  // Efecto para cargar las citas al cambiar el filtro
  useEffect(() => {
    fetchAppointments(filtroEstado);
  }, [filtroEstado]);

  return (
    <SidebarDoctor>
      <div className="flex flex-col p-6 gap-6 md:-ml-64">
        {/* Header */}
        <div className="mb-8 bg-gradient-to-r from-green-600 to-green-900 rounded-3xl shadow-lg overflow-hidden">
          <div className="px-8 py-12 relative">
            <div className="relative z-10">
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
                Bienvenido, {userName || "Usuario"}
              </h1>
              <p className="text-violet-100 text-lg">
                Aquí está tu historial de citas atendidas.
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

        {/* Filtro de estado */}
        <div className="mb-6">
          <label htmlFor="filtroEstado" className="text-sm text-gray-500">
            Filtrar por estado:
          </label>
          <select
            id="filtroEstado"
            value={filtroEstado}
            onChange={(e) => setFiltroEstado(e.target.value)}
            className="ml-2 border border-gray-300 rounded-md px-2 py-1 text-sm focus:outline-none focus:border-green-500"
          >
            <option value="todas">Todas</option>
            <option value="completada">Completadas</option>
            <option value="cancelada">Canceladas</option>
          </select>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center text-gray-500 flex flex-col items-center justify-center gap-2">
            <Clock className="h-8 w-8 animate-spin text-green-600" />
            <p>Cargando tu historial...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="text-center text-red-500 flex flex-col items-center justify-center gap-2">
            <XCircle className="h-8 w-8 text-red-500" />
            <p>{error}</p>
          </div>
        )}

        {/* Appointment Cards */}
        {!loading && !error && appointments.length === 0 ? (
          <div className="text-center text-gray-500 flex flex-col items-center justify-center gap-2">
            <Calendar className="h-8 w-8 text-gray-500" />
            <p>No tienes citas atendidas.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {appointments.map((appointment) => (
              <CardHistorialCitasDoctor key={appointment.idCita} appointment={appointment} />
            ))}
          </div>
        )}
      </div>
    </SidebarDoctor>
  );
};

export default HistorialCitasAtendidasDoctor;