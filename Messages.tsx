import React, { useEffect, useState, useRef } from 'react'
import { MessagesAPI } from '../../utils/api'
import { useAuth } from '../../context/AuthContext'
import { useSocket } from '../../context/SocketContext'
import { Avatar, SkeletonList, Empty } from '../../components/UI'
import { timeAgo, initials } from '../../utils/helpers'
import type { Message, Conversation } from '../../types'

const Messages: React.FC = () => {
  const { user }   = useAuth()
  const { sendMessage, sendTyping } = useSocket()
  const [convos, setConvos]     = useState<Conversation[]>([])
  const [msgs, setMsgs]         = useState<Message[]>([])
  const [activeConvo, setActive] = useState<Conversation | null>(null)
  const [text, setText]         = useState('')
  const [loading, setLoading]   = useState(true)
  const [sending, setSending]   = useState(false)
  const msgsEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    MessagesAPI.getConversations()
      .then(res => { setConvos(res.data.conversations); if (res.data.conversations[0]) openConvo(res.data.conversations[0]) })
      .finally(() => setLoading(false))
  }, [])

  const openConvo = async (convo: Conversation) => {
    setActive(convo)
    const res = await MessagesAPI.getConversation(convo.otherUser._id)
    setMsgs(res.data.messages)
    setTimeout(() => msgsEndRef.current?.scrollIntoView(), 100)
  }

  const handleSend = async () => {
    if (!text.trim() || !activeConvo) return
    const content = text.trim(); setText('')
    setSending(true)

    // Optimistic message
    const optimistic: Message = {
      _id:            `tmp-${Date.now()}`,
      sender:         { _id: user!._id, name: user!.name, profilePhoto: user?.profilePhoto },
      receiver:       { _id: activeConvo.otherUser._id, name: activeConvo.otherUser.name },
      conversationId: activeConvo.conversationId,
      text:           content,
      isRead:         false,
      createdAt:      new Date().toISOString(),
    }
    setMsgs(prev => [...prev, optimistic])
    setTimeout(() => msgsEndRef.current?.scrollIntoView(), 50)

    try {
      await MessagesAPI.send({ receiverId: activeConvo.otherUser._id, text: content })
      sendMessage(activeConvo.otherUser._id, content)
    } catch {} finally { setSending(false) }
  }

  const isMe = (msg: Message) =>
    (msg.sender?._id || msg.sender) === user?._id

  return (
    <div className="flex rounded-2xl overflow-hidden border" style={{ borderColor: 'var(--bd1)', height: 'calc(100vh - 130px)', minHeight: 480 }}>
      {/* Conversations list */}
      <div className="w-72 flex-shrink-0 border-r flex flex-col" style={{ background: 'var(--bg2)', borderColor: 'var(--bd1)' }}>
        <div className="p-4 border-b flex items-center justify-between" style={{ borderColor: 'var(--bd1)' }}>
          <span className="tsm">Messages</span>
          <span className="badge bg">{convos.reduce((s, c) => s + c.unreadCount, 0)} new</span>
        </div>
        <div className="flex-1 overflow-y-auto">
          {loading ? <div className="p-4"><SkeletonList n={3} /></div>
           : convos.length === 0 ? <Empty icon="💬" title="No conversations" sub="Accept a job to start chatting" />
           : convos.map((c, i) => (
              <div key={c.conversationId} onClick={() => openConvo(c)}
                className={`flex gap-3 p-4 cursor-pointer border-b transition-colors ${activeConvo?.conversationId === c.conversationId ? 'bg-[rgba(34,197,94,.06)]' : 'hover:bg-[rgba(34,197,94,.03)]'}`}
                style={{ borderColor: 'var(--bd1)' }}>
                <Avatar name={c.otherUser.name} size="md" colorIndex={i} online={c.otherUser.isOnline} />
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between mb-0.5">
                    <span className="text-sm font-bold truncate">{c.otherUser.name}</span>
                    <span className="text-[10px] flex-shrink-0 ml-2" style={{ color: 'var(--t3)' }}>{timeAgo(c.lastMessage?.createdAt)}</span>
                  </div>
                  <div className="text-xs truncate" style={{ color: 'var(--t3)' }}>
                    {c.otherUser.role} · {c.lastMessage?.text?.slice(0, 35) || '...'}
                  </div>
                </div>
                {c.unreadCount > 0 && (
                  <span className="w-5 h-5 rounded-full text-[10px] font-bold flex items-center justify-center flex-shrink-0" style={{ background: 'var(--ac)', color: '#000' }}>
                    {c.unreadCount}
                  </span>
                )}
              </div>
            ))
          }
        </div>
      </div>

      {/* Chat area */}
      {activeConvo ? (
        <div className="flex-1 flex flex-col min-w-0" style={{ background: 'var(--bg1)' }}>
          {/* Header */}
          <div className="flex items-center gap-3 p-4 border-b" style={{ borderColor: 'var(--bd1)', background: 'var(--nav,var(--bg2))' }}>
            <Avatar name={activeConvo.otherUser.name} size="md" online={activeConvo.otherUser.isOnline} />
            <div>
              <div className="tsm">{activeConvo.otherUser.name}</div>
              <div className={`text-xs ${activeConvo.otherUser.isOnline ? 'text-green-400' : ''}`} style={{ color: activeConvo.otherUser.isOnline ? undefined : 'var(--t3)' }}>
                {activeConvo.otherUser.isOnline ? '● Online now' : 'Offline'}
              </div>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3">
            {msgs.map(msg => (
              <div key={msg._id} className={`flex flex-col gap-1 max-w-[66%] ${isMe(msg) ? 'self-end items-end' : 'self-start'}`}>
                <div className={`bubble-text ${isMe(msg) ? 'bubble-me' : 'bubble-them'}`} style={isMe(msg) ? { background: 'linear-gradient(135deg,#15803d,#22c55e)', color: '#000', borderRadius: '18px 18px 4px 18px' } : { background: 'var(--bgc)', border: '1px solid var(--bd1)', borderRadius: '18px 18px 18px 4px', color: 'var(--t1)' }}>
                  {msg.text}
                </div>
                <span className="text-[10px]" style={{ color: 'var(--t3)' }}>
                  {new Date(msg.createdAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            ))}
            <div ref={msgsEndRef} />
          </div>

          {/* Input */}
          <div className="flex items-center gap-2 p-3 border-t" style={{ borderColor: 'var(--bd1)', background: 'var(--nav,var(--bg2))' }}>
            <input
              className="input flex-1 rounded-full py-2.5 px-4 text-sm"
              placeholder="Type a message..."
              value={text}
              onChange={e => setText(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && !e.shiftKey && handleSend()}
              onFocus={() => sendTyping(activeConvo.otherUser._id, true)}
              onBlur={() => sendTyping(activeConvo.otherUser._id, false)}
            />
            <button
              className="w-10 h-10 rounded-full flex items-center justify-center text-black text-lg flex-shrink-0 transition-all active:scale-95"
              style={{ background: 'linear-gradient(135deg,#15803d,#22c55e)' }}
              onClick={handleSend}
              disabled={sending || !text.trim()}
            >
              ✈
            </button>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center flex-col gap-3" style={{ color: 'var(--t3)' }}>
          <span className="text-5xl opacity-20">💬</span>
          <span className="bmd">Select a conversation</span>
        </div>
      )}
    </div>
  )
}

export default Messages
