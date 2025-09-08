// src/pages/OficinasPage.jsx

import React, { useState, useEffect } from "react";
import {
  getOficinas,
  createOficina,
  deleteOficina,
  updateOficina,
} from "../services/oficinas.service";
import { getAreas } from "../services/areas.service";
import Table from "../components/Table";
import Form from "../components/Form";

const OficinasPage = () => {
  const [oficinas, setOficinas] = useState([]);
  const [areas, setAreas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newOficinaData, setNewOficinaData] = useState({
    codigo: "",
    nombre: "",
    id_area: "",
  });
  const [editingOficina, setEditingOficina] = useState(null);

  const fetchOficinas = async () => {
    try {
      const oficinasData = await getOficinas();
      setOficinas(oficinasData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchAreas = async () => {
    try {
      const areasData = await getAreas();
      setAreas(areasData);
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    fetchOficinas();
    fetchAreas();
  }, []);

  const handleEditClick = (oficina) => {
    setEditingOficina(oficina);
    setNewOficinaData({
      codigo: oficina.codigo,
      nombre: oficina.nombre,
      id_area: oficina.id_area,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingOficina) {
        await updateOficina(editingOficina.id_oficina, newOficinaData);
        setEditingOficina(null);
      } else {
        await createOficina(newOficinaData);
      }
      setNewOficinaData({ codigo: "", nombre: "", id_area: "" });
      fetchOficinas();
    } catch (err) {
      setError("No se pudo guardar la oficina. Intente de nuevo.");
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteOficina(id);
      fetchOficinas();
    } catch (err) {
      setError("No se pudo eliminar la oficina. Intente de nuevo.");
    }
  };

  if (loading) {
    return <div className="text-center mt-8">Cargando oficinas...</div>;
  }

  if (error) {
    return <div className="text-center mt-8 text-red-500">Error: {error}</div>;
  }

  // Columnas para la tabla de oficinas
  const oficinaColumns = [
    { header: "ID", accessor: "id_oficina" },
    { header: "Código", accessor: "codigo" },
    { header: "Nombre", accessor: "nombre" },
    {
      header: "Área",
      accessor: "id_area",
      render: (row) =>
        areas.find((area) => area.id_area === row.id_area)?.nombre || "N/A",
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
            onClick={() => handleDelete(row.id_oficina)}
            className="bg-red-500 hover:bg-red-600 text-white font-bold py-1 px-3 rounded-lg"
          >
            Eliminar
          </button>
        </>
      ),
    },
  ];

  // Campos para el formulario de oficinas
  const oficinaFields = [
    {
      label: "Código",
      name: "codigo",
      type: "text",
      value: newOficinaData.codigo,
      onChange: (e) =>
        setNewOficinaData({ ...newOficinaData, codigo: e.target.value }),
      required: true,
      inputClassName: "bg-gray-300 text-gray-900",
    },
    {
      label: "Nombre",
      name: "nombre",
      type: "text",
      value: newOficinaData.nombre,
      onChange: (e) =>
        setNewOficinaData({ ...newOficinaData, nombre: e.target.value }),
      required: true,
      inputClassName: "bg-gray-300 text-gray-900",
    },
    {
      label: "Área",
      name: "id_area",
      type: "select",
      value: newOficinaData.id_area,
      onChange: (e) =>
        setNewOficinaData({
          ...newOficinaData,
          id_area: parseInt(e.target.value),
        }),
      options: areas.map((area) => ({
        value: area.id_area,
        label: area.nombre,
      })),
      placeholder: "Seleccione un área",
      required: true,
      inputClassName: "bg-gray-300 text-gray-900",
    },
  ];

  return (
    <div className="flex flex-col gap-6">
    <h1 className="text-3xl font-bold mb-6 text-black">Administrar Oficinas</h1>
    <div className="flex flex-col md:flex-row gap-6">
      <Table data={oficinas} columns={oficinaColumns} />
      <Form
        title={editingOficina ? "Editar Oficina" : "Crear Nueva Oficina"}
        fields={oficinaFields}
        onSubmit={handleSubmit}
        submitText={editingOficina ? "Actualizar Oficina" : "Guardar Oficina"}
      />
    </div>
  </div>
  );
};

export default OficinasPage;
