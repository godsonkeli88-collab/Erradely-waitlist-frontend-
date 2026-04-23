import React, { useState } from 'react'
import { Search, Star, MapPin, MessageCircle, Wifi, WifiOff } from 'lucide-react'
import toast from 'react-hot-toast'
import { Avatar, Empty } from '../../components/UI'

const DEMO_WORKERS = [
  { name: 'Emmanuel Madu',  role: 'Electrician', rating: 4.9, jobs: 47, loc: 'World Bank',  online: true,  verified: true,  pw: true,  colorIdx: 1 },
  { name: 'Chidi Okafor',   role: 'Plumber',     rating: 4.8, jobs: 31, loc: 'Ikenegbu',    online: true,  verified: true,  pw: false, colorIdx: 2 },
  { name: 'Blessing Eze',   role: 'Cleaner',      rating: 5.0, jobs: 62, loc: 'Wetheral',    online: false, verified: false, pw: true,  colorIdx: 3 },
  { name: 'Tunde Bakare',   role: 'Carpenter',   rating: 4.7, jobs: 28, loc: 'New Owerri',  online: true,  verified: true,  pw: false, colorIdx: 0 },
  { name: 'Amaka Nwosu',    role: 'Painter',     rating: 4.9, jobs: 19, loc: 'GRA Owerri',  online: false, verified: false, pw: false, colorIdx: 1 },
  { name: 'Seun Adeyemi',   role: 'Mover',       rating: 4.6, jobs: 55, loc: 'Aladinma',    online: true,  verified: false, pw: true,  colorIdx: 2 },
]

const ClientWorkers: React.FC = () => {
  const [search, setSearch]   = useState('')
  const [distKm, setDistKm]   = useState(0)

  const filtered = DEMO_WORKERS.filter(w =>
    w.name.toLowerCase().includes(search.toLowerCase()) ||
    w.role.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="content-wrap">
      {/* Search + filter */}
      <div className="flex flex-wrap gap-3 mb-5">
        <div className="relative flex-1 min-w-[200px]">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm" style={{ color: 'var(--t3)' }}>🔍</span>
          <input className="input pl-9" placeholder="Search by skill or area..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <div className="flex gap-2">
          {[0,2,5,10].map(km => (
            <button key={km} onClick={() => setDistKm(km)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${distKm===km ? 'border-[var(--ac)] bg-[rgba(34,197,94,.1)] text-[var(--ac)]' : 'border-[var(--bd1)] text-[var(--t2)]'}`}>
              {km === 0 ? 'All' : `${km} km`}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0
        ? <Empty icon="🔍" title="No workers found" sub="Try a different search or expand distance" />
        : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filtered.map(w => (
              <div key={w.name} className="card card-hover p-5">
                <div className="flex items-start gap-3 mb-4">
                  <div className="relative">
                    <Avatar name={w.name} size="lg" colorIndex={w.colorIdx} />
                    {w.online && <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full border-2" style={{ background: '#22c55e', borderColor: 'var(--bg0)' }} />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <span className="font-bold text-sm">{w.name}</span>
                      {w.verified && <span className="text-xs font-semibold" style={{ color: '#93c5fd' }}>✓ Verified</span>}
                    </div>
                    {w.pw && <div className="priority-badge text-[10px] px-2 py-0.5 mb-1">⭐ Priority Worker</div>}
                    <div className={`text-xs font-semibold ${w.online ? 'text-green-400' : ''}`} style={{ color: w.online ? undefined : 'var(--t3)' }}>
                      {w.online ? '● Online now' : '○ Offline'}
                    </div>
                  </div>
                </div>
                <div className="flex gap-5 mb-4">
                  <div><div className="tmd" style={{ color: 'var(--gold2)' }}>{w.rating} ★</div><div className="bsm" style={{ color: 'var(--t3)' }}>Rating</div></div>
                  <div><div className="tmd">{w.jobs}</div><div className="bsm" style={{ color: 'var(--t3)' }}>Jobs</div></div>
                  <div><div className="text-sm font-semibold" style={{ color: 'var(--t2)' }}>{w.loc}</div><div className="bsm" style={{ color: 'var(--t3)' }}>Location</div></div>
                </div>
                <div className="flex gap-2">
                  <button className="btn btn-secondary btn-sm flex-1" onClick={() => toast(`👤 ${w.name} — ${w.role}`)}>View Profile</button>
                  <button className="btn btn-primary btn-sm flex-1" onClick={() => toast(`💬 Opening chat with ${w.name}`)}>💬 Chat</button>
                </div>
              </div>
            ))}
          </div>
        )
      }
    </div>
  )
}

export default ClientWorkers
