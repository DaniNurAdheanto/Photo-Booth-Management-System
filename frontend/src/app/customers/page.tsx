'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { createPortal } from 'react-dom';
import {
  Users,
  Search,
  Filter,
  Plus,
  ArrowUpRight,
  Calendar,
  Phone,
  Mail,
  Crown,
  ChevronRight,
  X,
  Send,
  Store,
  Film,
  Camera,
  TrendingUp,
  Award,
  AlertCircle,
  Download,
  MapPin,
  Sparkles,
  MessageCircle,
  Clock,
  Heart,
  CheckCircle2,
  FileSpreadsheet,
  UserCheck,
  History,
  ShoppingBag,
} from 'lucide-react';
import { mockCustomers } from '@/features/customers/data/customer.mock';
import {
  Customer,
  CustomerSegment,
  CustomerSessionHistory,
} from '@/features/customers/types/customer.types';

// Helper to format currency
const formatRupiah = (val: number) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(val);
};

export default function CustomersPage() {
  const [customersList, setCustomersList] = useState<Customer[]>(mockCustomers);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSegmentFilter, setSelectedSegmentFilter] = useState<string>('ALL');
  const [selectedBoothFilter, setSelectedBoothFilter] = useState<string>('ALL');
  const [sortBy, setSortBy] = useState<'NEWEST' | 'SPENT_DESC' | 'SESSIONS_DESC' | 'NAME_ASC'>('NEWEST');

  // Drawers state
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [isCustomerDrawerOpen, setIsCustomerDrawerOpen] = useState(false);
  const [isAddCustomerOpen, setIsAddCustomerOpen] = useState(false);
  const [isQuickWADrawerOpen, setIsQuickWADrawerOpen] = useState(false);
  const [quickWACustomer, setQuickWACustomer] = useState<Customer | null>(null);
  const [waCustomMessage, setWaCustomMessage] = useState<string>('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Add Customer Form state
  const [newCustomerForm, setNewCustomerForm] = useState({
    name: '',
    phone: '',
    email: '',
    city: 'Jakarta Selatan',
    birthDate: '',
    segment: 'NEW' as CustomerSegment,
    favoriteBooth: 'Grand Indonesia (Booth Alpha)',
    favoriteTemplate: 'Y2K Retro Cyber Hologram',
    notes: '',
  });

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Filtered & Sorted Customers
  const filteredCustomers = useMemo(() => {
    return customersList
      .filter((cust) => {
        // Search
        const query = searchQuery.toLowerCase();
        const matchesSearch =
          cust.name.toLowerCase().includes(query) ||
          cust.phone.toLowerCase().includes(query) ||
          cust.email.toLowerCase().includes(query) ||
          (cust.city && cust.city.toLowerCase().includes(query));

        // Segment filter
        const matchesSegment =
          selectedSegmentFilter === 'ALL' || cust.segment === selectedSegmentFilter;

        // Booth filter
        const matchesBooth =
          selectedBoothFilter === 'ALL' || cust.favoriteBooth.includes(selectedBoothFilter);

        return matchesSearch && matchesSegment && matchesBooth;
      })
      .sort((a, b) => {
        if (sortBy === 'SPENT_DESC') return b.totalSpent - a.totalSpent;
        if (sortBy === 'SESSIONS_DESC') return b.totalSessions - a.totalSessions;
        if (sortBy === 'NAME_ASC') return a.name.localeCompare(b.name);
        return 0; // Default NEWEST
      });
  }, [customersList, searchQuery, selectedSegmentFilter, selectedBoothFilter, sortBy]);

  // Segment Counts
  const segmentCounts = useMemo(() => {
    return {
      ALL: customersList.length,
      VIP: customersList.filter((c) => c.segment === 'VIP').length,
      REGULAR: customersList.filter((c) => c.segment === 'REGULAR').length,
      NEW: customersList.filter((c) => c.segment === 'NEW').length,
      INACTIVE: customersList.filter((c) => c.segment === 'INACTIVE').length,
    };
  }, [customersList]);

  // KPI Calculations
  const totalSpentAll = useMemo(() => {
    return customersList.reduce((acc, c) => acc + c.totalSpent, 0);
  }, [customersList]);

  const avgSessions = useMemo(() => {
    if (customersList.length === 0) return 0;
    const total = customersList.reduce((acc, c) => acc + c.totalSessions, 0);
    return (total / customersList.length).toFixed(1);
  }, [customersList]);

  // Open Customer Detail Drawer
  const handleOpenDetail = (customer: Customer) => {
    setSelectedCustomer(customer);
    setIsCustomerDrawerOpen(true);
  };

  // Open Quick WhatsApp Modal
  const handleOpenQuickWA = (customer: Customer, e?: React.MouseEvent) => {
    e?.stopPropagation();
    setQuickWACustomer(customer);
    setWaCustomMessage(
      `Halo Kak ${customer.name}! Terima kasih telah berfoto di Booth ${customer.favoriteBooth}. Kami memiliki koleksi frame & template aesthetic terbaru minggu ini. Yuk abadikan momen seru lagi bersama teman & pasangan! 📸✨`
    );
    setIsQuickWADrawerOpen(true);
  };

  const handleSendWA = () => {
    if (!quickWACustomer) return;
    const cleanPhone = quickWACustomer.phone.replace(/[^0-9]/g, '');
    const intlPhone = cleanPhone.startsWith('0') ? '62' + cleanPhone.slice(1) : cleanPhone;
    const encodedMsg = encodeURIComponent(waCustomMessage);
    window.open(`https://wa.me/${intlPhone}?text=${encodedMsg}`, '_blank');
    setIsQuickWADrawerOpen(false);
    showToast(`WhatsApp terbuka untuk ${quickWACustomer.name}`);
  };

  // Add Customer Submit
  const handleAddCustomerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCustomerForm.name || !newCustomerForm.phone) {
      showToast('Mohon lengkapi Nama dan No WhatsApp!');
      return;
    }

    const created: Customer = {
      id: `CUST-${String(customersList.length + 1).padStart(3, '0')}`,
      name: newCustomerForm.name,
      phone: newCustomerForm.phone,
      email: newCustomerForm.email || `${newCustomerForm.name.toLowerCase().replace(/\s+/g, '.')}@gmail.com`,
      city: newCustomerForm.city,
      birthDate: newCustomerForm.birthDate,
      segment: newCustomerForm.segment,
      totalSpent: newCustomerForm.segment === 'VIP' ? 1200000 : 50000,
      totalSessions: newCustomerForm.segment === 'VIP' ? 24 : 1,
      averageSpent: 50000,
      favoriteBooth: newCustomerForm.favoriteBooth,
      favoriteTemplate: newCustomerForm.favoriteTemplate,
      registeredAt: new Date().toISOString().split('T')[0],
      lastVisitAt: 'Baru Saja',
      tags: ['Tamu Baru', 'Registrasi Manual'],
      notes: newCustomerForm.notes || 'Pelanggan baru didaftarkan oleh kasir/admin.',
      sessionHistory: [
        {
          sessionId: `SES-${Math.floor(1000 + Math.random() * 9000)}`,
          sessionCode: `SES-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-01`,
          date: 'Hari ini',
          boothName: newCustomerForm.favoriteBooth,
          templateName: newCustomerForm.favoriteTemplate,
          packagePrice: 50000,
          paymentMethod: 'QRIS',
          photosCount: 6,
          printCopies: 2,
        },
      ],
    };

    setCustomersList([created, ...customersList]);
    setIsAddCustomerOpen(false);
    setNewCustomerForm({
      name: '',
      phone: '',
      email: '',
      city: 'Jakarta Selatan',
      birthDate: '',
      segment: 'NEW',
      favoriteBooth: 'Grand Indonesia (Booth Alpha)',
      favoriteTemplate: 'Y2K Retro Cyber Hologram',
      notes: '',
    });
    showToast(`Data tamu ${created.name} berhasil disimpan!`);
  };

  // Export CSV
  const handleExportCSV = () => {
    const headers = [
      'ID Pelanggan',
      'Nama Tamu',
      'No WhatsApp',
      'Email',
      'Kota',
      'Segment',
      'Total Sesi',
      'Total Belanja (IDR)',
      'Booth Favorit',
      'Template Favorit',
      'Kunjungan Terakhir',
    ];

    const rows = filteredCustomers.map((c) => [
      c.id,
      `"${c.name}"`,
      `"${c.phone}"`,
      `"${c.email}"`,
      `"${c.city || '-'}"`,
      c.segment,
      c.totalSessions,
      c.totalSpent,
      `"${c.favoriteBooth}"`,
      `"${c.favoriteTemplate}"`,
      `"${c.lastVisitAt}"`,
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `data_pelanggan_crm_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showToast('Data pelanggan berhasil diekspor ke CSV!');
  };

  return (
    <div className="space-y-6 font-sora animate-fade-in text-gray-900 pb-16">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-6 right-6 z-[9999] bg-gray-900 text-white px-5 py-3 rounded-2xl shadow-xl flex items-center gap-3 border border-gray-700 animate-slide-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          <span className="text-sm font-medium">{toastMessage}</span>
        </div>
      )}

      {/* HEADER SECTION */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-200 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-pink-100 text-[#9D174D] border border-pink-200">
              CRM & Directory
            </span>
            <span className="text-xs text-gray-500 font-medium">Photo Booth Management</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight mt-1">
            CRM & Database Pelanggan
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Kelola profil kontak, riwayat sesi foto, preferensi booth, segmentasi tamu, serta jalin relasi langsung via WhatsApp.
          </p>
        </div>

        {/* Top Header Actions */}
        <div className="flex items-center gap-3 flex-wrap sm:flex-nowrap">
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 text-gray-700 text-sm font-semibold shadow-xs transition-all hover:border-gray-300"
          >
            <Download className="w-4 h-4 text-gray-500" />
            <span>Ekspor Kontak (CSV)</span>
          </button>

          <button
            onClick={() => setIsAddCustomerOpen(true)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#DE5795] hover:bg-[#c94982] text-white text-sm font-semibold shadow-sm transition-all transform active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>+ Tambah Tamu Baru</span>
          </button>
        </div>
      </div>

      {/* TOP 4 CRM KPI CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {/* Card 1: Total Pelanggan */}
        <div className="bg-white rounded-2xl p-5 border border-gray-200/80 shadow-xs hover:shadow-md transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Total Pelanggan</span>
            <div className="w-10 h-10 rounded-xl bg-pink-50 flex items-center justify-center text-[#DE5795]">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
              1.482
            </div>
            <div className="flex items-center gap-1.5 mt-2 text-xs text-emerald-600 font-semibold">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>+14.2%</span>
              <span className="text-gray-400 font-normal">pertumbuhan bln ini</span>
            </div>
          </div>
        </div>

        {/* Card 2: Tamu VIP & Loyal */}
        <div className="bg-white rounded-2xl p-5 border border-gray-200/80 shadow-xs hover:shadow-md transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Tamu VIP & Loyal</span>
            <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600">
              <Crown className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
              428
            </div>
            <div className="flex items-center gap-1.5 mt-2 text-xs text-amber-600 font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>28.9%</span>
              <span className="text-gray-400 font-normal">kontributor omset booth</span>
            </div>
          </div>
        </div>

        {/* Card 3: Rata-Rata Sesi */}
        <div className="bg-white rounded-2xl p-5 border border-gray-200/80 shadow-xs hover:shadow-md transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Rata-Rata Kunjungan</span>
            <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center text-purple-600">
              <Camera className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
              {avgSessions}x / Tamu
            </div>
            <div className="flex items-center gap-1.5 mt-2 text-xs text-purple-600 font-semibold">
              <History className="w-3.5 h-3.5" />
              <span>{customersList.reduce((acc, c) => acc + c.totalSessions, 0)} Total Sesi</span>
              <span className="text-gray-400 font-normal">tercatat</span>
            </div>
          </div>
        </div>

        {/* Card 4: Retensi Tamu */}
        <div className="bg-white rounded-2xl p-5 border border-gray-200/80 shadow-xs hover:shadow-md transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Tingkat Retensi</span>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
              <UserCheck className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
              68.4%
            </div>
            <div className="flex items-center gap-1.5 mt-2 text-xs text-emerald-600 font-semibold">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Sangat Baik</span>
              <span className="text-gray-400 font-normal">kembali dlm 60 hari</span>
            </div>
          </div>
        </div>
      </div>

      {/* FILTER & SEGMENTATION TABS */}
      <div className="bg-white rounded-2xl border border-gray-200/80 shadow-xs p-4 sm:p-5 space-y-4">
        {/* Segment Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          <button
            onClick={() => setSelectedSegmentFilter('ALL')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all flex items-center gap-2 ${
              selectedSegmentFilter === 'ALL'
                ? 'bg-[#DE5795] text-white shadow-xs'
                : 'bg-gray-100 hover:bg-gray-200/70 text-gray-700'
            }`}
          >
            <span>Semua Tamu</span>
            <span
              className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                selectedSegmentFilter === 'ALL'
                  ? 'bg-white/20 text-white'
                  : 'bg-gray-200 text-gray-600'
              }`}
            >
              {segmentCounts.ALL}
            </span>
          </button>

          <button
            onClick={() => setSelectedSegmentFilter('VIP')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all flex items-center gap-2 ${
              selectedSegmentFilter === 'VIP'
                ? 'bg-[#DE5795] text-white shadow-xs'
                : 'bg-gray-100 hover:bg-gray-200/70 text-gray-700'
            }`}
          >
            <Crown className="w-3.5 h-3.5" />
            <span>VIP & Loyal</span>
            <span
              className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                selectedSegmentFilter === 'VIP'
                  ? 'bg-white/20 text-white'
                  : 'bg-amber-100 text-amber-800'
              }`}
            >
              {segmentCounts.VIP}
            </span>
          </button>

          <button
            onClick={() => setSelectedSegmentFilter('REGULAR')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all flex items-center gap-2 ${
              selectedSegmentFilter === 'REGULAR'
                ? 'bg-[#DE5795] text-white shadow-xs'
                : 'bg-gray-100 hover:bg-gray-200/70 text-gray-700'
            }`}
          >
            <span>Regular</span>
            <span
              className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                selectedSegmentFilter === 'REGULAR'
                  ? 'bg-white/20 text-white'
                  : 'bg-blue-100 text-blue-800'
              }`}
            >
              {segmentCounts.REGULAR}
            </span>
          </button>

          <button
            onClick={() => setSelectedSegmentFilter('NEW')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all flex items-center gap-2 ${
              selectedSegmentFilter === 'NEW'
                ? 'bg-[#DE5795] text-white shadow-xs'
                : 'bg-gray-100 hover:bg-gray-200/70 text-gray-700'
            }`}
          >
            <span>Pengunjung Baru (New)</span>
            <span
              className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                selectedSegmentFilter === 'NEW'
                  ? 'bg-white/20 text-white'
                  : 'bg-emerald-100 text-emerald-800'
              }`}
            >
              {segmentCounts.NEW}
            </span>
          </button>

          <button
            onClick={() => setSelectedSegmentFilter('INACTIVE')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all flex items-center gap-2 ${
              selectedSegmentFilter === 'INACTIVE'
                ? 'bg-[#DE5795] text-white shadow-xs'
                : 'bg-gray-100 hover:bg-gray-200/70 text-gray-700'
            }`}
          >
            <span>Inactive (&gt; 60 Hari)</span>
            <span
              className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                selectedSegmentFilter === 'INACTIVE'
                  ? 'bg-white/20 text-white'
                  : 'bg-gray-200 text-gray-700'
              }`}
            >
              {segmentCounts.INACTIVE}
            </span>
          </button>
        </div>

        {/* Search, Location, and Sort Controls */}
        <div className="flex flex-col md:flex-row gap-3 pt-2 border-t border-gray-100">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Cari nama tamu, WhatsApp, email, atau domisili kota..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#DE5795] focus:border-transparent transition-all placeholder:text-gray-400"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Booth Location Filter */}
          <div className="w-full md:w-60">
            <select
              value={selectedBoothFilter}
              onChange={(e) => setSelectedBoothFilter(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#DE5795] focus:border-transparent transition-all text-gray-700"
            >
              <option value="ALL">Semua Lokasi Booth</option>
              <option value="Grand Indonesia">Grand Indonesia (Alpha)</option>
              <option value="Central Park">Central Park (Beta)</option>
              <option value="Paris Van Java">PVJ Bandung (Gamma)</option>
              <option value="Senayan City">Senayan City (Epsilon)</option>
            </select>
          </div>

          {/* Sort By Dropdown */}
          <div className="w-full md:w-52">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#DE5795] focus:border-transparent transition-all text-gray-700"
            >
              <option value="NEWEST">Urutkan: Tamu Terbaru</option>
              <option value="SPENT_DESC">Belanja Tertinggi</option>
              <option value="SESSIONS_DESC">Sesi Terbanyak</option>
              <option value="NAME_ASC">Nama (A - Z)</option>
            </select>
          </div>
        </div>
      </div>

      {/* CUSTOMER DIRECTORY TABLE */}
      <div className="bg-white rounded-2xl border border-gray-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/80 border-b border-gray-200 text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                <th className="py-3.5 px-5">Tamu / Profil</th>
                <th className="py-3.5 px-4">Kontak & Domisili</th>
                <th className="py-3.5 px-4 text-center">Segmentasi</th>
                <th className="py-3.5 px-4">Total Sesi & Belanja</th>
                <th className="py-3.5 px-4">Booth Favorit</th>
                <th className="py-3.5 px-4">Kunjungan Terakhir</th>
                <th className="py-3.5 px-5 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm">
              {filteredCustomers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-gray-400">
                    <Users className="w-12 h-12 mx-auto text-gray-300 mb-3" />
                    <p className="text-base font-semibold text-gray-600">Tidak ada data tamu yang cocok</p>
                    <p className="text-xs text-gray-400 mt-1">Coba ubah kata kunci pencarian atau filter segmen</p>
                  </td>
                </tr>
              ) : (
                filteredCustomers.map((cust) => {
                  return (
                    <tr
                      key={cust.id}
                      onClick={() => handleOpenDetail(cust)}
                      className="hover:bg-pink-50/20 cursor-pointer transition-colors group"
                    >
                      {/* Name & Avatar */}
                      <td className="py-4 px-5">
                        <div className="flex items-center gap-3">
                          {cust.avatarUrl ? (
                            <img
                              src={cust.avatarUrl}
                              alt={cust.name}
                              className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-xs shrink-0"
                            />
                          ) : (
                            <div className="w-10 h-10 rounded-full bg-pink-100 text-[#DE5795] font-bold flex items-center justify-center text-sm border-2 border-white shadow-xs shrink-0">
                              {cust.name.slice(0, 2).toUpperCase()}
                            </div>
                          )}
                          <div className="min-w-0">
                            <div className="font-bold text-gray-900 group-hover:text-[#DE5795] transition-colors truncate">
                              {cust.name}
                            </div>
                            <div className="text-xs text-gray-400 flex items-center gap-2 mt-0.5">
                              <span>{cust.id}</span>
                              <span>•</span>
                              <span>Bergabung {cust.registeredAt}</span>
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Contact & City */}
                      <td className="py-4 px-4">
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-1.5 text-xs font-semibold text-gray-800">
                            <Phone className="w-3.5 h-3.5 text-gray-400" />
                            <span>{cust.phone}</span>
                          </div>
                          <div className="flex items-center gap-1.5 text-xs text-gray-500">
                            <MapPin className="w-3.5 h-3.5 text-gray-400" />
                            <span>{cust.city || 'Jabodetabek'}</span>
                          </div>
                        </div>
                      </td>

                      {/* Segment Badge */}
                      <td className="py-4 px-4 text-center">
                        {cust.segment === 'VIP' && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-200">
                            <Crown className="w-3 h-3 text-amber-600" />
                            VIP Tamu
                          </span>
                        )}
                        {cust.segment === 'REGULAR' && (
                          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800 border border-blue-200">
                            Regular
                          </span>
                        )}
                        {cust.segment === 'NEW' && (
                          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">
                            Pengunjung Baru
                          </span>
                        )}
                        {cust.segment === 'INACTIVE' && (
                          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-600 border border-gray-200">
                            Inactive &gt;60h
                          </span>
                        )}
                      </td>

                      {/* Sessions & Spent */}
                      <td className="py-4 px-4">
                        <div>
                          <div className="font-extrabold text-gray-900 text-sm">
                            {formatRupiah(cust.totalSpent)}
                          </div>
                          <div className="text-xs text-gray-500 mt-0.5 flex items-center gap-1">
                            <span className="font-medium text-gray-700">{cust.totalSessions} sesi foto</span>
                            <span>•</span>
                            <span>avg {formatRupiah(cust.averageSpent)}</span>
                          </div>
                        </div>
                      </td>

                      {/* Favorite Booth */}
                      <td className="py-4 px-4">
                        <div className="space-y-1">
                          <div className="text-xs font-semibold text-gray-800 truncate max-w-[180px] flex items-center gap-1.5">
                            <Store className="w-3.5 h-3.5 text-pink-500 shrink-0" />
                            <span className="truncate">{cust.favoriteBooth}</span>
                          </div>
                          <div className="text-[11px] text-gray-400 truncate max-w-[180px]">
                            {cust.favoriteTemplate}
                          </div>
                        </div>
                      </td>

                      {/* Last Visit */}
                      <td className="py-4 px-4">
                        <div className="text-xs text-gray-700 font-medium">
                          {cust.lastVisitAt}
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="py-4 px-5 text-right">
                        <div
                          className="flex items-center justify-end gap-2"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <button
                            id={`wa-btn-${cust.id}`}
                            data-action="chat-wa"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleOpenQuickWA(cust, e);
                            }}
                            title="Chat WhatsApp Tamu"
                            className="p-2 rounded-xl text-emerald-600 hover:bg-emerald-50 border border-emerald-100/60 hover:border-emerald-200 transition-all"
                          >
                            <MessageCircle className="w-4 h-4" />
                          </button>

                          <button
                            id={`detail-btn-${cust.id}`}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleOpenDetail(cust);
                            }}
                            className="px-3 py-1.5 rounded-xl text-xs font-semibold text-[#DE5795] bg-pink-50 hover:bg-pink-100 border border-pink-200 transition-all flex items-center gap-1"
                          >
                            <span>Detail</span>
                            <ChevronRight className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Table Footer / Summary */}
        <div className="py-3 px-5 bg-gray-50/70 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-500">
          <div>
            Menampilkan <span className="font-semibold text-gray-800">{filteredCustomers.length}</span> dari{' '}
            <span className="font-semibold text-gray-800">{customersList.length}</span> total tamu terdata
          </div>
          <div className="flex items-center gap-4">
            <span>
              Total Akumulasi Belanja:{' '}
              <strong className="text-gray-900">{formatRupiah(totalSpentAll)}</strong>
            </span>
          </div>
        </div>
      </div>

      {/* FLOATING SLIDE-OVER DRAWER: CUSTOMER DETAIL & RIWAYAT SESI */}
      {mounted &&
        isCustomerDrawerOpen &&
        selectedCustomer &&
        createPortal(
          <div className="fixed inset-0 z-[999] overflow-hidden animate-fade-in">
            {/* Backdrop covering whole viewport including sidebar and header */}
            <div
              onClick={() => setIsCustomerDrawerOpen(false)}
              className="fixed inset-0 bg-gray-900/50 backdrop-blur-xs transition-opacity"
            />

            <div className="fixed inset-y-0 right-0 max-w-full flex pl-6 sm:pl-10 p-3 sm:p-4 pointer-events-none z-[1000]">
              <div className="pointer-events-auto w-screen max-w-xl bg-white shadow-2xl rounded-3xl flex flex-col border border-gray-100 overflow-hidden animate-slide-in h-full">
                {/* Drawer Header */}
                <div className="px-8 pt-7 pb-6 border-b border-gray-100 flex items-start justify-between bg-gradient-to-r from-pink-50/40 via-white to-white shrink-0">
                  <div className="flex items-center gap-4">
                    {selectedCustomer.avatarUrl ? (
                      <img
                        src={selectedCustomer.avatarUrl}
                        alt={selectedCustomer.name}
                        className="w-14 h-14 rounded-2xl object-cover border-2 border-white shadow-md shrink-0"
                      />
                    ) : (
                      <div className="w-14 h-14 rounded-2xl bg-pink-100 text-[#DE5795] font-extrabold flex items-center justify-center text-lg border-2 border-white shadow-md shrink-0">
                        {selectedCustomer.name.slice(0, 2).toUpperCase()}
                      </div>
                    )}

                    <div>
                      <div className="flex items-center gap-2">
                        <h2 className="text-xl font-bold text-gray-900">{selectedCustomer.name}</h2>
                        {selectedCustomer.segment === 'VIP' && (
                          <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-200 flex items-center gap-1">
                            <Crown className="w-3 h-3 text-amber-600" /> VIP
                          </span>
                        )}
                        {selectedCustomer.segment === 'NEW' && (
                          <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                            New
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-gray-500 mt-1 flex items-center gap-2">
                        <span className="font-semibold text-gray-700">{selectedCustomer.id}</span>
                        <span>•</span>
                        <span>Bergabung sejak {selectedCustomer.registeredAt}</span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => setIsCustomerDrawerOpen(false)}
                    className="p-2 rounded-xl text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Drawer Content */}
                <div className="flex-1 overflow-y-auto px-8 py-6 space-y-6">
                  {/* 3 Metric Snapshot Cards */}
                  <div className="grid grid-cols-3 gap-3">
                    <div className="p-3.5 bg-gray-50 rounded-2xl border border-gray-100 text-center">
                      <span className="text-[11px] text-gray-400 font-semibold uppercase">Total Belanja</span>
                      <div className="text-sm font-extrabold text-gray-900 mt-1">
                        {formatRupiah(selectedCustomer.totalSpent)}
                      </div>
                    </div>
                    <div className="p-3.5 bg-gray-50 rounded-2xl border border-gray-100 text-center">
                      <span className="text-[11px] text-gray-400 font-semibold uppercase">Total Sesi</span>
                      <div className="text-sm font-extrabold text-[#DE5795] mt-1">
                        {selectedCustomer.totalSessions} Sesi
                      </div>
                    </div>
                    <div className="p-3.5 bg-gray-50 rounded-2xl border border-gray-100 text-center">
                      <span className="text-[11px] text-gray-400 font-semibold uppercase">Rata-rata/Sesi</span>
                      <div className="text-sm font-extrabold text-gray-900 mt-1">
                        {formatRupiah(selectedCustomer.averageSpent)}
                      </div>
                    </div>
                  </div>

                  {/* Contact Information */}
                  <div className="p-5 rounded-2xl border border-gray-200/80 bg-white space-y-3">
                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                      Informasi Kontak & Domisili
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                      <div className="flex items-center gap-2.5 text-gray-700">
                        <Phone className="w-4 h-4 text-emerald-500 shrink-0" />
                        <div>
                          <div className="text-[10px] text-gray-400">WhatsApp</div>
                          <div className="font-semibold">{selectedCustomer.phone}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2.5 text-gray-700">
                        <Mail className="w-4 h-4 text-blue-500 shrink-0" />
                        <div>
                          <div className="text-[10px] text-gray-400">Email</div>
                          <div className="font-semibold truncate">{selectedCustomer.email}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2.5 text-gray-700">
                        <MapPin className="w-4 h-4 text-rose-500 shrink-0" />
                        <div>
                          <div className="text-[10px] text-gray-400">Kota Domisili</div>
                          <div className="font-semibold">{selectedCustomer.city || 'Jabodetabek'}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2.5 text-gray-700">
                        <Calendar className="w-4 h-4 text-purple-500 shrink-0" />
                        <div>
                          <div className="text-[10px] text-gray-400">Tanggal Lahir</div>
                          <div className="font-semibold">{selectedCustomer.birthDate || '-'}</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Preferences & Behavior */}
                  <div className="p-5 rounded-2xl border border-gray-200/80 bg-white space-y-3">
                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                      Preferensi & Kebiasaan Tamu
                    </h4>
                    <div className="space-y-2 text-xs">
                      <div className="flex items-center justify-between py-1.5 border-b border-gray-100">
                        <span className="text-gray-500 flex items-center gap-1.5">
                          <Store className="w-4 h-4 text-pink-500" /> Booth Favorit:
                        </span>
                        <span className="font-bold text-gray-800">{selectedCustomer.favoriteBooth}</span>
                      </div>
                      <div className="flex items-center justify-between py-1.5 border-b border-gray-100">
                        <span className="text-gray-500 flex items-center gap-1.5">
                          <Film className="w-4 h-4 text-purple-500" /> Frame Favorit:
                        </span>
                        <span className="font-bold text-gray-800">{selectedCustomer.favoriteTemplate}</span>
                      </div>
                      <div className="flex items-center justify-between py-1.5">
                        <span className="text-gray-500 flex items-center gap-1.5">
                          <Clock className="w-4 h-4 text-amber-500" /> Kunjungan Terakhir:
                        </span>
                        <span className="font-bold text-gray-800">{selectedCustomer.lastVisitAt}</span>
                      </div>
                    </div>

                    {/* Tags */}
                    {selectedCustomer.tags && selectedCustomer.tags.length > 0 && (
                      <div className="pt-2">
                        <div className="text-[10px] text-gray-400 uppercase font-semibold mb-1.5">Label / Tags:</div>
                        <div className="flex flex-wrap gap-1.5">
                          {selectedCustomer.tags.map((tag, idx) => (
                            <span
                              key={idx}
                              className="px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-gray-100 text-gray-700"
                            >
                              #{tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Notes */}
                    {selectedCustomer.notes && (
                      <div className="pt-2">
                        <div className="text-[10px] text-gray-400 uppercase font-semibold mb-1">Catatan Staf / Booth:</div>
                        <p className="text-xs text-gray-600 italic bg-amber-50/60 p-3 rounded-xl border border-amber-100">
                          "{selectedCustomer.notes}"
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Sesi Foto History */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
                        <Camera className="w-3.5 h-3.5 text-[#DE5795]" />
                        Riwayat Sesi Foto Terakhir
                      </h4>
                      <span className="text-xs text-gray-400">
                        {selectedCustomer.sessionHistory?.length || 0} sesi tercatat
                      </span>
                    </div>

                    {selectedCustomer.sessionHistory && selectedCustomer.sessionHistory.length > 0 ? (
                      <div className="space-y-2.5">
                        {selectedCustomer.sessionHistory.map((sess, idx) => (
                          <div
                            key={idx}
                            className="p-4 rounded-2xl border border-gray-200/80 bg-white hover:border-pink-200 transition-all space-y-2"
                          >
                            <div className="flex items-center justify-between text-xs">
                              <span className="font-extrabold text-gray-900">{sess.sessionCode}</span>
                              <span className="font-bold text-[#DE5795]">{formatRupiah(sess.packagePrice)}</span>
                            </div>
                            <div className="text-xs text-gray-500 flex items-center gap-1.5">
                              <Store className="w-3.5 h-3.5 text-gray-400" />
                              <span>{sess.boothName}</span>
                            </div>
                            <div className="flex items-center justify-between pt-1 border-t border-gray-100 text-[11px] text-gray-400">
                              <span>Template: {sess.templateName}</span>
                              <span>
                                {sess.photosCount} Foto • {sess.printCopies} Strip Cetak
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="p-6 bg-gray-50 rounded-2xl text-center text-xs text-gray-400">
                        Belum ada riwayat sesi detail untuk pelanggan ini.
                      </div>
                    )}
                  </div>
                </div>

                {/* Drawer Footer */}
                <div className="px-8 pt-5 pb-6 border-t border-gray-100 flex items-center justify-between gap-3 bg-gray-50/50 shrink-0">
                  <button
                    onClick={() => setIsCustomerDrawerOpen(false)}
                    className="px-5 py-2.5 rounded-xl border border-gray-200 bg-white hover:bg-gray-100 text-gray-700 text-xs font-semibold transition-all"
                  >
                    Tutup
                  </button>

                  <button
                    id="drawer-wa-btn"
                    onClick={() => {
                      setIsCustomerDrawerOpen(false);
                      handleOpenQuickWA(selectedCustomer);
                    }}
                    className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-xs flex items-center gap-2 transition-all"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>Kirim Pesan WhatsApp</span>
                  </button>
                </div>
              </div>
            </div>
          </div>,
          document.body
        )}

      {/* FLOATING SLIDE-OVER DRAWER: REGISTRASI TAMU BARU */}
      {mounted &&
        isAddCustomerOpen &&
        createPortal(
          <div className="fixed inset-0 z-[999] overflow-hidden animate-fade-in">
            {/* Backdrop */}
            <div
              onClick={() => setIsAddCustomerOpen(false)}
              className="fixed inset-0 bg-gray-900/50 backdrop-blur-xs transition-opacity"
            />

            <div className="fixed inset-y-0 right-0 max-w-full flex pl-6 sm:pl-10 p-3 sm:p-4 pointer-events-none z-[1000]">
              <div className="pointer-events-auto w-screen max-w-lg bg-white shadow-2xl rounded-3xl flex flex-col border border-gray-100 overflow-hidden animate-slide-in h-full">
              {/* Drawer Header */}
              <div className="px-8 pt-7 pb-6 border-b border-gray-100 flex items-center justify-between shrink-0 bg-gradient-to-r from-pink-50/30 to-white">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Registrasi Tamu Baru</h2>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Tambahkan profil tamu atau pelanggan tetap ke sistem CRM.
                  </p>
                </div>
                <button
                  onClick={() => setIsAddCustomerOpen(false)}
                  className="p-2 rounded-xl text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Drawer Form Body */}
              <form onSubmit={handleAddCustomerSubmit} className="flex flex-col flex-1 min-h-0">
                <div className="flex-1 overflow-y-auto px-8 py-6 space-y-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                    Nama Lengkap Tamu *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Amanda & Kevin"
                    value={newCustomerForm.name}
                    onChange={(e) => setNewCustomerForm({ ...newCustomerForm, name: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#DE5795] transition-all"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                      No WhatsApp *
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="0812-xxxx-xxxx"
                      value={newCustomerForm.phone}
                      onChange={(e) => setNewCustomerForm({ ...newCustomerForm, phone: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#DE5795] transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                      Email
                    </label>
                    <input
                      type="email"
                      placeholder="nama@gmail.com"
                      value={newCustomerForm.email}
                      onChange={(e) => setNewCustomerForm({ ...newCustomerForm, email: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#DE5795] transition-all"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                      Kota Domisili
                    </label>
                    <input
                      type="text"
                      placeholder="Jakarta Selatan"
                      value={newCustomerForm.city}
                      onChange={(e) => setNewCustomerForm({ ...newCustomerForm, city: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#DE5795] transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                      Tanggal Lahir
                    </label>
                    <input
                      type="date"
                      value={newCustomerForm.birthDate}
                      onChange={(e) => setNewCustomerForm({ ...newCustomerForm, birthDate: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#DE5795] transition-all text-gray-700"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                      Segmentasi Awal
                    </label>
                    <select
                      value={newCustomerForm.segment}
                      onChange={(e) =>
                        setNewCustomerForm({
                          ...newCustomerForm,
                          segment: e.target.value as CustomerSegment,
                        })
                      }
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#DE5795] transition-all text-gray-700"
                    >
                      <option value="NEW">Pengunjung Baru (New)</option>
                      <option value="REGULAR">Regular Member</option>
                      <option value="VIP">VIP & Loyal</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                      Lokasi Booth Pertama
                    </label>
                    <select
                      value={newCustomerForm.favoriteBooth}
                      onChange={(e) =>
                        setNewCustomerForm({ ...newCustomerForm, favoriteBooth: e.target.value })
                      }
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#DE5795] transition-all text-gray-700"
                    >
                      <option value="Grand Indonesia (Booth Alpha)">Grand Indonesia (Alpha)</option>
                      <option value="Central Park Mall (Booth Beta)">Central Park (Beta)</option>
                      <option value="Paris Van Java Bandung (Booth Gamma)">PVJ Bandung (Gamma)</option>
                      <option value="Senayan City (Booth Epsilon)">Senayan City (Epsilon)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                    Catatan CRM Tamu
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Contoh: Suka foto bersama sahabat komunitas cosplay, request cetak strip dobel..."
                    value={newCustomerForm.notes}
                    onChange={(e) => setNewCustomerForm({ ...newCustomerForm, notes: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#DE5795] transition-all placeholder:text-gray-400"
                  />
                </div>
                </div>

                <div className="px-8 py-4 bg-gray-50/50 border-t border-gray-100 flex items-center justify-end gap-3 shrink-0">
                  <button
                    type="button"
                    onClick={() => setIsAddCustomerOpen(false)}
                    className="px-5 py-2.5 rounded-xl border border-gray-200 bg-white hover:bg-gray-100 text-gray-700 text-xs font-semibold transition-all"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-xl bg-[#DE5795] hover:bg-[#c94982] text-white text-xs font-semibold shadow-xs transition-all"
                  >
                    Simpan Tamu
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* QUICK WHATSAPP MODAL */}
      {mounted &&
        isQuickWADrawerOpen &&
        quickWACustomer &&
        createPortal(
          <div className="fixed inset-0 z-[999] overflow-hidden animate-fade-in flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
              onClick={() => setIsQuickWADrawerOpen(false)}
              className="fixed inset-0 bg-gray-900/50 backdrop-blur-xs transition-opacity"
            />

            <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-gray-100 p-6 sm:p-7 z-[1000] space-y-5 animate-slide-in">
            <div className="flex items-center justify-between border-b border-gray-100 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center">
                  <MessageCircle className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">Chat WhatsApp Tamu</h3>
                  <p className="text-xs text-gray-500">
                    Kirim pesan personal kepada {quickWACustomer.name} ({quickWACustomer.phone})
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsQuickWADrawerOpen(false)}
                className="p-1.5 rounded-xl text-gray-400 hover:text-gray-600 hover:bg-gray-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                Pesan WhatsApp
              </label>
              <textarea
                rows={5}
                value={waCustomMessage}
                onChange={(e) => setWaCustomMessage(e.target.value)}
                className="w-full p-3.5 rounded-2xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all font-sans leading-relaxed"
              />
            </div>

            <div className="flex items-center justify-between pt-2">
              <button
                type="button"
                onClick={() => setIsQuickWADrawerOpen(false)}
                className="px-4 py-2.5 rounded-xl border border-gray-200 text-gray-700 text-xs font-semibold hover:bg-gray-100 transition-all"
              >
                Batal
              </button>

              <button
                type="button"
                onClick={handleSendWA}
                className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-xs flex items-center gap-2 transition-all"
              >
                <Send className="w-4 h-4" />
                <span>Buka WhatsApp Web / App</span>
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
