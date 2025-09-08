// src/services/oficinas.service.js

import axios from "axios";

// URL base de tu backend
const API_URL = "http://127.0.0.1:8000";

// Función para obtener todas las oficinas
export const getOficinas = async () => {
  try {
    const response = await axios.get(`${API_URL}/oficinas/`);
    return response.data;
  } catch (error) {
    console.error("Error fetching oficinas:", error);
    throw error;
  }
};

// Función para crear una nueva oficina
export const createOficina = async (oficinaData) => {
  try {
    const response = await axios.post(`${API_URL}/oficinas/`, oficinaData);
    return response.data;
  } catch (error) {
    console.error("Error creating oficina:", error);
    throw error;
  }
};

// Función para actualizar una oficina existente
export const updateOficina = async (id, oficinaData) => {
  try {
    const response = await axios.put(`${API_URL}/oficinas/${id}`, oficinaData);
    return response.data;
  } catch (error) {
    console.error(`Error updating oficina with ID ${id}:`, error);
    throw error;
  }
};

// Función para eliminar una oficina
export const deleteOficina = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}/oficinas/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting oficina with ID ${id}:`, error);
    throw error;
  }
};
