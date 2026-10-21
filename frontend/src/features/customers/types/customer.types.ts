export type CustomerSegment = 'VIP' | 'REGULAR' | 'NEW' | 'INACTIVE';

export interface CustomerSessionHistory {
  sessionId: string;
  sessionCode: string;
  date: string;
  boothName: string;
  templateName: string;
  packagePrice: number;
  paymentMethod: 'QRIS' | 'CASH' | 'DEBIT';
  photosCount: number;
  printCopies: number;
}

export interface Customer {
  id: string;
  name: string;
  phone: string;
  email: string;
  birthDate?: string;
  city?: string;
  avatarUrl?: string;
  segment: CustomerSegment;
  totalSpent: number;
  totalSessions: number;
  averageSpent: number;
  favoriteBooth: string;
  favoriteTemplate: string;
  registeredAt: string;
  lastVisitAt: string;
  tags: string[];
  notes?: string;
  sessionHistory?: CustomerSessionHistory[];
}

export interface CustomerFilterParams {
  searchQuery: string;
  segment: string;
  favoriteBooth: string;
  sortBy: 'NEWEST' | 'SPENT_DESC' | 'SESSIONS_DESC' | 'NAME_ASC';
}
