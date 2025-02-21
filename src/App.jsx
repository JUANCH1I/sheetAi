"use client"

import { useState, useEffect } from "react"
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom"
import { supabase } from "./supabase"
import { Login } from "./components/Login"
import { Register } from "./components/Register"
import { Dashboard } from "./components/Dashboard"
import { TableView } from "./components/TableView"
import { FileUploader } from "./components/FileUploader"
import "./App.css"

function App() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      setUser(session?.user ?? null)
      setLoading(false)
    }

    getSession()

    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null)
      setLoading(false)
    })

    return () => {
      // En Supabase v2, la suscripción se encuentra en authListener.subscription
      authListener.subscription?.unsubscribe()
    }
  }, [])

  if (loading) {
    return <div>Cargando...</div>
  }

  return (
    <Router>
      <div className="app-container">
        <Routes>
          <Route
            path="/"
            element={user ? <Navigate to="/dashboard" /> : <Login />}
          />
          <Route
            path="/register"
            element={user ? <Navigate to="/dashboard" /> : <Register />}
          />
          <Route
            path="/dashboard"
            element={user ? <Dashboard user={user} /> : <Navigate to="/" />}
          />
          <Route
            path="/table/:id"
            element={user ? <TableView user={user} /> : <Navigate to="/" />}
          />
          <Route
            path="/upload"
            element={user ? <FileUploader user={user} /> : <Navigate to="/" />}
          />
        </Routes>
      </div>
    </Router>
  )
  
}

export default App

