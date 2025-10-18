// src/components/layout/Sidebar.jsx
import { Link } from "react-router-dom";

const Sidebar = () => {
  return (
    <nav className="h-full p-6 flex flex-col">
      <div className="text-2xl font-bold mb-6">Panel Admin</div>

      <ul className="flex-1 space-y-4">
        <li><Link to="/dashboard/areas" className="text-blue-300 hover:text-white">Administrar Áreas</Link></li>
        <li><Link to="/dashboard/oficinas" className="text-blue-300 hover:text-white">Administrar Oficinas</Link></li>
        <li><Link to="/dashboard/empleados" className="text-blue-300 hover:text-white">Administrar Empleados</Link></li>
        <li><Link to="/dashboard/salones" className="text-blue-300 hover:text-white">Administrar Salones</Link></li>
      </ul>

      <hr className="border-gray-600 my-4" />
      <div><Link to="/dashboard/reportes" className="text-blue-300 hover:text-white">Ver Reporte</Link></div>
    </nav>
  );
};

export default Sidebar;
