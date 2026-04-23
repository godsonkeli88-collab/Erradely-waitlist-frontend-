import React, { useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AuthProvider, useAuth } from './context/AuthContext'
import { SocketProvider } from './context/SocketContext'
import { ProtectedRoute } from './components/AppLayout'

import Watchlist           from './pages/Watchlist'
import Landing             from './pages/Landing'
import Login               from './pages/auth/Login'
import Signup              from './pages/auth/Signup'
import ClientDashboard     from './pages/client/ClientDashboard'
import WorkerDashboard     from './pages/worker/WorkerDashboard'
import DeliveryDashboard   from './pages/delivery/DeliveryDashboard'
import BusinessDashboard   from './pages/business/BusinessDashboard'
import FreelancerDashboard from './pages/freelancer/FreelancerDashboard'
import AdminDashboard      from './pages/admin/AdminDashboard'

// WATCHLIST_MODE = true  → show watchlist, block all other routes
// WATCHLIST_MODE = false → full platform live
const WATCHLIST_MODE = import.meta.env.VITE_WATCHLIST_MODE === 'true'

const HomeRedirect: React.FC = () => {
  const { user, loading } = useAuth()
  if (loading) return null
  if (WATCHLIST_MODE && !user) return <Watchlist />
  if (!user) return <Landing />
  const map: Record<string, string> = {
    client:'dashboard', worker:'worker', delivery:'delivery',
    business:'business', freelancer:'freelancer', admin:'admin',
  }
  return <Navigate to={`/${map[user.role] || 'dashboard'}`} replace />
}

const OAuthCallback: React.FC = () => {
  const { refresh } = useAuth()
  const navigate = useNavigate()
  useEffect(() => {
    const token = new URLSearchParams(window.location.search).get('token')
    if (token) {
      localStorage.setItem('erradely_token', token)
      window.history.replaceState({}, '', '/')
      refresh().then(() => navigate('/', { replace: true }))
    } else navigate('/login', { replace: true })
  }, [])
  return (
    <div style={{ height:'100vh', display:'flex', alignItems:'center', justifyContent:'center',
      background:'#060d09', color:'#8fb8a0', fontFamily:"'Plus Jakarta Sans',sans-serif", gap:12 }}>
      <img src="/erradely-logo.jpg" style={{ width:36, height:36, borderRadius:9 }} alt="Erradely" />
      Signing you in...
    </div>
  )
}

const AppRoutes: React.FC = () => (
  <Routes>
    <Route path="/"              element={<HomeRedirect />} />
    <Route path="/watchlist"     element={<Watchlist />} />
    <Route path="/auth/callback" element={<OAuthCallback />} />

    {/* Block login/signup while in watchlist mode */}
    <Route path="/login"   element={WATCHLIST_MODE ? <Navigate to="/" replace /> : <Login />} />
    <Route path="/signup"  element={WATCHLIST_MODE ? <Navigate to="/" replace /> : <Signup />} />

    {/* Protected dashboards — blocked automatically when WATCHLIST_MODE is on (no token) */}
    <Route path="/dashboard/*"  element={<ProtectedRoute allowedRoles={['client']}><ClientDashboard /></ProtectedRoute>} />
    <Route path="/worker/*"     element={<ProtectedRoute allowedRoles={['worker']}><WorkerDashboard /></ProtectedRoute>} />
    <Route path="/delivery/*"   element={<ProtectedRoute allowedRoles={['delivery']}><DeliveryDashboard /></ProtectedRoute>} />
    <Route path="/business/*"   element={<ProtectedRoute allowedRoles={['business']}><BusinessDashboard /></ProtectedRoute>} />
    <Route path="/freelancer/*" element={<ProtectedRoute allowedRoles={['freelancer']}><FreelancerDashboard /></ProtectedRoute>} />
    <Route path="/admin/*"      element={<ProtectedRoute allowedRoles={['admin']}><AdminDashboard /></ProtectedRoute>} />

    <Route path="*" element={<Navigate to="/" replace />} />
  </Routes>
)

const App: React.FC = () => (
  <BrowserRouter>
    <AuthProvider>
      <SocketProvider>
        <AppRoutes />
        <Toaster position="top-right" toastOptions={{
          duration: 4000,
          style: {
            background:'#1b3821', color:'#eef7f0',
            border:'1px solid rgba(34,197,94,.2)', borderRadius:'14px',
            fontSize:'13px', fontFamily:"'Plus Jakarta Sans',sans-serif",
            boxShadow:'0 12px 48px rgba(0,0,0,.65)',
          },
        }} />
      </SocketProvider>
    </AuthProvider>
  </BrowserRouter>
)

export default App
