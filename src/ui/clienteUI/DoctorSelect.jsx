import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';
import defaultImage from '../../img/defualtpefil.jpg'; // Importa la imagen predeterminada

const DoctorSelect = ({ 
  doctors, 
  value, 
  onChange, 
  disabled = false,
  apiBaseUrl 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const selectedDoc = doctors.find(doc => doc.idUsuario.toString() === value);
    setSelectedDoctor(selectedDoc);
  }, [value, doctors]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (doctor) => {
    onChange(doctor);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        className={`w-full flex items-center justify-between p-3 border rounded-lg text-left transition-all ${
          disabled
            ? 'bg-gray-100 cursor-not-allowed'
            : 'hover:border-green-600 focus:ring-2 focus:ring-green-600 focus:border-transparent'
        } ${isOpen ? 'border-green-600' : 'border-gray-300'}`}
      >
        {selectedDoctor ? (
          <div className="flex items-center space-x-3">
            <img
              src={selectedDoctor.perfil ? `${apiBaseUrl}/backend/storage/app/public/${selectedDoctor.perfil}` : defaultImage}
              alt={`Dr. ${selectedDoctor.nombres}`}
              className="w-10 h-10 rounded-full object-cover"
            />
            <span className="text-gray-700">
              Dr(a). {selectedDoctor.nombres} {selectedDoctor.apellidos}
            </span>
          </div>
        ) : (
          <span className="text-gray-500">Seleccione un doctor</span>
        )}
        <ChevronDown 
          className={`w-5 h-5 text-gray-400 transition-transform ${
            isOpen ? 'transform rotate-180' : ''
          }`}
        />
      </button>
      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-auto">
          {doctors.map((doctor) => (
            <button
              key={doctor.idUsuario}
              type="button"
              onClick={() => handleSelect(doctor)}
              className="w-full flex items-center space-x-3 p-3 hover:bg-gray-50 transition-colors"
            >
              <img
                src={doctor.perfil ? `${apiBaseUrl}/backend/storage/app/public/${doctor.perfil}` : defaultImage}
                alt={`Dr. ${doctor.nombres}`}
                className="w-10 h-10 rounded-full object-cover"
              />
              <span className="flex-grow text-left text-gray-700">
                Dr(a). {doctor.nombres} {doctor.apellidos}
              </span>
              {value === doctor.idUsuario.toString() && (
                <Check className="w-5 h-5 text-green-600" />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default DoctorSelect;