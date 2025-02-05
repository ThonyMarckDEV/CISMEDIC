import React, { useState, useEffect } from "react";
import { Clock, AlertCircle } from "lucide-react";
import { CreditCard as PaymentIcon } from "lucide-react"; // Importa el ícono de pago
import AppointmentCard from "./AppointmentCard";
import API_BASE_URL from "../../js/urlHelper";

const AppointmentsList = ({ userId, token }) => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAppointments = async () => {
    try {
      if (!userId || !token) {
        throw new Error("User ID or token not found");
      }
      const response = await fetch(`${API_BASE_URL}/api/citas/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }
      const data = await response.json();
      setAppointments(data);
      setLoading(false);
    } catch (err) {
      setError(err.message || "Error al cargar las citas");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, [userId, token]);

  if (loading) {
    return (
      <div className="bg-white text-center text-gray-500 flex flex-col items-center justify-center gap-2">
        <Clock className="h-8 w-8 animate-spin text-cyan-600" />
        <p>Cargando tus citas...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-red-500">
        <AlertCircle className="h-10 w-10 mb-2" />
        <p>{error}</p>
      </div>
    );
  }

  if (appointments.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-gray-500">
        <PaymentIcon className="h-10 w-10 mb-2" />
        <p>No hay citas disponibles</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {appointments.map((appointment) => (
        <AppointmentCard
        key={appointment.idCita}
        appointment={appointment}
        paymentId={appointment.idPago} // Pasar idPago como prop
      />
      ))}
    </div>
  );
};

export default AppointmentsList;