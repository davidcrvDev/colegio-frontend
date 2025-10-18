// src/services/graphqlFetcher.js

import axios from 'axios';
// 🚨 Importamos la función 'print' para convertir el objeto GQL en string
import { print } from 'graphql/language/printer'; 

// URL de tu endpoint GraphQL
const API_URL = "http://127.0.0.1:8000/graphql";

/**
 * Función genérica para ejecutar queries/mutations GraphQL.
 * @param {object} documentNode - La query o mutation (objeto DocumentNode de gql).
 * @param {object} variables - Variables para la query/mutation.
 * @returns {Promise<any>}
 */
export const graphqlFetcher = async (documentNode, variables = {}) => {
    try {
        // 🚨 CAMBIO CLAVE: Convertir el DocumentNode (query) a string de texto plano
        const query = print(documentNode); 
        
        const response = await axios.post(API_URL, {
            query, // Ahora 'query' es un string válido para el backend
            variables,
        });

        // Manejo de errores de GraphQL
        if (response.data.errors) {
            // Imprimir los errores detallados de GraphQL en consola
            console.error("Errores detallados de GraphQL:", response.data.errors);
            throw new Error(response.data.errors[0].message || 'Error en la petición GraphQL');
        }

        return response.data.data;
        
    } catch (error) {
        console.error("Error en la petición GraphQL:", error);
        // Volver a lanzar el error para que React Query lo maneje
        throw error;
    }
};