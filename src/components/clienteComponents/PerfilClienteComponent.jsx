import React, { useState, useEffect } from "react";
import { Edit, Calendar, User, Phone, Mail } from "lucide-react";
import API_BASE_URL from "../../js/urlHelper";
import banner from '../../img/local.jpeg';
import jwtUtils from "../../utilities/jwtUtils";
import LoaderScreen from '../../components/home/LoadingScreen';
import sweetAlert from '../SweetAlert';
import imgperfil from '../../img/defualtpefil.jpg';

const PerfilClienteComponent = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [profileData, setProfileData] = useState({
    nombre: "",
    email: "",
    foto_perfil: "",
    telefono: "",
    nacimiento: "",
    sexo: "",
    dni: "",
    edad: "",
  });
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
  const idCliente = jwtUtils.getIdUsuario(token);
  try {
    setIsLoading(true);
    const response = await fetch(`${API_BASE_URL}/api/cliente/perfil/${idCliente}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await response.json();

    // Formatear la fecha antes de establecer el estado
    setProfileData({
      ...data,
      nacimiento: formatDateForInput(data.nacimiento), // Formatear solo si es necesario
    });
  } catch (error) {
    setError("Error al cargar el perfil");
    sweetAlert.showMessageAlert('Error!', 'Error al cargar el perfil', 'error');
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
      const idCliente = jwtUtils.getIdUsuario(token);
      const response = await fetch(`${API_BASE_URL}/api/cliente/actualizar-foto/${idCliente}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });
  
      if (!response.ok) {
        throw new Error("Error al actualizar la foto");
      }
  
      const data = await response.json();
      setProfileData({ ...profileData, foto_perfil: data.ruta });
      window.location.reload();
      sweetAlert.showMessageAlert('Éxito!', 'Foto Actualizada Correctamente', 'success');
    } catch (error) {
      setError(error.message);
      sweetAlert.showMessageAlert('Error!', 'Error al actualizar la foto', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      const token = jwtUtils.getTokenFromCookie();
      const idCliente = jwtUtils.getIdUsuario(token);
  
      // Convertir la fecha de nuevo a ISO 8601 si es necesario
      const formattedDate = profileData.nacimiento
        ? new Date(profileData.nacimiento).toISOString().split("T")[0]
        : null;
  
      // Actualizar datos básicos
      await fetch(`${API_BASE_URL}/api/cliente/actualizar-datos/${idCliente}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nacimiento: formattedDate,
          telefono: profileData.telefono,
          email: profileData.email,
          sexo: profileData.sexo,
        }),
      });
  
      setIsEditing(false);
      await fetchProfileData();
      sweetAlert.showMessageAlert('Éxito!', 'Datos Actualizados Correctamente', 'success');
    } catch (error) {
      setError("Error al guardar los cambios");
      sweetAlert.showMessageAlert('Error!', 'Error al guardar los cambios', 'error');
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
            alt="Profile Banner"
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
      <div className="mt-8 max-w-4xl mx-auto grid grid-cols-1 gap-6">
        {/* Personal Information Card */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-medium mb-4">Información Personal</h2>
          
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Nombres y Apellidos</label>
                <p className="mt-1 text-gray-900">{profileData.nombre}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">DNI</label>
                <p className="mt-1 text-gray-900">{profileData.dni}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Fecha de Nacimiento</label>
                {isEditing ? (
                  <input
                    type="date"
                    value={profileData.nacimiento}
                    onChange={(e) => setProfileData({ ...profileData, nacimiento: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                ) : (
                  <p className="mt-1 text-gray-900">
                    {profileData.nacimiento || "No especificado"}
                  </p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Edad</label>
                <p className="mt-1 text-gray-900">{profileData.edad} años</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Correo Electrónico</label>

                  <p className="mt-1 text-gray-900">{profileData.email}</p>
  
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Teléfono</label>
                {isEditing ? (
                  <input
                    type="tel"
                    value={profileData.telefono}
                    onChange={(e) => setProfileData({ ...profileData, telefono: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                ) : (
                  <p className="mt-1 text-gray-900">{profileData.telefono}</p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Sexo</label>
              {isEditing ? (
                <select
                  value={profileData.sexo || ''}
                  onChange={(e) => setProfileData({ ...profileData, sexo: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                >
                  <option value="">Seleccionar</option>
                  <option value="M">Masculino</option>
                  <option value="F">Femenino</option>
                </select>
              ) : (
                <p className="mt-1 text-gray-900">
                  {profileData.sexo === 'M' ? 'Masculino' : profileData.sexo === 'F' ? 'Femenino' : 'No especificado'}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Save Button */}
      {isEditing && (
        <div className="mt-8 text-center pb-8">
          <button 
            onClick={handleSave} 
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-md"
          >
            Guardar Cambios
          </button>
        </div>
      )}
    </div>
  );
};

export default PerfilClienteComponent;