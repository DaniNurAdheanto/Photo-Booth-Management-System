import { Entity, PrimaryColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity({ name: 'templates' })
export class Template {
  @PrimaryColumn({ type: 'varchar', length: 64 })
  id!: string;

  @Column({ type: 'varchar', length: 150 })
  name!: string;

  @Column({ type: 'varchar', length: 50, default: '2x6_strip' }) // single_photo, photo_strip, postcard, collage, polaroid, 2x6_strip, 4x6_postcard, grid_2x2
  layout!: string;

  @Column({ type: 'varchar', length: 50, default: 'GENERAL' }) // WEDDING, BIRTHDAY, CORPORATE, VINTAGE, MINIMALIST, GENERAL
  category!: string;

  @Column({ type: 'int', name: 'slots_count', default: 4 })
  slotsCount!: number;

  @Column({ type: 'int', default: 600 })
  width!: number;

  @Column({ type: 'int', default: 1800 })
  height!: number;

  @Column({ type: 'varchar', length: 30, name: 'background_color', default: '#DE5795' })
  backgroundColor!: string;

  @Column({ type: 'varchar', length: 100, name: 'background_gradient', default: '' })
  backgroundGradient!: string;

  @Column({ type: 'text', name: 'background_image_url', default: '' })
  backgroundImageUrl!: string;

  @Column({ type: 'text', name: 'overlay_png_url', default: '' })
  overlayPngUrl!: string;

  @Column({ type: 'text', name: 'overlay_svg_url', nullable: true })
  overlaySvgUrl?: string;

  @Column({ type: 'varchar', length: 20, default: 'PORTRAIT' }) // PORTRAIT, LANDSCAPE
  orientation!: string;

  @Column({ type: 'varchar', length: 50, name: 'print_size', default: '2x6 in' })
  printSize!: string;

  @Column({ type: 'varchar', length: 20, name: 'aspect_ratio', default: '1:3' })
  aspectRatio!: string;

  @Column({ type: 'int', default: 30 })
  padding!: number;

  @Column({ type: 'int', default: 20 })
  gap!: number;

  @Column({ type: 'int', name: 'border_radius', default: 8 })
  borderRadius!: number;

  @Column({ type: 'text', name: 'slots_config', default: '[]' })
  slotsConfig!: string;

  @Column({ type: 'text', name: 'text_elements', default: '[]' })
  textElements!: string;

  @Column({ type: 'text', name: 'logo_url', default: '' })
  logoUrl!: string;

  @Column({ type: 'boolean', name: 'show_date', default: true })
  showDate!: boolean;

  @Column({ type: 'varchar', length: 150, name: 'event_name', default: '' })
  eventName!: string;

  @Column({ type: 'varchar', length: 64, name: 'assigned_booth_id', default: 'ALL' })
  assignedBoothId!: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({ type: 'boolean', name: 'is_active', default: true })
  isActive!: boolean;

  @Column({ type: 'boolean', name: 'is_archived', default: false })
  isArchived!: boolean;

  @Column({ type: 'int', default: 1 })
  version!: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;
}
