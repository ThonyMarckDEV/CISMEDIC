"use client";
import { useEffect, useState } from "react";
import { Calendar, FileText, ChevronRight } from "lucide-react";
import Sidebar from "../../components/doctorComponents/SidebarDoctor";
import jwtUtils from "../../utilities/jwtUtils";
import { Link } from "react-router-dom"; // Importa Link desde react-router-dom
import DoctorCalendar from "../../components/doctorComponents/DoctorCalendar"; // Importa el nuevo componente
import WelcomeHeader from '../../components/WelcomeHeader';

const Doctor = () => {
 
  return (
    <Sidebar>
      <div className="flex flex-col p-6 gap-6 md:-ml-64">

      <WelcomeHeader 
          customMessage="Contamos con sus increíbles servicios."
        />

        {/* Contenido principal */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Sección de citas */}
          <div className="rounded-lg shadow-md bg-white p-6">
            <div className="flex flex-col items-center text-center gap-4">
              <div className="h-16 w-16 flex items-center justify-center rounded-full bg-green-100">
                <Calendar className="h-8 w-8 text-green-600" />
              </div>
              <p className="text-gray-700">Citas reservadas</p>
              <button className="inline-flex items-center justify-center px-4 py-2 rounded-md font-medium bg-green-600 text-white hover:bg-green-700 focus:outline-none">
                <Link to="/doctor/miscitas">Ver mis Citas</Link> {/* Usa Link para la navegación */}
              </button>
            </div>
          </div>

          {/* Calendario de disponibilidad */}
          <div className="rounded-lg shadow-md bg-white p-6 h-[750px]"> {/* Aumentar la altura aquí */}
            <h2 className="text-xl font-bold mb-4 text-center">Calendario de Disponibilidad</h2>
            <DoctorCalendar />
          </div>
        </div>
      </div>
    </Sidebar>
  );
};

export default Doctor;