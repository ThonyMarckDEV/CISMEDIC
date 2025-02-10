import React, { useState, useEffect } from 'react';
import { Search, Upload, X, CheckCircle, AlertCircle } from 'lucide-react';
import API_BASE_URL from '../../js/urlHelper';
import jwtUtils from '../../utilities/jwtUtils';
import Swal from 'sweetalert2';

const LuxuryResultsForm = () => {
  const [patients, setPatients] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [isNewPatient, setIsNewPatient] = useState(false);
  const [contactMethod, setContactMethod] = useState('email');
  const [contactInfo, setContactInfo] = useState('');
  const [appointmentDate, setAppointmentDate] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [observaciones, setObservaciones] = useState('');
  const [lastName, setLastName] = useState('');
  const [dni, setDni] = useState('');
  const [title, setTitle] = useState(''); // Nuevo estado para el título

  useEffect(() => {
    const searchPatients = async () => {
      if (searchTerm.length > 2) {
        try {
          const token = jwtUtils.getTokenFromCookie();
          const response = await fetch(`${API_BASE_URL}/api/pacientes/search?busqueda=${searchTerm}`, {
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          });
          if (!response.ok) throw new Error('Error en la búsqueda');
          const data = await response.json();
          setPatients(data);
          setError(null);
        } catch (error) {
          setError('Error al buscar pacientes. Por favor, intente nuevamente.');
          console.error('Error buscando pacientes:', error);
        }
      }
    };

    const timeoutId = setTimeout(searchPatients, 500);
    return () => clearTimeout(timeoutId);
  }, [searchTerm]);

  const handleFileChange = (event) => {
    const file = event.target.files[0];

    if (file) {
      const allowedExtensions = ["pdf"];
      const fileExtension = file.name.split(".").pop().toLowerCase();

      if (!allowedExtensions.includes(fileExtension)) {
        Swal.fire({
          icon: "error",
          title: "Formato inválido",
          text: "Solo se permiten archivos en formato PDF.",
        });
        return;
      }

      if (file.size > 10 * 1024 * 1024) {
        Swal.fire({
          icon: "error",
          title: "Archivo demasiado grande",
          text: "El archivo no debe superar los 10MB.",
        });
        return;
      }

      setSelectedFile(file);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null);
  
    // Validar campos requeridos
    if (!selectedFile) {
      Swal.fire({
        icon: "error",
        title: "Archivo requerido",
        text: "Debes subir un documento de resultados.",
      });
      return;
    }
  
    if (!appointmentDate) {
      Swal.fire({
        icon: "error",
        title: "Fecha requerida",
        text: "Debes seleccionar una fecha de cita.",
      });
      return;
    }
    if (!title.trim()) {
      Swal.fire({
        icon: "error",
        title: "Título requerido",
        text: "Debes ingresar un título para la cita.",
      });
      return;
    }
  
    if (isNewPatient) {
      if (!firstName.trim() || !lastName.trim() || !dni.trim() || !contactMethod || !contactInfo.trim()) {
        Swal.fire({
          icon: "error",
          title: "Campos obligatorios",
          text: "Todos los campos son obligatorios para pacientes nuevos.",
        });
        return;
      }
    } else {
      if (!selectedPatient) {
        Swal.fire({
          icon: "error",
          title: "Paciente requerido",
          text: "Debes seleccionar un paciente existente.",
        });
        return;
      }
    }
  
    setLoading(true);
    const token = jwtUtils.getTokenFromCookie();
    const formData = new FormData();
  
    formData.append("archivo", selectedFile);
    formData.append("fechaCita", appointmentDate);
    formData.append("esPacienteNuevo", isNewPatient ? "1" : "0");
    formData.append("titulo", title); // Agregar título
    formData.append("observaciones", observaciones);
  
    if (isNewPatient) {
      formData.append("nombres", firstName);
      formData.append("apellidos", lastName);
      formData.append("dni", dni);
      formData.append("metodoContacto", contactMethod);
      formData.append("infoContacto", contactInfo);
    } else {
      formData.append("idPaciente", selectedPatient?.idUsuario);
    }
  
    try {
      const response = await fetch(`${API_BASE_URL}/api/subir-resultados`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });
  
      const data = await response.json();
  
      if (!response.ok) {
        throw new Error(data.mensaje || "Error al subir los resultados");
      }
  
      // Reset form on success
      setSelectedPatient(null);
      setSelectedFile(null);
      setAppointmentDate("");
      setContactInfo("");
      setSearchTerm("");
      setFirstName("");
      setLastName("");
      setDni("");
      setError(null);
      setTitle(""); // Limpiar título
      setObservaciones("");

  
      Swal.fire({
        icon: "success",
        title: "Resultados subidos",
        text: "Los resultados se han subido exitosamente.",
      });
    } catch (error) {
      setError("Error al subir los resultados. Por favor, intente nuevamente.");
      console.error("Error subiendo resultados:", error);
  
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Hubo un problema al subir los resultados. Inténtalo de nuevo.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen">
      <h1 className="text-2xl font-bold mb-6">Subir Resultados Médicos</h1>

      {/* Error and Success Messages */}
      {error && <div className="bg-red-100 text-red-700 p-4 rounded mb-4">{error}</div>}
      {success && <div className="bg-green-100 text-green-700 p-4 rounded mb-4">Resultados subidos exitosamente</div>}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Título */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Título de la Cita</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            placeholder="Ingrese el título de la cita"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
          />
        </div>

        {/* Patient Search Section */}
        <div className="mt-4">
          <label htmlFor="patientSearch" className="block text-sm font-medium text-gray-700">
            Búsqueda de Paciente
          </label>
          <input
            type="text"
            id="patientSearch"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              // Si el input de búsqueda está vacío, deseleccionar el paciente
              if (e.target.value.trim() === "") {
                setSelectedPatient(null);
              }
            }}
            disabled={isNewPatient}
            placeholder="Buscar paciente por nombre o DNI"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
          />
        </div>

        {/* Lista de pacientes encontrados */}
        {searchTerm.length > 2 && patients.length > 0 && !isNewPatient && (
          <ul className="mt-2 max-h-48 overflow-y-auto border border-gray-300 rounded-md">
            {patients.map((patient) => (
              <li
                key={patient.idUsuario}
                onClick={() => setSelectedPatient(patient)}
                className="px-4 py-2 cursor-pointer hover:bg-gray-100"
              >
                {patient.nombres} {patient.apellidos} - DNI: {patient.dni}
              </li>
            ))}
          </ul>
        )}

        {/* Selected Patient Info */}
        {selectedPatient && (
          <div className="bg-green-50 p-4 rounded-md relative">
            <p className="text-sm text-green-700">
              Paciente seleccionado: {selectedPatient.nombres} {selectedPatient.apellidos}
            </p>
            {/* Botón "X" para eliminar el paciente seleccionado */}
            <button
              onClick={() => {
                setSelectedPatient(null); // Deseleccionar el paciente
                setSearchTerm(""); // Limpiar el input de búsqueda
              }}
              className="absolute top-2 right-2 text-gray-500 hover:text-red-500 transition-colors duration-200"
            >
              <X size={16} />
            </button>
          </div>
        )}

        {/* New Patient Toggle */}
        <div>
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={isNewPatient}
              onChange={(e) => {
                setIsNewPatient(e.target.checked);
                if (e.target.checked) {
                  setSelectedPatient(null);
                  setSearchTerm('');
                } else {
                  setFirstName('');
                  setLastName('');
                  setDni('');
                  setContactInfo('');
                }
              }}
              className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
            />
            <span className="ml-2 text-sm text-gray-700">Paciente nuevo</span>
          </label>
        </div>

        {/* New Patient Fields */}
        {isNewPatient && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">Nombres</label>
              <input
                type="text"
                value={firstName}
                onChange={(e) => {
                  const value = e.target.value;
                  if (/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]*$/.test(value)) {
                    setFirstName(value);
                  }
                }}
                required
                placeholder="Ingrese nombres"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Apellidos</label>
              <input
                type="text"
                value={lastName}
                onChange={(e) => {
                  const value = e.target.value;
                  if (/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]*$/.test(value)) {
                    setLastName(value);
                  }
                }}
                required
                placeholder="Ingrese apellidos"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">DNI</label>
              <input
                type="text"
                value={dni}
                onChange={(e) => {
                  const value = e.target.value;
                  if (/^\d{0,8}$/.test(value)) {
                    setDni(value);
                  }
                }}
                required
                placeholder="Ingrese DNI"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Método de Contacto</label>
              <select
                value={contactMethod}
                onChange={(e) => setContactMethod(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
              >
                <option value="email">Email</option>
                <option value="whatsapp">WhatsApp</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                {contactMethod === 'email' ? 'Correo Electrónico' : 'Número de WhatsApp'}
              </label>
              <input
                type="text"
                value={contactInfo}
                onChange={(e) => setContactInfo(e.target.value)}
                required
                placeholder={contactMethod === 'email' ? 'ejemplo@correo.com' : '+51 999999999'}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
              />
            </div>
          </div>
        )}

        {/* Observations */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Observaciones</label>
          <textarea
            value={observaciones}
            onChange={(e) => setObservaciones(e.target.value)}
            required
            placeholder="Ingrese observaciones adicionales"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
          />
        </div>

        {/* Appointment Date & File Upload */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">Fecha de la Cita</label>
            <input
              type="date"
              value={appointmentDate}
              onChange={(e) => setAppointmentDate(e.target.value)}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Documento de Resultados</label>
            <div className="mt-1 flex items-center justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
              <div className="space-y-1 text-center">
                <Upload className="mx-auto h-12 w-12 text-gray-400" />
                <div className="flex text-sm text-gray-600">
                  <label
                    htmlFor="file-upload"
                    className="relative cursor-pointer bg-white rounded-md font-medium text-green-600 hover:text-green-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-green-500"
                  >
                    <span>Subir archivo</span>
                    <input id="file-upload" name="file-upload" type="file" accept=".pdf" onChange={handleFileChange} className="sr-only" />
                  </label>
                  <p className="pl-1">o arrastrar y soltar</p>
                </div>
                <p className="text-xs text-gray-500">Solo PDF hasta: 10MB</p>
              </div>
            </div>
            {selectedFile && (
              <div className="mt-2 flex items-center">
                <span className="text-sm text-gray-500">{selectedFile.name}</span>
                <X
                  onClick={() => setSelectedFile(null)}
                  className="ml-2 h-5 w-5 text-gray-400 hover:text-red-500 cursor-pointer transition-colors duration-200"
                />
              </div>
            )}
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
        >
          {loading ? 'Subiendo...' : 'Subir Resultados'}
        </button>
      </form>
    </div>
  );
};

export default LuxuryResultsForm;


