import { useState, useEffect } from "react";
import { Calendar, Clock, XCircle, Search } from "lucide-react";
import SidebarCliente from "../../components/adminComponents/SidebarAdmin";
import API_BASE_URL from "../../js/urlHelper";
import jwtUtils from "../../utilities/jwtUtils";
import CardMisCitas from "../../components/adminComponents/CardCitasClientes";
import WelcomeHeader from '../../components/WelcomeHeader';

const CitasPacientes = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    dni: '',
    nombre_paciente: '',
    apellidos_paciente: '',
    nombre_doctor: '',
    apellidos_doctor: '',
    especialidad: '',
    fecha: '',
    hora: '',
    idCita: ''
  });
  const [validationErrors, setValidationErrors] = useState({});

  const token = jwtUtils.getTokenFromCookie();
  const userId = jwtUtils.getIdUsuario(token);

  const validateField = (name, value) => {
    let error = '';
    switch (name) {
      case 'dni':
        if (!/^\d{0,8}$/.test(value)) {
          error = 'DNI debe contener solo números (máximo 8 dígitos).';
        }
        break;
      case 'idCita':
        if (!/^\d*$/.test(value)) {
          error = 'ID de cita debe contener solo números.';
        }
        break;
      case 'nombre_paciente':
      case 'apellidos_paciente':
      case 'nombre_doctor':
      case 'apellidos_doctor':
        if (!/^[A-Za-zÁÉÍÓÚáéíóúñÑ\s]*$/.test(value)) {
          error = 'Este campo solo permite letras y espacios.';
        }
        break;
      case 'especialidad':
        if (!/^[A-Za-zÁÉÍÓÚáéíóúñÑ\s]*$/.test(value)) {
          error = 'Este campo solo permite letras y espacios.';
        }
        break;
      default:
        break;
    }
    return error;
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    let sanitizedValue = value;
  
    // Sanitizar valores según el campo
    switch (name) {
      case 'dni':
        sanitizedValue = value.replace(/[^\d]/g, '').substring(0, 8); // Solo números, máximo 8
        break;
      case 'idCita':
        sanitizedValue = value.replace(/[^\d]/g, ''); // Solo números
        break;
      case 'nombre_paciente':
      case 'apellidos_paciente':
      case 'nombre_doctor':
      case 'apellidos_doctor':
      case 'especialidad':
        sanitizedValue = value.replace(/[^A-Za-zÁÉÍÓÚáéíóúñÑ\s]/g, ''); // Solo letras y espacios
        break;
      default:
        break;
    }
  
    const error = validateField(name, sanitizedValue);
    setValidationErrors(prevErrors => ({
      ...prevErrors,
      [name]: error
    }));
    setFilters(prevFilters => ({
      ...prevFilters,
      [name]: sanitizedValue
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

        <WelcomeHeader 
            customMessage="Aquí están tus citas médicas programadas."
          />

        {/* Filtros */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
         {/* DNI */}
          <div>
            <input
              type="text"
              name="dni"
              placeholder="Filtrar por DNI"
              value={filters.dni}
              onChange={handleFilterChange}
              className="p-2 border rounded-lg"
              inputMode="numeric"  // Teclado numérico en móviles
            />
            {validationErrors.dni && <p className="text-red-500 text-sm">{validationErrors.dni}</p>}
          </div>

          {/* ID Cita */}
          <div>
            <input
              type="text"
              name="idCita"
              placeholder="Filtrar por ID de cita"
              value={filters.idCita}
              onChange={handleFilterChange}
              className="p-2 border rounded-lg"
              inputMode="numeric"  // Teclado numérico en móviles
            />
            {validationErrors.idCita && <p className="text-red-500 text-sm">{validationErrors.idCita}</p>}
          </div>

          {/* Resto de campos (ejemplo para nombre_paciente) */}
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
              name="apellidos_paciente"
              placeholder="Filtrar por apellidos del paciente"
              value={filters.apellidos_paciente}
              onChange={handleFilterChange}
              className="p-2 border rounded-lg"
            />
            {validationErrors.apellidos_paciente && <p className="text-red-500 text-sm">{validationErrors.apellidos_paciente}</p>}
          </div>
          <div>
            <input
              type="text"
              name="apellidos_doctor"
              placeholder="Filtrar por apellidos del doctor"
              value={filters.apellidos_doctor}
              onChange={handleFilterChange}
              className="p-2 border rounded-lg"
            />
            {validationErrors.apellidos_doctor && <p className="text-red-500 text-sm">{validationErrors.apellidos_doctor}</p>}
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