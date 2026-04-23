// ── Subscription.tsx ─────────────────────────────────────────────────────
import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { SubscriptionsAPI } from '../../utils/api'
import { useAuth } from '../../context/AuthContext'
import { daysLeft, dailyRate } from '../../utils/helpers'
import { SkeletonList, ProgressBar, Spinner } from '../../components/UI'
import type { SubscriptionStatus, Subscription as SubType, PaymentProvider } from '../../types'

const Subscription: React.FC = () => {
  const { user } = useAuth()
  const [sub,  setSub]    = useState<SubscriptionStatus | null>(null)
  const [hist, setHist]   = useState<SubType[]>([])
  const [plan, setPlan]   = useState<'daily'|'weekly'|'monthly'>('weekly')
  const [pay,  setPay]    = useState<PaymentProvider>('opay')
  const [loading, setLoading] = useState(true)
  const [paying,  setPaying]  = useState(false)

  const rate = dailyRate(user?.role || 'client')
  const plans = [
    { id: 'daily'  as const, name: '1 Day',   days: 1,  price: rate },
    { id: 'weekly' as const, name: '7 Days',  days: 7,  price: rate * 7,  pop: true },
    { id: 'monthly'as const, name: '30 Days', days: 30, price: rate * 30, best: true },
  ]

  useEffect(() => {
    SubscriptionsAPI.getMy()
      .then(r => { setSub(r.data.subscription); setHist(r.data.history) })
      .finally(() => setLoading(false))
  }, [])

  const handlePay = async () => {
    const days = plans.find(p => p.id === plan)?.days || 7
    setPaying(true)
    try {
      const res = await SubscriptionsAPI.initialize({ durationDays: days, paymentProvider: pay })
      if (pay === 'bank') {
        toast(`🏦 Bank Transfer: ₦${res.data.amount?.toLocaleString()} · Ref: ${res.data.reference}`, { duration: 8000 })
      } else if (res.data.paymentUrl) {
        toast('🔄 Redirecting to payment...')
        setTimeout(() => window.open(res.data.paymentUrl, '_blank'), 600)
      }
    } catch {} finally { setPaying(false) }
  }

  const days = daysLeft(sub?.trialEndDate || sub?.subscriptionEnd)
  const selPlan = plans.find(p => p.id === plan)

  if (loading) return <SkeletonList n={2} />

  return (
    <div className="content-wrap">
      {/* Status */}
      <div className="card mb-6 animate-fade-up" style={{ background: 'rgba(34,197,94,.05)' }}>
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <div className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: 'var(--t3)' }}>Current Status</div>
            <div className="text-lg font-bold mb-1" style={{ color: sub?.status === 'EXPIRED' ? '#f87171' : sub?.status === 'TRIAL' ? 'var(--gold2)' : 'var(--ac)' }}>
              {sub?.status === 'TRIAL' ? `⚡ Free Trial` : sub?.status === 'ACTIVE' ? '✅ Active' : '⚠️ Expired'}
            </div>
            <div className="bsm" style={{ color: 'var(--t2)' }}>
              {days > 0 ? `${days} day${days !== 1 ? 's' : ''} remaining` : 'Subscribe to regain access'}
              {' · '}₦{rate}/day
            </div>
          </div>
          <div className="w-16 h-16 rounded-full border-2 flex items-center justify-center font-display font-bold text-sm"
            style={{ borderColor: sub?.status === 'EXPIRED' ? '#f87171' : 'var(--ac)', color: sub?.status === 'EXPIRED' ? '#f87171' : 'var(--ac)' }}>
            {days}d
          </div>
        </div>
      </div>

      {/* Plans */}
      <h3 className="font-display text-lg font-bold mb-3">Choose a Plan</h3>
      <div className="grid grid-cols-3 gap-3 mb-5">
        {plans.map(p => (
          <div key={p.id} onClick={() => setPlan(p.id)}
            className={`rounded-2xl p-4 text-center border-2 cursor-pointer transition-all relative ${plan===p.id ? 'border-[var(--ac)] bg-[rgba(34,197,94,.05)]' : 'border-[var(--bd1)]'}`}>
            {p.pop  && <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 text-[9px] font-black px-2.5 py-0.5 rounded-full text-black" style={{ background: 'linear-gradient(135deg,#15803d,#22c55e)' }}>Popular</div>}
            {p.best && <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 text-[9px] font-black px-2.5 py-0.5 rounded-full text-black" style={{ background: 'linear-gradient(135deg,var(--gold),var(--gold2))' }}>Best Value</div>}
            <div className="text-xs mb-1 font-semibold" style={{ color: 'var(--t3)' }}>{p.name}</div>
            <div className="font-display text-2xl font-bold" style={{ color: 'var(--ac)' }}>₦{p.price.toLocaleString()}</div>
            <div className="text-[10px] mt-0.5" style={{ color: 'var(--t3)' }}>₦{rate}/day</div>
          </div>
        ))}
      </div>

      {/* Payment methods */}
      <h3 className="font-display text-lg font-bold mb-3">Pay With</h3>
      <div className="grid grid-cols-3 gap-3 mb-5">
        {(['opay','palmpay','bank'] as PaymentProvider[]).map(p => (
          <div key={p} onClick={() => setPay(p)}
            className={`rounded-xl p-3 text-center border-2 cursor-pointer transition-all ${pay===p ? 'border-[var(--ac)] bg-[rgba(34,197,94,.05)]' : 'border-[var(--bd1)]'}`}>
            <div className="text-2xl mb-1">{p==='opay'?'🟢':p==='palmpay'?'🌴':'🏦'}</div>
            <div className="text-xs font-bold">{p==='opay'?'OPay':p==='palmpay'?'PalmPay':'Bank'}</div>
          </div>
        ))}
      </div>

      {/* Summary */}
      <div className="card mb-5">
        <div className="flex justify-between mb-2 text-sm"><span style={{ color: 'var(--t2)' }}>Plan</span><span style={{ fontWeight:700 }}>{selPlan?.name}</span></div>
        <div className="flex justify-between mb-2 text-sm"><span style={{ color: 'var(--t2)' }}>Daily Rate</span><span style={{ fontWeight:700 }}>₦{rate}</span></div>
        <div className="flex justify-between pt-3 border-t text-base font-bold" style={{ borderColor: 'var(--bd1)' }}>
          <span>Total</span>
          <span style={{ color: 'var(--ac)' }}>₦{(selPlan?.price || 0).toLocaleString()}</span>
        </div>
      </div>

      <button className="btn btp btn-blk btn-lg" onClick={handlePay} disabled={paying}>
        {paying ? <Spinner /> : `🔒 Pay ₦${(selPlan?.price || 0).toLocaleString()} Securely`}
      </button>
      <p className="text-xs text-center mt-3" style={{ color: 'var(--t3)' }}>🛡 Account activates instantly. Secured by SSL.</p>

      {/* History */}
      {hist.length > 0 && (
        <div className="mt-8">
          <h3 className="font-display text-base font-bold mb-3">Payment History</h3>
          {hist.slice(0,5).map(h => (
            <div key={h._id} className="flex items-center justify-between py-3 border-b text-sm" style={{ borderColor: 'var(--bd1)' }}>
              <span>{h.plan} · {h.durationDays} days</span>
              <span style={{fontWeight:700, color: 'var(--ac)'}}>₦{(h.amountPaid||0).toLocaleString()}</span>
              <span className={`badge ${h.status==='active'?'badge-active':h.status==='expired'?'badge-expired':'badge-gray'}`}>{h.status}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Subscription
