export type SessionStatus = 'PENDING' | 'COUNTDOWN' | 'CAPTURING' | 'PRINTING' | 'COMPLETED' | 'CANCELLED';

export interface PhotoSession {
  id: string;
  boothId: string;
  sessionCode: string;
  customerName?: string;
  customerEmail?: string;
  status: SessionStatus;
  totalPhotos: number;
  printCopies: number;
  templateId?: string;
  startedAt?: string;
  endedAt?: string;
  createdAt: string;
}
