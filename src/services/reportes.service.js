// src/services/reportes.service.js

import axios from "axios";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

const API_URL = "http://127.0.0.1:8000";

// Función para obtener los datos del reporte desde el backend
export const getReporte = async () => {
  try {
    const response = await axios.get(`${API_URL}/reportes/areas-empleados`);
    return response.data;
  } catch (error) {
    console.error("Error fetching reporte:", error);
    throw error;
  }
};

// Función para aplanar los datos del reporte y prepararlos para XLSX
const flattenReporteData = (reporteData) => {
  const flattenedData = [];

  reporteData.forEach(area => {
    if (area.oficinas && area.oficinas.length > 0) {
      area.oficinas.forEach(oficina => {
        if (oficina.empleados && oficina.empleados.length > 0) {
          oficina.empleados.forEach(empleado => {
            flattenedData.push({
              'Área': area.nombre,
              'Oficina': oficina.nombre,
              'ID Empleado': empleado.id_empleado,
              'Nombre': empleado.nombre,
              'Tipo Empleado': empleado.tipo_empleado,
              'Tipo Profesor': empleado.tipo_profesor || 'N/A',
            });
          });
        } else {
          // Caso de oficina sin empleados
          flattenedData.push({
            'Área': area.nombre,
            'Oficina': oficina.nombre,
            'ID Empleado': 'N/A',
            'Nombre': 'N/A',
            'Tipo Empleado': 'N/A',
            'Tipo Profesor': 'N/A',
          });
        }
      });
    } else {
      // Caso de área sin oficinas
      flattenedData.push({
        'Área': area.nombre,
        'Oficina': 'N/A',
        'ID Empleado': 'N/A',
        'Nombre': 'N/A',
        'Tipo Empleado': 'N/A',
        'Tipo Profesor': 'N/A',
      });
    }
  });

  return flattenedData;
};

// Función para generar y descargar el archivo XLSX
export const downloadReporteXLSX = (reporteData) => {
  const flattenedData = flattenReporteData(reporteData);

  const worksheet = XLSX.utils.json_to_sheet(flattenedData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Reporte Empleados");

  // Generar un blob binario del archivo XLSX
  const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
  const blob = new Blob([excelBuffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8" });

  // Guardar el archivo con un nombre específico
  saveAs(blob, "reporte_colegio_cambridge.xlsx");
};