import React, { useState } from "react";
import { User, Tag, Calendar } from "lucide-react";

const CardHistorialCitasCliente = ({ appointment }) => {
  // Función para formatear la fecha
  const formatDate = (dateString) => {
    const date = new Date(`${dateString}T12:00:00`);
    return date.toLocaleDateString();
  };

  // Estado para controlar si el tooltip está visible
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <div
      key={appointment.idCita}
      className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100"
    >
      {/* Card Header */}
      <div className="bg-gradient-to-r from-green-100 to-green-200 px-6 py-4 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <span className="text-lg font-semibold text-gray-800">
            Cita #{appointment.idCita}
          </span>
          <div
            className={`px-3 py-1 rounded-full text-sm font-medium relative ${
              appointment.estado === "completada"
                ? "bg-green-50 text-green-700"
                : appointment.estado === "cancelada"
                ? "bg-red-50 text-red-700 cursor-pointer"
                : "bg-gray-100 text-gray-700"
            }`}
            onMouseEnter={() => setShowTooltip(true)}
            onMouseLeave={() => setShowTooltip(false)}
          >
            {appointment.estado}
            {/* Tooltip para mostrar el motivo de la cancelación */}
            {showTooltip && appointment.estado === "cancelada" && (
              <div
                className="absolute top-full right-0 mt-2 bg-white border border-gray-200 rounded-md shadow-lg p-3 z-10"
              >
                <p className="text-sm text-gray-500">Motivo de cancelación:</p>
                <p className="text-sm font-medium">{appointment.motivo}</p>
              </div>
            )}
          </div>
        </div>
      </div>
      {/* Card Content */}
      <div className="p-6 space-y-4">
        {/* Detalles de la cita */}
        <div className="flex items-center gap-3 text-gray-700">
          <User className="h-5 w-5 text-green-600" />
          <div>
            <p className="text-sm text-gray-500">Paciente</p>
            <p className="font-medium">
              {appointment.pacienteNombre} {appointment.pacienteApellidos}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3 text-gray-700">
          <User className="h-5 w-5 text-green-600" />
          <div>
            <p className="text-sm text-gray-500">DNI</p>
            <p className="font-medium">{appointment.dni}</p>
          </div>
        </div>
        <div className="flex items-center gap-3 text-gray-700">
          <User className="h-5 w-5 text-green-600" />
          <div>
            <p className="text-sm text-gray-500">Doctor</p>
            <p className="font-medium">
              {appointment.doctorNombre} {appointment.doctorApellidos}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3 text-gray-700">
          <Tag className="h-5 w-5 text-green-600" />
          <div>
            <p className="text-sm text-gray-500">Especialidad</p>
            <p className="font-medium">{appointment.especialidad}</p>
          </div>
        </div>
        <div className="flex items-center gap-3 text-gray-700">
          <Calendar className="h-5 w-5 text-green-600" />
          <div>
            <p className="text-sm text-gray-500">Fecha y Hora</p>
            <p className="font-medium">
              {formatDate(appointment.fecha)} - {appointment.horaInicio}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CardHistorialCitasCliente;