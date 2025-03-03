import React, { useEffect, useState } from "react"
import SidebarSuperAdmin from "../../components/superAdminComponents/SidebarSuperAdmin"
import jwtUtils from "../../utilities/jwtUtils"
import TablaUsuarios from '../../components/superAdminComponents/TablaUsuarios'
import API_BASE_URL from "../../js/urlHelper"
import LoaderScreen from '../../components/home/LoadingScreen'
import SweetAlert from "../../components/SweetAlert"
import Swal from 'sweetalert2'
import WelcomeHeader from '../../components/WelcomeHeader';

const GestionarUsuarios = () => {
  const [formData, setFormData] = useState({
    nombres: '',
    apellidos: '',
    dni: '',
    correo: '',
    telefono: '',
    password: '',
    newPassword: '', // Nuevo campo para la contraseña en edición
    rol: 'cliente',
  });
  const [errors, setErrors] = useState({});
  const [users, setUsers] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [dniValidated, setDniValidated] = useState(false);
  const [dniCheckTimeout, setDniCheckTimeout] = useState(null);
  const [isValidatingDni, setIsValidatingDni] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  // Efecto para validar DNI cuando cambia
  useEffect(() => {
    // Si estamos editando, no validamos el DNI automáticamente
    if (editingId) return;
    
    // Limpiar el timeout previo si existe
    if (dniCheckTimeout) {
      clearTimeout(dniCheckTimeout);
    }
    
    // Resetear validación cuando cambia el DNI
    if (dniValidated && formData.dni.length !== 8) {
      setDniValidated(false);
    }
    
    // Validar DNI cuando tiene 8 dígitos
    if (formData.dni.length === 8) {
      const timeout = setTimeout(() => {
        validateDni();
      }, 500);
      setDniCheckTimeout(timeout);
    }
    
    return () => {
      if (dniCheckTimeout) {
        clearTimeout(dniCheckTimeout);
      }
    };
  }, [formData.dni]);

  const fetchUsers = async (searchTerm = '') => {
    try {
      const token = jwtUtils.getTokenFromCookie();
      const response = await fetch(`${API_BASE_URL}/api/obtenerusuarios?search=${searchTerm}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const validateDni = async () => {
    if (formData.dni.length !== 8 || isValidatingDni) return;
    
    try {
      setIsValidatingDni(true);
      const token = jwtUtils.getTokenFromCookie();
      const response = await fetch(`${API_BASE_URL}/api/verificar-dni-solo`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ dni: formData.dni }),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setDniValidated(true);
        // Si hay datos de la persona, podríamos autocompletar algunos campos
        if (data.data && data.data.nombres) {
          // Separar nombres y apellidos (esto depende del formato que devuelva la API)
          const fullName = data.data.nombres.trim();
          // Esta lógica puede necesitar ajustes según el formato exacto de la API
          const parts = fullName.split(' ');
          if (parts.length >= 3) {
            // Asumimos que el último es apellido materno, el penúltimo es apellido paterno
            // y el resto son nombres
            const apellidoMaterno = parts.pop();
            const apellidoPaterno = parts.pop();
            const nombres = parts.join(' ');
            
            // Solo sugerimos si los campos están vacíos
            if (!formData.nombres) {
              setFormData(prev => ({
                ...prev,
                nombres: nombres
              }));
            }
            
            if (!formData.apellidos) {
              setFormData(prev => ({
                ...prev,
                apellidos: `${apellidoPaterno} ${apellidoMaterno}`
              }));
            }
          }
        }
        
        // Limpiar errores relacionados con el DNI
        setErrors(prev => ({
          ...prev,
          dni: ''
        }));
        
      } else {
        setDniValidated(false);
        // Mostrar error específico
        setErrors(prev => ({
          ...prev,
          dni: data.errors?.dni || 'Error al verificar el DNI'
        }));
      }
    } catch (error) {
      console.error('Error validando DNI:', error);
      setDniValidated(false);
      setErrors(prev => ({
        ...prev,
        dni: 'Error de conexión al validar el DNI'
      }));
    } finally {
      setIsValidatingDni(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name === "nombres" || name === "apellidos") {
      const regex = /^[A-Za-zÁÉÍÓÚáéíóúñÑ\s]*$/;
      if (regex.test(value)) {
        setFormData({ ...formData, [name]: value });
        setErrors({ ...errors, [name]: "" });
      } else {
        setErrors({ ...errors, [name]: "Solo se permiten letras y espacios." });
      }
    }
    else if (name === "dni" || name === "telefono") {
      const numericValue = value.replace(/\D/g, "");
      let isValid = true;
      let maxLength = name === "dni" ? 8 : 9;
      
      if (numericValue.length > maxLength) {
        isValid = false;
      }

      setErrors((prevErrors) => ({
        ...prevErrors,
        [name]: isValid ? "" : `El ${name} debe tener máximo ${maxLength} dígitos.`,
      }));

      if (isValid) {
        // Si cambia el DNI, reseteamos la validación
        if (name === "dni" && dniValidated) {
          setDniValidated(false);
        }
        
        setFormData({
          ...formData,
          [name]: numericValue,
        });
      }
    }
    else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Si no estamos editando y el DNI no está validado, validarlo primero
    if (!editingId && !dniValidated) {
      await validateDni();
      // Si después de validar aún no es válido, detener el envío
      if (!dniValidated) {
        return;
      }
    }
    
    try {
      const token = jwtUtils.getTokenFromCookie();
      setIsLoading(true);
      const url = editingId 
        ? `${API_BASE_URL}/api/actualizarusuarios/${editingId}` 
        : `${API_BASE_URL}/api/registrousuarios`;
      
      const method = editingId ? 'PUT' : 'POST';
      
      // Crear una copia del formData para enviar
      const dataToSend = { ...formData };
      
      // Si estamos editando y hay una nueva contraseña, la incluimos
      if (editingId) {
        if (formData.newPassword) {
          dataToSend.password = formData.newPassword;
        }
        // Si no hay nueva contraseña, eliminamos el campo para no enviarlo
        delete dataToSend.newPassword;
      }
      
      const response = await fetch(url, {
        method,
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dataToSend),
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
        newPassword: '',
        rol: 'cliente',
      });
      setEditingId(null);
      setErrors({});
      setDniValidated(false);
      fetchUsers();
      SweetAlert.showMessageAlert('Éxito', `Usuario ${editingId ? 'actualizado' : 'registrado'} correctamente`, 'success');
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setFormData({
      nombres: '',
      apellidos: '',
      dni: '',
      correo: '',
      telefono: '',
      password: '',
      newPassword: '',
      rol: 'cliente',
    });
    setErrors({});
    setDniValidated(false);
  };

  return (
    <SidebarSuperAdmin>
      <div className="flex flex-col p-6 gap-6 md:-ml-64">
        <WelcomeHeader 
          customMessage="Aquí gestionarás tus usuarios."
        />

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
                <div className="relative">
                  <input
                    type="text"
                    name="dni"
                    placeholder="DNI"
                    maxLength={8}
                    value={formData.dni}
                    onChange={handleInputChange}
                    onBlur={() => {
                      if (formData.dni.length === 8 && !dniValidated && !editingId) {
                        validateDni();
                      }
                    }}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                      dniValidated ? 'border-green-500' : errors.dni ? 'border-red-500' : ''
                    }`}
                  />
                  {isValidatingDni && (
                    <div className="absolute right-3 top-2">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-green-700"></div>
                    </div>
                  )}
                  {dniValidated && !isValidatingDni && (
                    <div className="absolute right-3 top-2">
                      <svg className="h-5 w-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  )}
                </div>
                {errors.dni && (
                  <p className="text-red-500 text-sm mt-1">{errors.dni}</p>
                )}
                {dniValidated && (
                  <p className="text-green-500 text-sm mt-1">DNI verificado correctamente</p>
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
              
              {editingId ? (
                <div>
                  <input
                    type="password"
                    name="newPassword"
                    placeholder="Nueva contraseña (opcional)"
                    value={formData.newPassword}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                  {errors.password && (
                    <p className="text-red-500 text-sm mt-1">{errors.password}</p>
                  )}
                </div>
              ) : (
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
                className={`w-full md:w-auto px-6 py-2 rounded-lg transition-colors ${
                  !editingId && !dniValidated
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-green-600 hover:bg-green-700 text-white'
                }`}
                disabled={!editingId && !dniValidated}
              >
                {editingId ? 'Actualizar' : dniValidated ? 'Registrar' : 'Verifica el DNI primero'}
              </button>
              
              {!editingId && !dniValidated && formData.dni.length === 8 && (
                <button
                  type="button"
                  onClick={validateDni}
                  className="w-full md:w-auto px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  disabled={isValidatingDni}
                >
                  {isValidatingDni ? 'Verificando...' : 'Verificar DNI'}
                </button>
              )}
              
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
            // En edición, asumimos que el DNI ya está validado
            setDniValidated(true);
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
                const token = jwtUtils.getTokenFromCookie();
                const response = await fetch(`${API_BASE_URL}/api/eliminarusuarios/${id}`, {
                  method: 'DELETE',
                  headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                  },
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
          onSearch={(term) => fetchUsers(term)}
        />
      </div>
      {isLoading && <LoaderScreen />}
    </SidebarSuperAdmin>
  );
};

export default GestionarUsuarios;