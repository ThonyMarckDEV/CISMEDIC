import React from 'react';
import { Plus, Trash2 } from 'lucide-react';

const DoctorList = ({ 
  doctors, 
  currentPage, 
  itemsPerPage = 6,
  onAssignSpecialty, 
  onRemoveSpecialty,
  onPageChange 
}) => {
  // Calculate pagination indexes
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedDoctors = doctors.slice(startIndex, endIndex);
  const totalPages = Math.ceil(doctors.length / itemsPerPage);

  return (
    <div className="bg-white rounded-lg shadow-md">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
        {paginatedDoctors.map((doctor) => (
          <div key={doctor.idUsuario} className="border rounded-lg p-4 hover:shadow-lg transition-shadow">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-semibold text-lg">{`${doctor.nombres} ${doctor.apellidos}`}</h3>
                <div className="mt-2">
                  {doctor.especialidades && doctor.especialidades.map((esp) => (
                    <div key={esp.idEspecialidad} className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                      <span>{esp.nombre}</span>
                      <button
                        onClick={() => onRemoveSpecialty(doctor.idUsuario, esp.idEspecialidad)}
                        className="p-1 text-red-600 hover:bg-red-50 rounded-full"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
              <button
                onClick={() => onAssignSpecialty(doctor)}
                className="p-2 text-green-600 hover:bg-blue-50 rounded-full"
              >
                <Plus size={20} />
              </button>
            </div>
          </div>
        ))}
      </div>
      {totalPages > 1 && (
        <div className="flex justify-center gap-2 pb-6">
          {[...Array(totalPages)].map((_, index) => (
            <button
              key={index + 1}
              onClick={() => onPageChange(index + 1)}
              className={`px-3 py-1 rounded ${
                currentPage === index + 1
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-200 hover:bg-gray-300'
              }`}
            >
              {index + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default DoctorList;