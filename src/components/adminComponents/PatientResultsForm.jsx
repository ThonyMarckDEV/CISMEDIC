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

  // const validateForm = () => {
  //   if (!selectedFile) {
  //     setError('Por favor, seleccione un archivo de resultados.');
  //     return false;
  //   }
  //   if (!appointmentDate) {
  //     setError('Por favor, seleccione la fecha de la cita.');
  //     return false;
  //   }
  //   if (isNewPatient) {
  //     if (!firstName || !lastName || !dni) {
  //       setError('Por favor, complete todos los datos del paciente nuevo.');
  //       return false;
  //     }
  //     if (!contactInfo) {
  //       setError(`Por favor, ingrese ${contactMethod === 'email' ? 'un correo electrónico' : 'un número de WhatsApp'}.`);
  //       return false;
  //     }
  //   } else if (!selectedPatient) {
  //     setError('Por favor, seleccione un paciente.');
  //     return false;
  //   }
  //   return true;
  // };

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

  const handleNameChange = (e) => {
    const value = e.target.value;
    if (/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]*$/.test(value)) {
      setFirstName(value);
    }
  };
  
  const handleLastNameChange = (e) => {
    const value = e.target.value;
    if (/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]*$/.test(value)) {
      setLastName(value);
    }
  };

  const handleDniChange = (e) => {
    const value = e.target.value;
    if (/^\d{0,8}$/.test(value)) {
      setDni(value);
    }
  };
  
  
  return (
    <div className="min-h-screen">
      <div className="max-w-6xl mx-auto bg-white/80 backdrop-blur-sm shadow-2xl rounded-2xl border">
        <div className="p-8">
          <h2 className="text-3xl font-semibold text-gray-800 mb-8 text-center">
            Subir Resultados Médicos
          </h2>

          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl flex items-center gap-2">
              <AlertCircle className="h-5 w-5" />
              <p>{error}</p>
            </div>
          )}

          {success && (
            <div className="mb-6 bg-green-50 border border-green-200 text-green-700 p-4 rounded-xl flex items-center gap-2">
              <CheckCircle className="h-5 w-5" />
              <p>Resultados subidos exitosamente</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Patient Search Section */}
              <div className="md:col-span-2 bg-white/50 p-6 rounded-xl shadow-sm border border-gray-100">
                <label className="block text-lg font-medium text-gray-700 mb-3">
                  Búsqueda de Paciente
                </label>
                <div className="relative">
                  <Search className="absolute left-4 top-3.5 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    className="pl-12 w-full h-12 rounded-xl border-2 border-gray-200 shadow-sm focus:border-green-500 focus:ring focus:ring-green-200 focus:ring-opacity-50 text-lg transition-colors duration-200"
                    placeholder="Buscar por nombre o DNI..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    disabled={isNewPatient}
                  />
                </div>

                {searchTerm.length > 2 && patients.length > 0 && !isNewPatient && (
                  <div className="mt-3 max-h-60 overflow-y-auto rounded-xl border border-gray-200 bg-white shadow-lg divide-y divide-gray-100">
                    {patients.map((patient) => (
                      <button
                        key={patient.idUsuario}
                        type="button"
                        className="w-full px-6 py-4 text-left hover:bg-green-50 focus:bg-green-50 transition-colors duration-150"
                        onClick={() => setSelectedPatient(patient)}
                      >
                        <p className="text-lg font-medium text-gray-800">
                          {patient.nombres} {patient.apellidos}
                        </p>
                        <p className="text-sm text-gray-500">DNI: {patient.dni}</p>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* New Patient Toggle */}
              <div className="md:col-span-2">
                <label className="flex items-center space-x-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    className="h-6 w-6 rounded-lg border-2 border-gray-300 text-green-600 focus:ring focus:ring-green-200 focus:ring-opacity-50 transition-colors duration-200 cursor-pointer"
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
                  />
                  <span className="text-lg text-gray-700 group-hover:text-gray-900 transition-colors duration-200">
                    Paciente nuevo
                  </span>
                </label>
              </div>

              {/* New Patient Fields */}
              {isNewPatient && (
                <>
                  <div className="space-y-6">
                    <div>
                      <label className="block text-lg font-medium text-gray-700 mb-2">
                        Nombres
                      </label>
                      <input
                        type="text"
                        className="w-full h-12 rounded-xl border-2 border-gray-200 shadow-sm focus:border-green-500 focus:ring focus:ring-green-200 focus:ring-opacity-50 text-lg transition-colors duration-200"
                        value={firstName}
                        onChange={handleNameChange}
                        required={isNewPatient}
                        placeholder="Ejemplo: Juan"
                      />
                    </div>
                    <div>
                      <label className="block text-lg font-medium text-gray-700 mb-2">
                        Apellidos
                      </label>
                      <input
                        type="text"
                        className="w-full h-12 rounded-xl border-2 border-gray-200 shadow-sm focus:border-green-500 focus:ring focus:ring-green-200 focus:ring-opacity-50 text-lg transition-colors duration-200"
                        value={lastName}
                        onChange={handleLastNameChange}
                        required={isNewPatient}
                        placeholder="Ejemplo: Pérez"
                      />
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div>
                      <label className="block text-lg font-medium text-gray-700 mb-2">
                        DNI
                      </label>
                      <input
                        type="text"
                        className="w-full h-12 rounded-xl border-2 border-gray-200 shadow-sm focus:border-green-500 focus:ring focus:ring-green-200 focus:ring-opacity-50 text-lg transition-colors duration-200"
                        value={dni}
                        onChange={handleDniChange}
                        required={isNewPatient}
                        maxLength={8}
                        placeholder="Ejemplo: 12345678"
                      />
                    </div>

                    <div>
                      <label className="block text-lg font-medium text-gray-700 mb-2">
                        Método de Contacto
                      </label>
                      <select
                        className="w-full h-12 rounded-xl border-2 border-gray-200 shadow-sm focus:border-green-500 focus:ring focus:ring-green-200 focus:ring-opacity-50 text-lg transition-colors duration-200"
                        value={contactMethod}
                        onChange={(e) => setContactMethod(e.target.value)}
                      >
                        <option value="email">Email</option>
                        {/* <option value="whatsapp">WhatsApp</option> */}
                      </select>
                    </div>

                    <div>
                      <label className="block text-lg font-medium text-gray-700 mb-2">
                        {contactMethod === 'email' ? 'Correo Electrónico' : 'Número de WhatsApp'}
                      </label>
                      <input
                        type={contactMethod === 'email' ? 'email' : 'tel'}
                        className="w-full h-12 rounded-xl border-2 border-gray-200 shadow-sm focus:border-green-500 focus:ring focus:ring-green-200 focus:ring-opacity-50 text-lg transition-colors duration-200"
                        value={contactInfo}
                        onChange={(e) => setContactInfo(e.target.value)}
                        placeholder={contactMethod === 'email' ? 'ejemplo@correo.com' : '+51 999999999'}
                        required={isNewPatient}
                      />
                    </div>
                  </div>
                </>
              )}

              <div>
                <label className="block text-lg font-medium text-gray-700 mb-2">
                  Observaciones
                </label>
                <textarea
                  className="w-full h-24 rounded-xl border-2 border-gray-200 shadow-sm focus:border-green-500 focus:ring focus:ring-green-200 focus:ring-opacity-50 text-lg transition-colors duration-200"
                  value={observaciones}
                  onChange={(e) => setObservaciones(e.target.value)}
                  placeholder="Ingrese observaciones adicionales (opcional)"
                />
              </div>

              {/* Appointment Date & File Upload */}
              <div className="md:col-span-2 space-y-8">
                <div>
                  <label className="block text-lg font-medium text-gray-700 mb-2">
                    Fecha de la Cita
                  </label>
                  <input
                    type="date"
                    className="w-full h-12 rounded-xl border-2 border-gray-200 shadow-sm focus:border-green-500 focus:ring focus:ring-green-200 focus:ring-opacity-50 text-lg transition-colors duration-200"
                    value={appointmentDate}
                    onChange={(e) => setAppointmentDate(e.target.value)}
                    required
                  />
                </div>

                <div>
                  <label className="block text-lg font-medium text-gray-700 mb-2">
                    Documento de Resultados
                  </label>
                  <div className="mt-2 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-xl hover:border-green-500 transition-colors duration-200">
                    <div className="space-y-2 text-center">
                      <Upload className="mx-auto h-16 w-16 text-gray-400" />
                      <div className="flex text-lg text-gray-600">
                        <label className="relative cursor-pointer rounded-md font-medium text-green-600 hover:text-green-500 transition-colors duration-200">
                          <span>Subir archivo</span>
                          <input
                            type="file"
                            className="sr-only"
                            onChange={handleFileChange}
                            accept=".pdf"
                          />
                        </label>
                        <p className="pl-1">o arrastrar y soltar</p>
                      </div>
                      <p className="text-sm text-gray-500">Solo PDF hasta:10MB</p>
                    </div>
                  </div>
                  {selectedFile && (
                    <div className="mt-3 flex items-center p-3 bg-green-50 rounded-xl">
                      <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
                      <span className="text-sm text-gray-600 truncate flex-1">{selectedFile.name}</span>
                      <button
                        type="button"
                        onClick={() => setSelectedFile(null)}
                        className="ml-2 text-gray-400 hover:text-red-500 transition-colors duration-200"
                      >
                        <X className="h-5 w-5" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full h-14 bg-gradient-to-r from-green-600 to-emerald-600 text-white text-lg font-medium rounded-xl hover:from-green-700 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105"
            >
              {loading ? 'Subiendo...' : 'Subir Resultados'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LuxuryResultsForm;