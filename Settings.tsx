import React, { useState } from 'react'
import { Moon, Sun, Monitor, Bell, MapPin, Lock, LogOut, ChevronRight, FileText, Shield } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { Toggle } from '../../components/UI'

const Settings: React.FC = () => {
  const { logout } = useAuth()
  const [theme, setTheme] = useState<'dark' | 'light' | 'system'>(
    (localStorage.getItem('erradely_theme') as 'dark' | 'light' | 'system') || 'dark'
  )
  const [notifs, setNotifs] = useState(true)
  const [gps,    setGps]    = useState(true)

  const applyTheme = (t: 'dark' | 'light' | 'system') => {
    setTheme(t)
    localStorage.setItem('erradely_theme', t)
    const actual = t === 'system'
      ? (window.matchMedia('(prefers-color-scheme:dark)').matches ? 'dark' : 'light')
      : t
    document.documentElement.setAttribute('data-theme', actual)
  }

interface SettingItem {
  Icon: React.FC<{ size?: number; style?: React.CSSProperties }>
  title: string
  desc: string
  right: React.ReactNode
  onClick?: () => void
  danger?: boolean
}

  const sections: { title: string; items: SettingItem[] }[] = [
    {
      title: 'Appearance',
      items: [
        {
          Icon: theme === 'light' ? Sun : Moon,
          title: 'App Theme',
          desc: `Currently: ${theme}`,
          right: (
            <div className="theme-toggle-group">
              {([['dark', Moon], ['light', Sun], ['system', Monitor]] as const).map(([t, Ic]) => (
                <button key={t} className={`theme-toggle-btn${theme === t ? ' act' : ''}`}
                  onClick={() => applyTheme(t)} title={t}>
                  <Ic size={14} />
                </button>
              ))}
            </div>
          ),
        },
      ],
    },
    {
      title: 'Preferences',
      items: [
        { Icon: Bell,   title: 'Push Notifications', desc: 'Job alerts, messages, expiry warnings', right: <Toggle on={notifs} onChange={setNotifs} /> },
        { Icon: MapPin, title: 'Location Access',     desc: 'GPS matching for nearby jobs',          right: <Toggle on={gps}    onChange={setGps}    /> },
      ],
    },
    {
      title: 'Account',
      items: [
        { Icon: Lock,     title: 'Change Password', desc: 'Update your account password', right: <ChevronRight size={16} style={{ color: 'var(--t3)' }} />, onClick: () => alert('Password reset link sent to your email') },
        { Icon: FileText, title: 'Terms & Conditions', desc: '', right: <ChevronRight size={16} style={{ color: 'var(--t3)' }} /> },
        { Icon: Shield,   title: 'Privacy Policy',     desc: '', right: <ChevronRight size={16} style={{ color: 'var(--t3)' }} /> },
      ],
    },
    {
      title: 'Danger Zone',
      items: [
        { Icon: LogOut, title: 'Sign Out', desc: 'You will need to log in again', right: null, onClick: logout, danger: true },
      ],
    },
  ]

  return (
    <div style={{ maxWidth: 560 }}>
      {sections.map(sec => (
        <div key={sec.title} className="mb4">
          <div className="label t3 mb2" style={{ paddingLeft: 4 }}>{sec.title}</div>
          <div className="set-sec">
            {sec.items.map((item, i) => (
              <div
                key={item.title}
                className="set-item"
                style={{ borderBottom: i < sec.items.length - 1 ? '1px solid var(--bd1)' : 'none',
                         cursor: item.onClick ? 'pointer' : 'default' }}
                onClick={item.onClick}
              >
                <div className="set-icon"
                  style={{ background: item.danger ? 'rgba(239,68,68,.1)' : 'var(--s1)' }}>
                  <item.Icon size={16} style={{ color: item.danger ? '#f87171' : 'var(--t2)' }} />
                </div>
                <div className="set-info">
                  <div className="set-title" style={{ color: item.danger ? '#f87171' : 'var(--t1)' }}>
                    {item.title}
                  </div>
                  {item.desc && <div className="set-desc">{item.desc}</div>}
                </div>
                {item.right}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

export default Settings
