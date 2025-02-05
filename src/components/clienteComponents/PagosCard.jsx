// AppointmentCard.jsx
import React from 'react';
import { User, Tag, Calendar, CreditCard } from "lucide-react";
import MercadoPago from "../../components/clienteComponents/MercadoPago";

const AppointmentCard = ({ appointment }) => {
  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100">
      {/* Card Header */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-4 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <span className="text-lg font-semibold text-gray-800">
            Cita #{appointment.idCita}
          </span>
          <div className={`px-3 py-1 rounded-full text-sm font-medium ${
            appointment.estado === 'confirmado' ? 'bg-green-100 text-green-700' :
            appointment.estado === 'pago pendiente' ? 'bg-amber-100 text-amber-700' :
            'bg-gray-100 text-gray-700'
          }`}>
            {appointment.estado}
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
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default AppointmentCard;