// // src/services/areas.service.js

// import axios from "axios";

// // URL base de tu backend
// const API_URL = "http://127.0.0.1:8000";

// // Función para obtener todas las áreas
// export const getAreas = async () => {
//   try {
//     const response = await axios.get(`${API_URL}/areas/`);
//     return response.data;
//   } catch (error) {
//     console.error("Error fetching areas:", error);
//     throw error;
//   }
// };

// // Función para crear una nueva área
// export const createArea = async (areaData) => {
//   try {
//     const response = await axios.post(`${API_URL}/areas/`, areaData);
//     return response.data;
//   } catch (error) {
//     console.error("Error creating area:", error);
//     throw error;
//   }
// };

// // Función para actualizar un área existente
// export const updateArea = async (id, areaData) => {
//   try {
//     const response = await axios.put(`${API_URL}/areas/${id}`, areaData);
//     return response.data;
//   } catch (error) {
//     console.error(`Error updating area with ID ${id}:`, error);
//     throw error;
//   }
// };

// // Función para eliminar un área
// export const deleteArea = async (id) => {
//   try {
//     const response = await axios.delete(`${API_URL}/areas/${id}`);
//     return response.data;
//   } catch (error) {
//     console.error(`Error deleting area with ID ${id}:`, error);
//     throw error;
//   }
// };
