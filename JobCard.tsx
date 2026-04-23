import React, { useState } from 'react'
import toast from 'react-hot-toast'
import clsx from 'clsx'
import { MapPin, Clock, Navigation, Flag, Star, CheckCircle2, Zap } from 'lucide-react'
import { JobsAPI } from '../utils/api'
import { timeAgo, formatNaira, statusBadge, categoryLabel } from '../utils/helpers'
import { Avatar, Badge, Spinner } from './UI'
import type { Job } from '../types'

interface Props { job: Job; isWorker?: boolean; onAccepted?: (id: string) => void; onComplete?: (id: string) => void }

export const JobCard: React.FC<Props> = ({ job, isWorker, onAccepted, onComplete }) => {
  const [accepting,  setAccepting]  = useState(false)
  const [completing, setCompleting] = useState(false)
  const [accepted,   setAccepted]   = useState(false)

  const handleAccept = async (e: React.MouseEvent) => {
    e.stopPropagation(); setAccepting(true)
    try { await JobsAPI.accept(job._id); setAccepted(true); toast.success(`Accepted: "${job.title}"`); onAccepted?.(job._id) }
    catch {} finally { setAccepting(false) }
  }
  const handleComplete = async (e: React.MouseEvent) => {
    e.stopPropagation(); setCompleting(true)
    try { await JobsAPI.updateStatus(job._id, 'COMPLETED'); toast.success('Job completed! 🎉'); onComplete?.(job._id) }
    catch {} finally { setCompleting(false) }
  }

  return (
    <div className="jcard fu">
      {/* Header row */}
      <div className="jcard-hd">
        <div className="jcard-tags">
          <Badge label={categoryLabel(job.category)} variant="badge-g" />
          {job.isUrgent && (
            <span className="badge badge-red" style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
              <Zap size={10} /> Urgent
            </span>
          )}
        </div>
        <div className="jcard-price">{formatNaira(job.budget)}</div>
      </div>

      {/* Title */}
      <h3 className="jcard-title">{job.title}</h3>

      {/* Meta */}
      <div className="jcard-meta">
        <span className="flex ac g1">
          <MapPin size={11} style={{ color: 'var(--ac)', flexShrink: 0 }} />
          {job.location?.area ? `${job.location.area}, ` : ''}{job.location?.city || 'Owerri'}
        </span>
        <span className="flex ac g1">
          <Clock size={11} style={{ flexShrink: 0 }} />
          {timeAgo(job.createdAt)}
        </span>
        {job.distance != null && (
          <span className="flex ac g1" style={{ color: 'var(--ac)', fontWeight: 700 }}>
            <Navigation size={11} style={{ flexShrink: 0 }} />
            {job.distance} km
          </span>
        )}
      </div>

      {/* Footer */}
      <div className="jcard-ft">
        <div className="jcard-client">
          <Avatar name={job.client?.name} size="sm" />
          <span>{job.client?.name}</span>
          {(job.client?.averageRating || 0) > 0 && (
            <span className="flex ac g1" style={{ color: 'var(--gold2)', fontWeight: 700, fontSize: 12 }}>
              <Star size={11} fill="currentColor" /> {job.client.averageRating}
            </span>
          )}
        </div>

        <div className="flex ac g2">
          {isWorker && job.status === 'OPEN' && !accepted && (
            <button className="btn btp btn-sm" onClick={handleAccept} disabled={accepting}>
              {accepting ? <Spinner size={13} /> : <><CheckCircle2 size={13} /> Accept</>}
            </button>
          )}
          {isWorker && job.status === 'ACCEPTED' && (
            <button className="btn bts btn-sm" onClick={handleComplete} disabled={completing}>
              {completing ? <Spinner size={13} /> : <><CheckCircle2 size={13} /> Complete</>}
            </button>
          )}
          {accepted && <Badge label="Accepted ✓" variant="badge-g" />}
          {(!isWorker || (job.status !== 'OPEN' && !accepted)) && !completing && (
            <Badge label={job.status} variant={statusBadge(job.status)} />
          )}
          <button
            className="jcard-report-btn"
            onClick={e => { e.stopPropagation(); toast('🚩 Report submitted') }}
            title="Report job"
          >
            <Flag size={13} />
          </button>
        </div>
      </div>
    </div>
  )
}

export const DistanceFilter: React.FC<{ selected: number; onChange: (km: number) => void }> = ({ selected, onChange }) => (
  <div className="fpills mb4">
    {[0, 2, 5, 10].map(km => (
      <button key={km} onClick={() => onChange(km)} className={clsx('fpill', selected === km && 'act')}>
        {km === 0 ? 'All' : `${km} km`}
      </button>
    ))}
  </div>
)
