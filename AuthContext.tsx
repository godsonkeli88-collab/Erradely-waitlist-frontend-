import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'
import toast from 'react-hot-toast'
import { AuthAPI, setToken, setUser as saveUser, getUser, clearAuth, isLoggedIn } from '../utils/api'
import type { User, RegisterPayload } from '../types'

interface AuthCtx {
  user: User | null; loading: boolean
  login:    (email: string, password: string) => Promise<boolean>
  register: (data: RegisterPayload)           => Promise<boolean>
  logout:   ()                                => Promise<void>
  refresh:  ()                                => Promise<void>
  setUser:  (u: User)                         => void
}

const Ctx = createContext<AuthCtx>({} as AuthCtx)

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUserState]  = useState<User | null>(getUser())
  const [loading, setLoading] = useState(!!isLoggedIn())

  const setUser = useCallback((u: User) => { setUserState(u); saveUser(u) }, [])

  useEffect(() => {
    if (!isLoggedIn()) { setLoading(false); return }
    AuthAPI.getMe()
      .then(r => { setUser(r.data.user); setLoading(false) })
      .catch(() => { clearAuth(); setLoading(false) })
  }, [])

  const login = async (email: string, password: string) => {
    try {
      const r = await AuthAPI.login({ email, password })
      setToken(r.data.token); setUser(r.data.user)
      toast.success(`Welcome back, ${r.data.user.name}!`)
      return true
    } catch { return false }
  }

  const register = async (data: RegisterPayload) => {
    try {
      const r = await AuthAPI.register(data)
      setToken(r.data.token); setUser(r.data.user)
      toast.success('Account created! Your free trial has started 🎉')
      return true
    } catch { return false }
  }

  const logout = async () => {
    try { await AuthAPI.logout() } catch {}
    clearAuth(); setUserState(null)
    toast.success('Signed out. See you again!')
  }

  const refresh = async () => {
    if (!isLoggedIn()) return
    try { const r = await AuthAPI.getMe(); setUser(r.data.user) } catch {}
  }

  return <Ctx.Provider value={{ user, loading, login, register, logout, refresh, setUser }}>{children}</Ctx.Provider>
}

export const useAuth = () => useContext(Ctx)
