export type SessionStatus =
  | 'PENDING'
  | 'COUNTDOWN'
  | 'CAPTURING'
  | 'REVIEWING'
  | 'PROCESSING'
  | 'COMPLETED'
  | 'CANCELLED'
  | 'FAILED';

export type FilterPreset = 'ORIGINAL' | 'BW' | 'WARM' | 'VINTAGE';

export interface CapturedPhotoItem {
  slot: number;
  url: string;
  timestamp?: string;
}

export interface PhotoSession {
  id: string;
  booth_id: string;
  boothId?: string;
  session_code: string;
  sessionCode?: string;
  customer_name?: string;
  customerName?: string;
  customer_email?: string;
  customerEmail?: string;
  status: SessionStatus;
  total_photos: number;
  totalPhotos?: number;
  print_copies: number;
  printCopies?: number;
  template_id?: string;
  templateId?: string;
  countdown_seconds: number;
  countdownSeconds?: number;
  retake_count: number;
  retakeCount?: number;
  filter_preset: FilterPreset;
  filterPreset?: FilterPreset;
  idempotency_key?: string;
  idempotencyKey?: string;
  captured_photos: string;
  capturedPhotos?: string;
  final_composite_url?: string;
  finalCompositeUrl?: string;
  qr_code_url?: string;
  qrCodeUrl?: string;
  notes?: string;
  started_at?: string;
  startedAt?: string;
  ended_at?: string;
  endedAt?: string;
  created_at?: string;
  createdAt?: string;
  updated_at?: string;
  updatedAt?: string;
}

export type KioskStep =
  | 'WELCOME'
  | 'TEMPLATE_SELECT'
  | 'PREPARE'
  | 'COUNTDOWN'
  | 'CAPTURING'
  | 'REVIEW'
  | 'PROCESSING'
  | 'COMPLETED';

export interface KioskConfig {
  boothId: string;
  boothName: string;
  allowTemplateSelect: boolean;
  defaultCountdown: number;
  idleTimeoutSeconds: number;
  autoResetSeconds: number;
  soundEnabled: boolean;
}
