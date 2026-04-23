import React from 'react'
import { Bell, CheckCheck } from 'lucide-react'
import { Empty } from '../../components/UI'

const Notifications: React.FC = () => (
  <div style={{ maxWidth: 580 }}>
    <div className="flex jb ac mb5">
      <div className="flex ac g2">
        <Bell size={18} style={{ color: 'var(--ac)' }} />
        <span className="bmd t2">Your notifications</span>
      </div>
      <button className="btn bts btn-sm"><CheckCheck size={14} /> Mark all read</button>
    </div>
    <Empty icon={<Bell size={38} style={{ opacity: .25, color: 'var(--t3)' }} />}
      title="No notifications yet"
      sub="Job alerts, messages, and subscription reminders will appear here." />
  </div>
)

export default Notifications
