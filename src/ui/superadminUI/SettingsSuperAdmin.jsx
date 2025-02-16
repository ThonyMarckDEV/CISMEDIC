import React, { useState } from "react";
import { Eye, EyeOff, X } from "lucide-react";
import SidebarCliente from "../../components/clienteComponents/SidebarCliente";
import API_BASE_URL from "../../js/urlHelper";
import jwtUtils from "../../utilities/jwtUtils";

const Modal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md relative">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-500 hover:text-gray-700"
        >
          <X size={20} />
        </button>
        {children}
      </div>
    </div>
  );
};

const Settings = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [errors, setErrors] = useState({
    newPassword: "",
    confirmPassword: ""
  });
  const [submitStatus, setSubmitStatus] = useState({ type: "", message: "" });

  const token = jwtUtils.getTokenFromCookie();
  const userId = jwtUtils.getIdUsuario(token);
  const userName = jwtUtils.getNombres(token);

  const validatePassword = () => {
    const newErrors = {
      newPassword: "",
      confirmPassword: ""
    };

    // Validación que coincide exactamente con el backend
    const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>]).+$/;

    if (newPassword.length < 8) {
      newErrors.newPassword = "La contraseña debe tener al menos 8 caracteres";
    } else if (!passwordRegex.test(newPassword)) {
      newErrors.newPassword = "La contraseña debe contener al menos una mayúscula y un símbolo";
    }

    if (confirmPassword && newPassword !== confirmPassword) {
      newErrors.confirmPassword = "Las contraseñas no coinciden";
    }

    setErrors(newErrors);
    return !newErrors.newPassword && !newErrors.confirmPassword;
  };

  const handleChangePassword = async () => {
    setSubmitStatus({ type: "", message: "" });
    
    if (!validatePassword()) {
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/api/cambiar-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          userId,
          newPassword,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setSubmitStatus({
          type: "success",
          message: data.message || "Contraseña cambiada correctamente"
        });
        setNewPassword("");
        setConfirmPassword("");
        setTimeout(() => {
          setIsModalOpen(false);
        }, 1500);
      } else {
        setSubmitStatus({
          type: "error",
          message: data.message || "Error al cambiar la contraseña"
        });
      }
    } catch (error) {
      setSubmitStatus({
        type: "error",
        message: "Error de conexión. Inténtalo de nuevo"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    if (field === 'newPassword') {
      setNewPassword(value);
    } else {
      setConfirmPassword(value);
    }
    
    // Solo validamos si ya hay algún error o si el campo tiene contenido
    if (errors.newPassword || errors.confirmPassword || value.length > 0) {
      validatePassword();
    }
  };

  return (
    <SidebarCliente>
      <div className="flex flex-col p-6 gap-6 md:-ml-64">
        {/* Header section */}
        <div className="mb-8 bg-gradient-to-r from-green-600 to-green-900 rounded-3xl shadow-lg overflow-hidden">
          <div className="px-8 py-12 relative">
            <div className="relative z-10">
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
                Bienvenido, {userName || "Usuario"}
              </h1>
              <p className="text-violet-100 text-lg">
                Aquí realiza configuraciones de tu cuenta.
              </p>
            </div>
          </div>
        </div>

        {/* Card para cambiar contraseña */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Restablecer Contraseña</h2>
          <button
            onClick={() => {
              setIsModalOpen(true);
              setErrors({});
              setSubmitStatus({ type: "", message: "" });
              setNewPassword("");
              setConfirmPassword("");
            }}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            Cambiar Contraseña
          </button>
        </div>

        {/* Modal de cambio de contraseña */}
        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
          <div className="mb-6">
            <h2 className="text-2xl font-semibold mb-4">Cambiar Contraseña</h2>
            {submitStatus.message && (
              <div 
                className={`mb-4 p-2 rounded ${
                  submitStatus.type === 'success' 
                    ? 'bg-green-50 text-green-600 border border-green-200' 
                    : 'bg-red-50 text-red-600 border border-red-200'
                }`}
              >
                {submitStatus.message}
              </div>
            )}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nueva Contraseña
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => handleInputChange('newPassword', e.target.value)}
                    className={`w-full p-2 border rounded focus:ring-2 focus:ring-green-500 focus:border-green-500 
                      ${errors.newPassword ? 'border-red-500' : 'border-gray-300'}`}
                    placeholder="Nueva contraseña"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {errors.newPassword && (
                  <p className="mt-1 text-sm text-red-600">{errors.newPassword}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Confirmar Contraseña
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                    className={`w-full p-2 border rounded focus:ring-2 focus:ring-green-500 focus:border-green-500 
                      ${errors.confirmPassword ? 'border-red-500' : 'border-gray-300'}`}
                    placeholder="Confirmar contraseña"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>
                )}
              </div>
            </div>
          </div>
          <div className="flex justify-end space-x-3">
            <button
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Cancelar
            </button>
            <button
              onClick={handleChangePassword}
              disabled={loading}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50"
            >
              {loading ? "Cambiando..." : "Cambiar"}
            </button>
          </div>
        </Modal>
      </div>
    </SidebarCliente>
  );
};

export default Settings;