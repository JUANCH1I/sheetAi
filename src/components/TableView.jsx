"use client"

import { useState, useEffect } from "react"
import { useParams } from "react-router-dom"
import { supabase } from "../supabase"
import "./TableView.css"

export const TableView = ({ user }) => {
  const { id } = useParams()
  const [tableData, setTableData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchTableData = async () => {
      const { data, error } = await supabase.from("tables").select("*").eq("id", id).single()

      if (error) {
        console.error("Error fetching table:", error)
      } else {
        setTableData(data)
      }
      setLoading(false)
    }

    fetchTableData()
  }, [id])

  const addRow = async (newRow) => {
    const { data, error } = await supabase
      .from("tables")
      .update({
        rows: [...tableData.rows, newRow],
      })
      .eq("id", id)

    if (error) {
      console.error("Error adding row:", error)
    } else {
      setTableData((prevData) => ({
        ...prevData,
        rows: [...prevData.rows, newRow],
      }))
    }
  }

  const updateRow = async (index, updatedRow) => {
    const updatedRows = [...tableData.rows]
    updatedRows[index] = updatedRow

    const { data, error } = await supabase.from("tables").update({ rows: updatedRows }).eq("id", id)

    if (error) {
      console.error("Error updating row:", error)
    } else {
      setTableData((prevData) => ({
        ...prevData,
        rows: updatedRows,
      }))
    }
  }

  const deleteRow = async (index) => {
    const updatedRows = tableData.rows.filter((_, i) => i !== index)

    const { data, error } = await supabase.from("tables").update({ rows: updatedRows }).eq("id", id)

    if (error) {
      console.error("Error deleting row:", error)
    } else {
      setTableData((prevData) => ({
        ...prevData,
        rows: updatedRows,
      }))
    }
  }

  if (loading) {
    return <div>Cargando...</div>
  }

  if (!tableData) {
    return <div>Tabla no encontrada</div>
  }

  return (
    <div className="table-view-container">
      <h2>{tableData.name}</h2>
      <table>
        <thead>
          <tr>
            {tableData.columns.map((column) => (
              <th key={column}>{column}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {tableData.rows.map((row, index) => (
            <tr key={index}>
              {tableData.columns.map((column) => (
                <td key={column}>{row[column]}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <div className="crud-buttons">
        <button
          onClick={() => {
            /* Lógica para mostrar formulario de agregar */
          }}
        >
          Agregar Fila
        </button>
        <button
          onClick={() => {
            /* Lógica para mostrar formulario de editar */
          }}
        >
          Editar Fila
        </button>
        <button
          onClick={() => {
            /* Lógica para confirmar eliminación */
          }}
        >
          Eliminar Fila
        </button>
      </div>
    </div>
  )
}

