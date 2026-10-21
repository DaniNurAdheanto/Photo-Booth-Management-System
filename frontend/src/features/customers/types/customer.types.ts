export type LoyaltyTier = 'BRONZE' | 'SILVER' | 'GOLD' | 'VIP';

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
  avatarUrl?: string;
  tier: LoyaltyTier;
  pointsBalance: number;
  totalSpent: number;
  totalSessions: number;
  favoriteBooth: string;
  favoriteTemplate: string;
  registeredAt: string;
  lastVisitAt: string;
  tags: string[];
  sessionHistory?: CustomerSessionHistory[];
}

export type VoucherDiscountType = 'PERCENTAGE' | 'FIXED_AMOUNT' | 'FREE_PRINT';
export type VoucherStatus = 'ACTIVE' | 'EXPIRED' | 'DEPLETED' | 'SCHEDULED';

export interface PromoVoucher {
  id: string;
  code: string;
  title: string;
  description: string;
  discountType: VoucherDiscountType;
  discountValue: number; // e.g., 20 (percent) or 15000 (fixed Rp)
  minSpend: number;
  maxDiscount?: number;
  totalQuota: number;
  usedCount: number;
  validFrom: string;
  validUntil: string;
  status: VoucherStatus;
  applicableBooths: string[]; // 'ALL' or booth names
  terms: string[];
}

export interface LoyaltyTierRule {
  tier: LoyaltyTier;
  name: string;
  minSpendThreshold: number;
  pointsMultiplier: string; // e.g. "1x", "1.5x", "2x"
  cashbackPercent: number;
  freeExtraPrintPerSession: number;
  exclusiveFrames: boolean;
  colorHex: string;
  badgeBg: string;
}

export interface BroadcastCampaign {
  id: string;
  title: string;
  targetAudience: string;
  voucherAttached?: string;
  recipientsCount: number;
  sentDate: string;
  status: 'SENT' | 'SCHEDULED' | 'DRAFT';
  conversionRate: string;
}
