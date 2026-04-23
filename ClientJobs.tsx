// ── ClientJobs.tsx ────────────────────────────────────────────────────────
import React, { useEffect, useState } from 'react'
import { JobsAPI } from '../../utils/api'
import { JobCard, DistanceFilter } from '../../components/JobCard'
import { SkeletonList, Empty, ErrorState } from '../../components/UI'
import type { Job } from '../../types'

export const ClientJobs: React.FC<{ onPostJob: () => void }> = ({ onPostJob }) => {
  const [jobs, setJobs]       = useState<Job[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState(false)
  const [status, setStatus]   = useState('all')

  const load = async () => {
    setLoading(true); setError(false)
    try {
      const params: Record<string, string> = {}
      if (status !== 'all') params.status = status.toUpperCase()
      const res = await JobsAPI.getMy(params)
      setJobs(res.data.jobs)
    } catch { setError(true) }
    finally { setLoading(false) }
  }

  useEffect(() => { load() }, [status])

  return (
    <div className="content-wrap">
      <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
        <div className="flex fw g2">
          {['all','open','accepted','completed'].map(s => (
            <button key={s} onClick={() => setStatus(s)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${status===s ? 'border-[var(--ac)] bg-[rgba(34,197,94,.1)] text-[var(--ac)]' : 'border-[var(--bd1)] text-[var(--t2)]'}`}>
              {s.charAt(0).toUpperCase() + s.slice(1)}
            </button>
          ))}
        </div>
        <button className="btn btp btn-sm" onClick={onPostJob}>＋ Post Job</button>
      </div>
      {error   ? <ErrorState onRetry={load} />
       : loading ? <SkeletonList />
       : jobs.length ? jobs.map(j => <JobCard key={j._id} job={j} />)
       : <Empty icon="📭" title="No jobs found" sub="Post your first job!" />}
    </div>
  )
}

export default ClientJobs
