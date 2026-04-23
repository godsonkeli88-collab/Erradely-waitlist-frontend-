import React, { useEffect, useState, useCallback } from 'react'
import { JobsAPI } from '../../utils/api'
import { useAuth } from '../../context/AuthContext'
import { getGPS } from '../../utils/helpers'
import { JobCard, DistanceFilter } from '../../components/JobCard'
import { SkeletonList, Empty, ErrorState } from '../../components/UI'
import type { Job } from '../../types'

const DeliveryOrders: React.FC<{ activeOnly?: boolean }> = ({ activeOnly }) => {
  const { refresh } = useAuth()
  const [orders, setOrders] = useState<Job[]>([])
  const [loading, setLoading] = useState(true)
  const [error,   setError]   = useState(false)
  const [distKm,  setDistKm]  = useState(0)
  const [filter,  setFilter]  = useState(activeOnly ? 'ACCEPTED' : 'all')

  const load = useCallback(async (km = 0) => {
    setLoading(true); setError(false)
    try {
      if (activeOnly) {
        const res = await JobsAPI.getMy({ status: 'ACCEPTED' })
        setOrders(res.data.jobs)
      } else {
        const coords = await getGPS()
        const params: Record<string, string | number> = {
          lat: coords.lat, lng: coords.lng, status: filter === 'all' ? 'OPEN' : filter,
        }
        if (km > 0) params.radius = km
        const res = await JobsAPI.getAll(params)
        setOrders(res.data.jobs)
      }
    } catch { setError(true) }
    finally { setLoading(false) }
  }, [distKm, filter, activeOnly])

  useEffect(() => { load(distKm) }, [distKm, filter])

  const filters = activeOnly
    ? ['ACCEPTED', 'IN_PROGRESS', 'COMPLETED']
    : ['all', 'OPEN']

  return (
    <div className="content-wrap">
      <div className="flex jb ac mb5 fw g3">
        <div className="fpills">
          {filters.map(f => (
            <span key={f} className={`fpill ${filter === f ? 'act' : ''}`}
              onClick={() => setFilter(f)}>
              {f === 'all' ? 'All Open' : f.charAt(0) + f.slice(1).toLowerCase()}
            </span>
          ))}
        </div>
      </div>

      {!activeOnly && (
        <DistanceFilter selected={distKm} onChange={km => { setDistKm(km); load(km) }} />
      )}

      {error
        ? <ErrorState onRetry={() => load(distKm)} />
        : loading
          ? <SkeletonList />
          : orders.length
            ? orders.map(j => (
                <JobCard
                  key={j._id}
                  job={j}
                  isWorker={j.status === 'OPEN' || j.status === 'ACCEPTED'}
                  onAccepted={() => { refresh(); load(distKm) }}
                  onComplete={() => { refresh(); load(distKm) }}
                />
              ))
            : <Empty
                icon="📦"
                title={activeOnly ? 'No active orders' : 'No orders in this range'}
                sub={activeOnly ? 'Accept an order to see it here.' : 'Try a wider distance filter.'}
              />
      }
    </div>
  )
}

export default DeliveryOrders
