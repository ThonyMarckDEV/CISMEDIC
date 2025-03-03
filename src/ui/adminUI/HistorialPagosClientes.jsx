import { useState, useEffect } from "react";
import { Calendar, Clock, XCircle } from "lucide-react";
import SidebarDoctor from "../../components/adminComponents/SidebarAdmin";
import API_BASE_URL from "../../js/urlHelper";
import jwtUtils from "../../utilities/jwtUtils";
import CardHistorialPagosCliente from "../../components/adminComponents/HistorialPagoCard";
import WelcomeHeader from '../../components/WelcomeHeader';

const HistorialPagosClientes = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filtroEstado, setFiltroEstado] = useState("todas");
  const [filtroNombre, setFiltroNombre] = useState("");
  const [filtroIdPago, setFiltroIdPago] = useState("");
  const [filtroFecha, setFiltroFecha] = useState("");
  const [filtroDNI, setFiltroDNI] = useState(""); // Nuevo filtro: DNI
  const token = jwtUtils.getTokenFromCookie();
  const userId = jwtUtils.getIdUsuario(token);

  // Función para obtener los pagos del cliente
  const fetchPayments = async () => {
    try {
      if (!userId || !token) {
        throw new Error("User ID or token not found");
      }
      const params = new URLSearchParams({
        estado: filtroEstado,
        nombre: filtroNombre,
        idPago: filtroIdPago,
        fecha: filtroFecha,
        dni: filtroDNI, // Agregar filtro DNI
      });
      const response = await fetch(
        `${API_BASE_URL}/api/admin/historialpagos/${params}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }
      const data = await response.json();
      setPayments(data);
    } catch (err) {
      setError(err.message || "Error fetching payments");
    } finally {
      setLoading(false);
    }
  };

  // Efecto para cargar los pagos al cambiar los filtros
  useEffect(() => {
    fetchPayments();
  }, [filtroEstado, filtroNombre, filtroIdPago, filtroFecha, filtroDNI]);

  return (
    <SidebarDoctor>
      <div className="flex flex-col p-6 gap-6 md:-ml-64">

        <WelcomeHeader 
            customMessage="Aquí está tu historial de pagos."
          />

        {/* Filtros */}
        <div className="mb-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <label htmlFor="filtroNombre" className="text-sm text-gray-500">
              Filtrar por nombre:
            </label>
            <input
              id="filtroNombre"
              type="text"
              value={filtroNombre}
              onChange={(e) => {
                const inputValue = e.target.value;
                // Validar que solo sean letras del alfabeto (sin números ni caracteres especiales)
                if (/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]*$/.test(inputValue)) {
                  setFiltroNombre(inputValue);
                }
              }}
              className="ml-2 border border-gray-300 rounded-md px-2 py-1 text-sm focus:outline-none focus:border-green-500"
              placeholder="Ej: Juan Pérez"
            />
          </div>
          <div>
            <label htmlFor="filtroDNI" className="text-sm text-gray-500">
              Filtrar por DNI:
            </label>
            <input
              id="filtroDNI"
              type="text"
              value={filtroDNI}
              onChange={(e) => {
                const inputValue = e.target.value;
                // Validar que solo sean números y máximo 8 dígitos
                if (/^\d*$/.test(inputValue) && inputValue.length <= 8) {
                  setFiltroDNI(inputValue);
                }
              }}
              className="ml-2 border border-gray-300 rounded-md px-2 py-1 text-sm focus:outline-none focus:border-green-500"
              placeholder="Ej: 12345678"
              maxLength={8} // Máximo 8 caracteres
            />
          </div>
          <div>
            <label htmlFor="filtroIdPago" className="text-sm text-gray-500">
              Filtrar por ID de pago:
            </label>
            <input
              id="filtroIdPago"
              type="text"
              value={filtroIdPago}
              onChange={(e) => {
                const inputValue = e.target.value;
                // Validar que solo sean números
                if (/^\d*$/.test(inputValue)) {
                  setFiltroIdPago(inputValue);
                }
              }}
              className="ml-2 border border-gray-300 rounded-md px-2 py-1 text-sm focus:outline-none focus:border-green-500"
              placeholder="Ej: 12345"
            />
          </div>
          <div>
            <label htmlFor="filtroFecha" className="text-sm text-gray-500">
              Filtrar por fecha:
            </label>
            <input
              id="filtroFecha"
              type="date"
              value={filtroFecha}
              onChange={(e) => setFiltroFecha(e.target.value)}
              className="ml-2 border border-gray-300 rounded-md px-2 py-1 text-sm focus:outline-none focus:border-green-500"
            />
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center text-gray-500 flex flex-col items-center justify-center gap-2">
            <Clock className="h-8 w-8 animate-spin text-green-600" />
            <p>Cargando tu historial...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="text-center text-red-500 flex flex-col items-center justify-center gap-2">
            <XCircle className="h-8 w-8 text-red-500" />
            <p>{error}</p>
          </div>
        )}

        {/* Payment Cards */}
        {!loading && !error && payments.length === 0 ? (
          <div className="text-center text-gray-500 flex flex-col items-center justify-center gap-2">
            <Calendar className="h-8 w-8 text-gray-500" />
            <p>No tienes pagos registrados.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {payments.map((payment) => (
              <CardHistorialPagosCliente key={payment.idPago} payment={payment} />
            ))}
          </div>
        )}
      </div>
    </SidebarDoctor>
  );
};

export default HistorialPagosClientes;