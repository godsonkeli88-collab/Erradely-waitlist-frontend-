import React, { createContext, useContext, useEffect, useRef } from 'react'
import { io, type Socket } from 'socket.io-client'
import toast from 'react-hot-toast'
import { SOCKET_URL, getToken } from '../utils/api'
import { notifIcon } from '../utils/helpers'
import { useAuth } from './AuthContext'
import type { NotifType } from '../types'

interface SocketCtx {
  socket: Socket | null
  sendMessage: (receiverId: string, text: string) => void
  sendTyping:  (receiverId: string, isTyping: boolean) => void
}

const Ctx = createContext<SocketCtx>({ socket: null, sendMessage: () => {}, sendTyping: () => {} })

export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth()
  const ref = useRef<Socket | null>(null)

  useEffect(() => {
    if (!user) { ref.current?.disconnect(); ref.current = null; return }
    const socket = io(SOCKET_URL, { auth: { token: getToken() }, transports: ['websocket','polling'] })
    socket.on('connect', () => socket.emit('join', user._id))
    socket.on('notification', (n: { type: NotifType; title: string; body: string }) => {
      toast(`${notifIcon(n.type)} ${n.title}: ${n.body}`, { duration: 5000 })
    })
    socket.on('new_message', (msg: { sender: { name: string }; text: string }) => {
      toast(`💬 ${msg.sender?.name}: ${msg.text?.slice(0,50)}`, { duration: 4000 })
    })
    ref.current = socket
    return () => { socket.disconnect() }
  }, [user?._id])

  const sendMessage = (receiverId: string, text: string) =>
    ref.current?.emit('send_message', { receiverId, message: { text } })
  const sendTyping = (receiverId: string, isTyping: boolean) => {
    if (!user) return
    ref.current?.emit('typing', { receiverId, senderId: user._id, isTyping })
  }

  return <Ctx.Provider value={{ socket: ref.current, sendMessage, sendTyping }}>{children}</Ctx.Provider>
}

export const useSocket = () => useContext(Ctx)
