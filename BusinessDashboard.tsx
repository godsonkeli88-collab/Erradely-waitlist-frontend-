import React, { useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import { Bell, LogOut, Moon, Sun } from 'lucide-react'
import { AppLayout, ActivitySwitch } from '../../components/AppLayout'
import { BottomNav } from '../../components/BottomNav'
import BusinessHome from './BusinessHome'
import BusinessRequests from './BusinessRequests'
import BusinessProfile from './BusinessProfile'
import NearbyMap from '../shared/NearbyMap'
import Messages from '../shared/Messages'
import Notifications from '../shared/Notifications'
import Subscription from '../shared/Subscription'
import Profile from '../shared/Profile'
import Settings from '../shared/Settings'
import { useAuth } from '../../context/AuthContext'

const BusinessDashboard: React.FC = () => {
  const { logout } = useAuth()
  const [darkMode, setDarkMode] = useState(true)

  const navItems = [
    { label: 'Dashboard',         path: '/business' },
    { label: 'Service Requests', path: '/business/requests', badge: 5 },
    { label: 'Active',            path: '/business/active' },
    { label: 'Nearby People',     path: '/business/nearby' },
    { label: 'Messages',          path: '/business/messages', badge: 2 },
    { label: 'Notifications',     path: '/business/notifications' },
    { label: 'Subscription',      path: '/business/subscription' },
    { label: 'Business Profile', path: '/business/profile' },
    { label: 'Settings',          path: '/business/settings' },
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
      <button className="hd-icon-btn" title="Notifications"><Bell size={17} /></button>
      <button className="hd-icon-btn" onClick={logout} title="Sign out"><LogOut size={16} /></button>
    </div>
  )

  return (
    <>
      <AppLayout navItems={navItems} title="Business Dashboard" headerRight={headerRight} sidebarBottom={<ActivitySwitch />}>
        <Routes>
          <Route index              element={<BusinessHome />} />
          <Route path="requests"    element={<BusinessRequests />} />
          <Route path="active"      element={<BusinessRequests activeOnly />} />
          <Route path="nearby"      element={<NearbyMap />} />
          <Route path="messages"    element={<Messages />} />
          <Route path="notifications" element={<Notifications />} />
          <Route path="subscription"  element={<Subscription />} />
          <Route path="profile"     element={<BusinessProfile />} />
          <Route path="settings"    element={<Settings />} />
        </Routes>
      </AppLayout>
      <BottomNav />
    </>
  )
}

export default BusinessDashboard
