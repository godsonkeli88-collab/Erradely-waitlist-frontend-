import React from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import clsx from 'clsx'
import { LayoutDashboard, ClipboardList, MapPin, MessageCircle, User, Briefcase, Star, Truck } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

interface BnItem { icon: React.FC<{ size?: number }>; label: string; path: string; badge?: number }

const CLIENT_NAV: BnItem[] = [
  { icon: LayoutDashboard, label: 'Home',     path: '/dashboard' },
  { icon: ClipboardList,   label: 'Jobs',     path: '/dashboard/jobs' },
  { icon: MapPin,          label: 'Nearby',   path: '/dashboard/nearby' },
  { icon: MessageCircle,   label: 'Chat',     path: '/dashboard/messages', badge: 3 },
  { icon: User,            label: 'Profile',  path: '/dashboard/profile' },
]
const WORKER_NAV: BnItem[] = [
  { icon: LayoutDashboard, label: 'Home',     path: '/worker' },
  { icon: Briefcase,       label: 'Feed',     path: '/worker/feed' },
  { icon: MapPin,          label: 'Nearby',   path: '/worker/nearby' },
  { icon: MessageCircle,   label: 'Chat',     path: '/worker/messages', badge: 2 },
  { icon: User,            label: 'Profile',  path: '/worker/profile' },
]
const DELIVERY_NAV: BnItem[] = [
  { icon: LayoutDashboard, label: 'Home',     path: '/delivery' },
  { icon: Truck,           label: 'Orders',   path: '/delivery/orders' },
  { icon: MapPin,          label: 'Nearby',   path: '/delivery/nearby' },
  { icon: MessageCircle,   label: 'Chat',     path: '/delivery/messages', badge: 1 },
  { icon: User,            label: 'Profile',  path: '/delivery/profile' },
]
const BUSINESS_NAV: BnItem[] = [
  { icon: LayoutDashboard, label: 'Home',     path: '/business' },
  { icon: ClipboardList,   label: 'Requests', path: '/business/requests' },
  { icon: MapPin,          label: 'Nearby',   path: '/business/nearby' },
  { icon: MessageCircle,   label: 'Chat',     path: '/business/messages', badge: 2 },
  { icon: User,            label: 'Profile',  path: '/business/profile' },
]
const FREELANCER_NAV: BnItem[] = [
  { icon: LayoutDashboard, label: 'Home',     path: '/freelancer' },
  { icon: Star,            label: 'Plan',     path: '/freelancer/subscription' },
  { icon: User,            label: 'Profile',  path: '/freelancer/profile' },
]

const NAV_MAP: Record<string, BnItem[]> = {
  client: CLIENT_NAV, worker: WORKER_NAV,
  delivery: DELIVERY_NAV, business: BUSINESS_NAV, freelancer: FREELANCER_NAV,
}

export const BottomNav: React.FC = () => {
  const { user }  = useAuth()
  const location  = useNavigate()
  const loc       = useLocation()
  const navigate  = useNavigate()
  const items     = NAV_MAP[user?.role || 'client'] || CLIENT_NAV

  return (
    <nav className="bottom-nav">
      <div className="bn-inner">
        {items.map(item => {
          const Icon     = item.icon
          const isActive = loc.pathname === item.path ||
            (item.path.split('/').length > 2 && loc.pathname.startsWith(item.path))
          return (
            <button key={item.path} className={clsx('bn-btn', isActive && 'act')} onClick={() => navigate(item.path)}>
              {item.badge && <div className="bn-badge">{item.badge}</div>}
              <Icon size={22} className="bn-icon-svg" />
              <span>{item.label}</span>
            </button>
          )
        })}
      </div>
    </nav>
  )
}
