import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Building, GraduationCap, Stethoscope, Languages, Star, Edit, Plus, Trash2, Clock, Calendar, User } from "lucide-react";
import API_BASE_URL from "../js/urlHelper";
import banner from '../img/local.jpeg';
import jwtUtils from "../utilities/jwtUtils";
import Navbar from "../components/home/NavBar";
import imgperfil from '../img/defualtpefil.jpg';

const PerfilDoctorSeleccionado = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [profileData, setProfileData] = useState({
    nombre: "",
    email: "",
    foto_perfil: "",
    especialidad: "",
    experiencia: "",
    educacion: [],
    idiomas: [],
    nacimiento: "",
    edad: "",
    cantidadIdiomas: 0,
  });
  const [error, setError] = useState("");

  // Obtener el idDoctor de la URL
  const { idDoctor } = useParams();

  useEffect(() => {
    fetchProfileData();
  }, [idDoctor]); // Agrega idDoctor como dependencia

  const fetchProfileData = async () => {
    const token = jwtUtils.getTokenFromCookie(); // Obtener el token del usuario logueado
    try {
      setIsLoading(true);
      // Usar el idDoctor de la URL en la solicitud
      const response = await fetch(`${API_BASE_URL}/api/perfildoctor/${idDoctor}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        throw new Error("Error al cargar el perfil");
      }
      const data = await response.json();
      setProfileData(data);
    } catch (error) {
      setError("Error al cargar el perfil");
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
      <Navbar />
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
        <div className="absolute -bottom-20 left-1/2 -translate-x-1/2 z-10"> {/* Añadimos z-10 para asegurar que esté delante */}
          <div className="relative group">
            <div className="h-40 w-40 rounded-full border-4 border-white bg-white shadow-xl overflow-hidden">
              {isLoading ? (
                <div className="animate-pulse bg-gray-300 h-full w-full rounded-full"></div>
              ) : (
                <img
                  src={
                    profileData.foto_perfil
                      ? `${API_BASE_URL}/storage/${profileData.foto_perfil}`
                      : imgperfil}
                  alt="Profile"
                  className="h-full w-full object-cover"
                />
              )}
            </div>
          </div>
        </div>
      </div>

            {/* Nombre y Especialidad */}
            <div className="mt-24 text-center">
        <h1 className="text-3xl font-bold text-gray-900">
          {profileData.nombre}
        </h1>
        <p className="text-lg text-green-600 font-medium mt-2">
          {profileData.especialidad}
        </p>
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
                  <p className="text-xl font-bold text-green-600">
                    {profileData.nacimiento
                      ? new Date(profileData.nacimiento).toLocaleDateString()
                      : "No especificado"}
                  </p>
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
                  <p className="text-3xl font-bold text-green-600">{profileData.experiencia} años</p>
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
              </div>
              <div className="mt-4 space-y-4">
                {profileData.educacion.map((edu, index) => (
                  <div key={index} className="border-l-2 border-green-200 pl-4">
                    <h3 className="text-sm font-medium text-gray-900">{edu.titulo}</h3>
                    <p className="text-sm text-gray-500">{edu.institucion}</p>
                    <p className="text-xs text-green-700">{edu.anio}</p>
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
                <ul className="space-y-2">
                  {profileData.idiomas.map((idioma, index) => (
                    <li key={index} className="text-sm text-gray-900 flex items-center gap-2">
                      <Languages className="h-4 w-4 text-green-700" />
                      {idioma}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PerfilDoctorSeleccionado;