// src/pages/EmpleadosPage.jsx

import React, { useState, useEffect } from "react";
import {
  getEmpleados,
  createEmpleado,
  deleteEmpleado,
  updateEmpleado,
} from "../services/empleados.service";
import { getOficinas } from "../services/oficinas.service";
import Table from "../components/Table";
import Form from "../components/Form";

const EmpleadosPage = () => {
  const [empleados, setEmpleados] = useState([]);
  const [oficinas, setOficinas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newEmpleadoData, setNewEmpleadoData] = useState({
    id_empleado: "",
    nombre: "",
    tipo_empleado: "",
    tipo_profesor: "",
    id_oficina: "",
  });
  const [editingEmpleado, setEditingEmpleado] = useState(null);

  const fetchEmpleados = async () => {
    try {
      const empleadosData = await getEmpleados();
      setEmpleados(empleadosData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchOficinas = async () => {
    try {
      const oficinasData = await getOficinas();
      setOficinas(oficinasData);
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    fetchEmpleados();
    fetchOficinas();
  }, []);

  const handleEditClick = (empleado) => {
    setEditingEmpleado(empleado);
    setNewEmpleadoData({
      id_empleado: empleado.id_empleado,
      nombre: empleado.nombre,
      tipo_empleado: empleado.tipo_empleado,
      tipo_profesor: empleado.tipo_profesor,
      id_oficina: empleado.id_oficina,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingEmpleado) {
        await updateEmpleado(editingEmpleado.id_empleado, newEmpleadoData);
        setEditingEmpleado(null);
      } else {
        await createEmpleado(newEmpleadoData);
      }
      setNewEmpleadoData({
        id_empleado: "",
        nombre: "",
        tipo_empleado: "",
        tipo_profesor: "",
        id_oficina: "",
      });
      fetchEmpleados();
    } catch (err) {
      setError("No se pudo guardar el empleado. Intente de nuevo.");
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteEmpleado(id);
      fetchEmpleados();
    } catch (err) {
      setError("No se pudo eliminar el empleado. Intente de nuevo.");
    }
  };

  if (loading) {
    return <div className="text-center mt-8">Cargando empleados...</div>;
  }

  if (error) {
    return <div className="text-center mt-8 text-red-500">Error: {error}</div>;
  }

  // Columnas para la tabla de empleados
  const empleadoColumns = [
    { header: "Identificación", accessor: "id_empleado" },
    { header: "Nombre", accessor: "nombre" },
    { header: "Tipo Empleado", accessor: "tipo_empleado" },
    {
      header: "Tipo Profesor",
      accessor: "tipo_profesor",
      render: (row) => row.tipo_profesor || "N/A",
    },
    {
      header: "Oficina",
      accessor: "id_oficina",
      render: (row) =>
        oficinas.find((oficina) => oficina.id_oficina === row.id_oficina)
          ?.nombre || "Oficina no encontrada",
    },
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
          {/* MODIFICACIÓN: Botón Eliminar con fondo rojo y texto blanco */}
          <button
            onClick={() => handleDelete(row.id_empleado)}
            className="bg-red-500 hover:bg-red-600 text-white font-bold py-1 px-3 rounded-lg"
          >
            Eliminar
          </button>
        </>
      ),
    },
  ];

  // Campos para el formulario de empleados
  const empleadoFields = [
    {
      label: "Identificación",
      name: "id_empleado",
      type: "text",
      value: newEmpleadoData.id_empleado,
      onChange: (e) =>
        setNewEmpleadoData({
          ...newEmpleadoData,
          id_empleado: e.target.value,
        }),
      required: true,
      inputClassName: "bg-gray-300 text-gray-900",
    },
    {
      label: "Nombre",
      name: "nombre",
      type: "text",
      value: newEmpleadoData.nombre,
      onChange: (e) =>
        setNewEmpleadoData({ ...newEmpleadoData, nombre: e.target.value }),
      required: true,
      inputClassName: "bg-gray-300 text-gray-900",
    },
    {
      label: "Tipo de Empleado",
      name: "tipo_empleado",
      type: "select",
      value: newEmpleadoData.tipo_empleado,
      onChange: (e) =>
        setNewEmpleadoData({
          ...newEmpleadoData,
          tipo_empleado: e.target.value,
          tipo_profesor:
            e.target.value === "administrativo"
              ? ""
              : newEmpleadoData.tipo_profesor,
        }),
      options: [
        { value: "profesor", label: "Profesor" },
        { value: "administrativo", label: "Administrativo" },
      ],
      placeholder: "Seleccione un tipo",
      required: true,
      inputClassName: "bg-gray-300 text-gray-900",
    },
    ...(newEmpleadoData.tipo_empleado === "profesor"
      ? [
          {
            label: "Tipo de Profesor",
            name: "tipo_profesor",
            type: "select",
            value: newEmpleadoData.tipo_profesor,
            onChange: (e) =>
              setNewEmpleadoData({
                ...newEmpleadoData,
                tipo_profesor: e.target.value,
              }),
            options: [
              { value: "planta", label: "Planta" },
              { value: "contratista", label: "Contratista" },
            ],
            placeholder: "Seleccione tipo de profesor",
            required: true,
            inputClassName: "bg-gray-300 text-gray-900",
          },
        ]
      : []),
    {
      label: "Oficina",
      name: "id_oficina",
      type: "select",
      value: newEmpleadoData.id_oficina,
      onChange: (e) =>
        setNewEmpleadoData({
          ...newEmpleadoData,
          id_oficina: parseInt(e.target.value),
        }),
      options: oficinas.map((oficina) => ({
        value: oficina.id_oficina,
        label: oficina.nombre,
      })),
      placeholder: "Seleccione una oficina",
      required: true,
      inputClassName: "bg-gray-300 text-gray-900",
    },
  ];

  return (
    <div className="flex flex-col gap-6">
    <h1 className="text-3xl font-bold mb-6 text-black">Administrar Empleados</h1>
    {/* CAMBIO: Se agrega un contenedor flex para alinear la tabla y el formulario */}
    <div className="flex flex-col md:flex-row gap-6">
      <Table data={empleados} columns={empleadoColumns} />
      <Form
        title={editingEmpleado ? "Editar Empleado" : "Crear Nuevo Empleado"}
        fields={empleadoFields}
        onSubmit={handleSubmit}
        submitText={
          editingEmpleado ? "Actualizar Empleado" : "Guardar Empleado"
        }
      />
    </div>
  </div>
  );
};

export default EmpleadosPage;
