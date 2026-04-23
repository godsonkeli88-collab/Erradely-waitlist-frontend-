import axios from 'axios'
import toast from 'react-hot-toast'
import type { User, Job, Message, Conversation, Subscription, SubscriptionStatus, Report, LoginPayload, RegisterPayload } from '../types'

export const API_BASE   = import.meta.env.VITE_API_URL    || 'http://localhost:5000/api'
export const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000'

const api = axios.create({ baseURL: API_BASE, headers: { 'Content-Type': 'application/json' }, timeout: 15000 })

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('erradely_token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

api.interceptors.response.use(
  (res) => res,
  (err) => {
    const msg = err.response?.data?.message || 'Something went wrong'
    if (err.response?.status === 401) {
      localStorage.removeItem('erradely_token'); localStorage.removeItem('erradely_user')
      window.location.href = '/login'
    } else if (err.response?.status !== 403) {
      toast.error(msg)
    }
    return Promise.reject(err)
  }
)

export const getToken   = ()         => localStorage.getItem('erradely_token')
export const setToken   = (t: string)=> localStorage.setItem('erradely_token', t)
export const getUser    = (): User | null => { try { return JSON.parse(localStorage.getItem('erradely_user') || '') } catch { return null } }
export const setUser    = (u: User)  => localStorage.setItem('erradely_user', JSON.stringify(u))
export const clearAuth  = ()         => { localStorage.removeItem('erradely_token'); localStorage.removeItem('erradely_user') }
export const isLoggedIn = ()         => !!getToken()

export const AuthAPI = {
  register:        (data: RegisterPayload) => api.post<{ success: boolean; token: string; user: User; message: string }>('/auth/register', data),
  login:           (data: LoginPayload)    => api.post<{ success: boolean; token: string; user: User; message: string }>('/auth/login', data),
  getMe:           ()                      => api.get<{ success: boolean; user: User }>('/auth/me'),
  logout:          ()                      => api.post('/auth/logout'),
  updateLocation:  (data: Record<string, unknown>) => api.patch('/auth/update-location', data),
  freelancerNotify:()                      => api.post('/auth/freelancer-notify'),
  switchToWorker:  ()                      => api.post<{ success: boolean; user: User; message: string }>('/auth/switch-to-worker'),
}

export const JobsAPI = {
  getAll:  (params?: Record<string, string | number>) => api.get<{ success: boolean; jobs: Job[]; count: number; page: number }>('/jobs', { params }),
  getMy:   (params?: Record<string, string | number>) => api.get<{ success: boolean; jobs: Job[]; total: number }>('/jobs/my', { params }),
  getById: (id: string)                               => api.get<{ success: boolean; job: Job }>(`/jobs/${id}`),
  create:  (data: Partial<Job> & { location: Job['location'] }) => api.post<{ success: boolean; job: Job }>('/jobs', data),
  accept:  (id: string)                               => api.patch<{ success: boolean; job: Job; message: string }>(`/jobs/${id}/accept`),
  updateStatus: (id: string, status: string)          => api.patch<{ success: boolean; job: Job }>(`/jobs/${id}/status`, { status }),
  report:  (id: string, data: { type: string; description?: string }) => api.post(`/jobs/${id}/report`, data),
  review:  (id: string, data: Record<string, unknown>) => api.post(`/jobs/${id}/review`, data),
}

export const MessagesAPI = {
  getConversations: ()                          => api.get<{ success: boolean; conversations: Conversation[] }>('/messages/conversations'),
  getConversation:  (userId: string, page = 1)  => api.get<{ success: boolean; messages: Message[]; otherUser: User; total: number }>(`/messages/conversation/${userId}`, { params: { page } }),
  send:             (data: { receiverId: string; text: string; jobId?: string }) => api.post<{ success: boolean; message: Message }>('/messages', data),
  getUnreadCount:   ()                          => api.get<{ success: boolean; unreadCount: number }>('/messages/unread-count'),
}

export const SubscriptionsAPI = {
  getMy:       ()   => api.get<{ success: boolean; subscription: SubscriptionStatus; history: Subscription[] }>('/subscriptions/my'),
  initialize:  (data: { durationDays: number; paymentProvider: string }) =>
    api.post<{ success: boolean; reference: string; amount: number; paymentUrl?: string; bankDetails?: Record<string, string> }>('/subscriptions/initialize', data),
}

export const AdminAPI = {
  getStats:         ()                            => api.get<{ success: boolean; stats: Record<string, unknown>; recentUsers: User[] }>('/admin/stats'),
  getUsers:         (params?: Record<string, string>) => api.get<{ success: boolean; users: User[]; total: number }>('/admin/users', { params }),
  suspendUser:      (id: string, reason: string)  => api.patch(`/admin/users/${id}/suspend`, { reason }),
  activateUser:     (id: string)                  => api.patch(`/admin/users/${id}/activate`),
  deleteUser:       (id: string)                  => api.delete(`/admin/users/${id}`),
  getJobs:          (params?: Record<string, string>) => api.get<{ success: boolean; jobs: Job[]; total: number }>('/admin/jobs', { params }),
  deleteJob:        (id: string)                  => api.delete(`/admin/jobs/${id}`),
  getReports:       ()                            => api.get<{ success: boolean; reports: Report[] }>('/admin/reports'),
  resolveReport:    (id: string, data: { resolution: string; adminNote?: string }) => api.patch(`/admin/reports/${id}/resolve`, data),
  getSubscriptions: ()                            => api.get('/admin/subscriptions'),
  getFreelancers:   ()                            => api.get<{ success: boolean; freelancers: User[]; count: number }>('/admin/freelancers'),
  notifyFreelancers:()                            => api.post('/admin/freelancers/notify-all'),
  grantSub:         (userId: string, durationDays: number) => api.post('/subscriptions/admin-grant', { userId, durationDays }),
}

export default api
