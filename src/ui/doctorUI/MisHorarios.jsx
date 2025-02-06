import { useEffect, useState } from "react";
import Sidebar from "../../components/doctorComponents/SidebarDoctor";
import jwtUtils from "../../utilities/jwtUtils";
import API_BASE_URL from "../../js/urlHelper";
import SweetAlert from '../../components/SweetAlert';
import LoadingScreen from '../../components/home/LoadingScreen';
import CalendarioHorarios from '../../components/doctorComponents/CalendarioHorarios'; // Importar el nuevo componente
import Swal from 'sweetalert2';

const MisHorarios = () => {
  const [isLoadingFullScreen, setIsLoadingFullScreen] = useState(false);
  const [nombreUsuario, setNombreUsuario] = useState("");
  const [horarios, setHorarios] = useState([]); // Inicializado como un array vacío
  const [formData, setFormData] = useState({
    idDoctor: "",
    fecha: "",
    hora_inicio: "",
    costo: ""
  });
  const [editMode, setEditMode] = useState(false);
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    const token = jwtUtils.getTokenFromCookie();
    if (token) {
      const nombre = jwtUtils.getNombres(token);
      const idDoctor = jwtUtils.getIdUsuario(token);
      if (nombre) setNombreUsuario(nombre);
      if (idDoctor) {
        setFormData((prev) => ({ ...prev, idDoctor }));
        fetchHorarios(idDoctor);
      }
    }
  }, []);

  const fetchHorarios = async (idDoctor) => {
    setIsLoadingFullScreen(true);
    try {
      const token = jwtUtils.getTokenFromCookie();
      const response = await fetch(`${API_BASE_URL}/api/horarios-doctores/listar/${idDoctor}`, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();

      // Asegurarse de que `data` sea un array
      if (!Array.isArray(data)) {
        throw new Error("La respuesta de la API no es un array.");
      }

      console.log(data); // Verificar la respuesta del backend
      setHorarios(data); // Actualiza el estado con los horarios disponibles
    } catch (error) {
      SweetAlert.showMessageAlert(
        'Error',
        "Error al cargar los horarios: " + error.message,
        'error'
      );
      setHorarios([]); // Asegurarse de que `horarios` sea un array vacío en caso de error
    } finally {
      setIsLoadingFullScreen(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoadingFullScreen(true);
    try {
      const token = jwtUtils.getTokenFromCookie();
      const url = editMode
        ? `${API_BASE_URL}/api/horarios-doctores/actualizar/${editId}`
        : `${API_BASE_URL}/api/horarios-doctores/crear`;
      const method = editMode ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (response.ok) {
        SweetAlert.showMessageAlert(
          'Éxito',
          editMode ? "Horario actualizado" : "Horario agregado",
          'success'
        );
        fetchHorarios(formData.idDoctor);
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

  const handleEdit = (horario) => {
    setFormData({
      idDoctor: horario.idDoctor,
      fecha: horario.fecha,
      hora_inicio: horario.hora_inicio,
      costo: horario.costo,
      estado: horario.estado,
    });
    setEditMode(true);
    setEditId(horario.idHorario);
  };

  const handleDelete = async (idHorario) => {
    const result = await Swal.fire({
      title: '¿Eliminar horario?',
      text: '¿Estás seguro que deseas eliminar este horario? Esta acción no se puede deshacer.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
    });

    if (result.isConfirmed) {
      setIsLoadingFullScreen(true);
      try {
        const token = jwtUtils.getTokenFromCookie();
        const response = await fetch(`${API_BASE_URL}/api/horarios-doctores/eliminar/${idHorario}`, {
          method: "DELETE",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        if (response.ok) {
          SweetAlert.showMessageAlert(
            'Éxito',
            "Horario eliminado",
            'success'
          );
          fetchHorarios(formData.idDoctor);
        } else {
          SweetAlert.showMessageAlert(
            'Error',
            "Error al eliminar el horario",
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
      idDoctor: formData.idDoctor,
      fecha: "",
      hora_inicio: "",
      costo: ""
    });
    setEditMode(false);
    setEditId(null);
  };

  return (
    <Sidebar>
      {isLoadingFullScreen && <LoadingScreen />}
      <div className="flex flex-col p-6 gap-6 md:-ml-64">
        {/* Header */}
        <div className="mb-8 bg-gradient-to-r from-green-600 to-green-900 rounded-3xl shadow-lg overflow-hidden">
          <div className="px-8 py-12 relative">
            <div className="relative z-10">
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
                Bienvenido, {nombreUsuario || "Usuario"}
              </h1>
              <p className="text-violet-100 text-lg">
                Aquí puedes gestionar tus horarios.
              </p>
            </div>
          </div>
        </div>

        {/* Formulario para agregar/editar horarios */}
        <div className="w-full">
          <h2 className="text-2xl font-bold mb-4">Agregar Horario</h2>
          <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="date"
                name="fecha"
                value={formData.fecha}
                onChange={handleChange}
                className="p-2 border rounded"
                required
              />
              <input
                type="time"
                name="hora_inicio"
                value={formData.hora_inicio}
                onChange={handleChange}
                className="p-2 border rounded"
                required
              />
              <input
                type="number"
                name="costo"
                placeholder="Costo"
                value={formData.costo}
                onChange={handleChange}
                className="p-2 border rounded"
                required
              />
            </div>
            <div className="flex gap-4 mt-4">
              <button
                type="submit"
                className="bg-green-700 hover:bg-green-800 text-white px-4 py-2 rounded"
              >
                {editMode ? "Actualizar Horario" : "Agregar Horario"}
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

        {/* Calendario de horarios */}
        <div className="flex-1 p-8 bg-gray-100 overflow-auto">
          <h2 className="text-2xl font-bold mb-4">Calendario de Horarios</h2>
          <CalendarioHorarios
            horarios={horarios}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </div>
      </div>
    </Sidebar>
  );
};

export default MisHorarios;