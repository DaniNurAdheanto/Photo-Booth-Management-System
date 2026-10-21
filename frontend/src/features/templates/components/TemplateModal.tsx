'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  Sparkles,
  Check,
  Palette,
  Layers,
  UploadCloud,
  FileCheck,
  AlertCircle,
  Sliders,
  Type,
  Store,
  Eye,
  Calendar,
  Image as ImageIcon,
  RotateCw,
} from 'lucide-react';
import { Template, TemplateFormData, TemplateLayout, TemplateCategory, TemplateOrientation } from '../types/template.types';
import { TemplatePreview } from './TemplatePreview';

interface TemplateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: TemplateFormData, id?: string) => Promise<void>;
  initialData?: Template | null;
  isSaving?: boolean;
}

const PRESET_COLORS = [
  { name: 'Rose Magenta (Primary)', hex: '#DE5795' },
  { name: 'Pure White', hex: '#FFFFFF' },
  { name: 'Warm Cream', hex: '#FFF8EA' },
  { name: 'Soft Blush', hex: '#FDF2F7' },
  { name: 'Champagne Gold', hex: '#F9F5EC' },
  { name: 'Studio Gray', hex: '#F3F4F6' },
  { name: 'Midnight Charcoal', hex: '#1E293B' },
];

const LAYOUT_OPTIONS: {
  id: TemplateLayout;
  label: string;
  desc: string;
  defaultSlots: number;
  defaultW: number;
  defaultH: number;
  printSize: string;
}[] = [
  { id: '2x6_strip', label: '2×6 Photo Strip', desc: 'Klasik vertikal 3-4 foto roll printer', defaultSlots: 3, defaultW: 600, defaultH: 1800, printSize: '2x6 in' },
  { id: '4x6_postcard', label: '4×6 Postcard', desc: 'Lanskap foto besar dengan ruang logo', defaultSlots: 2, defaultW: 1800, defaultH: 1200, printSize: '4x6 in' },
  { id: 'grid_2x2', label: '2×2 Square Grid', desc: 'Kotak modern 4 foto seimbang', defaultSlots: 4, defaultW: 1200, defaultH: 1200, printSize: 'Square' },
  { id: 'single_photo', label: 'Single Portrait Focus', desc: '1 foto besar berkualitas studio', defaultSlots: 1, defaultW: 1200, defaultH: 1800, printSize: '4x6 in' },
  { id: 'polaroid', label: 'Classic Polaroid', desc: 'Bingkai retro dengan margin tanda tangan', defaultSlots: 1, defaultW: 1000, defaultH: 1200, printSize: '3.5x4.2 in' },
];

const CATEGORIES: { id: TemplateCategory; label: string }[] = [
  { id: 'WEDDING', label: 'Pernikahan (Wedding)' },
  { id: 'BIRTHDAY', label: 'Ulang Tahun (Birthday)' },
  { id: 'CORPORATE', label: 'Perusahaan & Gala (Corporate)' },
  { id: 'VINTAGE', label: 'Vintage & Retro' },
  { id: 'MINIMALIST', label: 'Minimalis Studio' },
  { id: 'GENERAL', label: 'Umum (General)' },
];

export function TemplateModal({
  isOpen,
  onClose,
  onSave,
  initialData,
  isSaving = false,
}: TemplateModalProps) {
  const [activeTab, setActiveTab] = useState<'layout' | 'frame' | 'branding' | 'booth'>('layout');
  const [showSamplePhotos, setShowSamplePhotos] = useState<boolean>(true);
  const [fileError, setFileError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [formData, setFormData] = useState<TemplateFormData>({
    name: '',
    layout: '2x6_strip',
    category: 'WEDDING',
    slots_count: 3,
    width: 600,
    height: 1800,
    background_color: '#DE5795',
    background_gradient: '',
    background_image_url: '',
    overlay_png_url: '',
    orientation: 'PORTRAIT',
    print_size: '2x6 in',
    aspect_ratio: '1:3',
    padding: 30,
    gap: 20,
    border_radius: 8,
    slots_config: [],
    text_elements: [
      { id: 'txt-1', text: 'PHOTO BOOTH MOMENTS', fontFamily: 'Sora', fontSize: 24, color: '#ffffff' },
    ],
    logo_url: '',
    show_date: true,
    event_name: '',
    assigned_booth_id: 'ALL',
    description: '',
    is_active: true,
  });

  useEffect(() => {
    if (initialData) {
      let parsedTexts = [];
      try {
        if (initialData.text_elements) parsedTexts = JSON.parse(initialData.text_elements);
      } catch (e) {}

      setFormData({
        name: initialData.name || '',
        layout: (initialData.layout as TemplateLayout) || '2x6_strip',
        category: (initialData.category as TemplateCategory) || 'GENERAL',
        slots_count: initialData.slots_count || initialData.slotsCount || 3,
        width: initialData.width || 600,
        height: initialData.height || 1800,
        background_color: initialData.background_color || initialData.backgroundColor || '#DE5795',
        background_gradient: initialData.background_gradient || initialData.backgroundGradient || '',
        background_image_url: initialData.background_image_url || initialData.backgroundImageUrl || '',
        overlay_png_url: initialData.overlay_png_url || initialData.overlayPngUrl || '',
        orientation: (initialData.orientation as TemplateOrientation) || 'PORTRAIT',
        print_size: initialData.print_size || initialData.printSize || '2x6 in',
        aspect_ratio: initialData.aspect_ratio || initialData.aspectRatio || '1:3',
        padding: initialData.padding || 30,
        gap: initialData.gap || 20,
        border_radius: initialData.border_radius || initialData.borderRadius || 8,
        slots_config: [],
        text_elements: parsedTexts.length > 0 ? parsedTexts : [{ id: 'txt-1', text: initialData.name, fontFamily: 'Sora', fontSize: 24, color: '#ffffff' }],
        logo_url: initialData.logo_url || initialData.logoUrl || '',
        show_date: initialData.show_date !== undefined ? initialData.show_date : true,
        event_name: initialData.event_name || initialData.eventName || '',
        assigned_booth_id: initialData.assigned_booth_id || initialData.assignedBoothId || 'ALL',
        description: initialData.description || '',
        is_active: initialData.is_active !== undefined ? initialData.is_active : true,
      });
    } else {
      setFormData({
        name: '',
        layout: '2x6_strip',
        category: 'WEDDING',
        slots_count: 3,
        width: 600,
        height: 1800,
        background_color: '#DE5795',
        background_gradient: '',
        background_image_url: '',
        overlay_png_url: '',
        orientation: 'PORTRAIT',
        print_size: '2x6 in',
        aspect_ratio: '1:3',
        padding: 30,
        gap: 20,
        border_radius: 8,
        slots_config: [],
        text_elements: [
          { id: 'txt-1', text: 'PHOTO BOOTH MOMENTS', fontFamily: 'Sora', fontSize: 24, color: '#470F29' },
        ],
        logo_url: '',
        show_date: true,
        event_name: 'The Wedding of Sarah & Dani',
        assigned_booth_id: 'ALL',
        description: '',
        is_active: true,
      });
    }
    setFileError(null);
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  // Handle PNG Frame Upload with Strict Acceptance Criteria Validation
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileError(null);

    // 1. Format Validation: Must be PNG
    if (file.type !== 'image/png' && !file.name.toLowerCase().endsWith('.png')) {
      setFileError('Format file ditolak: Frame harus bertipe PNG transparan (.png). Format JPG, WEBP, atau lainnya tidak diizinkan.');
      return;
    }

    // 2. Size Validation: Max 5MB
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      const sizeMB = (file.size / (1024 * 1024)).toFixed(1);
      setFileError(`Ukuran file ditolak: Ukuran frame ${sizeMB} MB melebihi batas maksimum 5.0 MB.`);
      return;
    }

    // Read file as Data URL
    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      setFormData((prev) => ({ ...prev, overlay_png_url: result }));
    };
    reader.readAsDataURL(file);
  };

  const handleLayoutSelect = (opt: typeof LAYOUT_OPTIONS[0]) => {
    setFormData((prev) => ({
      ...prev,
      layout: opt.id,
      slots_count: opt.defaultSlots,
      width: opt.defaultW,
      height: opt.defaultH,
      print_size: opt.printSize,
      orientation: opt.defaultW > opt.defaultH ? 'LANDSCAPE' : 'PORTRAIT',
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) return;
    await onSave(formData, initialData?.id);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden font-sora">
      {/* Backdrop with smooth blur */}
      <div
        className="fixed inset-0 bg-gray-950/45 backdrop-blur-xs transition-opacity animate-fade-in"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-6 sm:pl-10 p-3 sm:p-4 pointer-events-none">
        <div className="w-screen max-w-4xl bg-white shadow-2xl border border-gray-200/90 rounded-3xl flex flex-col animate-slide-left overflow-hidden ring-1 ring-black/10 pointer-events-auto">
          {/* Drawer Header (Ref: Modern SaaS Floating Drawer) */}
          <div className="px-7 pt-6 pb-5.5 border-b border-gray-200/80 flex items-center justify-between bg-white/95 backdrop-blur-md shrink-0 sticky top-0 z-20 shadow-2xs">
            <div className="flex items-center gap-4 min-w-0">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-pink-500/15 to-[#DE5795]/20 border border-[#DE5795]/30 flex items-center justify-center text-[#9D174D] shadow-xs shrink-0">
                <Layers className="w-5 h-5 text-[#DE5795]" />
              </div>
              <div className="min-w-0 pr-2">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="text-base font-bold text-gray-900 font-sora leading-tight">
                    {initialData ? 'Edit Desain Template Foto' : 'Buat Template & Layout Baru'}
                  </h3>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-pink-50 text-[#9D174D] border border-pink-200 shadow-2xs">
                    {initialData ? 'Editor Mode' : 'Template Designer'}
                  </span>
                </div>
                <p className="text-xs text-gray-500 mt-1 truncate">
                  Sesuaikan rasio cetak, bingkai transparan PNG, tata letak foto, dan branding acara
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="w-9 h-9 rounded-xl text-gray-400 hover:text-gray-700 hover:bg-gray-100 border border-gray-200/80 transition-all flex items-center justify-center shrink-0 ml-4 shadow-2xs"
              title="Tutup (Esc)"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Modal Tabs Bar */}
          <div className="flex items-center px-7 py-2.5 border-b border-gray-100 bg-gray-50/70 gap-2 overflow-x-auto text-xs font-semibold shrink-0">
          {[
            { id: 'layout', label: '1. Layout & Dimensi', icon: Sliders },
            { id: 'frame', label: '2. Frame PNG & Background', icon: Palette },
            { id: 'branding', label: '3. Teks, Logo & Acara', icon: Type },
            { id: 'booth', label: '4. Booth & Status', icon: Store },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 py-2 px-3.5 rounded-xl transition-all whitespace-nowrap ${
                  isActive
                    ? 'bg-white text-[#9D174D] font-bold shadow-xs border border-gray-200/80 ring-1 ring-[#DE5795]/20'
                    : 'text-gray-500 hover:text-gray-900 hover:bg-white/60'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-[#DE5795]' : 'text-gray-400'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Form and Live WYSIWYG Preview Grid */}
        <form onSubmit={handleSubmit} className="flex-1 flex flex-col min-h-0">
          <div className="flex-1 overflow-hidden grid grid-cols-1 lg:grid-cols-12 min-h-0">
            {/* Left Controls Column */}
            <div className="lg:col-span-7 p-6 overflow-y-auto space-y-5 border-r border-gray-100">
            {/* File Error Alert if validation fails */}
            {fileError && (
              <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 flex items-start gap-2.5 text-xs text-red-700 animate-shake">
                <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                <div className="space-y-0.5">
                  <p className="font-bold">Validasi File Gagal</p>
                  <p>{fileError}</p>
                </div>
              </div>
            )}

            {/* TAB 1: LAYOUT & DIMENSIONS */}
            {activeTab === 'layout' && (
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-semibold text-gray-800 block mb-1">
                    Nama Template <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Contoh: Botanical Garden Wedding Strip"
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-gray-200 focus:outline-hidden focus:border-[#DE5795] focus:ring-2 focus:ring-[#DE5795]/20"
                  />
                </div>

                {/* Layout Type Selection */}
                <div>
                  <label className="text-xs font-semibold text-gray-800 block mb-2">
                    Format Cetak & Tata Letak
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {LAYOUT_OPTIONS.map((opt) => {
                      const isSelected = formData.layout === opt.id;
                      return (
                        <div
                          key={opt.id}
                          onClick={() => handleLayoutSelect(opt)}
                          className={`p-3 rounded-xl border cursor-pointer transition-all ${
                            isSelected
                              ? 'border-[#DE5795] bg-[#DE5795]/15 ring-2 ring-[#DE5795]'
                              : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-gray-900">{opt.label}</span>
                            {isSelected && <Check className="w-3.5 h-3.5 text-[#DE5795]" />}
                          </div>
                          <p className="text-[10px] text-gray-500 mt-1">{opt.desc}</p>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Slots Count & Orientation */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-gray-800 block mb-1">
                      Jumlah Foto (Slots)
                    </label>
                    <select
                      value={formData.slots_count}
                      onChange={(e) => setFormData({ ...formData, slots_count: parseInt(e.target.value) })}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-gray-200 focus:outline-hidden focus:border-[#DE5795]"
                    >
                      <option value={1}>1 Foto (Single)</option>
                      <option value={2}>2 Foto</option>
                      <option value={3}>3 Foto</option>
                      <option value={4}>4 Foto (Standar Strip/Grid)</option>
                      <option value={6}>6 Foto</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-gray-800 block mb-1">
                      Orientasi Cetak
                    </label>
                    <select
                      value={formData.orientation}
                      onChange={(e) => setFormData({ ...formData, orientation: e.target.value as any })}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-gray-200 focus:outline-hidden focus:border-[#DE5795]"
                    >
                      <option value="PORTRAIT">Portrait (Vertikal)</option>
                      <option value="LANDSCAPE">Landscape (Horisontal)</option>
                    </select>
                  </div>
                </div>

                {/* Padding, Gap, & Border Radius Sliders */}
                <div className="p-3.5 rounded-2xl bg-gray-50 border border-gray-200 space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-gray-700">Margin / Padding Frame:</span>
                    <span className="font-mono text-gray-500">{formData.padding} px</span>
                  </div>
                  <input
                    type="range"
                    min="10"
                    max="60"
                    value={formData.padding}
                    onChange={(e) => setFormData({ ...formData, padding: parseInt(e.target.value) })}
                    className="w-full accent-[#DE5795]"
                  />

                  <div className="flex items-center justify-between text-xs pt-1">
                    <span className="font-semibold text-gray-700">Jarak Antar Foto (Gap):</span>
                    <span className="font-mono text-gray-500">{formData.gap} px</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="40"
                    value={formData.gap}
                    onChange={(e) => setFormData({ ...formData, gap: parseInt(e.target.value) })}
                    className="w-full accent-[#DE5795]"
                  />

                  <div className="flex items-center justify-between text-xs pt-1">
                    <span className="font-semibold text-gray-700">Kelengkungan Sudut Foto (Radius):</span>
                    <span className="font-mono text-gray-500">{formData.border_radius} px</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="24"
                    value={formData.border_radius}
                    onChange={(e) => setFormData({ ...formData, border_radius: parseInt(e.target.value) })}
                    className="w-full accent-[#DE5795]"
                  />
                </div>
              </div>
            )}

            {/* TAB 2: FRAME PNG & BACKGROUND */}
            {activeTab === 'frame' && (
              <div className="space-y-4">
                {/* PNG Frame Upload */}
                <div>
                  <label className="text-xs font-semibold text-gray-800 block mb-1">
                    Upload Frame PNG Transparan
                  </label>
                  <p className="text-[11px] text-gray-500 mb-2">
                    Frame PNG dengan transparansi akan otomatis ditempatkan di atas slot foto. Maksimal 5 MB.
                  </p>

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/png"
                    onChange={handleFileUpload}
                    className="hidden"
                  />

                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-dashed border-gray-300 hover:border-[#DE5795] p-5 rounded-2xl bg-gray-50/50 hover:bg-[#DE5795]/10 cursor-pointer transition-all text-center space-y-2"
                  >
                    <UploadCloud className="w-8 h-8 text-[#DE5795] mx-auto" />
                    <div>
                      <span className="text-xs font-semibold text-[#9D174D]">Klik untuk upload Frame PNG</span>
                      <p className="text-[10px] text-gray-400">Harus berformat .PNG transparan (Maks. 5 MB)</p>
                    </div>
                  </div>

                  {formData.overlay_png_url && (
                    <div className="mt-2.5 flex items-center justify-between p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800">
                      <span className="flex items-center gap-2 font-medium">
                        <FileCheck className="w-4 h-4 text-emerald-600" />
                        Frame PNG Aktif & Tervalidasi
                      </span>
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, overlay_png_url: '' })}
                        className="text-red-600 hover:text-red-800 font-bold text-[11px]"
                      >
                        Hapus Frame
                      </button>
                    </div>
                  )}
                </div>

                {/* Background Color Picker */}
                <div>
                  <label className="text-xs font-semibold text-gray-800 block mb-1">
                    Warna Latar Belakang (Background)
                  </label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {PRESET_COLORS.map((color) => (
                      <button
                        key={color.hex}
                        type="button"
                        onClick={() => setFormData({ ...formData, background_color: color.hex, background_gradient: '' })}
                        className={`w-7 h-7 rounded-full border-2 transition-all flex items-center justify-center ${
                          formData.background_color.toLowerCase() === color.hex.toLowerCase() && !formData.background_gradient
                            ? 'border-[#DE5795] ring-2 ring-[#DE5795]/30 scale-110 shadow-xs'
                            : 'border-gray-200'
                        }`}
                        style={{ backgroundColor: color.hex }}
                        title={color.name}
                      >
                        {formData.background_color.toLowerCase() === color.hex.toLowerCase() && !formData.background_gradient && (
                          <Check className="w-3.5 h-3.5 text-white" />
                        )}
                      </button>
                    ))}
                  </div>

                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={formData.background_color}
                      onChange={(e) => setFormData({ ...formData, background_color: e.target.value })}
                      className="w-9 h-9 rounded-lg border border-gray-200 cursor-pointer p-0.5"
                    />
                    <input
                      type="text"
                      value={formData.background_color}
                      onChange={(e) => setFormData({ ...formData, background_color: e.target.value })}
                      placeholder="#DE5795"
                      className="px-3 py-1.5 text-xs font-mono rounded-lg border border-gray-200 focus:outline-hidden focus:border-[#DE5795]"
                    />
                  </div>
                </div>

                {/* Subtle Gradient Toggle */}
                <div>
                  <label className="text-xs font-semibold text-gray-800 block mb-1">
                    Efek Gradien Lembut (Opsional)
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { label: 'Solid Standar', value: '' },
                      { label: 'Rose Magenta Glow', value: 'linear-gradient(135deg, #DE5795 0%, #FDF2F7 100%)' },
                      { label: 'Pastel Sunset', value: 'linear-gradient(135deg, #FFF1EB 0%, #ACE0F9 100%)' },
                      { label: 'Champagne Glow', value: 'linear-gradient(135deg, #FDFCFB 0%, #E2D1C3 100%)' },
                    ].map((g) => (
                      <button
                        key={g.label}
                        type="button"
                        onClick={() => setFormData({ ...formData, background_gradient: g.value })}
                        className={`p-2 rounded-xl text-left text-xs border transition-all ${
                          formData.background_gradient === g.value
                            ? 'border-[#DE5795] bg-[#DE5795]/15 font-bold text-[#9D174D]'
                            : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                        }`}
                      >
                        {g.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* TAB 3: BRANDING, TEXT & EVENT */}
            {activeTab === 'branding' && (
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-semibold text-gray-800 block mb-1">
                    Nama Acara / Event Title
                  </label>
                  <input
                    type="text"
                    value={formData.event_name}
                    onChange={(e) => setFormData({ ...formData, event_name: e.target.value })}
                    placeholder="Contoh: The Wedding of Sarah & Dani"
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-gray-200 focus:outline-hidden focus:border-[#DE5795]"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-gray-800 block mb-1">
                    Subteks / Ucapan (Footer Text)
                  </label>
                  <input
                    type="text"
                    value={formData.text_elements[0]?.text || ''}
                    onChange={(e) => {
                      const updated = [...formData.text_elements];
                      if (updated[0]) updated[0].text = e.target.value;
                      else updated.push({ id: 'txt-1', text: e.target.value, fontFamily: 'Sora', fontSize: 24, color: '#470F29' });
                      setFormData({ ...formData, text_elements: updated });
                    }}
                    placeholder="Contoh: Forever & Always • 15 Oktober 2026"
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-gray-200 focus:outline-hidden focus:border-[#DE5795]"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-gray-800 block mb-1">
                    Logo Acara / Sponsor (URL Logo PNG)
                  </label>
                  <input
                    type="url"
                    value={formData.logo_url}
                    onChange={(e) => setFormData({ ...formData, logo_url: e.target.value })}
                    placeholder="https://example.com/logo.png"
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-gray-200 focus:outline-hidden focus:border-[#DE5795]"
                  />
                </div>

                <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 border border-gray-200">
                  <input
                    type="checkbox"
                    id="show_date_cb"
                    checked={formData.show_date}
                    onChange={(e) => setFormData({ ...formData, show_date: e.target.checked })}
                    className="w-4 h-4 rounded text-[#DE5795] focus:ring-[#DE5795]"
                  />
                  <label htmlFor="show_date_cb" className="text-xs font-medium text-gray-700 cursor-pointer">
                    Tampilkan tanggal sesi otomatis pada bagian bawah cetakan
                  </label>
                </div>
              </div>
            )}

            {/* TAB 4: BOOTH ASSIGNMENT & STATUS */}
            {activeTab === 'booth' && (
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-semibold text-gray-800 block mb-1">
                    Penetapan Booth Aktif
                  </label>
                  <p className="text-[11px] text-gray-500 mb-2">
                    Tentukan booth mana yang dapat menggunakan template ini di Kiosk.
                  </p>
                  <select
                    value={formData.assigned_booth_id}
                    onChange={(e) => setFormData({ ...formData, assigned_booth_id: e.target.value })}
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-gray-200 focus:outline-hidden focus:border-[#DE5795]"
                  >
                    <option value="ALL">Semua Booth (Global Library)</option>
                    <option value="bth-001">Booth Alpha - Grand Indonesia (bth-001)</option>
                    <option value="bth-002">Booth Beta - Central Park (bth-002)</option>
                    <option value="bth-003">Booth Gamma - PVJ Bandung (bth-003)</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-gray-800 block mb-1">
                    Kategori Template
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-gray-200 focus:outline-hidden focus:border-[#DE5795]"
                  >
                    {CATEGORIES.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-gray-800 block mb-1">
                    Deskripsi / Catatan Admin
                  </label>
                  <textarea
                    rows={2}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Catatan event, konfigurasi kertas, atau instruksi operator..."
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-gray-200 focus:outline-hidden focus:border-[#DE5795]"
                  />
                </div>

                <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 border border-gray-200">
                  <input
                    type="checkbox"
                    id="is_active_cb"
                    checked={formData.is_active}
                    onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                    className="w-4 h-4 rounded text-[#DE5795] focus:ring-[#DE5795]"
                  />
                  <label htmlFor="is_active_cb" className="text-xs font-medium text-gray-700 cursor-pointer">
                    Status Aktif (Tersedia untuk dipilih pada Kiosk Booth)
                  </label>
                </div>
              </div>
            )}
          </div>

            {/* Right Live WYSIWYG Preview Column */}
            <div className="lg:col-span-5 p-6 bg-gray-50/70 flex flex-col items-center justify-between overflow-y-auto border-t lg:border-t-0">
            <div className="w-full flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-gray-900 flex items-center gap-1.5 font-sora">
                <Eye className="w-3.5 h-3.5 text-[#DE5795]" />
                Live Preview Interaktif
              </span>

              <button
                type="button"
                onClick={() => setShowSamplePhotos(!showSamplePhotos)}
                className="text-[11px] font-semibold text-[#9D174D] hover:text-[#DE5795] px-2 py-1 rounded bg-[#DE5795]/15 border border-[#DE5795]/30 transition-colors"
              >
                {showSamplePhotos ? 'Lihat Wireframe' : 'Lihat Foto Sampel'}
              </button>
            </div>

            {/* Render Preview Frame */}
            <div className="flex-1 flex items-center justify-center w-full py-2">
              <TemplatePreview
                layout={formData.layout}
                slotsCount={formData.slots_count}
                backgroundColor={formData.background_color}
                backgroundGradient={formData.background_gradient}
                backgroundImageUrl={formData.background_image_url}
                overlayPngUrl={formData.overlay_png_url}
                orientation={formData.orientation}
                padding={formData.padding}
                gap={formData.gap}
                borderRadius={formData.border_radius}
                textElements={formData.text_elements}
                logoUrl={formData.logo_url}
                showDate={formData.show_date}
                eventName={formData.event_name}
                templateName={formData.name || 'Pratinjau Template'}
                showSamplePhotos={showSamplePhotos}
                className={
                  formData.layout === '2x6_strip'
                    ? 'w-[145px] h-[410px]'
                    : formData.layout === '4x6_postcard'
                    ? 'w-[290px] h-[200px]'
                    : 'w-[240px] h-[240px]'
                }
              />
            </div>

              <p className="text-[10px] text-gray-400 text-center mt-3">
                Ukuran cetak: <strong className="text-gray-700">{formData.print_size}</strong> ({formData.width}×{formData.height} px)
              </p>
            </div>
          </div>

          {/* Drawer Sticky Footer */}
          <div className="px-7 py-4.5 border-t border-gray-200/80 bg-white/95 backdrop-blur-md flex items-center justify-between gap-3 shrink-0 sticky bottom-0 z-20 shadow-xs">
            <span className="text-[11px] text-gray-400 hidden sm:inline">
              Tekan <kbd className="px-1.5 py-0.5 rounded bg-gray-100 border border-gray-200 font-mono text-[10px] text-gray-500">ESC</kbd> untuk membatalkan
            </span>
            <div className="flex items-center gap-2.5">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl border border-gray-200/90 bg-white text-xs font-semibold text-gray-700 hover:bg-gray-50 transition-colors shadow-2xs"
              >
                Batal
              </button>

              <button
                type="submit"
                disabled={isSaving}
                className="px-5 py-2.5 rounded-xl bg-[#DE5795] text-white text-xs font-bold hover:bg-[#c93d7e] transition-all border border-[#DE5795] shadow-xs flex items-center gap-2 disabled:opacity-50 active:scale-98"
              >
                <Check className="w-4 h-4 text-white" />
                <span>{isSaving ? 'Menyimpan...' : initialData ? 'Perbarui Template' : 'Publikasikan Template'}</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  </div>
  );
}
