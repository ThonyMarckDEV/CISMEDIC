import React, { useState, useEffect } from "react";
import API_BASE_URL from "../../js/urlHelper";
import "react-day-picker/dist/style.css"; // Importa los estilos predeterminados
import jwtUtils from '../../utilities/jwtUtils';

const DoctorCalendar = ({ doctorId }) => {
  const [availableSlots, setAvailableSlots] = useState({});
  const [currentDate, setCurrentDate] = useState(new Date());

  // Función para obtener los slots disponibles
  useEffect(() => {
    const fetchAvailableSlots = async () => {
      try {
        const token = jwtUtils.getTokenFromCookie();
        const response = await fetch(`${API_BASE_URL}/api/doctor-schedule/${doctorId}/week`, {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${token}`, // Envía el token en el encabezado
            "Content-Type": "application/json",
          },
        });
  
        if (!response.ok) {
          throw new Error("Error fetching available slots");
        }
  
        const data = await response.json();
        setAvailableSlots(data.availableSlots);
      } catch (error) {
        console.error("Error fetching available slots:", error);
      }
    };
  
    fetchAvailableSlots();
  }, [doctorId]);


  // Función para cambiar al mes anterior
  const goToPreviousMonth = () => {
    setCurrentDate((prevDate) => {
      const newDate = new Date(prevDate);
      newDate.setMonth(prevDate.getMonth() - 1);
      return newDate;
    });
  };

  // Función para cambiar al siguiente mes
  const goToNextMonth = () => {
    setCurrentDate((prevDate) => {
      const newDate = new Date(prevDate);
      newDate.setMonth(prevDate.getMonth() + 1);
      return newDate;
    });
  };

  // Función para verificar si el mes actual es el mes presente
  const isCurrentMonth = () => {
    const today = new Date();
    return (
      currentDate.getMonth() === today.getMonth() &&
      currentDate.getFullYear() === today.getFullYear()
    );
  };

  // Obtener el número de días en el mes actual
  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();

  // Obtener el día de la semana del primer día del mes
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();

  // Crear un array con los días del mes
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  // Función para verificar si una fecha tiene slots disponibles
  const isDateAvailable = (day) => {
    const dateString = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    return Object.values(availableSlots).some((slot) => slot.fecha === dateString);
  };

  return (
    <div className="p-4">
      {/* Título del calendario */}
      <h1 className="text-3xl font-bold text-center mb-4">Disponibilidad de doctor seleccionado</h1>

      {/* Encabezado del calendario */}
      <div className="mb-4 flex justify-between items-center">
        {/* Botón Anterior */}
        <button
          onClick={goToPreviousMonth}
          className={`p-2 rounded ${
            isCurrentMonth() ? "bg-gray-300 text-gray-500 cursor-not-allowed" : "bg-green-700 text-white"
          }`}
          disabled={isCurrentMonth()} // Deshabilitar el botón si estamos en el mes actual
        >
          Anterior
        </button>
        <div className="text-2xl font-bold text-center">
          {currentDate.toLocaleString("default", { month: "long", year: "numeric" })}
        </div>
        {/* Botón Siguiente */}
        <button onClick={goToNextMonth} className="p-2 bg-green-700 text-white rounded">
          Siguiente
        </button>
      </div>

      {/* Leyenda de disponibilidad */}
      <div className="mb-4">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-green-500"></div>
          <span>Días con disponibilidad de horarios</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-gray-300"></div>
          <span>Días sin disponibilidad</span>
        </div>
      </div>

      {/* Nota adicional */}
      <div className="mb-4 text-sm text-gray-600">
        Nota: Los días marcados en verde tienen disponibilidad de horarios. Puede consultar en el
        formulario la disponibilidad de horas para esos días.
      </div>

      {/* Días de la semana */}
      <div className="grid grid-cols-7 gap-1">
        {["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"].map((day) => (
          <div key={day} className="text-center font-bold">
            {day}
          </div>
        ))}
      </div>

      {/* Días del mes */}
      <div className="grid grid-cols-7 gap-1">
        {Array(firstDayOfMonth)
          .fill(null)
          .map((_, index) => (
            <div key={`empty-${index}`} className="p-2"></div>
          ))}
        {days.map((day) => (
          <div
            key={day}
            className={`p-2 text-center border ${
              isDateAvailable(day) ? "bg-green-500 text-white" : "bg-gray-300"
            }`}
          >
            {day}
          </div>
        ))}
      </div>
    </div>
  );
};

export default DoctorCalendar;