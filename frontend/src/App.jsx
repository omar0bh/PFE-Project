import React, { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Dashboard from './pages/Dashboard'
import Sources from './pages/Sources'
import Articles from './pages/Articles'
import EmailSettings from './pages/EmailSettings'
import Toast from './components/Toast'

function App() {
  const [toasts, setToasts] = useState([])

  useEffect(() => {
    const handleToast = (event) => {
      const id = Date.now()
      const toast = { id, ...event.detail }
      setToasts((prev) => [...prev, toast])
      
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id))
      }, 3500)
    }

    window.addEventListener('toast', handleToast)
    return () => window.removeEventListener('toast', handleToast)
  }, [])

  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/sources" element={<Sources />} />
          <Route path="/articles" element={<Articles />} />
          <Route path="/email-settings" element={<EmailSettings />} />
        </Routes>
      </Layout>
      <div className="fixed top-4 right-4 space-y-2 pointer-events-none">
        {toasts.map((toast) => (
          <Toast key={toast.id} message={toast.message} type={toast.type} />
        ))}
      </div>
    </Router>
  )
}

export default App
