import React, { useState } from 'react'
import { Plus, MapPin, Check } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

const PREVIEW_JOBS = [
  { title: 'Fix Kitchen Sink Leakage',     cat: 'maintenance', budget: 5000,  city: 'Ikenegbu',  urgent: true,  dt: '2h ago' },
  { title: 'Deep Clean 3-Bedroom Flat',    cat: 'cleaning',    budget: 12000, city: 'Wetheral',  urgent: false, dt: '4h ago' },
  { title: 'Deliver Groceries',            cat: 'delivery',    budget: 3500,  city: 'World Bank',urgent: true,  dt: '1h ago' },
  { title: 'Electrical Wiring in Office',  cat: 'electrical',  budget: 25000, city: 'New Owerri',urgent: false, dt: '6h ago' },
  { title: 'Paint 2-Bedroom Apartment',    cat: 'painting',    budget: 18000, city: 'Aladinma',  urgent: false, dt: '3h ago' },
  { title: 'Move Furniture to New Home',   cat: 'moving',      budget: 35000, city: 'GRA Owerri',urgent: false, dt: '5h ago' },
]

const USER_TYPES = [
  { icon:'👤', label:'Client',       price:'₦100/day', locked:false, desc:'Post errands & jobs. Get matched with skilled locals instantly.' },
  { icon:'🔨', label:'Worker',       price:'₦150/day', locked:false, desc:'Browse jobs nearby. Accept & complete tasks. Earn ⭐ Priority badge.' },
  { icon:'🚚', label:'Delivery Co.', price:'₦150/day', locked:false, desc:'Accept delivery jobs near your fleet. Location-based matching.' },
  { icon:'🏪', label:'Business',     price:'₦150/day', locked:false, desc:'Receive service requests. Manage client communications.' },
  { icon:'💻', label:'Freelancer',   price:'₦150/day', locked:true,  desc:'Digital & admin tasks. Earn Priority badge after 5 tasks. Coming soon.' },
]

const Landing: React.FC = () => {
  const navigate   = useNavigate()
  const [activeCat, setActiveCat] = useState('All')

  const filtered = activeCat === 'All'
    ? PREVIEW_JOBS
    : PREVIEW_JOBS.filter(j => j.cat === activeCat.toLowerCase())

  return (
    <div style={{ background: 'var(--bg0)', color: 'var(--t1)', minHeight: '100vh' }}>
      {/* ── NAV ── */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 lg:px-10 py-4 border-b"
        style={{ background: 'rgba(11,24,16,.94)', borderColor: 'var(--bd1)', backdropFilter: 'blur(16px)' }}>
        <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => navigate('/')}>
          <div className="w-9 h-9 rounded-xl flex items-center justify-center text-xl font-bold font-display text-black"
            style={{ background: 'linear-gradient(135deg,#15803d,#22c55e)', boxShadow: '0 3px 12px rgba(34,197,94,.35)' }}>E</div>
          <span className="font-display text-xl font-bold">Erradely</span>
        </div>
        <div className="hidden lg:flex gap-8">
          {['How it Works','Services','Pricing','Reviews'].map(l => (
            <span key={l} className="text-sm cursor-pointer hover:text-[var(--ac)] transition-colors" style={{ color: 'var(--t2)' }}>{l}</span>
          ))}
        </div>
        <div className="flex gap-2">
          <button className="btn bts btn-sm" onClick={() => navigate('/login')}>Log In</button>
          <button className="btn btp btn-sm" onClick={() => navigate('/signup')}>Get Started Free</button>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section className="min-h-screen flex items-center justify-center pt-24 pb-16 px-6 text-center relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div style={{ position:'absolute', width:700, height:700, borderRadius:'50%', background:'var(--ac)', filter:'blur(80px)', opacity:.07, top:-200, left:-150 }} />
          <div style={{ position:'absolute', width:500, height:500, borderRadius:'50%', background:'var(--gold2)', filter:'blur(80px)', opacity:.06, bottom:-100, right:-80 }} />
          <div style={{ position:'absolute', inset:0, backgroundImage:'linear-gradient(var(--bd1) 1px,transparent 1px),linear-gradient(90deg,var(--bd1) 1px,transparent 1px)', backgroundSize:'52px 52px', opacity:.5 }} />
        </div>
        <div className="relative z-10 max-w-4xl mx-auto animate-fade-up">
          <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full text-sm font-semibold mb-7 cursor-pointer"
            style={{ background: 'rgba(34,197,94,.1)', border: '1px solid rgba(34,197,94,.25)', color: 'var(--ac)' }}
            onClick={() => navigate('/signup')}>
            🇳🇬 Owerri, Imo State — <strong>7-Day Free Trial for Early Users</strong> →
          </div>
          <h1 className="font-display mb-5 leading-tight"
            style={{ fontSize: 'clamp(44px,7vw,88px)', fontWeight: 700,
              background: 'linear-gradient(155deg,var(--t1) 42%,var(--ac))',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
            Get Any Task Done<br/>Near You — Fast
          </h1>
          <p className="text-lg mb-9 max-w-xl mx-auto leading-relaxed" style={{ color: 'var(--t2)' }}>
            Connect with verified workers, businesses, delivery companies and freelancers across Nigeria. Post a job in 60 seconds.
          </p>
          <div className="flex gap-4 justify-center flex-wrap mb-10">
            <button className="btn btn-primary btn-xl" onClick={() => navigate('/signup')}>➕ Post a Job — Free</button>
            <button className="btn btn-secondary btn-xl" onClick={() => navigate('/signup')}>💼 Find Work Near Me</button>
          </div>
          <div className="flex gap-6 justify-center flex-wrap text-sm" style={{ color: 'var(--t2)' }}>
            {['No job payment fees','7-day free trial','Verified workers','⭐ Priority Worker badges'].map(t => (
              <span key={t} className="flex ac g2">
                <span className="w-1.5 h-1.5 rounded-full inline-block" style={{ background: 'var(--ac)' }} />{t}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ── STATS ── */}
      <div className="grid grid-cols-2 md:grid-cols-4 border-t border-b" style={{ borderColor: 'var(--bd1)', background: 'var(--bg2)' }}>
        {[['12,400+','Active Workers'],['8,200+','Jobs Completed'],['4.9 ★','Average Rating'],['Owerri','Launch City, Imo State']].map(([v,l]) => (
          <div key={l} className="text-center p-6 lg:p-8 border-r last:border-r-0" style={{ borderColor: 'var(--bd1)' }}>
            <div className="font-display text-3xl font-bold mb-1" style={{ color: 'var(--ac)' }}>{v}</div>
            <div className="bmd" style={{ color: 'var(--t3)' }}>{l}</div>
          </div>
        ))}
      </div>

      {/* ── USER TYPES ── */}
      <section className="py-16 px-6 max-w-6xl mx-auto">
        <div className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: 'var(--t2)' }}>Who It's For</div>
        <h2 className="font-display text-4xl font-bold mb-10">Five User Types, One Platform</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {USER_TYPES.map(u => (
            <div key={u.label} onClick={() => !u.locked && navigate('/signup')}
              className={`card p-6 relative overflow-hidden transition-all duration-300 ${!u.locked ? 'card-hover cursor-pointer' : 'opacity-80'}`}
              style={u.locked ? { borderStyle: 'dashed', borderColor: 'rgba(107,114,128,.3)' } : {}}>
              {u.locked && <div className="absolute top-4 right-4 w-7 h-7 rounded-lg flex items-center justify-center text-xs" style={{ background: 'rgba(107,114,128,.15)', border: '1px solid rgba(107,114,128,.25)', color: '#9ca3af' }}>🔒</div>}
              <div className="text-4xl mb-4">{u.icon}</div>
              <h3 className="text-base font-bold mb-2">{u.label}</h3>
              <p className="text-sm mb-4 leading-relaxed" style={{ color: 'var(--t2)' }}>{u.desc}</p>
              <div className="tsm" style={{ color: u.locked ? '#9ca3af' : 'var(--ac)' }}>
                {u.locked ? '🔒 Coming soon · ' : ''}{u.price} after trial →
              </div>
              {u.locked && <span className="badge badge-gray mt-2">JOIN TO GET NOTIFIED</span>}
            </div>
          ))}
        </div>
      </section>

      {/* ── JOBS PREVIEW ── */}
      <section className="py-16 px-6 border-t border-b" style={{ borderColor: 'var(--bd1)', background: 'var(--bg2)' }}>
        <div className="max-w-6xl mx-auto">
          <div className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: 'var(--t2)' }}>Live Jobs</div>
          <h2 className="font-display text-4xl font-bold mb-6">Browse Active Jobs</h2>
          <div className="flex gap-2 flex-wrap mb-6">
            {['All','Errands','Maintenance','Delivery','Cleaning'].map(c => (
              <button key={c} onClick={() => setActiveCat(c)}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium border transition-all ${activeCat===c ? 'border-[var(--ac)] bg-[rgba(34,197,94,.1)] text-[var(--ac)]' : 'border-[var(--bd1)] text-[var(--t2)]'}`}>
                {c}
              </button>
            ))}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map(j => (
              <div key={j.title} className="card cursor-pointer card-hover p-5" onClick={() => navigate('/signup')}>
                <div className="flex items-start justify-between mb-3">
                  <div className="flex gap-2 flex-wrap">
                    <span className="badge bg">{j.cat}</span>
                    {j.urgent && <span className="badge bred">🔥 Urgent</span>}
                  </div>
                  <span className="bsm" style={{ color: 'var(--t3)' }}>{j.dt}</span>
                </div>
                <h3 className="font-display text-base font-bold mb-3 leading-snug">{j.title}</h3>
                <div className="flex items-center gap-3 text-xs mb-4" style={{ color: 'var(--t3)' }}>
                  <span>📍 {j.city}, Owerri</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-display text-xl font-bold" style={{ color: 'var(--ac)' }}>₦{j.budget.toLocaleString()}</span>
                  <span className="badge bg">OPEN</span>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-8">
            <button className="btn btn-secondary btn-lg" onClick={() => navigate('/signup')}>View All Jobs — Sign Up Free</button>
          </div>
        </div>
      </section>

      {/* ── PRICING ── */}
      <section className="py-16 px-6 max-w-6xl mx-auto">
        <div className="text-center mb-10">
          <div className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: 'var(--t2)' }}>Simple Pricing</div>
          <h2 className="font-display text-4xl font-bold mb-3">Flat Rates, No Surprises</h2>
          <p className="text-base" style={{ color: 'var(--t2)' }}>7-day free trial for all early users. No credit card required.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {[['👤','Client','₦100','client'],['🔨','Worker','₦150','worker'],['💻','Freelancer','₦150','freelancer'],['🚚','Delivery Co.','₦150','delivery'],['🏪','Business','₦150','business']].map(([icon,label,price,role]) => (
            <div key={label} className="card text-center p-5 border-2 hover:border-[var(--ac)] transition-all cursor-pointer" style={{ borderColor: label==='Worker' ? 'var(--ac)' : 'var(--bd1)', position: 'relative' }}
              onClick={() => navigate(`/signup?role=${role}`)}>
              {label==='Worker' && <div className="absolute -top-3 left-1/2 -translate-x-1/2 text-[9px] font-black px-3 py-0.5 rounded-full text-black" style={{ background: 'linear-gradient(135deg,#15803d,#22c55e)' }}>POPULAR</div>}
              <div className="text-3xl mb-3">{icon}</div>
              <div className="text-sm font-bold mb-2">{label}</div>
              <div className="font-display text-3xl font-bold mb-1" style={{ color: 'var(--ac)' }}>{price}</div>
              <div className="text-xs mb-4" style={{ color: 'var(--t3)' }}>per day</div>
              <button className={`btn btn-sm btn-block ${label==='Worker' ? 'btn-primary' : 'btn-secondary'}`}>
                Start Free Trial
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section className="py-16 px-6 border-t" style={{ borderColor: 'var(--bd1)', background: 'var(--bg2)' }}>
        <div className="max-w-4xl mx-auto text-center mb-10">
          <h2 className="font-display text-4xl font-bold">Loved in Owerri</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-5xl mx-auto">
          {[
            { text: '"Found a plumber in 20 minutes. Same-day fix. Erradely is a game changer for Owerri!"', name: 'Adaeze Okonkwo', role: 'Client · Ikenegbu', av: 'AO', c: 0 },
            { text: '"I completed 5 jobs in 2 weeks and earned my Priority Worker badge. Now I get first access to every new job!"', name: 'Emmanuel Madu', role: '⭐ Priority Worker · World Bank', av: 'EM', c: 1 },
            { text: '"Our delivery company handles 20+ Erradely orders weekly. The location matching is incredible."', name: 'Fatima Bello', role: 'Delivery Co. · Owerri North', av: 'FB', c: 3 },
          ].map(t => (
            <div key={t.name} className="card p-6">
              <div className="text-yellow-400 text-base mb-3">★★★★★</div>
              <p className="text-sm leading-relaxed mb-4 italic" style={{ color: 'var(--t2)' }}>{t.text}</p>
              <div className="flex ac g3">
                <div className={`avatar avatar-md`} style={{ background: ['linear-gradient(135deg,#15803d,#22c55e)','linear-gradient(135deg,#c8920a,#f0b429)','linear-gradient(135deg,#1d4ed8,#3b82f6)','linear-gradient(135deg,#6d28d9,#8b5cf6)'][t.c], color: t.c===0||t.c===1?'#000':'#fff' }}>{t.av}</div>
                <div>
                  <div className="tsm">{t.name}</div>
                  <div className="bsm" style={{ color: 'var(--t3)' }}>{t.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-20 px-6 text-center relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 rounded-full" style={{ background: 'var(--ac)', filter: 'blur(80px)', opacity: .05 }} />
        <div className="relative z-10 max-w-xl mx-auto">
          <h2 className="font-display text-4xl font-bold mb-4">Start Your Free Trial Today</h2>
          <p className="text-base mb-8" style={{ color: 'var(--t2)' }}>Join Owerri's growing platform. 7 full days free. No credit card. Cancel anytime.</p>
          <div className="flex gap-4 justify-center flex-wrap">
            <button className="btn btn-primary btn-xl" onClick={() => navigate('/signup')}>🚀 Create Free Account</button>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="border-t py-10 px-6" style={{ borderColor: 'var(--bd1)', background: 'var(--bg2)' }}>
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center text-lg font-bold font-display text-black" style={{ background: 'linear-gradient(135deg,#15803d,#22c55e)' }}>E</div>
            <span className="font-display text-lg font-bold">Erradely</span>
          </div>
          <p className="text-xs text-center" style={{ color: 'var(--t3)' }}>© 2026 Erradely Nigeria Ltd. Owerri, Imo State. All rights reserved.</p>
          <div className="flex gap-4 text-xs" style={{ color: 'var(--t3)' }}>
            <span className="cursor-pointer hover:text-[var(--ac)]">Terms</span>
            <span className="cursor-pointer hover:text-[var(--ac)]">Privacy</span>
            <span className="cursor-pointer hover:text-[var(--ac)]">Help</span>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default Landing
