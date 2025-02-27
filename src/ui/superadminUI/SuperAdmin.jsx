"use client"
import SidebarSuperAdmin from "../../components/superAdminComponents/SidebarSuperAdmin"
import  DashboardCards  from "../../components/superAdminComponents/DashboardCards";
import WelcomeHeader from '../../components/WelcomeHeader';

const SuperAdmin = () => {

  return (
    <SidebarSuperAdmin>
      <div className="flex flex-col p-6 gap-6 md:-ml-64"> {/* Margen negativo solo en desktop */}

        <WelcomeHeader 
            customMessage="Bienvenido Superadmin!!."
          />

        {/* Contenido principal */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6"> {/* Una columna en móvil, dos en desktop */}

          <DashboardCards />
   
        </div>
      </div>
    </SidebarSuperAdmin>
  )
}

export default SuperAdmin