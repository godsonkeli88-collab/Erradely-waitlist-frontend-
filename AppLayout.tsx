import React, { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import clsx from 'clsx'
import {
  LayoutDashboard, PlusCircle, ClipboardList, Search, MapPin, Map,
  MessageCircle, Bell, Star, User, Settings, Briefcase, CheckSquare,
  Truck, Building2, Laptop, Lock, Menu, X, ChevronRight, Shield, Loader2
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { Avatar, Badge } from './UI'
import { statusBadge } from '../utils/helpers'

const PATH_ICONS: Record<string, React.FC<{ size?: number }>> = {
  '/dashboard': LayoutDashboard, '/dashboard/jobs': ClipboardList,
  '/dashboard/workers': Search, '/dashboard/nearby': MapPin,
  '/dashboard/map': Map, '/dashboard/messages': MessageCircle,
  '/dashboard/notifications': Bell, '/dashboard/subscription': Star,
  '/dashboard/profile': User, '/dashboard/settings': Settings,
  '/worker': LayoutDashboard, '/worker/feed': Briefcase,
  '/worker/jobs': CheckSquare, '/worker/nearby': MapPin,
  '/worker/map': Map, '/worker/messages': MessageCircle,
  '/worker/notifications': Bell, '/worker/subscription': Star,
  '/worker/profile': User, '/worker/settings': Settings,
  '/delivery': LayoutDashboard, '/delivery/orders': Truck,
  '/delivery/active': CheckSquare, '/delivery/nearby': MapPin,
  '/delivery/messages': MessageCircle, '/delivery/notifications': Bell,
  '/delivery/subscription': Star, '/delivery/profile': User,
  '/delivery/settings': Settings,
  '/business': LayoutDashboard, '/business/requests': ClipboardList,
  '/business/active': CheckSquare, '/business/nearby': MapPin,
  '/business/messages': MessageCircle, '/business/notifications': Bell,
  '/business/subscription': Star, '/business/profile': Building2,
  '/business/settings': Settings,
  '/freelancer': LayoutDashboard, '/freelancer/subscription': Star,
  '/freelancer/profile': User, '/freelancer/settings': Settings,
  '/admin': LayoutDashboard, '/admin/users': User,
  '/admin/jobs': Briefcase, '/admin/subs': Star,
  '/admin/reports': Shield, '/admin/freelancers': Laptop,
}

interface NavItem { label: string; icon?: string; path: string; badge?: number | string; locked?: boolean }
interface Props { children: React.ReactNode; navItems: NavItem[]; title: string; headerRight?: React.ReactNode; sidebarBottom?: React.ReactNode }

export const AppLayout: React.FC<Props> = ({ children, navItems, title, headerRight, sidebarBottom }) => {
  const { user } = useAuth()
  const [open, setOpen] = useState(false)

  return (
    <div className="app-shell">
      <aside className={clsx('sidebar', open && 'open')}>
        <div className="sb-logo">
          <img src="/erradely-logo.jpg" alt="Erradely" className="sb-logo-mark" style={{ objectFit:"cover", borderRadius:9 }} />
          <span className="sb-logo-text">Erradely</span>
        </div>

        <nav className="sb-nav">
          {navItems.map(item => {
            const Icon = PATH_ICONS[item.path]
            return (
              <NavLink key={item.path} to={item.locked ? '#' : item.path}
                onClick={e => { if (item.locked) e.preventDefault(); setOpen(false) }}
                className={({ isActive }) => clsx('nav-item', isActive && !item.locked && 'active', item.locked && 'locked')}>
                <span className="nav-icon-wrap">
                  {Icon ? <Icon size={18} /> : <span style={{ fontSize: 16, lineHeight: 1 }}>{item.icon}</span>}
                </span>
                <span className="nav-item-label">{item.label}</span>
                {item.locked
                  ? <Lock size={11} className="nav-lock" />
                  : item.badge != null && (
                      <span className="ni-badge" style={{ background: typeof item.badge === 'string' ? 'var(--gold2)' : 'var(--red)', color: '#000' }}>
                        {item.badge}
                      </span>
                    )
                }
              </NavLink>
            )
          })}
        </nav>

        {sidebarBottom}

        <div className="sb-user">
          <div className="sb-user-inner">
            <Avatar name={user?.name} src={user?.profilePhoto} size="md" />
            <div className="sb-uinfo">
              <div className="sb-uname">{user?.name}</div>
              <Badge label={`${user?.status} · ${user?.daysLeft}d`} variant={statusBadge(user?.status || '')} />
            </div>
            <ChevronRight size={14} style={{ color: 'var(--t3)', flexShrink: 0 }} />
          </div>
        </div>
      </aside>

      {open && <div className="sb-overlay" onClick={() => setOpen(false)} />}

      <main className="app-main">
        <header className="app-hd">
          <div className="flex ac g3">
            <button className="app-hd-menu-btn" onClick={() => setOpen(o => !o)} aria-label="Menu">
              {open ? <X size={20} /> : <Menu size={20} />}
            </button>
            <h1 className="app-hd-title fd">{title}</h1>
          </div>
          <div className="flex ac g2">{headerRight}</div>
        </header>
        <div className="app-ct">{children}</div>
      </main>
    </div>
  )
}

export const ActivitySwitch: React.FC = () => {
  const [status, setStatus] = useState<'online' | 'busy' | 'offline'>('online')
  return (
    <div className="activity-switch">
      {([['online', 'Online', '#22c55e'], ['busy', 'Busy', '#f97316'], ['offline', 'Off', 'var(--t3)']] as const).map(([k, l, c]) => (
        <button key={k} className={clsx('activity-switch-btn', status === k && 'act')} onClick={() => setStatus(k)}>
          <span className="activity-dot" style={{ background: status === k ? c : 'var(--bd2)' }} />
          {l}
        </button>
      ))}
    </div>
  )
}

export const ProtectedRoute: React.FC<{ children: React.ReactNode; allowedRoles?: string[] }> = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth()
  const navigate = useNavigate()

  React.useEffect(() => {
    if (!loading && !user) navigate('/login', { replace: true })
    if (!loading && user && allowedRoles && !allowedRoles.includes(user.role)) navigate('/', { replace: true })
  }, [user, loading, navigate, allowedRoles])

  if (loading) return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16, background: 'var(--bg0)' }}>
      <img src="/erradely-logo.jpg" alt="Erradely" style={{ width:52, height:52, borderRadius:12, objectFit:"cover", display:"block" }} />
      <div className="flex ac g2 t3"><Loader2 size={16} style={{ animation: 'spin .7s linear infinite' }} /><span className="bsm">Loading Erradely...</span></div>
    </div>
  )
  if (!user) return null
  return <>{children}</>
}
