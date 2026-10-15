import { Entity, PrimaryColumn, Column, CreateDateColumn, UpdateDateColumn, DeleteDateColumn, OneToMany } from 'typeorm';
import { PhotoSession } from './PhotoSession';
import { Device } from './Device';

export enum BoothStatus {
  ONLINE = 'ONLINE',
  OFFLINE = 'OFFLINE',
  IN_SESSION = 'IN_SESSION',
  MAINTENANCE = 'MAINTENANCE',
}

@Entity({ name: 'booths' })
export class Booth {
  @PrimaryColumn({ type: 'varchar', length: 64 })
  id!: string;

  @Column({ type: 'varchar', length: 50, unique: true })
  code!: string;

  @Column({ type: 'varchar', length: 255 })
  name!: string;

  @Column({ type: 'varchar', length: 255, default: '' })
  location!: string;

  @Column({
    type: 'varchar',
    length: 50,
    enum: BoothStatus,
    default: BoothStatus.OFFLINE,
  })
  status!: BoothStatus;

  @Column({ type: 'varchar', length: 45, name: 'ip_address', nullable: true })
  ipAddress?: string;

  @Column({ type: 'int', name: 'paper_count', default: 700 })
  paperCount!: number;

  @Column({ type: 'int', name: 'max_paper_capacity', default: 700 })
  maxPaperCapacity!: number;

  @Column({ type: 'varchar', length: 100, name: 'camera_model', default: 'Canon EOS R100' })
  cameraModel!: string;

  @Column({ type: 'text', nullable: true })
  notes?: string;

  @OneToMany(() => PhotoSession, (session) => session.booth)
  sessions!: PhotoSession[];

  @OneToMany(() => Device, (device) => device.booth)
  devices!: Device[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;

  @DeleteDateColumn({ name: 'deleted_at', nullable: true })
  deletedAt?: Date;
}
