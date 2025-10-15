import {
  Member,
  Subscription,
  SubscriptionPackage,
  Payment,
  Debt,
  Announcement,
  MemberWithSubscription,
  DashboardStats,
  CalendarEvent,
  SubscriptionStatus,
  PackageCategory,
  DurationType,
  PaymentMethod,
  DebtStatus,
  AnnouncementStatus,
  TargetType,
  ChannelType
} from '../types';
import { v4 as uuidv4 } from 'uuid';
import { addDays, subDays, differenceInDays, startOfMonth, endOfMonth, parseISO } from 'date-fns';

// ============================================
// MOCK DATA
// ============================================

let mockPackages: SubscriptionPackage[] = [
  {
    id: '1',
    name: 'Μηνιαία Απεριόριστη',
    category: PackageCategory.SUBSCRIPTION,
    duration_type: DurationType.TIME_PERIOD,
    duration_days: 30,
    price: 50,
    description: 'Απεριόριστη πρόσβαση για 30 ημέρες',
    is_active: true,
    display_order: 1,
    color_label: '#4CAF50',
    created_at: new Date(),
    updated_at: new Date()
  },
  {
    id: '2',
    name: 'Ετήσια Συνδρομή',
    category: PackageCategory.SUBSCRIPTION,
    duration_type: DurationType.TIME_PERIOD,
    duration_days: 365,
    price: 500,
    description: 'Ετήσια συνδρομή με έκπτωση',
    is_active: true,
    display_order: 2,
    color_label: '#2196F3',
    created_at: new Date(),
    updated_at: new Date()
  },
  {
    id: '3',
    name: 'Ωριαίο Πακέτο 10 Ωρών',
    category: PackageCategory.HOURLY,
    duration_type: DurationType.SESSION_COUNT,
    session_count: 10,
    duration_days: 60,
    price: 80,
    description: '10 ώρες εντός 60 ημερών',
    is_active: true,
    display_order: 3,
    color_label: '#FF9800',
    created_at: new Date(),
    updated_at: new Date()
  },
  {
    id: '4',
    name: 'Παιδικό Τμήμα',
    category: PackageCategory.KIDS,
    duration_type: DurationType.TIME_PERIOD,
    duration_days: 30,
    price: 40,
    description: 'Μηνιαία συνδρομή για παιδιά',
    is_active: true,
    display_order: 4,
    color_label: '#9C27B0',
    created_at: new Date(),
    updated_at: new Date()
  }
];

let mockMembers: Member[] = [
  {
    id: '1',
    first_name: 'Γιώργος',
    last_name: 'Παπαδόπουλος',
    phone: '6971234567',
    email: 'gpapadopoulos@example.com',
    date_of_birth: new Date(1990, 5, 15),
    age: 35,
    emergency_contact_name: 'Μαρία Παπαδοπούλου',
    emergency_contact_relation: 'Σύζυγος',
    emergency_contact_phone: '6971234568',
    notes: 'Έχει παλιό τραυματισμό στο γόνατο',
    created_at: subDays(new Date(), 180),
    updated_at: new Date()
  },
  {
    id: '2',
    first_name: 'Δημήτρης',
    last_name: 'Ιωαννίδης',
    phone: '6972345678',
    email: 'dioannidis@example.com',
    date_of_birth: new Date(1995, 8, 20),
    age: 30,
    emergency_contact_name: 'Ελένη Ιωαννίδου',
    emergency_contact_relation: 'Αδελφή',
    emergency_contact_phone: '6972345679',
    created_at: subDays(new Date(), 120),
    updated_at: new Date()
  },
  {
    id: '3',
    first_name: 'Κώστας',
    last_name: 'Νικολάου',
    phone: '6973456789',
    email: 'knikolaou@example.com',
    date_of_birth: new Date(1988, 2, 10),
    age: 37,
    created_at: subDays(new Date(), 90),
    updated_at: new Date()
  },
  {
    id: '4',
    first_name: 'Άννα',
    last_name: 'Γεωργίου',
    phone: '6974567890',
    email: 'ageorgiou@example.com',
    date_of_birth: new Date(2010, 4, 5),
    age: 15,
    emergency_contact_name: 'Νίκος Γεωργίου',
    emergency_contact_relation: 'Πατέρας',
    emergency_contact_phone: '6974567891',
    notes: 'Παιδικό τμήμα',
    created_at: subDays(new Date(), 60),
    updated_at: new Date()
  },
  {
    id: '5',
    first_name: 'Μιχάλης',
    last_name: 'Αθανασίου',
    phone: '6975678901',
    date_of_birth: new Date(1992, 11, 25),
    age: 33,
    created_at: subDays(new Date(), 400),
    updated_at: new Date()
  }
];

let mockSubscriptions: Subscription[] = [
  {
    id: '1',
    member_id: '1',
    package_id: '1',
    original_price: 50,
    discount_percentage: 0,
    discount_amount: 0,
    final_price: 50,
    start_date: subDays(new Date(), 15),
    end_date: addDays(new Date(), 15),
    status: SubscriptionStatus.ACTIVE,
    auto_renew: true,
    payment_method: PaymentMethod.CASH,
    created_at: subDays(new Date(), 15),
    updated_at: new Date()
  },
  {
    id: '2',
    member_id: '2',
    package_id: '1',
    original_price: 50,
    discount_percentage: 0,
    discount_amount: 0,
    final_price: 50,
    start_date: subDays(new Date(), 25),
    end_date: addDays(new Date(), 5),
    status: SubscriptionStatus.EXPIRING_SOON,
    auto_renew: false,
    payment_method: PaymentMethod.CARD,
    created_at: subDays(new Date(), 25),
    updated_at: new Date()
  },
  {
    id: '3',
    member_id: '3',
    package_id: '3',
    original_price: 80,
    discount_percentage: 10,
    discount_amount: 8,
    discount_reason: 'Έκπτωση φίλου',
    final_price: 72,
    start_date: subDays(new Date(), 10),
    end_date: addDays(new Date(), 50),
    status: SubscriptionStatus.ACTIVE,
    auto_renew: false,
    payment_method: PaymentMethod.BANK_TRANSFER,
    remaining_sessions: 7,
    created_at: subDays(new Date(), 10),
    updated_at: new Date()
  },
  {
    id: '4',
    member_id: '4',
    package_id: '4',
    original_price: 40,
    discount_percentage: 0,
    discount_amount: 0,
    final_price: 40,
    start_date: subDays(new Date(), 20),
    end_date: addDays(new Date(), 10),
    status: SubscriptionStatus.ACTIVE,
    auto_renew: true,
    payment_method: PaymentMethod.CASH,
    created_at: subDays(new Date(), 20),
    updated_at: new Date()
  },
  {
    id: '5',
    member_id: '5',
    package_id: '1',
    original_price: 50,
    discount_percentage: 0,
    discount_amount: 0,
    final_price: 50,
    start_date: subDays(new Date(), 40),
    end_date: subDays(new Date(), 10),
    status: SubscriptionStatus.EXPIRED,
    auto_renew: false,
    payment_method: PaymentMethod.CASH,
    created_at: subDays(new Date(), 40),
    updated_at: new Date()
  }
];

let mockPayments: Payment[] = [
  {
    id: '1',
    member_id: '1',
    subscription_id: '1',
    payment_date: subDays(new Date(), 15),
    amount: 50,
    payment_method: PaymentMethod.CASH,
    payment_for: 'Μηνιαία Απεριόριστη - Οκτώβριος 2025',
    created_at: subDays(new Date(), 15)
  },
  {
    id: '2',
    member_id: '2',
    subscription_id: '2',
    payment_date: subDays(new Date(), 25),
    amount: 50,
    payment_method: PaymentMethod.CARD,
    payment_for: 'Μηνιαία Απεριόριστη - Σεπτέμβριος 2025',
    created_at: subDays(new Date(), 25)
  },
  {
    id: '3',
    member_id: '3',
    subscription_id: '3',
    payment_date: subDays(new Date(), 10),
    amount: 72,
    payment_method: PaymentMethod.BANK_TRANSFER,
    payment_for: 'Ωριαίο Πακέτο 10 Ωρών',
    created_at: subDays(new Date(), 10)
  }
];

let mockDebts: Debt[] = [
  {
    id: '1',
    member_id: '5',
    subscription_id: '5',
    amount_owed: 50,
    amount_paid: 0,
    balance: 50,
    due_date: subDays(new Date(), 10),
    days_overdue: 10,
    status: DebtStatus.OVERDUE,
    created_at: subDays(new Date(), 40),
    updated_at: new Date()
  }
];

let mockAnnouncements: Announcement[] = [
  {
    id: '1',
    target_type: TargetType.ALL_MEMBERS,
    recipient_count: 5,
    subject: 'Sparring Event',
    message: '10 Δεκεμβρίου έχουμε sparring στον Fight Club Athens. Να είσαστε όλοι στις 9 έξω από το γυμναστήριο!',
    channel: ChannelType.SMS,
    scheduled_at: new Date(2025, 11, 5),
    status: AnnouncementStatus.DRAFT,
    successful_count: 0,
    failed_count: 0,
    created_at: new Date()
  }
];

// ============================================
// SERVICE FUNCTIONS
// ============================================

// Members
export const getAllMembers = async (): Promise<Member[]> => {
  return Promise.resolve([...mockMembers]);
};

export const getMemberById = async (id: string): Promise<Member | undefined> => {
  return Promise.resolve(mockMembers.find(m => m.id === id));
};

export const getMembersWithSubscriptions = async (): Promise<MemberWithSubscription[]> => {
  const members = await getAllMembers();

  return members.map(member => {
    const currentSub = mockSubscriptions.find(
      s => s.member_id === member.id &&
      (s.status === SubscriptionStatus.ACTIVE || s.status === SubscriptionStatus.EXPIRING_SOON)
    );

    const pkg = currentSub ? mockPackages.find(p => p.id === currentSub.package_id) : undefined;

    const memberDebts = mockDebts.filter(d => d.member_id === member.id);
    const totalDebt = memberDebts.reduce((sum, debt) => sum + debt.balance, 0);

    const memberPayments = mockPayments.filter(p => p.member_id === member.id);
    const lastPayment = memberPayments.length > 0
      ? memberPayments.sort((a, b) => b.payment_date.getTime() - a.payment_date.getTime())[0]
      : undefined;

    return {
      ...member,
      currentSubscription: currentSub,
      subscriptionPackage: pkg,
      totalDebt,
      lastPaymentDate: lastPayment?.payment_date
    };
  });
};

export const createMember = async (member: Omit<Member, 'id' | 'age' | 'created_at' | 'updated_at'>): Promise<Member> => {
  const age = new Date().getFullYear() - member.date_of_birth.getFullYear();
  const newMember: Member = {
    ...member,
    id: uuidv4(),
    age,
    created_at: new Date(),
    updated_at: new Date()
  };

  mockMembers.push(newMember);
  return Promise.resolve(newMember);
};

export const updateMember = async (id: string, updates: Partial<Member>): Promise<Member | undefined> => {
  const index = mockMembers.findIndex(m => m.id === id);
  if (index === -1) return Promise.resolve(undefined);

  mockMembers[index] = {
    ...mockMembers[index],
    ...updates,
    updated_at: new Date()
  };

  return Promise.resolve(mockMembers[index]);
};

export const deleteMember = async (id: string): Promise<boolean> => {
  const index = mockMembers.findIndex(m => m.id === id);
  if (index === -1) return Promise.resolve(false);

  mockMembers.splice(index, 1);
  return Promise.resolve(true);
};

// Subscription Packages
export const getAllPackages = async (): Promise<SubscriptionPackage[]> => {
  return Promise.resolve([...mockPackages]);
};

export const getActivePackages = async (): Promise<SubscriptionPackage[]> => {
  return Promise.resolve(mockPackages.filter(p => p.is_active));
};

// Subscriptions
export const getSubscriptionsByMemberId = async (memberId: string): Promise<Subscription[]> => {
  return Promise.resolve(mockSubscriptions.filter(s => s.member_id === memberId));
};

export const createSubscription = async (subscription: Omit<Subscription, 'id' | 'created_at' | 'updated_at'>): Promise<Subscription> => {
  const newSubscription: Subscription = {
    ...subscription,
    id: uuidv4(),
    created_at: new Date(),
    updated_at: new Date()
  };

  mockSubscriptions.push(newSubscription);
  return Promise.resolve(newSubscription);
};

// Payments
export const getPaymentsByMemberId = async (memberId: string): Promise<Payment[]> => {
  return Promise.resolve(mockPayments.filter(p => p.member_id === memberId));
};

export const createPayment = async (payment: Omit<Payment, 'id' | 'created_at'>): Promise<Payment> => {
  const newPayment: Payment = {
    ...payment,
    id: uuidv4(),
    created_at: new Date()
  };

  mockPayments.push(newPayment);
  return Promise.resolve(newPayment);
};

// Debts
export const getAllDebts = async (): Promise<Debt[]> => {
  return Promise.resolve([...mockDebts]);
};

export const getDebtsByMemberId = async (memberId: string): Promise<Debt[]> => {
  return Promise.resolve(mockDebts.filter(d => d.member_id === memberId));
};

// Announcements
export const getAllAnnouncements = async (): Promise<Announcement[]> => {
  return Promise.resolve([...mockAnnouncements]);
};

export const createAnnouncement = async (announcement: Omit<Announcement, 'id' | 'created_at'>): Promise<Announcement> => {
  const newAnnouncement: Announcement = {
    ...announcement,
    id: uuidv4(),
    created_at: new Date()
  };

  mockAnnouncements.push(newAnnouncement);
  return Promise.resolve(newAnnouncement);
};

export const sendAnnouncement = async (id: string): Promise<Announcement | undefined> => {
  const index = mockAnnouncements.findIndex(a => a.id === id);
  if (index === -1) return Promise.resolve(undefined);

  mockAnnouncements[index] = {
    ...mockAnnouncements[index],
    status: AnnouncementStatus.SENT,
    sent_at: new Date(),
    successful_count: mockAnnouncements[index].recipient_count
  };

  return Promise.resolve(mockAnnouncements[index]);
};

// Dashboard Stats
export const getDashboardStats = async (): Promise<DashboardStats> => {
  const allSubs = await getMembersWithSubscriptions();

  const activeMembers = allSubs.filter(m => m.currentSubscription?.status === SubscriptionStatus.ACTIVE).length;
  const expiringSoon = allSubs.filter(m => m.currentSubscription?.status === SubscriptionStatus.EXPIRING_SOON).length;
  const expired = allSubs.filter(m =>
    m.currentSubscription?.status === SubscriptionStatus.EXPIRED || !m.currentSubscription
  ).length;

  const totalDebt = mockDebts.reduce((sum, debt) => sum + debt.balance, 0);

  const currentMonth = startOfMonth(new Date());
  const monthlyPayments = mockPayments.filter(p => p.payment_date >= currentMonth);
  const monthlyRevenue = monthlyPayments.reduce((sum, payment) => sum + payment.amount, 0);

  return Promise.resolve({
    totalMembers: mockMembers.length,
    activeMembers,
    expiringSoon,
    expired,
    totalDebt,
    monthlyRevenue
  });
};

// Calendar Events
export const getCalendarEvents = async (month: Date): Promise<CalendarEvent[]> => {
  const monthStart = startOfMonth(month);
  const monthEnd = endOfMonth(month);

  const events: CalendarEvent[] = [];

  // Subscriptions expiring this month
  for (const sub of mockSubscriptions) {
    if (sub.end_date >= monthStart && sub.end_date <= monthEnd) {
      const member = mockMembers.find(m => m.id === sub.member_id);
      const pkg = mockPackages.find(p => p.id === sub.package_id);

      if (member && pkg) {
        events.push({
          id: sub.id,
          date: sub.end_date,
          member,
          subscription: sub,
          package: pkg,
          type: 'expiring'
        });
      }
    }
  }

  return Promise.resolve(events);
};

// Check expiring subscriptions (για notifications)
export const checkExpiringSubscriptions = async (): Promise<Subscription[]> => {
  const today = new Date();
  const in7Days = addDays(today, 7);

  return mockSubscriptions.filter(sub => {
    const daysUntilExpiry = differenceInDays(sub.end_date, today);
    return daysUntilExpiry > 0 && daysUntilExpiry <= 7 && sub.status === SubscriptionStatus.ACTIVE;
  });
};
