import React, { useEffect, useState } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'moment/locale/es';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import Swal from 'sweetalert2';
import jwtUtils from '../../utilities/jwtUtils';
import API_BASE_URL from '../../js/urlHelper';
import SweetAlert from '../../components/SweetAlert';

moment.locale('es');
const localizer = momentLocalizer(moment);

const CalendarioHorariosDoctor = () => {
  const [horarios, setHorarios] = useState([]);
  const [isLoading, setIsLoadingFullScreen] = useState(false);

  // Función para obtener los horarios del doctor desde el backend
  const fetchHorarios = async (idDoctor) => {
    setIsLoadingFullScreen(true);
    try {
      const token = jwtUtils.getTokenFromCookie();
      const response = await fetch(`${API_BASE_URL}/api/horarios-doctores/listar/${idDoctor}`, {
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) throw new Error(`Error ${response.status}: ${response.statusText}`);
      const data = await response.json();
      setHorarios(Array.isArray(data) ? data : []);
    } catch (error) {
      SweetAlert.showMessageAlert('Error', "Error al cargar los horarios: " + error.message, 'error');
      setHorarios([]);
    } finally {
      setIsLoadingFullScreen(false);
    }
  };

  useEffect(() => {
    const token = jwtUtils.getTokenFromCookie();
    if (token) {
      const idDoctor = jwtUtils.getIdUsuario(token);
      if (idDoctor) {
        fetchHorarios(idDoctor);
      }
    }
  }, []);

  // Convertir horarios a eventos para el calendario
  const eventos = Array.isArray(horarios)
    ? horarios.map((horario) => ({
        id: horario.idHorario,
        title: `S/ ${horario.costo} - ${horario.estadoCita || 'Disponible'}`,
        start: new Date(`${horario.fecha}T${horario.hora_inicio}`),
        end: new Date(`${horario.fecha}T${horario.hora_inicio}`),
        horario,
      }))
    : [];

  // Manejar la selección de un evento en el calendario
  const handleSelectEvent = (event) => {
    Swal.fire({
      title: 'Detalles',
      html: `
        <div class="space-y-3 text-left">
          <p class="text-gray-700"><span class="font-medium">Fecha:</span> ${moment(event.start).format('DD MMMM, YYYY')}</p>
          <p class="text-gray-700"><span class="font-medium">Hora:</span> ${moment(event.start).format('HH:mm')}</p>
          <p class="text-gray-700"><span class="font-medium">Costo:</span> S/ ${event.horario.costo}</p>
          <p class="text-gray-700"><span class="font-medium">Estado:</span> ${event.horario.estadoCita || 'Disponible'}</p>
        </div>
      `,
      icon: 'info',
      confirmButtonText: 'Cerrar',
      customClass: {
        container: 'font-sans',
        popup: 'rounded-lg',
        confirmButton: 'bg-indigo-600 hover:bg-indigo-700',
      },
    });
  };

  // Personalizar los estilos de los eventos
  const eventPropGetter = (event) => {
    const style = {
      backgroundColor: '',
      color: 'white',
      borderRadius: '6px',
      border: 'none',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '39px', // Altura mínima para todos los eventos
      padding: '8px',
      fontSize: '13px',
      fontWeight: '500',
      boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
      transition: 'all 0.2s ease',
    };
    if (event.horario.estadoCita === 'ocupado') {
      style.backgroundColor = '#4F46E5'; // Azul para eventos ocupados
    } else {
      style.backgroundColor = '#10B981'; // Verde para eventos disponibles
    }
    return { style };
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      {isLoading ? (
        <div className="flex items-center justify-center h-[600px]">
          <div className="text-gray-600">
            <svg className="animate-spin h-8 w-8 mr-3" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            <span>Cargando horarios...</span>
          </div>
        </div>
      ) : (
        <>
          {/* Leyenda */}
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

          {/* Contenedor del calendario */}
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
        </>
      )}
      {/* Estilos globales para ajustar el tamaño de los eventos */}
      <style jsx global>{`
        .rbc-event {
          min-height: 50px; /* Altura mínima para todos los eventos */
          padding: 8px; /* Espaciado interno para mejorar la legibilidad */
          font-size: 13px; /* Tamaño de fuente más grande */
          line-height: 1.4; /* Mejor espaciado entre líneas */
        }

        .rbc-time-content .rbc-row-segment {
          min-height: 50px; /* Altura mínima para los segmentos en la vista "week" y "day" */
        }

        .rbc-month-view .rbc-row-segment {
          min-height: 50px; /* Altura mínima para los segmentos en la vista "month" */
        }
      `}</style>
    </div>
  );
};

export default CalendarioHorariosDoctor;