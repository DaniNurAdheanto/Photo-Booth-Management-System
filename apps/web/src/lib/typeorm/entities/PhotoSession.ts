import { Entity, PrimaryColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Booth } from './Booth';

export enum SessionStatus {
  PENDING = 'PENDING',
  COUNTDOWN = 'COUNTDOWN',
  CAPTURING = 'CAPTURING',
  PRINTING = 'PRINTING',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}

@Entity({ name: 'photo_sessions' })
export class PhotoSession {
  @PrimaryColumn({ type: 'varchar', length: 64 })
  id!: string;

  @Column({ type: 'varchar', length: 64, name: 'booth_id' })
  boothId!: string;

  @ManyToOne(() => Booth, (booth) => booth.sessions, { onDelete: 'CASCADE' })
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

  @Column({ type: 'timestamptz', name: 'started_at', nullable: true })
  startedAt?: Date;

  @Column({ type: 'timestamptz', name: 'ended_at', nullable: true })
  endedAt?: Date;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;
}
