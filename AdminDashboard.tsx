import React, { useEffect, useState } from 'react'
import { Routes, Route, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { AdminAPI } from '../../utils/api'
import { AppLayout } from '../../components/AppLayout'
import { SkeletonList, Empty, ErrorState, Avatar, Badge } from '../../components/UI'
import { timeAgo, initials, statusBadge } from '../../utils/helpers'
import { JobCard } from '../../components/JobCard'
import type { User, Job, Report } from '../../types'

// ── Admin Overview ────────────────────────────────────────────────────────
const Overview: React.FC = () => {
  const [stats, setStats]   = useState<Record<string, unknown> | null>(null)
  const [users, setUsers]   = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    AdminAPI.getStats().then(r => { setStats(r.data.stats as Record<string, unknown>); setUsers(r.data.recentUsers) }).finally(() => setLoading(false))
  }, [])

  if (loading) return <SkeletonList n={6} />

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const s: any = stats || {}
  const cards = [
    { icon: '👥', val: s.users?.total || 0,      label: 'Total Users',    sub: `+${s.users?.trial||0} trial`,     color: 'var(--ac)',    bg: 'rgba(34,197,94,.1)'   },
    { icon: '💼', val: s.jobs?.total || 0,        label: 'Total Jobs',     sub: `${s.jobs?.open||0} open`,          color: 'var(--gold2)', bg: 'rgba(200,146,10,.1)' },
    { icon: '✅', val: s.jobs?.completed || 0,    label: 'Completed',      sub: 'All time',                          color: '#93c5fd',      bg: 'rgba(59,130,246,.1)'  },
    { icon: '⭐', val: s.subs?.active || 0,       label: 'Active Subs',    sub: 'Paying users',                      color: '#c4b5fd',      bg: 'rgba(139,92,246,.1)'  },
    { icon: '💻', val: (s as Record<string, number>).freelancers || 0, label: 'Freelancers', sub: 'On waitlist', color: '#9ca3af', bg: 'rgba(107,114,128,.1)' },
    { icon: '🚩', val: s.reports?.pending || 0,  label: 'Reports',        sub: 'Pending review',                    color: '#f87171',      bg: 'rgba(239,68,68,.1)'   },
  ]

  return (
    <div>
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 mb-6">
        {cards.map(c => (
          <div key={c.label} className="card p-5 animate-fade-up">
            <div className="w-11 h-11 rounded-xl flex items-center justify-center text-xl mb-3" style={{ background: c.bg, color: c.color }}>{c.icon}</div>
            <div className="font-display text-3xl font-bold mb-1" style={{ color: c.color }}>{c.val.toLocaleString()}</div>
            <div className="text-sm font-medium" style={{ color: 'var(--t3)' }}>{c.label}</div>
            <div className="text-xs mt-1" style={{ color: 'var(--t3)' }}>{c.sub}</div>
          </div>
        ))}
      </div>

      {/* Recent users */}
      <div className="card animate-fade-up">
        <div className="flex jb ac mb4">
          <h3 className="tsm">Recent Users</h3>
          <button className="btn btg btn-sm" onClick={() => navigate('/admin/users')}>View All →</button>
        </div>
        <UsersTable users={users} onAction={() => {}} />
      </div>
    </div>
  )
}

// ── Users Table Component ─────────────────────────────────────────────────
const UsersTable: React.FC<{ users: User[]; onAction: () => void }> = ({ users, onAction }) => {
  const handleSuspend = async (u: User) => {
    await AdminAPI.suspendUser(u._id, 'Suspended by admin')
    toast.success(`${u.name} suspended`)
    onAction()
  }
  const handleActivate = async (u: User) => {
    await AdminAPI.activateUser(u._id)
    toast.success(`${u.name} reactivated`)
    onAction()
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead><tr className="text-left text-[10px] font-bold uppercase tracking-wider border-b" style={{ color: 'var(--t3)', borderColor: 'var(--bd1)' }}>
          <th className="pb-2 pr-4">User</th><th className="pb-2 pr-4">Role</th>
          <th className="pb-2 pr-4">Status</th><th className="pb-2 pr-4">City</th>
          <th className="pb-2">Actions</th>
        </tr></thead>
        <tbody>
          {users.map(u => (
            <tr key={u._id} className="border-b" style={{ borderColor: 'var(--bd1)' }}>
              <td className="py-3 pr-4">
                <div className="flex ac g2">
                  <Avatar name={u.name} size="sm" />
                  <div>
                    <div className="font-semibold">{u.name}</div>
                    <div className="bsm" style={{ color: 'var(--t3)' }}>{u.email}</div>
                  </div>
                </div>
              </td>
              <td className="py-3 pr-4"><Badge label={u.role} variant="badge-green" /></td>
              <td className="py-3 pr-4"><Badge label={u.status} variant={statusBadge(u.status)} /></td>
              <td className="py-3 pr-4 text-xs" style={{ color: 'var(--t2)' }}>{u.location?.city || '—'}</td>
              <td className="py-3">
                <div className="flex gap-1.5">
                  <button className="btn bts btn-sm" onClick={() => toast(`👤 ${u.email}`)}>👁</button>
                  {u.isSuspended
                    ? <button className="btn btp btn-sm" onClick={() => handleActivate(u)}>✓</button>
                    : <button className="btn btn-danger btn-sm" onClick={() => handleSuspend(u)}>🚫</button>
                  }
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

// ── All Users ─────────────────────────────────────────────────────────────
const AllUsers: React.FC = () => {
  const [users, setUsers]   = useState<User[]>([])
  const [search, setSearch] = useState('')
  const [role,   setRole]   = useState('')
  const [loading, setLoading] = useState(true)
  const timer = React.useRef<ReturnType<typeof setTimeout>>()

  const load = async (params: Record<string, string> = {}) => {
    setLoading(true)
    AdminAPI.getUsers(params).then(r => setUsers(r.data.users)).finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [])
  useEffect(() => { clearTimeout(timer.current); timer.current = setTimeout(() => load({ search, role }), 400) }, [search, role])

  return (
    <div>
      <div className="flex flex-wrap gap-3 mb-5">
        <div className="relative flex-1 min-w-[200px]">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm" style={{ color: 'var(--t3)' }}>🔍</span>
          <input className="input pl-9" placeholder="Search users..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <select className="input max-w-[150px]" value={role} onChange={e => setRole(e.target.value)}>
          <option value="">All Roles</option>
          {['client','worker','delivery','business','freelancer'].map(r => <option key={r} value={r}>{r}</option>)}
        </select>
      </div>
      {loading ? <SkeletonList /> : <div className="card"><UsersTable users={users} onAction={() => load({ search, role })} /></div>}
    </div>
  )
}

// ── All Jobs ──────────────────────────────────────────────────────────────
const AllJobs: React.FC = () => {
  const [jobs, setJobs]     = useState<Job[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    AdminAPI.getJobs().then(r => setJobs(r.data.jobs)).finally(() => setLoading(false))
  }, [])

  return (
    <div>
      {loading ? <SkeletonList /> : jobs.length
        ? jobs.map(j => (
            <div key={j._id} className="relative">
              <JobCard job={j} />
              <button className="absolute top-4 right-4 btn btn-danger btn-sm" onClick={async () => { await AdminAPI.deleteJob(j._id); setJobs(prev => prev.filter(x => x._id !== j._id)); toast.success('Job removed') }}>🗑</button>
            </div>
          ))
        : <Empty icon="💼" title="No jobs found" />
      }
    </div>
  )
}

// ── Reports ───────────────────────────────────────────────────────────────
const Reports: React.FC = () => {
  const [reports, setReports] = useState<Report[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    AdminAPI.getReports().then(r => setReports(r.data.reports)).finally(() => setLoading(false))
  }, [])

  const resolve = async (id: string) => {
    await AdminAPI.resolveReport(id, { resolution: 'resolved' })
    setReports(prev => prev.filter(r => r._id !== id))
    toast.success('Report resolved')
  }

  return (
    <div>
      {loading ? <SkeletonList /> : reports.length === 0 ? <Empty icon="🎉" title="No pending reports" sub="All clear!" /> :
        reports.map(r => (
          <div key={r._id} className="card mb-3 animate-fade-up">
            <div className="flex items-start justify-between flex-wrap gap-3">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Badge label={r.severity} variant={r.severity === 'high' ? 'badge-red' : r.severity === 'medium' ? 'badge-gold' : 'badge-blue'} />
                  <span className="bsm" style={{ color: 'var(--t3)' }}>{timeAgo(r.createdAt)}</span>
                </div>
                <div className="text-sm font-bold mb-1">🚩 {r.type?.replace(/_/g, ' ')}</div>
                <div className="bsm" style={{ color: 'var(--t2)' }}>By <strong>{r.reporter?.name}</strong></div>
                {r.description && <div className="text-xs mt-1" style={{ color: 'var(--t3)' }}>{r.description}</div>}
              </div>
              <div className="flex gap-2">
                <button className="btn bts btn-sm">👁 View</button>
                <button className="btn btp btn-sm" onClick={() => resolve(r._id)}>✓ Resolve</button>
              </div>
            </div>
          </div>
        ))
      }
    </div>
  )
}

// ── Freelancer management ─────────────────────────────────────────────────
const Freelancers: React.FC = () => {
  const [fls, setFls]       = useState<User[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    AdminAPI.getFreelancers().then(r => setFls(r.data.freelancers)).finally(() => setLoading(false))
  }, [])

  return (
    <div>
      <div className="card mb-5 p-5 animate-fade-up" style={{ background: 'rgba(107,114,128,.06)', border: '1px solid rgba(107,114,128,.2)' }}>
        <div className="flex items-center gap-4 mb-4">
          <span className="text-4xl">💻</span>
          <div>
            <h3 className="text-sm font-bold mb-1">Freelancer Status: LOCKED</h3>
            <p className="bsm" style={{ color: 'var(--t2)' }}>{fls.length} users on waitlist. Notify them or launch features when ready.</p>
          </div>
        </div>
        <div className="flex gap-3 flex-wrap">
          <button className="btn bts btn-sm" onClick={async () => { await AdminAPI.notifyFreelancers(); toast.success(`Notified ${fls.length} freelancers`) }}>🔔 Notify All</button>
          <button className="btn btp btn-sm" onClick={() => toast('🚀 To launch: update role permissions in backend config')}>🚀 Launch Features</button>
        </div>
      </div>
      {loading ? <SkeletonList n={3} /> : fls.length === 0 ? <Empty icon="💻" title="No freelancers yet" /> :
        <div className="card">
          <h3 className="text-sm font-bold mb-3">Waitlist ({fls.length})</h3>
          {fls.map(f => (
            <div key={f._id} className="flex items-center justify-between py-3 border-b text-sm" style={{ borderColor: 'var(--bd1)' }}>
              <div className="flex ac g2">
                <Avatar name={f.name} size="sm" colorIndex={4} />
                <div><div className="font-semibold">{f.name}</div><div className="bsm" style={{ color: 'var(--t3)' }}>{f.email}</div></div>
              </div>
              <span style={{ color: 'var(--t3)' }}>{f.location?.city || '—'}</span>
              <Badge label={f.status} variant={statusBadge(f.status)} />
            </div>
          ))}
        </div>
      }
    </div>
  )
}

// ── Admin Dashboard shell ─────────────────────────────────────────────────
const AdminDashboard: React.FC = () => {
  const navItems = [
    { label: 'Dashboard',    icon: '📊', path: '/admin' },
    { label: 'All Users',    icon: '👥', path: '/admin/users',   badge: 0 },
    { label: 'All Jobs',     icon: '💼', path: '/admin/jobs' },
    { label: 'Subscriptions',icon: '💳', path: '/admin/subs' },
    { label: 'Reports',      icon: '🚩', path: '/admin/reports', badge: 4 },
    { label: 'Freelancers',  icon: '💻', path: '/admin/freelancers' },
    { label: 'Exit Admin',   icon: '🚪', path: '/' },
  ]

  const headerRight = (
    <div className="flex gap-2">
      <button className="btn bts btn-sm" onClick={() => toast('📊 Report exported')}>⬇ Export</button>
    </div>
  )

  return (
    <AppLayout navItems={navItems} title="Admin Dashboard" headerRight={headerRight}>
      <Routes>
        <Route index               element={<Overview />} />
        <Route path="users"        element={<AllUsers />} />
        <Route path="jobs"         element={<AllJobs />} />
        <Route path="reports"      element={<Reports />} />
        <Route path="freelancers"  element={<Freelancers />} />
      </Routes>
    </AppLayout>
  )
}

export default AdminDashboard
