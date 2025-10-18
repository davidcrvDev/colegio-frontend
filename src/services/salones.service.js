// // src/services/salones.service.js

// import axios from "axios";

// // URL base de tu backend
// const API_URL = "http://127.0.0.1:8000";

// // Función para obtener todos los salones
// export const getSalones = async () => {
//   try {
//     const response = await axios.get(`${API_URL}/salones/`);
//     return response.data;
//   } catch (error) {
//     console.error("Error fetching salones:", error);
//     throw error;
//   }
// };

// // Función para crear un nuevo salón
// export const createSalon = async (salonData) => {
//   try {
//     const response = await axios.post(`${API_URL}/salones/`, salonData);
//     return response.data;
//   } catch (error) {
//     console.error("Error creating salon:", error);
//     throw error;
//   }
// };

// // Función para actualizar un salón existente
// export const updateSalon = async (id, salonData) => {
//   try {
//     const response = await axios.put(`${API_URL}/salones/${id}`, salonData);
//     return response.data;
//   } catch (error) {
//     console.error(`Error updating salon with ID ${id}:`, error);
//     throw error;
//   }
// };

// // Función para eliminar un salón
// export const deleteSalon = async (id) => {
//   try {
//     const response = await axios.delete(`${API_URL}/salones/${id}`);
//     return response.data;
//   } catch (error) {
//     console.error(`Error deleting salon with ID ${id}:`, error);
//     throw error;
//   }
// };
