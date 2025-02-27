import { useState, useEffect } from "react";
import { Calendar, Clock, XCircle } from "lucide-react";
import SidebarDoctor from "../../components/clienteComponents/SidebarCliente";
import API_BASE_URL from "../../js/urlHelper";
import jwtUtils from "../../utilities/jwtUtils";
import CardHistorialCitasCliente from "../../components/clienteComponents/CardHistorialCitasCliente";
import WelcomeHeader from '../../components/WelcomeHeader';

const HistorialCitas = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filtroEstado, setFiltroEstado] = useState("todas");
  const [filtroNombre, setFiltroNombre] = useState("");
  const [filtroDni, setFiltroDni] = useState("");
  const [filtroIdCita, setFiltroIdCita] = useState("");
  const [filtroFecha, setFiltroFecha] = useState("");
  const [filtroHora, setFiltroHora] = useState("");
  const token = jwtUtils.getTokenFromCookie();
  const userId = jwtUtils.getIdUsuario(token);
  const userName = jwtUtils.getNombres(token);

  // Función para obtener las citas del cliente
  const fetchAppointments = async () => {
    try {
      if (!userId || !token) {
        throw new Error("User ID or token not found");
      }

      // Crear objeto de parámetros base
      const params = new URLSearchParams();
      
      // Añadir parámetros solo si tienen valor
      if (filtroEstado !== "todas") params.append("estado", filtroEstado);
      if (filtroNombre) params.append("nombrePaciente", filtroNombre); // Cambiado de 'nombre' a 'nombrePaciente'
      if (filtroDni) params.append("dni", filtroDni);
      if (filtroIdCita) params.append("idCita", filtroIdCita);
      if (filtroFecha) params.append("fecha", filtroFecha);
      if (filtroHora) params.append("hora", filtroHora);

      const response = await fetch(
        `${API_BASE_URL}/api/cliente/historialcitas/${userId}?${params}`,
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

  // Efecto para cargar las citas al cambiar los filtros
  useEffect(() => {
    fetchAppointments();
  }, [filtroEstado, filtroNombre, filtroDni, filtroIdCita, filtroFecha, filtroHora]);

  return (
    <SidebarDoctor>
      <div className="flex flex-col p-6 gap-6 md:-ml-64">

      <WelcomeHeader 
        customMessage="Aquí está tu historial de citas atendidas."
      />

        {/* Filtros section */}
        <div className="mb-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
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
          <div>
            <label htmlFor="filtroIdCita" className="text-sm text-gray-500">
              Filtrar por ID de cita:
            </label>
            <input
              id="filtroIdCita"
              type="text"
              value={filtroIdCita}
              onChange={(e) => {
                const inputValue = e.target.value;
                // Validar que solo sean números
                if (/^\d*$/.test(inputValue)) {
                  setFiltroIdCita(inputValue);
                }
              }}
              className="ml-2 border border-gray-300 rounded-md px-2 py-1 text-sm focus:outline-none focus:border-green-500"
              placeholder="Ej: 12345"
            />
          </div>
          <div>
            <label htmlFor="filtroFecha" className="text-sm text-gray-500">
              Filtrar por fecha:
            </label>
            <input
              id="filtroFecha"
              type="date"
              value={filtroFecha}
              onChange={(e) => setFiltroFecha(e.target.value)}
              className="ml-2 border border-gray-300 rounded-md px-2 py-1 text-sm focus:outline-none focus:border-green-500"
            />
          </div>
          <div>
            <label htmlFor="filtroHora" className="text-sm text-gray-500">
              Filtrar por hora:
            </label>
            <input
              id="filtroHora"
              type="time"
              value={filtroHora}
              onChange={(e) => setFiltroHora(e.target.value)}
              className="ml-2 border border-gray-300 rounded-md px-2 py-1 text-sm focus:outline-none focus:border-green-500"
            />
          </div>
          <div>
            <label htmlFor="filtroNombre" className="text-sm text-gray-500">
              Filtrar por nombre del paciente:
            </label>
            <input
              id="filtroNombre"
              type="text"
              value={filtroNombre}
              onChange={(e) => {
                const inputValue = e.target.value;
                // Validar que solo sean letras del alfabeto (sin números ni caracteres especiales)
                if (/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]*$/.test(inputValue)) {
                  setFiltroNombre(inputValue);
                }
              }}
              placeholder="Ejemplo: Anthony o Karen" // Placeholder para guiar al usuario
              className="ml-2 border border-gray-300 rounded-md px-2 py-1 text-sm focus:outline-none focus:border-green-500"
            />
          </div>
          <div>
            <label htmlFor="filtroDni" className="text-sm text-gray-500">
              Filtrar por DNI:
            </label>
            <input
              id="filtroDni"
              type="text"
              value={filtroDni}
              onChange={(e) => {
                const inputValue = e.target.value;
                // Validar que solo sean números y máximo 8 dígitos
                if (/^\d*$/.test(inputValue) && inputValue.length <= 8) {
                  setFiltroDni(inputValue);
                }
              }}
              className="ml-2 border border-gray-300 rounded-md px-2 py-1 text-sm focus:outline-none focus:border-green-500"
              placeholder="Ej: 12345678" // Placeholder para guiar al usuario
              maxLength={8} // Máximo 8 caracteres
            />
          </div>
        </div>

        {/* Estados de carga y error - sin cambios */}
        {loading && (
          <div className="text-center text-gray-500 flex flex-col items-center justify-center gap-2">
            <Clock className="h-8 w-8 animate-spin text-green-600" />
            <p>Cargando tu historial...</p>
          </div>
        )}

        {error && (
          <div className="text-center text-red-500 flex flex-col items-center justify-center gap-2">
            <XCircle className="h-8 w-8 text-red-500" />
            <p>{error}</p>
          </div>
        )}

        {/* Visualización de citas */}
        {!loading && !error && appointments.length === 0 ? (
          <div className="text-center text-gray-500 flex flex-col items-center justify-center gap-2">
            <Calendar className="h-8 w-8 text-gray-500" />
            <p>No se encontraron citas con los filtros aplicados.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {appointments.map((appointment) => (
              <CardHistorialCitasCliente key={appointment.idCita} appointment={appointment} />
            ))}
          </div>
        )}
      </div>
    </SidebarDoctor>
  );
};

export default HistorialCitas;