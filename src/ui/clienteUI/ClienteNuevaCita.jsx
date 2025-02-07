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
import { getDate } from "date-fns/getDate";

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
  const [familiares, setFamiliares] = useState([]); // Lista de familiares
  const [citaParaFamiliar, setCitaParaFamiliar] = useState(false); // Estado para cita para familiar
  const [idFamiliarUsuario, setIdFamiliarUsuario] = useState(""); // ID del familiar seleccionado

  const { setCantidadCitas } = useCitas();
  const { setCantidadPagos } = usePagos();

  const [fechaMinima, setFechaMinima] = useState('');

  const getToken = () => jwtUtils.getTokenFromCookie();

  // Obtener la lista de familiares del usuario
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
      const nombre = jwtUtils.getNombres(token);
      const idUsuario = jwtUtils.getIdUsuario(token);
      if (nombre) setNombreUsuario(nombre);
      if (idUsuario) {
        fetchFamiliares(idUsuario); // Cargar familiares del usuario
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

  const handleDoctorChange = (e) => {
    const doctorId = e.target.value;
    setIdDoctor(doctorId);
    setFecha("");
    setHorariosDisponibles([]);
    const selectedDoc = doctores.find(d => d.idUsuario.toString() === doctorId);
    setSelectedDoctor(selectedDoc);

    // Hacer scroll al principio de la página
    window.scrollTo({
        top: 30,
        behavior: 'smooth' // Esto hace que el scroll sea suave
    });
  };

  const handleFechaChange = (e) => {
    const selectedFecha = e.target.value;
    setFecha(selectedFecha);
    if (idDoctor && selectedFecha) {
      fetchHorariosDisponibles(idDoctor, selectedFecha);
    }
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Validar que todos los campos estén completos
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
        setIsLoadingFullScreen(true); // Activar el LoadingScreen
        const idCliente = jwtUtils.getIdUsuario(token);

        // Obtener el costo del horario seleccionado
        const horarioSeleccionado = horariosDisponibles.find(
            (horario) => horario.idHorario.toString() === selectedHorario
        );
        const costo = horarioSeleccionado ? horarioSeleccionado.costo : 0;

        // Datos para registrar la cita
        const citaData = {
            idCliente: idCliente,
            idFamiliarUsuario: citaParaFamiliar ? idFamiliarUsuario : null, // Enviar el ID del familiar si es una cita para él
            idDoctor: idDoctor,
            idHorario: selectedHorario,
            fecha: fecha,
            especialidad: selectedEspecialidad,
        };

        // Registrar la cita
        const citaResponse = await fetch(`${API_BASE_URL}/api/agendar-cita`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(citaData),
        });

        if (!citaResponse.ok) {
            const errorData = await citaResponse.json();
            if (citaResponse.status === 409) {
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

        const citaResult = await citaResponse.json();
        const idCita = citaResult.idCita;

        // Datos para registrar el pago
        const pagoData = {
            idCita: idCita,
            monto: costo,
        };

        // Registrar el pago
        const pagoResponse = await fetch(`${API_BASE_URL}/api/registrar-pago`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(pagoData),
        });

        if (!pagoResponse.ok) {
            SweetAlert.showMessageAlert(
                'Error',
                'Error al registrar el pago.',
                'error'
            );
            throw new Error('Error al registrar el pago.');
        }

        // Actualizar la cantidad de citas y pagos
        const [citasResponse, pagosResponse] = await Promise.all([
            fetch(`${API_BASE_URL}/api/citas/cantidad`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    Accept: 'application/json',
                },
            }),
            fetch(`${API_BASE_URL}/api/pagos/cantidad`, {
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

        // Mostrar mensaje de éxito
        SweetAlert.showMessageAlert(
            'Éxito',
            'Cita agendada y pago registrado exitosamente.',
            'success'
        );

        // Limpiar el formulario después de un registro exitoso
        resetForm();
    } catch (error) {
        console.error('Error:', error);
        setError(error.message || 'Hubo un error al procesar la solicitud. Por favor, inténtalo de nuevo.');
        // Limpiar el formulario en caso de error también
        resetForm();
    } finally {
        setIsLoadingFullScreen(false); // Desactivar el LoadingScreen
    }
};
  
  // Función para resetear el formulario
  const resetForm = () => {
    setSelectedEspecialidad("");
    setIdDoctor("");
    setFecha("");
    setHorariosDisponibles([]);
    setSelectedHorario("");
    setError(""); // Limpiar cualquier mensaje de error
  };

  return (
    <Sidebar>
    {isLoadingFullScreen && <LoadingScreen />}

    <div className="flex flex-col p-6 gap-6 md:-ml-64">
      {/* Header */}
      <div className="mb-8 bg-gradient-to-r from-green-600 to-green-900 rounded-3xl shadow-lg overflow-hidden">
        <div className="px-8 py-12 relative">
          <div className="relative z-10">
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
              Bienvenido, {nombreUsuario || "Usuario"}
            </h1>
            <p className="text-violet-100 text-lg">
              Programa tu próxima cita médica con nosotros.
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
          {/* Form Container */}
          <div className="flex-1 rounded-xl shadow-lg bg-white p-8">
            <div className="flex items-center gap-3 mb-6">
              <Calendar className="h-6 w-6 text-green-600" />
              <h2 className="text-2xl font-semibold">Nueva Cita Médica</h2>
            </div>

            {/* Checkbox for family member appointment */}
            <div className="mb-6">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={citaParaFamiliar}
                  onChange={(e) => setCitaParaFamiliar(e.target.checked)}
                  className="form-checkbox h-5 w-5 text-green-600"
                />
                <span className="text-gray-700">¿Es la cita para un familiar?</span>
              </label>
            </div>

            {/* Family member selection */}
            {citaParaFamiliar && (
              <div className="bg-gray-50 p-4 rounded-lg mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Seleccione un Familiar
                </label>
                <select
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-transparent transition-all"
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
  
            <form className="space-y-6" onSubmit={handleSubmit}>
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
  
              {/* Doctor Selection */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Médico Especialista
                </label>
                <select
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-transparent transition-all"
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
                      <label
                        key={horario.idHorario}
                        className={`relative flex items-center p-4 border rounded-lg cursor-pointer transition-all hover:shadow-md ${
                          selectedHorario === horario.idHorario.toString()
                            ? 'border-green-600 bg-green-50 shadow-md'
                            : 'border-gray-200 hover:border-green-600'
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
                          <Clock className="h-5 w-5 text-green-600" />
                          <span className="text-gray-700 font-medium">
                            {formatTime(horario.hora_inicio)} - Costo: S/.{horario.costo.toFixed(2)}
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
  
              {/* Submit Button */}
              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 p-4 rounded-lg font-medium bg-green-600 hover:bg-green-700 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 disabled:opacity-50 transition-all"
                disabled={loading || !selectedHorario}
              >
                <Calendar className="h-5 w-5" />
                {loading ? "Procesando..." : "Confirmar Cita"}
              </button>
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

export default ClienteNuevaCita;