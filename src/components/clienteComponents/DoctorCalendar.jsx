import React, { useState, useEffect } from "react";
import API_BASE_URL from "../../js/urlHelper";
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
    <div className="p-8 bg-white rounded-3xl shadow-lg max-w-4xl mx-auto">
      {/* Título del calendario */}
      <h1 className="text-4xl font-bold text-center mb-6 text-gray-800">
        Disponibilidad del Doctor
      </h1>

      {/* Encabezado del calendario */}
      <div className="mb-6 flex justify-between items-center">
        {/* Botón Anterior */}
        <button
          onClick={goToPreviousMonth}
          className={`p-3 rounded-full transition duration-300 ${
            isCurrentMonth() ? "bg-gray-200 text-gray-500 cursor-not-allowed" : "bg-gray-900 text-white hover:bg-gray-700"
          }`}
          disabled={isCurrentMonth()}
        >
          &lt;
        </button>

        {/* Mes y Año */}
        <div className="text-2xl font-semibold text-gray-900">
          {currentDate.toLocaleString("default", { month: "long", year: "numeric" })}
        </div>

        {/* Botón Siguiente */}
        <button
          onClick={goToNextMonth}
          className="p-3 rounded-full bg-gray-900 text-white hover:bg-gray-700 transition duration-300"
        >
          &gt;
        </button>
      </div>

      {/* Leyenda de disponibilidad */}
      <div className="mb-6 flex items-center gap-4">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-emerald-500 rounded-full"></div>
          <span className="text-sm font-medium text-gray-700">Días disponibles</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-gray-300 rounded-full"></div>
          <span className="text-sm font-medium text-gray-700">Días no disponibles</span>
        </div>
      </div>

      {/* Nota adicional */}
      <div className="mb-6 text-sm text-gray-600 text-center">
        Los días marcados en verde tienen disponibilidad de horarios.
      </div>

      {/* Días de la semana */}
      <div className="grid grid-cols-7 gap-2 text-center text-gray-700 font-medium">
        {["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"].map((day) => (
          <div key={day} className="text-sm">
            {day}
          </div>
        ))}
      </div>

      {/* Días del mes */}
      <div className="grid grid-cols-7 gap-2 mt-2">
        {/* Espacios vacíos antes del primer día del mes */}
        {Array(firstDayOfMonth)
          .fill(null)
          .map((_, index) => (
            <div key={`empty-${index}`} className="p-2"></div>
          ))}

        {/* Días del mes */}
        {days.map((day) => (
          <div
            key={day}
            className={`p-3 text-center rounded-full transition duration-300 ${
              isDateAvailable(day) ? "bg-emerald-500 text-white hover:bg-emerald-600" : "bg-gray-200 text-gray-500"
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