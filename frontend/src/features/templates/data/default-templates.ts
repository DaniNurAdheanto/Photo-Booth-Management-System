import { Template } from '../types/template.types';

export const INITIAL_FEATURED_TEMPLATES: Template[] = [
  {
    id: 'tmpl-monochrome-01',
    name: 'Minimalist Monochrome Studio',
    layout: '2x6_strip',
    category: 'MINIMALIST',
    slots_count: 3,
    slotsCount: 3,
    width: 600,
    height: 1800,
    background_color: '#121214',
    backgroundColor: '#121214',
    background_gradient: 'linear-gradient(180deg, #18181B 0%, #09090B 100%)',
    backgroundGradient: 'linear-gradient(180deg, #18181B 0%, #09090B 100%)',
    orientation: 'PORTRAIT',
    print_size: '2x6 in',
    printSize: '2x6 in',
    aspect_ratio: '1:3',
    aspectRatio: '1:3',
    padding: 24,
    gap: 16,
    border_radius: 4,
    borderRadius: 4,
    event_name: 'STUDIO MONOCHROME • EDITION 01',
    eventName: 'STUDIO MONOCHROME • EDITION 01',
    assigned_booth_id: 'bth-002',
    assignedBoothId: 'bth-002',
    description: 'Desain strip 3-foto monokrom minimalis modern dengan kontras tinggi hitam-putih, tipografi clean sans-serif, dan barcode studio eksklusif.',
    is_active: true,
    isActive: true,
    is_archived: false,
    isArchived: false,
    show_date: true,
    showDate: true,
    version: 1,
    text_elements: JSON.stringify([
      { id: 't1', text: 'STUDIO MONOCHROME', color: '#FFFFFF' },
      { id: 't2', text: 'EDITION 01 • HIGH CONTRAST B&W', color: '#A1A1AA' },
    ]),
    textElements: JSON.stringify([
      { id: 't1', text: 'STUDIO MONOCHROME', color: '#FFFFFF' },
      { id: 't2', text: 'EDITION 01 • HIGH CONTRAST B&W', color: '#A1A1AA' },
    ]),
  },
  {
    id: 'tmpl-y2k-cyber-02',
    name: 'Y2K Cyberpunk Hologram',
    layout: 'grid_2x2',
    category: 'PARTY',
    slots_count: 4,
    slotsCount: 4,
    width: 1200,
    height: 1200,
    background_color: '#0D0B24',
    backgroundColor: '#0D0B24',
    background_gradient: 'linear-gradient(135deg, #0D0B24 0%, #1F0D3D 50%, #0B192E 100%)',
    backgroundGradient: 'linear-gradient(135deg, #0D0B24 0%, #1F0D3D 50%, #0B192E 100%)',
    orientation: 'PORTRAIT',
    print_size: 'Square',
    printSize: 'Square',
    aspect_ratio: '1:1',
    aspectRatio: '1:1',
    padding: 26,
    gap: 14,
    border_radius: 12,
    borderRadius: 12,
    event_name: 'CYBER 2000 // SHIBUYA MATRIX',
    eventName: 'CYBER 2000 // SHIBUYA MATRIX',
    assigned_booth_id: 'bth-001',
    assignedBoothId: 'bth-001',
    description: 'Grid 2x2 bertema masa depan retro Y2K Shibuya dengan aksen neon cyan glow, hot magenta, stiker cyber digital, dan aura hologram.',
    is_active: true,
    isActive: true,
    is_archived: false,
    isArchived: false,
    show_date: true,
    showDate: true,
    version: 1,
    text_elements: JSON.stringify([
      { id: 't1', text: 'CYBER 2000 // MATRIX NEON', color: '#00F0FF' },
      { id: 't2', text: 'NEON HOLOGRAM VIBES', color: '#F43F5E' },
    ]),
    textElements: JSON.stringify([
      { id: 't1', text: 'CYBER 2000 // MATRIX NEON', color: '#00F0FF' },
      { id: 't2', text: 'NEON HOLOGRAM VIBES', color: '#F43F5E' },
    ]),
  },
  {
    id: 'tmpl-korean-pastel-03',
    name: 'Korean Pastel Life4Cuts (인생네컷)',
    layout: '2x6_strip',
    category: 'WEDDING',
    slots_count: 4,
    slotsCount: 4,
    width: 600,
    height: 1800,
    background_color: '#FDF2F8',
    backgroundColor: '#FDF2F8',
    background_gradient: 'linear-gradient(180deg, #FDE2E4 0%, #E2ECE9 50%, #DFE7FD 100%)',
    backgroundGradient: 'linear-gradient(180deg, #FDE2E4 0%, #E2ECE9 50%, #DFE7FD 100%)',
    orientation: 'PORTRAIT',
    print_size: '2x6 in',
    printSize: '2x6 in',
    aspect_ratio: '1:3',
    aspectRatio: '1:3',
    padding: 24,
    gap: 14,
    border_radius: 16,
    borderRadius: 16,
    event_name: '인생네컷 • KOREAN PASTEL CUT',
    eventName: '인생네컷 • KOREAN PASTEL CUT',
    assigned_booth_id: 'ALL',
    assignedBoothId: 'ALL',
    description: 'Strip 4-pose vertikal otentik khas photobooth Korea (Life4Cuts) dengan nuansa pastel lavender, peach, dan baby blue yang cute dan lembut.',
    is_active: true,
    isActive: true,
    is_archived: false,
    isArchived: false,
    show_date: true,
    showDate: true,
    version: 1,
    text_elements: JSON.stringify([
      { id: 't1', text: '인생네컷 • KOREAN PASTEL', color: '#7C3AED' },
      { id: 't2', text: 'Sweet Moments with You ♡', color: '#DB2777' },
    ]),
    textElements: JSON.stringify([
      { id: 't1', text: '인생네컷 • KOREAN PASTEL', color: '#7C3AED' },
      { id: 't2', text: 'Sweet Moments with You ♡', color: '#DB2777' },
    ]),
  },
  {
    id: 'tmpl-vintage-90s-04',
    name: 'Vintage 90s Warm Film Noir',
    layout: 'polaroid',
    category: 'VINTAGE',
    slots_count: 1,
    slotsCount: 1,
    width: 1050,
    height: 1260,
    background_color: '#FBF7EE',
    backgroundColor: '#FBF7EE',
    background_gradient: 'linear-gradient(180deg, #FBF7EE 0%, #F4ECE1 100%)',
    backgroundGradient: 'linear-gradient(180deg, #FBF7EE 0%, #F4ECE1 100%)',
    orientation: 'PORTRAIT',
    print_size: '3.5x4.2 in',
    printSize: '3.5x4.2 in',
    aspect_ratio: '1:1',
    aspectRatio: '1:1',
    padding: 24,
    gap: 0,
    border_radius: 4,
    borderRadius: 4,
    event_name: '[ 35mm FILM • EXP 1996 ]',
    eventName: '[ 35mm FILM • EXP 1996 ]',
    assigned_booth_id: 'bth-002',
    assignedBoothId: 'bth-002',
    description: 'Bingkai polaroid analog nostalgia tahun 90-an dengan date stamp oranye digital khas kamera saku 35mm, aksen warm grain klasik, dan memo bawah.',
    is_active: true,
    isActive: true,
    is_archived: false,
    isArchived: false,
    show_date: true,
    showDate: true,
    version: 1,
    text_elements: JSON.stringify([
      { id: 't1', text: "'96 10 24  35mm KODAK NOIR", color: '#EA580C' },
      { id: 't2', text: 'Analog Golden Memories', color: '#78350F' },
    ]),
    textElements: JSON.stringify([
      { id: 't1', text: "'96 10 24  35mm KODAK NOIR", color: '#EA580C' },
      { id: 't2', text: 'Analog Golden Memories', color: '#78350F' },
    ]),
  },
];

// In-memory runtime cache for seamless operation
export let memoryTemplates: Template[] = [...INITIAL_FEATURED_TEMPLATES];

export function getMemoryTemplates(boothId?: string, category?: string, includeArchived?: boolean): Template[] {
  return memoryTemplates.filter((t) => {
    if (!includeArchived && (t.is_archived || t.isArchived)) return false;
    if (category && category !== 'all' && t.category !== category) return false;
    if (boothId && boothId !== 'all') {
      const bId = t.assigned_booth_id || t.assignedBoothId || 'ALL';
      if (bId !== 'ALL' && bId !== boothId) return false;
    }
    return true;
  });
}

export function addMemoryTemplate(tmpl: Template): Template {
  memoryTemplates.unshift(tmpl);
  return tmpl;
}

export function updateMemoryTemplate(id: string, updates: Partial<Template>): Template | null {
  const index = memoryTemplates.findIndex((t) => t.id === id);
  if (index === -1) return null;
  memoryTemplates[index] = { ...memoryTemplates[index], ...updates };
  return memoryTemplates[index];
}

export function deleteMemoryTemplate(id: string): boolean {
  const initialLength = memoryTemplates.length;
  memoryTemplates = memoryTemplates.filter((t) => t.id !== id);
  return memoryTemplates.length < initialLength;
}
