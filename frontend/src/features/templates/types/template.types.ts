export type TemplateLayout =
  | '2x6_strip'
  | 'photo_strip'
  | '4x6_postcard'
  | 'postcard'
  | 'grid_2x2'
  | 'collage'
  | 'polaroid'
  | 'single_photo';

export type TemplateCategory =
  | 'WEDDING'
  | 'BIRTHDAY'
  | 'CORPORATE'
  | 'VINTAGE'
  | 'MINIMALIST'
  | 'GENERAL';

export type TemplateOrientation = 'PORTRAIT' | 'LANDSCAPE';

export interface SlotItemConfig {
  id: string;
  slot: number;
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  borderRadius?: number;
}

export interface TextElementConfig {
  id: string;
  text: string;
  fontFamily: string;
  fontSize: number;
  color: string;
  y?: number;
  x?: number;
  align?: 'left' | 'center' | 'right';
}

export interface Template {
  id: string;
  name: string;
  layout: TemplateLayout | string;
  category: TemplateCategory | string;
  slots_count?: number;
  slotsCount?: number;
  width: number;
  height: number;
  background_color?: string;
  backgroundColor?: string;
  background_gradient?: string;
  backgroundGradient?: string;
  background_image_url?: string;
  backgroundImageUrl?: string;
  overlay_png_url?: string;
  overlayPngUrl?: string;
  overlay_svg_url?: string;
  overlaySvgUrl?: string;
  orientation?: TemplateOrientation | string;
  print_size?: string;
  printSize?: string;
  aspect_ratio?: string;
  aspectRatio?: string;
  padding?: number;
  gap?: number;
  border_radius?: number;
  borderRadius?: number;
  slots_config?: string;
  slotsConfig?: string;
  text_elements?: string;
  textElements?: string;
  logo_url?: string;
  logoUrl?: string;
  show_date?: boolean;
  showDate?: boolean;
  event_name?: string;
  eventName?: string;
  assigned_booth_id?: string;
  assignedBoothId?: string;
  description?: string;
  is_active?: boolean;
  isActive?: boolean;
  is_archived?: boolean;
  isArchived?: boolean;
  version?: number;
  created_at?: string;
  createdAt?: string;
  updated_at?: string;
  updatedAt?: string;
}

export interface TemplateFormData {
  name: string;
  layout: TemplateLayout;
  category: TemplateCategory;
  slots_count: number;
  width: number;
  height: number;
  background_color: string;
  background_gradient: string;
  background_image_url: string;
  overlay_png_url: string;
  orientation: TemplateOrientation;
  print_size: string;
  aspect_ratio: string;
  padding: number;
  gap: number;
  border_radius: number;
  slots_config: SlotItemConfig[];
  text_elements: TextElementConfig[];
  logo_url: string;
  show_date: boolean;
  event_name: string;
  assigned_booth_id: string;
  description: string;
  is_active: boolean;
}
