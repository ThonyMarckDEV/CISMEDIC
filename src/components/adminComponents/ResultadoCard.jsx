import React from "react";
import { Download } from "lucide-react";
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
    <div className="bg-white shadow-lg rounded-lg p-6 flex flex-col gap-4">
      <div>
        <h3 className="text-xl font-semibold">{resultado.titulo}</h3>
        <p className="text-gray-500">{resultado.fecha_cita}</p>
        <p className="text-sm mt-2">{resultado.observaciones || "No hay observaciones disponibles"}</p>
      </div>
      <button
        onClick={() => handleDescargar(resultado.idResultados)}
        className="bg-green-600 text-white px-4 py-2 rounded-md flex items-center gap-2 hover:bg-green-700 transition"
      >
        <Download size={16} /> Descargar PDF
      </button>
    </div>
  );
};

export default ResultadoCard;