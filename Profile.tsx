import React, { useEffect, useState } from 'react'
import { AuthAPI } from '../../utils/api'
import { useAuth } from '../../context/AuthContext'
import { daysLeft, statusBadge } from '../../utils/helpers'
import { Avatar, Badge, PriorityTracker, SkeletonList } from '../../components/UI'
import type { User } from '../../types'

const Profile: React.FC = () => {
  const { user: ctxUser } = useAuth()
  const [user, setUser]   = useState<User | null>(ctxUser)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setLoading(true)
    AuthAPI.getMe().then(r => setUser(r.data.user)).finally(() => setLoading(false))
  }, [])

  if (loading) return <SkeletonList n={2} />
  if (!user)   return null

  const days = daysLeft(user.trialEndDate || user.subscriptionEnd)

  return (
    <div className="content-wrap">
      {/* Hero */}
      <div className="card mb-4 p-7 relative overflow-hidden animate-fade-up" style={{ background: 'linear-gradient(135deg,var(--bg2),var(--bgc))' }}>
        <div className="absolute top-0 right-0 w-64 h-64 rounded-full" style={{ background: 'var(--ac)', filter: 'blur(80px)', opacity: .04 }} />
        <div className="flex items-start justify-between flex-wrap gap-4 relative z-10">
          <div className="flex items-center gap-5">
            <div className="relative">
              <Avatar name={user.name} src={user.profilePhoto} size="2xl" />
              {user.isVerified && (
                <span className="absolute bottom-1 right-1 w-6 h-6 rounded-full bg-blue-500 text-white text-xs flex items-center justify-center border-2" style={{ borderColor: 'var(--bg0)' }}>✓</span>
              )}
            </div>
            <div>
              <div className="flex items-center gap-3 flex-wrap mb-2">
                <h1 className="font-display text-3xl font-bold">{user.name}</h1>
                {user.isPriorityWorker && <span className="priority-badge">⭐ Priority Worker</span>}
              </div>
              <div className="flex fw g2">
                <Badge label={user.role} variant="badge-green" icon={<span>👤</span>} />
                <Badge label={`${user.status} · ${days}d`} variant={statusBadge(user.status)} />
                {user.location?.city && <Badge label={user.location.city} variant="badge-blue" icon={<span>📍</span>} />}
              </div>
            </div>
          </div>
          <button className="btn bts btn-sm">✏️ Edit</button>
        </div>

        {/* Stats */}
        <div className="flex gap-8 mt-6 relative z-10">
          {[
            [user.completedJobs, 'Jobs Done'],
            [user.averageRating > 0 ? user.averageRating : '—', 'Rating', 'text-[var(--gold2)]'],
            [user.reviewCount, 'Reviews'],
          ].map(([v, l, cls]) => (
            <div key={String(l)}>
              <div className={`font-display text-2xl font-bold ${cls || ''}`}>{String(v)}</div>
              <div className="text-xs mt-0.5" style={{ color: 'var(--t3)' }}>{String(l)}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Priority tracker — workers only */}
      {(user.role === 'worker' || user.role === 'freelancer') && (
        <PriorityTracker completed={user.completedJobs} />
      )}

      {/* Details */}
      <div className="card mb4 fu" style={{ animationDelay: '.1s' }}>
        <h3 className="text-sm font-bold mb-4">Account Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
          {[
            ['Email', user.email],
            ['Phone', user.phone ? `${user.phone}${user.phoneVerified ? ' ✓' : ''}` : 'Not set'],
            ['Location', [user.location?.area, user.location?.city, user.location?.state].filter(Boolean).join(', ') || 'Not set'],
            ['Member Since', new Date(user.createdAt).toLocaleDateString('en-NG', { month: 'long', year: 'numeric' })],
          ].map(([k, v]) => (
            <div key={k}>
              <span style={{ color: 'var(--t3)' }}>{k}:</span>
              <span className="ml-2 font-medium">{v}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Reviews placeholder */}
      <div className="card animate-fade-up" style={{ animationDelay: '.15s' }}>
        <h3 className="text-sm font-bold mb-3">Reviews ({user.reviewCount})</h3>
        {user.reviewCount === 0
          ? <p className="text-sm text-center py-4" style={{ color: 'var(--t3)' }}>No reviews yet. Complete your first job to start building your reputation!</p>
          : <p className="bsm" style={{ color: 'var(--t3)' }}>Reviews are loaded from the database when available.</p>
        }
      </div>
    </div>
  )
}

export default Profile
