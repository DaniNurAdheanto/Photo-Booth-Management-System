import { Entity, PrimaryColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import type { Booth } from './Booth';

export enum SessionStatus {
  PENDING = 'PENDING',
  COUNTDOWN = 'COUNTDOWN',
  CAPTURING = 'CAPTURING',
  REVIEWING = 'REVIEWING',
  PROCESSING = 'PROCESSING',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
  FAILED = 'FAILED',
}

@Entity({ name: 'photo_sessions' })
export class PhotoSession {
  @PrimaryColumn({ type: 'varchar', length: 64 })
  id!: string;

  @Column({ type: 'varchar', length: 64, name: 'booth_id' })
  boothId!: string;

  @ManyToOne('Booth', (booth: any) => booth.sessions, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'booth_id' })
  booth!: Booth;

  @Column({ type: 'varchar', length: 100, name: 'session_code', unique: true })
  sessionCode!: string;

  @Column({ type: 'varchar', length: 255, name: 'customer_name', nullable: true })
  customerName?: string;

  @Column({ type: 'varchar', length: 255, name: 'customer_email', nullable: true })
  customerEmail?: string;

  @Column({
    type: 'varchar',
    length: 50,
    enum: SessionStatus,
    default: SessionStatus.PENDING,
  })
  status!: SessionStatus;

  @Column({ type: 'int', name: 'total_photos', default: 4 })
  totalPhotos!: number;

  @Column({ type: 'int', name: 'print_copies', default: 2 })
  printCopies!: number;

  @Column({ type: 'varchar', length: 64, name: 'template_id', nullable: true })
  templateId?: string;

  @Column({ type: 'int', name: 'countdown_seconds', default: 5 })
  countdownSeconds!: number;

  @Column({ type: 'int', name: 'retake_count', default: 0 })
  retakeCount!: number;

  @Column({ type: 'varchar', length: 50, name: 'filter_preset', default: 'ORIGINAL' })
  filterPreset!: string;

  @Column({ type: 'varchar', length: 100, name: 'idempotency_key', nullable: true })
  idempotencyKey?: string;

  @Column({ type: 'text', name: 'captured_photos', default: '[]' })
  capturedPhotos!: string;

  @Column({ type: 'text', name: 'final_composite_url', default: '' })
  finalCompositeUrl!: string;

  @Column({ type: 'text', name: 'qr_code_url', default: '' })
  qrCodeUrl!: string;

  @Column({ type: 'text', name: 'notes', default: '' })
  notes!: string;

  @Column({ type: 'timestamptz', name: 'started_at', nullable: true })
  startedAt?: Date;

  @Column({ type: 'timestamptz', name: 'ended_at', nullable: true })
  endedAt?: Date;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;
}
