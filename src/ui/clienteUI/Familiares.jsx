import { useEffect, useState } from "react";
import Sidebar from "../../components/clienteComponents/SidebarCliente";
import jwtUtils from "../../utilities/jwtUtils";
import API_BASE_URL from "../../js/urlHelper";
import SweetAlert from '../../components/SweetAlert';
import LoadingScreen from '../../components/home/LoadingScreen';
import Swal from 'sweetalert2';
import TablaFamiliares from '../../components/clienteComponents/TablaFamiliares';
import WelcomeHeader from '../../components/WelcomeHeader';

const Familiares = () => {
  const [isLoadingFullScreen, setIsLoadingFullScreen] = useState(false);
  const [familiares, setFamiliares] = useState([]);
  const [formData, setFormData] = useState({
    idUsuario: "",
    nombre: "",
    apellidos: "",
    dni: "",
    edad: "",
    sexo: "Masculino",
  });
  const [editMode, setEditMode] = useState(false);
  const [editId, setEditId] = useState(null);
  const [errors, setErrors] = useState({});
  
  useEffect(() => {
    const token = jwtUtils.getTokenFromCookie();
    if (token) {
      const idUsuario = jwtUtils.getIdUsuario(token);
      if (idUsuario) {
        setFormData((prev) => ({ ...prev, idUsuario }));
        fetchFamiliares(idUsuario);
      }
    }
  }, []);

  const canAddMoreFamiliares = () => {
    return familiares.length < 4; // Permitir agregar solo si hay menos de 4 familiares
  };

  const fetchFamiliares = async (idUsuario) => {
    setIsLoadingFullScreen(true);
    try {
      const token = jwtUtils.getTokenFromCookie();
      const response = await fetch(`${API_BASE_URL}/api/familiares/listar/${idUsuario}`,{
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`, // Envía el token en el encabezado
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      setFamiliares(data);
    } catch (error) {
      SweetAlert.showMessageAlert(
        'Error',
        "Error al cargar los familiares",
        'error'
      );
    } finally {
      setIsLoadingFullScreen(false);
    }
  };

  const validate = (name, value) => {
    const newErrors = { ...errors };

    switch (name) {
      case "nombre":
      case "apellidos":
        if (!/^[A-Za-z\s]*$/.test(value)) {
          newErrors[name] = "Este campo solo puede contener letras y espacios.";
        } else {
          delete newErrors[name];
        }
        break;

      case "dni":
        if (!/^\d*$/.test(value)) {
          newErrors.dni = "El DNI solo puede contener números.";
        } else if (value.length > 8) {
          newErrors.dni = "El DNI debe tener máximo 8 dígitos.";
        } else {
          delete newErrors.dni;
        }
        break;

      case "edad":
        if (!/^\d*$/.test(value)) {
          newErrors.edad = "La edad solo puede contener números.";
        } else if (value.length < 2) {
          newErrors.dni = "La edad debe tener máximo 2 dígitos.";
        }else {
          delete newErrors.edad;
        }
        break;

      default:
        break;
    }

    setErrors(newErrors);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Validar el valor antes de actualizar el estado
    validate(name, value);

    // Actualizar el estado solo si pasa la validación
    if (
      (name === "nombre" || name === "apellidos") &&
      /^[A-Za-z\s]*$/.test(value)
    ) {
      setFormData({ ...formData, [name]: value });
    } else if (name === "dni" && /^\d{0,8}$/.test(value)) {
      setFormData({ ...formData, [name]: value });
    } else if (name === "edad" && /^\d{0,2}$/.test(value)) {
      setFormData({ ...formData, [name]: value });
    }
  };


  const handleSubmit = async (e) => {
    e.preventDefault();

    // Verificar el límite de familiares
    if (!canAddMoreFamiliares()) {
        SweetAlert.showMessageAlert(
            'Límite alcanzado',
            'No puedes agregar más de 4 familiares.',
            'warning'
        );
        return;
    }

    setIsLoadingFullScreen(true);
    try {
        const token = jwtUtils.getTokenFromCookie();
        const url = editMode
            ? `${API_BASE_URL}/api/familiares/actualizar/${editId}`
            : `${API_BASE_URL}/api/familiares/crear`;
        const method = editMode ? "PUT" : "POST";

        const response = await fetch(url, {
            method,
            headers: {
                "Authorization": `Bearer ${token}`, // Envía el token en el encabezado
                "Content-Type": "application/json",
            },
            body: JSON.stringify(formData),
        });

        const data = await response.json();
        if (response.ok) {
            SweetAlert.showMessageAlert(
                'Éxito',
                editMode ? "Familiar actualizado" : "Familiar agregado",
                'success'
            );
            fetchFamiliares(formData.idUsuario);
            resetForm();
        } else {
            SweetAlert.showMessageAlert(
                'Error',
                data.message || "Error al procesar la solicitud",
                'error'
            );
        }
    } catch (error) {
        SweetAlert.showMessageAlert(
            'Error',
            "Error en la solicitud",
            'error'
        );
    } finally {
        setIsLoadingFullScreen(false);
    }
};

  const handleEdit = (familiar) => {
    setFormData({
      idUsuario: familiar.idUsuario,
      nombre: familiar.nombre,
      apellidos: familiar.apellidos,
      dni: familiar.dni,
      edad: familiar.edad,
      sexo: familiar.sexo,
    });
    setEditMode(true);
    setEditId(familiar.idFamiliarUsuario); // Usar idFamiliarUsuario
  };

  const handleDelete = async (idFamiliarUsuario) => {
    const result = await Swal.fire({
      title: '¿Eliminar familiar?',
      text: '¿Estás seguro que deseas eliminar este familiar? Esta acción no se puede deshacer.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
    });
  
    // Si el usuario confirma la eliminación
    if (result.isConfirmed) {
      setIsLoadingFullScreen(true);
      try {
        const token = jwtUtils.getTokenFromCookie();
        const response = await fetch(`${API_BASE_URL}/api/familiares/eliminar/${idFamiliarUsuario}`, {
          method: "DELETE",
          headers: {
            "Authorization": `Bearer ${token}`, // Envía el token en el encabezado
            "Content-Type": "application/json",
          },
        });
        if (response.ok) {
          SweetAlert.showMessageAlert(
            'Éxito',
            "Familiar eliminado",
            'success'
          );
          fetchFamiliares(formData.idUsuario); // Recargar la lista de familiares
        } else {
          SweetAlert.showMessageAlert(
            'Error',
            "Error al eliminar el familiar",
            'error'
          );
        }
      } catch (error) {
        SweetAlert.showMessageAlert(
          'Error',
          "Error en la solicitud",
          'error'
        );
      } finally {
        setIsLoadingFullScreen(false);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      idUsuario: formData.idUsuario,
      nombre: "",
      apellidos: "",
      dni: "",
      edad: "",
      sexo: "Masculino",
    });
    setEditMode(false);
    setEditId(null);
  };

  return (
    <Sidebar>
      {isLoadingFullScreen && <LoadingScreen />}
      {/* Main container with max-width and no overflow */}
      <div className="flex flex-col p-6 gap-6 md:-ml-64">

      <WelcomeHeader 
        customMessage="Aqui agrega a tus familiares."
      />

        {/* Form section */}
        <div className="w-full">
        <h2 className="text-2xl font-bold mb-4">Agregar Familiares</h2>
          <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                name="nombre"
                placeholder="Nombre"
                value={formData.nombre}
                onChange={handleChange}
                className="p-2 border rounded"
                required
              />
              <input
                type="text"
                name="apellidos"
                placeholder="Apellidos"
                value={formData.apellidos}
                onChange={handleChange}
                className="p-2 border rounded"
                required
              />
              <input
                type="text"
                name="dni"
                placeholder="DNI"
                value={formData.dni}
                onChange={handleChange}
                className="p-2 border rounded"
                maxLength={8}
                required
              />
              <input
                type="number"
                name="edad"
                placeholder="Edad"
                value={formData.edad}
                onChange={handleChange}
                className="p-2 border rounded"
                required
                maxLength={2}
              />
              <select
                name="sexo"
                value={formData.sexo}
                onChange={handleChange}
                className="p-2 border rounded"
                required
              >
                <option value="Masculino">Masculino</option>
                <option value="Femenino">Femenino</option>
                <option value="Otro">Otro</option>
              </select>
            </div>
            <div className="mt-4 p-3 bg-yellow-100 text-yellow-800 rounded-md border border-yellow-200">
              Solo se permite agregar hasta 4 familiares. Gracias por su comprensión.
            </div>
            <div className="flex gap-4 mt-4">
              <button
                type="submit"
                disabled={!canAddMoreFamiliares()}
                className={`bg-green-700 hover:bg-green-800 text-white px-4 py-2 rounded ${
                  !canAddMoreFamiliares() ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {editMode ? "Actualizar Familiar" : "Agregar Familiar"}
              </button>
              {editMode && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                >
                  Cancelar
                </button>
              )}
            </div>
          </form>
        </div>

        <div className="flex-1 p-8 bg-gray-100 overflow-auto">
          <h2 className="text-2xl font-bold mb-4">Lista de Familiares</h2>
          <div className="overflow-x-auto">
            <TablaFamiliares
                familiares={familiares}
                handleEdit={handleEdit}
                handleDelete={handleDelete}
              />
          </div>
        </div>

      </div>
      
    </Sidebar>
  );
};

export default Familiares;