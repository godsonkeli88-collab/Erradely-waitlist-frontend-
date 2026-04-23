import React from 'react'
import clsx from 'clsx'
import { Loader2 } from 'lucide-react'
import { initials, avatarClass } from '../utils/helpers'

export const Spinner: React.FC<{ size?: number; className?: string }> = ({ size = 18, className }) => (
  <Loader2 size={size} className={clsx('animate-spin', className)} />
)

export const SkeletonCard: React.FC = () => (
  <div className="card mb-4 p-5">
    <div className="skel h8 mb3" />
    <div className="skel h6 mb2" />
    <div className="skel h6" />
  </div>
)
export const SkeletonList: React.FC<{ n?: number }> = ({ n = 3 }) => (
  <>{Array.from({ length: n }).map((_, i) => <SkeletonCard key={i} />)}</>
)

export const Empty: React.FC<{ icon?: string | React.ReactNode; title: string; sub?: string }> = ({ icon = '📭', title, sub }) => (
  <div className="card" style={{ textAlign: 'center', padding: '40px 20px' }}>
    <div style={{ fontSize: 38, marginBottom: 12, display: 'flex', justifyContent: 'center' }}>{icon}</div>
    <div className="font-semibold text-sm mb-2">{title}</div>
    {sub && <div className="bsm" style={{ color: 'var(--t3)' }}>{sub}</div>}
  </div>
)

export const ErrorState: React.FC<{ message?: string; onRetry?: () => void }> = ({ message = 'Something went wrong', onRetry }) => (
  <div className="card text-center py-10">
    <div className="text-4xl mb-3">⚠️</div>
    <div className="font-semibold text-sm mb-4">{message}</div>
    {onRetry && <button className="btn bts btn-sm" onClick={onRetry}>Retry</button>}
  </div>
)

export const Avatar: React.FC<{ name?: string; src?: string; size?: 'sm'|'md'|'lg'|'xl'|'2xl'; colorIndex?: number; online?: boolean; className?: string }> = ({ name = '', src, size = 'md', colorIndex = 0, online, className }) => (
  <div className={clsx('avatar', `avatar-${size}`, !src && avatarClass(colorIndex), className)} style={{ position: 'relative' }}>
    {src ? <img src={src} alt={name} style={{ width:'100%', height:'100%', objectFit:'cover' }} /> : initials(name)}
    {online && <span style={{ position:'absolute', bottom:1, right:1, width:10, height:10, background:'#22c55e', borderRadius:'50%', border:'2px solid var(--bg0)' }} />}
  </div>
)

export const Badge: React.FC<{ label: string; variant?: string; icon?: React.ReactNode }> = ({ label, variant = 'badge-gray', icon }) => (
  <span className={clsx('badge', variant)}>{icon}{label}</span>
)

export const ProgressBar: React.FC<{ pct: number; gold?: boolean; className?: string }> = ({ pct, gold, className }) => (
  <div className={clsx('pbar', className)}>
    <div className={clsx('pfill', gold ? 'pfill-gold' : '')} style={{ width: `${Math.min(pct, 100)}%` }} />
  </div>
)

export const Modal: React.FC<{ open: boolean; onClose: () => void; title: string; children: React.ReactNode; maxWidth?: string }> = ({ open, onClose, title, children, maxWidth = '560px' }) => {
  if (!open) return null
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background:'rgba(0,0,0,.72)', backdropFilter:'blur(8px)' }} onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="card animate-fade-up w-full overflow-y-auto" style={{ maxWidth, maxHeight:'90vh', boxShadow:'var(--sdw2)' }}>
        <div className="flex items-center justify-between p-6 pb-0">
          <h2 className="tmd">{title}</h2>
          <button className="btn-ghost btn-sm rounded-lg p-2 text-lg" onClick={onClose}>✕</button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  )
}

export const Toggle: React.FC<{ on: boolean; onChange: (v: boolean) => void }> = ({ on, onChange }) => (
  <div className={clsx('toggle', on && 'on')} onClick={() => onChange(!on)}>
    <div className="toggle-knob" />
  </div>
)

export const PriorityTracker: React.FC<{ completed: number }> = ({ completed }) => {
  const done   = Math.min(completed, 5)
  const earned = done >= 5
  return (
    <div className="pw-tracker animate-fade-up">
      <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
        <div className="flex items-center gap-2 text-sm font-bold" style={{ color:'var(--gold2)' }}>⭐ Priority Worker Progress</div>
        <div className="flex items-center gap-1.5">
          {Array.from({ length: 5 }).map((_, i) => (
            <React.Fragment key={i}>
              {i > 0 && <div className={clsx('pw-connector', i <= done && 'done')} />}
              <div className={clsx('pw-step', i < done && 'done', i === done && !earned && 'next')}>{i + 1}</div>
            </React.Fragment>
          ))}
        </div>
      </div>
      <ProgressBar pct={(done / 5) * 100} gold />
      <p className="text-xs mt-2" style={{ color:'var(--t2)' }}>
        {earned ? '🎉 Badge earned! You rank higher and get first-access to all new job listings.'
                : `Complete ${5 - done} more job${5 - done !== 1 ? 's' : ''} to unlock ⭐ Priority Worker badge.`}
      </p>
    </div>
  )
}

export const StatCard: React.FC<{ icon: string; value: string | number; label: string; trend?: string; color?: string; bg?: string }> = ({ icon, value, label, trend, color = 'var(--ac)', bg = 'rgba(34,197,94,.1)' }) => (
  <div className="sc fu">
    <div className="w-11 h-11 rounded-xl flex items-center justify-center text-xl mb-3" style={{ background:bg, color }}>{icon}</div>
    <div className="font-display text-3xl font-bold leading-none mb-1" style={{ color }}>{value}</div>
    <div className="text-xs font-medium" style={{ color:'var(--t3)' }}>{label}</div>
    {trend && <div className="text-xs mt-1.5" style={{ color:'var(--t3)' }}>{trend}</div>}
  </div>
)

export const Divider: React.FC<{ text?: string }> = ({ text }) => (
  <div className="divider">{text && <span className="divider-text">{text}</span>}</div>
)
