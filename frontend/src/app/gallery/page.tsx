'use client';

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import Link from 'next/link';
import {
  Images,
  Cloud,
  QrCode,
  Download,
  Share2,
  Copy,
  Check,
  Search,
  Filter,
  Calendar,
  Clock,
  ExternalLink,
  Lock,
  Unlock,
  ShieldCheck,
  Eye,
  Sliders,
  FolderPlus,
  ArrowUpDown,
  RefreshCw,
  HardDrive,
  Smartphone,
  Sparkles,
  X,
  FileArchive,
  Layers,
  ChevronRight,
  Info,
  CheckCircle2,
  AlertCircle,
  FileImage,
  Flame,
  Globe,
  Store,
  Film
} from 'lucide-react';
import { GalleryMediaItem, CloudAlbum, DownloadAccessLog, MediaType } from '@/features/gallery/types/gallery.types';
import { useLanguage } from '@/context/language-context';

// Initial Gallery Data (Clean State)
const INITIAL_ALBUMS: CloudAlbum[] = [];
const INITIAL_MEDIA_ITEMS: GalleryMediaItem[] = [];
const SAMPLE_LOGS: DownloadAccessLog[] = [];

export default function GalleryPage() {
  const { t, language } = useLanguage();
  const [albums, setAlbums] = useState<CloudAlbum[]>(INITIAL_ALBUMS);
  const [mediaList, setMediaList] = useState<GalleryMediaItem[]>(INITIAL_MEDIA_ITEMS);

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAlbumSlug, setSelectedAlbumSlug] = useState('ALL');
  const [selectedMediaType, setSelectedMediaType] = useState<string>('ALL');
  const [downloadFilter, setDownloadFilter] = useState<string>('ALL');
  const [sortBy, setSortBy] = useState<'NEWEST' | 'DOWNLOADS' | 'SIZE'>('NEWEST');

  // Modals & Drawers state
  const [activeMediaDetail, setActiveMediaDetail] = useState<GalleryMediaItem | null>(null);
  const [mobilePreviewItem, setMobilePreviewItem] = useState<GalleryMediaItem | null>(null);
  const [qrModalItem, setQrModalItem] = useState<GalleryMediaItem | null>(null);
  const [isNewAlbumDrawerOpen, setIsNewAlbumDrawerOpen] = useState(false);

  // New Album Form
  const [newAlbumName, setNewAlbumName] = useState('');
  const [newAlbumCategory, setNewAlbumCategory] = useState<'Wedding' | 'Corporate' | 'Birthday' | 'Mall Kiosk'>('Wedding');
  const [newAlbumVenue, setNewAlbumVenue] = useState('');
  const [newAlbumDate, setNewAlbumDate] = useState('25/10/2026');
  const [newAlbumSlug, setNewAlbumSlug] = useState('');

  // Toast feedback
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  const hasOpenOverlay = !!(activeMediaDetail || isNewAlbumDrawerOpen || mobilePreviewItem || qrModalItem);

  // Close modals on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (mobilePreviewItem) setMobilePreviewItem(null);
        else if (qrModalItem) setQrModalItem(null);
        else if (activeMediaDetail) setActiveMediaDetail(null);
        else if (isNewAlbumDrawerOpen) setIsNewAlbumDrawerOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [mobilePreviewItem, qrModalItem, activeMediaDetail, isNewAlbumDrawerOpen]);

  // Lock background scroll when modal/drawer is open
  useEffect(() => {
    if (hasOpenOverlay) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [hasOpenOverlay]);

  // Filter media logic
  const filteredMedia = mediaList.filter((item) => {
    // Search
    const matchesSearch =
      item.sessionCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.eventName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.customerPhone && item.customerPhone.includes(searchQuery));

    // Album slug
    const matchesAlbum = selectedAlbumSlug === 'ALL' || item.albumSlug === selectedAlbumSlug;

    // Media type
    const matchesType = selectedMediaType === 'ALL' || item.mediaType === selectedMediaType;

    // Download status
    const matchesStatus =
      downloadFilter === 'ALL'
        ? true
        : downloadFilter === 'DOWNLOADED'
        ? item.downloadCount > 0
        : downloadFilter === 'NOT_DOWNLOADED'
        ? item.downloadCount === 0
        : downloadFilter === 'PIN'
        ? item.isPinProtected
        : true;

    return matchesSearch && matchesAlbum && matchesType && matchesStatus;
  }).sort((a, b) => {
    if (sortBy === 'DOWNLOADS') return b.downloadCount - a.downloadCount;
    if (sortBy === 'SIZE') return b.fileSizeMb - a.fileSizeMb;
    return 0; // default newest order
  });

  // Handle Save New Album
  const handleCreateAlbum = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAlbumName.trim()) return;

    const slug = newAlbumSlug.trim() || newAlbumName.toLowerCase().replace(/[^a-z0-9]/g, '-');
    const newAlbum: CloudAlbum = {
      id: `alb-${Date.now()}`,
      name: newAlbumName.trim(),
      slug,
      eventCategory: newAlbumCategory,
      mediaCount: 0,
      totalSizeMb: 0,
      downloadCount: 0,
      coverUrl: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=600&auto=format&fit=crop&q=80',
      venue: newAlbumVenue.trim() || 'Venue Mitra',
      eventDate: newAlbumDate,
      isLocked: false,
    };

    setAlbums([newAlbum, ...albums]);
    setIsNewAlbumDrawerOpen(false);
    setNewAlbumName('');
    setNewAlbumVenue('');
    setNewAlbumSlug('');
    showToast(`Album "${newAlbum.name}" berhasil dibuat!`);
  };

  // Copy Link Handler
  const handleCopyLink = (url: string) => {
    navigator.clipboard.writeText(url);
    showToast('Link portal tamu disalin ke clipboard!');
  };

  return (
    <div className="space-y-6 font-sora animate-fade-in text-gray-900 pb-16">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-3 bg-gray-900 text-white text-xs font-semibold rounded-2xl shadow-xl border border-gray-800 animate-slide-up">
          <CheckCircle2 className="w-4 h-4 text-[#DE5795]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* TOP HEADER SECTION (Untitled UI Pattern) */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-200 pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
            <span>PhotoBooth OS</span>
            <span>•</span>
            <span className="text-[#DE5795]">{language === 'en' ? 'Content & Media' : 'Konten & Media'}</span>
            <span>•</span>
            <span>{language === 'en' ? 'Cloud Gallery' : 'Galeri Cloud'}</span>
          </div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl font-bold tracking-tight text-gray-900 font-sora">
              {t('gallery.title', undefined, 'Galeri Tamu & Cloud Delivery')}
            </h1>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-pink-50 text-[#9D174D] border border-pink-200">
              <Cloud className="w-3 h-3 text-[#DE5795]" />
              Cloud S3 Live
            </span>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            {t('gallery.subtitle', undefined, 'Penyimpanan media cloud resolusi tinggi, portal download QR code tamu, dan arsip album foto event.')}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => showToast(language === 'en' ? 'Compressing event archive... ZIP download starting!' : 'Mengompres arsip event... Unduhan ZIP 142 foto segera dimulai!')}
            className="px-4 py-2.5 rounded-xl border border-gray-200/90 bg-white text-xs font-semibold text-gray-700 hover:bg-gray-50 transition-colors shadow-2xs flex items-center gap-2"
          >
            <FileArchive className="w-4 h-4 text-gray-500" />
            <span>{language === 'en' ? 'Download All Event ZIP' : 'Unduh Semua ZIP Event'}</span>
          </button>

          <button
            type="button"
            onClick={() => setIsNewAlbumDrawerOpen(true)}
            className="px-4.5 py-2.5 rounded-xl bg-[#DE5795] text-white text-xs font-bold hover:bg-[#c93d7e] transition-all border border-[#DE5795] shadow-xs flex items-center gap-2 active:scale-98"
          >
            <FolderPlus className="w-4 h-4 text-white" />
            <span>{language === 'en' ? '+ Create New Event Album' : '+ Buat Album Event Baru'}</span>
          </button>
        </div>
      </div>

      {/* METRIC STRIP CARDS (Zendenta / Untitled UI Style) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Total Media Cloud */}
        <div className="p-5 rounded-2xl bg-white border border-gray-200/90 shadow-2xs space-y-2 hover:border-gray-300 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-500">{language === 'en' ? 'Total Cloud Media' : 'Total Media Cloud'}</span>
            <div className="w-8 h-8 rounded-xl bg-pink-50 text-[#DE5795] flex items-center justify-center">
              <Images className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-gray-900 tracking-tight">2.840</span>
            <span className="text-xs font-medium text-gray-500">{language === 'en' ? 'Files Stored' : 'File Tersimpan'}</span>
          </div>
          <div className="flex items-center gap-1.5 text-[11px] text-gray-500 pt-1 border-t border-gray-100">
            <HardDrive className="w-3.5 h-3.5 text-[#DE5795]" />
            <span>{language === 'en' ? '14.2 GB / 50 GB Cloud Quota' : '14.2 GB / 50 GB Kuota Cloud'}</span>
          </div>
        </div>

        {/* Card 2: Download Sesi Tamu */}
        <div className="p-5 rounded-2xl bg-white border border-gray-200/90 shadow-2xs space-y-2 hover:border-gray-300 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-500">{language === 'en' ? 'Guest Downloads' : 'Download oleh Tamu'}</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Download className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-gray-900 tracking-tight">1.928</span>
            <span className="text-xs font-bold text-emerald-600">{language === 'en' ? '+18% vs last week' : '+18% vs mgg lalu'}</span>
          </div>
          <div className="flex items-center gap-1.5 text-[11px] text-gray-500 pt-1 border-t border-gray-100">
            <QrCode className="w-3.5 h-3.5 text-emerald-600" />
            <span>{language === 'en' ? '68% guests scanned receipt QR' : '68% tamu langsung scan QR di struk'}</span>
          </div>
        </div>

        {/* Card 3: Album Event Aktif */}
        <div className="p-5 rounded-2xl bg-white border border-gray-200/90 shadow-2xs space-y-2 hover:border-gray-300 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-500">{language === 'en' ? 'Archived Event Albums' : 'Album Event Terarsip'}</span>
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Calendar className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-gray-900 tracking-tight">{albums.length}</span>
            <span className="text-xs font-medium text-gray-500">{language === 'en' ? 'Active Albums' : 'Album Aktif'}</span>
          </div>
          <div className="flex items-center gap-1.5 text-[11px] text-gray-500 pt-1 border-t border-gray-100">
            <Flame className="w-3.5 h-3.5 text-amber-500" />
            <span>{language === 'en' ? '3 Events taking place this week' : '3 Event berlangsung minggu ini'}</span>
          </div>
        </div>

        {/* Card 4: Status CDN & Link Tamu */}
        <div className="p-5 rounded-2xl bg-white border border-gray-200/90 shadow-2xs space-y-2 hover:border-gray-300 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-500">{language === 'en' ? 'Guest Portal & CDN' : 'Portal Tamu & CDN'}</span>
            <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <Globe className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-gray-900 tracking-tight">99.98%</span>
            <span className="text-xs font-bold text-emerald-600">Online Uptime</span>
          </div>
          <div className="flex items-center gap-1.5 text-[11px] text-gray-500 pt-1 border-t border-gray-100">
            <ShieldCheck className="w-3.5 h-3.5 text-purple-600" />
            <span className="truncate">photos.photobooth.os (SSL)</span>
          </div>
        </div>
      </div>

      {/* CLOUD STORAGE STATUS & BREAKDOWN BAR */}
      <div className="p-4 rounded-2xl bg-white border border-gray-200/90 shadow-2xs flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex-1 w-full space-y-1.5">
          <div className="flex items-center justify-between text-xs font-semibold">
            <span className="text-gray-700 flex items-center gap-1.5">
              <Cloud className="w-4 h-4 text-[#DE5795]" />
              {language === 'en' ? 'Cloudflare R2 / AWS S3 Cloud Storage Capacity' : 'Kapasitas Penyimpanan Cloudflare R2 / AWS S3'}
            </span>
            <span className="text-gray-900 font-mono">14.2 GB / 50.0 GB ({language === 'en' ? '28.4% Used' : '28.4% Terpakai'})</span>
          </div>
          {/* Multi-segmented Progress Bar */}
          <div className="w-full h-2.5 rounded-full bg-gray-100 overflow-hidden flex">
            <div className="bg-[#DE5795] h-full" style={{ width: '18.8%' }} title={language === 'en' ? 'Original HD Prints (9.4 GB)' : 'Foto Cetak Asli HD (9.4 GB)'} />
            <div className="bg-pink-300 h-full" style={{ width: '6.4%' }} title={language === 'en' ? 'Animated GIFs & Video (3.2 GB)' : 'Animasi GIF & Video (3.2 GB)'} />
            <div className="bg-emerald-400 h-full" style={{ width: '3.2%' }} title={language === 'en' ? 'Thumbnails & Receipt QRs (1.6 GB)' : 'Thumbnail & QR Struk (1.6 GB)'} />
          </div>
          <div className="flex items-center gap-4 text-[11px] text-gray-500 pt-0.5">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#DE5795]" />
              {language === 'en' ? 'HD Photos (9.4 GB)' : 'Foto HD (9.4 GB)'}
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-pink-300" />
              {language === 'en' ? 'Animated GIF (3.2 GB)' : 'GIF Animasi (3.2 GB)'}
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              {language === 'en' ? 'Thumbnails & QR (1.6 GB)' : 'Thumbnail & QR (1.6 GB)'}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={() => showToast(language === 'en' ? 'Cloudflare R2 CDN synchronization complete!' : 'Sinkronisasi CDN Cloudflare R2 selesai!')}
            className="px-3.5 py-2 rounded-xl border border-gray-200/90 bg-gray-50 text-xs font-semibold text-gray-700 hover:bg-gray-100 transition-colors shadow-2xs flex items-center gap-1.5"
          >
            <RefreshCw className="w-3.5 h-3.5 text-gray-500" />
            <span>Sync Cloud CDN</span>
          </button>
        </div>
      </div>

      {/* HORIZONTAL ALBUM SELECTOR TABS (Zendenta Style) */}
      <div className="p-4 rounded-2xl bg-white border border-gray-200/90 shadow-2xs space-y-2.5">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold uppercase tracking-wider text-gray-500">
            {language === 'en' ? 'Select Event / Kiosk Album:' : 'Pilih Album Acara / Kios:'}
          </label>
          <span className="text-xs text-gray-400 font-medium">{albums.length} {language === 'en' ? 'Registered Albums' : 'Album Terdaftar'}</span>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          <button
            type="button"
            onClick={() => setSelectedAlbumSlug('ALL')}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all shadow-2xs ${
              selectedAlbumSlug === 'ALL'
                ? 'bg-gray-900 text-white shadow-xs'
                : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
            }`}
          >
            {language === 'en' ? 'All Albums' : 'Semua Album'} ({mediaList.length})
          </button>

          {albums.map((album) => {
            const isSelected = selectedAlbumSlug === album.slug;
            return (
              <button
                key={album.id}
                type="button"
                onClick={() => setSelectedAlbumSlug(album.slug)}
                className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all shadow-2xs flex items-center gap-2 ${
                  isSelected
                    ? 'bg-[#DE5795] text-white shadow-xs'
                    : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-300'
                }`}
              >
                <span>{album.name}</span>
                <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-mono ${
                  isSelected ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-600'
                }`}>
                  {album.mediaCount}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* SEARCH & FILTERS BAR */}
      <div className="p-4 rounded-2xl bg-white border border-gray-200/90 shadow-2xs flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Search Input */}
        <div className="relative w-full md:w-96">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder={language === 'en' ? 'Search session code (e.g. PB-SES-8821), guest name, or email...' : 'Cari kode sesi (mis: PB-SES-8821), nama tamu, atau email...'}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 text-xs bg-gray-50/70 border border-gray-200 rounded-xl text-gray-900 placeholder:text-gray-400 focus:outline-hidden focus:bg-white focus:border-[#DE5795] focus:ring-3 focus:ring-[#DE5795]/10 transition-all"
          />
        </div>

        {/* Filter Controls */}
        <div className="flex items-center gap-2 w-full md:w-auto flex-wrap justify-end">
          {/* Media Format */}
          <select
            value={selectedMediaType}
            onChange={(e) => setSelectedMediaType(e.target.value)}
            className="px-3 py-2 text-xs rounded-xl border border-gray-200 bg-white font-medium text-gray-700 focus:outline-hidden focus:border-[#DE5795]"
          >
            <option value="ALL">{language === 'en' ? 'All Media Formats' : 'Semua Format Media'}</option>
            <option value="STRIP_2X6">{language === 'en' ? 'Photo Strip 2x6 (HD)' : 'Strip Foto 2x6 (HD)'}</option>
            <option value="POSTCARD_4X6">{language === 'en' ? 'Postcard 4x6 (HD)' : 'Postcard 4x6 (HD)'}</option>
            <option value="GIF_ANIMATED">{language === 'en' ? 'Loop GIF Animation' : 'Animasi GIF Loop'}</option>
            <option value="BOOMERANG_MP4">{language === 'en' ? 'Boomerang MP4 Video' : 'Video Boomerang MP4'}</option>
          </select>

          {/* Download Status Filter */}
          <select
            value={downloadFilter}
            onChange={(e) => setDownloadFilter(e.target.value)}
            className="px-3 py-2 text-xs rounded-xl border border-gray-200 bg-white font-medium text-gray-700 focus:outline-hidden focus:border-[#DE5795]"
          >
            <option value="ALL">{language === 'en' ? 'All Download Status' : 'Semua Status Unduh'}</option>
            <option value="DOWNLOADED">{language === 'en' ? 'Downloaded by Guest' : 'Sudah Diunduh Tamu'}</option>
            <option value="NOT_DOWNLOADED">{language === 'en' ? 'Pending Download' : 'Belum Diunduh Tamu'}</option>
            <option value="PIN">{language === 'en' ? 'PIN Protected' : 'Diproteksi PIN Akses'}</option>
          </select>

          {/* Sort By */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="px-3 py-2 text-xs rounded-xl border border-gray-200 bg-white font-medium text-gray-700 focus:outline-hidden focus:border-[#DE5795]"
          >
            <option value="NEWEST">{language === 'en' ? 'Sort: Newest' : 'Waktu Terbaru'}</option>
            <option value="DOWNLOADS">{language === 'en' ? 'Sort: Most Downloaded' : 'Paling Sering Diunduh'}</option>
            <option value="SIZE">{language === 'en' ? 'Sort: Largest File Size' : 'Ukuran File Terbesar'}</option>
          </select>
        </div>
      </div>

      {/* GALLERY GRID (GUEST SESSION MEDIA ITEMS) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredMedia.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-3xl border border-gray-200/80 hover:border-pink-300 shadow-2xs hover:shadow-xl hover:shadow-pink-500/5 transition-all duration-300 overflow-hidden flex flex-col group"
          >
            {/* Media Image Thumbnail Container */}
            <div
              className="relative aspect-[16/10] bg-gray-950 overflow-hidden cursor-pointer"
              onClick={() => setMobilePreviewItem(item)}
            >
              <img
                src={item.previewUrl}
                alt={item.customerName}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
              />

              {/* Format & Protection Badges (Top Left) */}
              <div className="absolute top-3 left-3 flex items-center gap-1.5 pointer-events-none">
                <span className="px-2.5 py-1 rounded-full bg-black/65 backdrop-blur-md text-white border border-white/15 font-mono font-bold text-[10px] tracking-wider shadow-xs flex items-center gap-1.5">
                  {item.mediaType === 'STRIP_2X6' && <Film className="w-3 h-3 text-pink-400" />}
                  {item.mediaType === 'POSTCARD_4X6' && <FileImage className="w-3 h-3 text-sky-400" />}
                  {item.mediaType === 'GIF_ANIMATED' && <Sparkles className="w-3 h-3 text-amber-400" />}
                  {item.mediaType === 'BOOMERANG_MP4' && <Sparkles className="w-3 h-3 text-purple-400" />}
                  <span>{item.mediaType.replace('_', ' ')}</span>
                </span>
                {item.isPinProtected && (
                  <span className="px-2 py-1 rounded-full bg-amber-500/90 backdrop-blur-md text-white text-[10px] font-bold flex items-center gap-1 shadow-xs border border-amber-400/40">
                    <Lock className="w-2.5 h-2.5" />
                    <span>PIN</span>
                  </span>
                )}
              </div>

              {/* Download Count Pill (Top Right) */}
              <div className="absolute top-3 right-3 pointer-events-none">
                <span className="px-2.5 py-1 rounded-full bg-white/90 backdrop-blur-md text-gray-800 font-semibold text-[10px] shadow-xs flex items-center gap-1 border border-white/50">
                  <Download className="w-3 h-3 text-[#DE5795]" />
                  <span>{item.downloadCount}x Unduh</span>
                </span>
              </div>

              {/* Hover Quick Action Overlay */}
              <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center p-4">
                <span className="px-4 py-2 rounded-full bg-white/95 text-gray-900 font-bold text-xs shadow-xl backdrop-blur-md flex items-center gap-2 transform group-hover:scale-100 scale-95 transition-transform duration-200">
                  <Eye className="w-3.5 h-3.5 text-[#DE5795]" />
                  <span>Buka Portal Tamu</span>
                </span>
              </div>
            </div>

            {/* Media Card Content */}
            <div className="p-5 space-y-4 flex-1 flex flex-col justify-between">
              <div className="space-y-3">
                {/* Session ID & Time Header */}
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 rounded-lg bg-pink-50 text-[#9D174D] border border-pink-200/80 font-mono font-bold text-[11px] shadow-2xs">
                    {item.sessionCode}
                  </span>
                  <span className="text-[11px] text-gray-400 font-medium flex items-center gap-1">
                    <Clock className="w-3 h-3 text-gray-300" />
                    <span>{item.createdAt.includes('•') ? item.createdAt.split('•')[1].trim() : item.createdAt}</span>
                  </span>
                </div>

                {/* Customer Name & Event */}
                <div>
                  <h3 className="font-bold text-gray-900 text-sm leading-snug truncate group-hover:text-[#DE5795] transition-colors">
                    {item.customerName}
                  </h3>
                  <p className="text-xs text-gray-500 truncate mt-1 flex items-center gap-1.5">
                    <Store className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                    <span className="truncate">{item.eventName}</span>
                  </p>
                </div>

                {/* Key Metrics Chips (Cetak Fisik, Ukuran Cloud, Masa Aktif) */}
                <div className="grid grid-cols-3 gap-2 pt-1">
                  <div className="px-2.5 py-2 rounded-xl bg-gray-50/80 border border-gray-100 text-center">
                    <div className="text-[10px] text-gray-400 font-medium">{language === 'en' ? 'Print Copies' : 'Cetak Fisik'}</div>
                    <div className="text-xs font-bold text-gray-800 mt-0.5">{item.printCopies} {language === 'en' ? 'Sheets' : 'Lbr'}</div>
                  </div>
                  <div className="px-2.5 py-2 rounded-xl bg-gray-50/80 border border-gray-100 text-center">
                    <div className="text-[10px] text-gray-400 font-medium">{language === 'en' ? 'Cloud Size' : 'Ukuran Cloud'}</div>
                    <div className="text-xs font-bold text-gray-800 mt-0.5 font-mono">{item.fileSizeMb} MB</div>
                  </div>
                  <div className="px-2.5 py-2 rounded-xl bg-gray-50/80 border border-gray-100 text-center">
                    <div className="text-[10px] text-gray-400 font-medium">{language === 'en' ? 'Expiry' : 'Masa Aktif'}</div>
                    <div className="text-xs font-bold text-emerald-600 mt-0.5 flex items-center justify-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      <span>{item.expiryDays} {language === 'en' ? 'Days' : 'Hari'}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Refined Action Buttons Bar */}
              <div className="flex items-center gap-2 pt-2 border-t border-gray-100">
                {/* 1. Primary Button: Layar HP Tamu */}
                <button
                  type="button"
                  onClick={() => setMobilePreviewItem(item)}
                  className="flex-1 py-2 px-3 rounded-xl bg-pink-50 hover:bg-[#DE5795] text-[#9D174D] hover:text-white font-bold text-xs flex items-center justify-center gap-1.5 border border-pink-200/90 hover:border-[#DE5795] transition-all shadow-2xs group/btn active:scale-98"
                  title={language === 'en' ? 'Guest Mobile Portal Simulation' : 'Simulasi Portal Tamu (Layar HP)'}
                >
                  <Smartphone className="w-3.5 h-3.5 text-[#DE5795] group-hover/btn:text-white transition-colors" />
                  <span>{language === 'en' ? 'Mobile View' : 'Layar HP'}</span>
                </button>

                {/* 2. QR Code Popover */}
                <button
                  type="button"
                  onClick={() => setQrModalItem(item)}
                  className="p-2 rounded-xl bg-gray-50 hover:bg-gray-100 border border-gray-200 text-gray-700 hover:text-gray-900 transition-colors shadow-2xs active:scale-95"
                  title="Tampilkan QR Code Tamu"
                >
                  <QrCode className="w-4 h-4 text-gray-600" />
                </button>

                {/* 3. Copy Direct Link */}
                <button
                  type="button"
                  onClick={() => handleCopyLink(item.portalUrl)}
                  className="p-2 rounded-xl bg-gray-50 hover:bg-gray-100 border border-gray-200 text-gray-700 hover:text-gray-900 transition-colors shadow-2xs active:scale-95"
                  title="Salin Link Download Tamu"
                >
                  <Copy className="w-4 h-4 text-gray-600" />
                </button>

                {/* 4. Open Settings Slide-over Drawer */}
                <button
                  type="button"
                  onClick={() => setActiveMediaDetail(item)}
                  className="p-2 rounded-xl bg-gray-50 hover:bg-[#DE5795]/15 border border-gray-200 hover:border-pink-300 text-gray-700 hover:text-[#9D174D] transition-colors shadow-2xs active:scale-95"
                  title="Konfigurasi Media & Log Download"
                >
                  <Sliders className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ============================================================ */}
      {/* DRAWER 1: FLOATING SLIDE-OVER MEDIA DETAIL & CLOUD SETTINGS  */}
      {/* ============================================================ */}
      {mounted && activeMediaDetail && createPortal(
        <div className="fixed inset-0 z-[999] overflow-hidden font-sora">
          {/* Backdrop with smooth blur covering full viewport */}
          <div
            className="fixed inset-0 bg-gray-950/60 backdrop-blur-xs transition-opacity animate-fade-in"
            onClick={() => setActiveMediaDetail(null)}
          />

          <div className="fixed inset-y-0 right-0 max-w-full flex pl-6 sm:pl-10 p-3 sm:p-4 pointer-events-none z-[1000]">
            <div className="w-screen max-w-2xl bg-white shadow-2xl border border-gray-100 rounded-3xl flex flex-col animate-slide-left overflow-hidden ring-1 ring-black/10 pointer-events-auto h-full">
              {/* Drawer Header */}
              <div className="px-7 sm:px-8 py-5 sm:py-6 border-b border-gray-100 flex items-center justify-between bg-white shrink-0">
                <div className="flex items-center gap-3.5 sm:gap-4 min-w-0">
                  <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-pink-500/15 to-[#DE5795]/20 border border-[#DE5795]/30 flex items-center justify-center text-[#9D174D] shadow-xs shrink-0">
                    <Images className="w-5 h-5 text-[#DE5795]" />
                  </div>
                  <div className="min-w-0 pr-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-base font-bold text-gray-900 leading-tight">
                        Detail Media Cloud & Portal
                      </h3>
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider font-mono border bg-pink-50 text-[#9D174D] border-pink-200 shadow-2xs">
                        {activeMediaDetail.sessionCode}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1.5 truncate">
                      Atur proteksi PIN, masa kedaluwarsa link download, watermark, dan pantau log unduhan tamu
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveMediaDetail(null)}
                  className="w-9 h-9 rounded-xl text-gray-400 hover:text-gray-700 hover:bg-gray-100 border border-gray-200/80 transition-all flex items-center justify-center shrink-0 ml-4 shadow-2xs"
                  title="Tutup (Esc)"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Drawer Body (px-8 py-6) */}
              <div className="px-8 py-6 overflow-y-auto flex-1 space-y-6 text-xs">
                {/* 1. Preview Media & Quick Links Card */}
                <div className="p-4.5 rounded-2xl bg-gray-50/80 border border-gray-200/80 space-y-4">
                  <div className="flex flex-col sm:flex-row gap-4 items-center">
                    <img
                      src={activeMediaDetail.previewUrl}
                      alt={activeMediaDetail.sessionCode}
                      className="w-32 h-32 rounded-2xl object-cover border border-gray-200 shadow-xs shrink-0"
                    />
                    <div className="space-y-1.5 flex-1 min-w-0">
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Informasi Sesi Tamu</span>
                      <h4 className="font-bold text-gray-900 text-sm truncate">{activeMediaDetail.customerName}</h4>
                      <p className="text-xs text-gray-500 truncate">{activeMediaDetail.eventName}</p>
                      <p className="text-[11px] text-gray-500 font-mono">
                        {activeMediaDetail.boothName} • {activeMediaDetail.fileSizeMb} MB
                      </p>
                      <div className="flex items-center gap-2 pt-1">
                        <button
                          type="button"
                          onClick={() => {
                            setActiveMediaDetail(null);
                            setMobilePreviewItem(activeMediaDetail);
                          }}
                          className="px-3 py-1.5 rounded-xl bg-gray-900 text-white text-xs font-semibold hover:bg-black transition-colors flex items-center gap-1.5 shadow-2xs"
                        >
                          <Smartphone className="w-3.5 h-3.5 text-[#DE5795]" />
                          <span>Simulasi HP Tamu</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => handleCopyLink(activeMediaDetail.portalUrl)}
                          className="px-3 py-1.5 rounded-xl border border-gray-200 bg-white text-gray-700 text-xs font-semibold hover:bg-gray-50 transition-colors flex items-center gap-1.5 shadow-2xs"
                        >
                          <Copy className="w-3.5 h-3.5 text-gray-500" />
                          <span>Salin Link</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 2. Cloud Settings Form */}
                <div className="space-y-4">
                  <span className="text-[11px] font-bold text-gray-700 uppercase tracking-wider block">
                    Konfigurasi Hak Akses Tamu
                  </span>

                  {/* Masa Kedaluwarsa Selector */}
                  <div className="space-y-1.5">
                    <label className="font-semibold text-gray-700 block">Masa Berlaku Link Download</label>
                    <div className="grid grid-cols-4 gap-2">
                      {[7, 14, 30, 90].map((days) => (
                        <button
                          key={days}
                          type="button"
                          onClick={() => {
                            setActiveMediaDetail({ ...activeMediaDetail, expiryDays: days });
                            showToast(`Masa aktif diubah ke ${days} hari`);
                          }}
                          className={`py-2 rounded-xl text-xs font-semibold border transition-all ${
                            activeMediaDetail.expiryDays === days
                              ? 'border-[#DE5795] bg-[#DE5795]/10 text-[#9D174D] font-bold shadow-2xs'
                              : 'border-gray-200 bg-white text-gray-600 hover:bg-gray-50'
                          }`}
                        >
                          {days} Hari
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Proteksi PIN Switch */}
                  <div className="p-3.5 rounded-2xl border border-gray-200/90 bg-white flex items-center justify-between">
                    <div>
                      <span className="font-bold text-gray-900 block">Kunci dengan PIN Keamanan</span>
                      <p className="text-[11px] text-gray-500 mt-0.5">
                        Tamu harus memasukkan 4-digit PIN sebelum dapat melihat & mengunduh foto
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        const updated = !activeMediaDetail.isPinProtected;
                        setActiveMediaDetail({
                          ...activeMediaDetail,
                          isPinProtected: updated,
                          pinCode: updated ? '2026' : undefined,
                        });
                        showToast(updated ? 'Proteksi PIN aktif (Default: 2026)' : 'Proteksi PIN dinonaktifkan');
                      }}
                      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${
                        activeMediaDetail.isPinProtected ? 'bg-[#DE5795]' : 'bg-gray-200'
                      }`}
                    >
                      <span
                        className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                          activeMediaDetail.isPinProtected ? 'translate-x-5' : 'translate-x-0'
                        }`}
                      />
                    </button>
                  </div>

                  {/* Watermark Switch */}
                  <div className="p-3.5 rounded-2xl border border-gray-200/90 bg-white flex items-center justify-between">
                    <div>
                      <span className="font-bold text-gray-900 block">Watermark Branding Acara</span>
                      <p className="text-[11px] text-gray-500 mt-0.5">
                        Sisipkan logo pengantin / sponsor di pojok bawah foto digital hasil download
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setActiveMediaDetail({
                          ...activeMediaDetail,
                          isWatermarked: !activeMediaDetail.isWatermarked,
                        });
                        showToast('Pengaturan watermark diperbarui');
                      }}
                      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${
                        activeMediaDetail.isWatermarked ? 'bg-[#DE5795]' : 'bg-gray-200'
                      }`}
                    >
                      <span
                        className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                          activeMediaDetail.isWatermarked ? 'translate-x-5' : 'translate-x-0'
                        }`}
                      />
                    </button>
                  </div>
                </div>

                {/* 3. Log Akses Unduhan Tamu (Telemetry) */}
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-gray-700 uppercase tracking-wider flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-[#DE5795]" />
                      Riwayat Log Unduhan Tamu (Live Audit)
                    </span>
                    <span className="text-[11px] text-gray-400 font-mono">{SAMPLE_LOGS.length} Log</span>
                  </div>

                  <div className="border border-gray-200/80 rounded-2xl divide-y divide-gray-100 overflow-hidden bg-white">
                    {SAMPLE_LOGS.map((log) => (
                      <div key={log.id} className="p-3 flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                          <div className="w-7 h-7 rounded-lg bg-gray-100 flex items-center justify-center text-gray-600">
                            {log.deviceType === 'iPhone' ? (
                              <Smartphone className="w-3.5 h-3.5" />
                            ) : (
                              <Download className="w-3.5 h-3.5" />
                            )}
                          </div>
                          <div>
                            <span className="font-bold text-gray-900 block">{log.downloadItem}</span>
                            <span className="text-[10px] text-gray-400">
                              {log.deviceType} • IP: {log.ipAddress}
                            </span>
                          </div>
                        </div>
                        <span className="text-[10px] font-mono text-gray-400">{log.timestamp}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Drawer Footer (Clean, dedicated flex item, shrink-0, not sticky) */}
              <div className="px-7 sm:px-8 py-4 sm:py-5 border-t border-gray-100 bg-gray-50/90 flex items-center justify-between gap-3 shrink-0">
                <span className="text-[11px] text-gray-400 hidden sm:inline">
                  Tekan <kbd className="px-1.5 py-0.5 rounded bg-white border border-gray-200 font-mono text-[10px] text-gray-500 shadow-2xs">ESC</kbd> untuk menutup
                </span>
                <div className="flex items-center gap-2.5">
                  <button
                    type="button"
                    onClick={() => setActiveMediaDetail(null)}
                    className="px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-xs font-semibold text-gray-700 hover:bg-gray-100 transition-colors shadow-2xs"
                  >
                    Tutup
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setActiveMediaDetail(null);
                      showToast('Pengaturan cloud sesi berhasil disimpan!');
                    }}
                    className="px-5 py-2.5 rounded-xl bg-[#DE5795] text-white text-xs font-bold hover:bg-[#c93d7e] transition-all border border-[#DE5795] shadow-xs flex items-center gap-2 active:scale-98"
                  >
                    <Check className="w-4 h-4 text-white" />
                    <span>Simpan Pengaturan Cloud</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* ============================================================ */}
      {/* DRAWER 2: FLOATING SLIDE-OVER BUAT ALBUM EVENT BARU          */}
      {/* ============================================================ */}
      {mounted && isNewAlbumDrawerOpen && createPortal(
        <div className="fixed inset-0 z-[999] overflow-hidden font-sora">
          {/* Backdrop with smooth blur covering full viewport */}
          <div
            className="fixed inset-0 bg-gray-950/60 backdrop-blur-xs transition-opacity animate-fade-in"
            onClick={() => setIsNewAlbumDrawerOpen(false)}
          />

          <div className="fixed inset-y-0 right-0 max-w-full flex pl-6 sm:pl-10 p-3 sm:p-4 pointer-events-none z-[1000]">
            <div className="w-screen max-w-xl bg-white shadow-2xl border border-gray-100 rounded-3xl flex flex-col animate-slide-left overflow-hidden ring-1 ring-black/10 pointer-events-auto h-full">
              {/* Drawer Header */}
              <div className="px-7 sm:px-8 py-5 sm:py-6 border-b border-gray-100 flex items-center justify-between bg-white shrink-0">
                <div className="flex items-center gap-3.5 sm:gap-4 min-w-0">
                  <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-pink-500/15 to-[#DE5795]/20 border border-[#DE5795]/30 flex items-center justify-center text-[#9D174D] shadow-xs shrink-0">
                    <FolderPlus className="w-5 h-5 text-[#DE5795]" />
                  </div>
                  <div className="min-w-0 pr-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-base font-bold text-gray-900 leading-tight">
                        Buat Album Event Baru
                      </h3>
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-pink-50 text-[#9D174D] border border-pink-200 shadow-2xs font-mono">
                        Album Cloud
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1 truncate">
                      Buat wadah galeri khusus untuk event pernikahan, gathering, atau booth mall
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setIsNewAlbumDrawerOpen(false)}
                  className="w-9 h-9 rounded-xl text-gray-400 hover:text-gray-700 hover:bg-gray-100 border border-gray-200/80 transition-all flex items-center justify-center shrink-0 ml-4 shadow-2xs"
                  title="Tutup (Esc)"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Form Body (px-8 py-6) */}
              <form onSubmit={handleCreateAlbum} className="flex-1 flex flex-col min-h-0">
                <div className="px-8 py-6 overflow-y-auto flex-1 space-y-5 text-xs">
                  {/* Kategori Event */}
                  <div className="space-y-1.5">
                    <label className="font-semibold text-gray-700 block">Kategori Acara</label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {(['Wedding', 'Corporate', 'Birthday', 'Mall Kiosk'] as const).map((cat) => (
                        <button
                          key={cat}
                          type="button"
                          onClick={() => setNewAlbumCategory(cat)}
                          className={`py-2 rounded-xl text-xs font-semibold border transition-all ${
                            newAlbumCategory === cat
                              ? 'border-[#DE5795] bg-[#DE5795]/10 text-[#9D174D] font-bold shadow-2xs'
                              : 'border-gray-200 bg-white text-gray-600 hover:bg-gray-50'
                          }`}
                        >
                          {cat}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Nama Album */}
                  <div className="space-y-1.5">
                    <label className="font-semibold text-gray-700 block">Nama Album Event *</label>
                    <input
                      type="text"
                      required
                      placeholder="Contoh: The Wedding of Clarissa & Kevin"
                      value={newAlbumName}
                      onChange={(e) => {
                        setNewAlbumName(e.target.value);
                        if (!newAlbumSlug) {
                          setNewAlbumSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]/g, '-'));
                        }
                      }}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 focus:outline-hidden focus:border-[#DE5795] bg-white text-xs"
                    />
                  </div>

                  {/* URL Slug */}
                  <div className="space-y-1.5">
                    <label className="font-semibold text-gray-700 block">Custom URL Slug Tamu</label>
                    <div className="flex items-center rounded-xl border border-gray-200 bg-gray-50 overflow-hidden focus-within:border-[#DE5795]">
                      <span className="px-3 text-gray-400 font-mono text-[11px] border-r border-gray-200 bg-gray-100">
                        photos.photobooth.os/e/
                      </span>
                      <input
                        type="text"
                        value={newAlbumSlug}
                        onChange={(e) => setNewAlbumSlug(e.target.value)}
                        placeholder="clarissa-kevin"
                        className="w-full px-3 py-2 text-xs bg-white focus:outline-hidden font-mono"
                      />
                    </div>
                  </div>

                  {/* Lokasi Venue & Tanggal */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <label className="font-semibold text-gray-700 block">Nama Gedung / Lokasi</label>
                      <input
                        type="text"
                        placeholder="Contoh: Ayana Midplaza Jakarta"
                        value={newAlbumVenue}
                        onChange={(e) => setNewAlbumVenue(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 focus:outline-hidden focus:border-[#DE5795] bg-white text-xs"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="font-semibold text-gray-700 block">Tanggal Acara</label>
                      <input
                        type="text"
                        value={newAlbumDate}
                        onChange={(e) => setNewAlbumDate(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 focus:outline-hidden focus:border-[#DE5795] bg-white text-xs"
                      />
                    </div>
                  </div>

                  {/* Cloud CDN info note */}
                  <div className="p-3.5 rounded-2xl bg-pink-50/60 border border-pink-200/80 flex items-start gap-2.5">
                    <Sparkles className="w-4 h-4 text-[#DE5795] shrink-0 mt-0.5" />
                    <p className="text-[11px] text-[#9D174D] leading-relaxed">
                      Album akan secara otomatis tersinkronisasi dengan CDN Cloudflare R2 dan siap menampung ribuan foto berkecepatan tinggi tanpa batasan bandwidth.
                    </p>
                  </div>
                </div>

                {/* Drawer Footer */}
                <div className="px-7 sm:px-8 py-4 sm:py-5 border-t border-gray-100 bg-gray-50/90 flex items-center justify-between gap-3 shrink-0">
                  <span className="text-[11px] text-gray-400 hidden sm:inline">
                    Tekan <kbd className="px-1.5 py-0.5 rounded bg-white border border-gray-200 font-mono text-[10px] text-gray-500 shadow-2xs">ESC</kbd> untuk membatalkan
                  </span>
                  <div className="flex items-center gap-2.5 ml-auto">
                    <button
                      type="button"
                      onClick={() => setIsNewAlbumDrawerOpen(false)}
                      className="px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-xs font-semibold text-gray-700 hover:bg-gray-100 transition-colors shadow-2xs"
                    >
                      Batal
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2.5 rounded-xl bg-[#DE5795] text-white text-xs font-bold hover:bg-[#c93d7e] transition-all border border-[#DE5795] shadow-xs flex items-center gap-2 active:scale-98"
                    >
                      <FolderPlus className="w-4 h-4 text-white" />
                      <span>Buat Album Sekarang</span>
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* ============================================================ */}
      {/* MODAL 3: SIMULASI PORTAL LAYAR HP TAMU (GUEST SMARTPHONE UI) */}
      {/* ============================================================ */}
      {mounted && mobilePreviewItem && createPortal(
        <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 font-sora">
          <div
            className="fixed inset-0 bg-gray-950/60 backdrop-blur-xs transition-opacity animate-fade-in"
            onClick={() => setMobilePreviewItem(null)}
          />
          <div className="relative z-[1000] w-full max-w-sm rounded-[40px] bg-gray-900 p-3 shadow-2xl border-4 border-gray-800 text-white flex flex-col overflow-hidden max-h-[92vh] animate-slide-up">
            {/* Top Phone Speaker / Dynamic Island Mockup */}
            <div className="h-6 w-full flex items-center justify-between px-6 pt-1 select-none">
              <span className="text-[10px] font-semibold text-gray-400">09:41</span>
              <div className="w-20 h-4 rounded-full bg-black mx-auto" />
              <div className="flex items-center gap-1 text-[10px] text-gray-400">5G</div>
            </div>

            {/* Inner Phone Screen Content */}
            <div className="bg-white rounded-[32px] overflow-y-auto flex-1 text-gray-900 p-4 space-y-4 my-1">
              {/* Event Header in Mobile Screen */}
              <div className="text-center pt-2 space-y-1">
                <span className="px-2.5 py-0.5 rounded-full bg-pink-50 text-[#9D174D] border border-pink-200 text-[10px] font-bold">
                  PhotoBooth OS Guest Portal
                </span>
                <h3 className="text-sm font-extrabold text-gray-900 mt-1">
                  {mobilePreviewItem.eventName}
                </h3>
                <p className="text-[11px] text-gray-500 font-mono">
                  Sesi: {mobilePreviewItem.sessionCode}
                </p>
              </div>

              {/* Photo Strip Frame Mockup */}
              <div className="rounded-2xl border-4 border-white shadow-xl overflow-hidden bg-gray-100 mx-auto max-w-[240px]">
                <img
                  src={mobilePreviewItem.highResUrl}
                  alt="Guest Preview"
                  className="w-full object-cover"
                />
              </div>

              {/* Download Buttons for Guest */}
              <div className="space-y-2 pt-1">
                <button
                  type="button"
                  onClick={() => showToast('Simulasi unduhan foto cetak HD berhasil!')}
                  className="w-full py-2.5 rounded-xl bg-[#DE5795] text-white font-bold text-xs hover:bg-[#c93d7e] transition-colors shadow-xs flex items-center justify-center gap-2"
                >
                  <Download className="w-4 h-4 text-white" />
                  <span>Unduh Foto Cetak HD (Original)</span>
                </button>

                {mobilePreviewItem.gifUrl && (
                  <button
                    type="button"
                    onClick={() => showToast('Simulasi unduhan animasi GIF berhasil!')}
                    className="w-full py-2.5 rounded-xl border border-gray-200 bg-gray-50 hover:bg-gray-100 font-semibold text-xs text-gray-800 transition-colors flex items-center justify-center gap-2"
                  >
                    <Sparkles className="w-4 h-4 text-purple-600" />
                    <span>Unduh Animasi GIF Loop</span>
                  </button>
                )}

                {/* Social Share Grid */}
                <div className="grid grid-cols-2 gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => showToast('Simulasi share Instagram Story')}
                    className="py-2 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold text-[11px] flex items-center justify-center gap-1.5 shadow-2xs"
                  >
                    <Share2 className="w-3.5 h-3.5" />
                    <span>IG Story</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => showToast('Simulasi kirim WhatsApp')}
                    className="py-2 rounded-xl bg-emerald-600 text-white font-semibold text-[11px] flex items-center justify-center gap-1.5 shadow-2xs"
                  >
                    <Share2 className="w-3.5 h-3.5" />
                    <span>WhatsApp</span>
                  </button>
                </div>
              </div>

              <p className="text-[10px] text-gray-400 text-center leading-tight">
                Masa aktif file ini berlaku hingga 30 hari ke depan. Disimpan aman oleh PhotoBooth OS.
              </p>
            </div>

            {/* Bottom Close Button */}
            <div className="pt-2 pb-1 text-center">
              <button
                type="button"
                onClick={() => setMobilePreviewItem(null)}
                className="w-full py-2 rounded-xl bg-gray-800 hover:bg-gray-700 text-gray-200 text-xs font-semibold transition-colors"
              >
                Tutup Simulasi HP
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* ============================================================ */}
      {/* MODAL 4: QR CODE POPUP MODAL UNTUK DI-SCAN TAMU             */}
      {/* ============================================================ */}
      {mounted && qrModalItem && createPortal(
        <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 font-sora">
          <div
            className="fixed inset-0 bg-gray-950/60 backdrop-blur-xs transition-opacity animate-fade-in"
            onClick={() => setQrModalItem(null)}
          />
          <div className="relative z-[1000] w-full max-w-sm rounded-3xl bg-white p-6 shadow-2xl border border-gray-100 text-center space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div className="flex items-center gap-2">
                <QrCode className="w-5 h-5 text-[#DE5795]" />
                <h3 className="font-bold text-gray-900 text-sm">Scan QR Code Unduh Tamu</h3>
              </div>
              <button
                type="button"
                onClick={() => setQrModalItem(null)}
                className="w-7 h-7 rounded-lg text-gray-400 hover:text-gray-700 flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Big Scannable QR Code */}
            <div className="p-4 bg-gray-50 rounded-2xl border border-gray-200 inline-block shadow-inner mx-auto">
              <img
                src={qrModalItem.qrCodeUrl}
                alt="QR Code Tamu"
                className="w-56 h-56 mx-auto rounded-xl"
              />
            </div>

            <div>
              <p className="font-mono font-bold text-sm text-gray-900">{qrModalItem.sessionCode}</p>
              <p className="text-xs text-gray-500 mt-0.5 truncate">{qrModalItem.customerName}</p>
              <p className="text-[11px] text-gray-400 mt-1 font-mono break-all">{qrModalItem.portalUrl}</p>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button
                type="button"
                onClick={() => handleCopyLink(qrModalItem.portalUrl)}
                className="flex-1 py-2.5 rounded-xl border border-gray-200 bg-gray-50 hover:bg-gray-100 text-xs font-semibold text-gray-700 transition-colors flex items-center justify-center gap-1.5"
              >
                <Copy className="w-3.5 h-3.5 text-gray-500" />
                <span>Salin Link</span>
              </button>
              <button
                type="button"
                onClick={() => setQrModalItem(null)}
                className="flex-1 py-2.5 rounded-xl bg-gray-900 text-white text-xs font-bold hover:bg-black transition-colors"
              >
                Selesai
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
