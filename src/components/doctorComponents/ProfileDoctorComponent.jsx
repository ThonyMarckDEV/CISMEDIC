import { useState, useEffect } from "react";
import { User, Award, BookOpen, Building, Globe, Clock, Upload, Save } from "lucide-react";
import API_BASE_URL from "../../js/urlHelper";
import jwtUtils from "../../utilities/jwtUtils";

const PerfilDoctorComponent = () => {
  const [perfil, setPerfil] = useState({
    anos_experiencia: "",
    formacion: "",
    especialidades: "",
    lugares_trabajo: "",
    logros: "",
    idiomas: "",
    foto_perfil: "",
    tarifa_consulta: ""
  });
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(false);

  const token = jwtUtils.getTokenFromCookie();
  const userId = jwtUtils.getIdUsuario(token);


  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/doctors/profile/${userId}`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Error al cargar el perfil");
        }

        const data = await response.json();
        setPerfil(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [userId, token]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPerfil((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_BASE_URL}/doctors/profile/${userId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(perfil),
      });

      if (!response.ok) {
        throw new Error("Error al actualizar el perfil");
      }

      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
      setEditing(false);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto p-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-green-700 mb-2">Perfil Profesional</h1>
            <p className="text-gray-600">Gestiona tu información profesional y presencia online</p>
          </div>
          <button
            onClick={() => setEditing(!editing)}
            className="border-2 border-green-700 text-green-700 hover:bg-green-50 px-6 py-3 rounded-lg font-semibold transition-all duration-300 shadow-sm hover:shadow-md"
          >
            {editing ? "Cancelar" : "Editar Perfil"}
          </button>
        </div>

        {success && (
          <div className="bg-green-50 border-l-4 border-green-700 text-green-700 p-6 rounded-lg shadow-md mb-8 animate-fade-in">
            ✨ Perfil actualizado exitosamente
          </div>
        )}

        <div className="bg-white rounded-2xl shadow-xl p-8 transition-all duration-300">
          <div className="flex flex-col lg:flex-row gap-12">
            <div className="lg:w-1/3">
              <div className="aspect-square rounded-2xl bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center overflow-hidden shadow-inner border-2 border-gray-100">
                {perfil.foto_perfil ? (
                  <img
                    src={perfil.foto_perfil}
                    alt="Foto de perfil"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User className="h-32 w-32 text-gray-400" />
                )}
              </div>
              {editing && (
                <button className="w-full mt-6 bg-gradient-to-r from-green-600 to-green-700 text-white px-6 py-3 rounded-xl hover:from-green-700 hover:to-green-800 transition-all duration-300 shadow-md hover:shadow-lg font-medium">
                  <Upload className="mr-2 h-5 w-5 inline-block" />
                  Subir Foto
                </button>
              )}
            </div>

            <form onSubmit={handleSubmit} className="lg:w-2/3 space-y-6">
              <div className={`grid grid-cols-1 md:grid-cols-2 gap-6 ${loading ? 'opacity-50' : ''}`}>
                <div className="p-6 rounded-xl">
                  <label className="text-sm font-medium text-gray-700 block mb-2">Años de Experiencia</label>
                  <div className="flex items-center">
                    <Award className="h-6 w-6 text-green-700 mr-3" />
                    <input
                      name="anos_experiencia"
                      value={perfil.anos_experiencia}
                      onChange={handleInputChange}
                      disabled={!editing || loading}
                      className="border-2 border-green-200 focus:ring-green-500 focus:border-green-500 block w-full px-4 py-3 rounded-lg shadow-sm"
                      placeholder="Ej: 15"
                    />
                  </div>
                </div>

              </div>

              <div className="p-6 rounded-xl">
                <label className="text-sm font-medium text-gray-700 block mb-2">Formación Académica</label>
                <div className="flex items-start">
                  <BookOpen className="h-6 w-6 text-green-700 mr-3 mt-2" />
                  <textarea
                    name="formacion"
                    value={perfil.formacion}
                    onChange={handleInputChange}
                    disabled={!editing || loading}
                    className="border-2 border-green-200 focus:ring-green-500 focus:border-green-500 block w-full px-4 py-3 rounded-lg shadow-sm"
                    rows={4}
                    placeholder="Detalla tu formación académica..."
                  />
                </div>
              </div>

              <div className="p-6 rounded-xl">
                <label className="text-sm font-medium text-gray-700 block mb-2">Especialidad</label>
                <textarea
                  name="especialidades"
                  value={perfil.especialidades}
                  onChange={handleInputChange}
                  disabled={!editing || loading}
                  className="border-2 border-green-200 focus:ring-green-500 focus:border-green-500 block w-full px-4 py-3 rounded-lg shadow-sm"
                  rows={3}
                  placeholder="Lista tus especialidades..."
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-6 rounded-xl">
                  <label className="text-sm font-medium text-gray-700 block mb-2">Idiomas</label>
                  <div className="flex items-center">
                    <Globe className="h-6 w-6 text-green-700 mr-3" />
                    <input
                      name="idiomas"
                      value={perfil.idiomas}
                      onChange={handleInputChange}
                      disabled={!editing || loading}
                      className="border-2 border-green-200 focus:ring-green-500 focus:border-green-500 block w-full px-4 py-3 rounded-lg shadow-sm"
                      placeholder="Ej: Español, Inglés"
                    />
                  </div>
                </div>
              </div>

              {editing && (
                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-green-600 to-green-700 text-white px-6 py-4 rounded-xl hover:from-green-700 hover:to-green-800 transition-all duration-300 shadow-md hover:shadow-lg font-medium mt-8"
                  disabled={loading}
                >
                  <Save className="mr-2 h-5 w-5 inline-block" />
                  Guardar Cambios
                </button>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PerfilDoctorComponent;