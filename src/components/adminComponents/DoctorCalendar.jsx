import React, { useState, useEffect } from "react";
import API_BASE_URL from "../../js/urlHelper";
import jwtUtils from '../../utilities/jwtUtils';
import { FaCalendarTimes, FaSpinner, FaChevronLeft, FaChevronRight } from "react-icons/fa";

const DoctorCalendar = ({ doctorId, onDateSelect }) => {
  const [availableSlots, setAvailableSlots] = useState({});
  const [currentDate, setCurrentDate] = useState(new Date());
  const [isLoading, setIsLoading] = useState(true);
  
  // Get the current date to compare when disabling past months
  const today = new Date();
  const currentMonth = new Date(today.getFullYear(), today.getMonth(), 1);

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
      } catch (error) {
        console.error("Error fetching available slots:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAvailableSlots();
  }, [doctorId]);

  const goToPreviousMonth = () => {
    const newDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1);
    if (newDate.getTime() >= currentMonth.getTime()) {
      setCurrentDate(newDate);
    }
  };

  const goToNextMonth = () => {
    setCurrentDate(prevDate => new Date(prevDate.getFullYear(), prevDate.getMonth() + 1, 1));
  };

  const isPreviousMonthDisabled = () => {
    const previousMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1);
    return previousMonth.getTime() < currentMonth.getTime();
  };

  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  const isDateAvailable = (day) => {
    const dateString = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    return Object.values(availableSlots).some((slot) => slot.fecha === dateString);
  };

  const isToday = (day) => {
    return (
      today.getDate() === day &&
      today.getMonth() === currentDate.getMonth() &&
      today.getFullYear() === currentDate.getFullYear()
    );
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

  if (isLoading) {
    return (
      <div className="p-10 bg-white rounded-xl shadow-xl max-w-4xl mx-auto text-center backdrop-blur-sm bg-white/80">
        <FaSpinner className="text-5xl text-green-500 mx-auto mb-6 animate-spin" />
        <h1 className="text-2xl font-light text-gray-800 mb-2">
          Verificando disponibilidad...
        </h1>
      </div>
    );
  }

  if (Object.keys(availableSlots).length === 0) {
    return (
      <div className="p-10 bg-white rounded-xl shadow-xl max-w-4xl mx-auto text-center backdrop-blur-sm bg-white/80">
        <FaCalendarTimes className="text-5xl text-gray-300 mx-auto mb-6" />
        <h1 className="text-2xl font-light text-gray-800 mb-3">
          No hay disponibilidad
        </h1>
        <p className="text-gray-500 font-light">
          El doctor no tiene disponibilidad por el momento. Consulta más tarde.
        </p>
      </div>
    );
  }

  return (
    <div className="p-10 bg-white rounded-xl shadow-xl max-w-4xl mx-auto backdrop-blur-sm bg-white/90">
      <h1 className="text-3xl font-light text-center mb-8 text-gray-800">
        Agenda de Consultas
      </h1>

      <div className="mb-8 flex justify-between items-center">
        <button
          onClick={goToPreviousMonth}
          disabled={isPreviousMonthDisabled()}
          className={`p-2 rounded-full transition-all duration-300 ${
            isPreviousMonthDisabled()
              ? "text-gray-300 cursor-not-allowed"
              : "text-green-600 hover:bg-indigo-50"
          }`}
          aria-label="Mes anterior"
        >
          <FaChevronLeft className="text-xl" />
        </button>

        <div className="text-xl font-light text-gray-800 tracking-wide uppercase">
          {currentDate.toLocaleString("default", { month: "long", year: "numeric" })}
        </div>

        <button
          onClick={goToNextMonth}
          className="p-2 rounded-full transition-all duration-300 text-green-600 hover:bg-indigo-50"
          aria-label="Mes siguiente"
        >
          <FaChevronRight className="text-xl" />
        </button>
      </div>

      <div className="mb-8 flex justify-center space-x-6">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
          <span className="text-xs font-light text-gray-600">Disponible</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-gray-200 rounded-full"></div>
          <span className="text-xs font-light text-gray-600">No disponible</span>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-1 text-center font-light text-gray-500 mb-3">
        {["D", "L", "M", "X", "J", "V", "S"].map((day) => (
          <div key={day} className="text-xs py-2">
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {Array(firstDayOfMonth).fill(null).map((_, index) => (
          <div key={`empty-${index}`} className="aspect-square"></div>
        ))}

        {days.map((day) => {
          const available = isDateAvailable(day);
          const isCurrentDay = isToday(day);
          
          return (
            <div
              key={day}
              onClick={() => handleDateClick(day)}
              className={`
                aspect-square flex items-center justify-center text-sm transition-all duration-300 m-0.5
                ${available 
                  ? "cursor-pointer bg-green-500 text-white hover:bg-green-700 shadow-md" 
                  : "bg-gray-100 text-gray-400"}
                ${isCurrentDay 
                  ? "ring-2 ring-indigo-300" 
                  : ""}
                ${available && isCurrentDay 
                  ? "ring-2 ring-white" 
                  : ""}
                rounded-lg
              `}
            >
              {day}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default DoctorCalendar;