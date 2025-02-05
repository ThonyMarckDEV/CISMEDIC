import { useState, useEffect } from "react";
import { Calendar, Clock, User, Tag, CreditCard, XCircle } from "lucide-react";
import SidebarCliente from "../../components/clienteComponents/SidebarCliente";
import API_BASE_URL from "../../js/urlHelper";
import jwtUtils from "../../utilities/jwtUtils";

const MisPagos = () => {
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

  const handlePayment = (idCita) => {
    console.log(`Processing payment for appointment ${idCita}`);
    // Implementar lógica de pago aquí
  };

  return (
    <SidebarCliente>

      <div className="flex flex-col p-6 gap-6 md:-ml-64">

        {/* Welcome Card */}
        <div className="relative w-full bg-gradient-to-br from-cyan-50 to-blue-50 rounded-lg p-8 overflow-hidden shadow-lg">
          <div className="relative z-10">
              <h1 className="text-3xl text-cyan-600 font-bold mb-3">
              ¡Bienvenido, {userName || "Usuario"}!
              </h1>
              <p className="text-gray-600 text-lg">
              Aquí están tus pagos para tus citas médicas programadas.
              </p>
          </div>
      </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center text-gray-500 flex flex-col items-center justify-center gap-2">
            <Clock className="h-8 w-8 animate-spin text-cyan-600" />
            <p>Cargando tus pagos...</p>
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
                {appointment.estado === "pago pendiente" && (
                  <button
                    onClick={() => handlePayment(appointment.idCita)}
                    className="w-full flex items-center justify-center gap-2 p-3 rounded-lg font-medium bg-cyan-600 hover:bg-cyan-700 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 transition-all"
                    aria-label={`Pagar cita #${appointment.idCita}`}
                  >
                    <CreditCard className="h-5 w-5" />
                    Pagar Cita
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </SidebarCliente>
  );
};

export default MisPagos;