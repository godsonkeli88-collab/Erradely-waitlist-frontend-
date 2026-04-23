import React, { useState } from 'react'
import { Routes, Route, useNavigate } from 'react-router-dom'
import { Plus, Bell, LogOut, Moon, Sun } from 'lucide-react'
import { AppLayout } from '../../components/AppLayout'
import { BottomNav } from '../../components/BottomNav'
import { PostJobModal } from '../../components/PostJobModal'
import { useAuth } from '../../context/AuthContext'
import ClientHome from './ClientHome'
import ClientJobs from './ClientJobs'
import ClientWorkers from './ClientWorkers'
import ClientMap from './ClientMap'
import NearbyMap from '../shared/NearbyMap'
import Messages from '../shared/Messages'
import Notifications from '../shared/Notifications'
import Subscription from '../shared/Subscription'
import Profile from '../shared/Profile'
import Settings from '../shared/Settings'

const ClientDashboard: React.FC = () => {
  const { logout } = useAuth()
  const navigate   = useNavigate()
  const [postOpen, setPostOpen]   = useState(false)
  const [darkMode, setDarkMode]   = useState(true)

  const navItems = [
    { label: 'Dashboard',     path: '/dashboard' },
    { label: 'My Jobs',       path: '/dashboard/jobs' },
    { label: 'Find Workers',  path: '/dashboard/workers' },
    { label: 'Nearby People', path: '/dashboard/nearby' },
    { label: 'Job Map',       path: '/dashboard/map' },
    { label: 'Messages',      path: '/dashboard/messages',      badge: 3 },
    { label: 'Notifications', path: '/dashboard/notifications', badge: 7 },
    { label: 'Subscription',  path: '/dashboard/subscription' },
    { label: 'Profile',       path: '/dashboard/profile' },
    { label: 'Settings',      path: '/dashboard/settings' },
  ]

  const toggleTheme = () => {
    const next = darkMode ? 'light' : 'dark'
    document.documentElement.setAttribute('data-theme', next)
    localStorage.setItem('erradely_theme', next)
    setDarkMode(!darkMode)
  }

  const headerRight = (
    <div className="flex ac g2">
      <button className="hd-icon-btn" onClick={toggleTheme} title="Toggle theme">
        {darkMode ? <Sun size={17} /> : <Moon size={17} />}
      </button>
      <button className="hd-icon-btn" onClick={() => navigate('/dashboard/notifications')} title="Notifications">
        <Bell size={17} />
        <div className="notif-dot" />
      </button>
      <button className="btn btp btn-sm" onClick={() => setPostOpen(true)}>
        <Plus size={15} /> Post Job
      </button>
      <button className="hd-icon-btn" onClick={logout} title="Sign out">
        <LogOut size={16} />
      </button>
    </div>
  )

  return (
    <>
      <AppLayout navItems={navItems} title="Dashboard" headerRight={headerRight}>
        <Routes>
          <Route index                element={<ClientHome onPostJob={() => setPostOpen(true)} />} />
          <Route path="jobs"          element={<ClientJobs onPostJob={() => setPostOpen(true)} />} />
          <Route path="workers"       element={<ClientWorkers />} />
          <Route path="nearby"        element={<NearbyMap />} />
          <Route path="map"           element={<ClientMap />} />
          <Route path="messages"      element={<Messages />} />
          <Route path="notifications" element={<Notifications />} />
          <Route path="subscription"  element={<Subscription />} />
          <Route path="profile"       element={<Profile />} />
          <Route path="settings"      element={<Settings />} />
        </Routes>
      </AppLayout>
      <BottomNav />
      <PostJobModal open={postOpen} onClose={() => setPostOpen(false)} onPosted={() => navigate('/dashboard/jobs')} />
    </>
  )
}

export default ClientDashboard
