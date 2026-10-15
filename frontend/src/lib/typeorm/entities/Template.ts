import { Entity, PrimaryColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity({ name: 'templates' })
export class Template {
  @PrimaryColumn({ type: 'varchar', length: 64 })
  id!: string;

  @Column({ type: 'varchar', length: 150 })
  name!: string;

  @Column({ type: 'varchar', length: 50, default: '4x6_strip' }) // 4x6_strip, 2x6_strip, 4x6_postcard
  layout!: string;

  @Column({ type: 'int', name: 'slots_count', default: 4 })
  slotsCount!: number;

  @Column({ type: 'text', name: 'overlay_svg_url', nullable: true })
  overlaySvgUrl?: string;

  @Column({ type: 'boolean', name: 'is_active', default: true })
  isActive!: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;
}
