"use client"

import { useState } from "react"
import "./DataPreview.css"

export const DataPreview = ({ data }) => {
  const [activeSheet, setActiveSheet] = useState(Object.keys(data)[0])

  return (
    <div className="data-preview">
      <h2>Vista Previa de Datos</h2>
      <div className="sheet-selector">
        <label htmlFor="sheet-select">Seleccionar Hoja:</label>
        <select id="sheet-select" value={activeSheet} onChange={(e) => setActiveSheet(e.target.value)}>
          {Object.keys(data).map((sheetName) => (
            <option key={sheetName} value={sheetName}>
              {sheetName}
            </option>
          ))}
        </select>
      </div>
      <div className="table-container">
        <table>
          <thead>
            <tr>
              {Object.keys(data[activeSheet][0] || {}).map((header) => (
                <th key={header}>{header}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data[activeSheet].slice(0, 10).map((row, index) => (
              <tr key={index}>
                {Object.values(row).map((cell, cellIndex) => (
                  <td key={cellIndex}>{cell}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {data[activeSheet].length > 10 && (
        <p className="preview-note">Mostrando las primeras 10 filas de {data[activeSheet].length} filas en total.</p>
      )}
    </div>
  )
}

