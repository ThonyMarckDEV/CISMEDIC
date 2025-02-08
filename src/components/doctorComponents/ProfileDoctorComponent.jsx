import React, { useState, useEffect } from "react";
import { Building, GraduationCap, Stethoscope, Languages, Star, Edit, Plus, Trash2, Clock, Calendar, User } from "lucide-react";
import API_BASE_URL from "../../js/urlHelper";
import banner from '../../img/local.jpeg';
import jwtUtils from "../../utilities/jwtUtils";
import LoaderScreen from '../../components/home/LoadingScreen';
import sweetAlert from '../SweetAlert';

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
      setProfileData(data);
      setTempEducacion(data.educacion);
      setTempIdiomas(data.idiomas);
      setTempNacimiento(data.nacimiento);
      setTempExperiencia(data.experiencia);
    } catch (error) {
      setError("Error al cargar el perfil");
    }finally{
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

  // Esqueleto de carga
  const SkeletonCard = () => (
    <div className="bg-white rounded-lg shadow-sm border border-green-100 animate-pulse">
      <div className="p-6">
        <div className="flex justify-between items-start">
          <div className="text-center flex-1 space-y-2">
            <div className="h-4 bg-gray-300 rounded w-24 mx-auto"></div>
            <div className="h-6 bg-gray-300 rounded w-16 mx-auto"></div>
          </div>
          <div className="w-0.5 h-24 bg-green-200 mx-8"></div>
          <div className="text-center flex-1 space-y-2">
            <div className="h-4 bg-gray-300 rounded w-24 mx-auto"></div>
            <div className="h-6 bg-gray-300 rounded w-16 mx-auto"></div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Banner and Profile Photo */}
      <div className="relative h-64">
        <div className="absolute inset-0">
          <img
            src={banner || "/placeholder.svg"}
            alt="Medical Banner"
            className="w-full h-full object-cover opacity-20"
          />
        </div>
        {/* Foto de perfil */}
        <div className="absolute -bottom-20 left-1/2 -translate-x-1/2 z-10">
          <div className="relative group">
            <div className="h-40 w-40 rounded-full border-4 border-white bg-white shadow-xl overflow-hidden">
              {isLoading ? (
                <div className="animate-pulse bg-gray-300 h-full w-full rounded-full"></div>
              ) : (
                <img
                  src={
                    profileData.foto_perfil
                      ? `${API_BASE_URL}/storage/${profileData.foto_perfil}`
                      : "/placeholder.jpg"
                  }
                  alt="Profile"
                  className="h-full w-full object-cover"
                />
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="mt-8 max-w-7xl mx-auto grid grid-cols-1 gap-6 sm:grid-cols-2">
        {/* Birth Date and Age Card */}
        {isLoading ? (
          <SkeletonCard />
        ) : (
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
                    <input
                      type="date"
                      value={tempNacimiento}
                      onChange={(e) => setTempNacimiento(e.target.value)}
                      className="text-xl font-bold text-green-600 border border-gray-300 rounded px-2 py-1 text-center"
                    />
                  ) : (
                    <p className="text-xl font-bold text-green-600">
                      {profileData.nacimiento
                        ? new Date(profileData.nacimiento).toLocaleDateString()
                        : "No especificado"}
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
        )}

        {/* Experience and Languages Card */}
        {isLoading ? (
          <SkeletonCard />
        ) : (
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
                    <>
                      <input
                        type="number"
                        value={tempExperiencia}
                        onChange={(e) => setTempExperiencia(e.target.value)}
                        className="w-20 text-3xl font-bold text-green-600 border border-gray-300 rounded px-2 py-1 text-center"
                        min="0"
                      />
                      años
                    </>
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
        )}

        {/* Educación */}
        {isLoading ? (
          <SkeletonCard />
        ) : (
          <div className="bg-white rounded-lg shadow-sm border border-green-100">
            <div className="p-6">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-medium text-gray-900 flex items-center gap-2">
                  <GraduationCap className="h-5 w-5 text-green-700" />
                  Educación
                </h2>
                {isEditing && (
                  <button onClick={handleAddEducacion} className="bg-green-500 hover:bg-green-600 text-white p-2 rounded">
                    Agregar
                  </button>
                )}
              </div>
              <div className="mt-4 space-y-4">
                {(isEditing ? tempEducacion : profileData.educacion).map((edu, index) => (
                  <div key={index} className="border-l-2 border-green-200 pl-4">
                    {isEditing ? (
                      <>
                        <input
                          type="text"
                          value={edu.titulo}
                          onChange={(e) => {
                            const newEducacion = [...tempEducacion];
                            newEducacion[index].titulo = e.target.value;
                            setTempEducacion(newEducacion);
                          }}
                          placeholder="Título"
                          className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-green-500 w-full"
                        />
                        <input
                          type="text"
                          value={edu.institucion}
                          onChange={(e) => {
                            const newEducacion = [...tempEducacion];
                            newEducacion[index].institucion = e.target.value;
                            setTempEducacion(newEducacion);
                          }}
                          placeholder="Institución"
                          className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-green-500 w-full mt-2"
                        />
                        <input
                          type="text"
                          value={edu.anio}
                          onChange={(e) => {
                            const newEducacion = [...tempEducacion];
                            newEducacion[index].anio = e.target.value;
                            setTempEducacion(newEducacion);
                          }}
                          placeholder="Año"
                          className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-green-500 w-24 mt-2"
                        />
                        <button
                          onClick={() => handleRemoveEducacion(index)}
                          className="bg-red-500 hover:bg-red-600 text-white p-1 rounded mt-2"
                        >
                          Eliminar
                        </button>
                      </>
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
        )}

        {/* Idiomas */}
        {isLoading ? (
          <SkeletonCard />
        ) : (
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
                  <>
                    <input
                      type="text"
                      value={newIdioma}
                      onChange={(e) => setNewIdioma(e.target.value)}
                      placeholder="Agregar idioma"
                      className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-green-500 w-full"
                    />
                    <button
                      onClick={handleAddIdioma}
                      className="bg-green-500 hover:bg-green-600 text-white p-2 rounded mt-2"
                    >
                      Agregar
                    </button>
                    <ul className="space-y-2 mt-2">
                      {tempIdiomas.map((idioma, index) => (
                        <li key={index} className="text-sm text-gray-900 flex items-center gap-2">
                          {idioma}
                          <button
                            onClick={() => handleRemoveIdioma(index)}
                            className="bg-red-500 hover:bg-red-600 text-white p-1 rounded"
                          >
                            Eliminar
                          </button>
                        </li>
                      ))}
                    </ul>
                  </>
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
        )}
      </div>

      {/* Edit Button */}
      <div className="mt-6 text-center">
        <button
          onClick={() => setIsEditing(!isEditing)}
          className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-md"
        >
          {isEditing ? "Cancelar Edición" : "Editar Perfil"}
        </button>
      </div>

      {/* Save Button */}
      {isEditing && (
        <div className="mt-6 text-center">
          <button
            onClick={handleSave}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md"
          >
            Guardar Cambios
          </button>
        </div>
      )}
    </div>
  );
};

export default PerfilDoctorComponent;