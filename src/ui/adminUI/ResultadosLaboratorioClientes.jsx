// ResultadosLaboratorio.jsx
import React, { useState, useEffect } from "react";
import { Calendar, XCircle } from "lucide-react";
import SidebarCliente from "../../components/adminComponents/SidebarAdmin";
import API_BASE_URL from "../../js/urlHelper";
import jwtUtils from "../../utilities/jwtUtils";
import ResultadoCard from "../../components/adminComponents/ResultadoCard"; // Importamos el componente separado
import WelcomeHeader from '../../components/WelcomeHeader';

const ResultadosLaboratorioClientes= () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [resultados, setResultados] = useState([]);
  const [filtroFechaInicio, setFiltroFechaInicio] = useState("");
  const [filtroFechaFin, setFiltroFechaFin] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const token = jwtUtils.getTokenFromCookie();
  
  useEffect(() => {
    const fetchResultados = async () => {
      try {
        setLoading(true);
        const queryParams = new URLSearchParams({
          fecha_inicio: filtroFechaInicio,
          fecha_fin: filtroFechaFin,
          search: searchTerm,
        }).toString();

        const response = await fetch(`${API_BASE_URL}/api/admin/resultados?${queryParams}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.ok) {
          throw new Error("Error al cargar los resultados");
        }

        const data = await response.json();
        setResultados(data.resultados);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    // Debounce para la búsqueda
    const timeoutId = setTimeout(() => {
      fetchResultados();
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [filtroFechaInicio, filtroFechaFin, searchTerm]);

  return (
    <SidebarCliente>
      <div className="flex flex-col p-6 gap-6 md:-ml-64">

        <WelcomeHeader 
            customMessage="Aquí están tus resultados de Laboratorio."
          />

        <div className="flex flex-col md:flex-row gap-4 items-start">
          {/* Campo de búsqueda */}
          <div className="w-full md:w-96">
            <label htmlFor="search" className="text-sm font-medium text-gray-700 mb-1 block">
              Buscar por DNI, nombre, apellidos o ID
            </label>
            <input
              id="search"
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar..."
              className="border border-gray-300 rounded-md px-3 py-2 w-full focus:outline-none focus:border-blue-500"
            />
          </div>
          {/* Fecha de inicio */}
          <div className="w-full md:w-auto">
            <label htmlFor="filtroFechaInicio" className="text-sm font-medium text-gray-700 mb-1 block">
              Fecha de inicio
            </label>
            <input
              id="filtroFechaInicio"
              type="date"
              value={filtroFechaInicio}
              onChange={(e) => setFiltroFechaInicio(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2 w-full focus:outline-none focus:border-blue-500"
            />
          </div>
          {/* Fecha de fin */}
          <div className="w-full md:w-auto">
            <label htmlFor="filtroFechaFin" className="text-sm font-medium text-gray-700 mb-1 block">
              Fecha de fin
            </label>
            <input
              id="filtroFechaFin"
              type="date"
              value={filtroFechaFin}
              onChange={(e) => setFiltroFechaFin(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2 w-full focus:outline-none focus:border-blue-500"
            />
          </div>
          {/* Botones */}
          <div className="flex flex-col justify-end mt-3 md:mt-7">
            {/* Botón para limpiar filtros */}
            <button
              onClick={() => {
                setSearchTerm('');
                setFiltroFechaInicio('');
                setFiltroFechaFin('');
              }}
              className="bg-red-500 text-white px-4 py-2 rounded-md flex items-center gap-2 w-full md:w-auto hover:bg-red-600 transition-colors"
            >
              <XCircle size={16} />
              Limpiar Filtros
            </button>
          </div>
        </div>


        {/* Loading State */}
        {loading && (
          <div className="text-center text-gray-500 flex flex-col items-center justify-center gap-2">
            <Calendar className="h-8 w-8 animate-spin text-green-600" />
            <p>Cargando tus resultados...</p>
          </div>
        )}

        {/* Resultados */}
        {!loading && resultados.length === 0 ? (
          <div className="text-center text-gray-500">
            <p>No tienes resultados médicos disponibles.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {resultados.map((resultado) => (
              <ResultadoCard key={resultado.idResultados} resultado={resultado} />
            ))}
          </div>
        )}
      </div>
    </SidebarCliente>
  );
};

export default ResultadosLaboratorioClientes;