import SidebarCliente from "../../components/clienteComponents/SidebarCliente";
import PerfilClienteComponent from "../../components/clienteComponents/PerfilClienteComponent";

const PerfilCliente = () => {

  return (
    <SidebarCliente>
      <div className="md:-ml-64">
        <PerfilClienteComponent />
      </div>
    </SidebarCliente>
  );
};

export default PerfilCliente;