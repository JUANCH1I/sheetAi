"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import * as XLSX from "xlsx"
import { supabase } from "../supabase"
import "./FileUploader.css"

export const FileUploader = ({ user }) => {
  const [dragActive, setDragActive] = useState(false)
  const [status, setStatus] = useState("idle")
  const navigate = useNavigate()

  const processExcelFile = async (file) => {
    setStatus("processing")
    const reader = new FileReader()
    reader.onload = async (e) => {
      try {
        const data = e.target.result
        const workbook = XLSX.read(data, { type: "binary" })
        const sheetName = workbook.SheetNames[0]
        const worksheet = workbook.Sheets[sheetName]
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 })

        const headers = jsonData[0]
        const rows = jsonData.slice(1)

        // Guardar en Supabase
        const { data: tableData, error } = await supabase
          .from("tables")
          .insert({
            user_id: user.id,
            name: file.name,
            columns: headers,
            rows: rows.map((row) => Object.fromEntries(headers.map((header, index) => [header, row[index]]))),
          })
          .single()

        if (error) throw error

        setStatus("processed")
        navigate(`/table/${tableData.id}`)
      } catch (error) {
        console.error("Error processing file:", error)
        setStatus("error")
      }
    }
    reader.onerror = (error) => {
      console.error("Error reading file:", error)
      setStatus("error")
    }
    reader.readAsBinaryString(file)
  }

  const handleDrag = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processExcelFile(e.dataTransfer.files[0])
    }
  }

  const handleChange = (e) => {
    e.preventDefault()
    if (e.target.files && e.target.files[0]) {
      processExcelFile(e.target.files[0])
    }
  }

  return (
    <div
      className={`file-uploader ${dragActive ? "drag-active" : ""}`}
      onDragEnter={handleDrag}
      onDragLeave={handleDrag}
      onDragOver={handleDrag}
      onDrop={handleDrop}
    >
      <input type="file" id="file-upload" onChange={handleChange} accept=".xlsx,.xls" />
      <label htmlFor="file-upload">
        <span>Elige un archivo</span> o arrástralo aquí
      </label>
    </div>
  )
}

