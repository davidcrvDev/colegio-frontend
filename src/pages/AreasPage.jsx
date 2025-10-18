// src/pages/AreasPage.jsx

import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { graphqlFetcher } from "../services/graphqlFetcher";
import { gql } from "graphql-tag";

import Table from "../components/Table";
import Form from "../components/Form";

// ---------------------------------------------------------------------
// 1. DEFINICIÓN DE QUERIES Y MUTATIONS GRAPHQL
// ---------------------------------------------------------------------

const GET_AREAS_QUERY = gql`
  query GetAreas {
    areas {
      idArea
      nombre
    }
  }
`;

const CREATE_AREA_MUTATION = gql`
  mutation CreateArea($data: AreaInput!) {
    createArea(data: $data) {
      idArea
      nombre
    }
  }
`;

const UPDATE_AREA_MUTATION = gql`
  mutation UpdateArea($id: Int!, $data: AreaInput!) {
    updateArea(id: $id, data: $data) {
      idArea
      nombre
    }
  }
`;

const DELETE_AREA_MUTATION = gql`
  mutation DeleteArea($id: Int!) {
    deleteArea(id: $id)
  }
`;

const QUERY_KEY = ["areas"];
// ---------------------------------------------------------------------

const AreasPage = () => {
  const [newAreaName, setNewAreaName] = useState("");
  const [editingArea, setEditingArea] = useState(null);

  const queryClient = useQueryClient();

  // -------------------------------------------------------------------
  // A. USE QUERY (LECTURA DE DATOS)
  // -------------------------------------------------------------------

  const { data, isLoading, isError, error } = useQuery({
    queryKey: QUERY_KEY,
    queryFn: () => graphqlFetcher(GET_AREAS_QUERY),
    select: (data) => data?.areas || [], // Manejo de null/undefined para evitar crashes
  });

  // -------------------------------------------------------------------
  // B. USE MUTATION (ESCRITURA DE DATOS)
  // -------------------------------------------------------------------

  const saveMutation = useMutation({
    mutationFn: (variables) => {
      const mutation = editingArea ? UPDATE_AREA_MUTATION : CREATE_AREA_MUTATION;
      return graphqlFetcher(mutation, variables);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY });
      setNewAreaName("");
      setEditingArea(null);
    },
    onError: (err) => {
      console.error("Error al guardar/actualizar:", err);
      alert(`Error: ${err.message || 'No se pudo guardar el área.'}`);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => graphqlFetcher(DELETE_AREA_MUTATION, { id }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY });
    },
    onError: (err) => {
      console.error("Error al eliminar:", err);
      alert(`Error: ${err.message || 'No se pudo eliminar el área.'}`);
    },
  });

  // -------------------------------------------------------------------
  // 3. HANDLERS ACTUALIZADOS
  // -------------------------------------------------------------------

  const handleEditClick = (area) => {
    setEditingArea(area);
    setNewAreaName(area.nombre);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const inputData = { nombre: newAreaName }; // Wrapper para AreaInput
    const variables = editingArea
      ? { id: editingArea.idArea, data: inputData }
      : { data: inputData };

    saveMutation.mutate(variables);
  };

  const handleDelete = (id) => {
    deleteMutation.mutate(id);
  };

  // -------------------------------------------------------------------
  // 4. ESTADOS DE CARGA Y ERROR ACTUALIZADOS
  // -------------------------------------------------------------------

  if (isLoading || saveMutation.isPending || deleteMutation.isPending) {
    return <div className="text-center mt-8">Cargando/Procesando...</div>;
  }

  if (isError) {
    return <div className="text-center mt-8 text-red-500">Error: {error.message}</div>;
  }

  // -------------------------------------------------------------------
  // 5. RENDERIZADO
  // -------------------------------------------------------------------

  const areaColumns = [
    { header: "ID", accessor: "idArea" },
    { header: "Nombre", accessor: "nombre" },
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
            onClick={() => handleDelete(row.idArea)}
            className="bg-red-500 hover:bg-red-600 text-white font-bold py-1 px-3 rounded-lg"
          >
            Eliminar
          </button>
        </>
      ),
    },
  ];

  const areaFields = [
    {
      label: "Nombre del Área",
      name: "areaName",
      type: "text",
      value: newAreaName,
      onChange: (e) => setNewAreaName(e.target.value),
      required: true,
      inputClassName: "bg-gray-300 text-gray-900",
    },
  ];

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-3xl font-bold mb-6 text-black">Administrar Áreas</h1>
      <div className="flex flex-col md:flex-row gap-6">
        <Table data={data} columns={areaColumns} />
        <Form
          title={editingArea ? "Editar Área" : "Crear Nueva Área"}
          fields={areaFields}
          onSubmit={handleSubmit}
          submitText={editingArea ? "Actualizar Área" : "Guardar Área"}
        />
      </div>
    </div>
  );
};

export default AreasPage;