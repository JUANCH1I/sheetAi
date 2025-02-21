'use client'

import { useState } from 'react'
import * as XLSX from 'xlsx'

export const FileUploader = ({ onFileProcessed, setStatus }) => {
  const [dragActive, setDragActive] = useState(false)

  const processExcelFile = (file) => {
    setStatus('processing')
    const reader = new FileReader()
    reader.onload = (e) => {
      const data = e.target.result
      const workbook = XLSX.read(data, { type: 'binary' })
      const processedData = {}

      workbook.SheetNames.forEach((sheetName) => {
        const worksheet = workbook.Sheets[sheetName]
        let jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 })

        // Filtrar filas vacías
        jsonData = jsonData.filter((row) =>
          row.some((cell) => cell !== null && cell !== '')
        )

        // Detectar fila de encabezados
        const headerRowIndex = jsonData.findIndex(
          (row) =>
            row.filter(
              (cell) => typeof cell === 'string' && /[a-zA-Z]/.test(cell)
            ).length >
            row.length / 2
        )

        if (headerRowIndex !== -1) {
          const headers = jsonData[headerRowIndex]
          const dataRows = jsonData.slice(headerRowIndex + 1)
          processedData[sheetName] = dataRows.map((row) =>
            Object.fromEntries(
              headers.map((header, index) => [header, row[index]])
            )
          )
        } else {
          processedData[sheetName] = jsonData
        }
      })

      onFileProcessed(processedData)
    }
    reader.readAsBinaryString(file)
  }

  const handleDrag = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
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
      className={`border-2 border-dashed rounded-lg p-8 text-center ${
        dragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
      }`}
      onDragEnter={handleDrag}
      onDragLeave={handleDrag}
      onDragOver={handleDrag}
      onDrop={handleDrop}
    >
      <input
        type='file'
        id='file-upload'
        className='hidden'
        onChange={handleChange}
        accept='.xlsx,.xls'
      />
      <label htmlFor='file-upload' className='cursor-pointer'>
        <span className='text-blue-600 hover:text-blue-800'>
          Elige un archivo
        </span>{' '}
        o arrástralo aquí
      </label>
    </div>
  )
}
