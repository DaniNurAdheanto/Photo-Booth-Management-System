import { Entity, PrimaryColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Booth } from './Booth';

export enum DeviceType {
  CAMERA = 'CAMERA',
  PRINTER = 'PRINTER',
  PAYMENT_GATEWAY = 'PAYMENT_GATEWAY',
  TOUCH_MONITOR = 'TOUCH_MONITOR',
  LIGHTING = 'LIGHTING',
}

@Entity({ name: 'devices' })
export class Device {
  @PrimaryColumn({ type: 'varchar', length: 64 })
  id!: string;

  @Column({ type: 'varchar', length: 64, name: 'booth_id' })
  boothId!: string;

  @ManyToOne(() => Booth, (booth) => booth.devices, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'booth_id' })
  booth!: Booth;

  @Column({
    type: 'varchar',
    length: 50,
    enum: DeviceType,
    name: 'device_type',
  })
  deviceType!: DeviceType;

  @Column({ type: 'varchar', length: 255, name: 'device_name' })
  deviceName!: string;

  @Column({ type: 'varchar', length: 100, name: 'serial_number', nullable: true })
  serialNumber?: string;

  @Column({ type: 'boolean', name: 'is_connected', default: true })
  isConnected!: boolean;

  @Column({ type: 'timestamptz', name: 'last_ping', nullable: true })
  lastPing?: Date;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;
}
