// src/components/layout/Sidebar.jsx

import { Link } from 'react-router-dom';

const Sidebar = () => {
  return (
    // La clase `flex` aquí asegura que la barra lateral siempre se vea.
    <div className="bg-gray-800 text-white w-64 min-h-screen p-4 flex flex-col gap-4">
      <div className="text-2xl font-bold mb-4">Panel Admin</div>
      <Link to="/dashboard/areas" className="hover:bg-gray-700 p-2 rounded-lg transition duration-200">
        Administrar Áreas
      </Link>
      <Link to="/dashboard/oficinas" className="hover:bg-gray-700 p-2 rounded-lg transition duration-200">
        Administrar Oficinas
      </Link>
      <Link to="/dashboard/empleados" className="hover:bg-gray-700 p-2 rounded-lg transition duration-200">
        Administrar Empleados
      </Link>
      <Link to="/dashboard/salones" className="hover:bg-gray-700 p-2 rounded-lg transition duration-200">
        Administrar Salones
      </Link>
      <hr className="my-2 border-gray-600" />
      <Link to="/dashboard/reportes" className="hover:bg-gray-700 p-2 rounded-lg transition duration-200">
        Ver Reporte
      </Link>
    </div>
  );
};

export default Sidebar;