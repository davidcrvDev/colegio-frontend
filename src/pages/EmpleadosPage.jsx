import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { graphqlFetcher } from "../services/graphqlFetcher";
import { gql } from "graphql-tag"; 

import Table from "../components/Table";
import Form from "../components/Form";

const GET_OFICINAS_QUERY = gql`
  query GetOficinas {
    oficinas {
      idOficina
      nombre
    }
  }
`;

const GET_EMPLEADOS_QUERY = gql`
  query GetEmpleados {
    empleados {
      idEmpleado
      nombre
      tipoEmpleado
      tipoProfesor
      idOficina 
    }
  }
`;

const CREATE_EMPLEADO_MUTATION = gql`
  mutation CreateEmpleado($data: EmpleadoInput!) {
    createEmpleado(data: $data) {
      idEmpleado 
      nombre
      tipoEmpleado
      tipoProfesor
      idOficina
    }
  }
`;

const UPDATE_EMPLEADO_MUTATION = gql`
  mutation UpdateEmpleado($id: Int!, $data: EmpleadoInput!) {
    updateEmpleado(id: $id, data: $data) {
      idEmpleado
      nombre
      tipoEmpleado
      tipoProfesor
      idOficina
    }
  }
`;

const DELETE_EMPLEADO_MUTATION = gql`
  mutation DeleteEmpleado($id: String!) {
    deleteEmpleado(id: $id) {
      success
    }
  }
`;

const OFICINAS_QUERY_KEY = ["oficinas"];
const EMPLEADOS_QUERY_KEY = ["empleados"];

const EmpleadosPage = () => {
  const [newEmpleadoData, setNewEmpleadoData] = useState({
    id_empleado: "",
    nombre: "",
    tipo_empleado: "",
    tipo_profesor: "",
    id_oficina: "",
  });
  const [editingEmpleado, setEditingEmpleado] = useState(null);

  const queryClient = useQueryClient();

  const oficinasQuery = useQuery({
    queryKey: OFICINAS_QUERY_KEY,
    queryFn: () => graphqlFetcher(GET_OFICINAS_QUERY),
    select: (data) => data.oficinas.map(oficina => ({ id_oficina: oficina.idOficina, nombre: oficina.nombre })),
  });

  const empleadosQuery = useQuery({
    queryKey: EMPLEADOS_QUERY_KEY,
    queryFn: () => graphqlFetcher(GET_EMPLEADOS_QUERY),
    select: (data) => data.empleados.map(empleado => ({ 
      id_empleado: empleado.idEmpleado,
      nombre: empleado.nombre,
      tipo_empleado: empleado.tipoEmpleado,
      tipo_profesor: empleado.tipoProfesor,
      id_oficina: empleado.idOficina, // Ajustado para usar idOficina directamente
      oficina_nombre: oficinasQuery.data?.find(o => o.id_oficina === empleado.idOficina)?.nombre || "N/A",
    })),
  });

  const saveMutation = useMutation({
    mutationFn: (variables) => {
      const mutation = editingEmpleado ? UPDATE_EMPLEADO_MUTATION : CREATE_EMPLEADO_MUTATION;
      return graphqlFetcher(mutation, variables);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: EMPLEADOS_QUERY_KEY });
      setNewEmpleadoData({ id_empleado: "", nombre: "", tipo_empleado: "", tipo_profesor: "", id_oficina: "" });
      setEditingEmpleado(null);
    },
    onError: (err) => {
      console.error("Error al guardar/actualizar empleado:", err);
      alert(`Error: ${err.message || 'No se pudo guardar el empleado.'}`);
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => graphqlFetcher(DELETE_EMPLEADO_MUTATION, { id }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: EMPLEADOS_QUERY_KEY });
    },
    onError: (err) => {
      console.error("Error al eliminar empleado:", err);
      alert(`Error: ${err.message || 'No se pudo eliminar el empleado.'}`);
    }
  });

  const handleEditClick = (empleado) => {
    setEditingEmpleado(empleado);
    setNewEmpleadoData({
      id_empleado: empleado.id_empleado,
      nombre: empleado.nombre,
      tipo_empleado: empleado.tipo_empleado,
      tipo_profesor: empleado.tipo_profesor || "",
      id_oficina: empleado.id_oficina,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const variables = { 
      id: newEmpleadoData.id_empleado,
      nombre: newEmpleadoData.nombre,
      tipoEmpleado: newEmpleadoData.tipo_empleado,
      tipoProfesor: newEmpleadoData.tipo_profesor || null,
      idOficina: parseInt(newEmpleadoData.id_oficina)
    };
    saveMutation.mutate(variables);
  };

  const handleDelete = (id) => {
    deleteMutation.mutate(id);
  };

  const isLoading = oficinasQuery.isLoading || empleadosQuery.isLoading || saveMutation.isPending || deleteMutation.isPending;
  const isError = oficinasQuery.isError || empleadosQuery.isError;
  const errorMessage = oficinasQuery.error?.message || empleadosQuery.error?.message;

  if (isLoading) return <div className="text-center mt-8">Cargando empleados y oficinas...</div>;
  if (isError) return <div className="text-center mt-8 text-red-500">Error: {errorMessage}</div>;

  const empleadosData = empleadosQuery.data || [];
  const oficinasData = oficinasQuery.data || [];

  const empleadoColumns = [
    { header: "Identificación", accessor: "id_empleado" },
    { header: "Nombre", accessor: "nombre" },
    { header: "Tipo Empleado", accessor: "tipo_empleado" },
    { header: "Tipo Profesor", accessor: "tipo_profesor", render: (row) => row.tipo_profesor || "N/A" },
    { header: "Oficina", accessor: "oficina_nombre" },
    {
      header: "Acciones",
      render: (row) => (
        <>
          <button onClick={() => handleEditClick(row)} className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-1 px-3 rounded-lg mr-4">Editar</button>
          <button onClick={() => handleDelete(row.id_empleado)} className="bg-red-500 hover:bg-red-600 text-white font-bold py-1 px-3 rounded-lg">Eliminar</button>
        </>
      ),
    },
  ];

  const empleadoFields = [
    { label: "Identificación", name: "id_empleado", type: "text", value: newEmpleadoData.id_empleado, onChange: (e) => setNewEmpleadoData({ ...newEmpleadoData, id_empleado: e.target.value }), required: true, readOnly: !!editingEmpleado, inputClassName: "bg-gray-300 text-gray-900" },
    { label: "Nombre", name: "nombre", type: "text", value: newEmpleadoData.nombre, onChange: (e) => setNewEmpleadoData({ ...newEmpleadoData, nombre: e.target.value }), required: true, inputClassName: "bg-gray-300 text-gray-900" },
    { label: "Tipo de Empleado", name: "tipo_empleado", type: "select", value: newEmpleadoData.tipo_empleado, onChange: (e) => setNewEmpleadoData({ ...newEmpleadoData, tipo_empleado: e.target.value, tipo_profesor: e.target.value === "administrativo" ? "" : newEmpleadoData.tipo_profesor }), options: [{ value: "profesor", label: "Profesor" }, { value: "administrativo", label: "Administrativo" }], placeholder: "Seleccione un tipo", required: true, inputClassName: "bg-gray-300 text-gray-900" },
    ...(newEmpleadoData.tipo_empleado === "profesor" ? [{ label: "Tipo de Profesor", name: "tipo_profesor", type: "select", value: newEmpleadoData.tipo_profesor, onChange: (e) => setNewEmpleadoData({ ...newEmpleadoData, tipo_profesor: e.target.value }), options: [{ value: "planta", label: "Planta" }, { value: "contratista", label: "Contratista" }], placeholder: "Seleccione tipo de profesor", required: true, inputClassName: "bg-gray-300 text-gray-900" }] : []),
    { label: "Oficina", name: "id_oficina", type: "select", value: newEmpleadoData.id_oficina, onChange: (e) => setNewEmpleadoData({ ...newEmpleadoData, id_oficina: parseInt(e.target.value) }), options: oficinasData.map((oficina) => ({ value: oficina.id_oficina, label: oficina.nombre })), placeholder: "Seleccione una oficina", required: true, inputClassName: "bg-gray-300 text-gray-900" },
  ];

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-3xl font-bold mb-6 text-black">Administrar Empleados</h1>
      <div className="flex flex-col md:flex-row gap-6">
        <Table data={empleadosData} columns={empleadoColumns} />
        <Form title={editingEmpleado ? "Editar Empleado" : "Crear Nuevo Empleado"} fields={empleadoFields} onSubmit={handleSubmit} submitText={editingEmpleado ? "Actualizar Empleado" : "Guardar Empleado"} />
      </div>
    </div>
  );
};

export default EmpleadosPage;