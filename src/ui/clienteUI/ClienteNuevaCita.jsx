import { useEffect, useState } from "react";
import { Calendar, Clock, User, Activity } from "lucide-react";
import Sidebar from "../../components/clienteComponents/SidebarCliente";
import jwtUtils from "../../utilities/jwtUtils";
import API_BASE_URL from "../../js/urlHelper";
import SweetAlert from '../../components/SweetAlert';
import LoadingScreen from '../../components/home/LoadingScreen';
import { useCitas } from '../../context/CitasContext';
import { usePagos } from '../../context/PagosContext';
import DoctorCalendar from '../../components/clienteComponents/DoctorCalendar';
import DoctorSelect from './DoctorSelect';
import API_BASE_URL_PHOTO from '../../js/urlHelperPhoto';

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
  const [isLoadingFullScreen, setIsLoadingFullScreen] = useState(false);
  const [familiares, setFamiliares] = useState([]);
  const [citaParaFamiliar, setCitaParaFamiliar] = useState(false);
  const [idFamiliarUsuario, setIdFamiliarUsuario] = useState("");

  const { setCantidadCitas } = useCitas();
  const { setCantidadPagos } = usePagos();
  const [fechaMinima, setFechaMinima] = useState('');

  const getToken = () => jwtUtils.getTokenFromCookie();

  // Fetch familiares
  const fetchFamiliares = async (idUsuario) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/familiares/listar/${idUsuario}`, {
        headers: {
          'Authorization': `Bearer ${getToken()}`,
          'Accept': 'application/json',
        },
      });
      const data = await response.json();
      setFamiliares(data);
    } catch (error) {
      console.error("Error al cargar familiares:", error);
    }
  };

  useEffect(() => {
    const token = getToken();
    if (token) {
      const idUsuario = jwtUtils.getIdUsuario(token);
      if (idUsuario) {
        fetchFamiliares(idUsuario);
      }
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
    setFechaMinima(getFechaActualPeru());
  }, []);

  const handleEspecialidadChange = (e) => {
    const especialidadId = e.target.value;
    setSelectedEspecialidad(especialidadId);
    if (especialidadId) {
      fetchDoctoresPorEspecialidad(especialidadId);
    } else {
      setDoctores([]);
      setIdDoctor("");
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
  
    window.scrollTo({
      top: 30,
      behavior: 'smooth'
    });
  };

  // Obtener la fecha actual en el huso horario de Perú (PET)
  const getFechaActualPeru = () => {
    const options = { timeZone: 'America/Lima', year: 'numeric', month: '2-digit', day: '2-digit' };
    const fechaPeru = new Date().toLocaleDateString('en-CA', options);
    return fechaPeru;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!idDoctor || !fecha || !selectedHorario) {
        setError("Por favor, complete todos los campos.");
        return;
    }

    if (citaParaFamiliar && !idFamiliarUsuario) {
        SweetAlert.showMessageAlert(
            'Error',
            'No se ha seleccionado familiar para la cita',
            'error'
        );
        return;
    }

    const token = getToken();
    if (!token) {
        setError("No se pudo obtener el token de autenticación.");
        return;
    }

    try {
        setIsLoadingFullScreen(true);
        const idCliente = jwtUtils.getIdUsuario(token);

        const citaData = {
            idCliente: idCliente,
            idFamiliarUsuario: citaParaFamiliar ? idFamiliarUsuario : null,
            idDoctor: idDoctor,
            idHorario: selectedHorario,
            fecha: fecha,
            especialidad: selectedEspecialidad,
        };

        const response = await fetch(`${API_BASE_URL}/api/agendar-cita`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(citaData),
        });

        if (!response.ok) {
            const errorData = await response.json();
            if (response.status === 409) {
                SweetAlert.showMessageAlert(
                    'Error',
                    errorData.error || 'El horario seleccionado ya no se encuentra disponible.',
                    'error'
                );
                throw new Error(errorData.error || 'El horario seleccionado ya no se encuentra disponible.');
            } else {
                SweetAlert.showMessageAlert(
                    'Error',
                    'Error al agendar la cita.',
                    'error'
                );
                throw new Error('Error al agendar la cita.');
            }
        }

        const [citasResponse, pagosResponse] = await Promise.all([
            fetch(`${API_BASE_URL}/api/cliente/citas/cantidad/${idCliente}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    Accept: 'application/json',
                },
            }),
            fetch(`${API_BASE_URL}/api/cliente/pagos/cantidad/${idCliente}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    Accept: 'application/json',
                },
            }),
        ]);

        if (!citasResponse.ok || !pagosResponse.ok) {
            throw new Error('Error al actualizar los datos.');
        }

        const [citasData, pagosData] = await Promise.all([
            citasResponse.json(),
            pagosResponse.json(),
        ]);
        
        setCantidadCitas(citasData.cantidad);
        setCantidadPagos(pagosData.cantidad);

        const result = await response.json();
        
        SweetAlert.showMessageAlert(
            'Éxito',
            'Cita agendada exitosamente. ' + result.nota,
            'success'
        );

        resetForm();
    } catch (error) {
        console.error('Error:', error);
        setError(error.message || 'Hubo un error al procesar la solicitud. Por favor, inténtalo de nuevo.');
        resetForm();
    } finally {
        setIsLoadingFullScreen(false);
    }
  };
  
  // Función para resetear el formulario
  const resetForm = () => {
    setSelectedEspecialidad("");
    setIdDoctor("");
    setFecha("");
    setHorariosDisponibles([]);
    setSelectedHorario("");
    setError("");
  };

  return (
    <Sidebar>
      {isLoadingFullScreen && <LoadingScreen />}

      <div className="flex flex-col p-6 gap-6 md:-ml-64 bg-gray-50">
        
        {/* Header - Modern & Elegant */}
        <div className="mb-8 bg-gradient-to-r from-green-600 to-green-800 rounded-2xl shadow-lg overflow-hidden">
          <div className="px-8 py-10 relative">
            <div className="relative z-10">
              <h1 className="text-3xl md:text-3xl font-light text-white mb-2">
                Bienvenido, <span className="font-medium">{nombreUsuario || "Usuario"}</span>
              </h1>
              <p className="text-green-100 text-lg font-light">
                Agende su próxima cita médica con nosotros
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

        {/* Main Content Container */}
        <div className="flex flex-col gap-6">
          {/* Desktop Layout Container */}
          <div className="flex flex-col md:flex-row gap-6">
            {/* Form Container - Minimalist & Luxurious */}
            <div className="flex-1 rounded-xl shadow-lg bg-white p-8">
              <div className="flex items-center gap-3 mb-8 border-b border-gray-100 pb-4">
                <Calendar className="h-5 w-5 text-green-700" />
                <h2 className="text-xl font-light text-gray-800">Nueva Cita Médica</h2>
              </div>

              {/* Family Checkbox - Elegant */}
              <div className="mb-8">
                <label className="flex items-center gap-2 cursor-pointer group">
                  <div className="relative">
                    <input
                      type="checkbox"
                      checked={citaParaFamiliar}
                      onChange={(e) => setCitaParaFamiliar(e.target.checked)}
                      className="sr-only"
                    />
                    <div className={`w-5 h-5 border ${citaParaFamiliar ? 'bg-green-600 border-green-600' : 'border-gray-300'} rounded transition-colors duration-200`}></div>
                    {citaParaFamiliar && (
                      <svg className="h-3 w-3 text-white absolute top-1 left-1" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    )}
                  </div>
                  <span className="text-gray-700 group-hover:text-gray-900 transition-colors duration-200">¿Es la cita para un familiar?</span>
                </label>
              </div>

              {/* Family member selection - Elegant */}
              {citaParaFamiliar && (
                <div className="bg-gray-50 p-5 rounded-xl mb-8 border border-gray-100">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Seleccione un Familiar
                  </label>
                  <select
                    className="w-full p-3 border border-gray-200 rounded-lg bg-white focus:ring-1 focus:ring-green-500 focus:border-green-500 transition-all outline-none"
                    value={idFamiliarUsuario}
                    onChange={(e) => setIdFamiliarUsuario(e.target.value)}
                    required
                  >
                    <option value="">Seleccione un familiar</option>
                    {familiares.map((familiar) => (
                      <option key={familiar.idFamiliarUsuario} value={familiar.idFamiliarUsuario}>
                        {familiar.nombre} {familiar.apellidos} (DNI: {familiar.dni})
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Error Message - Elegant */}
              {error && (
                <div className="bg-red-50 border-l-2 border-red-400 p-4 mb-6 rounded-lg">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <svg className="h-4 w-4 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm text-red-600">{error}</p>
                    </div>
                  </div>
                </div>
              )}
     
              <form className="space-y-6" onSubmit={handleSubmit}>
                {/* Especialidad Selection - Luxurious */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Especialidad Médica
                  </label>
                  <div className="relative">
                    <select 
                      className="w-full p-3 pl-3 border border-gray-200 rounded-lg appearance-none bg-white focus:ring-1 focus:ring-green-500 focus:border-green-500 transition-all outline-none"
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
                    <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                      <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Doctor Selection - Minimalist */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Médico Especialista
                  </label>
                  <DoctorSelect
                    doctors={doctores}
                    value={idDoctor}
                    onChange={handleDoctorChange}
                    disabled={!selectedEspecialidad}
                    apiBaseUrl={API_BASE_URL_PHOTO}
                  />
                </div>
    
                {/* Selected Date - Elegant Display */}
                <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Fecha de la Cita
                  </label>
                  <div className="flex items-center justify-between">
                    <div className="flex-grow">
                      {fecha ? (
                        <span className="text-lg font-light text-gray-800">
                          {formatDate(fecha)}
                        </span>
                      ) : (
                        <span className="text-gray-400 italic font-light">Seleccione una fecha en el calendario</span>
                      )}
                    </div>
                    {fecha && (
                      <button
                        type="button"
                        onClick={() => {
                          setFecha('');
                          setHorariosDisponibles([]);
                        }}
                        className="ml-4 px-3 py-1 text-green-700 text-sm hover:text-green-900 transition-colors duration-200"
                      >
                        Cambiar
                      </button>
                    )}
                  </div>
                </div>
    
                {/* Available Times - Modern Grid Layout */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-4">
                    Horarios Disponibles
                  </label>
                  {loading ? (
                    <div className="flex items-center justify-center p-8">
                      <div className="animate-spin rounded-full h-7 w-7 border-b-2 border-green-600"></div>
                    </div>
                  ) : horariosDisponibles.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                      {horariosDisponibles.map((horario) => (
                        <label
                          key={horario.idHorario}
                          className={`relative flex items-center p-4 border rounded-lg cursor-pointer transition-all ${
                            selectedHorario === horario.idHorario.toString()
                              ? 'border-green-600 bg-green-50 shadow-sm'
                              : 'border-gray-200 hover:border-green-400 hover:bg-green-50/30'
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
                          <div className="flex items-center gap-3 w-full">
                            <Clock className="h-4 w-4 text-green-700" />
                            <div className="flex flex-col">
                              <span className="text-gray-900 font-medium">
                                {formatTime(horario.hora_inicio)}
                              </span>
                              <span className="text-gray-500 text-sm">
                                S/.{horario.costo.toFixed(2)}
                              </span>
                            </div>
                          </div>
                        </label>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center p-8 bg-gray-50 rounded-lg border border-gray-100">
                      <Clock className="h-10 w-10 text-gray-300 mx-auto mb-3" />
                      <p className="text-gray-500 font-light">
                        {fecha ? "No hay horarios disponibles para este doctor en la fecha seleccionada." : "Seleccione una fecha para ver los horarios disponibles."}
                      </p>
                    </div>
                  )}
                </div>
    
                {/* Submit Button - Luxurious */}
                <button
                  type="submit"
                  className="w-full flex items-center justify-center gap-2 p-3 rounded-lg font-medium bg-green-700 hover:bg-green-800 text-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 transition-all shadow-sm"
                  disabled={loading || !selectedHorario}
                >
                  <Calendar className="h-5 w-5" />
                  {loading ? "Procesando..." : "Confirmar Cita"}
                </button>
              </form>
            </div>

            {/* Calendar - Elegant */}
            {idDoctor && (
              <div className="w-full md:w-2/5 order-first md:order-last mb-6 md:mb-0">
                <div className="bg-white rounded-xl shadow-lg p-6 h-full">
                  <div className="flex items-center gap-2 mb-6 border-b border-gray-100 pb-3">
                    <Calendar className="h-5 w-5 text-green-700" />
                    <h3 className="text-lg font-light text-gray-800">Calendario</h3>
                  </div>
                  <DoctorCalendar doctorId={idDoctor} onDateSelect={handleDateSelect} />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </Sidebar>
  );
};

export default ClienteNuevaCita;