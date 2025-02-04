import { useEffect, useState } from "react";
import { Calendar, Clock, User, Activity } from "lucide-react";
import Sidebar from "../../components/clienteComponents/SidebarCliente";
import jwtUtils from "../../utilities/jwtUtils";
import API_BASE_URL from "../../js/urlHelper";

const ClienteNuevaCita = () => {
  const [nombreUsuario, setNombreUsuario] = useState("");
  const [especialidades, setEspecialidades] = useState([]);
  const [doctores, setDoctores] = useState([]);
  const [selectedEspecialidad, setSelectedEspecialidad] = useState("");
  const [idDoctor, setIdDoctor] = useState("");
  const [fecha, setFecha] = useState("");
  const [horariosDisponibles, setHorariosDisponibles] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedHorario, setSelectedHorario] = useState("");
  const [selectedDoctor, setSelectedDoctor] = useState(null);

  const getToken = () => jwtUtils.getTokenFromCookie();

  const formatTime = (timeString) => {
    try {
      // Ensure we have a valid time string
      if (!timeString) return '';
      
      // Create a date object with the time
      const date = new Date(`2000-01-01T${timeString}`);
      
      // Format the time
      return date.toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      });
    } catch (error) {
      console.error('Error formatting time:', error);
      return timeString; // Return original string if formatting fails
    }
  };

  const fetchHorariosDisponibles = async (doctorId, selectedDate) => {
    if (!doctorId || !selectedDate) return;
    
    setLoading(true);
    setError("");
    setHorariosDisponibles([]); // Clear previous schedules
    
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/horarios-disponibles/${doctorId}/${selectedDate}`,
        {
          headers: {
            'Authorization': `Bearer ${getToken()}`,
            'Accept': 'application/json'
          },
        }
      );

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || `Error: ${response.status}`);
      }

      // Sort horarios by time before setting state
      const sortedHorarios = (data.horarios || []).sort((a, b) => 
        a.hora_inicio.localeCompare(b.hora_inicio)
      );

      console.log('Horarios disponibles:', sortedHorarios); // Debug log
      setHorariosDisponibles(sortedHorarios);
    } catch (error) {
      console.error("Error:", error);
      setError("No se pudieron cargar los horarios disponibles");
      setHorariosDisponibles([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchDoctoresPorEspecialidad = async (especialidadId) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/doctores/especialidad/${especialidadId}`,
        {
          headers: {
            'Authorization': `Bearer ${getToken()}`,
            'Accept': 'application/json'
          },
        }
      );
      
      if (!response.ok) throw new Error('Error al cargar doctores');
      const data = await response.json();
      setDoctores(data);
      setIdDoctor("");
      setFecha("");
      setHorariosDisponibles([]);
      setSelectedDoctor(null);
    } catch (error) {
      console.error("Error:", error);
      setError("Error al cargar los doctores");
      setDoctores([]);
    }
  };


  useEffect(() => {
    const token = getToken();
    if (token) {
      const nombre = jwtUtils.getNombres(token);
      if (nombre) setNombreUsuario(nombre);
    }

    const fetchEspecialidades = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/especialidades`, {
          headers: {
            'Authorization': `Bearer ${getToken()}`,
            'Accept': 'application/json'
          },
        });
        if (!response.ok) throw new Error('Error al cargar especialidades');
        const data = await response.json();
        setEspecialidades(data);
      } catch (error) {
        console.error("Error:", error);
        setError("Error al cargar las especialidades");
      }
    };

    fetchEspecialidades();
  }, []);

  const handleEspecialidadChange = (e) => {
    const especialidadId = e.target.value;
    setSelectedEspecialidad(especialidadId);
    if (especialidadId) {
      fetchDoctoresPorEspecialidad(especialidadId);
    } else {
      setDoctores([]);
    }
  };

  const handleDoctorChange = (e) => {
    const doctorId = e.target.value;
    setIdDoctor(doctorId);
    setFecha("");
    setHorariosDisponibles([]);
    const selectedDoc = doctores.find(d => d.idUsuario.toString() === doctorId);
    setSelectedDoctor(selectedDoc);
  };

  const handleFechaChange = (e) => {
    const selectedFecha = e.target.value;
    setFecha(selectedFecha);
    if (idDoctor && selectedFecha) {
      fetchHorariosDisponibles(idDoctor, selectedFecha);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!idDoctor || !fecha || !selectedHorario) {
      setError("Por favor, complete todos los campos.");
      return;
    }
  
    const token = getToken();
    if (!token) {
      setError("No se pudo obtener el token de autenticación.");
      return;
    }
  
    try {
      const idCliente = jwtUtils.getIdUsuario(token);
  
      const citaData = {
        idCliente: idCliente,
        idDoctor: idDoctor,
        idHorario: selectedHorario,
        fecha: fecha,
      };
  
      console.log("Datos de la cita:", citaData); // Verifica los datos antes de enviar
  
      const citaResponse = await fetch(`${API_BASE_URL}/api/agendar-cita`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(citaData),
      });
  
      if (!citaResponse.ok) {
        throw new Error('Error al agendar la cita');
      }
  
      const citaResult = await citaResponse.json();
      const idCita = citaResult.idCita;
  
      const pagoData = {
        idCita: idCita,
        monto: 100.80,
      };
  
      const pagoResponse = await fetch(`${API_BASE_URL}/api/registrar-pago`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(pagoData),
      });
  
      if (!pagoResponse.ok) {
        throw new Error('Error al registrar el pago');
      }
  
      alert('Cita agendada y pago registrado exitosamente');
      setSelectedEspecialidad("");
      setIdDoctor("");
      setFecha("");
      setHorariosDisponibles([]);
      setSelectedHorario("");
    } catch (error) {
      console.error("Error:", error);
      setError("Hubo un error al agendar la cita. Por favor, inténtalo de nuevo.");
    }
  };

  return (
    <Sidebar>
      <div className="flex flex-col p-6 gap-6 md:-ml-64">
        {/* Welcome Card */}
        <div className="relative w-full bg-gradient-to-br from-cyan-50 to-blue-50 rounded-lg p-8 overflow-hidden shadow-lg">
          <div className="relative z-10">
            <h1 className="text-3xl text-cyan-600 font-bold mb-3">
              ¡Bienvenido, {nombreUsuario || "Usuario"}!
            </h1>
            <p className="text-gray-600 text-lg">Programa tu próxima cita médica con nosotros.</p>
          </div>
          <div className="absolute right-0 top-0 w-32 h-full bg-cyan-100/20 transform rotate-12 translate-x-16"></div>
        </div>

        {/* Appointment Form Card */}
        <div className="rounded-xl shadow-lg bg-white p-8">
          <div className="flex items-center gap-3 mb-6">
            <Calendar className="h-6 w-6 text-cyan-600" />
            <h2 className="text-2xl font-semibold">Nueva Cita Médica</h2>
          </div>

          {error && (
            <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6 rounded-md">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              </div>
            </div>
          )}
          
          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* Especialidad Selection */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Especialidad Médica
              </label>
              <select 
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
                value={selectedEspecialidad}
                onChange={handleEspecialidadChange}
                required
              >
                <option value="">Seleccione una Especialidad</option>
                {especialidades.map((especialidad) => (
                  <option 
                    key={especialidad.idEspecialidad} 
                    value={especialidad.idEspecialidad}
                  >
                    {especialidad.nombre}
                  </option>
                ))}
              </select>
            </div>

            {/* Doctor Selection */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Médico Especialista
              </label>
              <select
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
                value={idDoctor}
                onChange={handleDoctorChange}
                required
                disabled={!selectedEspecialidad}
              >
                <option value="">Seleccione un doctor</option>
                {doctores.map((doctor) => (
                  <option key={doctor.idUsuario} value={doctor.idUsuario}>
                    Dr(a). {doctor.nombres} {doctor.apellidos}
                  </option>
                ))}
              </select>
            </div>

            {/* Date Selection */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Fecha de la Cita
              </label>
              <input
                type="date"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
                min={new Date().toISOString().split("T")[0]}
                value={fecha}
                onChange={handleFechaChange}
                required
                disabled={!idDoctor}
              />
            </div>

             {/* Available Times - Updated Section */}
             <div className="bg-gray-50 p-4 rounded-lg">
              <label className="block text-sm font-medium text-gray-700 mb-4">
                Horarios Disponibles
              </label>
              {loading ? (
                <div className="flex items-center justify-center p-6">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-600"></div>
                </div>
              ) : horariosDisponibles.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {horariosDisponibles.map((horario) => (
                    <label
                      key={horario.idHorario}
                      className={`relative flex items-center p-4 border rounded-lg cursor-pointer transition-all hover:shadow-md ${
                        selectedHorario === horario.idHorario.toString()
                          ? 'border-cyan-500 bg-cyan-50 shadow-md'
                          : 'border-gray-200 hover:border-cyan-500'
                      }`}
                    >
                      <input
                        type="radio"
                        name="horario"
                        value={horario.idHorario}
                        checked={selectedHorario === horario.idHorario.toString()}
                        onChange={(e) => setSelectedHorario(e.target.value)}
                        className="hidden"
                      />
                      <div className="flex items-center gap-3">
                        <Clock className="h-5 w-5 text-cyan-600" />
                        <span className="text-gray-700 font-medium">
                          {formatTime(horario.hora_inicio)}
                        </span>
                      </div>
                    </label>
                  ))}
                </div>
              ) : (
                <div className="text-center p-6 bg-gray-100 rounded-lg">
                  <Clock className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-600">
                    {fecha ? "No hay horarios disponibles para este doctor en la fecha seleccionada." : "Seleccione una fecha para ver los horarios disponibles."}
                  </p>
                </div>
              )}
            </div>

            {/* Submit Button - Updated for better feedback */}
            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 p-4 rounded-lg font-medium bg-cyan-600 hover:bg-cyan-700 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 disabled:opacity-50 transition-all"
              disabled={loading || !selectedHorario}
            >
              <Calendar className="h-5 w-5" />
              {loading ? "Procesando..." : "Confirmar Cita"}
            </button>
          </form>
        </div>
      </div>
    </Sidebar>
  );
};

export default ClienteNuevaCita;