import React, { useState } from 'react';
import { User, Tag, Calendar, CreditCard, DownloadCloud } from "lucide-react";
import MercadoPago from "../../components/clienteComponents/MercadoPago";
import API_BASE_URL from '../../js/urlHelper';
import jwtUtils from '../../utilities/jwtUtils';

const AppointmentCard = ({ appointment, invisible }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [downloadError, setDownloadError] = useState(null);

  const handleDownloadPDF = async () => {
    setIsLoading(true);
    setDownloadError(null);
    
    try {
      const token = jwtUtils.getTokenFromCookie();
      
      if (!token) {
        throw new Error('No se encontró el token de autenticación');
      }

      const response = await fetch(
        `${API_BASE_URL}/api/descargar-boleta/${appointment.idCita}`,
        {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/pdf',
            'Cache-Control': 'no-cache' // Evitar caché
          }
        }
      );
      
      // Manejar errores HTTP
      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        console.error('Error Response:', response.status, errorData);
        
        const errorMessage = errorData?.error || 'Error al descargar el comprobante';
        setDownloadError(errorMessage);
        throw new Error(errorMessage);
      }

      // Verificar el tipo de contenido
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/pdf')) {
        throw new Error('El formato del comprobante no es válido');
      }

      const blob = await response.blob();
      
      if (blob.size === 0) {
        throw new Error('El archivo PDF está vacío');
      }

      // Crear y ejecutar la descarga
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `boleta_cita_${appointment.idCita}.pdf`);
      document.body.appendChild(link);
      link.click();
      
      // Limpieza
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

  const showPDFDownload = appointment.estado === 'pagado' || appointment.estado === 'completada';

  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100">
      {/* Card Header */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-4 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <span className="text-lg font-semibold text-gray-800">
            Cita #{appointment.idCita}
          </span>
          <div className="flex items-center gap-3">
            <div className={`px-3 py-1 rounded-full text-sm font-medium ${
              appointment.estado === 'confirmado' ? 'bg-green-100 text-green-700' :
              appointment.estado === 'pago pendiente' ? 'bg-amber-100 text-amber-700' :
              appointment.estado === 'pagado' ? 'bg-blue-100 text-blue-700' :
              appointment.estado === 'completada' ? 'bg-green-100 text-green-700' :
              'bg-gray-100 text-gray-700'
            }`}>
              {appointment.estado}
            </div>
            {showPDFDownload && (
              <div className="relative">
                <button
                  onClick={handleDownloadPDF}
                  disabled={isLoading}
                  className={`p-2 hover:bg-gray-100 rounded-full transition-colors duration-200 
                    ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                  title="Descargar comprobante"
                >
                  <DownloadCloud 
                    className={`h-5 w-5 text-blue-500 ${isLoading ? 'animate-pulse' : ''}`}
                    strokeWidth={2}
                  />
                </button>
                {downloadError && (
                  <div className="absolute right-0 top-full mt-2 p-2 bg-red-50 border border-red-200 rounded-md text-red-600 text-sm whitespace-nowrap z-10">
                    {downloadError}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Card Content */}
      <div className="p-6 space-y-4">
        <div className="flex items-center gap-3 text-gray-700">
          <User className="h-5 w-5 text-blue-500"/>
          <div>
            <p className="text-sm text-gray-500">Doctor</p>
            <p className="font-medium">{appointment.doctorNombre} {appointment.doctorApellidos}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3 text-gray-700">
          <Tag className="h-5 w-5 text-blue-500"/>
          <div>
            <p className="text-sm text-gray-500">Especialidad</p>
            <p className="font-medium">{appointment.especialidad}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3 text-gray-700">
          <Calendar className="h-5 w-5 text-blue-500"/>
          <div>
            <p className="text-sm text-gray-500">Fecha y Hora</p>
            <p className="font-medium">
              {new Date(appointment.fecha).toLocaleDateString()} - {appointment.horaInicio}
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-3 text-gray-700">
          <CreditCard className="h-5 w-5 text-blue-500"/>
          <div>
            <p className="text-sm text-gray-500">Costo</p>
            <p className="font-medium">S/.{appointment.costo.toFixed(2)}</p>
          </div>
        </div>
        
        {appointment.estado === "pago pendiente" && (
          <div className="pt-4">
            <MercadoPago
              cita={{
                idCita: appointment.idCita,
                monto: appointment.costo,
              }}
              appointment={appointment}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default AppointmentCard;