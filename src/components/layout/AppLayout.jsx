// src/components/layout/AppLayout.jsx
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';

const AppLayout = () => {
  return (
    // CAMBIO CRUCIAL: El contenedor principal tiene flex y min-h-screen
    <div className="flex min-h-screen">
      <Sidebar />
      {/* CAMBIO: Se remueve el p-8 para que el contenido lo controle la pagina */}
      <main className="flex-1 bg-gray-100 overflow-auto p-4 md:p-8"> 
        <Outlet />
      </main>
    </div>
  );
};

export default AppLayout;