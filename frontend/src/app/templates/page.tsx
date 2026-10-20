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

        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold tracking-tight text-gray-900 font-sora">
                Template & Layout Management
              </h1>
              <span className="px-2.5 py-0.5 rounded-full bg-[#DE5795] text-white text-xs font-bold border border-[#DE5795]">
                PRD Verified
              </span>
            </div>
            <p className="text-xs text-gray-500 max-w-2xl">
              Buat dan kelola desain foto, upload frame PNG transparan, konfigurasi tata letak foto, penugasan per booth/event, dan library template.
            </p>
          </div>

          {/* Action CTAs */}
          <div className="flex items-center gap-2.5">
            <button
              onClick={() => setIsLibraryOpen(true)}
              className="px-3.5 py-2.5 rounded-xl border border-gray-200 bg-white text-xs font-semibold text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-2 shadow-xs"
            >
              <BookOpen className="w-4 h-4 text-[#DE5795]" />
              <span>Template Library</span>
            </button>

            <button
              onClick={() => {
                setEditingTemplate(null);
                setIsModalOpen(true);
              }}
              className="px-4.5 py-2.5 rounded-xl bg-[#DE5795] text-white text-xs font-bold hover:bg-[#c93d7e] transition-colors border border-[#DE5795] flex items-center gap-2 shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span>Buat Template Baru</span>
            </button>
          </div>
        </div>

        {/* Metrics Row - Untitled UI Style */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-gray-500">Total Template</span>
              <Layers className="w-4 h-4 text-gray-400" />
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-2xl font-bold text-gray-900">{totalCount}</span>
              <span className="text-[11px] text-gray-500 font-medium">desain tersimpan</span>
            </div>
          </div>

          <div className="rounded-2xl border border-[#DE5795]/30 bg-[#DE5795]/10 p-4 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-[#9D174D]">Template Aktif</span>
              <span className="w-2 h-2 rounded-full bg-[#DE5795] animate-pulse" />
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-2xl font-bold text-[#9D174D]">{activeCount}</span>
              <span className="text-[11px] text-[#DE5795] font-semibold">tersedia di Kiosk</span>
            </div>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-gray-500">Variasi Format</span>
              <Printer className="w-4 h-4 text-gray-400" />
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-2xl font-bold text-gray-900">{layoutCount} Format</span>
              <span className="text-[11px] text-gray-500 font-medium">Strip, Postcard, dll</span>
            </div>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-gray-500">Arsip Template</span>
              <Archive className="w-4 h-4 text-amber-500" />
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-2xl font-bold text-gray-900">{archivedCount}</span>
              <span className="text-[11px] text-gray-500 font-medium">tersimpan aman</span>
            </div>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-xs space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            {/* Layout Format Tabs */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
              {[
                { label: 'Semua Format', value: 'all' },
                { label: '2×6 Strip', value: '2x6_strip' },
                { label: '4×6 Postcard', value: '4x6_postcard' },
                { label: '2×2 Grid Box', value: 'grid_2x2' },
                { label: 'Single Photo', value: 'single_photo' },
                { label: 'Polaroid', value: 'polaroid' },
              ].map((tab) => (
                <button
                  key={tab.value}
                  onClick={() => setLayoutFilter(tab.value)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
                    layoutFilter === tab.value
                      ? 'bg-[#DE5795] text-white border border-[#DE5795]'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Right Quick Dropdowns */}
            <div className="flex items-center gap-2">
              {/* Booth Filter */}
              <select
                value={boothFilter}
                onChange={(e) => setBoothFilter(e.target.value)}
                className="px-2.5 py-1.5 rounded-lg border border-gray-200 bg-white text-xs font-medium text-gray-700 focus:outline-hidden focus:border-[#DE5795]"
              >
                <option value="all">Semua Booth</option>
                <option value="bth-001">Booth Alpha (GI)</option>
                <option value="bth-002">Booth Beta (CP)</option>
                <option value="bth-003">Booth Gamma (PVJ)</option>
              </select>

              {/* Archive Toggle */}
              <button
                onClick={() => setShowArchived(!showArchived)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors flex items-center gap-1.5 ${
                  showArchived
                    ? 'bg-amber-100 text-amber-900 border-amber-300'
                    : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                }`}
                title="Tampilkan template terarsip"
              >
                <Archive className="w-3.5 h-3.5" />
                <span>{showArchived ? 'Sembunyikan Arsip' : 'Termasuk Arsip'}</span>
              </button>
            </div>
          </div>

          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Cari template berdasarkan nama, judul acara, atau deskripsi..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-xs rounded-xl border border-gray-200 focus:outline-hidden focus:border-[#DE5795] focus:ring-2 focus:ring-[#DE5795]/20"
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

      {/* Template Library Drawer / Modal */}
      {isLibraryOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-950/60 backdrop-blur-sm animate-fade-in font-sora">
          <div className="relative w-full max-w-3xl rounded-3xl bg-white shadow-2xl border border-gray-100 overflow-hidden flex flex-col max-h-[88vh]">
            <div className="px-6 py-4.5 border-b border-gray-100 flex items-center justify-between bg-gray-50/70">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-[#DE5795] text-white border border-[#DE5795]">
                  <BookOpen className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-gray-900 font-sora">Template Library</h3>
                  <p className="text-xs text-gray-500">
                    Pilih preset profesional siap pakai untuk langsung ditambahkan ke sistem booth Anda.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsLibraryOpen(false)}
                className="p-2 rounded-xl text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-4">
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

            <div className="px-6 py-3 border-t border-gray-100 bg-gray-50 flex justify-end">
              <button
                onClick={() => setIsLibraryOpen(false)}
                className="px-4 py-2 rounded-xl bg-gray-900 text-white text-xs font-semibold hover:bg-gray-800 transition-colors"
              >
                Tutup
              </button>
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
