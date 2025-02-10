import React from "react";
import { Download, FileText, HeartPulse, Calendar } from "lucide-react"; // Iconos adicionales para un diseño más temático
import API_BASE_URL from "../../js/urlHelper";
import jwtUtils from "../../utilities/jwtUtils";

const ResultadoCard = ({ resultado }) => {
  const handleDescargar = async (idResultado) => {
    try {
      const token = jwtUtils.getTokenFromCookie();
      // Llamar a la API para descargar el archivo
      const response = await fetch(`${API_BASE_URL}/api/descargar-resultado/${idResultado}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`, // Agregar el token al encabezado
        },
      });

      if (!response.ok) {
        throw new Error("Error al descargar el resultado");
      }

      // Convertir la respuesta a un blob
      const blob = await response.blob();

      // Crear un enlace temporal para descargar el archivo
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = `${resultado.titulo}.pdf`; // Nombre del archivo
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Error al descargar el resultado:", error);
      alert("Hubo un problema al descargar el resultado. Inténtalo de nuevo.");
    }
  };

  return (
    <div className="bg-white shadow-lg rounded-2xl p-6 flex flex-col gap-4 border border-gray-100 hover:shadow-xl transition duration-300">
      {/* Encabezado con ícono médico */}
      <div className="flex items-center gap-3">
        <HeartPulse size={24} className="text-green-500" />
        <h3 className="text-xl font-semibold text-gray-800">{resultado.titulo}</h3>
      </div>

      {/* Detalles del resultado */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2 text-gray-500">
          <Calendar size={16} />
          <p>{resultado.fecha_cita}</p>
        </div>
        <div className="flex items-center gap-2 text-gray-500">
          <FileText size={16} />
          <p className="text-sm">{resultado.observaciones || "No hay observaciones disponibles"}</p>
        </div>
      </div>

      {/* Botón de descarga */}
      <button
        onClick={() => handleDescargar(resultado.idResultados)}
        className="bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-2.5 rounded-full flex items-center gap-2 hover:from-green-600 hover:to-green-700 transition duration-300"
      >
        <Download size={16} />
        Descargar PDF
      </button>
    </div>
  );
};

export default ResultadoCard;