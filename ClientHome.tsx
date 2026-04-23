import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { JobsAPI, MessagesAPI, SubscriptionsAPI } from '../../utils/api'
import { useAuth } from '../../context/AuthContext'
import { daysLeft, formatNaira } from '../../utils/helpers'
import { SkeletonList, StatCard, Empty, ProgressBar } from '../../components/UI'
import { JobCard } from '../../components/JobCard'
import type { Job, SubscriptionStatus } from '../../types'

const ClientHome: React.FC<{ onPostJob: () => void }> = ({ onPostJob }) => {
  const { user } = useAuth()
  const navigate  = useNavigate()
  const [jobs, setJobs]           = useState<Job[]>([])
  const [sub, setSub]             = useState<SubscriptionStatus | null>(null)
  const [unread, setUnread]       = useState(0)
  const [loading, setLoading]     = useState(true)

  useEffect(() => {
    Promise.all([
      JobsAPI.getMy({ limit: 3 }),
      SubscriptionsAPI.getMy(),
      MessagesAPI.getUnreadCount(),
    ]).then(([j, s, m]) => {
      setJobs(j.data.jobs)
      setSub(s.data.subscription)
      setUnread(m.data.unreadCount)
    }).finally(() => setLoading(false))
  }, [])

  const days = daysLeft(sub?.trialEndDate || sub?.subscriptionEnd)
  const trialPct = Math.min((days / 7) * 100, 100)

  return (
    <div className="content-wrap">
      {/* Trial / subscription banner */}
      {sub && (
        <div className={`trial-bar animate-fade-up mb-5 ${sub.status === 'EXPIRED' ? 'bg-red-500/10 border-red-500/25' : ''}`}>
          <div>
            <h3 className="text-sm font-bold mb-1" style={{ color: sub.status === 'EXPIRED' ? '#f87171' : 'var(--gold2)' }}>
              {sub.status === 'TRIAL'   && `⚡ Free Trial — ${days} day${days !== 1 ? 's' : ''} left`}
              {sub.status === 'ACTIVE'  && `✅ Subscription Active — ${days} day${days !== 1 ? 's' : ''} left`}
              {sub.status === 'EXPIRED' && '⚠️ Subscription Expired'}
            </h3>
            <p className="bsm" style={{ color: 'var(--t2)' }}>₦{sub.dailyRate}/day · {user?.role}</p>
          </div>
          {sub.status !== 'EXPIRED' && (
            <div className="min-w-[120px]">
              <ProgressBar pct={trialPct} gold />
              <div className="flex justify-between text-[10px] mt-1" style={{ color: 'var(--t3)' }}>
                <span>Day 1</span><span>Day 7</span>
              </div>
            </div>
          )}
          <button
            className={sub.status === 'EXPIRED' ? 'btn btn-danger btn-sm' : 'btn btn-gold btn-sm'}
            onClick={() => navigate('/dashboard/subscription')}
          >
            {sub.status === 'EXPIRED' ? 'Subscribe Now' : 'Renew Plan →'}
          </button>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        <StatCard icon="📋" value={jobs.length}              label="Jobs Posted"  trend="This month" />
        <StatCard icon="✅" value={user?.completedJobs ?? 0} label="Completed"    color="var(--gold2)" bg="rgba(200,146,10,.1)" />
        <StatCard icon="💬" value={unread}                   label="Unread Msgs"  color="#93c5fd" bg="rgba(59,130,246,.1)" />
        <StatCard icon="⭐" value={user?.averageRating > 0 ? user.averageRating : '—'} label="Your Rating" color="#c4b5fd" bg="rgba(139,92,246,.1)" />
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-2 gap-3 mb-6 animate-fade-up" style={{ animationDelay: '.1s' }}>
        <button className="card card-hover p-4 flex items-center gap-3 text-left" onClick={onPostJob}>
          <div className="w-11 h-11 rounded-xl flex items-center justify-center text-xl flex-shrink-0" style={{ background: 'rgba(34,197,94,.15)', color: 'var(--ac)' }}>➕</div>
          <div><div className="tsm">Post a New Job</div><div className="bsm" style={{ color: 'var(--t3)' }}>Get matched in minutes</div></div>
        </button>
        <button className="card card-hover p-4 flex items-center gap-3 text-left" onClick={() => navigate('/dashboard/workers')}>
          <div className="w-11 h-11 rounded-xl flex items-center justify-center text-xl flex-shrink-0" style={{ background: 'rgba(200,146,10,.15)', color: 'var(--gold2)' }}>🔍</div>
          <div><div className="tsm">Browse Workers</div><div className="bsm" style={{ color: 'var(--t3)' }}>Find skilled locals</div></div>
        </button>
      </div>

      {/* Recent jobs */}
      <div className="animate-fade-up" style={{ animationDelay: '.15s' }}>
        <div className="flex jb ac mb4">
          <h2 className="font-display text-xl font-bold">Recent Jobs</h2>
          <button className="btn btg btn-sm" onClick={() => navigate('/dashboard/jobs')}>
            View All →
          </button>
        </div>
        {loading ? <SkeletonList n={3} /> : jobs.length
          ? jobs.map(j => <JobCard key={j._id} job={j} />)
          : <Empty icon="📭" title="No jobs yet" sub="Post your first job to get started!" />
        }
      </div>
    </div>
  )
}

export default ClientHome
