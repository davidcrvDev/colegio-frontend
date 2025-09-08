// src/pages/ReportePage.jsx

import React, { useState, useEffect } from "react";
import { getReporte, downloadReporteXLSX } from "../services/reportes.service";

const ReportePage = () => {
  const [reporteData, setReporteData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchReporte = async () => {
    try {
      const data = await getReporte();
      setReporteData(data);
    } catch (err) {
      setError("No se pudo cargar el reporte. Intente de nuevo.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReporte();
  }, []);

  const handleDownloadClick = () => {
    if (reporteData.length > 0) {
      downloadReporteXLSX(reporteData);
    }
  };

  if (loading) {
    return <div className="text-center mt-8">Cargando reporte...</div>;
  }

  if (error) {
    return <div className="text-center mt-8 text-red-500">Error: {error}</div>;
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6 text-black">Reporte de Áreas y Empleados</h1>
      <button
        onClick={handleDownloadClick}
        className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-lg mb-6 transition duration-300"
      >
        Descargar en XLSX
      </button>

      {reporteData.length === 0 ? (
        <p className="text-gray-500">
          No hay datos disponibles para el reporte.
        </p>
      ) : (
        <div className="bg-white p-6 rounded-lg shadow-md">
          {reporteData.map((area) => (
            <div key={area.id_area} className="mb-8 p-4 border rounded-lg">
              <h2 className="text-2xl font-semibold text-blue-800">
                {area.nombre}
              </h2>
              {area.oficinas.length === 0 ? (
                <p className="text-gray-500 ml-4 mt-2">
                  No hay oficinas registradas en esta área.
                </p>
              ) : (
                area.oficinas.map((oficina) => (
                  <div
                    key={oficina.id_oficina}
                    className="ml-4 mt-4 p-3 border-l-2 border-gray-300"
                  >
                    <h3 className="text-xl font-medium text-gray-700">
                      {oficina.nombre} ({oficina.codigo})
                    </h3>
                    {oficina.empleados.length === 0 ? (
                      <p className="text-gray-500 ml-4 mt-2">
                        No hay empleados registrados en esta oficina.
                      </p>
                    ) : (
                      <ul className="list-disc ml-8 mt-2 space-y-2">
                        {oficina.empleados.map((empleado) => (
                          <li
                            key={empleado.id_empleado}
                            className="text-gray-600"
                          >
                            <strong>Nombre:</strong> {empleado.nombre} |{" "}
                            <strong>ID:</strong> {empleado.id_empleado} |{" "}
                            <strong>Tipo:</strong> {empleado.tipo_empleado}{" "}
                            {empleado.tipo_profesor &&
                              `(${empleado.tipo_profesor})`}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ReportePage;
