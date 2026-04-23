import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './styles/globals.css'
import 'leaflet/dist/leaflet.css'

// Set default theme
document.documentElement.setAttribute('data-theme', 
  localStorage.getItem('erradely_theme') || 'dark'
)

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
