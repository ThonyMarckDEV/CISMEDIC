import React from "react";
import { User, Tag, Calendar } from "lucide-react";

const CardMisCitas = ({ appointment }) => {
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
            className={`px-3 py-1 rounded-full text-sm font-medium ${
              appointment.estado === 'completada'
                ? 'bg-green-50 text-green-700'
                : appointment.estado === 'pago pendiente'
                ? 'bg-amber-100 text-amber-700'
                : appointment.estado === 'pagado'
                ? 'bg-blue-50 text-blue-700'
                : appointment.estado === 'cancelada'
                ? 'bg-red-50 text-red-700'
                : 'bg-gray-100 text-gray-700'
            }`}
          >
            {appointment.estado}
          </div>
        </div>
      </div>
      {/* Card Content */}
      <div className="p-6 space-y-4">
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
              {new Date(appointment.fecha).toLocaleDateString()} -{' '}
              {appointment.horaInicio}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CardMisCitas;