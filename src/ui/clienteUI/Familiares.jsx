import { useEffect, useState } from "react";
import Sidebar from "../../components/clienteComponents/SidebarCliente";
import jwtUtils from "../../utilities/jwtUtils";
import API_BASE_URL from "../../js/urlHelper";
import SweetAlert from '../../components/SweetAlert';
import LoadingScreen from '../../components/home/LoadingScreen';

const Familiares = () => {
  const [isLoadingFullScreen, setIsLoadingFullScreen] = useState(false);
  const [nombreUsuario, setNombreUsuario] = useState("");
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

  useEffect(() => {
    const token = jwtUtils.getTokenFromCookie();
    if (token) {
      const nombre = jwtUtils.getNombres(token);
      const idUsuario = jwtUtils.getIdUsuario(token);
      if (nombre) setNombreUsuario(nombre);
      if (idUsuario) {
        setFormData((prev) => ({ ...prev, idUsuario }));
        fetchFamiliares(idUsuario);
      }
    }
  }, []);

  const fetchFamiliares = async (idUsuario) => {
    setIsLoadingFullScreen(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/familiares/listar/${idUsuario}`);
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

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoadingFullScreen(true);
    try {
      const url = editMode
        ? `${API_BASE_URL}/api/familiares/actualizar/${editId}`
        : `${API_BASE_URL}/api/familiares/crear`;
      const method = editMode ? "PUT" : "POST";
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
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
    if (window.confirm("¿Estás seguro de eliminar este familiar?")) {
      setIsLoadingFullScreen(true);
      try {
        const response = await fetch(`${API_BASE_URL}/api/familiares/eliminar/${idFamiliarUsuario}`, {
          method: "DELETE",
        });
        if (response.ok) {
          SweetAlert.showMessageAlert(
            'Éxito',
            "Familiar eliminado",
            'success'
          );
          fetchFamiliares(formData.idUsuario);
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
      <div className="flex flex-col p-6 gap-6 md:-ml-64">
        {/* Header */}
        <div className="mb-8 bg-gradient-to-r from-green-600 to-green-900 rounded-3xl shadow-lg overflow-hidden">
          <div className="px-8 py-12 relative">
            <div className="relative z-10">
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
                Bienvenido, {nombreUsuario || "Usuario"}
              </h1>
              <p className="text-violet-100 text-lg">
                Programa tu próxima cita médica con nosotros.
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

        {/* Formulario */}
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
          <button
            type="submit"
            className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            {editMode ? "Actualizar Familiar" : "Agregar Familiar"}
          </button>
        </form>

        {/* Tabla de Familiares */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-bold mb-4">Lista de Familiares</h2>
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-200">
                <th className="p-2 border">Nombre</th>
                <th className="p-2 border">Apellidos</th>
                <th className="p-2 border">DNI</th>
                <th className="p-2 border">Edad</th>
                <th className="p-2 border">Sexo</th>
                <th className="p-2 border">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {familiares.map((familiar) => (
                <tr key={familiar.idFamiliarUsuario} className="border">
                  <td className="p-2 border">{familiar.nombre}</td>
                  <td className="p-2 border">{familiar.apellidos}</td>
                  <td className="p-2 border">{familiar.dni}</td>
                  <td className="p-2 border">{familiar.edad}</td>
                  <td className="p-2 border">{familiar.sexo}</td>
                  <td className="p-2 border">
                    <button
                      onClick={() => handleEdit(familiar)}
                      className="bg-yellow-500 text-white px-2 py-1 rounded mr-2"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleDelete(familiar.idFamiliarUsuario)}
                      className="bg-red-500 text-white px-2 py-1 rounded"
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </Sidebar>
  );
};

export default Familiares;