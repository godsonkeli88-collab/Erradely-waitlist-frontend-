import React, { useEffect, useRef, useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { getGPS } from '../../utils/helpers'

// Demo nearby users data (replace with API when /users/nearby endpoint is ready)
const NEARBY_USERS = [
  { id:'w1', name:'Emmanuel Madu',   role:'worker',   lat:5.4870, lng:7.0310, rating:4.9, jobs:47, online:true,  skill:'Electrician',  dist:'0.4 km' },
  { id:'w2', name:'Chidi Okafor',    role:'worker',   lat:5.4800, lng:7.0380, rating:4.8, jobs:31, online:true,  skill:'Plumber',      dist:'0.9 km' },
  { id:'w3', name:'Blessing Eze',    role:'worker',   lat:5.4910, lng:7.0290, rating:5.0, jobs:62, online:false, skill:'Cleaner',      dist:'1.2 km' },
  { id:'w4', name:'Tunde Bakare',    role:'worker',   lat:5.4780, lng:7.0410, rating:4.7, jobs:28, online:true,  skill:'Carpenter',    dist:'1.6 km' },
  { id:'w5', name:'Amaka Nwosu',     role:'worker',   lat:5.4850, lng:7.0250, rating:4.9, jobs:19, online:true,  skill:'Painter',      dist:'2.1 km' },
  { id:'d1', name:'FastMove Delivery',role:'delivery', lat:5.4920, lng:7.0350, rating:4.6, jobs:120, online:true, skill:'Delivery Co.', dist:'1.8 km' },
  { id:'d2', name:'SwiftBox Co.',    role:'delivery', lat:5.4760, lng:7.0300, rating:4.8, jobs:89,  online:false, skill:'Delivery Co.', dist:'2.4 km' },
  { id:'b1', name:'Mama Put Kitchen',role:'business', lat:5.4840, lng:7.0420, rating:4.9, jobs:200, online:true, skill:'Restaurant',   dist:'0.7 km' },
  { id:'b2', name:'Owerri Hotel',    role:'business', lat:5.4890, lng:7.0360, rating:4.7, jobs:150, online:true, skill:'Hotel',        dist:'1.1 km' },
  { id:'c1', name:'Adaeze Okonkwo',  role:'client',   lat:5.4820, lng:7.0340, rating:4.8, jobs:5,   online:true, skill:'Client',       dist:'0.3 km' },
  { id:'c2', name:'Ngozi Abara',     role:'client',   lat:5.4950, lng:7.0280, rating:4.9, jobs:12,  online:false,skill:'Client',       dist:'2.9 km' },
]

const ROLE_CONFIG = {
  worker:   { color:'#f0b429', bg:'rgba(240,180,41,.15)',  emoji:'🔨', label:'Worker'   },
  delivery: { color:'#c4b5fd', bg:'rgba(196,181,253,.15)', emoji:'🚚', label:'Delivery' },
  business: { color:'#93c5fd', bg:'rgba(147,197,253,.15)', emoji:'🏪', label:'Business' },
  client:   { color:'#86efac', bg:'rgba(134,239,172,.15)', emoji:'👤', label:'Client'   },
}

const NearbyMap: React.FC = () => {
  const { user }  = useAuth()
  const mapRef    = useRef<HTMLDivElement>(null)
  const mapInst   = useRef<unknown>(null)
  const [selected, setSelected] = useState<typeof NEARBY_USERS[0] | null>(null)
  const [filter,   setFilter]   = useState<string[]>(['worker','delivery','business','client'])
  const [radius,   setRadius]   = useState(5)
  const [counts,   setCounts]   = useState({ worker:0, delivery:0, business:0, client:0 })
  const [loading,  setLoading]  = useState(true)

  useEffect(() => {
    const init = async () => {
      const L = (await import('leaflet')).default
      if (!mapRef.current || mapInst.current) return

      const coords = await getGPS()
      setLoading(false)

      const map = L.map(mapRef.current, {
        zoomControl: false,
        attributionControl: false,
      }).setView([coords.lat, coords.lng], 15)

      // Dark-styled map tiles
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
      }).addTo(map)

      // Custom zoom control position
      L.control.zoom({ position: 'bottomright' }).addTo(map)

      mapInst.current = map

      // ── User's own location marker ──────────────────────────
      const youIcon = L.divIcon({
        className: '',
        html: `
          <div style="position:relative">
            <div style="width:48px;height:48px;border-radius:50%;background:linear-gradient(135deg,#15803d,#22c55e);
              border:3px solid #fff;display:flex;align-items:center;justify-content:center;
              font-size:20px;box-shadow:0 4px 16px rgba(34,197,94,.6);
              animation:pulse-ring 2s ease-in-out infinite">
              ${user?.role === 'worker' ? '🔨' : user?.role === 'client' ? '👤' : '📍'}
            </div>
            <div style="position:absolute;bottom:-6px;left:50%;transform:translateX(-50%);
              background:#22c55e;color:#000;font-size:9px;font-weight:800;
              padding:1px 6px;border-radius:99px;white-space:nowrap;font-family:sans-serif">YOU</div>
            <div style="position:absolute;top:0;left:0;width:48px;height:48px;border-radius:50%;
              border:2px solid rgba(34,197,94,.4);animation:ping 1.5s ease-out infinite"></div>
          </div>`,
        iconSize: [48, 56], iconAnchor: [24, 56],
      })
      L.marker([coords.lat, coords.lng], { icon: youIcon }).addTo(map)
        .bindPopup(`<div style="font-family:sans-serif;min-width:140px;padding:4px">
          <b>📍 Your Location</b><br>
          <small style="color:#22c55e">${user?.name || 'You'} · ${user?.role}</small>
        </div>`)

      // ── Radius circle ──────────────────────────────────────
      L.circle([coords.lat, coords.lng], {
        color: '#22c55e', fillColor: '#22c55e', fillOpacity: 0.04,
        radius: radius * 1000, weight: 1.5, dashArray: '6 4',
      }).addTo(map)

      // ── Nearby user markers ─────────────────────────────────
      const cnt = { worker:0, delivery:0, business:0, client:0 }

      NEARBY_USERS.forEach(u => {
        cnt[u.role as keyof typeof cnt]++
        const cfg = ROLE_CONFIG[u.role as keyof typeof ROLE_CONFIG]

        const icon = L.divIcon({
          className: '',
          html: `
            <div style="position:relative;cursor:pointer">
              <div style="width:42px;height:42px;border-radius:50%;
                background:${cfg.color};
                border:3px solid #fff;
                display:flex;align-items:center;justify-content:center;
                font-size:17px;
                box-shadow:0 3px 12px rgba(0,0,0,.35);
                opacity:${u.online ? 1 : 0.6};
                transition:transform .2s">
                ${cfg.emoji}
              </div>
              ${u.online ? `<div style="position:absolute;bottom:2px;right:2px;width:10px;height:10px;
                background:#22c55e;border-radius:50%;border:2px solid #fff"></div>` : ''}
            </div>`,
          iconSize: [42, 42], iconAnchor: [21, 42],
        })

        const marker = L.marker(
          [coords.lat + (u.lat - 5.4836), coords.lng + (u.lng - 7.0333)],
          { icon }
        ).addTo(map)

        marker.bindPopup(`
          <div style="font-family:sans-serif;min-width:180px;padding:6px">
            <div style="display:flex;align-items:center;gap:8px;margin-bottom:8px">
              <div style="width:36px;height:36px;border-radius:50%;background:${cfg.color};
                display:flex;align-items:center;justify-content:center;font-size:16px;flex-shrink:0">${cfg.emoji}</div>
              <div>
                <div style="font-weight:700;font-size:13px">${u.name}</div>
                <div style="font-size:11px;color:#666">${u.skill} · ${u.dist}</div>
              </div>
            </div>
            <div style="display:flex;gap:12px;font-size:12px;margin-bottom:8px">
              <span style="color:#f0b429">★ ${u.rating}</span>
              <span style="color:#666">${u.jobs} jobs</span>
              <span style="color:${u.online ? '#22c55e' : '#999'}">${u.online ? '● Online' : '○ Offline'}</span>
            </div>
            <button onclick="window.erradelyChat('${u.id}')" style="width:100%;padding:6px;background:#22c55e;color:#000;border:none;border-radius:8px;font-size:12px;font-weight:700;cursor:pointer;font-family:sans-serif">
              💬 Send Message
            </button>
          </div>
        `)

        marker.on('click', () => setSelected(u))
      })

      setCounts(cnt)
    }

    init()
    return () => {
      if (mapInst.current) {
        (mapInst.current as { remove: () => void }).remove()
        mapInst.current = null
      }
    }
  }, [])

  // Chat handler from popup
  useEffect(() => {
    (window as unknown as Record<string, unknown>).erradelyChat = (id: string) => {
      const u = NEARBY_USERS.find(x => x.id === id)
      if (u) setSelected(u)
    }
  }, [])

  const filteredUsers = NEARBY_USERS.filter(u => filter.includes(u.role))

  return (
    <div className="relative" style={{ height: 'calc(100vh - 130px)', minHeight: 520 }}>

      {/* ── Filter bar ───────────────────────────────────────── */}
      <div className="flex items-center gap-2 mb-3 flex-wrap">
        {(Object.entries(ROLE_CONFIG) as [string, typeof ROLE_CONFIG.worker][]).map(([role, cfg]) => (
          <button
            key={role}
            onClick={() => setFilter(prev =>
              prev.includes(role) ? prev.filter(r => r !== role) : [...prev, role]
            )}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border-2 transition-all"
            style={{
              borderColor: filter.includes(role) ? cfg.color : 'var(--bd1)',
              background:  filter.includes(role) ? cfg.bg    : 'var(--bgc)',
              color:       filter.includes(role) ? cfg.color : 'var(--t3)',
            }}
          >
            {cfg.emoji} {cfg.label}
            <span className="ml-0.5 font-bold">{counts[role as keyof typeof counts]}</span>
          </button>
        ))}

        {/* Radius filter */}
        <div className="ml-auto flex items-center gap-1.5">
          {[2,5,10].map(km => (
            <button key={km} onClick={() => setRadius(km)}
              className="px-3 py-1.5 rounded-full text-xs font-bold border-2 transition-all"
              style={{
                borderColor: radius===km ? 'var(--ac)' : 'var(--bd1)',
                background:  radius===km ? 'rgba(34,197,94,.1)' : 'var(--bgc)',
                color:       radius===km ? 'var(--ac)' : 'var(--t3)',
              }}>
              {km}km
            </button>
          ))}
        </div>
      </div>

      {/* ── Map ─────────────────────────────────────────────── */}
      <div className="map-wrap" style={{ height: selected ? 'calc(100% - 220px)' : 'calc(100% - 52px)', transition: 'height .3s ease' }}>
        {loading && (
          <div className="absolute inset-0 z-10 flex items-center justify-center" style={{ background: 'var(--bgc)' }}>
            <div className="text-center">
              <div className="text-3xl mb-3 animate-pulse">📍</div>
              <div className="bmd" style={{ color: 'var(--t2)' }}>Getting your location...</div>
            </div>
          </div>
        )}
        <div ref={mapRef} style={{ width: '100%', height: '100%' }} />

        {/* Legend */}
        <div className="absolute top-3 left-3 z-40 card card-sm text-xs" style={{ background: 'var(--bgc)', backdropFilter: 'blur(10px)', padding: '10px 14px' }}>
          <div className="font-bold mb-2" style={{ color: 'var(--t1)' }}>Nearby</div>
          {Object.entries(ROLE_CONFIG).map(([role, cfg]) => (
            <div key={role} className="flex items-center gap-2 mb-1">
              <span className="bmd">{cfg.emoji}</span>
              <span style={{ color: cfg.color, fontWeight: 700 }}>{counts[role as keyof typeof counts]}</span>
              <span style={{ color: 'var(--t3)' }}>{cfg.label}s</span>
            </div>
          ))}
          <div className="flex items-center gap-2 mt-2 pt-2 border-t" style={{ borderColor: 'var(--bd1)' }}>
            <div className="w-2 h-2 rounded-full" style={{ background: '#22c55e' }} />
            <span style={{ color: 'var(--t3)' }}>Online</span>
            <div className="w-2 h-2 rounded-full ml-2" style={{ background: 'var(--t3)' }} />
            <span style={{ color: 'var(--t3)' }}>Offline</span>
          </div>
        </div>

        {/* Refresh btn */}
        <button
          className="absolute top-3 right-3 z-40 btn btn-secondary btn-sm"
          style={{ backdropFilter: 'blur(10px)' }}
          onClick={() => window.location.reload()}
        >
          🔄 Refresh
        </button>
      </div>

      {/* ── Selected user panel ──────────────────────────────── */}
      {selected && (() => {
        const cfg = ROLE_CONFIG[selected.role as keyof typeof ROLE_CONFIG]
        return (
          <div className="card mt-3 animate-fade-up" style={{ padding: '16px 18px' }}>
            <div className="flex items-center justify-between">
              <div className="flex ac g3">
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0"
                  style={{ background: cfg.bg, border: `2px solid ${cfg.color}` }}>
                  {cfg.emoji}
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="font-bold text-sm">{selected.name}</span>
                    <span className="text-xs font-semibold" style={{ color: selected.online ? '#22c55e' : 'var(--t3)' }}>
                      {selected.online ? '● Online' : '○ Offline'}
                    </span>
                  </div>
                  <div className="bsm" style={{ color: 'var(--t3)' }}>
                    {selected.skill} · {selected.dist} away · ★ {selected.rating} · {selected.jobs} jobs
                  </div>
                </div>
              </div>
              <button className="btn btn-ghost btn-sm text-lg" onClick={() => setSelected(null)}>✕</button>
            </div>
            <div className="flex gap-2 mt-3">
              <button className="btn btn-primary flex-1 btn-sm">💬 Send Message</button>
              <button className="btn btn-secondary flex-1 btn-sm">👤 View Profile</button>
              {(selected.role === 'worker' || selected.role === 'delivery') && (
                <button className="btn btn-gold flex-1 btn-sm">💼 Offer Job</button>
              )}
            </div>
          </div>
        )
      })()}

      {/* ── People list below map ────────────────────────────── */}
      {!selected && (
        <div className="mt-3">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--t3)' }}>
              {filteredUsers.length} people nearby
            </span>
            <span className="bsm" style={{ color: 'var(--t3)' }}>Tap a marker or row to chat</span>
          </div>
          <div className="flex gap-2 overflow-x-auto pb-1" style={{ scrollbarWidth: 'none' }}>
            {filteredUsers.filter(u => u.online).slice(0, 8).map(u => {
              const cfg = ROLE_CONFIG[u.role as keyof typeof ROLE_CONFIG]
              return (
                <div key={u.id} className="flex-shrink-0 cursor-pointer rounded-2xl p-3 border-2 transition-all hover:scale-105"
                  style={{ background: cfg.bg, borderColor: cfg.color, minWidth: 110 }}
                  onClick={() => setSelected(u)}>
                  <div className="text-xl mb-1 text-center">{cfg.emoji}</div>
                  <div className="text-xs font-bold text-center truncate" style={{ color: 'var(--t1)', maxWidth: 90 }}>{u.name.split(' ')[0]}</div>
                  <div className="text-[10px] text-center mt-0.5" style={{ color: cfg.color }}>{u.dist}</div>
                  <div className="text-[10px] text-center" style={{ color: 'var(--t3)' }}>★ {u.rating}</div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      <style>{`
        @keyframes ping {
          0% { transform: scale(1); opacity: .6; }
          100% { transform: scale(2.2); opacity: 0; }
        }
        @keyframes pulse-ring {
          0%, 100% { box-shadow: 0 0 0 0 rgba(34,197,94,.4); }
          50% { box-shadow: 0 0 0 10px rgba(34,197,94,0); }
        }
        .leaflet-popup-content-wrapper {
          background: var(--bgc) !important;
          border: 1px solid var(--bd2) !important;
          border-radius: 14px !important;
          box-shadow: 0 8px 32px rgba(0,0,0,.4) !important;
          color: var(--t1) !important;
        }
        .leaflet-popup-tip { background: var(--bgc) !important; }
        .leaflet-popup-close-button { color: var(--t2) !important; font-size: 16px !important; }
      `}</style>
    </div>
  )
}

export default NearbyMap
