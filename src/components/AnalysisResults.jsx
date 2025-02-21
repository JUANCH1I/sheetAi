import "./AnalysisResults.css"

export const AnalysisResults = ({ analysis }) => {
  if (!analysis) {
    return null // or return a loading state
  }

  return (
    <div className="analysis-results">
      <h2>Resultados del Análisis</h2>
      <div className="results-container">
        <h3>Estadísticas del Archivo</h3>
        <dl>
          <div className="result-item">
            <dt>Total de Hojas</dt>
            <dd>{analysis.totalSheets}</dd>
          </div>
          <div className="result-item">
            <dt>Total de Filas</dt>
            <dd>{analysis.totalRows}</dd>
          </div>
        </dl>
        {analysis.dataTypes && (
          <>
            <h3>Tipos de Datos por Columna</h3>
            {Object.entries(analysis.dataTypes).map(([sheetName, columns]) => (
              <div key={sheetName}>
                <h4>{sheetName}</h4>
                <ul>
                  {Object.entries(columns).map(([column, type]) => (
                    <li key={column}>
                      {column}: {type}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  )
}

