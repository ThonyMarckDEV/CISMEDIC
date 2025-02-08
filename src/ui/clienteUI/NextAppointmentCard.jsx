import { useEffect, useState } from "react";
import { Calendar, Clock, User, Stethoscope, CalendarX } from "lucide-react";
import jwtUtils from '../../utilities/jwtUtils';
import API_BASE_URL from "../../js/urlHelper";

const NextAppointmentCard = () => {
  const [nextAppointment, setNextAppointment] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNextAppointment = async () => {
      try {
        const token = jwtUtils.getTokenFromCookie();
        const userId = jwtUtils.getIdUsuario(token);

        const response = await fetch(`${API_BASE_URL}/api/proxima-cita/${userId}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('Error al obtener la próxima cita');
        }

        const data = await response.json();

        // Verificar si el backend devuelve un mensaje de "no hay citas"
        if (data.message) {
          setNextAppointment(null); // No hay citas próximas
        } else {
          setNextAppointment(data); // Hay una cita próxima
        }
      } catch (error) {
        console.error('Error fetching next appointment:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchNextAppointment();
  }, []);

  if (loading) {
    return (
      <div className="w-full bg-white rounded-xl shadow-lg border border-gray-100">
        <div className="p-6">
          <div className="animate-pulse flex flex-col gap-4">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!nextAppointment) {
    return (
      <div className="w-full bg-white rounded-xl shadow-lg border border-gray-100">
        <div className="p-8 flex flex-col items-center justify-center text-center">
          <div className="bg-gray-50 p-4 rounded-full mb-4">
            <CalendarX className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-800">
            No hay citas próximas disponibles
          </h3>
        </div>
      </div>
    );
  }

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('es-ES', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  return (
    <div className="w-full max-w-4xl mx-auto bg-white rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300">
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Próxima Cita</h2>
        </div>

        {/* Grid de 2x2 */}
        <div className="grid grid-cols-2 gap-6">
          {/* Fecha */}
          <div className="flex items-center gap-4 bg-gray-50 p-4 rounded-lg">
            <Calendar className="h-6 w-6 text-green-600" />
            <div className="flex flex-col">
              <span className="text-sm text-gray-500">Fecha</span>
              <span className="capitalize font-medium text-gray-800">
                {formatDate(nextAppointment.fecha)}
              </span>
            </div>
          </div>

          {/* Hora */}
          <div className="flex items-center gap-4 bg-gray-50 p-4 rounded-lg">
            <Clock className="h-6 w-6 text-green-600" />
            <div className="flex flex-col">
              <span className="text-sm text-gray-500">Hora</span>
              <span className="font-medium text-gray-800">{nextAppointment.horaInicio}</span>
            </div>
          </div>

          {/* Doctor */}
          <div className="flex items-center gap-4 bg-gray-50 p-4 rounded-lg">
            <Stethoscope className="h-6 w-6 text-green-600" />
            <div className="flex flex-col">
              <span className="text-sm text-gray-500">Doctor</span>
              <span className="font-medium text-gray-800">
                Dr. {nextAppointment.doctorNombre} {nextAppointment.doctorApellidos}
              </span>
              <span className="text-sm text-green-600 font-medium">
                {nextAppointment.especialidad}
              </span>
            </div>
          </div>

          {/* Paciente */}
          <div className="flex items-center gap-4 bg-gray-50 p-4 rounded-lg">
            <User className="h-6 w-6 text-green-600" />
            <div className="flex flex-col">
              <span className="text-sm text-gray-500">Paciente</span>
              <span className="font-medium text-gray-800">
                {nextAppointment.pacienteNombre} {nextAppointment.pacienteApellidos}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NextAppointmentCard;