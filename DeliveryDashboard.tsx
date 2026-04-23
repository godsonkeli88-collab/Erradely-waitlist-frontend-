import React, { useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import { Bell, LogOut, Moon, Sun } from 'lucide-react'
import { AppLayout, ActivitySwitch } from '../../components/AppLayout'
import { BottomNav } from '../../components/BottomNav'
import DeliveryHome from './DeliveryHome'
import DeliveryOrders from './DeliveryOrders'

import NearbyMap from '../shared/NearbyMap'
import Messages from '../shared/Messages'
import Notifications from '../shared/Notifications'
import Subscription from '../shared/Subscription'
import Profile from '../shared/Profile'
import Settings from '../shared/Settings'
import { useAuth } from '../../context/AuthContext'

const DeliveryDashboard: React.FC = () => {
  const { logout } = useAuth()
  const [darkMode, setDarkMode] = useState(true)

  const navItems = [
    { label: 'Dashboard',         path: '/delivery' },
    { label: 'Order Feed', path: '/delivery/orders', badge: 8 },
    { label: 'Active',            path: '/delivery/active' },
    { label: 'Nearby People',     path: '/delivery/nearby' },
    { label: 'Messages',          path: '/delivery/messages', badge: 1 },
    { label: 'Notifications',     path: '/delivery/notifications' },
    { label: 'Subscription',      path: '/delivery/subscription' },
    { label: 'Profile', path: '/delivery/profile' },
    { label: 'Settings',          path: '/delivery/settings' },
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
      <AppLayout navItems={navItems} title="Delivery Dashboard" headerRight={headerRight} sidebarBottom={<ActivitySwitch />}>
        <Routes>
          <Route index              element={<DeliveryHome />} />
          <Route path="orders"    element={<DeliveryOrders />} />
          <Route path="active"      element={<DeliveryOrders activeOnly />} />
          <Route path="nearby"      element={<NearbyMap />} />
          <Route path="messages"    element={<Messages />} />
          <Route path="notifications" element={<Notifications />} />
          <Route path="subscription"  element={<Subscription />} />
          <Route path="profile"     element={<Profile />} />
          <Route path="settings"    element={<Settings />} />
        </Routes>
      </AppLayout>
      <BottomNav />
    </>
  )
}

export default DeliveryDashboard
