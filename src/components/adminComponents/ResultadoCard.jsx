import React, { useState, useEffect } from 'react';
import { Eye, Trash2, X, Download, Maximize, Minimize } from 'lucide-react';
import API_BASE_URL from '../../js/urlHelper';
import jwtUtils from '../../utilities/jwtUtils';
import Swal from 'sweetalert2';
import LoaderScreen from '../home/LoadingScreen';

const ResultadoCardAdmin = ({ resultado }) => {
  const token = jwtUtils.getTokenFromCookie();
  const [isLoading, setIsLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [pdfError, setPdfError] = useState(false);

  // Control body overflow when modal is shown
  useEffect(() => {
    if (showModal) {
      // Prevent background scrolling
      document.body.style.overflow = 'hidden';
    } else {
      // Re-enable scrolling
      document.body.style.overflow = 'auto';
    }

    // Cleanup function to ensure scrolling is re-enabled if component unmounts
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [showModal]);

  const handleOpenModal = () => {
    setShowModal(true);
    setPdfError(false);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setIsFullscreen(false);
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

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

  // Formatear fecha (si es necesario)
  const formatDate = (dateString) => {
    if (!dateString) return 'Fecha no disponible';
    try {
      const date = new Date(dateString);
      const options = {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        timeZone: 'UTC'
      };
      return new Intl.DateTimeFormat('es-ES', options).format(date);
    } catch (error) {
      return 'Fecha inválida';
    }
  };

  // Convierte la URL HTTP a HTTPS si es necesario
  const pdfUrl = resultado.ruta_archivo 
    ? `${API_BASE_URL}/storage/${resultado.ruta_archivo}`
    : '';
    
  // Usar URL segura para enlaces externos
  const getSecureUrl = (url) => {
    if (!url) return '';
    return url.replace('http://', 'https://');
  };
  
  const secureUrl = getSecureUrl(pdfUrl);

  return (
    <>
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{resultado.titulo}</h3>
            <p className="text-sm text-gray-600">Fecha: {formatDate(resultado.fecha_cita)}</p>
            {/* Mostrar información del paciente */}
            <p className="text-sm text-gray-600">Paciente: {resultado.nombre_completo}</p>
            {resultado.dni && (
              <p className="text-sm text-gray-600">DNI: {resultado.dni}</p>
            )}
          </div>
          <div className="flex gap-2">
            {/* Botón de ver PDF - Ahora abre el modal */}
            <button
              onClick={handleOpenModal}
              className="text-blue-600 hover:text-blue-800 transition-colors"
            >
              <Eye className="w-5 h-5" />
            </button>

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

      {/* Modal para ver resultados */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center">
          <div 
            className={`bg-white rounded-lg shadow-xl overflow-hidden flex flex-col ${
              isFullscreen ? 'fixed inset-0 m-0' : 'w-full max-w-4xl mx-4 h-5/6'
            }`}
          >
            {/* Encabezado del modal */}
            <div className="bg-green-600 text-white px-4 py-3 flex justify-between items-center">
              <h3 className="font-medium truncate">
                Resultado: {resultado.titulo}
              </h3>
              <div className="flex items-center gap-2">
                {/* Botón para ver en nueva pestaña - Visible en todas las pantallas */}
                <a 
                  href={secureUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="p-1 hover:bg-green-700 rounded transition-colors"
                  title="Ver en nueva pestaña"
                >
                  <Eye className="h-5 w-5" />
                </a>
                
                {/* Botón de pantalla completa */}
                <button 
                  onClick={toggleFullscreen}
                  className="p-1 hover:bg-green-700 rounded transition-colors"
                  title={isFullscreen ? "Salir de pantalla completa" : "Pantalla completa"}
                >
                  {isFullscreen ? <Minimize className="h-5 w-5" /> : <Maximize className="h-5 w-5" />}
                </button>
                
                {/* Botón para cerrar */}
                <button 
                  onClick={handleCloseModal}
                  className="p-1 hover:bg-green-700 rounded transition-colors"
                  title="Cerrar"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>
            
            {/* Contenido del modal */}
            <div className="flex-grow bg-gray-100 overflow-hidden relative">
              {pdfError ? (
                <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center">
                  <div className="text-red-500 mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">No se puede mostrar el PDF</h3>
                  <p className="text-gray-600 mb-6">El PDF no puede mostrarse dentro de la aplicación porque el contenido no está disponible en formato HTTPS seguro.</p>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <a 
                      href={secureUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded transition-colors text-white flex items-center justify-center gap-2"
                    >
                      <Eye className="h-4 w-4" />
                      <span>Ver en nueva pestaña</span>
                    </a>
                    <a 
                      href={secureUrl} 
                      download={`Resultado-${resultado.nombre_completo}.pdf`}
                      className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded transition-colors text-white flex items-center justify-center gap-2"
                    >
                      <Download className="h-4 w-4" />
                      <span>Descargar</span>
                    </a>
                  </div>
                </div>
              ) : (
                <>
                  <iframe 
                    src={secureUrl + '#toolbar=0'} 
                    className="w-full h-full"
                    title={`Resultado de ${resultado.nombre_completo}`}
                    onError={() => setPdfError(true)}
                  />
                  {/* Fallback si el iframe no carga */}
                  <noscript>
                    <div className="absolute inset-0 flex items-center justify-center bg-gray-100 p-8 text-center">
                      <p>No se puede cargar el PDF. Por favor, usa los botones para ver o descargar el archivo.</p>
                    </div>
                  </noscript>
                </>
              )}
            </div>
            
            {/* Información del paciente */}
            <div className="p-4 bg-gray-50 border-t border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Paciente</p>
                  <p className="font-medium">{resultado.nombre_completo}</p>
                </div>
                {resultado.dni && (
                  <div>
                    <p className="text-sm text-gray-500">DNI</p>
                    <p className="font-medium">{resultado.dni}</p>
                  </div>
                )}
                <div>
                  <p className="text-sm text-gray-500">Fecha</p>
                  <p className="font-medium">{formatDate(resultado.fecha_cita)}</p>
                </div>
                {resultado.observaciones && (
                  <div className="col-span-1 md:col-span-2">
                    <p className="text-sm text-gray-500">Observaciones</p>
                    <p className="font-medium">{resultado.observaciones}</p>
                  </div>
                )}
              </div>
            </div>
            
          </div>
        </div>
      )}
    </>
  );
};

export default ResultadoCardAdmin;