import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { useAuth } from '../../context/AuthContext'
import { ArrowRight, LogIn, UserPlus } from 'lucide-react'
import { Spinner, Divider } from '../../components/UI'

interface Form { email: string; password: string }

const Login: React.FC = () => {
  const { login } = useAuth()
  const navigate  = useNavigate()
  const [loading, setLoading] = useState(false)
  const { register, handleSubmit, formState: { errors } } = useForm<Form>()

  const onSubmit = async (data: Form) => {
    setLoading(true)
    const ok = await login(data.email, data.password)
    setLoading(false)
    if (ok) navigate('/', { replace: true })
  }

  return (
    <div className="min-h-screen flex" style={{ background:'var(--bg0)' }}>
      <div className="hidden lg:flex flex-col justify-between w-[420px] flex-shrink-0 p-10 border-r relative overflow-hidden" style={{ background:'var(--bg2)', borderColor:'var(--bd1)' }}>
        <div className="absolute inset-0 pointer-events-none">
          <div style={{ position:'absolute', width:350, height:350, borderRadius:'50%', background:'var(--ac)', filter:'blur(80px)', opacity:.1, top:-80, left:-80 }} />
          <div style={{ position:'absolute', width:250, height:250, borderRadius:'50%', background:'var(--gold2)', filter:'blur(70px)', opacity:.08, bottom:-60, right:-60 }} />
        </div>
        <div style={{ position:'relative', zIndex:1 }}>
          <div className="flex items-center gap-2.5 mb-12 cursor-pointer" onClick={() => navigate('/')}>
            <div className="w-10 h-10 rounded-xl flex items-center justify-center text-2xl font-bold font-display text-black" style={{ background:'linear-gradient(135deg,#15803d,#22c55e)' }}>E</div>
            <span className="font-display text-2xl font-bold" style={{ color:'var(--t1)' }}>Erradely</span>
          </div>
          <p className="font-display text-3xl leading-relaxed mb-4" style={{ color:'var(--t1)' }}>
            "The fastest way to get work done in <span style={{ color:'var(--ac)' }}>Nigeria</span>"
          </p>
          <p className="bmd" style={{ color:'var(--t2)' }}>12,000+ verified workers across Owerri and beyond.</p>
          <div className="flex gap-8 mt-10">
            {[['8,200+','Jobs Done'],['4.9 ★','Avg Rating'],['7 Days','Free Trial']].map(([v,l]) => (
              <div key={l}><div className="font-display text-2xl font-bold" style={{ color:'var(--ac)' }}>{v}</div><div className="text-xs mt-1" style={{ color:'var(--t3)' }}>{l}</div></div>
            ))}
          </div>
        </div>
        <p className="bsm" style={{ position:'relative', zIndex:1, color:'var(--t3)' }}>© 2026 Erradely Nigeria Ltd.</p>
      </div>

      <div className="flex-1 flex items-center justify-center p-6 lg:p-10">
        <div className="w-full max-w-md animate-slide-in">
          <h1 className="font-display text-4xl font-bold mb-2" style={{ color:'var(--t1)' }}>Welcome back</h1>
          <p className="text-sm mb-8" style={{ color:'var(--t2)' }}>Sign in to your account</p>
          <button className="w-full flex items-center justify-center gap-3 rounded-xl px-4 py-3 text-sm font-medium border transition-all mb-4"
            style={{ background:'var(--bgc)', borderColor:'var(--bd2)', color:'var(--t1)' }}
            onClick={() => { window.location.href = `${import.meta.env.VITE_SOCKET_URL||'http://localhost:5000'}/api/auth/google?role=client` }}>
            <svg width="19" height="19" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
            Continue with Google
          </button>
          <Divider text="or email" />
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="fg">
              <label className="fl">Email</label>
              <input className="fi" type="email" placeholder="you@example.com" {...register('email',{required:'Email required',pattern:{value:/\S+@\S+\.\S+/,message:'Invalid email'}})} />
              {errors.email && <span className="text-xs text-red-400">{errors.email.message}</span>}
            </div>
            <div className="fg">
              <label className="fl">Password</label>
              <input className="fi" type="password" placeholder="••••••••" {...register('password',{required:'Password required'})} />
              {errors.password && <span className="text-xs text-red-400">{errors.password.message}</span>}
              <div className="text-right mt-1"><button type="button" className="bsm" style={{ color:'var(--ac)' }}>Forgot password?</button></div>
            </div>
            <button type="submit" className="btn btn-primary btn-block btn-lg mt-2" disabled={loading}>
              {loading ? <Spinner /> : <><LogIn size={16} /> Sign In</>}
            </button>
          </form>
          <p className="text-sm text-center mt-5" style={{ color:'var(--t2)' }}>
            No account? <Link to="/signup" style={{fontWeight:700, color:'var(--ac)'}}>Create one free →</Link>
          </p>
          <p className="text-center mt-3"><Link to="/admin" className="text-xs btn btn-ghost btn-sm">🔐 Admin Demo</Link></p>
        </div>
      </div>
    </div>
  )
}
export default Login
