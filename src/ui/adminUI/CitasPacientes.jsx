import { useState, useEffect } from "react";
import { Calendar, Clock, XCircle, Search } from "lucide-react";
import SidebarCliente from "../../components/adminComponents/SidebarAdmin";
import API_BASE_URL from "../../js/urlHelper";
import jwtUtils from "../../utilities/jwtUtils";
import CardMisCitas from "../../components/adminComponents/CardCitasClientes";

const CitasPacientes = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    dni: '',
    nombre_paciente: '',
    nombre_doctor: '',
    especialidad: '',
    fecha: '',
    hora: ''
  });
  const [validationErrors, setValidationErrors] = useState({});

  const token = jwtUtils.getTokenFromCookie();
  const userId = jwtUtils.getIdUsuario(token);
  const userName = jwtUtils.getNombres(token);

  const validateField = (name, value) => {
    let error = '';
    switch (name) {
      case 'dni':
        if (!/^\d{0,8}$/.test(value)) {
          error = 'DNI debe contener solo números y máximo 8 caracteres.';
        }
        break;
      case 'nombre_paciente':
      case 'nombre_doctor':
        if (!/^[A-Za-z\s]*$/.test(value)) {
          error = 'Este campo solo puede contener letras.';
        }
        break;
      case 'especialidad':
        if (!/^[A-Za-z\s]*$/.test(value)) {
          error = 'Este campo solo puede contener letras.';
        }
        break;
      default:
        break;
    }
    return error;
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    const error = validateField(name, value);
    setValidationErrors(prevErrors => ({
      ...prevErrors,
      [name]: error
    }));
    setFilters(prevFilters => ({
      ...prevFilters,
      [name]: value
    }));
  };

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        if (!userId || !token) {
          throw new Error("User ID or token not found");
        }
        const queryParams = new URLSearchParams(filters).toString();
        const response = await fetch(`${API_BASE_URL}/api/admin/citas-cliente?${queryParams}`, {
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
  }, [userId, token, filters]);

  return (
    <SidebarCliente>
      <div className="flex flex-col p-6 gap-6 md:-ml-64">
        {/* Header */}
        <div className="mb-8 bg-gradient-to-r from-green-600 to-green-900 rounded-3xl shadow-lg overflow-hidden">
          <div className="px-8 py-12 relative">
            <div className="relative z-10">
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
                Bienvenido, {userName || "Usuario"}
              </h1>
              <p className="text-violet-100 text-lg">
                Aquí están tus citas médicas programadas.
              </p>
            </div>
            <div className="absolute right-0 top-0 w-1/3 h-full opacity-10">
              <svg viewBox="0 0 100 100" className="h-full">
                <circle cx="80" cy="20" r="15" fill="white" />
                <circle cx="20" cy="80" r="25" fill="white" />
              </svg>
            </div>
          </div>
        </div>

        {/* Filtros */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          <div>
            <input
              type="text"
              name="dni"
              placeholder="Filtrar por DNI"
              value={filters.dni}
              onChange={handleFilterChange}
              className="p-2 border rounded-lg"
            />
            {validationErrors.dni && <p className="text-red-500 text-sm">{validationErrors.dni}</p>}
          </div>
          <div>
            <input
              type="text"
              name="nombre_paciente"
              placeholder="Filtrar por nombre del paciente"
              value={filters.nombre_paciente}
              onChange={handleFilterChange}
              className="p-2 border rounded-lg"
            />
            {validationErrors.nombre_paciente && <p className="text-red-500 text-sm">{validationErrors.nombre_paciente}</p>}
          </div>
          <div>
            <input
              type="text"
              name="nombre_doctor"
              placeholder="Filtrar por nombre del doctor"
              value={filters.nombre_doctor}
              onChange={handleFilterChange}
              className="p-2 border rounded-lg"
            />
            {validationErrors.nombre_doctor && <p className="text-red-500 text-sm">{validationErrors.nombre_doctor}</p>}
          </div>
          <div>
            <input
              type="text"
              name="especialidad"
              placeholder="Filtrar por especialidad"
              value={filters.especialidad}
              onChange={handleFilterChange}
              className="p-2 border rounded-lg"
            />
            {validationErrors.especialidad && <p className="text-red-500 text-sm">{validationErrors.especialidad}</p>}
          </div>
          <div>
            <input
              type="date"
              name="fecha"
              placeholder="Filtrar por fecha"
              value={filters.fecha}
              onChange={handleFilterChange}
              className="p-2 border rounded-lg"
            />
          </div>
          <div>
            <input
              type="time"
              name="hora"
              placeholder="Filtrar por hora"
              value={filters.hora}
              onChange={handleFilterChange}
              className="p-2 border rounded-lg"
            />
          </div>
        </div>

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

export default CitasPacientes;