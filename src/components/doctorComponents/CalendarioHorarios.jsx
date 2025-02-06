import React from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'moment/locale/es';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import Swal from 'sweetalert2';

moment.locale('es');
const localizer = momentLocalizer(moment);

const CalendarioHorarios = ({ horarios, onEdit, onDelete }) => {
  const eventos = Array.isArray(horarios)
    ? horarios.map((horario) => ({
        id: horario.idHorario,
        title: `S/ ${horario.costo} - ${horario.estadoCita || 'Disponible'}`,
        start: new Date(`${horario.fecha}T${horario.hora_inicio}`),
        end: new Date(`${horario.fecha}T${horario.hora_inicio}`),
        horario,
      }))
    : [];

  const handleSelectEvent = (event) => {
    if (event.horario.estadoCita !== 'disponible') {
      Swal.fire({
        title: 'Detalles de la Cita',
        html: `
          <div class="space-y-2">
            <p class="text-gray-700">Fecha: ${moment(event.start).format('DD MMMM, YYYY')}</p>
            <p class="text-gray-700">Hora: ${moment(event.start).format('HH:mm')}</p>
            <p class="text-gray-700">Costo: S/ ${event.horario.costo}</p>
            <p class="text-gray-700">Estado: ${event.horario.estadoCita}</p>
          </div>
        `,
        icon: 'info',
        confirmButtonText: 'Cerrar',
        customClass: {
          container: 'font-sans',
          popup: 'rounded-lg',
          confirmButton: 'bg-indigo-600 hover:bg-indigo-700'
        }
      });
      return;
    }

    Swal.fire({
      title: 'Gestionar Horario',
      html: `
        <div class="space-y-2">
          <p class="text-gray-700">Fecha: ${moment(event.start).format('DD MMMM, YYYY')}</p>
          <p class="text-gray-700">Hora: ${moment(event.start).format('HH:mm')}</p>
          <p class="text-gray-700">Costo: S/ ${event.horario.costo}</p>
          <p class="text-gray-700">Estado: ${event.horario.estadoCita || 'Disponible'}</p>
        </div>
      `,
      showCancelButton: true,
      confirmButtonText: 'Editar',
      cancelButtonText: 'Eliminar',
      confirmButtonColor: '#4F46E5',
      cancelButtonColor: '#DC2626',
      customClass: {
        container: 'font-sans',
        popup: 'rounded-lg'
      }
    }).then((result) => {
      if (result.isConfirmed) {
        onEdit(event.horario);
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        onDelete(event.horario.idHorario);
      }
    });
  };

  const eventPropGetter = (event) => {
    const style = {
      backgroundColor: '',
      color: 'white',
      borderRadius: '6px',
      border: 'none',
      display: 'block',
      height: '50px',
      padding: '8px',
      fontSize: '13px',
      fontWeight: '500',
      boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
      transition: 'transform 0.2s ease',
      cursor: 'pointer',
    };

    if (event.horario.estadoCita === 'ocupado') {
      style.backgroundColor = '#4F46E5';
      style.pointerEvents = 'none';
    } else {
      style.backgroundColor = '#10B981';
      style.transform = 'scale(1)';
      style[':hover'] = {
        transform: 'scale(1.02)'
      };
    }

    return { style };
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="flex gap-6 mb-6">
        <div className="flex items-center">
          <span className="inline-block w-3 h-3 rounded-full bg-indigo-600 mr-2"></span>
          <span className="text-sm text-gray-600">Ocupado</span>
        </div>
        <div className="flex items-center">
          <span className="inline-block w-3 h-3 rounded-full bg-emerald-500 mr-2"></span>
          <span className="text-sm text-gray-600">Disponible</span>
        </div>
      </div>
      
      <div className="h-[600px] overflow-y-auto rounded-lg">
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
          className="font-sans"
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
        />
      </div>
    </div>
  );
};

export default CalendarioHorarios;