import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { useAuth } from '../../context/AuthContext'
import { ArrowRight, LogIn, UserPlus } from 'lucide-react'
import { Spinner, Divider } from '../../components/UI'
import type { Role } from '../../types'

const ROLES = [
  {id:'client'    as Role,icon:'👤',label:'Client',       price:'₦100/day',locked:false},
  {id:'worker'    as Role,icon:'🔨',label:'Worker',       price:'₦150/day',locked:false},
  {id:'delivery'  as Role,icon:'🚚',label:'Delivery Co.', price:'₦150/day',locked:false},
  {id:'business'  as Role,icon:'🏪',label:'Business',     price:'₦150/day',locked:false},
  {id:'freelancer'as Role,icon:'💻',label:'Freelancer',   price:'₦150/day',locked:true},
]
const CITIES = [
  {group:'Imo State (Launch Region)',cities:['Owerri (Ikenegbu)','Owerri (Wetheral)','Owerri (World Bank)','Owerri (Aladinma)','Orlu','Okigwe']},
  {group:'Lagos State',cities:['Lagos Island','Victoria Island','Lekki','Ikeja']},
  {group:'Abuja FCT',cities:['Central Area','Maitama','Wuse']},
  {group:'Anambra State',cities:['Awka','Onitsha','Nnewi']},
]

interface Form { name:string; phone:string; email:string; password:string; city:string; terms:boolean }

const Signup: React.FC = () => {
  const { register: reg } = useAuth()
  const navigate = useNavigate()
  const [role, setRole]   = useState<Role>('client')
  const [loading, setLoading] = useState(false)
  const { register, handleSubmit, formState: { errors } } = useForm<Form>()

  const onSubmit = async (data: Form) => {
    setLoading(true)
    const ok = await reg({ name:data.name, email:data.email, password:data.password, phone:data.phone, role, agreedToTerms:true, location:{country:'Nigeria',state:'Imo State',city:data.city,area:'',address:'',coordinates:{lat:5.4836,lng:7.0333}} })
    setLoading(false)
    if (ok) navigate('/', { replace: true })
  }

  return (
    <div className="min-h-screen flex" style={{ background:'var(--bg0)' }}>
      <div className="hidden lg:flex flex-col justify-between w-[400px] flex-shrink-0 p-10 border-r relative overflow-hidden" style={{ background:'var(--bg2)', borderColor:'var(--bd1)' }}>
        <div className="absolute inset-0 pointer-events-none">
          <div style={{ position:'absolute', width:350, height:350, borderRadius:'50%', background:'var(--ac)', filter:'blur(80px)', opacity:.1, top:-80, left:-80 }} />
        </div>
        <div style={{ position:'relative', zIndex:1 }}>
          <div className="flex items-center gap-2.5 mb-10 cursor-pointer" onClick={() => navigate('/')}>
            <div className="w-10 h-10 rounded-xl flex items-center justify-center text-2xl font-bold font-display text-black" style={{ background:'linear-gradient(135deg,#15803d,#22c55e)' }}>E</div>
            <span className="font-display text-2xl font-bold" style={{ color:'var(--t1)' }}>Erradely</span>
          </div>
          <p className="font-display text-2xl leading-relaxed mb-3" style={{ color:'var(--t1)' }}>
            "Start earning or <span style={{ color:'var(--ac)' }}>getting help</span> today"
          </p>
          <p className="text-sm mb-6" style={{ color:'var(--t2)' }}>7-day free trial starts the moment you sign up.</p>
          <div className="rounded-2xl p-5" style={{ background:'rgba(34,197,94,.06)', border:'1px solid rgba(34,197,94,.18)' }}>
            {['7 days of full platform access','Post, view & accept jobs freely','Real-time messaging & live map','Start earning Priority Worker badge'].map(t => (
              <div key={t} className="flex items-center gap-2 text-xs mb-2" style={{ color:'var(--t2)' }}><span style={{ color:'var(--ac)' }}>✓</span>{t}</div>
            ))}
          </div>
        </div>
        <p className="bsm" style={{ position:'relative', zIndex:1, color:'var(--t3)' }}>© 2026 Erradely Nigeria Ltd.</p>
      </div>

      <div className="flex-1 flex items-start justify-center p-6 lg:p-10 overflow-y-auto">
        <div className="w-full max-w-md py-6 animate-slide-in">
          <h1 className="font-display text-3xl font-bold mb-1" style={{ color:'var(--t1)' }}>Create your account</h1>
          <p className="text-sm mb-6" style={{ color:'var(--t2)' }}>7-day free trial — no credit card needed</p>
          <button className="w-full flex items-center justify-center gap-3 rounded-xl px-4 py-3 text-sm font-medium border transition-all mb-4"
            style={{ background:'var(--bgc)', borderColor:'var(--bd2)', color:'var(--t1)' }}
            onClick={() => { window.location.href = `${import.meta.env.VITE_SOCKET_URL||'http://localhost:5000'}/api/auth/google?role=${role}` }}>
            <svg width="18" height="18" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
            Continue with Google
          </button>
          <Divider text="or fill in details" />
          <div className="mb4">
            <label className="fl">I am a...</label>
            <div className="grid grid-cols-2 gap-2">
              {ROLES.map(r => (
                <button key={r.id} type="button" onClick={() => !r.locked && setRole(r.id)}
                  className={`rounded-xl p-3 text-center border transition-all ${role===r.id&&!r.locked ? 'border-[var(--ac)] bg-[rgba(34,197,94,.1)] text-[var(--ac)]' : 'border-[var(--bd1)] bg-[var(--bgc)] text-[var(--t2)]'} ${r.locked ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'}`}>
                  <div className="text-2xl mb-1">{r.icon}</div>
                  <div className="text-sm font-semibold">{r.label}</div>
                  <div className="text-xs mt-0.5" style={{ color:r.locked?'#9ca3af':'var(--t3)' }}>{r.locked?'🔒 Coming soon':r.price}</div>
                </button>
              ))}
            </div>
          </div>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="gr2 g3">
              <div className="fg"><label className="fl">Full Name *</label><input className="fi" placeholder="Adaeze Okonkwo" {...register('name',{required:'Name required'})} />{errors.name&&<span className="text-xs text-red-400">{errors.name.message}</span>}</div>
              <div className="fg"><label className="fl">Phone *</label><input className="fi" placeholder="+234 800 000 0000" {...register('phone',{required:'Phone required'})} /></div>
            </div>
            <div className="fg"><label className="fl">Email *</label><input className="fi" type="email" placeholder="you@example.com" {...register('email',{required:'Email required',pattern:{value:/\S+@\S+\.\S+/,message:'Invalid email'}})} />{errors.email&&<span className="text-xs text-red-400">{errors.email.message}</span>}</div>
            <div className="fg"><label className="fl">Password *</label><input className="fi" type="password" placeholder="Min. 8 characters" {...register('password',{required:'Password required',minLength:{value:8,message:'Min 8 characters'}})} />{errors.password&&<span className="text-xs text-red-400">{errors.password.message}</span>}</div>
            <div className="fg">
              <label className="fl">City *</label>
              <select className="fi" {...register('city',{required:'Select your city'})}>
                <option value="">Select your city...</option>
                {CITIES.map(g => <optgroup key={g.group} label={g.group}>{g.cities.map(c => <option key={c} value={c}>{c}</option>)}</optgroup>)}
              </select>
              {errors.city&&<span className="text-xs text-red-400">{errors.city.message}</span>}
            </div>
            <div className="flex items-start gap-3 mb-5">
              <input type="checkbox" id="terms" className="w-4 h-4 mt-0.5 accent-green-500 flex-shrink-0" {...register('terms',{required:'Must agree'})} defaultChecked />
              <label htmlFor="terms" className="text-xs cursor-pointer" style={{ color:'var(--t2)' }}>I agree to the <Link to="/terms" style={{ color:'var(--ac)' }}>Terms</Link> and <Link to="/privacy" style={{ color:'var(--ac)' }}>Privacy Policy</Link>. Job payments happen outside the platform.</label>
            </div>
            <button type="submit" className="btn btp btn-blk btn-lg" disabled={loading}>
              {loading ? <Spinner /> : <><UserPlus size={16} /> Create Account &amp; Start Trial</>}
            </button>
          </form>
          <p className="text-sm text-center mt-4" style={{ color:'var(--t2)' }}>Already have an account? <Link to="/login" style={{fontWeight:700, color:'var(--ac)'}}>Sign In</Link></p>
        </div>
      </div>
    </div>
  )
}
export default Signup
