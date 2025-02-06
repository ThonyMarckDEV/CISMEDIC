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
    Swal.fire({
      title: 'Detalles de la Cita',
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
        confirmButton: 'bg-indigo-600 hover:bg-indigo-700'
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
      transition: 'all 0.2s ease',
    };

    if (event.horario.estadoCita === 'ocupado') {
      style.backgroundColor = '#4F46E5';
      style.pointerEvents = 'none';
    } else {
      style.backgroundColor = '#10B981';
    }

    return { style };
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      {isLoading ? (
        <div className="flex items-center justify-center h-[600px]">
          <div className="text-gray-600">
            <svg className="animate-spin h-8 w-8 mr-3" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
            </svg>
            <span>Cargando horarios...</span>
          </div>
        </div>
      ) : (
        <>
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
        </>
      )}
    </div>
  );
};

export default CalendarioHorariosDoctor;