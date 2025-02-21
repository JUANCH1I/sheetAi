import "./ProcessingStatus.css"

export const ProcessingStatus = ({ status }) => {
  let message = ""
  let statusClass = ""

  switch (status) {
    case "idle":
      message = "Listo para procesar archivo"
      statusClass = "status-idle"
      break
    case "processing":
      message = "Procesando archivo..."
      statusClass = "status-processing"
      break
    case "processed":
      message = "Archivo procesado exitosamente"
      statusClass = "status-processed"
      break
    case "error":
      message = "Error al procesar archivo"
      statusClass = "status-error"
      break
    default:
      message = "Estado desconocido"
      statusClass = "status-unknown"
  }

  return <div className={`processing-status ${statusClass}`}>{message}</div>
}

