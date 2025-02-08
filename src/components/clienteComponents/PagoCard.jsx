import React, { useState } from 'react';
import { User, Tag, Calendar, CreditCard, DownloadCloud, XCircle } from "lucide-react";
import MercadoPago from "../../components/clienteComponents/MercadoPago";
import API_BASE_URL from '../../js/urlHelper';
import jwtUtils from '../../utilities/jwtUtils';
import SweetAlert from '../SweetAlert';

const PagoCard = ({ appointment, invisible }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [downloadError, setDownloadError] = useState(null);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [motivoSeleccionado, setMotivoSeleccionado] = useState("");
  const [otroMotivo, setOtroMotivo] = useState("");
  const [cancelError, setCancelError] = useState(null);

  // Función para formatear la fecha correctamente
  const formatDate = (dateString) => {
    if (!dateString) return "Fecha no disponible";

    // Asegúrate de que la fecha esté en formato YYYY-MM-DD
    const date = new Date(dateString + 'T00:00:00'); // Agregar 'T00:00:00' para evitar ajustes de zona horaria
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  // Función para manejar la descarga del PDF
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
      link.setAttribute('download', `boleta_cita_${appointment.idCita}.pdf`);
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

  const handleCancelarCita = async () => {
    const token = jwtUtils.getTokenFromCookie();
    const idCliente = jwtUtils.getIdUsuario(token);

    if (!motivoSeleccionado) {
      setCancelError("Por favor, selecciona un motivo de cancelación.");
      return;
    }
  
    if (motivoSeleccionado === "Otro" && !otroMotivo) {
      setCancelError("Por favor, ingresa el motivo de cancelación.");
      return;
    }
  
    setIsLoading(true);
    setCancelError(null);
  
    try {
      const token = jwtUtils.getTokenFromCookie();
      if (!token) {
        throw new Error('No se encontró el token de autenticación');
      }
  
      const motivoFinal = motivoSeleccionado === "Otro" ? otroMotivo : motivoSeleccionado;
  
      const url = `${API_BASE_URL}/api/cancelar-cita/${appointment.idCita}`;
      const response = await fetch(url, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          motivo: motivoFinal,
          idCliente: idCliente,
        }),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al cancelar la cita');
        SweetAlert.showMessageAlert('Error!','Error al cancelar la cita','error');
      }

      setShowCancelModal(false);
      SweetAlert.showMessageAlert('Exito!','Cita cancelada Exitosamente','success');
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    } catch (error) {
      console.error('Error al cancelar la cita:', error);
      setCancelError(error.message);
      SweetAlert.showMessageAlert('Error!','Error al cancelar la cita' + error,'error');
    } finally {
      setIsLoading(false);
    }
  };

  const showPDFDownload = appointment.estado === 'pagado' || appointment.estado === 'completada';
  const showCancelButton = appointment.estado === 'pago pendiente';

  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100">
      {/* Card Header */}
      <div className="bg-gradient-to-r from-green-100 to-green-200 px-6 py-4 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <span className="text-lg font-semibold text-gray-800">
            Cita #{appointment.idCita}
          </span>
          <div className="flex items-center gap-3">
            <div className={`px-3 py-1 rounded-full text-sm font-medium ${
              appointment.estado === 'confirmado' ? 'bg-green-50 text-green-700' :
              appointment.estado === 'pago pendiente' ? 'bg-amber-100 text-amber-700' :
              appointment.estado === 'pagado' ? 'bg-blue-50 text-blue-700' :
              appointment.estado === 'completada' ? 'bg-green-50 text-green-700' :
              appointment.estado === 'cancelada' ? 'bg-red-50 text-red-700' :
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
                    className={`h-5 w-5 text-green-700 ${isLoading ? 'animate-pulse' : ''}`}
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
          <User className="h-5 w-5 text-green-600"/>
          <div>
            <p className="text-sm text-gray-500">Doctor</p>
            <p className="font-medium">{appointment.doctorNombre} {appointment.doctorApellidos}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3 text-gray-700">
          <Tag className="h-5 w-5 text-green-600"/>
          <div>
            <p className="text-sm text-gray-500">Especialidad</p>
            <p className="font-medium">{appointment.especialidad}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3 text-gray-700">
          <Calendar className="h-5 w-5 text-green-600"/>
          <div>
            <p className="text-sm text-gray-500">Fecha y Hora</p>
            <p className="font-medium">
              {formatDate(appointment.fecha)} - {appointment.horaInicio}
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-3 text-gray-700">
          <CreditCard className="h-5 w-5 text-green-600"/>
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

        {showCancelButton && (
          <button
            onClick={() => setShowCancelModal(true)}
            className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition-all"
          >
            Cancelar Cita
          </button>
        )}
      </div>

      {/* Modal de cancelación */}
      {showCancelModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-96">
            <h2 className="text-lg font-semibold mb-4">Motivo de cancelación</h2>
            <div className="space-y-4">
              <label className="block">
                <input
                  type="radio"
                  name="motivo"
                  value="No puedo asistir"
                  onChange={(e) => setMotivoSeleccionado(e.target.value)}
                />
                <span className="ml-2">No puedo asistir</span>
              </label>
              <label className="block">
                <input
                  type="radio"
                  name="motivo"
                  value="Cambio de fecha/hora"
                  onChange={(e) => setMotivoSeleccionado(e.target.value)}
                />
                <span className="ml-2">Cambio de fecha/hora</span>
              </label>
              <label className="block">
                <input
                  type="radio"
                  name="motivo"
                  value="Otro"
                  onChange={(e) => setMotivoSeleccionado(e.target.value)}
                />
                <span className="ml-2">Otro</span>
              </label>
              {motivoSeleccionado === "Otro" && (
                <input
                  type="text"
                  placeholder="Especifica el motivo"
                  className="w-full p-2 border border-gray-300 rounded-md"
                  value={otroMotivo}
                  onChange={(e) => setOtroMotivo(e.target.value)}
                />
              )}
            </div>
            {cancelError && (
              <div className="mt-4 text-red-600 text-sm">{cancelError}</div>
            )}
            <div className="mt-6 flex justify-end space-x-4">
              <button
                onClick={() => setShowCancelModal(false)}
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400"
              >
                Cerrar
              </button>
              <button
                onClick={handleCancelarCita}
                disabled={isLoading}
                className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
              >
                {isLoading ? "Cancelando..." : "Confirmar Cancelación"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PagoCard;