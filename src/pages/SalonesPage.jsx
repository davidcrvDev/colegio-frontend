// src/pages/SalonesPage.jsx

import React, { useState } from "react";
// 🚨 Importamos los hooks de React Query
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { graphqlFetcher } from "../services/graphqlFetcher";
import { gql } from "graphql-tag"; 

import Table from "../components/Table";
import Form from "../components/Form";

// ---------------------------------------------------------------------
// 1. DEFINICIÓN DE QUERIES Y MUTATIONS GRAPHQL
// ---------------------------------------------------------------------

const GET_SALONES_QUERY = gql`
  query GetSalones {
    salones {
      idSalon
      codigo
      capacidad
      descripcion
    }
  }
`;

const CREATE_SALON_MUTATION = gql`
  mutation CreateSalon($data: SalonInput!) {
    createSalon(data: $data) {
      idSalon
      codigo
      capacidad
      descripcion
    }
  }
`;

const UPDATE_SALON_MUTATION = gql`
 mutation UpdateSalon($id: Int!, $data: SalonInput!) { 
    updateSalon(id: $id, data: $data) { 
      idSalon
      codigo
      capacidad
      descripcion
    }
  }
`;

const DELETE_SALON_MUTATION = gql`
  mutation DeleteSalon($id: Int!) {
    deleteSalon(id: $id) 
  }
`;

const SALONES_QUERY_KEY = ["salones"];
// ---------------------------------------------------------------------

const SalonesPage = () => {
  // Eliminamos el estado local 'salones', 'loading', 'error'
  const [newSalonData, setNewSalonData] = useState({ 
      codigo: "", 
      capacidad: "", 
      descripcion: "" 
  });
  const [editingSalon, setEditingSalon] = useState(null);

  const queryClient = useQueryClient();

  // -------------------------------------------------------------------
  // A. USE QUERY (LECTURA DE DATOS)
  // -------------------------------------------------------------------
  
  const { data, isLoading, isError, error } = useQuery({
    queryKey: SALONES_QUERY_KEY,
    queryFn: () => graphqlFetcher(GET_SALONES_QUERY),
    // Mapeamos los campos para compatibilidad: id -> id_salon
    select: (data) => data.salones.map(salon => ({ ...salon, id_salon: salon.id })),
  });
  
  // -------------------------------------------------------------------
  // B. USE MUTATION (ESCRITURA DE DATOS)
  // -------------------------------------------------------------------

  const saveMutation = useMutation({
    mutationFn: (variables) => {
      const mutation = editingSalon ? UPDATE_SALON_MUTATION : CREATE_SALON_MUTATION;
      return graphqlFetcher(mutation, variables);
    },
    onSuccess: () => {
      // Invalidamos la caché de la query 'salones' para forzar el re-fetch
      queryClient.invalidateQueries({ queryKey: SALONES_QUERY_KEY });
      setNewSalonData({ codigo: "", capacidad: "", descripcion: "" });
      setEditingSalon(null);
    },
    onError: (err) => {
      console.error("Error al guardar/actualizar salón:", err);
      alert(`Error: ${err.message || 'No se pudo guardar el salón.'}`);
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => graphqlFetcher(DELETE_SALON_MUTATION, { id }),
    onSuccess: () => {
      // Invalidamos la caché de la query 'salones'
      queryClient.invalidateQueries({ queryKey: SALONES_QUERY_KEY });
    },
    onError: (err) => {
      console.error("Error al eliminar salón:", err);
      alert(`Error: ${err.message || 'No se pudo eliminar el salón.'}`);
    }
  });

  // -------------------------------------------------------------------
  // 2. HANDLERS ACTUALIZADOS
  // -------------------------------------------------------------------

  const handleEditClick = (salon) => {
    setEditingSalon(salon);
    setNewSalonData({
      codigo: salon.codigo,
      capacidad: salon.capacidad,
      descripcion: salon.descripcion,
    });
  };

  const handleSubmit = (e) => {
  e.preventDefault();

  // 1. Crear el objeto de entrada 'data' (AreaInput)
  const inputData = { 
    codigo: newSalonData.codigo,
    capacidad: parseInt(newSalonData.capacidad), // Aseguramos que es un Int
    descripcion: newSalonData.descripcion
  };

  let variables;
  if (editingSalon) {
    // Para la mutación UPDATE, necesitamos 'id' y 'data'
    variables = { 
      id: editingSalon.id_salon, 
      data: inputData 
    };
  } else {
    // Para la mutación CREATE, solo necesitamos 'data'
    variables = { 
      data: inputData 
    };
  }

  saveMutation.mutate(variables);
};

  const handleDelete = (id) => {
    deleteMutation.mutate(id);
  };
  
  // -------------------------------------------------------------------
  // 3. ESTADOS DE CARGA Y ERROR CENTRALIZADOS
  // -------------------------------------------------------------------

  const isMutating = saveMutation.isPending || deleteMutation.isPending;

  if (isLoading || isMutating) {
    return <div className="text-center mt-8">Cargando/Procesando salones...</div>;
  }

  if (isError) {
    return <div className="text-center mt-8 text-red-500">Error: {error.message}</div>;
  }

  // -------------------------------------------------------------------
  // 4. RENDERIZADO
  // -------------------------------------------------------------------
  
  const salonesData = data || [];

  // Columnas para la tabla de salones (sin cambios)
  const salonColumns = [
    { header: "ID", accessor: "id_salon" },
    { header: "Código", accessor: "codigo" },
    { header: "Capacidad", accessor: "capacidad" },
    { header: "Descripción", accessor: "descripcion" },
    {
      header: "Acciones",
      render: (row) => (
        <>
          <button
            onClick={() => handleEditClick(row)}
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-1 px-3 rounded-lg mr-4"
          >
            Editar
          </button>
          <button
            onClick={() => handleDelete(row.id_salon)}
            className="bg-red-500 hover:bg-red-600 text-white font-bold py-1 px-3 rounded-lg"
          >
            Eliminar
          </button>
        </>
      ),
    },
  ];

  // Campos para el formulario de salones (sin cambios)
  const salonFields = [
    {
      label: "Código",
      name: "codigo",
      type: "text",
      value: newSalonData.codigo,
      onChange: (e) =>
        setNewSalonData({ ...newSalonData, codigo: e.target.value }),
      required: true,
      inputClassName: "bg-gray-300 text-gray-900",
    },
    {
      label: "Capacidad",
      name: "capacidad",
      type: "text",
      value: newSalonData.capacidad,
      onChange: (e) =>
        setNewSalonData({ ...newSalonData, capacidad: e.target.value }),
      required: true,
      inputClassName: "bg-gray-300 text-gray-900",
    },
    {
      label: "Descripción",
      name: "descripcion",
      type: "text",
      value: newSalonData.descripcion,
      onChange: (e) =>
        setNewSalonData({ ...newSalonData, descripcion: e.target.value }),
      required: true,
      inputClassName: "bg-gray-300 text-gray-900",
    },
  ];

  return (
    <div className="flex flex-col gap-6">
    <h1 className="text-3xl font-bold mb-6 text-black">Administrar Salones</h1>
    <div className="flex flex-col md:flex-row gap-6">
      <Table data={salonesData} columns={salonColumns} />
      <Form
        title={editingSalon ? "Editar Salón" : "Crear Nuevo Salón"}
        fields={salonFields}
        onSubmit={handleSubmit}
        submitText={editingSalon ? "Actualizar Salón" : "Guardar Salón"}
      />
    </div>
  </div>
  );
};

export default SalonesPage;