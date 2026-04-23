import { formatDistanceToNow } from 'date-fns'
import type { Role, NotifType } from '../types'

export const timeAgo = (date: string) => {
  try { return formatDistanceToNow(new Date(date), { addSuffix: true }) } catch { return '' }
}
export const daysLeft = (dateStr?: string): number => {
  if (!dateStr) return 0
  const diff = new Date(dateStr).getTime() - Date.now()
  return diff > 0 ? Math.ceil(diff / 86400000) : 0
}
export const initials = (name = ''): string =>
  name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()

export const formatNaira = (amount?: number): string =>
  amount != null ? `₦${amount.toLocaleString('en-NG')}` : 'Negotiable'

export const notifIcon = (type: NotifType): string => ({
  new_job:'💼', job_accepted:'✅', job_completed:'🎉', job_cancelled:'❌',
  new_message:'💬', subscription_expiring:'⏰', subscription_expired:'🚨',
  subscription_active:'⭐', trial_started:'🎉', priority_badge_earned:'⭐',
  new_review:'⭐', account_suspended:'⛔', system:'📢',
}[type] || '🔔')

export const dailyRate = (role: Role): number =>
  ({ client:100, worker:150, delivery:150, business:150, freelancer:150 } as Record<string,number>)[role] ?? 100

export const avatarClass = (i: number): string =>
  ['avatar-green','avatar-gold','avatar-blue','avatar-purple','avatar-teal'][i % 5]

export const categoryLabel = (cat: string): string =>
  cat.replace(/_/g,' ').replace(/\b\w/g, l => l.toUpperCase())

export const statusBadge = (status: string): string =>
  ({ OPEN:'badge-green', ACCEPTED:'badge-gold', COMPLETED:'badge-blue', CANCELLED:'badge-red',
     IN_PROGRESS:'badge-purple', TRIAL:'badge-gold', ACTIVE:'badge-green', EXPIRED:'badge-red',
     active:'badge-green', expired:'badge-red', trial:'badge-gold' } as Record<string,string>)[status] || 'badge-gray'

export const getGPS = (): Promise<{ lat: number; lng: number }> =>
  new Promise(resolve => {
    if (!navigator.geolocation) return resolve({ lat:5.4836, lng:7.0333 })
    navigator.geolocation.getCurrentPosition(
      p => resolve({ lat: p.coords.latitude, lng: p.coords.longitude }),
      ()  => resolve({ lat:5.4836, lng:7.0333 }),
      { timeout: 5000 }
    )
  })
