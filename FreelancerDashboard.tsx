import React, { useState } from 'react'
import { Routes, Route, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { AppLayout } from '../../components/AppLayout'
import { Modal, Spinner } from '../../components/UI'
import { AuthAPI, setUser as saveUser } from '../../utils/api'
import { useAuth } from '../../context/AuthContext'
import Subscription  from '../shared/Subscription'
import Profile       from '../shared/Profile'
import Settings      from '../shared/Settings'

const LockedScreen: React.FC<{ onNotify: () => void; onSwitch: () => void; notified: boolean }> = ({ onNotify, onSwitch, notified }) => (
  <div className="lock-screen max-w-xl mx-auto">
    <span className="lock-badge">🔒 Feature Locked</span>
    <div className="lock-icon">💻</div>

    <h1 className="font-display text-4xl font-bold mb-4" style={{ color: 'var(--t1)' }}>
      Freelancer Dashboard
    </h1>
    <p className="text-base mb-8 leading-relaxed" style={{ color: 'var(--t2)' }}>
      Freelancer task features are not yet available. We are preparing digital and admin tasks
      for <strong>Owerri, Imo State</strong>. Stay tuned for the launch!
    </p>

    <div className="flex gap-4 justify-center flex-wrap">
      <button
        className={`flex items-center gap-2.5 px-7 py-3.5 rounded-xl text-sm font-semibold border-2 transition-all ${notified ? 'opacity-70 cursor-default' : 'cursor-pointer hover:-translate-y-0.5'}`}
        style={{ borderColor: 'rgba(34,197,94,.3)', background: 'rgba(34,197,94,.08)', color: 'var(--ac)' }}
        onClick={!notified ? onNotify : undefined}
        disabled={notified}
      >
        {notified ? '✅ You\'ll be Notified!' : '🔔 Notify Me When Available'}
      </button>

      <button
        className="btn btn-gold btn-lg flex items-center gap-2"
        onClick={onSwitch}
      >
        ⚡ Switch to Worker Mode
      </button>
    </div>

    {/* Info cards */}
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-12 w-full">
      {[
        { icon: '🎯', title: "What's Coming", body: 'Digital tasks, admin support, data entry, research, virtual assistance — all available remotely from Owerri.' },
        { icon: '⭐', title: 'Priority Badge', body: 'Complete your first 5 tasks to earn the Priority Worker badge and get first access to new listings.' },
        { icon: '🔨', title: 'Switch to Worker', body: "Don't want to wait? Switch to Worker mode and start accepting physical jobs near you immediately." },
      ].map(c => (
        <div key={c.title} className="card text-left p-5 animate-fade-up">
          <div className="text-2xl mb-2">{c.icon}</div>
          <div className="text-sm font-bold mb-2">{c.title}</div>
          <div className="text-xs leading-relaxed" style={{ color: 'var(--t2)' }}>{c.body}</div>
        </div>
      ))}
    </div>
  </div>
)

const FreelancerDashboard: React.FC = () => {
  const { user, setUser } = useAuth()
  const navigate = useNavigate()
  const [notified, setNotified]     = useState(user?.freelancerNotifyMe ?? false)
  const [switchOpen, setSwitchOpen] = useState(false)
  const [switching, setSwitching]   = useState(false)

  const navItems = [
    { label: 'Dashboard',    icon: '🏠', path: '/freelancer' },
    { label: 'Task Feed',    icon: '💻', path: '#',  locked: true },
    { label: 'My Tasks',     icon: '📋', path: '#',  locked: true },
    { label: 'Subscription', icon: '⭐', path: '/freelancer/subscription' },
    { label: 'Profile',      icon: '👤', path: '/freelancer/profile' },
    { label: 'Settings',     icon: '⚙️', path: '/freelancer/settings' },
  ]

  const handleNotify = async () => {
    try {
      await AuthAPI.freelancerNotify()
      setNotified(true)
      toast.success("You'll be the first to know when Freelancer tasks launch in Owerri! 🔔")
    } catch {}
  }

  const handleSwitch = async () => {
    setSwitching(true)
    try {
      const res = await AuthAPI.switchToWorker()
      setUser(res.data.user)
      saveUser(res.data.user)
      toast.success('Switched to Worker Mode! You can now accept jobs 🔨')
      navigate('/worker', { replace: true })
    } catch {} finally { setSwitching(false); setSwitchOpen(false) }
  }

  return (
    <>
      <AppLayout navItems={navItems} title="Freelancer Dashboard">
        <Routes>
          <Route index element={<LockedScreen onNotify={handleNotify} onSwitch={() => setSwitchOpen(true)} notified={notified} />} />
          <Route path="subscription" element={<Subscription />} />
          <Route path="profile"      element={<Profile />} />
          <Route path="settings"     element={<Settings />} />
        </Routes>
      </AppLayout>

      <Modal open={switchOpen} onClose={() => setSwitchOpen(false)} title="⚡ Switch to Worker Mode" maxWidth="460px">
        <div className="card mb-5 text-center p-6" style={{ background: 'linear-gradient(135deg,var(--bg2),var(--bg3,var(--bg1)))' }}>
          <div className="text-4xl mb-3">🔨</div>
          <h3 className="text-base font-bold mb-2">Become a Worker</h3>
          <p className="bmd" style={{ color: 'var(--t2)' }}>
            Switch to Worker mode and start accepting physical jobs in Owerri immediately.
            Your trial period and account data are preserved.
          </p>
        </div>
        <div className="flex fc g2 mb-5 text-sm" style={{ color: 'var(--t2)' }}>
          {['Access the full job feed immediately','Start tracking toward Priority Worker badge','Same rate: ₦150/day','Your profile and history are preserved'].map(b => (
            <div key={b} className="flex ac g2"><span style={{ color: 'var(--ac)' }}>✓</span> {b}</div>
          ))}
        </div>
        <div className="flex gap-3">
          <button className="btn btn-secondary flex-1" onClick={() => setSwitchOpen(false)}>Cancel</button>
          <button className="btn btn-gold flex-[2]" onClick={handleSwitch} disabled={switching}>
            {switching ? <Spinner size={16} /> : '⚡ Switch to Worker Mode'}
          </button>
        </div>
      </Modal>
    </>
  )
}

export default FreelancerDashboard
