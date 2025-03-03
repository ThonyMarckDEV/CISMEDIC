import React, { useState, useEffect } from 'react'; 
import { ChevronLeft } from 'lucide-react'; 
import API_BASE_URL from '../../js/urlHelper'; 
import LoaderScreen from '../../components/home/LoadingScreen';  

const Paso1 = ({ onNext }) => {   
  const [dni, setDni] = useState('');   
  const [nacimiento, setNacimiento] = useState('');   
  const [errors, setErrors] = useState({});   
  const [isLoading, setIsLoading] = useState(false);
  const [dniValidated, setDniValidated] = useState(false);
  const [dniCheckTimeout, setDniCheckTimeout] = useState(null);
  
  // Validate DNI when value changes or date of birth changes
  useEffect(() => {
    // Reset validation status when DNI or birth date changes
    if (dniValidated) {
      setDniValidated(false);
    }
    
    // Clear any existing timeout
    if (dniCheckTimeout) {
      clearTimeout(dniCheckTimeout);
    }
    
    // Only proceed with validation if DNI has 8 digits and birth date is set
    if (dni.length === 8 && nacimiento) {
      // Debounce the validation request to avoid too many API calls
      const timeout = setTimeout(() => {
        validateDni();
      }, 500);
      
      setDniCheckTimeout(timeout);
    }
    
    // Cleanup function
    return () => {
      if (dniCheckTimeout) {
        clearTimeout(dniCheckTimeout);
      }
    };
  }, [dni, nacimiento]);
  
  // Function to validate DNI with the API
  const validateDni = async () => {
    try {
      setIsLoading(true);
      setErrors({});
      
      const response = await fetch(`${API_BASE_URL}/api/verificar-dni`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ dni, nacimiento }),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setDniValidated(true);
        // Clear errors
        setErrors({});
      } else {
        setDniValidated(false);
        setErrors(data.errors || { general: data.message || 'Error al verificar el DNI' });
      }
    } catch (err) {
      setDniValidated(false);
      setErrors({ general: 'Error de conexión' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!dniValidated) {
      // If not validated, try to validate first
      await validateDni();
      // If validation successful after this attempt, proceed
      if (dniValidated) {
        proceedToNextStep();
      }
      return;
    }
    
    proceedToNextStep();
  };
  
  const proceedToNextStep = () => {
    // Guardar los datos en localStorage
    localStorage.setItem('dni', dni);
    localStorage.setItem('nacimiento', nacimiento);
    
    onNext(); // Pasar al siguiente paso
  };

  return (
    <div className="max-w-md mx-auto mt-16">
      <a href="/" className="inline-flex items-center text-gray-600 hover:text-gray-800">
        <ChevronLeft className="w-4 h-4 mr-1" />
        Volver
      </a>
      
      <h2 className="text-2xl font-medium mb-8">Ingresa tu documento</h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-gray-600 mb-1">Tipo de documento</label>
            <select className="w-full p-2 border rounded-md text-sm">
              <option>DNI</option>
            </select>
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">N° de documento</label>
            <input
              placeholder="Ej: 11122233"
              className={`w-full p-2 border rounded-md text-sm ${errors.dni ? 'border-red-500' : dniValidated ? 'border-green-500' : ''}`}
              value={dni}
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, ''); // Eliminar caracteres no numéricos
                if (value.length <= 8) { // Limitar a 8 caracteres
                  setDni(value);
                  // Reset validation status when DNI changes
                  if (dniValidated) {
                    setDniValidated(false);
                  }
                }
              }}
              maxLength={8} // Limitar a 8 caracteres
              required
            />
            {errors.dni && <p className="text-red-500 text-sm mt-1">{errors.dni}</p>}
            {dniValidated && <p className="text-green-500 text-sm mt-1">DNI verificado correctamente</p>}
          </div>
        </div>
        
        <div>
          <label className="block text-sm text-gray-600 mb-1">Fecha de nacimiento</label>
          <input
            type="date"
            className={`w-full p-2 border rounded-md text-sm ${errors.nacimiento ? 'border-red-500' : ''}`}
            value={nacimiento}
            onChange={(e) => {
              setNacimiento(e.target.value);
              // Reset validation status when birth date changes
              if (dniValidated) {
                setDniValidated(false);
              }
            }}
            required
          />
          {errors.nacimiento && <p className="text-red-500 text-sm mt-1">{errors.nacimiento}</p>}
        </div>
        
        {errors.general && <p className="text-red-500 text-sm">{errors.general}</p>}
        
        <button
          type="submit"
          disabled={!dniValidated}
          className={`w-full p-3 text-white rounded-md transition-colors ${
            dniValidated 
              ? 'bg-green-700 hover:bg-green-800' 
              : 'bg-gray-400 cursor-not-allowed'
          }`}
        >
          {dniValidated ? 'Continuar' : 'Verificar DNI'}
        </button>
      </form>
      {isLoading && <LoaderScreen />}
    </div>
  ); 
};  

export default Paso1;