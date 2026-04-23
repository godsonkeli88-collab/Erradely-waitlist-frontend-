export type Role = 'client' | 'worker' | 'delivery' | 'business' | 'freelancer' | 'admin'
export type AccountStatus = 'TRIAL' | 'ACTIVE' | 'EXPIRED'
export type ActivityStatus = 'online' | 'busy' | 'offline'
export type JobStatus = 'OPEN' | 'ACCEPTED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED'
export type JobCategory = 'errands' | 'maintenance' | 'quick_tasks' | 'verification' | 'delivery' | 'cleaning' | 'carpentry' | 'painting' | 'electrical' | 'plumbing' | 'moving' | 'catering' | 'other'
export type PaymentProvider = 'opay' | 'palmpay' | 'bank'
export type PlanType = 'trial' | 'daily' | 'weekly' | 'monthly'
export type NotifType = 'new_job' | 'job_accepted' | 'job_completed' | 'job_cancelled' | 'new_message' | 'subscription_expiring' | 'subscription_expired' | 'subscription_active' | 'trial_started' | 'priority_badge_earned' | 'new_review' | 'account_suspended' | 'system'

export interface Location {
  country: string; state: string; city: string; area: string; address: string
  coordinates: { lat: number; lng: number }
}

export interface User {
  _id: string; name: string; email: string; phone?: string; phoneVerified?: boolean
  googleId?: string; role: Role; status: AccountStatus; activityStatus: ActivityStatus
  isOnline?: boolean; profilePhoto?: string; bio?: string; skills?: string[]
  location: Location; averageRating: number; totalRatings: number
  completedJobs: number; reviewCount: number; isPriorityWorker: boolean
  priorityEarnedAt?: string; isSuspended: boolean; isVerified: boolean
  trialStartDate?: string; trialEndDate?: string
  subscriptionStart?: string; subscriptionEnd?: string
  dailyRate: number; daysLeft: number; isSubscriptionActive: boolean
  freelancerNotifyMe?: boolean; createdAt: string
}

export interface AuthResponse { success: boolean; token: string; user: User; message?: string }
export interface LoginPayload { email: string; password: string }
export interface RegisterPayload {
  name: string; email: string; password: string; phone?: string
  role: Role; agreedToTerms: boolean; location: Partial<Location>
}

export interface Job {
  _id: string; title: string; description: string; category: JobCategory
  images?: string[]
  client: Pick<User, '_id' | 'name' | 'profilePhoto' | 'averageRating' | 'phone'>
  worker?: Pick<User, '_id' | 'name' | 'profilePhoto' | 'averageRating' | 'isPriorityWorker'>
  status: JobStatus; location: Location; budget?: number; agreedPrice?: number
  isUrgent: boolean; targetRoles: Role[]; distance?: number
  acceptedAt?: string; completedAt?: string; scheduledFor?: string
  reviewedByClient: boolean; reviewedByWorker: boolean; createdAt: string
}

export interface Message {
  _id: string
  sender: Pick<User, '_id' | 'name' | 'profilePhoto'>
  receiver: Pick<User, '_id' | 'name'>
  conversationId: string; text: string; isRead: boolean; createdAt: string
}

export interface Conversation {
  conversationId: string
  otherUser: Pick<User, '_id' | 'name' | 'profilePhoto' | 'role' | 'isOnline' | 'activityStatus'>
  lastMessage: { text: string; createdAt: string; sender: string }
  unreadCount: number
}

export interface Subscription {
  _id: string; user: string; role: Role; plan: PlanType
  durationDays: number; amountPaid: number; startDate: string; endDate: string
  status: 'pending' | 'active' | 'expired' | 'cancelled'
  paymentProvider: PaymentProvider; paymentReference: string
  paymentStatus: 'pending' | 'successful' | 'failed'
}

export interface SubscriptionStatus {
  status: AccountStatus; trialEndDate?: string; subscriptionEnd?: string
  daysLeft: number; dailyRate: number; isActive: boolean
}

export interface Report {
  _id: string
  reporter: Pick<User, '_id' | 'name'>
  reported?: Pick<User, '_id' | 'name'>
  job?: Pick<Job, '_id' | 'title'>
  type: string; description?: string
  status: 'pending' | 'reviewed' | 'resolved' | 'dismissed'
  severity: 'low' | 'medium' | 'high'; createdAt: string
}
