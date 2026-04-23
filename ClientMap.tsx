import React, { useEffect, useRef, useState } from 'react'
import toast from 'react-hot-toast'
import { JobsAPI } from '../../utils/api'
import { getGPS, formatNaira } from '../../utils/helpers'
import type { Job } from '../../types'

const ClientMap: React.FC = () => {
  const mapRef  = useRef<HTMLDivElement>(null)
  const mapInst = useRef<unknown>(null)
  const [jobs, setJobs] = useState<Job[]>([])

  useEffect(() => {
    const init = async () => {
      const L = (await import('leaflet')).default
      if (!mapRef.current || mapInst.current) return

      const coords = await getGPS()
      const map = L.map(mapRef.current, { zoomControl: true, attributionControl: false })
        .setView([coords.lat, coords.lng], 14)
      mapInst.current = map

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 19 }).addTo(map)

      // User marker
      const userIcon = L.divIcon({
        className: '',
        html: `<div style="width:34px;height:34px;background:linear-gradient(135deg,#1d4ed8,#3b82f6);border-radius:50%;border:3px solid #fff;display:flex;align-items:center;justify-content:center;font-size:14px;box-shadow:0 3px 12px rgba(0,0,0,.4)">📍</div>`,
        iconSize: [34, 34], iconAnchor: [17, 17],
      })
      L.marker([coords.lat, coords.lng], { icon: userIcon }).addTo(map)
        .bindPopup('<b>📍 Your Location</b><br>Owerri, Imo State')

      L.circle([coords.lat, coords.lng], { color: '#22c55e', fillColor: '#22c55e', fillOpacity: .04, radius: 3000, weight: 1 }).addTo(map)

      // Load jobs
      try {
        const res = await JobsAPI.getAll({ lat: coords.lat, lng: coords.lng, radius: 10, limit: 20 })
        const jobList = res.data.jobs
        setJobs(jobList)

        const jobIcon = L.divIcon({
          className: '',
          html: `<div style="width:34px;height:34px;background:linear-gradient(135deg,#15803d,#22c55e);border-radius:50%;border:3px solid #fff;display:flex;align-items:center;justify-content:center;font-size:14px;box-shadow:0 3px 12px rgba(0,0,0,.4)">💼</div>`,
          iconSize: [34, 34], iconAnchor: [17, 17],
        })

        jobList.forEach((j: Job) => {
          const lat = j.location?.coordinates?.lat
          const lng = j.location?.coordinates?.lng
          if (!lat || !lng) return
          L.marker([lat, lng], { icon: jobIcon }).addTo(map)
            .bindPopup(`<div style="min-width:160px;font-family:sans-serif"><b>${j.title}</b><br><span style="color:#22c55e;font-weight:700">${formatNaira(j.budget)}</span><br><small>${j.location?.area || j.location?.city}</small></div>`)
        })
      } catch {}
    }

    init()
    return () => { if (mapInst.current) (mapInst.current as { remove: () => void }).remove(); mapInst.current = null }
  }, [])

  return (
    <div className="content-wrap">
      <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
        <div className="flex gap-2 flex-wrap">
          {['All Jobs','Urgent','Workers'].map(f => (
            <button key={f} className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${f === 'All Jobs' ? 'border-[var(--ac)] bg-[rgba(34,197,94,.1)] text-[var(--ac)]' : 'border-[var(--bd1)] text-[var(--t2)]'}`}>
              {f}
            </button>
          ))}
        </div>
        <button className="btn bts btn-sm" onClick={() => toast('📍 Location refreshed')}>
          📍 My Location
        </button>
      </div>

      <div className="map-wrap mb-5">
        <div ref={mapRef} style={{ height: 460, width: '100%' }} />
        <div className="absolute bottom-3 right-3 card card-sm text-xs" style={{ background: 'var(--bgc)', backdropFilter: 'blur(8px)' }}>
          <div className="flex items-center gap-2 mb-1"><span className="w-2.5 h-2.5 rounded-full inline-block" style={{ background: 'var(--ac)' }} /> Open Jobs</div>
          <div className="flex ac g2"><span className="w-2.5 h-2.5 rounded-full inline-block bg-blue-400" /> My Location</div>
        </div>
      </div>

      {jobs.length > 0 && (
        <div>
          <h3 className="font-display text-lg font-bold mb-3">Jobs on Map ({jobs.length})</h3>
          {jobs.slice(0, 4).map(j => (
            <div key={j._id} className="card card-sm mb-3 flex items-center gap-3 cursor-pointer card-hover"
              onClick={() => toast(`📋 ${j.title} — ${formatNaira(j.budget)}`)}>
              <span className="text-xs font-semibold" style={{ color: 'var(--ac)' }}>
                {j.distance != null ? `${j.distance} km` : '—'}
              </span>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-bold truncate">{j.title}</div>
                <div className="bsm" style={{ color: 'var(--t3)' }}>{j.location?.city}</div>
              </div>
              <div className="font-display font-bold text-sm" style={{ color: 'var(--ac)' }}>{formatNaira(j.budget)}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default ClientMap
