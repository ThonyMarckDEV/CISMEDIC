import { useState, useEffect } from "react";
import { Calendar, Clock, User, Tag, CreditCard, XCircle } from "lucide-react";
import SidebarCliente from "../../components/clienteComponents/SidebarCliente";
import API_BASE_URL from "../../js/urlHelper";
import jwtUtils from "../../utilities/jwtUtils";

const MisCitas = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const token = jwtUtils.getTokenFromCookie();
  const userId = jwtUtils.getIdUsuario(token);
  const userName = jwtUtils.getNombres(token);

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
                  <circle cx="80" cy="20" r="15" fill="white"/>
                  <circle cx="20" cy="80" r="25" fill="white"/>
                </svg>
              </div>
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
              <div
                key={appointment.idCita}
                className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100"
              >
                {/* Card Header */}
                <div className="bg-gradient-to-r from-green-100 to-green-200 px-6 py-4 border-b border-gray-100">
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-semibold text-gray-800">
                      Cita #{appointment.idCita}
                    </span>
                    <div
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        appointment.estado === 'confirmado'
                          ? 'bg-green-100 text-green-700'
                          : appointment.estado === 'pago pendiente'
                          ? 'bg-amber-100 text-amber-700'
                          : 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      {appointment.estado}
                    </div>
                  </div>
                </div>
                {/* Card Content */}
                <div className="p-6 space-y-4">
                  <div className="flex items-center gap-3 text-gray-700">
                    <User className="h-5 w-5 text-green-600" />
                    <div>
                      <p className="text-sm text-gray-500">Paciente</p>
                      <p className="font-medium">
                        {appointment.clienteNombre} {appointment.clienteApellidos}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 text-gray-700">
                    <User className="h-5 w-5 text-green-600" />
                    <div>
                      <p className="text-sm text-gray-500">Doctor</p>
                      <p className="font-medium">
                        {appointment.doctorNombre} {appointment.doctorApellidos}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 text-gray-700">
                    <Tag className="h-5 w-5 text-green-600" />
                    <div>
                      <p className="text-sm text-gray-500">Especialidad</p>
                      <p className="font-medium">{appointment.especialidad}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 text-gray-700">
                    <Calendar className="h-5 w-5 text-green-600" />
                    <div>
                      <p className="text-sm text-gray-500">Fecha y Hora</p>
                      <p className="font-medium">
                        {new Date(appointment.fecha).toLocaleDateString()} -{' '}
                        {appointment.horaInicio}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        
      </div>
    </SidebarCliente>
  );
};

export default MisCitas;