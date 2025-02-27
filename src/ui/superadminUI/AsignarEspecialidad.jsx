import React, { useState, useEffect } from 'react';
import { Search, X } from 'lucide-react';
import SidebarSuperAdmin from "../../components/superAdminComponents/SidebarSuperAdmin";
import API_BASE_URL from "../../js/urlHelper";
import jwtUtils from '../../utilities/jwtUtils';
import DoctorList from '../../components/superAdminComponents/DoctorList';
import LoaderScreen from '../../components/home/LoadingScreen';
import SweetAlert from "../../components/SweetAlert";
import WelcomeHeader from '../../components/WelcomeHeader';

const AsignarEspecialidadDoctor = () => {
  const [doctors, setDoctors] = useState([]);
  const [specialties, setSpecialties] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState('');
  const [isAssigning, setIsAssigning] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [pendingRemoval, setPendingRemoval] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasExistingSpecialty, setHasExistingSpecialty] = useState(false); // Nuevo estado
  const token = jwtUtils.getTokenFromCookie();
  const [isLoading, setIsLoading] = useState(false);
  const getAuthHeaders = () => ({
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  });

  useEffect(() => {
    fetchDoctors();
    fetchSpecialties();
  }, [searchTerm, selectedSpecialty]);

  const fetchDoctors = async () => {
    try {
      const params = new URLSearchParams();
      if (searchTerm) params.append('search', searchTerm);
      if (selectedSpecialty) params.append('specialty', selectedSpecialty);
      
      const response = await fetch(
        `${API_BASE_URL}/api/listarDoctores?${params.toString()}`,
        { headers: getAuthHeaders() }
      );
      const data = await response.json();
      setDoctors(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching doctors:', error);
      setLoading(false);
    }
  };

  const fetchSpecialties = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/especialidades`, {
        headers: getAuthHeaders()
      });
      const data = await response.json();
      setSpecialties(data);
    } catch (error) {
      console.error('Error fetching specialties:', error);
    }
  };

  const handleAssignSpecialty = async (doctorId, specialtyId) => {
    try {
      setIsLoading(true);
      const response = await fetch(`${API_BASE_URL}/api/asignarespecialidad`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          idUsuario: doctorId,
          idEspecialidad: specialtyId
        })
      });

      if (response.ok) {
        fetchDoctors();
        setIsAssigning(false);
        setSelectedDoctor(null);
        setHasExistingSpecialty(false); // Reiniciar el estado
        SweetAlert.showMessageAlert("Exito","Especialidad asignada correctamente", "success");
      } else {
        const error = await response.json();
        alert(error.error || 'Error al asignar especialidad');
        SweetAlert.showMessageAlert("Error","Error al asignar especialidad", "error");
      }
    } catch (error) {
      console.error('Error assigning specialty:', error);
      SweetAlert.showMessageAlert("Error","Error al asignar especialidad", "error");
    }finally{
      setIsLoading(false);
    }
  };

  const initiateRemoveSpecialty = (doctorId, specialtyId) => {
    setPendingRemoval({ doctorId, specialtyId });
    setShowConfirmDialog(true);
  };

  const handleRemoveSpecialty = async () => {
    if (!pendingRemoval) return;
    
    try {
      setIsLoading(true);
      const response = await fetch(`${API_BASE_URL}/api/removerespecialidad`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          idUsuario: pendingRemoval.doctorId,
          idEspecialidad: pendingRemoval.specialtyId
        })
      });

      if (response.ok) {
        fetchDoctors();
        SweetAlert.showMessageAlert("Exito","Especialidad eliminada correctamente", "success");
      } else {
        const error = await response.json();
        SweetAlert.showMessageAlert("Error","Error al eliminar especialidad", "error");
      }
    } catch (error) {
      console.error('Error removing specialty:', error);
      SweetAlert.showMessageAlert("Error","Error al eliminar especialidad", "error");
    } finally {
      setShowConfirmDialog(false);
      setPendingRemoval(null);
      setIsLoading(false);
    }
  };

  const handleAssignButtonClick = (doctor) => {
    setSelectedDoctor(doctor);
    setIsAssigning(true);

    // Verificar si el doctor ya tiene una especialidad asignada
    const hasSpecialty = doctor.especialidades && doctor.especialidades.length > 0;
    setHasExistingSpecialty(hasSpecialty); // Actualizar el estado
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <SidebarSuperAdmin>
      <div className="p-6 md:-ml-64">

        <WelcomeHeader 
          customMessage="Asigne o elimine especialidades de los doctores del sistema."
        />

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Buscar doctor por nombre o apellido..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 pl-10 border rounded-lg focus:ring-2 focus:ring-blue-500"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            </div>
            <select
              value={selectedSpecialty}
              onChange={(e) => setSelectedSpecialty(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Todas las especialidades</option>
              {specialties.map((specialty) => (
                <option key={specialty.idEspecialidad} value={specialty.idEspecialidad}>
                  {specialty.nombre}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Replace doctors list with new component */}
        {loading ? (
          <div className="p-6 text-center">Cargando...</div>
        ) : (
          <DoctorList
            doctors={doctors}
            currentPage={currentPage}
            onPageChange={handlePageChange}
            onAssignSpecialty={handleAssignButtonClick}
            onRemoveSpecialty={initiateRemoveSpecialty}
          />
        )}

        {/* Assignment Modal */}
        {isAssigning && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Asignar Especialidad</h3>
                <button
                  onClick={() => setIsAssigning(false)}
                  className="p-2 hover:bg-gray-100 rounded-full"
                >
                  <X size={20} />
                </button>
              </div>
              <p className="mb-4">
                Seleccione una especialidad para {selectedDoctor?.nombres} {selectedDoctor?.apellidos}
              </p>
              {/* Mensaje de advertencia si ya tiene una especialidad */}
              {hasExistingSpecialty && (
                <p className="text-yellow-600 mb-4">
                  El doctor ya tiene una especialidad asignada. La nueva especialidad reemplazará a la actual.
                </p>
              )}
              <select
                className="w-full px-4 py-2 border rounded-lg mb-4 focus:ring-2 focus:ring-blue-500"
                onChange={(e) => handleAssignSpecialty(selectedDoctor?.idUsuario, e.target.value)}
              >
                <option value="">Seleccionar especialidad</option>
                {specialties.map((specialty) => (
                  <option key={specialty.idEspecialidad} value={specialty.idEspecialidad}>
                    {specialty.nombre}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}

        {/* Confirmation Dialog */}
        {showConfirmDialog && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full">
              <h3 className="text-lg font-semibold mb-4">Confirmar Eliminación</h3>
              <p className="mb-6">¿Está seguro de querer eliminar esta especialidad del doctor?</p>
              <div className="flex justify-end gap-4">
                <button
                  onClick={() => {
                    setShowConfirmDialog(false);
                    setPendingRemoval(null);
                  }}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleRemoveSpecialty}
                  className="px-4 py-2 bg-red-600 text-white hover:bg-red-700 rounded-lg"
                >
                  Eliminar
                </button>
              </div>
            </div>
          </div>
        )}
      {isLoading && <LoaderScreen />}
      </div>
    </SidebarSuperAdmin>
  );
};

export default AsignarEspecialidadDoctor;