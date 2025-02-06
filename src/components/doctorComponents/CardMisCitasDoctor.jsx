import React, { useState } from "react";
import { User, Tag, Calendar } from "lucide-react";
import API_BASE_URL from "../../js/urlHelper";
import jwtUtils from "../../utilities/jwtUtils";
import SweetAlert from "../../components/SweetAlert"; // Importamos SweetAlert
import LoadingScreen from '../../components/home/LoadingScreen';

const CardMisCitasDoctor = ({ appointment }) => {
  const [selectedEstado, setSelectedEstado] = useState("Seleccione una opción");
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingFullScreen, setIsLoadingFullScreen] = useState(false);
  const [motivoCancelacion, setMotivoCancelacion] = useState(""); // Motivo de cancelación
  const [motivoPersonalizado, setMotivoPersonalizado] = useState(""); // Motivo personalizado
  const [selectedMotivo, setSelectedMotivo] = useState(""); // Motivo seleccionado del checkbox
  const token = jwtUtils.getTokenFromCookie();
  const idDoctor = jwtUtils.getIdUsuario(token);

  // Función para formatear la fecha
  const formatDate = (dateString) => {
    const date = new Date(`${dateString}T12:00:00`);
    return date.toLocaleDateString();
  };

  // Manejar el cambio en el ComboBox
  const handleEstadoChange = (e) => {
    const newState = e.target.value;
    setSelectedEstado(newState);
    setIsButtonDisabled(newState !== "completada" && newState !== "cancelada");
    if (newState !== "cancelada") {
      setMotivoCancelacion("");
      setMotivoPersonalizado("");
      setSelectedMotivo("");
    }
  };

  // Manejar el cambio en el checkbox de motivos
  const handleMotivoChange = (e) => {
    const motivo = e.target.value;
    setSelectedMotivo(motivo);
    if (motivo === "otro") {
      setMotivoCancelacion(""); // Limpiar el motivo si se selecciona "otro"
    } else {
      setMotivoCancelacion(motivo); // Asignar el motivo seleccionado
    }
  };

  // Manejar el cambio en el input de motivo personalizado
  const handleMotivoPersonalizadoChange = (e) => {
    const customMotivo = e.target.value;
    setMotivoPersonalizado(customMotivo);
    setMotivoCancelacion(customMotivo); // Asignar el motivo personalizado
  };

  // Manejar el clic en el botón "Actualizar Estado"
  const handleUpdateEstado = async () => {
    if (selectedEstado === "cancelada" && !motivoCancelacion) {
      SweetAlert.showMessageAlert(
        "Error",
        "Debe proporcionar un motivo de cancelación.",
        "error"
      );
      return;
    }

    setIsLoading(true);
    setIsLoadingFullScreen(true);

    try {
      const response = await fetch(`${API_BASE_URL}/api/citas/${appointment.idCita}/actualizar-estado/${idDoctor}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          estado: selectedEstado,
          motivoCancelacion: motivoCancelacion,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Error al actualizar el estado");
      }

      const data = await response.json();
      console.log("Estado actualizado:", data);

      SweetAlert.showMessageAlert(
        "Éxito",
        "Estado de la cita actualizado correctamente.",
        "success"
      );

      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (error) {
      console.error(error);
      SweetAlert.showMessageAlert(
        "Error",
        error.message || "Hubo un error al actualizar el estado.",
        "error"
      );
    } finally {
      setIsLoading(false);
      setIsLoadingFullScreen(false);
    }
  };

  return (
    <div
      key={appointment.idCita}
      className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100"
    >
      {/* Card Header */}
      <div className="bg-gradient-to-r from-green-100 to-green-200 px-6 py-4 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <span className="text-lg font-semibold text-gray-800">
            Cita #{appointment.idCita}
          </span>
          <div
            className={`px-3 py-1 rounded-full text-sm font-medium ${
              appointment.estado === "pagado"
                ? "bg-blue-50 text-blue-700"
                : "bg-gray-100 text-gray-700"
            }`}
          >
            {appointment.estado}
          </div>
        </div>
      </div>
      {/* Card Content */}
      <div className="p-6 space-y-4">
        {/* Detalles de la cita */}
        <div className="flex items-center gap-3 text-gray-700">
          <User className="h-5 w-5 text-green-600" />
          <div>
            <p className="text-sm text-gray-500">Paciente</p>
            <p className="font-medium">
              {appointment.pacienteNombre} {appointment.pacienteApellidos}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3 text-gray-700">
          <User className="h-5 w-5 text-green-600" />
          <div>
            <p className="text-sm text-gray-500">DNI</p>
            <p className="font-medium">{appointment.dni}</p>
          </div>
        </div>
        <div className="flex items-center gap-3 text-gray-700">
          <User className="h-5 w-5 text-green-600" />
          <div>
            <p className="text-sm text-gray-500">Doctor</p>
            <p className="font-medium">
              {appointment.doctorNombre} {appointment.doctorApellidos}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3 text-gray-700">
          <Tag className="h-5 w-5 text-green-600" />
          <div>
            <p className="text-sm text-gray-500">Especialidad</p>
            <p className="font-medium">{appointment.especialidad}</p>
          </div>
        </div>
        <div className="flex items-center gap-3 text-gray-700">
          <Calendar className="h-5 w-5 text-green-600" />
          <div>
            <p className="text-sm text-gray-500">Fecha y Hora</p>
            <p className="font-medium">
              {formatDate(appointment.fecha)} - {appointment.horaInicio}
            </p>
          </div>
        </div>

       {/* ComboBox para cambiar el estado */}
       <div className="flex items-center gap-3">
          <label htmlFor={`estado-${appointment.idCita}`} className="text-sm text-gray-500">
            Cambiar estado:
          </label>
          <select
            id={`estado-${appointment.idCita}`}
            value={selectedEstado}
            onChange={handleEstadoChange}
            className="border border-gray-300 rounded-md px-2 py-1 text-sm focus:outline-none focus:border-green-500"
          >
            <option value="Seleccione una opción" disabled>
              Seleccione una opción
            </option>
            <option value="completada">Completada</option>
            <option value="cancelada">Cancelada</option>
          </select>
        </div>

        {/* Mostrar campos para cancelación si el estado es "cancelada" */}
        {selectedEstado === "cancelada" && (
          <div className="space-y-2">
            <p className="text-sm text-gray-500">Motivo de cancelación:</p>
            <div className="flex flex-col gap-2">
              <label>
                <input
                  type="checkbox"
                  value="no llegar"
                  checked={selectedMotivo === "no llegar"}
                  onChange={handleMotivoChange}
                />
                No llegó
              </label>
              <label>
                <input
                  type="checkbox"
                  value="otro"
                  checked={selectedMotivo === "otro"}
                  onChange={handleMotivoChange}
                />
                Otro
              </label>
              {selectedMotivo === "otro" && (
                <input
                  type="text"
                  placeholder="Especifique el motivo..."
                  value={motivoPersonalizado}
                  onChange={handleMotivoPersonalizadoChange}
                  className="border border-gray-300 rounded-md px-2 py-1 text-sm focus:outline-none focus:border-green-500"
                />
              )}
            </div>
          </div>
        )}

        {/* Botón para actualizar el estado */}
        <button
          onClick={handleUpdateEstado}
          disabled={isButtonDisabled || isLoading}
          className={`w-full px-4 py-2 text-sm font-medium rounded-md ${
            isButtonDisabled || isLoading
              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
              : "bg-green-600 text-white hover:bg-green-700"
          }`}
        >
          {isLoading ? "Actualizando..." : "Actualizar Estado"}
        </button>
      </div>

      {isLoadingFullScreen && <LoadingScreen />}
    </div>
  );
};

export default CardMisCitasDoctor;