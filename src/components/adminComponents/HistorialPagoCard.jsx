import React, { useState, useEffect } from 'react';
import { Calendar, CreditCard, Eye, Clock, User, Stethoscope, IdCard, Maximize, Minimize, X } from "lucide-react";
import API_BASE_URL from '../../js/urlHelper';
import jwtUtils from '../../utilities/jwtUtils';

const HistorialPagoCard = ({ payment }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pdfUrl, setPdfUrl] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Add useEffect to control body overflow when modal is open
  useEffect(() => {
    if (showModal) {
      // Prevent scrolling on the background
      document.body.style.overflow = 'hidden';
    } else {
      // Re-enable scrolling when modal is closed
      document.body.style.overflow = 'auto';
    }

    // Cleanup function to ensure scrolling is re-enabled if component unmounts
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [showModal]);

  if (!payment) {
    return (
      <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 p-6">
        <p className="text-gray-500">No hay información de pago disponible</p>
      </div>
    );
  }

  const handleViewPDF = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const token = jwtUtils.getTokenFromCookie();
      if (!token) {
        throw new Error('No se encontró el token de autenticación');
      }
      const response = await fetch(
        `${API_BASE_URL}/api/admin/ver-boleta/${payment.idCita}`,
        {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          }
        }
      );
      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        console.error('Error Response:', response.status, errorData);
        const errorMessage = errorData?.error || 'Error al obtener el comprobante';
        setError(errorMessage);
        throw new Error(errorMessage);
      }
      const data = await response.json();
      setPdfUrl(data.url);
      setShowModal(true);
    } catch (error) {
      console.error('Error al obtener el PDF:', error);
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setIsFullscreen(false);
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  const estado = payment?.estado || 'pendiente';
  const showPDFView = estado === 'pagado';

  // Función para formatear fechas
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

  // Función para formatear horas
  const formatTime = (timeString) => {
    if (!timeString) return 'Hora no disponible';
    return timeString.substring(0, 5); // Obtiene solo HH:mm
  };

  return (
    <>
      <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100">
        {/* Card Header */}
        <div className="bg-gradient-to-r from-green-100 to-green-200 px-6 py-4 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-lg font-semibold text-gray-800">
                Pago #{payment.idPago || 'N/A'}
              </span>
              <span className="text-sm text-gray-600">
                Cita #{payment.idCita || 'N/A'}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                estado === 'pagado' ? 'bg-green-50 text-green-700' :
                'bg-gray-100 text-gray-700'
              }`}>
                {estado}
              </div>
              {showPDFView && (
                <button
                  onClick={handleViewPDF}
                  disabled={isLoading}
                  className="text-green-600 hover:text-green-700 transition-all disabled:text-gray-400 disabled:cursor-not-allowed flex items-center gap-1"
                >
                  <Eye className="h-5 w-5" />
                  <span className="hidden sm:inline text-sm">Ver boleta</span>
                </button>
              )}
            </div>
          </div>
        </div>
        {/* Card Content */}
        <div className="p-6 space-y-4">
          {/* Detalles del Cliente */}
          <div className="flex items-center gap-3 text-gray-700">
            <User className="h-5 w-5 text-green-600" />
            <div>
              <p className="text-sm text-gray-500">Cliente</p>
              <p className="font-medium">
                {payment.clienteNombre} {payment.clienteApellidos}
              </p>
            </div>
          </div>
          {/* DNI */}
          <div className="flex items-center gap-3 text-gray-700">
            <IdCard className="h-5 w-5 text-green-600" />
            <div>
              <p className="text-sm text-gray-500">DNI</p>
              <p className="font-medium">{payment.dni || 'No disponible'}</p>
            </div>
          </div>
          {/* Especialidad */}
          <div className="flex items-center gap-3 text-gray-700">
            <Stethoscope className="h-5 w-5 text-green-600" />
            <div>
              <p className="text-sm text-gray-500">Especialidad</p>
              <p className="font-medium">{payment.especialidad || 'No disponible'}</p>
            </div>
          </div>
          {/* Detalles del Pago */}
          <div className="flex items-center gap-3 text-gray-700">
            <CreditCard className="h-5 w-5 text-green-600" />
            <div>
              <p className="text-sm text-gray-500">Monto</p>
              <p className="font-medium">S/.{parseFloat(payment.monto || 0).toFixed(2)}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 text-gray-700">
            <Calendar className="h-5 w-5 text-green-600" />
            <div>
              <p className="text-sm text-gray-500">Fecha de Pago</p>
              <p className="font-medium">
                {formatDate(payment.fecha_pago)}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3 text-gray-700">
            <Clock className="h-5 w-5 text-green-600" />
            <div>
              <p className="text-sm text-gray-500">Hora del Pago</p>
              <p className="font-medium">
                {formatTime(payment.hora_generacion)}
              </p>
            </div>
          </div>

          {/* Detalles de la Cita */}
          <div className="flex items-center gap-3 text-gray-700">
            <Calendar className="h-5 w-5 text-green-600" />
            <div>
              <p className="text-sm text-gray-500">Fecha y Hora de Cita</p>
              <p className="font-medium">
                {formatDate(payment.fecha_cita)} - {formatTime(payment.hora_cita)}
              </p>
            </div>
          </div>
          {payment.tipo_comprobante && (
            <div className="flex items-center gap-3 text-gray-700">
              <p className="text-sm">
                <span className="text-gray-500">Tipo de Comprobante:</span>{' '}
                <span className="font-medium capitalize">{payment.tipo_comprobante}</span>
              </p>
            </div>
          )}
          {payment.tipo_pago && (
            <div className="flex items-center gap-3 text-gray-700">
              <p className="text-sm">
                <span className="text-gray-500">Método de Pago:</span>{' '}
                <span className="font-medium capitalize">{payment.tipo_pago}</span>
              </p>
            </div>
          )}
          {error && (
            <div className="text-red-500 text-sm">
              {error}
            </div>
          )}
        </div>
      </div>

      {/* Modal para mostrar el PDF */}
      {showModal && (
        <div className={`fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center ${isFullscreen ? 'p-0' : 'p-4'}`}>
          <div className={`bg-white rounded-lg overflow-hidden relative ${isFullscreen ? 'w-full h-full' : 'w-full max-w-4xl h-3/4'}`}>
            {/* Barra de navegación del modal */}
            <div className="bg-green-600 text-white px-4 py-3 flex justify-between items-center">
              <h3 className="font-medium truncate">
                Comprobante de Pago - {payment.clienteNombre} {payment.clienteApellidos}
              </h3>
              <div className="flex items-center gap-2">
                <button 
                  onClick={toggleFullscreen}
                  className="p-1 hover:bg-green-700 rounded transition-colors"
                >
                  {isFullscreen ? <Minimize className="h-5 w-5" /> : <Maximize className="h-5 w-5" />}
                </button>
                <button 
                  onClick={closeModal}
                  className="p-1 hover:bg-green-700 rounded transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>
            
            {/* Contenido del PDF */}
            <div className="w-full h-full bg-gray-100 overflow-hidden">
              {pdfUrl ? (
                <iframe 
                  src={`${pdfUrl}#toolbar=0`} 
                  className="w-full h-full"
                  title="Comprobante de pago"
                />
              ) : (
                <div className="flex items-center justify-center h-full">
                  <p className="text-gray-500">Cargando PDF...</p>
                </div>
              )}
            </div>
            
            {/* Barra de herramientas inferior */}
            <div className="bg-gray-100 border-t border-gray-300 p-3 flex justify-between">
              <button 
                onClick={closeModal}
                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded transition-colors text-gray-700"
              >
                Cerrar
              </button>
              <a 
                href={pdfUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded transition-colors text-white"
              >
                Abrir en nueva pestaña
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default HistorialPagoCard;