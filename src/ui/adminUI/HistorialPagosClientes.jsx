// import { useState, useEffect } from "react";
// import { Calendar, Clock, XCircle } from "lucide-react";
// import SidebarDoctor from "../../components/adminComponents/SidebarAdmin";
// import API_BASE_URL from "../../js/urlHelper";
// import jwtUtils from "../../utilities/jwtUtils";
// import CardHistorialPagosCliente from "../../components/adminComponents/HistorialPagoCard";
// import WelcomeHeader from '../../components/WelcomeHeader';

// const HistorialPagosClientes = () => {
//   const [payments, setPayments] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [filtroEstado, setFiltroEstado] = useState("todas");
//   const [filtroNombre, setFiltroNombre] = useState("");
//   const [filtroIdPago, setFiltroIdPago] = useState("");
//   const [filtroFecha, setFiltroFecha] = useState("");
//   const [filtroDNI, setFiltroDNI] = useState(""); // Nuevo filtro: DNI
//   const token = jwtUtils.getTokenFromCookie();
//   const userId = jwtUtils.getIdUsuario(token);

//   const fetchPayments = async () => {
//     try {
//       if (!userId || !token) {
//         throw new Error("User ID or token not found");
//       }

//       // Construir los parámetros solo si tienen valor
//       const params = new URLSearchParams();
//       if (filtroEstado && filtroEstado !== "todas") params.append("estado", filtroEstado);
//       if (filtroNombre) params.append("nombre", filtroNombre);
//       if (filtroIdPago) params.append("idPago", filtroIdPago);
//       if (filtroFecha) params.append("fecha", filtroFecha);
//       if (filtroDNI) params.append("dni", filtroDNI);

//       // Construir la URL con o sin parámetros
//       const queryString = params.toString();
//       const url = queryString 
//         ? `${API_BASE_URL}/api/admin/obtenerhistorialpagosclientes/?${queryString}`
//         : `${API_BASE_URL}/api/admin/obtenerhistorialpagosclientes`;
        
//       const response = await fetch(url, {
//         method: "GET",
//         headers: {
//           Authorization: `Bearer ${token}`,
//           "Content-Type": "application/json",
//         },
//       });
      
//       if (!response.ok) {
//         throw new Error(`Error ${response.status}: ${response.statusText}`);
//       }
      
//       const data = await response.json();
//       setPayments(data);
//     } catch (err) {
//       setError(err.message || "Error fetching payments");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Efecto para cargar los pagos al cambiar los filtros
//   useEffect(() => {
//     fetchPayments();
//   }, [filtroEstado, filtroNombre, filtroIdPago, filtroFecha, filtroDNI]);

//   return (
//     <SidebarDoctor>
//       <div className="flex flex-col p-6 gap-6 md:-ml-64">

//         <WelcomeHeader 
//             customMessage="Aquí está tu historial de pagos."
//           />

//         {/* Filtros */}
//         <div className="mb-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//           <div>
//             <label htmlFor="filtroNombre" className="text-sm text-gray-500">
//               Filtrar por nombre:
//             </label>
//             <input
//               id="filtroNombre"
//               type="text"
//               value={filtroNombre}
//               onChange={(e) => {
//                 const inputValue = e.target.value;
//                 // Validar que solo sean letras del alfabeto (sin números ni caracteres especiales)
//                 if (/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]*$/.test(inputValue)) {
//                   setFiltroNombre(inputValue);
//                 }
//               }}
//               className="ml-2 border border-gray-300 rounded-md px-2 py-1 text-sm focus:outline-none focus:border-green-500"
//               placeholder="Ej: Juan Pérez"
//             />
//           </div>
//           <div>
//             <label htmlFor="filtroDNI" className="text-sm text-gray-500">
//               Filtrar por DNI:
//             </label>
//             <input
//               id="filtroDNI"
//               type="text"
//               value={filtroDNI}
//               onChange={(e) => {
//                 const inputValue = e.target.value;
//                 // Validar que solo sean números y máximo 8 dígitos
//                 if (/^\d*$/.test(inputValue) && inputValue.length <= 8) {
//                   setFiltroDNI(inputValue);
//                 }
//               }}
//               className="ml-2 border border-gray-300 rounded-md px-2 py-1 text-sm focus:outline-none focus:border-green-500"
//               placeholder="Ej: 12345678"
//               maxLength={8} // Máximo 8 caracteres
//             />
//           </div>
//           <div>
//             <label htmlFor="filtroIdPago" className="text-sm text-gray-500">
//               Filtrar por ID de pago:
//             </label>
//             <input
//               id="filtroIdPago"
//               type="text"
//               value={filtroIdPago}
//               onChange={(e) => {
//                 const inputValue = e.target.value;
//                 // Validar que solo sean números
//                 if (/^\d*$/.test(inputValue)) {
//                   setFiltroIdPago(inputValue);
//                 }
//               }}
//               className="ml-2 border border-gray-300 rounded-md px-2 py-1 text-sm focus:outline-none focus:border-green-500"
//               placeholder="Ej: 12345"
//             />
//           </div>
//           <div>
//             <label htmlFor="filtroFecha" className="text-sm text-gray-500">
//               Filtrar por fecha:
//             </label>
//             <input
//               id="filtroFecha"
//               type="date"
//               value={filtroFecha}
//               onChange={(e) => setFiltroFecha(e.target.value)}
//               className="ml-2 border border-gray-300 rounded-md px-2 py-1 text-sm focus:outline-none focus:border-green-500"
//             />
//           </div>
//         </div>

//         {/* Loading State */}
//         {loading && (
//           <div className="text-center text-gray-500 flex flex-col items-center justify-center gap-2">
//             <Clock className="h-8 w-8 animate-spin text-green-600" />
//             <p>Cargando tu historial...</p>
//           </div>
//         )}

//         {/* Error State */}
//         {error && (
//           <div className="text-center text-red-500 flex flex-col items-center justify-center gap-2">
//             <XCircle className="h-8 w-8 text-red-500" />
//             <p>{error}</p>
//           </div>
//         )}

//         {/* Payment Cards */}
//         {!loading && !error && payments.length === 0 ? (
//           <div className="text-center text-gray-500 flex flex-col items-center justify-center gap-2">
//             <Calendar className="h-8 w-8 text-gray-500" />
//             <p>No tienes pagos registrados.</p>
//           </div>
//         ) : (
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//             {payments.map((payment) => (
//               <CardHistorialPagosCliente key={payment.idPago} payment={payment} />
//             ))}
//           </div>
//         )}
//       </div>
//     </SidebarDoctor>
//   );
// };

// export default HistorialPagosClientes;


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
  const [filters, setFilters] = useState({
    estado: "",
    nombre: "",
    idPago: "",
    fecha: "",
    dni: ""
  });
  const [validationErrors, setValidationErrors] = useState({});
  
  const token = jwtUtils.getTokenFromCookie();
  const userId = jwtUtils.getIdUsuario(token);

  // Validación de campos
  const validateField = (name, value) => {
    let error = '';
    switch (name) {
      case 'dni':
        if (!/^\d{0,8}$/.test(value)) {
          error = 'DNI debe contener solo números (máximo 8 dígitos).';
        }
        break;
      case 'idPago':
        if (!/^\d*$/.test(value)) {
          error = 'ID de pago debe contener solo números.';
        }
        break;
      case 'nombre':
        if (!/^[A-Za-zÁÉÍÓÚáéíóúñÑ\s]*$/.test(value)) {
          error = 'Nombre solo permite letras y espacios.';
        }
        break;
      default:
        break;
    }
    return error;
  };

  // Manejador de cambios en los filtros con sanitización
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    let sanitizedValue = value;
  
    // Sanitizar valores según el campo
    switch (name) {
      case 'dni':
        sanitizedValue = value.replace(/[^\d]/g, '').substring(0, 8); // Solo números, máximo 8
        break;
      case 'idPago':
        sanitizedValue = value.replace(/[^\d]/g, ''); // Solo números
        break;
      case 'nombre':
        sanitizedValue = value.replace(/[^A-Za-zÁÉÍÓÚáéíóúñÑ\s]/g, ''); // Solo letras y espacios
        break;
      case 'estado':
        if (!['todas', 'pagado', 'pendiente'].includes(value)) {
          sanitizedValue = '';
        }
        break;
      default:
        break;
    }
  
    const error = validateField(name, sanitizedValue);
    setValidationErrors(prevErrors => ({
      ...prevErrors,
      [name]: error
    }));
    
    setFilters(prevFilters => ({
      ...prevFilters,
      [name]: sanitizedValue
    }));
  };

  // Efecto para cargar los pagos al cambiar los filtros con debounce
  useEffect(() => {
    const fetchPayments = async () => {
      try {
        if (!userId || !token) {
          throw new Error("User ID or token not found");
        }
        
        // Filtrar parámetros vacíos
        const validFilters = Object.entries(filters).reduce((acc, [key, value]) => {
          if (value && value !== "todas") {
            acc[key] = value;
          }
          return acc;
        }, {});
        
        const queryParams = new URLSearchParams(validFilters).toString();
        const url = queryParams 
          ? `${API_BASE_URL}/api/admin/obtenerhistorialpagosclientes?${queryParams}`
          : `${API_BASE_URL}/api/admin/obtenerhistorialpagosclientes`;
          
        const response = await fetch(url, {
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
        setPayments(data);
      } catch (err) {
        setError(err.message || "Error fetching payments");
      } finally {
        setLoading(false);
      }
    };

    // Debounce para evitar muchas solicitudes durante la escritura
    const timerId = setTimeout(() => {
      fetchPayments();
    }, 300);
    
    return () => clearTimeout(timerId);
  }, [filters, userId, token]);

  return (
    <SidebarDoctor>
      <div className="flex flex-col p-6 gap-6 md:-ml-64">

        <WelcomeHeader 
            customMessage="Aquí está tu historial de pagos."
          />

        {/* Filtros */}
        <div className="mb-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <input
              type="text"
              name="nombre"
              placeholder="Filtrar por nombre"
              value={filters.nombre}
              onChange={handleFilterChange}
              className="p-2 border rounded-lg w-full"
            />
            {validationErrors.nombre && <p className="text-red-500 text-sm">{validationErrors.nombre}</p>}
          </div>
          
          <div>
            <input
              type="text"
              name="dni"
              placeholder="Filtrar por DNI"
              value={filters.dni}
              onChange={handleFilterChange}
              className="p-2 border rounded-lg w-full"
              inputMode="numeric"
              maxLength={8}
            />
            {validationErrors.dni && <p className="text-red-500 text-sm">{validationErrors.dni}</p>}
          </div>
          
          <div>
            <input
              type="text"
              name="idPago"
              placeholder="Filtrar por ID de pago"
              value={filters.idPago}
              onChange={handleFilterChange}
              className="p-2 border rounded-lg w-full"
              inputMode="numeric"
            />
            {validationErrors.idPago && <p className="text-red-500 text-sm">{validationErrors.idPago}</p>}
          </div>
          
          <div>
            <input
              type="date"
              name="fecha"
              value={filters.fecha}
              onChange={handleFilterChange}
              className="p-2 border rounded-lg w-full"
            />
          </div>
          
          <div>
            <select
              name="estado"
              value={filters.estado}
              onChange={handleFilterChange}
              className="p-2 border rounded-lg w-full"
            >
              <option value="">Todos los estados</option>
              <option value="pagado">Pagado</option>
              <option value="pendiente">Pendiente</option>
            </select>
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