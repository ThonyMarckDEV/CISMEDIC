import React, { useEffect, useState } from "react";
import { format, startOfDay, parseISO } from "date-fns"; // Importación correcta de date-fns
import Sidebar from "../../components/doctorComponents/SidebarDoctor";
import jwtUtils from "../../utilities/jwtUtils";
import API_BASE_URL from "../../js/urlHelper";
import SweetAlert from '../../components/SweetAlert';
import LoadingScreen from '../../components/home/LoadingScreen';
import CalendarioHorarios from '../../components/doctorComponents/CalendarioHorarios';
import Swal from 'sweetalert2';

const MisHorarios = () => {
  const [isLoadingFullScreen, setIsLoadingFullScreen] = useState(false);
  const [nombreUsuario, setNombreUsuario] = useState("");
  const [horarios, setHorarios] = useState([]);
  const [formErrors, setFormErrors] = useState({});
  const [formData, setFormData] = useState({
    idDoctor: "",
    fecha: "",
    hora_inicio: "",
    costo: ""
  });
  const [editMode, setEditMode] = useState(false);
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    const initializeComponent = async () => {
      const token = jwtUtils.getTokenFromCookie();
      if (token) {
        const nombre = jwtUtils.getNombres(token);
        const idDoctor = jwtUtils.getIdUsuario(token);
        if (nombre) setNombreUsuario(nombre);
        if (idDoctor) {
          setFormData(prev => ({ ...prev, idDoctor }));
          await fetchHorarios(idDoctor);
        }
      }
    };
    initializeComponent();
  }, []);

  const validateForm = () => {
    const errors = {};
    const currentDate = startOfDay(new Date());
    const selectedDate = startOfDay(parseISO(formData.fecha));

    if (selectedDate < currentDate) {
      errors.fecha = "La fecha no puede ser anterior a hoy";
    }

    if (!formData.hora_inicio) {
      errors.hora_inicio = "La hora es requerida";
    }

    if (!formData.costo || formData.costo <= 0) {
      errors.costo = "El costo debe ser mayor a 0";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const fetchHorarios = async (idDoctor) => {
    setIsLoadingFullScreen(true);
    try {
      const token = jwtUtils.getTokenFromCookie();
      const response = await fetch(`${API_BASE_URL}/api/horarios-doctores/listar/${idDoctor}`, {
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) throw new Error(`Error ${response.status}: ${response.statusText}`);

      const data = await response.json();
      setHorarios(Array.isArray(data) ? data : []);
    } catch (error) {
      SweetAlert.showMessageAlert('Error', "Error al cargar los horarios: " + error.message, 'error');
      setHorarios([]);
    } finally {
      setIsLoadingFullScreen(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Limpiar error cuando se modifica el campo
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoadingFullScreen(true);
    try {
      const token = jwtUtils.getTokenFromCookie();
      const url = editMode
        ? `${API_BASE_URL}/api/horarios-doctores/actualizar/${editId}`
        : `${API_BASE_URL}/api/horarios-doctores/crear`;
      
      // Formatear la hora para que coincida con el formato H:i:s requerido
      const formattedData = {
        ...formData,
        hora_inicio: formData.hora_inicio + ':00'
      };

      const response = await fetch(url, {
        method: editMode ? "PUT" : "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formattedData),
      });

      const data = await response.json();
      
      if (response.ok) {
        SweetAlert.showMessageAlert(
          'Éxito',
          editMode ? "Horario actualizado" : "Horario agregado",
          'success'
        );
        await fetchHorarios(formData.idDoctor);
        resetForm();
      } else {
        throw new Error(data.message || "Error al procesar la solicitud");
      }
    } catch (error) {
      SweetAlert.showMessageAlert('Error', error.message, 'error');
    } finally {
      setIsLoadingFullScreen(false);
    }
  };

  const handleEdit = (horario) => {
    // Formatear la hora para remover los segundos para el input
    const formattedTime = horario.hora_inicio.slice(0, 5);
    
    setFormData({
      idDoctor: horario.idDoctor,
      fecha: horario.fecha,
      hora_inicio: formattedTime,
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
          SweetAlert.showMessageAlert('Éxito', "Horario eliminado", 'success');
          await fetchHorarios(formData.idDoctor);
        } else {
          throw new Error("Error al eliminar el horario");
        }
      } catch (error) {
        SweetAlert.showMessageAlert('Error', error.message, 'error');
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
    setFormErrors({});
    setEditMode(false);
    setEditId(null);
  };

  return (
    <Sidebar>
      {isLoadingFullScreen && <LoadingScreen />}
      <div className="flex flex-col p-6 gap-6 md:-ml-64">
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

        <div className="w-full">
          <h2 className="text-2xl font-bold mb-4">
            {editMode ? "Editar Horario" : "Agregar Horario"}
          </h2>
          <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col">
                <input
                  type="date"
                  name="fecha"
                  value={formData.fecha}
                  onChange={handleChange}
                  className={`p-2 border rounded ${formErrors.fecha ? 'border-red-500' : ''}`}
                  required
                  min={format(new Date(), 'yyyy-MM-dd')}
                />
                {formErrors.fecha && (
                  <span className="text-red-500 text-sm mt-1">{formErrors.fecha}</span>
                )}
              </div>
              
              <div className="flex flex-col">
                <input
                  type="time"
                  name="hora_inicio"
                  value={formData.hora_inicio}
                  onChange={handleChange}
                  className={`p-2 border rounded ${formErrors.hora_inicio ? 'border-red-500' : ''}`}
                  required
                />
                {formErrors.hora_inicio && (
                  <span className="text-red-500 text-sm mt-1">{formErrors.hora_inicio}</span>
                )}
              </div>
              
              <div className="flex flex-col">
                <input
                  type="number"
                  name="costo"
                  placeholder="Costo"
                  value={formData.costo}
                  onChange={handleChange}
                  className={`p-2 border rounded ${formErrors.costo ? 'border-red-500' : ''}`}
                  required
                  min="0"
                  step="0.01"
                />
                {formErrors.costo && (
                  <span className="text-red-500 text-sm mt-1">{formErrors.costo}</span>
                )}
              </div>
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