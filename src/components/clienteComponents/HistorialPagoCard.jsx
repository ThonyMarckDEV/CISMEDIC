import React, { useState } from 'react';
import { Calendar, CreditCard, DownloadCloud, Clock, User, Stethoscope, IdCard } from "lucide-react";
import API_BASE_URL from '../../js/urlHelper';
import jwtUtils from '../../utilities/jwtUtils';

const HistorialPagoCard = ({ payment }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [downloadError, setDownloadError] = useState(null);

  if (!payment) {
    return (
      <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 p-6">
        <p className="text-gray-500">No hay información de pago disponible</p>
      </div>
    );
  }

  const handleDownloadPDF = async () => {
    setIsLoading(true);
    setDownloadError(null);
    try {
      const token = jwtUtils.getTokenFromCookie();
      if (!token) {
        throw new Error('No se encontró el token de autenticación');
      }
      const response = await fetch(
        `${API_BASE_URL}/api/descargar-boleta/${payment.idCita}`,
        {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/pdf',
            'Cache-Control': 'no-cache'
          }
        }
      );
      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        console.error('Error Response:', response.status, errorData);
        const errorMessage = errorData?.error || 'Error al descargar el comprobante';
        setDownloadError(errorMessage);
        throw new Error(errorMessage);
      }
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/pdf')) {
        throw new Error('El formato del comprobante no es válido');
      }
      const blob = await response.blob();
      if (blob.size === 0) {
        throw new Error('El archivo PDF está vacío');
      }
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `boleta_pago_${payment.idPago}.pdf`);
      document.body.appendChild(link);
      link.click();
      setTimeout(() => {
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      }, 100);
    } catch (error) {
      console.error('Error en la descarga:', error);
      setDownloadError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const estado = payment?.estado || 'pendiente';
  const showPDFDownload = estado === 'pagado';

  // Función para formatear fechas considerando la zona horaria local
  const formatDate = (dateString) => {
    if (!dateString) return 'Fecha no disponible';
    try {
      const date = new Date(dateString);
      // Ajustar la fecha según la zona horaria local
      const options = {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        timeZone: 'UTC' // Asegurarse de que no haya desfase por zona horaria
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
          <div className={`px-3 py-1 rounded-full text-sm font-medium ${
            estado === 'pagado' ? 'bg-green-50 text-green-700' :
            'bg-gray-100 text-gray-700'
          }`}>
            {estado}
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
        {showPDFDownload && (
          <div className="flex items-center gap-3 text-gray-700">
            <DownloadCloud className="h-5 w-5 text-green-600" />
            <button
              onClick={handleDownloadPDF}
              disabled={isLoading}
              className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition-all disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Descargando...' : 'Descargar Comprobante'}
            </button>
            {downloadError && (
              <p className="text-red-500 text-sm">{downloadError}</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default HistorialPagoCard;