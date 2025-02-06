import React from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'moment/locale/es'; // Importar el locale en español
import 'react-big-calendar/lib/css/react-big-calendar.css';
import Swal from 'sweetalert2';

moment.locale('es'); // Configurar moment en español
const localizer = momentLocalizer(moment);

const CalendarioHorarios = ({ horarios, onEdit, onDelete }) => {
  // Convertir horarios a eventos para el calendario
  const eventos = Array.isArray(horarios) // Asegurarse de que `horarios` sea un array
    ? horarios.map((horario) => ({
        id: horario.idHorario,
        title: `Costo: S/ ${horario.costo} - Estado: ${horario.estadoCita || 'disponible'}`,
        start: new Date(`${horario.fecha}T${horario.hora_inicio}`),
        end: new Date(`${horario.fecha}T${horario.hora_inicio}`),
        horario, // Guardar el objeto completo para usarlo en el evento de selección
      }))
    : []; // Si `horarios` no es un array, usar un array vacío

  // Manejar la selección de un evento en el calendario
  const handleSelectEvent = (event) => {
    if (event.horario.estadoCita !== 'disponible') {
      // Si el horario está ocupado, mostrar solo los detalles
      Swal.fire({
        title: 'Detalles del horario',
        html: `
          <p>Fecha: ${moment(event.start).format('YYYY-MM-DD')}</p>
          <p>Hora: ${moment(event.start).format('HH:mm')}</p>
          <p>Costo: S/ ${event.horario.costo}</p>
          <p>Estado: ${event.horario.estadoCita}</p>
        `,
        icon: 'info',
        confirmButtonText: 'Aceptar',
      });
      return;
    }

    // Si el horario está disponible, permitir editar o eliminar
    Swal.fire({
      title: 'Opciones de horario',
      html: `
        <p>Fecha: ${moment(event.start).format('YYYY-MM-DD')}</p>
        <p>Hora: ${moment(event.start).format('HH:mm')}</p>
        <p>Costo: S/ ${event.horario.costo}</p>
        <p>Estado: ${event.horario.estadoCita || 'disponible'}</p>
      `,
      showCancelButton: true,
      confirmButtonText: 'Editar',
      cancelButtonText: 'Eliminar',
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
    }).then((result) => {
      if (result.isConfirmed) {
        onEdit(event.horario);
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        onDelete(event.horario.idHorario);
      }
    });
  };

  // Personalizar los colores de los eventos en el calendario
  const eventPropGetter = (event) => {
    const style = {
      backgroundColor: '',
      color: 'white',
      borderRadius: '5px',
      border: 'none',
      display: 'block',
      height: '50px', // Aumentar la altura para que el texto sea visible
      padding: '10px', // Aumentar el padding para mejor legibilidad
      fontSize: '14px', // Ajustar el tamaño de la fuente si es necesario
    };

    if (event.horario.estadoCita === 'ocupado') {
      style.backgroundColor = 'blue'; // Azul para horarios ocupados
      style.pointerEvents = 'none'; // Deshabilitar la edición
    } else {
      style.backgroundColor = 'green'; // Verde para horarios libres
    }

    return {
      style,
    };
  };

  return (
    
    <div className="h-[600px]">
      <div className="mt-4">
        <p><span className="inline-block w-4 h-4 bg-blue-500 mr-2"></span> Horarios ocupados (pagado, completado, pago pendiente)</p>
        <p><span className="inline-block w-4 h-4 bg-green-500 mr-2"></span> Horarios libres (editables)</p>
      </div>
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
        eventPropGetter={eventPropGetter} // Aplicar estilos personalizados
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
        }} // Cambiar los textos del calendario a español
      />
    </div>
  );
};

export default CalendarioHorarios;