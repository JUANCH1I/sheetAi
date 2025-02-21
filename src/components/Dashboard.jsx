"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { db } from "../firebase"
import "./Dashboard.css"

export const Dashboard = ({ user }) => {
  const [tables, setTables] = useState([])

  useEffect(() => {
    const fetchTables = async () => {
      const tablesRef = db.collection("users").doc(user.uid).collection("tables")
      const snapshot = await tablesRef.get()
      const tablesList = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
      setTables(tablesList)
    }

    fetchTables()
  }, [user])

  return (
    <div className="dashboard-container">
      <h2>Bienvenido, {user.email}</h2>
      <Link to="/upload" className="upload-button">
        Cargar nuevo Excel
      </Link>
      <h3>Tus Tablas:</h3>
      <div className="tables-list">
        {tables.map((table) => (
          <Link key={table.id} to={`/table/${table.id}`} className="table-item">
            {table.name}
          </Link>
        ))}
      </div>
    </div>
  )
}

