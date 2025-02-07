import React, { useState } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'moment/locale/es';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import Swal from 'sweetalert2';

moment.locale('es');
const localizer = momentLocalizer(moment);

const CalendarioHorarios = ({ horarios, onEdit, onDelete }) => {
  const [isLoading] = useState(false);

  // Convertir horarios a eventos para el calendario
  const eventos = Array.isArray(horarios)
    ? horarios.map((horario) => ({
        title: `Horario: ${moment(`${horario.fecha}T${horario.hora_inicio}`).format('HH:mm')}`,
        start: new Date(`${horario.fecha}T${horario.hora_inicio}`), // Mínimo requerido por react-big-calendar
        end: new Date(`${horario.fecha}T${horario.hora_inicio}`),   // Mínimo requerido por react-big-calendar
        horario,
      }))
    : [];

  // Manejar la selección de un evento en el calendario
  const handleSelectEvent = (event) => {
    if (event.horario.estadoCita !== 'disponible') {
      Swal.fire({
        title: 'Detalles del horario',
        html: `
          <div class="text-left">
            <p class="mb-2"><span class="font-semibold">Fecha:</span> ${moment(event.start).format('DD/MM/YYYY')}</p>
            <p class="mb-2"><span class="font-semibold">Hora:</span> ${moment(event.start).format('HH:mm')}</p>
            <p class="mb-2"><span class="font-semibold">Costo:</span> S/ ${event.horario.costo}</p>
            <p><span class="font-semibold">Estado:</span> ${event.horario.estadoCita}</p>
          </div>
        `,
        icon: 'info',
        confirmButtonText: 'Aceptar',
        customClass: {
          popup: 'rounded-lg',
          confirmButton: 'bg-indigo-600 hover:bg-indigo-700',
        },
      });
      return;
    }

    Swal.fire({
      title: 'Opciones de horario',
      html: `
        <div class="text-left">
          <p class="mb-2"><span class="font-semibold">Fecha:</span> ${moment(event.start).format('DD/MM/YYYY')}</p>
          <p class="mb-2"><span class="font-semibold">Hora:</span> ${moment(event.start).format('HH:mm')}</p>
          <p class="mb-2"><span class="font-semibold">Costo:</span> S/ ${event.horario.costo}</p>
          <p><span class="font-semibold">Estado:</span> ${event.horario.estadoCita || 'disponible'}</p>
        </div>
      `,
      showCancelButton: true,
      confirmButtonText: 'Editar',
      cancelButtonText: 'Eliminar',
      confirmButtonColor: '#4F46E5',
      cancelButtonColor: '#DC2626',
      customClass: {
        popup: 'rounded-lg',
      },
    }).then((result) => {
      if (result.isConfirmed) {
        onEdit(event.horario);
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        onDelete(event.horario.idHorario);
      }
    });
  };

  // Personalizar los estilos de los eventos
  const eventPropGetter = (event) => {
    const style = {
      backgroundColor: '',
      color: 'white',
      borderRadius: '8px',
      border: 'none',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '39px', // Altura mínima para todos los eventos
      padding: '8px', // Aumentar el padding para mejorar la legibilidad
      fontSize: '14px', // Tamaño de fuente más grande
      fontWeight: '500',
      boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)',
      transition: 'all 0.2s ease',
    };

    if (event.horario.estadoCita === 'ocupado') {
      style.backgroundColor = '#4F46E5'; // Azul para eventos ocupados
      style.pointerEvents = 'none'; // Deshabilitar interacción
    } else {
      style.backgroundColor = '#10B981'; // Verde para eventos disponibles
      style.cursor = 'pointer';
      style[':hover'] = {
        transform: 'translateY(-1px)',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
      };
    }

    return { style };
  };

 // Personalizar el renderizado de los eventos
 const EventComponent = ({ event }) => {
  return (
    <div className="text-center w-full truncate">
      {event.title}
    </div>
  );
};

return (
  <div className="overflow-y-auto">
    {isLoading ? (
      <div className="flex items-center justify-center h-[600px]">
        <div className="text-gray-600">
          <svg className="animate-spin h-8 w-8 mr-3" viewBox="0 0 24 24">
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
              fill="none"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          <span className="text-sm font-medium">Cargando horarios...</span>
        </div>
      </div>
    ) : (
      <>
        {/* Leyenda */}
        <div className="flex gap-6 mb-6">
          <div className="flex items-center">
            <span className="inline-block w-2.5 h-2.5 rounded-full bg-indigo-600 mr-2"></span>
            <span className="text-sm text-gray-600 font-medium">Ocupado</span>
          </div>
          <div className="flex items-center">
            <span className="inline-block w-2.5 h-2.5 rounded-full bg-emerald-500 mr-2"></span>
            <span className="text-sm text-gray-600 font-medium">Disponible</span>
          </div>
        </div>
        {/* Contenedor del calendario */}
        <div className="h-[600px] overflow-y-auto rounded-xl shadow-sm border border-gray-200 md:w-auto w-[310px] bg-white">
          <Calendar
            localizer={localizer}
            events={eventos}
            startAccessor="start"
            endAccessor="end"
            onSelectEvent={handleSelectEvent}
            defaultView="week"
            views={['month', 'week', 'day']}
            selectable
            popup
            eventPropGetter={eventPropGetter}
            components={{
              event: EventComponent, // Personalización del renderizado de eventos
            }}
            messages={{
              today: 'Hoy',
              previous: 'Anterior',
              next: 'Siguiente',
              month: 'Mes',
              week: 'Semana',
              day: 'Día',
              agenda: 'Agenda',
              date: 'Fecha',
              time: 'Hora',
              event: 'Evento',
            }}
            className="font-sans"
          />
        </div>
      </>
    )}
  </div>
);
};

export default CalendarioHorarios;