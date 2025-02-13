import React, { useEffect, useState } from "react";
import { NotebookTextIcon, FileText, ChevronRight } from "lucide-react";
import SidebarSuperAdmin from "../../components/superAdminComponents/SidebarSuperAdmin";
import jwtUtils from "../../utilities/jwtUtils";
import { Link } from "react-router-dom";
import TablaEspecialidades from '../../components/superAdminComponents/TablaEspecialidades';
import API_BASE_URL from "../../js/urlHelper";
import EmojiPicker from 'emoji-picker-react';
import LoaderScreen from '../../components/home/LoadingScreen';
import Swal from 'sweetalert2';
import SweetAlert from "../../components/SweetAlert";

const GestionarEspecialidades = () => {
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    icono: '', // Este campo almacenará el emoji seleccionado
  });
  const [errors, setErrors] = useState({});
  const [especialidades, setEspecialidades] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [nombreUsuario, setNombreUsuario] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [charCount, setCharCount] = useState(0); // Estado para el contador de caracteres
  const maxCharLimit = 100; // Límite máximo de caracteres para la descripción
  const [isLoading, setIsLoading] = useState(false);

  const getAuthHeaders = () => {
    const token = jwtUtils.getTokenFromCookie();
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    };
  };

  // Mover fetchEspecialidades fuera del useEffect
  const fetchEspecialidades = async (searchTerm = '') => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/obtenerespecialidades?search=${searchTerm}`, {
        headers: getAuthHeaders(),
      });
      const data = await response.json();
      setEspecialidades(data);
    } catch (error) {
      console.error('Error fetching especialidades:', error);
    }
  };

  useEffect(() => {
    // Crear un AbortController para cancelar la solicitud si el componente se desmonta
    const abortController = new AbortController();

    const fetchData = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/obtenerespecialidades`, {
          headers: getAuthHeaders(),
          signal: abortController.signal, // Pasar la señal de aborto
        });
        const data = await response.json();
        setEspecialidades(data);
      } catch (error) {
        if (error.name !== 'AbortError') {
          console.error('Error fetching especialidades:', error);
        }
      }
    };

    fetchData();

    const token = jwtUtils.getTokenFromCookie();
    const nombres = jwtUtils.getNombres(token);
    setNombreUsuario(nombres);

    // Cleanup function para cancelar la solicitud si el componente se desmonta
    return () => {
      abortController.abort(); // Cancelar la solicitud
    };
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    // Validación para el campo "nombre"
    if (name === "nombre") {
      // Expresión regular para permitir solo letras, espacios y tildes
      const regex = /^[A-Za-zÁÉÍÓÚáéíóúñÑ\s]*$/;
      if (regex.test(value)) {
        setFormData({ ...formData, [name]: value });
        setErrors({ ...errors, [name]: "" }); // Limpiar el error si el valor es válido
      } else {
        setErrors({ ...errors, [name]: "Solo se permiten letras y espacios." }); // Mostrar mensaje de error
      }
    } else {
      setFormData({ ...formData, [name]: value });
    }

    // Actualizar el contador de caracteres si el campo es "descripcion"
    if (name === "descripcion") {
      setCharCount(value.length);
    }
  };

  const handleEmojiClick = (emojiObject) => {
    setFormData({
      ...formData,
      icono: emojiObject.emoji,
    });
    setShowEmojiPicker(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      const url = editingId 
        ? `${API_BASE_URL}/api/actualizarespecialidad/${editingId}` 
        : `${API_BASE_URL}/api/registrarespecialidad`;
      
      const method = editingId ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: getAuthHeaders(),
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        setErrors(errorData.errors || {});
        return;
      }

      setFormData({
        nombre: '',
        descripcion: '',
        icono: '',
      });
      setEditingId(null);
      setErrors({});
      fetchEspecialidades(); // Llamar a fetchEspecialidades después de guardar o actualizar
      SweetAlert.showMessageAlert('Éxito', `Especialidad ${editingId ? 'actualizada' : 'registrada'} correctamente.`, 'success');
    } catch (error) {
      console.error('Error:', error);
    }finally{
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setFormData({
      nombre: '',
      descripcion: '',
      icono: '',
    });
    setErrors({});
  };

  return (
    <SidebarSuperAdmin>
      <div className="flex flex-col p-6 gap-6 md:-ml-64">
        {/* Header */}
        <div className="mb-8 bg-gradient-to-r from-green-600 to-green-900 rounded-3xl shadow-lg overflow-hidden">
          <div className="px-8 py-12 relative">
            <div className="relative z-10">
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
                Bienvenido, {nombreUsuario || "Usuario"}
              </h1>
              <p className="text-violet-100 text-lg">
                Aquí gestionarás tus especialidades.
              </p>
            </div>
            <div className="absolute right-0 top-0 w-1/3 h-full opacity-10">
              <svg viewBox="0 0 100 100" className="h-full">
                <circle cx="80" cy="20" r="15" fill="white"/>
                <circle cx="20" cy="80" r="25" fill="white"/>
              </svg>
            </div>
          </div>
        </div>

        {/* Form Section */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-2xl font-semibold mb-6">
            {editingId ? 'Editar Especialidad' : 'Registrar Especialidad'}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <input
                  type="text"
                  name="nombre"
                  placeholder="Nombre de la especialidad"
                  value={formData.nombre}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
                {errors.nombre && (
                  <p className="text-red-500 text-sm mt-1">{errors.nombre}</p>
                )}
              </div>

              <div>
                <textarea
                  name="descripcion"
                  placeholder="Descripción"
                  value={formData.descripcion}
                  onChange={handleInputChange}
                  maxLength={maxCharLimit}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
                <div className="text-sm text-gray-500 mt-1">
                  {charCount}/{maxCharLimit} caracteres
                </div>
                {charCount >= maxCharLimit && (
                  <p className="text-red-500 text-sm mt-1">
                    Has alcanzado el límite de caracteres.
                  </p>
                )}
                {errors.descripcion && (
                  <p className="text-red-500 text-sm mt-1">{errors.descripcion}</p>
                )}
              </div>

              <div>
                <div className="relative">
                  <input
                    type="text"
                    name="icono"
                    placeholder="Icono (emoji)"
                    value={formData.icono}
                    onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                    readOnly
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                  {showEmojiPicker && (
                    <div className="absolute z-10">
                      <EmojiPicker onEmojiClick={handleEmojiClick} />
                    </div>
                  )}
                </div>
                {errors.icono && (
                  <p className="text-red-500 text-sm mt-1">{errors.icono}</p>
                )}
              </div>
            </div>

            <div className="flex flex-col md:flex-row gap-4">
              <button
                type="submit"
                className="w-full md:w-auto px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                {editingId ? 'Actualizar' : 'Registrar'}
              </button>
              {editingId && (
                <button
                  type="button"
                  onClick={handleCancel}
                  className="w-full md:w-auto px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  Cancelar
                </button>
              )}
            </div>
          </form>
        </div>

       {/* Table Component */}
        <TablaEspecialidades 
          especialidades={especialidades} 
          onEdit={(especialidad) => {
            setEditingId(especialidad.idEspecialidad);
            setFormData({
              nombre: especialidad.nombre,
              descripcion: especialidad.descripcion,
              icono: especialidad.icono,
            });
            setCharCount(especialidad.descripcion.length); // Actualizar el contador al editar
          }}
          onDelete={async (id) => {
            // Mostrar SweetAlert2 para confirmar la eliminación
            const result = await Swal.fire({
              title: '¿Está seguro?',
              text: "¡No podrás revertir esta acción!",
              icon: 'warning',
              showCancelButton: true,
              confirmButtonColor: '#3085d6',
              cancelButtonColor: '#d33',
              confirmButtonText: 'Sí, eliminar',
              cancelButtonText: 'Cancelar',
            });

            // Si el usuario confirma la eliminación
            if (result.isConfirmed) {
              try {
                const response = await fetch(`${API_BASE_URL}/api/eliminarespecialidad/${id}`, {
                  method: 'DELETE',
                  headers: getAuthHeaders(),
                });

                if (response.ok) {
                  // Mostrar mensaje de éxito
                  Swal.fire(
                    '¡Eliminado!',
                    'La especialidad ha sido eliminada.',
                    'success'
                  );
                  // Recargar la lista de especialidades
                  fetchEspecialidades();
                } else {
                  // Mostrar mensaje de error si la respuesta no es exitosa
                  Swal.fire(
                    'Error',
                    'No se pudo eliminar la especialidad.',
                    'error'
                  );
                }
              } catch (error) {
                console.error('Error deleting especialidad:', error);
                // Mostrar mensaje de error en caso de excepción
                Swal.fire(
                  'Error',
                  'Hubo un problema al eliminar la especialidad.',
                  'error'
                );
              }
            }
          }}
        />
        {isLoading && <LoaderScreen />}
      </div>
    </SidebarSuperAdmin>
  );
};

export default GestionarEspecialidades;