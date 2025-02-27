import { useEffect, useState } from "react";
import { Calendar, Clock, User, Activity } from "lucide-react";
import Sidebar from "../../components/adminComponents/SidebarAdmin";
import jwtUtils from "../../utilities/jwtUtils";
import API_BASE_URL from "../../js/urlHelper";
import SweetAlert from '../../components/SweetAlert';
import LoadingScreen from '../../components/home/LoadingScreen';
import DoctorCalendar from '../../components/adminComponents/DoctorCalendar';
import { getDate } from "date-fns/getDate";
import DoctorSelect from './DoctorSelect';
import WelcomeHeader from '../../components/WelcomeHeader';


const DisponibilidadDoctores = () => {
  const [nombreUsuario, setNombreUsuario] = useState("");
  const [especialidades, setEspecialidades] = useState([]);
  const [doctores, setDoctores] = useState([]);
  const [selectedEspecialidad, setSelectedEspecialidad] = useState("");
  const [idDoctor, setIdDoctor] = useState("");
  const [fecha, setFecha] = useState("");
  const [horariosDisponibles, setHorariosDisponibles] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [isLoadingFullScreen, setIsLoadingFullScreen] = useState(false);
  const [fechaMinima, setFechaMinima] = useState('');

  const getToken = () => jwtUtils.getTokenFromCookie();

  useEffect(() => {
    const token = getToken();
    if (token) {
      const nombre = jwtUtils.getNombres(token);
      const idUsuario = jwtUtils.getIdUsuario(token);
      if (nombre) setNombreUsuario(nombre);
    }
  }, []);

  const formatTime = (timeString) => {
    try {
      if (!timeString) return '';
      const date = new Date(`2000-01-01T${timeString}`);
      return date.toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      });
    } catch (error) {
      console.error('Error formatting time:', error);
      return timeString;
    }
  };

  const fetchHorariosDisponibles = async (doctorId, selectedDate) => {
    if (!doctorId || !selectedDate) return;
    setLoading(true);
    setError("");
    setHorariosDisponibles([]);
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
      const sortedHorarios = (data.horarios || []).sort((a, b) => 
        a.hora_inicio.localeCompare(b.hora_inicio)
      );
      setHorariosDisponibles(sortedHorarios);
    } catch (error) {
      console.error("Error:", error);
      setError("No se pudieron cargar los horarios disponibles");
      setHorariosDisponibles([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDateSelect = (selectedDate) => {
    setFecha(selectedDate);
    if (idDoctor && selectedDate) {
      fetchHorariosDisponibles(idDoctor, selectedDate);
    }
  };

  const formatDate = (dateString) => {
    const [year, month, day] = dateString.split('-');
    const date = new Date(Date.UTC(year, month - 1, day));
    return date.toLocaleDateString('es-ES', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      timeZone: 'UTC'
    });
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
      const doctorId = e.target.value;
      setIdDoctor(doctorId);
      setFecha("");
      setHorariosDisponibles([]);
    }
  };

  const handleDoctorChange = (doctor) => {
    const doctorId = doctor.idUsuario.toString();
    setIdDoctor(doctorId);
    setFecha("");
    setHorariosDisponibles([]);
    setSelectedDoctor(doctor);
  
    // Hacer scroll al principio de la página
    window.scrollTo({
      top: 30,
      behavior: 'smooth'
    });
  };

  // Función para obtener la fecha actual en el huso horario de Perú (PET)
  const getFechaActualPeru = () => {
    const options = { timeZone: 'America/Lima', year: 'numeric', month: '2-digit', day: '2-digit' };
    const fechaPeru = new Date().toLocaleDateString('en-CA', options); // Formato YYYY-MM-DD
    return fechaPeru;
  };

  // Establecer la fecha mínima al cargar el componente
  useEffect(() => {
    setFechaMinima(getFechaActualPeru());
  }, []);

  // Función para resetear el formulario
  const resetForm = () => {
    setSelectedEspecialidad("");
    setIdDoctor("");
    setFecha("");
    setHorariosDisponibles([]);
    setError(""); // Limpiar cualquier mensaje de error
  };

  return (
    <Sidebar>
    {isLoadingFullScreen && <LoadingScreen />}

    <div className="flex flex-col p-6 gap-6 md:-ml-64">

      <WelcomeHeader 
            customMessage="Programa tu próxima cita médica con nosotros."
          />

      {/* Main Content Container */}
      <div className="flex flex-col gap-6">
        {/* Desktop Layout Container */}
        <div className="flex flex-col md:flex-row gap-6">
          {/* Form Container */}
          <div className="flex-1 rounded-xl shadow-lg bg-white p-8">
            <div className="flex items-center gap-3 mb-6">
              <Calendar className="h-6 w-6 text-green-600" />
              <h2 className="text-2xl font-semibold">Consultar Disponibilidad Doctores</h2>
            </div>

            {/* Error Message */}
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
  
            <form className="space-y-6">
              {/* Especialidad Selection */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Especialidad Médica
                </label>
                <select 
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-transparent transition-all"
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

              <div className="bg-gray-50 p-4 rounded-lg">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Médico Especialista
                </label>
                <DoctorSelect
                  doctors={doctores}
                  value={idDoctor}
                  onChange={handleDoctorChange}
                  disabled={!selectedEspecialidad}
                  apiBaseUrl={API_BASE_URL}
                />
              </div>
  
              <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-200">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Fecha de la Cita
                </label>
                <div className="flex items-center justify-between">
                  <div className="flex-grow">
                    {fecha ? (
                      <span className="text-lg font-medium text-gray-700">
                        {formatDate(fecha)}
                      </span>
                    ) : (
                      <span className="text-gray-500 italic">No se ha seleccionado fecha</span>
                    )}
                  </div>
                  {fecha && (
                    <button
                      type="button"
                      onClick={() => {
                        setFecha('');
                        setHorariosDisponibles([]);
                      }}
                      className="ml-4 px-3 py-1 bg-red-100 text-red-600 rounded-md hover:bg-red-200 transition-colors duration-200"
                    >
                      Limpiar fecha
                    </button>
                  )}
                </div>
              </div>
  
              {/* Available Times */}
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
                      <div
                        key={horario.idHorario}
                        className="flex items-center p-4 border border-green-600 rounded-lg"
                      >
                        <div className="flex items-center gap-3">
                          <Clock className="h-5 w-5 text-green-600" />
                          <span className="text-gray-700 font-medium">
                            {formatTime(horario.hora_inicio)} - Costo: S/.{horario.costo.toFixed(2)}
                          </span>
                        </div>
                      </div>
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
            </form>
          </div>

        {/* Calendario Visual */}
        {idDoctor && (
              <div className="w-full md:w-1/3 order-first md:order-last mb-6 md:mb-0">
                <DoctorCalendar doctorId={idDoctor} onDateSelect={handleDateSelect} />
              </div>
            )}
        </div>
        </div>
      </div>
    </Sidebar>
  );
};

export default DisponibilidadDoctores;