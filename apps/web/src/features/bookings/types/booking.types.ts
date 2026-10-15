export interface Booking {
  id: string;
  boothId?: string;
  customerName: string;
  eventName: string;
  eventDate: string;
  startTime: string;
  endTime: string;
  packageName: string;
  status: 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED';
  totalAmount: number;
}
