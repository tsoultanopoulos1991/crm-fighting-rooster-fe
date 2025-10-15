// Fighting Rooster Gym Management System - Types

// ============================================
// ENUMS
// ============================================

export enum SubscriptionStatus {
  ACTIVE = 'active',
  EXPIRING_SOON = 'expiring_soon',
  EXPIRED = 'expired',
  SUSPENDED = 'suspended',
  CANCELLED = 'cancelled'
}

export enum DebtStatus {
  PENDING = 'pending',
  PARTIAL = 'partial',
  PAID = 'paid',
  OVERDUE = 'overdue'
}

export enum NotificationStatus {
  PENDING = 'pending',
  SENT = 'sent',
  FAILED = 'failed',
  CANCELLED = 'cancelled'
}

export enum AnnouncementStatus {
  DRAFT = 'draft',
  SCHEDULED = 'scheduled',
  SENDING = 'sending',
  SENT = 'sent',
  FAILED = 'failed'
}

export enum PaymentMethod {
  CASH = 'cash',
  CARD = 'card',
  BANK_TRANSFER = 'bank_transfer',
  PAYPAL = 'paypal',
  OTHER = 'other'
}

export enum NotificationType {
  EXPIRY_7DAYS = 'expiry_7days',
  EXPIRY_3DAYS = 'expiry_3days',
  EXPIRY_TODAY = 'expiry_today',
  OVERDUE_3DAYS = 'overdue_3days'
}

export enum ChannelType {
  SMS = 'sms',
  EMAIL = 'email',
  BOTH = 'both'
}

export enum PackageCategory {
  SUBSCRIPTION = 'subscription',
  HOURLY = 'hourly',
  KIDS = 'kids',
  PERSONAL_TRAINING = 'personal_training'
}

export enum DurationType {
  TIME_PERIOD = 'time_period',
  SESSION_COUNT = 'session_count'
}

export enum TargetType {
  ALL_MEMBERS = 'all_members',
  ACTIVE = 'active',
  EXPIRED = 'expired',
  OVERDUE = 'overdue',
  MONTHLY = 'monthly',
  YEARLY = 'yearly',
  HOURLY = 'hourly',
  KIDS = 'kids',
  SELECTED = 'selected'
}

// ============================================
// MAIN TYPES
// ============================================

export interface Member {
  id: string;
  // Προσωπικά Στοιχεία
  first_name: string;
  last_name: string;
  phone: string;
  email?: string;
  date_of_birth: Date;
  age: number;
  // Έκτακτη Επικοινωνία
  emergency_contact_name?: string;
  emergency_contact_relation?: string;
  emergency_contact_phone?: string;
  // Σημειώσεις
  notes?: string;
  // Metadata
  created_at: Date;
  updated_at: Date;
}

export interface SubscriptionPackage {
  id: string;
  name: string;
  category: PackageCategory;
  duration_type: DurationType;
  duration_days?: number;
  session_count?: number;
  price: number;
  description?: string;
  is_active: boolean;
  display_order: number;
  color_label?: string;
  created_at: Date;
  updated_at: Date;
}

export interface Subscription {
  id: string;
  member_id: string;
  package_id: string;
  // Τιμή & Έκπτωση
  original_price: number;
  discount_percentage: number;
  discount_amount: number;
  discount_reason?: string;
  final_price: number;
  // Ημερομηνίες
  start_date: Date;
  end_date: Date;
  // Κατάσταση
  status: SubscriptionStatus;
  // Αυτόματη Ανανέωση
  auto_renew: boolean;
  payment_method?: PaymentMethod;
  // Για Ωριαία Πακέτα
  remaining_sessions?: number;
  created_at: Date;
  updated_at: Date;
}

export interface Payment {
  id: string;
  member_id: string;
  subscription_id?: string;
  payment_date: Date;
  amount: number;
  payment_method: PaymentMethod;
  receipt_type?: string;
  receipt_number?: string;
  payment_for: string;
  notes?: string;
  created_at: Date;
}

export interface Debt {
  id: string;
  member_id: string;
  subscription_id?: string;
  amount_owed: number;
  amount_paid: number;
  balance: number;
  due_date: Date;
  days_overdue?: number;
  status: DebtStatus;
  created_at: Date;
  updated_at: Date;
}

export interface Notification {
  id: string;
  member_id: string;
  subscription_id?: string;
  notification_type: NotificationType;
  channel: ChannelType;
  subject?: string;
  message: string;
  scheduled_at: Date;
  sent_at?: Date;
  status: NotificationStatus;
  delivery_status?: string;
  error_message?: string;
  created_at: Date;
}

export interface NotificationTemplate {
  id: string;
  name: string;
  type: NotificationType;
  channel: ChannelType;
  subject?: string;
  template_body: string;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface Announcement {
  id: string;
  target_type: TargetType;
  target_member_ids?: string[];
  recipient_count: number;
  template_id?: string;
  subject?: string;
  message: string;
  channel: ChannelType;
  scheduled_at?: Date;
  sent_at?: Date;
  status: AnnouncementStatus;
  successful_count: number;
  failed_count: number;
  total_cost?: number;
  created_at: Date;
}

export interface AnnouncementDelivery {
  id: string;
  announcement_id: string;
  member_id: string;
  status: string;
  sent_at?: Date;
  error_message?: string;
  created_at: Date;
}

// ============================================
// VIEW MODELS (για UI)
// ============================================

export interface MemberWithSubscription extends Member {
  currentSubscription?: Subscription;
  subscriptionPackage?: SubscriptionPackage;
  totalDebt: number;
  lastPaymentDate?: Date;
}

export interface DashboardStats {
  totalMembers: number;
  activeMembers: number;
  expiringSoon: number;
  expired: number;
  totalDebt: number;
  monthlyRevenue: number;
}

export interface CalendarEvent {
  id: string;
  date: Date;
  member: Member;
  subscription: Subscription;
  package: SubscriptionPackage;
  type: 'expiring' | 'payment_due' | 'renewal';
}
