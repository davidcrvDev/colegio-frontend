// src/pages/SalonesPage.jsx

import React, { useState, useEffect } from "react";
import {
  getSalones,
  createSalon,
  deleteSalon,
  updateSalon,
} from "../services/salones.service";
import Table from "../components/Table";
import Form from "../components/Form";

const SalonesPage = () => {
  const [salones, setSalones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newSalonData, setNewSalonData] = useState({ codigo: "" });
  const [editingSalon, setEditingSalon] = useState(null);

  const fetchSalones = async () => {
    try {
      const salonesData = await getSalones();
      setSalones(salonesData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSalones();
  }, []);

  const handleEditClick = (salon) => {
    setEditingSalon(salon);
    setNewSalonData({ codigo: salon.codigo });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingSalon) {
        await updateSalon(editingSalon.id_salon, newSalonData);
        setEditingSalon(null);
      } else {
        await createSalon(newSalonData);
      }
      setNewSalonData({ codigo: "" });
      fetchSalones();
    } catch (err) {
      setError("No se pudo guardar el salón. Intente de nuevo.");
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteSalon(id);
      fetchSalones();
    } catch (err) {
      setError("No se pudo eliminar el salón. Intente de nuevo.");
    }
  };

  if (loading) {
    return <div className="text-center mt-8">Cargando salones...</div>;
  }

  if (error) {
    return <div className="text-center mt-8 text-red-500">Error: {error}</div>;
  }

  // Columnas para la tabla de salones
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
          {/* MODIFICACIÓN: Botón Eliminar con fondo rojo y texto blanco */}
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

  // Campos para el formulario de salones
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
    {/* CAMBIO: Se agrega un contenedor flex para alinear la tabla y el formulario */}
    <div className="flex flex-col md:flex-row gap-6">
      <Table data={salones} columns={salonColumns} />
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
