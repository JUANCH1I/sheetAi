"use client"

import { useState } from "react"
import { FileUploader } from "./components/FileUploader"
import { DataPreview } from "./components/DataPreview"
import { ProcessingStatus } from "./components/ProcessingStatus"
import { AnalysisResults } from "./components/AnalysisResults"
import "./App.css"

export default function App() {
  const [data, setData] = useState(null)
  const [status, setStatus] = useState("idle")
  const [analysis, setAnalysis] = useState(null)

  const handleFileProcessed = (processedData) => {
    setData(processedData)
    setStatus("processed")

    // Analizar los tipos de datos
    const dataTypes = {}
    Object.keys(processedData).forEach((sheetName) => {
      dataTypes[sheetName] = {}
      const sheet = processedData[sheetName]
      if (sheet.length > 0) {
        Object.keys(sheet[0]).forEach((column) => {
          const columnData = sheet.map((row) => row[column])
          dataTypes[sheetName][column] = detectDataType(columnData)
        })
      }
    })

    // Actualizar el análisis
    setAnalysis({
      totalSheets: Object.keys(processedData).length,
      totalRows: Object.values(processedData).reduce((acc, sheet) => acc + sheet.length, 0),
      dataTypes: dataTypes,
    })
  }

  // Función para detectar el tipo de datos de una columna
  const detectDataType = (columnData) => {
    const types = columnData.map((value) => {
      if (value === null || value === undefined) return "null"
      if (typeof value === "number") return "number"
      if (!isNaN(Date.parse(value))) return "date"
      if (typeof value === "boolean") return "boolean"
      return "string"
    })

    const uniqueTypes = [...new Set(types)]
    return uniqueTypes.length === 1 ? uniqueTypes[0] : "mixed"
  }

  return (
    <div className="app-container">
      <h1>Importación y Análisis de Excel</h1>
      <FileUploader onFileProcessed={handleFileProcessed} setStatus={setStatus} />
      <ProcessingStatus status={status} />
      {data && <DataPreview data={data} />}
      {analysis && <AnalysisResults analysis={analysis} />}
    </div>
  )
}

