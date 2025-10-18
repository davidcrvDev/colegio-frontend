import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { graphqlFetcher } from "../services/graphqlFetcher";
import { gql } from "graphql-tag";

import Table from "../components/Table";
import Form from "../components/Form";

const GET_AREAS_QUERY = gql`
  query GetAreas {
    areas {
      idArea
      nombre
    }
  }
`;

const GET_OFICINAS_QUERY = gql`
  query GetOficinas {
    oficinas {
      idOficina
      codigo
      nombre
      area {
        idArea
        nombre
      }
    }
  }
`;

const CREATE_OFICINA_MUTATION = gql`
  mutation CreateOficina($data: OficinaInput!) {
    createOficina(data: $data) {
      idOficina
      codigo
      nombre
      area {
        idArea
        nombre
      }
    }
  }
`;

const UPDATE_OFICINA_MUTATION = gql`
  mutation UpdateOficina($id: Int!, $data: OficinaInput!) {
    updateOficina(id: $id, data: $data) {
      idOficina
      codigo
      nombre
      area {
        idArea
        nombre
      }
    }
  }
`;

const DELETE_OFICINA_MUTATION = gql`
  mutation DeleteOficina($id: Int!) {
    deleteOficina(id: $id) {
      success
    }
  }
`;

const AREAS_QUERY_KEY = ["areas"];
const OFICINAS_QUERY_KEY = ["oficinas"];

const OficinasPage = () => {
  const [newOficinaData, setNewOficinaData] = useState({
    codigo: "",
    nombre: "",
    idArea: "",
  });
  const [editingOficina, setEditingOficina] = useState(null);

  const queryClient = useQueryClient();

  const areasQuery = useQuery({
    queryKey: AREAS_QUERY_KEY,
    queryFn: () => graphqlFetcher(GET_AREAS_QUERY),
    select: (data) => data.areas.map(area => ({ idArea: area.idArea, nombre: area.nombre })),
  });

  const oficinasQuery = useQuery({
    queryKey: OFICINAS_QUERY_KEY,
    queryFn: () => graphqlFetcher(GET_OFICINAS_QUERY),
    select: (data) => data.oficinas.map(oficina => ({
      ...oficina,
      idOficina: oficina.idOficina,
      idArea: oficina.area ? oficina.area.idArea : null,
      area_nombre: oficina.area ? oficina.area.nombre : "Sin Área",
    })),
  });

  const saveMutation = useMutation({
    mutationFn: (variables) => {
      const mutation = editingOficina ? UPDATE_OFICINA_MUTATION : CREATE_OFICINA_MUTATION;
      return graphqlFetcher(mutation, variables);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: OFICINAS_QUERY_KEY });
      setNewOficinaData({ codigo: "", nombre: "", idArea: "" });
      setEditingOficina(null);
    },
    onError: (err) => {
      console.error("Error al guardar/actualizar oficina:", err);
      alert(`Error: ${err.message || 'No se pudo guardar la oficina. Verifica los datos ingresados.'}`);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => graphqlFetcher(DELETE_OFICINA_MUTATION, { id }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: OFICINAS_QUERY_KEY });
    },
    onError: (err) => {
      console.error("Error al eliminar oficina:", err);
      alert(`Error: ${err.message || 'No se pudo eliminar la oficina.'}`);
    },
  });

  const handleEditClick = (oficina) => {
    setEditingOficina(oficina);
    setNewOficinaData({
      codigo: oficina.codigo,
      nombre: oficina.nombre,
      idArea: oficina.idArea || "",
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const inputData = {
      codigo: newOficinaData.codigo,
      nombre: newOficinaData.nombre,
      id_area: parseInt(newOficinaData.idArea),
    };
    const variables = editingOficina
      ? { id: editingOficina.idOficina, data: inputData }
      : { data: inputData };

    saveMutation.mutate(variables);
  };

  const handleDelete = (id) => {
    deleteMutation.mutate(id);
  };

  const isLoading = areasQuery.isLoading || oficinasQuery.isLoading || saveMutation.isPending || deleteMutation.isPending;
  const isError = areasQuery.isError || oficinasQuery.isError;
  const errorMessage = areasQuery.error?.message || oficinasQuery.error?.message;

  if (isLoading) return <div className="text-center mt-8">Cargando oficinas y áreas...</div>;
  if (isError) return <div className="text-center mt-8 text-red-500">Error: {errorMessage}</div>;

  const oficinasData = oficinasQuery.data || [];
  const areasData = areasQuery.data || [];

  const oficinaColumns = [
    { header: "ID", accessor: "idOficina" },
    { header: "Código", accessor: "codigo" },
    { header: "Nombre", accessor: "nombre" },
    { header: "Área", accessor: "area_nombre" },
    {
      header: "Acciones",
      render: (row) => (
        <>
          <button onClick={() => handleEditClick(row)} className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-1 px-3 rounded-lg mr-4">Editar</button>
          <button onClick={() => handleDelete(row.idOficina)} className="bg-red-500 hover:bg-red-600 text-white font-bold py-1 px-3 rounded-lg">Eliminar</button>
        </>
      ),
    },
  ];

  const oficinaFields = [
    { label: "Código", name: "codigo", type: "text", value: newOficinaData.codigo, onChange: (e) => setNewOficinaData({ ...newOficinaData, codigo: e.target.value }), required: true, inputClassName: "bg-gray-300 text-gray-900" },
    { label: "Nombre", name: "nombre", type: "text", value: newOficinaData.nombre, onChange: (e) => setNewOficinaData({ ...newOficinaData, nombre: e.target.value }), required: true, inputClassName: "bg-gray-300 text-gray-900" },
    { label: "Área", name: "idArea", type: "select", value: newOficinaData.idArea, onChange: (e) => setNewOficinaData({ ...newOficinaData, idArea: e.target.value }), options: areasData.map((area) => ({ value: area.idArea, label: area.nombre })), placeholder: "Seleccione un área", required: true, inputClassName: "bg-gray-300 text-gray-900" },
  ];

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-3xl font-bold mb-6 text-black">Administrar Oficinas</h1>
      <div className="flex flex-col md:flex-row gap-6">
        <Table data={oficinasData} columns={oficinaColumns} />
        <Form title={editingOficina ? "Editar Oficina" : "Crear Nueva Oficina"} fields={oficinaFields} onSubmit={handleSubmit} submitText={editingOficina ? "Actualizar Oficina" : "Guardar Oficina"} />
      </div>
    </div>
  );
};

export default OficinasPage;