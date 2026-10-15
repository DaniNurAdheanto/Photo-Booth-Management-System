import { Entity, PrimaryColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Booth } from './Booth';

export enum BookingStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  CANCELLED = 'CANCELLED',
  COMPLETED = 'COMPLETED',
}

@Entity({ name: 'bookings' })
export class Booking {
  @PrimaryColumn({ type: 'varchar', length: 64 })
  id!: string;

  @Column({ type: 'varchar', length: 64, name: 'booth_id', nullable: true })
  boothId?: string;

  @ManyToOne(() => Booth, { onDelete: 'SET NULL', nullable: true })
  @JoinColumn({ name: 'booth_id' })
  booth?: Booth;

  @Column({ type: 'varchar', length: 255, name: 'customer_name' })
  customerName!: string;

  @Column({ type: 'varchar', length: 255, name: 'event_name' })
  eventName!: string;

  @Column({ type: 'date', name: 'event_date' })
  eventDate!: string;

  @Column({ type: 'time', name: 'start_time' })
  startTime!: string;

  @Column({ type: 'time', name: 'end_time' })
  endTime!: string;

  @Column({ type: 'varchar', length: 100, name: 'package_name' })
  packageName!: string;

  @Column({
    type: 'varchar',
    length: 50,
    enum: BookingStatus,
    default: BookingStatus.CONFIRMED,
  })
  status!: BookingStatus;

  @Column({ type: 'decimal', precision: 12, scale: 2, name: 'total_amount', default: 0.0 })
  totalAmount!: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;
}
