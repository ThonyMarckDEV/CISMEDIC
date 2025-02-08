import React, { useState, useEffect } from "react";
import { Building, GraduationCap, Stethoscope, Languages, Star, Edit, Plus, Trash2, Clock, Calendar, User } from "lucide-react";
import API_BASE_URL from "../../js/urlHelper";
import banner from '../../img/local.jpeg';
import jwtUtils from "../../utilities/jwtUtils";
import LoaderScreen from '../../components/home/LoadingScreen';
import sweetAlert from '../SweetAlert';
import imgperfil from '../../img/defualtpefil.jpg';

const PerfilDoctorComponent = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [tempNacimiento, setTempNacimiento] = useState("");
  const [profileData, setProfileData] = useState({
    nombre: "",
    email: "",
    foto_perfil: "",
    especialidad: "",
    experiencia: "",
    educacion: [],
    idiomas: [],
  });
  const [tempEducacion, setTempEducacion] = useState([]);
  const [tempIdiomas, setTempIdiomas] = useState([]);
  const [tempExperiencia, setTempExperiencia] = useState("");
  const [newIdioma, setNewIdioma] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    fetchProfileData();
  }, []);

  const formatDateForInput = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const fetchProfileData = async () => {
    const token = jwtUtils.getTokenFromCookie();
    const idDoctor = jwtUtils.getIdUsuario(token);
    try {
      setIsLoading(true);
      const response = await fetch(`${API_BASE_URL}/api/doctor/perfil/${idDoctor}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
  
      // Formatear la fecha antes de establecer el estado
      setProfileData({
        ...data,
        nacimiento: formatDateForInput(data.nacimiento),
      });
      setTempNacimiento(formatDateForInput(data.nacimiento)); // También actualiza tempNacimiento
      setTempEducacion(data.educacion);
      setTempIdiomas(data.idiomas);
      setTempExperiencia(data.experiencia);
    } catch (error) {
      setError("Error al cargar el perfil");
    } finally {
      setIsLoading(false);
    }
  };

  const handlePhotoUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;
  
    setIsLoading(true);
    setError("");
  
    const formData = new FormData();
    formData.append("foto", file);
  
    try {
      const token = jwtUtils.getTokenFromCookie();
      const idDoctor = jwtUtils.getIdUsuario(token);
      const response = await fetch(`${API_BASE_URL}/api/doctor/actualizar-foto/${idDoctor}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });
  
      if (!response.ok) {
        throw new Error("Error al actualizar la foto");
        sweetAlert.showMessageAlert('Error!','Error al actualizar la foto','error');
      }
  
      const data = await response.json();
      setProfileData({ ...profileData, foto_perfil: data.ruta });
  
      // Recargar la página después de actualizar la foto
      window.location.reload();
      sweetAlert.showMessageAlert('Exito!','Foto Actualizada Correctamente','success');
    } catch (error) {
      setError(error.message);
      sweetAlert.showMessageAlert('Error!','Error'+error.message,'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddEducacion = () => {
    setTempEducacion([...tempEducacion, { titulo: "", institucion: "", anio: "" }]);
  };

  const handleRemoveEducacion = (index) => {
    setTempEducacion(tempEducacion.filter((_, i) => i !== index));
  };

  const handleAddIdioma = () => {
    if (newIdioma.trim()) {
      setTempIdiomas([...tempIdiomas, newIdioma.trim()]);
      setNewIdioma("");
    }
  };

  const handleRemoveIdioma = (index) => {
    setTempIdiomas(tempIdiomas.filter((_, i) => i !== index));
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      const token = jwtUtils.getTokenFromCookie();
      const idDoctor = jwtUtils.getIdUsuario(token);
  
      // Actualizar nacimiento
      await fetch(`${API_BASE_URL}/api/doctor/actualizar-nacimiento/${idDoctor}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ nacimiento: tempNacimiento }),
      });
  
      // Actualizar idiomas
      await fetch(`${API_BASE_URL}/api/doctor/actualizar-idiomas/${idDoctor}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ idiomas: tempIdiomas }),
      });
  
      // Actualizar educación
      await fetch(`${API_BASE_URL}/api/doctor/actualizar-educacion/${idDoctor}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ educacion: tempEducacion }),
      });
  
      // Actualizar experiencia
      await fetch(`${API_BASE_URL}/api/doctor/actualizar-experiencia/${idDoctor}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ experiencia: tempExperiencia }),
      });
  
      setProfileData({ ...profileData, nacimiento: tempNacimiento , experiencia: tempExperiencia });
      setIsEditing(false);
      await fetchProfileData();
      sweetAlert.showMessageAlert('Exito!','Datos Actualizados Correctamente','success');
    } catch (error) {
      setError("Error al guardar los cambios");
      sweetAlert.showMessageAlert('Error!','Error al guardar los cambios','error');
    } finally {
      setIsLoading(false);
    }
  };

    return (
    <div className="min-h-screen bg-gray-50">
      {isLoading && <LoaderScreen />}
      {/* Banner and Profile Photo */}
      <div className="relative h-64">
        <div className="absolute inset-0">
          <img
            src={banner || "/placeholder.svg"}
            alt="Medical Banner"
            className="w-full h-full object-cover opacity-20"
          />
        </div>
        <div className="absolute -bottom-20 left-1/2 -translate-x-1/2">
          <div className="relative group">
            <div className="h-40 w-40 rounded-full border-4 border-white bg-white shadow-xl overflow-hidden">
              <img
                src={
                  profileData.foto_perfil ? `${API_BASE_URL}/storage/${profileData.foto_perfil}` : imgperfil
                }
                alt="Profile"
                className="h-full w-full object-cover"
              />
            </div>
            {isEditing && (
              <label className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-full cursor-pointer">
                <input type="file" className="hidden" accept="image/*" onChange={handlePhotoUpload} />
                <Edit className="h-8 w-8 text-white" />
              </label>
            )}
          </div>
        </div>
      </div>

      {/* Edit Button */}
      <div className="mt-24 text-center">
        <button
          onClick={() => setIsEditing(!isEditing)}
          className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-md"
        >
          {isEditing ? "Cancelar Edición" : "Editar Perfil"}
        </button>
      </div>

      {/* Main Content Grid */}
      <div className="mt-8 max-w-7xl mx-auto grid grid-cols-1 gap-6 sm:grid-cols-2">
        {/* Birth Date and Age Card */}
        <div className="bg-white rounded-lg shadow-sm border border-green-100">
          <div className="p-6">
            <div className="flex justify-between items-start">
              {/* Birth Date Section */}
              <div className="text-center flex-1">
                <h2 className="text-lg font-medium text-gray-900 flex items-center justify-center gap-2 mb-2">
                  <Calendar className="h-5 w-5 text-green-700" />
                  Fecha de Nacimiento
                </h2>
                {isEditing ? (
                  <div className="flex items-center justify-center gap-2">
                    <input
                      type="date"
                      value={tempNacimiento}
                      onChange={(e) => setTempNacimiento(e.target.value)}
                      className="text-xl font-bold text-green-600 border border-gray-300 rounded px-2 py-1 text-center"
                    />
                  </div>
                ) : (
                  <p className="text-xl font-bold text-green-600">
                    {profileData.nacimiento || "No especificado"}
                  </p>
                )}
              </div>

              {/* Vertical Green Line */}
              <div className="w-0.5 h-24 bg-green-200 mx-8"></div>

              {/* Age Section */}
              <div className="text-center flex-1">
                <h2 className="text-lg font-medium text-gray-900 flex items-center justify-center gap-2 mb-2">
                  <User className="h-5 w-5 text-green-700" />
                  Edad
                </h2>
                <p className="text-xl font-bold text-green-600">
                  {profileData.edad ? `${profileData.edad} años` : "No especificado"}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Experience and Languages Card */}
        <div className="bg-white rounded-lg shadow-sm border border-green-100">
          <div className="p-6">
            <div className="flex justify-between items-start">
              {/* Experience Section */}
              <div className="text-center flex-1">
                <h2 className="text-lg font-medium text-gray-900 flex items-center justify-center gap-2 mb-2">
                  <Clock className="h-5 w-5 text-green-700" />
                  Experiencia
                </h2>
                {isEditing ? (
                  <div className="flex items-center justify-center gap-2">
                    <input
                      type="number"
                      value={tempExperiencia}
                      onChange={(e) => setTempExperiencia(e.target.value)}
                      className="w-20 text-3xl font-bold text-green-600 border border-gray-300 rounded px-2 py-1 text-center"
                      min="0"
                    />
                    <span className="text-3xl font-bold text-green-600">años</span>
                  </div>
                ) : (
                  <p className="text-3xl font-bold text-green-600">{profileData.experiencia} años</p>
                )}
              </div>

              {/* Vertical Green Line */}
              <div className="w-0.5 h-24 bg-green-200 mx-8"></div>

              {/* Languages Section */}
              <div className="text-center flex-1">
                <h2 className="text-lg font-medium text-gray-900 flex items-center justify-center gap-2 mb-2">
                  <Languages className="h-5 w-5 text-green-700" />
                  Idiomas
                </h2>
                <p className="text-3xl font-bold text-green-600">{profileData.cantidadIdiomas}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Educación */}
        <div className="bg-white rounded-lg shadow-sm border border-green-100">
          <div className="p-6">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-medium text-gray-900 flex items-center gap-2">
                <GraduationCap className="h-5 w-5 text-green-700" />
                Educación
              </h2>
              {isEditing && (
                <button
                  onClick={handleAddEducacion}
                  className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded-md flex items-center gap-1"
                >
                  <Plus className="h-4 w-4" /> Agregar
                </button>
              )}
            </div>
            <div className="mt-4 space-y-4">
              {(isEditing ? tempEducacion : profileData.educacion).map((edu, index) => (
                <div key={index} className="border-l-2 border-green-200 pl-4">
                  {isEditing ? (
                    <div className="space-y-2">
                      <input
                        value={edu.titulo}
                        onChange={(e) => {
                          const newEducacion = [...tempEducacion]
                          newEducacion[index].titulo = e.target.value
                          setTempEducacion(newEducacion)
                        }}
                        placeholder="Título"
                        className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-green-500 w-full"
                      />
                      <input
                        value={edu.institucion}
                        onChange={(e) => {
                          const newEducacion = [...tempEducacion]
                          newEducacion[index].institucion = e.target.value
                          setTempEducacion(newEducacion)
                        }}
                        placeholder="Institución"
                        className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-green-500 w-full"
                      />
                      <div className="flex items-center gap-2">
                        <input
                          value={edu.anio}
                          onChange={(e) => {
                            const newEducacion = [...tempEducacion]
                            newEducacion[index].anio = e.target.value
                            setTempEducacion(newEducacion)
                          }}
                          placeholder="Año"
                          className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-green-500 w-24"
                        />
                        <button
                          onClick={() => handleRemoveEducacion(index)}
                          className="bg-red-500 hover:bg-red-600 text-white p-1 rounded"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <h3 className="text-sm font-medium text-gray-900">{edu.titulo}</h3>
                      <p className="text-sm text-gray-500">{edu.institucion}</p>
                      <p className="text-xs text-green-700">{edu.anio}</p>
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Idiomas */}
        <div className="bg-white rounded-lg shadow-sm border border-green-100">
          <div className="p-6">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-medium text-gray-900 flex items-center gap-2">
                <Languages className="h-5 w-5 text-green-700" />
                Idiomas
              </h2>
            </div>
            <div className="mt-4">
              {isEditing ? (
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <input
                      value={newIdioma}
                      onChange={(e) => setNewIdioma(e.target.value)}
                      placeholder="Agregar idioma"
                      className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-green-500 w-full"
                    />
                    <button
                      onClick={handleAddIdioma}
                      className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded-md flex items-center gap-1"
                    >
                      <Plus className="h-4 w-4" /> Agregar
                    </button>
                  </div>
                  {tempIdiomas.map((idioma, index) => (
                    <div key={index} className="flex justify-between items-center border-l-2 border-green-200 pl-4">
                      <p className="text-sm text-gray-900">{idioma}</p>
                      <button
                        onClick={() => handleRemoveIdioma(index)}
                        className="bg-red-500 hover:bg-red-600 text-white p-1 rounded"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <ul className="space-y-2">
                  {profileData.idiomas.map((idioma, index) => (
                    <li key={index} className="text-sm text-gray-900 flex items-center gap-2">
                      <Languages className="h-4 w-4 text-green-700" />
                      {idioma}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Save Button */}
      {isEditing && (
        <div className="mt-8 text-center">
          <button onClick={handleSave} className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-md">
            Guardar Cambios
          </button>
        </div>
      )}
    </div>
  )
}

export default PerfilDoctorComponent