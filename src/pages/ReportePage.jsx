// src/pages/ReportePage.jsx

import React from "react";
// 🚨 Importamos los hooks de React Query
import { useQuery } from "@tanstack/react-query";
import { graphqlFetcher } from "../services/graphqlFetcher";
import { gql } from "graphql-tag"; 
// Mantendremos downloadReporteXLSX, ya que probablemente NO usa la red directamente
// import { downloadReporteXLSX } from "../services/reportes.service";

// ---------------------------------------------------------------------
// 1. DEFINICIÓN DE LA QUERY GRAPHQL
// ---------------------------------------------------------------------

// Esta query solicita las Áreas, y dentro de ellas, sus Oficinas,
// y dentro de estas, sus Empleados, todo en una sola petición.
const GET_REPORTE_QUERY = gql`
  query ReporteAreasEmpleados {
    reporteAreasEmpleados {
      id
      nombre
      oficinas {
        id
        codigo
        nombre
        empleados {
          id
          nombre
          tipoEmpleado
          tipoProfesor
        }
      }
    }
  }
`;

const REPORTE_QUERY_KEY = ["reporteAreasEmpleados"];
// ---------------------------------------------------------------------

const ReportePage = () => {
  // Eliminamos el estado local 'reporteData', 'loading', 'error'
  
  // -------------------------------------------------------------------
  // A. USE QUERY (LECTURA DE DATOS)
  // -------------------------------------------------------------------

  const { data, isLoading, isError, error } = useQuery({
    queryKey: REPORTE_QUERY_KEY,
    queryFn: () => graphqlFetcher(GET_REPORTE_QUERY),
    // Mapeamos los campos para compatibilidad: id -> id_*, y camelCase -> snake_case
    select: (response) => {
        // La respuesta del fetcher es 'data', que contiene el reporte.
        const reporte = response.reporteAreasEmpleados || [];

        return reporte.map(area => ({
            id_area: area.id,
            nombre: area.nombre,
            oficinas: area.oficinas.map(oficina => ({
                id_oficina: oficina.id,
                codigo: oficina.codigo,
                nombre: oficina.nombre,
                empleados: oficina.empleados.map(empleado => ({
                    id_empleado: empleado.id,
                    nombre: empleado.nombre,
                    tipo_empleado: empleado.tipoEmpleado,
                    tipo_profesor: empleado.tipoProfesor,
                })),
            })),
        }));
    }
  });

  // -------------------------------------------------------------------
  // 2. HANDLERS ACTUALIZADOS
  // -------------------------------------------------------------------

  const reporteData = data || [];

  const handleDownloadClick = () => {
    // La función downloadReporteXLSX generalmente manipula el DOM o llama 
    // a librerías de generación de archivos (ej: exceljs, sheetjs) y 
    // NO hace una petición de red, por lo que la mantenemos como está.
    if (reporteData.length > 0) {
      downloadReporteXLSX(reporteData);
    }
  };

  // -------------------------------------------------------------------
  // 3. ESTADOS DE CARGA Y ERROR CENTRALIZADOS
  // -------------------------------------------------------------------

  if (isLoading) {
    return <div className="text-center mt-8">Cargando reporte...</div>;
  }

  if (isError) {
    return <div className="text-center mt-8 text-red-500">Error: No se pudo cargar el reporte. {error.message}</div>;
  }

  // -------------------------------------------------------------------
  // 4. RENDERIZADO
  // -------------------------------------------------------------------

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
          {/* Usamos reporteData del hook useQuery */}
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
                              (`(${empleado.tipo_profesor})`)}
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