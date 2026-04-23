import React, { useState } from 'react'
import { Mail, Send, CheckCircle, Users, Loader2, AlertCircle, ArrowRight } from 'lucide-react'
import axios from 'axios'

const API      = import.meta.env.VITE_API_URL       || 'http://localhost:5000/api'
const WHATSAPP = import.meta.env.VITE_WHATSAPP_LINK || '#'
const DISCORD  = import.meta.env.VITE_DISCORD_LINK  || '#'

type Step = 'form' | 'success' | 'community'

const Watchlist: React.FC = () => {
  const [email,   setEmail]   = useState('')
  const [step,    setStep]    = useState<Step>('form')
  const [loading, setLoading] = useState(false)
  const [error,   setError]   = useState('')
  const [channel, setChannel] = useState<string | null>(null)

  const handleJoin = async (e: React.FormEvent) => {
    e.preventDefault()
    const clean = email.trim().toLowerCase()
    if (!clean || !clean.includes('@')) { setError('Please enter a valid email address.'); return }
    setLoading(true); setError('')
    try {
      await axios.post(`${API}/watchlist`, { email: clean })
      setStep('success')
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })
        ?.response?.data?.message || 'Something went wrong. Please try again.'
      setError(msg)
    } finally { setLoading(false) }
  }

  const handleChannel = async (ch: string, link: string) => {
    setChannel(ch)
    try { await axios.patch(`${API}/watchlist/channel`, { email, channel: ch }) } catch {}
    if (link !== '#') window.open(link, '_blank', 'noopener')
    setStep('community')
  }

  return (
    <div style={{
      minHeight: '100vh', background: '#060d09',
      display: 'flex', flexDirection: 'column',
      fontFamily: "'Plus Jakarta Sans', -apple-system, sans-serif",
      position: 'relative', overflow: 'hidden',
    }}>
      {/* Orbs */}
      <div style={{ position:'absolute',top:'-150px',left:'-100px',width:500,height:500,borderRadius:'50%',background:'#22c55e',filter:'blur(90px)',opacity:.07,pointerEvents:'none' }} />
      <div style={{ position:'absolute',bottom:'-60px',right:'-60px',width:300,height:300,borderRadius:'50%',background:'#c8920a',filter:'blur(90px)',opacity:.07,pointerEvents:'none' }} />
      <div style={{ position:'absolute',inset:0,pointerEvents:'none',backgroundImage:'linear-gradient(rgba(34,197,94,.03) 1px,transparent 1px),linear-gradient(90deg,rgba(34,197,94,.03) 1px,transparent 1px)',backgroundSize:'50px 50px' }} />

      {/* Nav */}
      <nav style={{ display:'flex',alignItems:'center',justifyContent:'space-between',padding:'14px 32px',background:'rgba(11,24,16,.94)',borderBottom:'1px solid rgba(34,197,94,.08)',backdropFilter:'blur(14px)',position:'sticky',top:0,zIndex:10 }}>
        <div style={{ display:'flex', alignItems:'center', gap:10 }}>
          <img src="/erradely-logo.jpg" alt="Erradely" style={{ width:36,height:36,borderRadius:9,objectFit:'cover',flexShrink:0 }} />
          <span style={{ fontFamily:"'Cormorant Garamond',serif",fontSize:22,fontWeight:700,color:'#eef7f0' }}>Erradely</span>
        </div>
        <span style={{ background:'rgba(34,197,94,.1)',border:'1px solid rgba(34,197,94,.2)',borderRadius:99,padding:'4px 14px',fontSize:12,fontWeight:700,color:'#22c55e',display:'flex',alignItems:'center',gap:6 }}>
          <span style={{ width:7,height:7,borderRadius:'50%',background:'#22c55e',display:'inline-block',animation:'blink 2s infinite' }} />
          Coming Soon
        </span>
      </nav>

      {/* Main */}
      <div style={{ flex:1,display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',padding:'60px 20px',position:'relative',zIndex:1 }}>

        {step === 'form' && (
          <div style={{ maxWidth:540,width:'100%',textAlign:'center',animation:'fadeUp .55s cubic-bezier(.22,1,.36,1)' }}>
            <div style={{ marginBottom:28,display:'flex',justifyContent:'center' }}>
              <img src="/erradely-logo.jpg" alt="Erradely" style={{ width:72,height:72,borderRadius:18,objectFit:'cover',boxShadow:'0 8px 32px rgba(34,197,94,.3)',border:'2px solid rgba(34,197,94,.25)' }} />
            </div>
            <div style={{ display:'inline-flex',alignItems:'center',gap:8,background:'rgba(34,197,94,.08)',border:'1px solid rgba(34,197,94,.2)',borderRadius:99,padding:'6px 18px',fontSize:13,fontWeight:600,color:'#22c55e',marginBottom:22 }}>
              🇳🇬 Launching in Owerri, Imo State
            </div>
            <h1 style={{ fontFamily:"'Cormorant Garamond',serif",fontSize:'clamp(38px,6vw,64px)',fontWeight:700,color:'#eef7f0',lineHeight:1.08,letterSpacing:-1.5,marginBottom:18 }}>
              Get Any Task Done<br />
              <span style={{ background:'linear-gradient(135deg,#22c55e,#4ade80)',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent' }}>
                Near You — Fast
              </span>
            </h1>
            <p style={{ color:'#8fb8a0',fontSize:16,lineHeight:1.75,maxWidth:440,margin:'0 auto 36px' }}>
              Erradely connects clients, workers, businesses &amp; delivery companies across Nigeria.
              Be <strong style={{ color:'#eef7f0' }}>first when we launch</strong>.
            </p>

            <form onSubmit={handleJoin} style={{ marginBottom:20 }}>
              <div style={{ display:'flex',gap:8,flexWrap:'wrap',background:'rgba(11,24,16,.85)',border:'1.5px solid rgba(34,197,94,.22)',borderRadius:14,padding:'7px 7px 7px 18px',boxShadow:'0 8px 40px rgba(0,0,0,.45)' }}>
                <Mail size={18} style={{ color:'#4d7a60',alignSelf:'center',flexShrink:0 }} />
                <input
                  type="email" value={email}
                  onChange={e => { setEmail(e.target.value); setError('') }}
                  placeholder="Enter your email address" required
                  style={{ flex:1,minWidth:180,background:'transparent',border:'none',outline:'none',color:'#eef7f0',fontSize:15,fontFamily:"'Plus Jakarta Sans',sans-serif" }}
                />
                <button type="submit" disabled={loading} style={{ display:'flex',alignItems:'center',gap:7,padding:'12px 22px',background:'linear-gradient(135deg,#16a34a,#4ade80)',color:'#000',border:'none',borderRadius:10,fontSize:14,fontWeight:800,cursor:'pointer',fontFamily:"'Plus Jakarta Sans',sans-serif",whiteSpace:'nowrap',flexShrink:0,boxShadow:'0 3px 14px rgba(34,197,94,.35)',transition:'all .18s',opacity:loading?.8:1 }}>
                  {loading
                    ? <Loader2 size={15} style={{ animation:'spin .7s linear infinite' }} />
                    : <><Send size={14} /> Join Watchlist</>
                  }
                </button>
              </div>
              {error && (
                <div style={{ marginTop:10,display:'flex',alignItems:'center',gap:7,color:error.toLowerCase().includes('already')?'#f0b429':'#f87171',fontSize:13,justifyContent:'center' }}>
                  <AlertCircle size={14} /> {error}
                </div>
              )}
            </form>

            <p style={{ color:'#4d7a60',fontSize:12 }}>🔒 No spam. No password needed. Unsubscribe anytime.</p>

            <div style={{ display:'flex',gap:0,marginTop:52,background:'rgba(11,24,16,.6)',border:'1px solid rgba(34,197,94,.08)',borderRadius:16,overflow:'hidden',flexWrap:'wrap' }}>
              {([['12,400+','Verified Workers'],['8,200+','Jobs Done'],['4.9 ★','Avg Rating'],['Free Trial','7 Days']] as [string,string][]).map(([v,l],i,arr) => (
                <div key={l} style={{ flex:'1 1 120px',padding:'18px 16px',textAlign:'center',borderRight:i<arr.length-1?'1px solid rgba(34,197,94,.08)':'none' }}>
                  <div style={{ fontFamily:"'Cormorant Garamond',serif",fontSize:20,fontWeight:700,color:v.includes('★')?'#f0b429':'#22c55e',marginBottom:3 }}>{v}</div>
                  <div style={{ fontSize:11,color:'#4d7a60' }}>{l}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {step === 'success' && (
          <div style={{ maxWidth:480,width:'100%',textAlign:'center',animation:'fadeUp .5s cubic-bezier(.22,1,.36,1)' }}>
            <div style={{ width:80,height:80,borderRadius:'50%',background:'rgba(34,197,94,.12)',border:'2px solid rgba(34,197,94,.3)',display:'flex',alignItems:'center',justifyContent:'center',margin:'0 auto 22px',animation:'badgePop .5s cubic-bezier(.22,1,.36,1)' }}>
              <CheckCircle size={42} style={{ color:'#22c55e' }} />
            </div>
            <h2 style={{ fontFamily:"'Cormorant Garamond',serif",fontSize:34,fontWeight:700,color:'#22c55e',marginBottom:12 }}>
              You're on the Watchlist! 🚀
            </h2>
            <p style={{ color:'#8fb8a0',fontSize:15,lineHeight:1.7,marginBottom:8 }}>
              <strong style={{ color:'#eef7f0' }}>{email}</strong> has been added.
              <br />Check your inbox — we sent you a confirmation.
            </p>
            <p style={{ color:'#4d7a60',fontSize:13,marginBottom:34 }}>We'll notify you the moment Erradely goes live. 🎯</p>

            <div style={{ background:'rgba(11,24,16,.85)',border:'1px solid rgba(34,197,94,.15)',borderRadius:20,padding:28 }}>
              <div style={{ display:'flex',alignItems:'center',gap:8,justifyContent:'center',marginBottom:20 }}>
                <Users size={18} style={{ color:'#22c55e' }} />
                <span style={{ fontWeight:700,fontSize:15,color:'#eef7f0' }}>Join our community while you wait</span>
              </div>
              <div style={{ display:'flex',gap:10,flexWrap:'wrap',justifyContent:'center' }}>
                <button onClick={() => handleChannel('whatsapp', WHATSAPP)} style={{ display:'flex',alignItems:'center',gap:9,padding:'13px 24px',background:'#25D366',color:'#fff',border:'none',borderRadius:12,fontSize:14,fontWeight:700,cursor:'pointer',fontFamily:"'Plus Jakarta Sans',sans-serif",boxShadow:'0 4px 16px rgba(37,211,102,.35)',transition:'all .18s' }}>
                  💬 Join WhatsApp Group
                </button>
                <button onClick={() => handleChannel('discord', DISCORD)} style={{ display:'flex',alignItems:'center',gap:9,padding:'13px 24px',background:'#5865F2',color:'#fff',border:'none',borderRadius:12,fontSize:14,fontWeight:700,cursor:'pointer',fontFamily:"'Plus Jakarta Sans',sans-serif",boxShadow:'0 4px 16px rgba(88,101,242,.35)',transition:'all .18s' }}>
                  🎮 Join Discord Server
                </button>
              </div>
              <p style={{ color:'#4d7a60',fontSize:12,marginTop:14,textAlign:'center' }}>Get updates and early opportunities inside the community.</p>
            </div>
          </div>
        )}

        {step === 'community' && (
          <div style={{ maxWidth:440,width:'100%',textAlign:'center',animation:'fadeUp .5s cubic-bezier(.22,1,.36,1)' }}>
            <div style={{ fontSize:64,marginBottom:20 }}>🎉</div>
            <h2 style={{ fontFamily:"'Cormorant Garamond',serif",fontSize:32,fontWeight:700,color:'#eef7f0',marginBottom:14 }}>You're all set!</h2>
            <p style={{ color:'#8fb8a0',fontSize:15,lineHeight:1.7,marginBottom:28 }}>
              You've joined the&nbsp;
              <strong style={{ color:channel==='whatsapp'?'#25D366':'#5865F2' }}>
                {channel==='whatsapp'?'WhatsApp':'Discord'}
              </strong>&nbsp;community.
              <br />We'll see you there and notify you at launch!
            </p>
            <div style={{ background:'rgba(34,197,94,.06)',border:'1px solid rgba(34,197,94,.18)',borderRadius:14,padding:'16px 22px',fontSize:14,color:'#8fb8a0',lineHeight:1.9 }}>
              ✅ &nbsp;Email confirmed<br />
              💬 &nbsp;{channel==='whatsapp'?'WhatsApp':'Discord'} community joined<br />
              🚀 &nbsp;Ready for launch notification
            </div>
            <button onClick={() => { setStep('form'); setEmail(''); setChannel(null) }} style={{ marginTop:24,display:'inline-flex',alignItems:'center',gap:7,padding:'11px 22px',background:'transparent',border:'1px solid rgba(34,197,94,.2)',borderRadius:10,color:'#8fb8a0',fontSize:13,cursor:'pointer',fontFamily:"'Plus Jakarta Sans',sans-serif" }}>
              <ArrowRight size={14} /> Invite a friend
            </button>
          </div>
        )}
      </div>

      {step === 'form' && (
        <div style={{ background:'rgba(11,24,16,.6)',borderTop:'1px solid rgba(34,197,94,.07)',padding:'28px 32px',display:'flex',gap:0,justifyContent:'center',flexWrap:'wrap',position:'relative',zIndex:1 }}>
          {([['🔨','Find Workers','Verified, rated locals near you'],['📋','Post Jobs','Matched in under 10 minutes'],['🚚','Delivery','Same-day delivery companies'],['🏪','Businesses','Hotels, restaurants & more']] as [string,string,string][]).map(([em,t,d],i) => (
            <div key={t} style={{ padding:'12px 28px',textAlign:'center',flex:'1 1 160px',borderRight:i<3?'1px solid rgba(34,197,94,.06)':'none' }}>
              <div style={{ fontSize:22,marginBottom:7 }}>{em}</div>
              <div style={{ fontSize:13,fontWeight:700,color:'#eef7f0',marginBottom:3 }}>{t}</div>
              <div style={{ fontSize:11,color:'#4d7a60' }}>{d}</div>
            </div>
          ))}
        </div>
      )}

      <div style={{ textAlign:'center',padding:'14px 20px',borderTop:'1px solid rgba(34,197,94,.06)',color:'#4d7a60',fontSize:12,position:'relative',zIndex:1 }}>
        &copy; {new Date().getFullYear()} Erradely Nigeria Ltd &nbsp;&middot;&nbsp; Owerri, Imo State
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@600;700&family=Plus+Jakarta+Sans:wght@400;600;700;800&display=swap');
        @keyframes fadeUp   { from { opacity:0; transform:translateY(22px) } to { opacity:1; transform:translateY(0) } }
        @keyframes badgePop { 0%{opacity:0;transform:scale(.6)} 60%{transform:scale(1.18)} 100%{opacity:1;transform:scale(1)} }
        @keyframes spin     { to { transform:rotate(360deg) } }
        @keyframes blink    { 0%,100%{opacity:1} 50%{opacity:.3} }
        input::placeholder  { color:#4d7a60 }
        button:hover        { filter:brightness(1.1) }
        button:active       { transform:scale(.97) }
      `}</style>
    </div>
  )
}

export default Watchlist
