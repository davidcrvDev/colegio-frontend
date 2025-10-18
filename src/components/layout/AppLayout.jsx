// src/components/layout/AppLayout.jsx
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar.jsx";
import Chatbot from "./Chatbot.jsx";

export default function AppLayout() {
  return (
    <div id="root-layout" className="min-h-screen bg-gray-100 flex items-start justify-center">
      {/* wrapper centrado horizontalmente, altura controlada */}
      <div
        id="app-wrapper"
        className="w-full max-w-screen-xl h-[92vh] mx-4 bg-white shadow-lg rounded-lg overflow-hidden"
        style={{ display: "grid", gridTemplateColumns: "16rem 1fr" }} // grid fijo: 16rem (sidebar) + resto
      >
        {/* Sidebar — columna izquierda (NO debe tener min-h-screen) */}
        <aside id="app-sidebar" className="h-full bg-gray-800 text-white">
          <Sidebar />
        </aside>

        {/* Contenido principal — ocupa todo el resto */}
        <main id="app-main" className="h-full overflow-auto bg-white">
          <div className="mx-auto max-w-5xl p-6">
            <Outlet />
          </div>
        </main>
      </div>

      {/* Chatbot overlay: no afecta el layout */}
      <Chatbot />
    </div>
  );
}
