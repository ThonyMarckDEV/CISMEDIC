import React, { useEffect, useState } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'moment/locale/es'; // Importar el locale en español
import 'react-big-calendar/lib/css/react-big-calendar.css';
import Swal from 'sweetalert2';
import jwtUtils from '../../utilities/jwtUtils';
import API_BASE_URL from '../../js/urlHelper';
import SweetAlert from '../../components/SweetAlert';

moment.locale('es'); // Configurar moment en español
const localizer = momentLocalizer(moment);

const CalendarioHorariosDoctor = () => {
  const [horarios, setHorarios] = useState([]); // Estado para almacenar los horarios
  const [isLoading, setIsLoadingFullScreen] = useState(false); // Estado para manejar la carga

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

  // Obtener el ID del doctor desde el token JWT
  useEffect(() => {
    const token = jwtUtils.getTokenFromCookie();
    if (token) {
      const idDoctor = jwtUtils.getIdUsuario(token);
      if (idDoctor) {
        fetchHorarios(idDoctor); // Cargar los horarios del doctor
      }
    }
  }, []);

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
    Swal.fire({
      title: 'Detalles del horario',
      html: `
        <p>Fecha: ${moment(event.start).format('YYYY-MM-DD')}</p>
        <p>Hora: ${moment(event.start).format('HH:mm')}</p>
        <p>Costo: S/ ${event.horario.costo}</p>
        <p>Estado: ${event.horario.estadoCita || 'disponible'}</p>
      `,
      icon: 'info',
      confirmButtonText: 'Aceptar',
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
      height: '60px', // Aumentar la altura para que el texto sea visible
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
      {isLoading && <p>Cargando horarios...</p>}
      {!isLoading && (
        <>
          <div className="mt-4">
            <p><span className="inline-block w-4 h-4 bg-blue-500 mr-2"></span> Horarios ocupados (pagado, completado, pago pendiente)</p>
            <p><span className="inline-block w-4 h-4 bg-green-500 mr-2"></span> Horarios libres</p>
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
        </>
      )}
    </div>
  );
};

export default CalendarioHorariosDoctor;