import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { JobsAPI, SubscriptionsAPI } from '../../utils/api'
import { useAuth } from '../../context/AuthContext'
import { daysLeft, getGPS } from '../../utils/helpers'
import { SkeletonList, StatCard, PriorityTracker, Empty, ProgressBar } from '../../components/UI'
import { JobCard } from '../../components/JobCard'
import type { Job, SubscriptionStatus } from '../../types'

const DeliveryHome: React.FC = () => {
  const { user, refresh } = useAuth()
  const navigate = useNavigate()
  const [orders, setOrders]   = useState<Job[]>([])
  const [sub,    setSub]      = useState<SubscriptionStatus | null>(null)
  const [loading, setLoading] = useState(true)

  const loadOrders = async () => {
    setLoading(true)
    try {
      const coords = await getGPS()
      const [ordRes, subRes] = await Promise.all([
        JobsAPI.getAll({ lat: coords.lat, lng: coords.lng, radius: 10, limit: 4, status: 'OPEN' }),
        SubscriptionsAPI.getMy(),
      ])
      setOrders(ordRes.data.jobs)
      setSub(subRes.data.subscription)
    } catch {} finally { setLoading(false) }
  }

  useEffect(() => { loadOrders() }, [])

  const days = daysLeft(sub?.trialEndDate || sub?.subscriptionEnd)

  return (
    <div className="content-wrap">
      {/* Trial banner */}
      {sub && (
        <div className={`trial-bar fu ${sub.status === 'EXPIRED' ? 'expired' : ''}`}>
          <div>
            <h3 className="tsm mb1" style={{ color: sub.status === 'EXPIRED' ? 'var(--red)' : 'var(--gold2)' }}>
              {sub.status === 'TRIAL'   && `⚡ Free Trial — ${days} day${days !== 1 ? 's' : ''} left`}
              {sub.status === 'ACTIVE'  && `✅ Active — ${days} day${days !== 1 ? 's' : ''} left`}
              {sub.status === 'EXPIRED' && '⚠️ Subscription Expired'}
            </h3>
            <p className="bsm t2">₦{sub.dailyRate}/day · Delivery Company</p>
          </div>
          {sub.status !== 'EXPIRED' && (
            <div style={{ minWidth: 130 }}>
              <ProgressBar pct={Math.min((days / 7) * 100, 100)} gold />
            </div>
          )}
          <button
            className={`btn btn-sm ${sub.status === 'EXPIRED' ? 'btd' : 'btgold'}`}
            onClick={() => navigate('/delivery/subscription')}
          >
            {sub.status === 'EXPIRED' ? 'Subscribe Now' : 'Renew →'}
          </button>
        </div>
      )}

      {/* Stats */}
      <div className="stats-row fu fu1">
        <StatCard icon="📦" value={orders.length}              label="Nearby Orders"  trend="Open now" />
        <StatCard icon="🚚" value={user?.completedJobs ?? 0}  label="Delivered"      color="var(--gold2)" bg="rgba(200,146,10,.1)" />
        <StatCard icon="⭐" value={user?.averageRating > 0 ? user.averageRating : '—'} label="Rating" color="#c4b5fd" bg="rgba(139,92,246,.1)" />
        <StatCard icon="💬" value="—"                          label="Unread Msgs"    color="#93c5fd" bg="rgba(59,130,246,.1)" />
      </div>

      {/* Quick actions */}
      <div className="gr2 fu fu2 mb5">
        <div className="card card-grad cp" onClick={() => navigate('/delivery/orders')}
          style={{ display: 'flex', alignItems: 'center', gap: 14, padding: 18 }}>
          <div className="sc-icon" style={{ background: 'rgba(34,197,94,.15)', color: 'var(--ac)', marginBottom: 0, width: 44, height: 44, fontSize: 20 }}>📦</div>
          <div><div className="tsm">Browse Delivery Orders</div><div className="bsm t3">Find nearby drop-offs</div></div>
        </div>
        <div className="card card-grad cp" onClick={() => navigate('/delivery/nearby')}
          style={{ display: 'flex', alignItems: 'center', gap: 14, padding: 18 }}>
          <div className="sc-icon" style={{ background: 'rgba(200,146,10,.15)', color: 'var(--gold2)', marginBottom: 0, width: 44, height: 44, fontSize: 20 }}>📍</div>
          <div><div className="tsm">Nearby People</div><div className="bsm t3">See who's around you</div></div>
        </div>
      </div>

      {/* Priority tracker */}
      <PriorityTracker completed={user?.completedJobs ?? 0} />

      {/* Order feed */}
      <div className="fu fu3">
        <div className="flex jb ac mb4">
          <h2 className="tmd">Delivery Orders Near You</h2>
          <button className="btn bts btn-sm" onClick={() => navigate('/delivery/orders')}>
            View All →
          </button>
        </div>
        {loading
          ? <SkeletonList n={3} />
          : orders.length
            ? orders.map(j => (
                <JobCard key={j._id} job={j} isWorker onAccepted={() => { refresh(); loadOrders() }} />
              ))
            : <Empty icon="📦" title="No delivery orders nearby" sub="Check back soon or expand your radius." />
        }
      </div>
    </div>
  )
}

export default DeliveryHome
