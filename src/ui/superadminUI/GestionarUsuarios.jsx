import React,  { useEffect, useState } from "react"
import { NotebookTextIcon, FileText, ChevronRight } from "lucide-react"
import SidebarSuperAdmin from "../../components/superAdminComponents/SidebarSuperAdmin"
import jwtUtils from "../../utilities/jwtUtils"
import { Link } from "react-router-dom"; // Importa Link desde react-router-dom
import TablaUsuarios from '../../components/superAdminComponents/TablaUsuarios';
import API_BASE_URL from "../../js/urlHelper"
import LoaderScreen from '../../components/home/LoadingScreen';
import SweetAlert from "../../components/SweetAlert"
import Swal from 'sweetalert2';

const GestionarSUsuarios = () => {
  const [formData, setFormData] = useState({
    nombres: '',
    apellidos: '',
    dni: '',
    correo: '',
    telefono: '',
    password: '',
    rol: 'cliente',
  });
  const [errors, setErrors] = useState({});
  const [users, setUsers] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [nombreUsuario, setNombreUsuario] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const getAuthHeaders = () => {
    const token = jwtUtils.getTokenFromCookie();
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    };
  };

  useEffect(() => {
    fetchUsers();
    const token = jwtUtils.getTokenFromCookie();
    const nombres = jwtUtils.getNombres(token);
    setNombreUsuario(nombres);
  }, []);

  const fetchUsers = async (searchTerm = '') => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/obtenerusuarios?search=${searchTerm}`, {
        headers: getAuthHeaders()
      });
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    // Validación para campos de texto (nombres y apellidos)
    if (name === "nombres" || name === "apellidos") {
      // Expresión regular para permitir solo letras, espacios y tildes
      const regex = /^[A-Za-zÁÉÍÓÚáéíóúñÑ\s]*$/;
      if (regex.test(value)) {
        setFormData({ ...formData, [name]: value });
        setErrors({ ...errors, [name]: "" }); // Limpiar el error si el valor es válido
      } else {
        setErrors({ ...errors, [name]: "Solo se permiten letras y espacios." }); // Mostrar mensaje de error
      }
    }
    // Validación para campos numéricos (dni y teléfono)
    else if (name === "dni" || name === "telefono") {
      // Solo permite números
      const numericValue = value.replace(/\D/g, "");

      // Validar longitud máxima
      let isValid = true;
      if (name === "dni" && numericValue.length > 8) {
        isValid = false;
      } else if (name === "telefono" && numericValue.length > 9) {
        isValid = false;
      }

      // Actualizar el estado de errores
      setErrors((prevErrors) => ({
        ...prevErrors,
        [name]: isValid ? "" : `El ${name} debe tener máximo ${name === "dni" ? 8 : 9} dígitos.`,
      }));

      // Actualizar el estado del formulario solo si es válido
      if (isValid) {
        setFormData({
          ...formData,
          [name]: numericValue,
        });
      }
    }
    // Para otros campos, actualizar sin validación
    else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      const url = editingId 
        ? `${API_BASE_URL}/api/actualizarusuarios/${editingId}` 
        : `${API_BASE_URL}/api/registrousuarios`;
      
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
        nombres: '',
        apellidos: '',
        dni: '',
        correo: '',
        telefono: '',
        password: '',
        rol: 'cliente',
      });
      setEditingId(null);
      setErrors({});
      fetchUsers();
      SweetAlert.showMessageAlert('Éxito', `Usuario ${editingId ? 'actualizado' : 'registrado'} correctamente`, 'success');
    } catch (error) {
      console.error('Error:', error);
    }finally{
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setEditingId(null); // Salir del modo edición
    setFormData({
      nombres: '',
      apellidos: '',
      dni: '',
      correo: '',
      telefono: '',
      password: '',
      rol: 'cliente',
    });
    setErrors({}); // Limpiar errores
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
                Aquí gestionarás tus usuarios.
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
            {editingId ? 'Editar Usuario' : 'Registrar Usuario'}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <input
                  type="text"
                  name="nombres"
                  placeholder="Nombres"
                  value={formData.nombres}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
                {errors.nombres && (
                  <p className="text-red-500 text-sm mt-1">{errors.nombres}</p>
                )}
              </div>

              <div>
                <input
                  type="text"
                  name="apellidos"
                  placeholder="Apellidos"
                  value={formData.apellidos}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
                {errors.apellidos && (
                  <p className="text-red-500 text-sm mt-1">{errors.apellidos}</p>
                )}
              </div>


              <div>
                <input
                  type="text"
                  name="dni"
                  placeholder="DNI"
                  maxLength={8}
                  value={formData.dni}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
                {errors.dni && (
                  <p className="text-red-500 text-sm mt-1">{errors.dni}</p>
                )}
              </div>

              <div>
                <input
                  type="email"
                  name="correo"
                  placeholder="Correo electrónico"
                  value={formData.correo}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
                {errors.correo && (
                  <p className="text-red-500 text-sm mt-1">{errors.correo}</p>
                )}
              </div>

              <div>
                <input
                  type="text"
                  name="telefono"
                  placeholder="Teléfono"
                  maxLength={9}
                  value={formData.telefono}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
                {errors.telefono && (
                  <p className="text-red-500 text-sm mt-1">{errors.telefono}</p>
                )}
              </div>

              <div>
                <select
                  name="rol"
                  value={formData.rol}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="cliente">Cliente</option>
                  <option value="doctor">Doctor</option>
                  <option value="admin">Admin</option>
                </select>
              </div>

              {!editingId && (
                <div>
                  <input
                    type="password"
                    name="password"
                    placeholder="Contraseña"
                    value={formData.password}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                  {errors.password && (
                    <p className="text-red-500 text-sm mt-1">{errors.password}</p>
                  )}
                </div>
              )}
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
        <TablaUsuarios 
          users={users} 
          onEdit={(user) => {
            setEditingId(user.idUsuario);
            setFormData({
              nombres: user.nombres,
              apellidos: user.apellidos,
              dni: user.dni,
              correo: user.correo,
              telefono: user.telefono || '',
              rol: user.rol,
            });
          }}
          onDelete={async (id) => {
            // Mostrar SweetAlert2 para confirmar la eliminación
            const result = await Swal.fire({
              title: '¿Está seguro?',
              text: "¡No podrás revertir esto!",
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
                const response = await fetch(`${API_BASE_URL}/api/eliminarusuarios/${id}`, {
                  method: 'DELETE',
                  headers: getAuthHeaders(),
                });

                if (response.ok) {
                  // Mostrar mensaje de éxito
                  Swal.fire(
                    '¡Eliminado!',
                    'El usuario ha sido eliminado.',
                    'success'
                  );
                  // Recargar la lista de usuarios
                  fetchUsers();
                } else {
                  // Mostrar mensaje de error si la respuesta no es exitosa
                  Swal.fire(
                    'Error',
                    'No se pudo eliminar el usuario.',
                    'error'
                  );
                }
              } catch (error) {
                console.error('Error deleting user:', error);
                // Mostrar mensaje de error en caso de excepción
                Swal.fire(
                  'Error',
                  'Hubo un problema al eliminar el usuario.',
                  'error'
                );
              }
            }
          }}
        />
      </div>
      {isLoading && <LoaderScreen />}
    </SidebarSuperAdmin>
  );
};

export default GestionarSUsuarios;