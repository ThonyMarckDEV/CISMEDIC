// ResultadosLaboratorio.jsx
import React, { useState, useEffect } from "react";
import { Calendar, XCircle } from "lucide-react";
import SidebarCliente from "../../components/clienteComponents/SidebarCliente";
import API_BASE_URL from "../../js/urlHelper";
import jwtUtils from "../../utilities/jwtUtils";
import ResultadoCard from "../../components/adminComponents/ResultadoCard"; // Importamos el componente separado

const ResultadosLaboratorio = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [resultados, setResultados] = useState([]);
  const [filtroFechaInicio, setFiltroFechaInicio] = useState("");
  const [filtroFechaFin, setFiltroFechaFin] = useState("");

  const token = jwtUtils.getTokenFromCookie();
  const userId = jwtUtils.getIdUsuario(token);
  const userName = jwtUtils.getNombres(token);

  useEffect(() => {
    const fetchResultados = async () => {
      try {
        setLoading(true);
        const queryParams = new URLSearchParams({
          fecha_inicio: filtroFechaInicio,
          fecha_fin: filtroFechaFin,
        }).toString();

        const response = await fetch(`${API_BASE_URL}/api/cliente/resultados/${userId}?${queryParams}`, {
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

    fetchResultados();
  }, [filtroFechaInicio, filtroFechaFin]);

  return (
    <SidebarCliente>
      <div className="flex flex-col p-6 gap-6 md:-ml-64">
        {/* Header */}
        <div className="mb-8 bg-gradient-to-r from-green-600 to-green-900 rounded-3xl shadow-lg overflow-hidden">
          <div className="px-8 py-12 relative">
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
              Bienvenido, {userName || "Usuario"}
            </h1>
            <p className="text-violet-100 text-lg">Aquí están tus resultados de Laboratorio.</p>
          </div>
        </div>

        {/* Filtros */}
        <div className="flex gap-4 items-center">
          <input
            type="date"
            value={filtroFechaInicio}
            onChange={(e) => setFiltroFechaInicio(e.target.value)}
            placeholder="Fecha inicio"
            className="border border-gray-300 rounded-md px-3 py-2"
          />
          <input
            type="date"
            value={filtroFechaFin}
            onChange={(e) => setFiltroFechaFin(e.target.value)}
            placeholder="Fecha fin"
            className="border border-gray-300 rounded-md px-3 py-2"
          />
          <button
            onClick={() => {
              setFiltroFechaInicio("");
              setFiltroFechaFin("");
            }}
            className="bg-red-500 text-white px-4 py-2 rounded-md flex items-center gap-2"
          >
            <XCircle size={16} /> Limpiar Filtros
          </button>
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

export default ResultadosLaboratorio;