'use client';

import React, { useState, useEffect } from 'react';
import {
  Layers,
  Plus,
  Search,
  Filter,
  RefreshCw,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  X,
  Trash2,
  Copy,
  Printer,
  Store,
  Archive,
  BookOpen,
  SlidersHorizontal,
  ChevronDown,
} from 'lucide-react';
import { Template, TemplateFormData } from '@/features/templates/types/template.types';
import { TemplateCard } from '@/features/templates/components/TemplateCard';
import { TemplateModal } from '@/features/templates/components/TemplateModal';

// Pre-built Curated Template Library Presets
const CURATED_LIBRARY_PRESETS = [
  {
    name: 'Botanical Sage Garden Wedding',
    layout: '2x6_strip',
    category: 'WEDDING',
    slots_count: 3,
    width: 600,
    height: 1800,
    background_color: '#DE5795',
    event_name: 'The Wedding of Sarah & Dani',
    print_size: '2x6 in',
    orientation: 'PORTRAIT',
    padding: 30,
    gap: 20,
    border_radius: 8,
    assigned_booth_id: 'ALL',
    description: 'Template strip 3-foto bertema pastel sage green lembut untuk resepsi pernikahan luar ruangan.',
  },
  {
    name: 'Golden Gala Black Tie Postcard',
    layout: '4x6_postcard',
    category: 'CORPORATE',
    slots_count: 2,
    width: 1800,
    height: 1200,
    background_color: '#0F172A',
    event_name: 'Annual Tech Gala Awards 2026',
    print_size: '4x6 in',
    orientation: 'LANDSCAPE',
    padding: 40,
    gap: 24,
    border_radius: 6,
    assigned_booth_id: 'bth-001',
    description: 'Format kartu pos mewah 4x6 untuk acara korporat, gala dinner, dan peluncuran produk.',
  },
  {
    name: 'Sweet 17th Birthday Pop Collage',
    layout: 'grid_2x2',
    category: 'BIRTHDAY',
    slots_count: 4,
    width: 1200,
    height: 1200,
    background_color: '#FFF1EB',
    event_name: 'Maya’s Sweet Seventeen Party',
    print_size: 'Square',
    orientation: 'PORTRAIT',
    padding: 32,
    gap: 16,
    border_radius: 12,
    assigned_booth_id: 'ALL',
    description: 'Grid persegi 4 foto dengan aksen warna hangat ceria untuk perayaan ulang tahun.',
  },
  {
    name: 'Retro 90s Film Minimalist',
    layout: 'polaroid',
    category: 'VINTAGE',
    slots_count: 1,
    width: 1000,
    height: 1200,
    background_color: '#FFFFFF',
    event_name: 'Retro Moments with Us',
    print_size: '3.5x4.2 in',
    orientation: 'PORTRAIT',
    padding: 24,
    gap: 0,
    border_radius: 2,
    assigned_booth_id: 'bth-002',
    description: 'Bingkai polaroid retro klasik 1 foto dengan ruang tanda tangan tamu pada bagian bawah.',
  },
];

export default function TemplatesPage() {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [layoutFilter, setLayoutFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [boothFilter, setBoothFilter] = useState<string>('all');
  const [showArchived, setShowArchived] = useState<boolean>(false);

  // Modals
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [editingTemplate, setEditingTemplate] = useState<Template | null>(null);
  const [isLibraryOpen, setIsLibraryOpen] = useState<boolean>(false);
  const [deleteConfirm, setDeleteConfirm] = useState<{ id: string; name: string } | null>(null);

  // Toast / Feedback message
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  // Fetch templates from Database via API
  const fetchTemplates = async () => {
    setIsLoading(true);
    try {
      const query = new URLSearchParams();
      if (showArchived) query.set('include_archived', 'true');
      if (boothFilter !== 'all') query.set('booth_id', boothFilter);
      if (categoryFilter !== 'all') query.set('category', categoryFilter);

      const res = await fetch(`/api/templates?${query.toString()}`);
      const data = await res.json();
      if (data.success && Array.isArray(data.data)) {
        setTemplates(data.data);
      } else {
        throw new Error(data.message || 'Gagal mengambil data template');
      }
    } catch (err: any) {
      showToast(err.message || 'Gagal menghubungkan ke database', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTemplates();
  }, [showArchived, boothFilter, categoryFilter]);

  // Handle Save (Create or Update)
  const handleSaveTemplate = async (formData: TemplateFormData, id?: string) => {
    setIsSaving(true);
    try {
      const isEdit = Boolean(id);
      const url = isEdit ? `/api/templates/${id}` : '/api/templates';
      const method = isEdit ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Gagal menyimpan template');
      }

      showToast(isEdit ? 'Template berhasil diperbarui di database' : 'Template baru berhasil dibuat di database');
      setIsModalOpen(false);
      setEditingTemplate(null);
      await fetchTemplates();
    } catch (err: any) {
      showToast(err.message || 'Terjadi kesalahan saat menyimpan', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  // Handle Duplicate
  const handleDuplicate = async (template: Template) => {
    try {
      const res = await fetch(`/api/templates/${template.id}/duplicate`, {
        method: 'POST',
      });
      const data = await res.json();
      if (data.success) {
        showToast(`Template "${template.name}" berhasil diduplikasi`);
        await fetchTemplates();
      } else {
        throw new Error(data.message || 'Gagal menduplikasi template');
      }
    } catch (err: any) {
      showToast(err.message || 'Gagal menduplikasi template', 'error');
    }
  };

  // Handle Toggle Active Status
  const handleToggleActive = async (id: string) => {
    try {
      const res = await fetch(`/api/templates/${id}`, {
        method: 'PATCH',
      });
      const data = await res.json();
      if (data.success) {
        setTemplates((prev) =>
          prev.map((t) => (t.id === id ? { ...t, is_active: !t.is_active, isActive: !t.isActive } : t))
        );
        showToast('Status aktif template diperbarui');
      } else {
        throw new Error(data.message || 'Gagal mengubah status');
      }
    } catch (err: any) {
      showToast(err.message || 'Gagal mengubah status template', 'error');
    }
  };

  // Handle Toggle Archive
  const handleToggleArchive = async (id: string) => {
    try {
      const res = await fetch(`/api/templates/${id}/archive`, {
        method: 'PATCH',
      });
      const data = await res.json();
      if (data.success) {
        showToast(data.message || 'Status arsip diperbarui');
        await fetchTemplates();
      } else {
        throw new Error(data.message || 'Gagal mengarsipkan template');
      }
    } catch (err: any) {
      showToast(err.message || 'Gagal mengarsipkan template', 'error');
    }
  };

  // Handle Delete
  const handleDelete = async () => {
    if (!deleteConfirm) return;
    try {
      const res = await fetch(`/api/templates/${deleteConfirm.id}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (data.success) {
        showToast(`Template "${deleteConfirm.name}" berhasil dihapus`);
        setTemplates((prev) => prev.filter((t) => t.id !== deleteConfirm.id));
      } else {
        throw new Error(data.message || 'Gagal menghapus template');
      }
    } catch (err: any) {
      showToast(err.message || 'Gagal menghapus template', 'error');
    } finally {
      setDeleteConfirm(null);
    }
  };

  // Install Curated Library Preset
  const handleInstallPreset = async (preset: typeof CURATED_LIBRARY_PRESETS[0]) => {
    try {
      const res = await fetch('/api/templates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...preset,
          is_active: true,
        }),
      });
      const data = await res.json();
      if (data.success) {
        showToast(`Template library "${preset.name}" berhasil ditambahkan ke database!`);
        setIsLibraryOpen(false);
        await fetchTemplates();
      }
    } catch (e) {
      showToast('Gagal memasang template preset', 'error');
    }
  };

  // Filter templates
  const filteredTemplates = templates.filter((t) => {
    const matchesSearch =
      t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (t.event_name && t.event_name.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (t.description && t.description.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesLayout =
      layoutFilter === 'all' ||
      t.layout === layoutFilter ||
      (layoutFilter === 'photo_strip' && t.layout === '2x6_strip') ||
      (layoutFilter === 'postcard' && t.layout === '4x6_postcard') ||
      (layoutFilter === 'collage' && t.layout === 'grid_2x2');

    return matchesSearch && matchesLayout;
  });

  // Calculate Metrics
  const totalCount = templates.length;
  const activeCount = templates.filter((t) => t.is_active || t.isActive).length;
  const archivedCount = templates.filter((t) => t.is_archived || t.isArchived).length;
  const layoutCount = new Set(templates.map((t) => t.layout)).size;

  return (
    <div className="space-y-6 font-sora">
        {/* Toast Notification */}
        {toast && (
          <div className="fixed top-6 right-6 z-50 animate-fade-in">
            <div
              className={`px-4 py-3 rounded-xl shadow-lg border flex items-center gap-2.5 text-xs font-semibold ${
                toast.type === 'success'
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                  : 'bg-red-50 text-red-800 border-red-200'
              }`}
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>{toast.message}</span>
            </div>
          </div>
        )}

        {/* Page Header - Untitled UI Standard */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-200 pb-5">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-pink-50 text-[#9D174D] border border-pink-200">
                <span className="w-1.5 h-1.5 rounded-full bg-[#DE5795]" />
                {totalCount} Template Tersedia
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-semibold text-gray-900 tracking-tight">
              Koleksi Template Desain Foto
            </h1>
            <p className="text-sm text-gray-600 mt-1">
              Buat dan kelola desain foto, upload frame PNG transparan, konfigurasi tata letak foto, penugasan per booth/event, dan library template.
            </p>
          </div>

          {/* Action CTAs - Untitled UI Standard */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => setIsLibraryOpen(true)}
              className="px-4 py-2 text-sm font-semibold text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 shadow-xs transition-colors flex items-center gap-2"
            >
              <BookOpen className="w-4 h-4 text-[#DE5795]" />
              <span>Template Library</span>
            </button>

            <button
              onClick={() => {
                setEditingTemplate(null);
                setIsModalOpen(true);
              }}
              className="px-4 py-2 text-sm font-semibold text-white bg-[#DE5795] hover:bg-[#c93d7e] rounded-lg shadow-xs transition-colors flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              <span>Buat Template Baru</span>
            </button>
          </div>
        </div>

        {/* Metrics Row - Untitled UI Standard */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-xs hover:border-gray-300 transition-all">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-600">Total Template</span>
              <div className="w-10 h-10 rounded-lg bg-pink-50 border border-pink-100 flex items-center justify-center text-[#DE5795]">
                <Layers className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-4 flex items-baseline justify-between">
              <h3 className="text-3xl font-semibold text-gray-900 tracking-tight">
                {totalCount} <span className="text-lg font-normal text-gray-500">Desain</span>
              </h3>
            </div>
            <div className="mt-3 text-xs text-gray-500">
              Tersimpan dalam database sistem
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-xs hover:border-gray-300 transition-all">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-600">Template Aktif</span>
              <div className="w-10 h-10 rounded-lg bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-700">
                <CheckCircle2 className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-4 flex items-baseline justify-between">
              <h3 className="text-3xl font-semibold text-gray-900 tracking-tight">
                {activeCount} <span className="text-lg font-normal text-gray-500">Aktif</span>
              </h3>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                Siaga Kiosk
              </span>
            </div>
            <div className="mt-3 text-xs text-gray-500">
              Tersedia dipilih tamu di layar sentuh
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-xs hover:border-gray-300 transition-all">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-600">Variasi Format Layout</span>
              <div className="w-10 h-10 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-700">
                <Printer className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-4 flex items-baseline justify-between">
              <h3 className="text-3xl font-semibold text-gray-900 tracking-tight">
                {layoutCount} <span className="text-lg font-normal text-gray-500">Format</span>
              </h3>
            </div>
            <div className="mt-3 text-xs text-gray-500">
              Strip 2×6, Postcard 4×6, Grid 2×2
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-xs hover:border-gray-300 transition-all">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-600">Arsip Template</span>
              <div className="w-10 h-10 rounded-lg bg-gray-50 border border-gray-200 flex items-center justify-center text-gray-600">
                <Archive className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-4 flex items-baseline justify-between">
              <h3 className="text-3xl font-semibold text-gray-900 tracking-tight">
                {archivedCount} <span className="text-lg font-normal text-gray-500">Arsip</span>
              </h3>
            </div>
            <div className="mt-3 text-xs text-gray-500">
              Disimpan aman untuk riwayat acara
            </div>
          </div>
        </div>

        {/* Filter Bar - Untitled UI Standard */}
        <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            {/* Layout Format Segmented Buttons */}
            <div className="p-1 bg-gray-50 border border-gray-200 rounded-lg inline-flex items-center gap-1 overflow-x-auto text-xs">
              {[
                { label: 'Semua Format', value: 'all' },
                { label: '2×6 Strip', value: '2x6_strip' },
                { label: '4×6 Postcard', value: '4x6_postcard' },
                { label: '2×2 Grid Box', value: 'grid_2x2' },
                { label: 'Single Photo', value: 'single_photo' },
                { label: 'Polaroid', value: 'polaroid' },
              ].map((tab) => {
                const isActive = layoutFilter === tab.value;
                return (
                  <button
                    key={tab.value}
                    onClick={() => setLayoutFilter(tab.value)}
                    className={`px-3 py-1.5 rounded-md text-xs font-semibold whitespace-nowrap transition-all ${
                      isActive
                        ? 'bg-white text-gray-900 shadow-xs border border-gray-200/50'
                        : 'text-gray-500 hover:text-gray-900'
                    }`}
                  >
                    {tab.label}
                  </button>
                );
              })}
            </div>

            {/* Right Quick Dropdowns */}
            <div className="flex items-center gap-2">
              {/* Booth Filter */}
              <select
                value={boothFilter}
                onChange={(e) => setBoothFilter(e.target.value)}
                className="px-3.5 py-1.5 text-xs bg-white border border-gray-300 rounded-lg font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#DE5795]/20 focus:border-[#DE5795] shadow-xs"
              >
                <option value="all">Semua Booth</option>
                <option value="bth-001">Booth Alpha (GI)</option>
                <option value="bth-002">Booth Beta (CP)</option>
                <option value="bth-003">Booth Gamma (PVJ)</option>
              </select>

              {/* Archive Toggle */}
              <button
                onClick={() => setShowArchived(!showArchived)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold border transition-colors flex items-center gap-1.5 shadow-xs ${
                  showArchived
                    ? 'bg-amber-50 text-amber-900 border-amber-300'
                    : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                }`}
                title="Tampilkan template terarsip"
              >
                <Archive className="w-3.5 h-3.5 text-gray-500" />
                <span>{showArchived ? 'Sembunyikan Arsip' : 'Termasuk Arsip'}</span>
              </button>
            </div>
          </div>

          {/* Search Bar - Untitled UI Standard */}
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Cari template berdasarkan nama, judul acara, atau deskripsi..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-sm bg-white border border-gray-300 rounded-lg placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#DE5795]/20 focus:border-[#DE5795] shadow-xs"
            />
          </div>
        </div>

        {/* Templates Grid */}
        {isLoading ? (
          <div className="py-20 text-center rounded-2xl border border-gray-200 bg-white">
            <RefreshCw className="w-8 h-8 text-[#DE5795] animate-spin mx-auto mb-3" />
            <p className="text-xs font-medium text-gray-500">Memuat koleksi template desain...</p>
          </div>
        ) : filteredTemplates.length === 0 ? (
          <div className="py-20 text-center rounded-2xl border border-dashed border-gray-300 bg-white p-6 space-y-3">
            <Layers className="w-10 h-10 text-gray-300 mx-auto" />
            <div className="space-y-1">
              <h3 className="text-sm font-bold text-gray-800">Tidak Ada Template yang Cocok</h3>
              <p className="text-xs text-gray-500 max-w-sm mx-auto">
                Coba sesuaikan kata kunci pencarian atau pasang template dari Template Library.
              </p>
            </div>
            <button
              onClick={() => setIsLibraryOpen(true)}
              className="px-4 py-2 rounded-xl bg-[#DE5795] text-white text-xs font-bold hover:bg-[#c93d7e] transition-colors border border-[#DE5795]"
            >
              Buka Template Library
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {filteredTemplates.map((template) => (
              <TemplateCard
                key={template.id}
                template={template}
                onEdit={(t) => {
                  setEditingTemplate(t);
                  setIsModalOpen(true);
                }}
                onDuplicate={handleDuplicate}
                onDelete={(id, name) => setDeleteConfirm({ id, name })}
                onToggleActive={handleToggleActive}
                onToggleArchive={handleToggleArchive}
              />
            ))}
          </div>
        )}

      {/* Create / Edit Template Modal */}
      <TemplateModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingTemplate(null);
        }}
        onSave={handleSaveTemplate}
        initialData={editingTemplate}
        isSaving={isSaving}
      />

      {/* Template Library Drawer */}
      {isLibraryOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden font-sora">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-gray-950/60 backdrop-blur-xs transition-opacity animate-fade-in"
            onClick={() => setIsLibraryOpen(false)}
          />

          <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
            <div className="w-screen max-w-2xl bg-white shadow-2xl border-l border-gray-100 flex flex-col animate-slide-left">
              {/* Drawer Header */}
              <div className="px-6 py-5 border-b border-gray-200/80 flex items-center justify-between bg-white shrink-0 sticky top-0 z-20 shadow-2xs">
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className="w-11 h-11 rounded-2xl bg-[#DE5795]/15 border border-[#DE5795]/30 flex items-center justify-center text-[#9D174D] shadow-xs shrink-0">
                    <BookOpen className="w-5 h-5 text-[#DE5795]" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-base font-bold text-gray-900 font-sora leading-tight">Template Library</h3>
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#DE5795]/15 text-[#9D174D] border border-[#DE5795]/30">
                        Preset Hub
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 mt-0.5 truncate">
                      Pilih preset profesional siap pakai untuk langsung ditambahkan ke sistem booth
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setIsLibraryOpen(false)}
                  className="w-9 h-9 rounded-xl text-gray-400 hover:text-gray-700 hover:bg-gray-100 border border-transparent hover:border-gray-200 transition-all flex items-center justify-center shrink-0 ml-3"
                  title="Tutup (Esc)"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Drawer Body */}
              <div className="p-6 overflow-y-auto flex-1 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {CURATED_LIBRARY_PRESETS.map((preset, idx) => (
                    <div
                      key={idx}
                      className="p-4 rounded-2xl border border-gray-200 bg-white hover:border-[#DE5795] hover:shadow-md transition-all flex flex-col justify-between space-y-3"
                    >
                      <div>
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-gray-900">{preset.name}</span>
                          <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-[#DE5795]/15 text-[#9D174D] border border-[#DE5795]/30">
                            {preset.print_size}
                          </span>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">{preset.description}</p>
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t border-gray-100 text-xs">
                        <span className="text-gray-400 text-[11px]">{preset.slots_count} Foto • {preset.category}</span>
                        <button
                          onClick={() => handleInstallPreset(preset)}
                          className="px-3 py-1.5 rounded-lg bg-[#DE5795] text-white font-bold text-xs hover:bg-[#c93d7e] transition-colors border border-[#DE5795]"
                        >
                          Pasang Template
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Drawer Sticky Footer */}
              <div className="px-6 py-4 border-t border-gray-100 bg-gray-50/80 backdrop-blur-sm flex items-center justify-end gap-3 shrink-0 sticky bottom-0 z-10">
                <button
                  type="button"
                  onClick={() => setIsLibraryOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-xs font-semibold text-gray-700 hover:bg-gray-100 transition-colors"
                >
                  Tutup Library
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-950/60 backdrop-blur-sm animate-fade-in font-sora">
          <div className="relative w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl border border-gray-100 text-center space-y-4">
            <div className="w-12 h-12 rounded-xl bg-red-100 text-red-600 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-bold text-gray-900">Hapus Template?</h3>
              <p className="text-xs text-gray-500">
                Apakah Anda yakin ingin menghapus template <strong className="text-gray-800 font-semibold">{deleteConfirm.name}</strong>? Tindakan ini tidak dapat dibatalkan.
              </p>
            </div>
            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="flex-1 py-2 rounded-lg border border-gray-200 text-xs font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Batal
              </button>
              <button
                onClick={handleDelete}
                className="flex-1 py-2 rounded-lg bg-red-600 text-white text-xs font-bold hover:bg-red-700 transition-colors shadow-xs"
              >
                Hapus
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
