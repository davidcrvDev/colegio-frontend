import { Link } from 'react-router-dom';

const HomePage = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-8 text-center">
      <div className="max-w-lg">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4 text-black">
          Bienvenido al Colegio Cambridge
        </h1>
        <p className="text-lg sm:text-xl text-gray-600 mb-8">
          Administra las áreas, oficinas, salones y empleados de la institución
          de manera eficiente.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/dashboard"> {/* <-- Modificado de "/areas" a "/dashboard" */}
            <button className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-lg transition duration-300">
              Ir al Panel
            </button>
          </Link>
          <Link to="/dashboard/reportes"> {/* <-- Lo dejamos así para el reporte */}
            <button className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-lg transition duration-300">
              Ver Reporte
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default HomePage;