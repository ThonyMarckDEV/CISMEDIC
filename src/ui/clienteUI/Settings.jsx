// ResultadosLaboratorio.jsx
import React, { useState, useEffect } from "react";
import { Calendar, XCircle } from "lucide-react";
import SidebarCliente from "../../components/clienteComponents/SidebarCliente";
import API_BASE_URL from "../../js/urlHelper";
import jwtUtils from "../../utilities/jwtUtils";


const Settings = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);


  const token = jwtUtils.getTokenFromCookie();
  const userId = jwtUtils.getIdUsuario(token);
  const userName = jwtUtils.getNombres(token);


  return (
    <SidebarCliente>
      <div className="flex flex-col p-6 gap-6 md:-ml-64">

        {/* Header section - sin cambios */}
        <div className="mb-8 bg-gradient-to-r from-green-600 to-green-900 rounded-3xl shadow-lg overflow-hidden">
          <div className="px-8 py-12 relative">
            <div className="relative z-10">
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
                Bienvenido, {userName || "Usuario"}
              </h1>
              <p className="text-violet-100 text-lg">
                Aqui realiza configuraciones de tu cuenta.
              </p>
            </div>
            <div className="absolute right-0 top-0 w-1/3 h-full opacity-10">
              <svg viewBox="0 0 100 100" className="h-full">
                <circle cx="80" cy="20" r="15" fill="white" />
                <circle cx="20" cy="80" r="25" fill="white" />
              </svg>
            </div>
          </div>
        </div>

   
      </div>
    </SidebarCliente>
  );
};

export default Settings;