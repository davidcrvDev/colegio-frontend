// src/services/empleados.service.js

import axios from "axios";

// URL base de tu backend
const API_URL = "http://127.0.0.1:8000";

// Función para obtener todos los empleados
export const getEmpleados = async () => {
  try {
    const response = await axios.get(`${API_URL}/empleados/`);
    return response.data;
  } catch (error) {
    console.error("Error fetching empleados:", error);
    throw error;
  }
};

// Función para crear un nuevo empleado
export const createEmpleado = async (empleadoData) => {
  try {
    const response = await axios.post(`${API_URL}/empleados/`, empleadoData);
    return response.data;
  } catch (error) {
    console.error("Error creating empleado:", error);
    throw error;
  }
};

// Función para actualizar un empleado existente
export const updateEmpleado = async (id, empleadoData) => {
  try {
    const response = await axios.put(
      `${API_URL}/empleados/${id}`,
      empleadoData
    );
    return response.data;
  } catch (error) {
    console.error(`Error updating empleado with ID ${id}:`, error);
    throw error;
  }
};

// Función para eliminar un empleado
export const deleteEmpleado = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}/empleados/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting empleado with ID ${id}:`, error);
    throw error;
  }
};
