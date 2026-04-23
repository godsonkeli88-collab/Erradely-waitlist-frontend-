import React, { useEffect, useState, useCallback } from 'react'
import { JobsAPI } from '../../utils/api'
import { useAuth } from '../../context/AuthContext'
import { getGPS } from '../../utils/helpers'
import { JobCard, DistanceFilter } from '../../components/JobCard'
import { SkeletonList, Empty, ErrorState } from '../../components/UI'
import type { Job } from '../../types'

const BusinessRequests: React.FC<{ activeOnly?: boolean }> = ({ activeOnly }) => {
  const { refresh } = useAuth()
  const [jobs, setJobs]       = useState<Job[]>([])
  const [loading, setLoading] = useState(true)
  const [error,   setError]   = useState(false)
  const [distKm,  setDistKm]  = useState(0)

  const load = useCallback(async (km = 0) => {
    setLoading(true); setError(false)
    try {
      if (activeOnly) {
        const res = await JobsAPI.getMy({ status: 'ACCEPTED' })
        setJobs(res.data.jobs)
      } else {
        const coords = await getGPS()
        const params: Record<string, string | number> = { lat: coords.lat, lng: coords.lng, status: 'OPEN' }
        if (km > 0) params.radius = km
        const res = await JobsAPI.getAll(params)
        setJobs(res.data.jobs)
      }
    } catch { setError(true) }
    finally { setLoading(false) }
  }, [distKm, activeOnly])

  useEffect(() => { load(distKm) }, [distKm])

  return (
    <div className="content-wrap">
      {!activeOnly && (
        <DistanceFilter selected={distKm} onChange={km => { setDistKm(km); load(km) }} />
      )}

      {error
        ? <ErrorState onRetry={() => load(distKm)} />
        : loading
          ? <SkeletonList />
          : jobs.length
            ? jobs.map(j => (
                <JobCard
                  key={j._id}
                  job={j}
                  isWorker={j.status === 'OPEN' || j.status === 'ACCEPTED'}
                  onAccepted={() => { refresh(); load(distKm) }}
                  onComplete={() => { refresh(); load(distKm) }}
                />
              ))
            : <Empty
                icon="🏪"
                title={activeOnly ? 'No active jobs' : 'No requests in this area'}
                sub={activeOnly ? 'Accept a service request to see it here.' : 'Try a wider distance filter.'}
              />
      }
    </div>
  )
}

export default BusinessRequests
