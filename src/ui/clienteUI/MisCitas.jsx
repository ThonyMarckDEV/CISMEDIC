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
          <div className="mb-8 bg-gradient-to-r from-blue-700 to-indigo-600 rounded-3xl shadow-lg overflow-hidden">
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
            <Clock className="h-8 w-8 animate-spin text-cyan-600" />
            <p>Cargando tus citas...</p>
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
            <p>No tienes citas programadas.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {appointments.map((appointment) => (
              <div
                key={appointment.idCita}
                className="rounded-xl shadow-lg bg-white p-6"
              >
                <div className="flex items-center gap-3 mb-4">
                  <Calendar className="h-6 w-6 text-cyan-600" />
                  <h2 className="text-xl font-semibold">Cita #{appointment.idCita}</h2>
                </div>
                <div className="space-y-2 mb-4">
                  <p className="flex items-center">
                    <User className="mr-2 h-4 w-4 text-gray-500" />
                    Paciente: {appointment.clienteNombre}{" "}
                    {appointment.clienteApellidos}
                  </p>
                  <p className="flex items-center">
                    <User className="mr-2 h-4 w-4 text-gray-500" />
                    Doctor: {appointment.doctorNombre}{" "}
                    {appointment.doctorApellidos}
                  </p>
                  <p className="flex items-center">
                    <Tag className="mr-2 h-4 w-4 text-gray-500" />
                    Especialidad: {appointment.especialidad}
                  </p>
                  <p className="flex items-center">
                    <Calendar className="mr-2 h-4 w-4 text-gray-500" />
                    Fecha: {new Date(appointment.fecha).toLocaleDateString()}
                  </p>
                  <p className="flex items-center">
                    <Clock className="mr-2 h-4 w-4 text-gray-500" />
                    Hora: {appointment.horaInicio}
                  </p>
                  <p className="flex items-center">
                    <CreditCard className="mr-2 h-4 w-4 text-gray-500" />
                    Costo: S/.{appointment.costo.toFixed(2)}
                  </p>
                  <p className="flex items-center font-semibold">
                    Estado: {appointment.estado}
                  </p>
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