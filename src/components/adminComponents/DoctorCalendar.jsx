import React, { useState, useEffect } from "react";
import API_BASE_URL from "../../js/urlHelper";
import jwtUtils from '../../utilities/jwtUtils';
import { FaCalendarTimes, FaSpinner } from "react-icons/fa"; // Importamos iconos de react-icons

const DoctorCalendar = ({ doctorId, onDateSelect }) => {
  const [availableSlots, setAvailableSlots] = useState({});
  const [currentDate, setCurrentDate] = useState(new Date());
  const [monthsWithAvailability, setMonthsWithAvailability] = useState([]);
  const [isLoading, setIsLoading] = useState(true); // Estado para controlar el loader

  useEffect(() => {
    const fetchAvailableSlots = async () => {
      try {
        const token = jwtUtils.getTokenFromCookie();
        const response = await fetch(`${API_BASE_URL}/api/doctor-schedule/${doctorId}/week`, {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error("Error fetching available slots");
        }

        const data = await response.json();
        setAvailableSlots(data.availableSlots);

        // Extraer los meses con disponibilidad
        const monthsWithSlots = new Set();
        Object.values(data.availableSlots).forEach(slot => {
          const date = new Date(slot.fecha);
          monthsWithSlots.add(date.getMonth()); // Guardamos el mes (0-11)
        });

        setMonthsWithAvailability(Array.from(monthsWithSlots));
      } catch (error) {
        console.error("Error fetching available slots:", error);
      } finally {
        setIsLoading(false); // Desactivar el loader cuando la solicitud termine
      }
    };

    fetchAvailableSlots();
  }, [doctorId]);

  const goToPreviousMonth = () => {
    setCurrentDate(prevDate => new Date(prevDate.getFullYear(), prevDate.getMonth() - 1, 1));
  };

  const goToNextMonth = () => {
    setCurrentDate(prevDate => new Date(prevDate.getFullYear(), prevDate.getMonth() + 1, 1));
  };

  const isCurrentMonth = () => {
    const today = new Date();
    return currentDate.getMonth() === today.getMonth() && currentDate.getFullYear() === today.getFullYear();
  };

  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  const isDateAvailable = (day) => {
    const dateString = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    return Object.values(availableSlots).some((slot) => slot.fecha === dateString);
  };

  const handleDateClick = (day) => {
    if (isDateAvailable(day)) {
      const selectedDate = new Date(Date.UTC(currentDate.getFullYear(), currentDate.getMonth(), day));
      const formattedDate = `${selectedDate.getUTCFullYear()}-${String(selectedDate.getUTCMonth() + 1).padStart(2, "0")}-${String(selectedDate.getUTCDate()).padStart(2, "0")}`;
      onDateSelect(formattedDate);

      if (window.innerWidth <= 768) {
        setTimeout(() => {
          window.scrollTo({
            top: document.documentElement.scrollHeight,
            behavior: "smooth",
          });
        }, 100);
      }
    }
  };

  // Mostrar loader mientras se carga la información
  if (isLoading) {
    return (
      <div className="p-8 bg-white rounded-3xl shadow-lg max-w-4xl mx-auto text-center">
        <FaSpinner className="text-6xl text-gray-400 mx-auto mb-4 animate-spin" />
        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          Verificando disponibilidad...
        </h1>
      </div>
    );
  }

  // Si no hay meses con disponibilidad, mostramos un mensaje
  if (monthsWithAvailability.length === 0) {
    return (
      <div className="p-8 bg-white rounded-3xl shadow-lg max-w-4xl mx-auto text-center">
        <FaCalendarTimes className="text-6xl text-gray-400 mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          No hay disponibilidad
        </h1>
        <p className="text-gray-600">
          El doctor no tiene disponibilidad por el momento. Consulta más tarde.
        </p>
      </div>
    );
  }

  // Solo permitimos navegar a meses con disponibilidad
  const canGoToPreviousMonth = monthsWithAvailability.includes((currentDate.getMonth() - 1 + 12) % 12);
  const canGoToNextMonth = monthsWithAvailability.includes((currentDate.getMonth() + 1) % 12);

  return (
    <div className="p-8 bg-white rounded-3xl shadow-lg max-w-4xl mx-auto">
      <h1 className="text-4xl font-bold text-center mb-6 text-gray-800">
        Disponibilidad del Doctor
      </h1>

      <div className="mb-6 flex justify-between items-center">
        <button
          onClick={goToPreviousMonth}
          className={`p-3 rounded-full transition duration-300 ${
            !canGoToPreviousMonth ? "bg-gray-200 text-gray-500 cursor-not-allowed" : "bg-gray-900 text-white hover:bg-gray-700"
          }`}
          disabled={!canGoToPreviousMonth}
        >
          &lt;
        </button>

        <div className="text-2xl font-semibold text-gray-900">
          {currentDate.toLocaleString("default", { month: "long", year: "numeric" })}
        </div>

        <button
          onClick={goToNextMonth}
          className={`p-3 rounded-full transition duration-300 ${
            !canGoToNextMonth ? "bg-gray-200 text-gray-500 cursor-not-allowed" : "bg-gray-900 text-white hover:bg-gray-700"
          }`}
          disabled={!canGoToNextMonth}
        >
          &gt;
        </button>
      </div>

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

      <div className="mb-6 text-sm text-gray-600 text-center">
        Los días marcados en verde tienen disponibilidad de horarios.
      </div>

      <div className="grid grid-cols-7 gap-2 text-center text-gray-700 font-medium">
        {["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"].map((day) => (
          <div key={day} className="text-sm">
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-2 mt-2">
        {Array(firstDayOfMonth).fill(null).map((_, index) => (
          <div key={`empty-${index}`} className="p-2"></div>
        ))}

        {days.map((day) => (
          <div
            key={day}
            onClick={() => handleDateClick(day)}
            className={`p-3 text-center rounded-full transition duration-300 cursor-pointer ${
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