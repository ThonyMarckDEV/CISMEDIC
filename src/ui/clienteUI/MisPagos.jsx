import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Calendar, Clock, User, Tag, CreditCard, XCircle, CheckCircle, AlertCircle } from "lucide-react";
import SidebarCliente from "../../components/clienteComponents/SidebarCliente";
import API_BASE_URL from "../../js/urlHelper";
import jwtUtils from "../../utilities/jwtUtils";
import MercadoPago from "../../components/clienteComponents/MercadoPago";
import SweetAlert from "../../components/SweetAlert";

const MisPagos = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchParams] = useSearchParams();
  const [alreadyShownAlert, setAlreadyShownAlert] = useState(false);
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

  useEffect(() => {
    const status = searchParams.get("status");
    const externalReference = searchParams.get("external_reference");

    if (status && externalReference && !alreadyShownAlert) {
      setAlreadyShownAlert(true);
      const messages = {
        approved: { title: 'Éxito', text: '¡El pago fue exitoso! Tu cita ha sido confirmada.', icon: 'success' },
        failure: { title: 'Error', text: 'El pago no se pudo completar. Por favor, intenta nuevamente.', icon: 'error' },
        pending: { title: 'Pendiente', text: 'El pago está pendiente. Te notificaremos cuando se complete.', icon: 'warning' }
      };

      const message = messages[status];
      if (message) {
        SweetAlert.showMessageAlert(message.title, message.text, message.icon);
      }

      // Remove URL parameters without page reload
      window.history.replaceState({}, '', window.location.pathname);
      
      // Fetch updated appointments
      const fetchUpdatedAppointments = async () => {
        try {
          const response = await fetch(`${API_BASE_URL}/api/citas/${userId}`, {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          });
          if (response.ok) {
            const data = await response.json();
            setAppointments(data);
          }
        } catch (error) {
          console.error("Error updating appointments:", error);
        }
      };
      
      fetchUpdatedAppointments();
    }
  }, [searchParams, alreadyShownAlert, userId, token]);

  return (
    <SidebarCliente>
      <div className="flex flex-col p-6 gap-8 md:-ml-64 bg-gray-50 min-h-screen">
        {/* Welcome Card */}
        <div className="relative w-full bg-gradient-to-br from-blue-600 to-cyan-500 rounded-2xl p-10 overflow-hidden shadow-2xl">
          <div className="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>
          <div className="relative z-10">
            <h1 className="text-4xl text-white font-bold mb-4">
              ¡Bienvenido, {userName || "Usuario"}!
            </h1>
            <p className="text-white/90 text-xl font-light">
              Gestiona tus pagos para citas médicas de manera segura y eficiente.
            </p>
          </div>
          <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-white/20 rounded-full blur-2xl"></div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-20">
            <Clock className="h-12 w-12 animate-spin text-cyan-600 mx-auto mb-4" />
            <p className="text-lg text-gray-600">Cargando tus pagos...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="text-center py-20">
            <XCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <p className="text-lg text-red-600">{error}</p>
          </div>
        )}

        {/* Appointment Cards */}
        {!loading && !error && appointments.length === 0 ? (
          <div className="text-center py-20">
            <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-lg text-gray-500">No tienes citas programadas.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {appointments.map((appointment) => (
              <div
                key={appointment.idCita}
                className="rounded-2xl shadow-xl bg-white p-8 hover:shadow-2xl transition-shadow duration-300 border border-gray-100"
              >
                <div className="flex items-center gap-4 mb-6">
                  <div className="p-3 bg-cyan-50 rounded-xl">
                    <Calendar className="h-6 w-6 text-cyan-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-800">
                    Cita #{appointment.idCita}
                  </h2>
                </div>
                <div className="space-y-4 mb-6">
                  <p className="flex items-center text-gray-700">
                    <User className="mr-3 h-5 w-5 text-cyan-500" />
                    <span className="font-medium">Paciente:</span>
                    <span className="ml-2">{appointment.clienteNombre} {appointment.clienteApellidos}</span>
                  </p>
                  <p className="flex items-center text-gray-700">
                    <User className="mr-3 h-5 w-5 text-cyan-500" />
                    <span className="font-medium">Doctor:</span>
                    <span className="ml-2">{appointment.doctorNombre} {appointment.doctorApellidos}</span>
                  </p>
                  <p className="flex items-center text-gray-700">
                    <Tag className="mr-3 h-5 w-5 text-cyan-500" />
                    <span className="font-medium">Especialidad:</span>
                    <span className="ml-2">{appointment.especialidad}</span>
                  </p>
                  <p className="flex items-center text-gray-700">
                    <Calendar className="mr-3 h-5 w-5 text-cyan-500" />
                    <span className="font-medium">Fecha:</span>
                    <span className="ml-2">{new Date(appointment.fecha).toLocaleDateString()}</span>
                  </p>
                  <p className="flex items-center text-gray-700">
                    <Clock className="mr-3 h-5 w-5 text-cyan-500" />
                    <span className="font-medium">Hora:</span>
                    <span className="ml-2">{appointment.horaInicio}</span>
                  </p>
                  <p className="flex items-center text-gray-700">
                    <CreditCard className="mr-3 h-5 w-5 text-cyan-500" />
                    <span className="font-medium">Costo:</span>
                    <span className="ml-2">S/.{appointment.costo.toFixed(2)}</span>
                  </p>
                  <div className="flex items-center pt-2">
                    <div className={`px-4 py-2 rounded-full ${
                      appointment.estado === 'confirmado' ? 'bg-green-100 text-green-800' :
                      appointment.estado === 'pago pendiente' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-gray-100 text-gray-800'
                    } font-medium`}>
                      {appointment.estado}
                    </div>
                  </div>
                </div>
                {appointment.estado === "pago pendiente" && (
                  <div className="mt-6">
                    <MercadoPago
                      cita={{
                        idCita: appointment.idCita,
                        monto: appointment.costo,
                      }}
                    />
                  </div>
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