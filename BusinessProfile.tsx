import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { AuthAPI } from '../../utils/api'
import { useAuth } from '../../context/AuthContext'
import { daysLeft, statusBadge } from '../../utils/helpers'
import { Avatar, Badge, PriorityTracker, SkeletonList } from '../../components/UI'
import type { User } from '../../types'

const BUSINESS_CATEGORIES = [
  'Restaurant', 'Hotel', 'Pharmacy', 'Supermarket', 'Salon / Barber',
  'Bakery', 'Clinic / Hospital', 'School', 'Tech Company', 'Other',
]

const BusinessProfile: React.FC = () => {
  const { user: ctxUser } = useAuth()
  const [user,    setUser]    = useState<User | null>(ctxUser)
  const [loading, setLoading] = useState(false)
  const [editing, setEditing] = useState(false)
  const [bizName, setBizName] = useState('')
  const [bizCat,  setBizCat]  = useState('Restaurant')

  useEffect(() => {
    setLoading(true)
    AuthAPI.getMe().then(r => setUser(r.data.user)).finally(() => setLoading(false))
  }, [])

  if (loading) return <SkeletonList n={2} />
  if (!user)   return null

  const days = daysLeft(user.trialEndDate || user.subscriptionEnd)

  return (
    <div style={{ maxWidth: 680 }}>
      {/* Business hero */}
      <div className="card mb4 fu" style={{ background: 'linear-gradient(135deg,var(--bg2),var(--bgc))', position: 'relative', overflow: 'hidden', padding: 28 }}>
        <div style={{ position: 'absolute', top: 0, right: 0, width: 260, height: 260, borderRadius: '50%', background: 'var(--ac)', filter: 'blur(80px)', opacity: .04, pointerEvents: 'none' }} />

        <div className="flex ac g4 fw mb4" style={{ position: 'relative', zIndex: 1 }}>
          {/* Business icon */}
          <div style={{ width: 80, height: 80, borderRadius: 20, background: 'linear-gradient(135deg,rgba(34,197,94,.15),rgba(34,197,94,.06))', border: '2px solid var(--bd2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 38, flexShrink: 0 }}>
            🏪
          </div>
          <div style={{ flex: 1 }}>
            <div className="flex ac g3 fw mb2">
              <h1 className="fd" style={{ fontSize: 'clamp(20px,3vw,28px)', fontWeight: 700 }}>{user.name}</h1>
              {user.isVerified && <span className="badge bblue" style={{ fontSize: 10 }}>✓ Verified Business</span>}
            </div>
            <div className="flex g2 fw">
              <Badge label="business" variant="badge-g" />
              <Badge label={`${user.status} · ${days}d`} variant={statusBadge(user.status)} />
              {user.location?.city && <Badge label={user.location.city} variant="badge-blue" />}
            </div>
            <div className="bsm t2 mt2">Owerri, Imo State · Professional Services</div>
          </div>
          <button className="btn bts btn-sm" onClick={() => toast('✏️', 'Edit', 'Profile editing — coming soon')}>
            ✏️ Edit
          </button>
        </div>

        {/* Stats */}
        <div className="flex g5 fw" style={{ position: 'relative', zIndex: 1 }}>
          {[
            [user.completedJobs, 'Jobs Fulfilled'],
            [user.averageRating > 0 ? user.averageRating : '—', 'Rating', 'tgold'],
            [user.reviewCount, 'Reviews'],
          ].map(([v, l, cls]) => (
            <div key={String(l)}>
              <div className={`fd ${String(cls || '')}`} style={{ fontSize: 22, fontWeight: 700, color: String(cls) === 'tgold' ? 'var(--gold2)' : 'var(--t1)' }}>{String(v)}</div>
              <div className="bsm t3 mt1">{String(l)}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Priority tracker */}
      <PriorityTracker completed={user.completedJobs} />

      {/* Business details */}
      <div className="card mb4 fu fu1">
        <h3 className="tsm mb4">Business Details</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }} className="bsm">
          <div><span className="t3">Business Name:</span><span className="ml2 bold">{user.name}</span></div>
          <div><span className="t3">Category:</span><span className="ml2">Professional Services</span></div>
          <div><span className="t3">Email:</span><span className="ml2">{user.email}</span></div>
          <div><span className="t3">Phone:</span><span className="ml2">{user.phone || 'Not set'} {user.phoneVerified ? <span className="badge badge-g ml2" style={{ fontSize: 9 }}>✓</span> : null}</span></div>
          <div><span className="t3">Location:</span><span className="ml2">{[user.location?.area, user.location?.city, user.location?.state].filter(Boolean).join(', ') || 'Not set'}</span></div>
          <div><span className="t3">Member Since:</span><span className="ml2">{new Date(user.createdAt).toLocaleDateString('en-NG', { month: 'long', year: 'numeric' })}</span></div>
        </div>
      </div>

      {/* Reviews */}
      <div className="card fu fu2">
        <h3 className="tsm mb3">Customer Reviews ({user.reviewCount})</h3>
        {user.reviewCount === 0
          ? <p className="bsm t3 tc" style={{ padding: '16px 0' }}>No reviews yet. Fulfil your first job to start building your business reputation!</p>
          : <p className="bsm t3">Reviews are loaded from the database.</p>
        }
      </div>
    </div>
  )
}

export default BusinessProfile
