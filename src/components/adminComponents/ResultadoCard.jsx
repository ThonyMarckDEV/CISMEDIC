import React, { useState } from 'react';
import { Eye, Trash2 } from 'lucide-react'; // Importar ícono de ojo
import API_BASE_URL from '../../js/urlHelper';
import jwtUtils from '../../utilities/jwtUtils';
import Swal from 'sweetalert2';
import LoaderScreen from '../home/LoadingScreen';

const ResultadoCardAdmin = ({ resultado }) => {
  const token = jwtUtils.getTokenFromCookie();
  const [isLoading, setIsLoading] = useState(false);

  const handleDelete = async () => {
    // Mostrar SweetAlert2 para confirmación
    const result = await Swal.fire({
      title: '¿Estás seguro?',
      text: 'Esta acción marcará el resultado como eliminado.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
    });

    // Si el usuario confirma, proceder con la eliminación lógica
    if (result.isConfirmed) {
      setIsLoading(true);
      try {
        const response = await fetch(`${API_BASE_URL}/api/admin/resultados/${resultado.idResultados}`, {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!response.ok) throw new Error('Error al eliminar');

        // Notificar éxito
        Swal.fire('Eliminado', 'El resultado ha sido marcado como eliminado.', 'success');
        setTimeout(() => {
          window.location.reload();
        }, 1200);
      } catch (error) {
        console.error('Error:', error);

        // Mostrar mensaje de error
        Swal.fire('Error', 'Ocurrió un error al eliminar el resultado.', 'error');
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{resultado.titulo}</h3>
          <p className="text-sm text-gray-600">Fecha: {resultado.fecha_cita}</p>
          {/* Mostrar información del paciente */}
          <p className="text-sm text-gray-600">Paciente: {resultado.nombre_completo}</p>
          {resultado.dni && (
            <p className="text-sm text-gray-600">DNI: {resultado.dni}</p>
          )}
        </div>
        <div className="flex gap-2">
          {/* Botón de ver PDF */}
          <a
            href={`${API_BASE_URL}/storage/${resultado.ruta_archivo}`} // Concatenar la ruta del archivo
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:text-blue-800 transition-colors"
          >
            <Eye className="w-5 h-5" />
          </a>

          {/* Botón de eliminar */}
          <button
            onClick={handleDelete}
            className="text-red-600 hover:text-red-800 transition-colors"
          >
            <Trash2 className="w-5 h-5" />
          </button>
        </div>
      </div>
      <p className="text-gray-700">{resultado.observaciones}</p>
      {isLoading && <LoaderScreen />}
    </div>
  );
};

export default ResultadoCardAdmin;