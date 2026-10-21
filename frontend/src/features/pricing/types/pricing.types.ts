export type SessionPaperFormat = 'STRIP_2X6' | 'POSTCARD_4R' | 'SQUARE_COLLAGE' | 'WIDE_PANORAMA';

export interface PhotoSessionPackage {
  id: string;
  name: string;
  tagline: string;
  badge?: string;
  paperFormat: SessionPaperFormat;
  defaultPoseCount: number;
  printCopiesCount: number;
  sessionDurationSec: number; // in seconds (e.g. 180s)
  countdownPerPoseSec: number; // in seconds (e.g. 5s)
  basePrice: number;
  isPopular?: boolean;
  isActive: boolean;
  includesDigitalGif: boolean;
  includesHighResDownload: boolean;
  paperCostEstimate: number; // HPP kertas per sesi
  description: string;
  applicableBooths: string[]; // 'ALL' or specific booth names
}

export interface PricingAddOn {
  id: string;
  name: string;
  description: string;
  price: number;
  costEstimate: number;
  unit: string; // e.g. "per lembar", "per sesi"
  isActive: boolean;
  isUpsellOnKiosk: boolean;
}

export interface SurgePricingRule {
  id: string;
  name: string;
  type: 'WEEKEND_SURGE' | 'HAPPY_HOUR_DISCOUNT' | 'HOLIDAY_PEAK';
  adjustmentType: 'FIXED_ADD' | 'PERCENT_ADD' | 'FIXED_DISCOUNT' | 'PERCENT_DISCOUNT';
  adjustmentValue: number;
  daysActive: string[]; // e.g. ["Sabtu", "Minggu"] or ["Senin", "Selasa", "Rabu", "Kamis"]
  timeStart?: string;
  timeEnd?: string;
  isActive: boolean;
  description: string;
}

export interface MallLocationPricingRule {
  id: string;
  boothId: string;
  boothName: string;
  mallName: string;
  city: string;
  priceMarkupType: 'NONE' | 'FIXED' | 'PERCENT';
  priceMarkupValue: number;
  status: 'ACTIVE' | 'INHERIT_BASE';
}

export interface TaxAndPaymentPolicy {
  taxRatePercent: number; // e.g. 10 or 11
  isTaxIncludedInPrice: boolean; // true = harga sudah termasuk PB1
  absorbQrisMdr: boolean; // true = biaya 0.7% ditanggung vendor
  cashRoundingUnit: number; // 1000
}
