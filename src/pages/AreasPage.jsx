// src/pages/AreasPage.jsx (código actualizado)

import React, { useState, useEffect } from "react";
import {
  getAreas,
  createArea,
  deleteArea,
  updateArea,
} from "../services/areas.service";
import Table from "../components/Table";
import Form from "../components/Form";

const AreasPage = () => {
  const [areas, setAreas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newAreaName, setNewAreaName] = useState("");
  const [editingArea, setEditingArea] = useState(null); // Nuevo estado para la edición

  const fetchAreas = async () => {
    try {
      const areasData = await getAreas();
      setAreas(areasData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAreas();
  }, []);

  const handleEditClick = (area) => {
    setEditingArea(area);
    setNewAreaName(area.nombre);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingArea) {
        // Lógica para actualizar
        await updateArea(editingArea.id_area, { nombre: newAreaName });
        setEditingArea(null); // Desactivar el modo de edición
      } else {
        // Lógica para crear
        await createArea({ nombre: newAreaName });
      }
      setNewAreaName(""); // Limpiar el input
      fetchAreas(); // Recargar la lista
    } catch (err) {
      setError("No se pudo guardar el área. Intente de nuevo.");
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteArea(id);
      fetchAreas(); // Vuelve a cargar la lista después de eliminar
    } catch (err) {
      setError("No se pudo eliminar el área. Intente de nuevo.");
    }
  };

  if (loading) {
    return <div className="text-center mt-8">Cargando áreas...</div>;
  }

  if (error) {
    return <div className="text-center mt-8 text-red-500">Error: {error}</div>;
  }

  // Columnas para la tabla de áreas
  const areaColumns = [
    { header: "ID", accessor: "id_area" },
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
          {/* MODIFICACIÓN: Botón Eliminar con fondo rojo y texto blanco */}
          <button
            onClick={() => handleDelete(row.id_area)}
            className="bg-red-500 hover:bg-red-600 text-white font-bold py-1 px-3 rounded-lg"
          >
            Eliminar
          </button>
        </>
      ),
    },
  ];

  // Campos para el formulario de áreas
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
      <Table data={areas} columns={areaColumns} />
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
