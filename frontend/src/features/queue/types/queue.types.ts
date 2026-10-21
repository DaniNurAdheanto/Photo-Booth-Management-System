export type QueueStatus = 'WAITING' | 'CALLING' | 'IN_BOOTH' | 'COMPLETED' | 'NO_SHOW';

export type EmailReminderType = 'CALLING_NOW' | 'UPCOMING_SOON' | 'MISSED_WARNING';

export interface QueueTicket {
  id: string;
  ticketNumber: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  boothId: string;
  boothName: string;
  pax: number;
  packageType: string;
  status: QueueStatus;
  joinedAt: string;
  calledAt?: string;
  inBoothAt?: string;
  estimatedMinutes: number;
  emailRemindersSent: number;
  lastReminderAt?: string;
  notes?: string;
}

export interface EmailLogEntry {
  id: string;
  ticketId: string;
  ticketNumber: string;
  recipientEmail: string;
  recipientName: string;
  subject: string;
  type: EmailReminderType;
  sentAt: string;
  status: 'DELIVERED' | 'OPENED';
  boothName: string;
}
