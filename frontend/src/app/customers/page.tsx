'use client';

import React, { useState } from 'react';
import {
  Users,
  Ticket,
  Sparkles,
  Gift,
  Search,
  Filter,
  Plus,
  ArrowUpRight,
  Calendar,
  Phone,
  Mail,
  Crown,
  Share2,
  ExternalLink,
  CheckCircle2,
  Clock,
  ChevronRight,
  X,
  Copy,
  Check,
  Send,
  Store,
  Film,
  Camera,
  Percent,
  TrendingUp,
  Award,
  AlertCircle,
  QrCode,
  Tag,
  Download,
} from 'lucide-react';
import {
  mockCustomers,
  mockPromoVouchers,
  mockLoyaltyTiers,
  mockBroadcastCampaigns,
} from '@/features/customers/data/customer.mock';
import {
  Customer,
  PromoVoucher,
  LoyaltyTier,
} from '@/features/customers/types/customer.types';

import { usePathname } from 'next/navigation';

export default function CustomersPage() {
  const pathname = usePathname();
  const [activeTab, setActiveTab] = useState<'customers' | 'vouchers' | 'broadcast' | 'tiers'>(
    pathname?.includes('/vouchers') ? 'vouchers' : 'customers'
  );
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTierFilter, setSelectedTierFilter] = useState<string>('ALL');
  const [selectedBoothFilter, setSelectedBoothFilter] = useState<string>('ALL');

  // Drawers state
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [isCustomerDrawerOpen, setIsCustomerDrawerOpen] = useState(false);
  const [isAddCustomerOpen, setIsAddCustomerOpen] = useState(false);
  const [isAddVoucherOpen, setIsAddVoucherOpen] = useState(false);
  const [isQuickWADrawerOpen, setIsQuickWADrawerOpen] = useState(false);
  const [quickWACustomer, setQuickWACustomer] = useState<Customer | null>(null);
  const [copiedVoucherCode, setCopiedVoucherCode] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Form states
  const [newCustomer, setNewCustomer] = useState({
    name: '',
    phone: '',
    email: '',
    birthDate: '',
    tier: 'BRONZE' as LoyaltyTier,
    favoriteBooth: 'Grand Indonesia (Booth Alpha)',
  });

  const [newVoucher, setNewVoucher] = useState({
    code: '',
    title: '',
    description: '',
    discountType: 'PERCENTAGE' as 'PERCENTAGE' | 'FIXED_AMOUNT' | 'FREE_PRINT',
    discountValue: 20,
    minSpend: 50000,
    maxDiscount: 15000,
    totalQuota: 200,
    validUntil: '2026-11-30',
    applicableBooths: 'ALL',
  });

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleCopyCode = (code: string) => {
    navigator.clipboard?.writeText(code);
    setCopiedVoucherCode(code);
    showToast(`Kode "${code}" berhasil disalin ke clipboard!`);
    setTimeout(() => setCopiedVoucherCode(null), 2000);
  };

  const filteredCustomers = mockCustomers.filter((cust) => {
    const matchesSearch =
      cust.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cust.phone.includes(searchQuery) ||
      cust.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cust.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesTier = selectedTierFilter === 'ALL' || cust.tier === selectedTierFilter;
    const matchesBooth = selectedBoothFilter === 'ALL' || cust.favoriteBooth.includes(selectedBoothFilter);

    return matchesSearch && matchesTier && matchesBooth;
  });

  const formatRupiah = (val: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(val);
  };

  const getTierBadgeStyle = (tier: LoyaltyTier) => {
    switch (tier) {
      case 'VIP':
        return 'bg-pink-50 text-[#9D174D] border-pink-200';
      case 'GOLD':
        return 'bg-amber-50 text-amber-800 border-amber-200';
      case 'SILVER':
        return 'bg-slate-100 text-slate-700 border-slate-200';
      case 'BRONZE':
      default:
        return 'bg-orange-50 text-orange-800 border-orange-200';
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFBF9] font-sora p-6 sm:p-8 space-y-8">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-6 right-6 z-50 flex items-center gap-3 bg-gray-900 text-white px-5 py-3.5 rounded-2xl shadow-xl border border-gray-800 text-xs font-semibold animate-in fade-in slide-in-from-top-3">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Header Section */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
            <span>PhotoBooth OS</span>
            <span>•</span>
            <span className="text-[#DE5795]">Pelanggan & Loyalty</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
            CRM Pelanggan & Loyalty Voucher
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Kelola data 1.482 tamu foto booth, tingkatan member loyalty, voucher promo, dan broadcast WhatsApp otomatis.
          </p>
        </div>

        {/* Action Header Buttons */}
        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            onClick={() => {
              setActiveTab('broadcast');
            }}
            className="inline-flex items-center gap-2 px-3.5 py-2.5 bg-white border border-gray-200/90 rounded-xl text-xs font-semibold text-gray-700 hover:bg-gray-50 hover:text-gray-900 shadow-2xs transition-all"
          >
            <Send className="w-3.5 h-3.5 text-emerald-600" />
            <span>Kirim Broadcast Promo</span>
          </button>

          <button
            onClick={() => setIsAddVoucherOpen(true)}
            className="inline-flex items-center gap-2 px-3.5 py-2.5 bg-white border border-gray-200/90 rounded-xl text-xs font-semibold text-gray-700 hover:bg-gray-50 hover:text-gray-900 shadow-2xs transition-all"
          >
            <Ticket className="w-3.5 h-3.5 text-[#DE5795]" />
            <span>+ Buat Voucher Baru</span>
          </button>

          <button
            onClick={() => setIsAddCustomerOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#DE5795] text-white rounded-xl text-xs font-bold hover:bg-[#c94982] shadow-xs hover:shadow-md transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Daftar Pelanggan</span>
          </button>
        </div>
      </div>

      {/* 4 Top KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Total Pelanggan */}
        <div className="p-5 rounded-2xl bg-white border border-gray-200/90 shadow-2xs hover:shadow-md transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Total Pelanggan</span>
            <div className="w-9 h-9 rounded-xl bg-pink-50 text-[#DE5795] flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <h3 className="text-2xl font-black text-gray-900">1.482</h3>
            <div className="flex items-center gap-1.5 mt-1 text-xs">
              <span className="text-emerald-600 font-bold flex items-center gap-0.5">
                <ArrowUpRight className="w-3.5 h-3.5" /> +18.4%
              </span>
              <span className="text-gray-400">vs bulan lalu</span>
            </div>
          </div>
          <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between text-[11px] text-gray-500">
            <span>WhatsApp Terverifikasi</span>
            <span className="font-bold text-gray-800">98.2%</span>
          </div>
        </div>

        {/* Card 2: Member Aktif Loyalty */}
        <div className="p-5 rounded-2xl bg-white border border-gray-200/90 shadow-2xs hover:shadow-md transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Member Loyalty</span>
            <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Crown className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <h3 className="text-2xl font-black text-gray-900">428</h3>
            <div className="flex items-center gap-1.5 mt-1 text-xs">
              <span className="text-[#DE5795] font-bold">28.8%</span>
              <span className="text-gray-400">dari total pelanggan</span>
            </div>
          </div>
          <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between text-[11px] text-gray-500">
            <span>VIP Diamond & Gold</span>
            <span className="font-bold text-[#DE5795]">142 Member</span>
          </div>
        </div>

        {/* Card 3: Voucher Terpakai */}
        <div className="p-5 rounded-2xl bg-white border border-gray-200/90 shadow-2xs hover:shadow-md transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Voucher Digunakan</span>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Ticket className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <h3 className="text-2xl font-black text-gray-900">892 <span className="text-xs text-gray-400 font-normal">Klaim</span></h3>
            <div className="flex items-center gap-1.5 mt-1 text-xs">
              <span className="text-emerald-600 font-bold">64.1%</span>
              <span className="text-gray-400">conversion rate klaim</span>
            </div>
          </div>
          <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between text-[11px] text-gray-500">
            <span>Total Potongan Terberikan</span>
            <span className="font-bold text-gray-800">Rp 12.840.000</span>
          </div>
        </div>

        {/* Card 4: Saldo Poin Reward */}
        <div className="p-5 rounded-2xl bg-white border border-gray-200/90 shadow-2xs hover:shadow-md transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Saldo Poin Beredar</span>
            <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <h3 className="text-2xl font-black text-gray-900">24.850 <span className="text-xs text-gray-400 font-normal">Pts</span></h3>
            <div className="flex items-center gap-1.5 mt-1 text-xs">
              <span className="text-purple-600 font-bold">Setara Rp 2.48jt</span>
              <span className="text-gray-400">nilai reward kasir</span>
            </div>
          </div>
          <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between text-[11px] text-gray-500">
            <span>Poin Ditukar Bulan Ini</span>
            <span className="font-bold text-gray-800">6.120 Pts</span>
          </div>
        </div>
      </div>

      {/* Segmented Navigation Tabs */}
      <div className="flex items-center border-b border-gray-200 gap-6">
        <button
          onClick={() => setActiveTab('customers')}
          className={`pb-3.5 text-xs font-bold transition-all border-b-2 flex items-center gap-2 ${
            activeTab === 'customers'
              ? 'border-[#DE5795] text-[#9D174D]'
              : 'border-transparent text-gray-500 hover:text-gray-800'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Direktori Pelanggan & Member</span>
          <span className="px-2 py-0.5 rounded-full text-[10px] bg-pink-100 text-[#9D174D] font-bold">
            {mockCustomers.length} Tamu
          </span>
        </button>

        <button
          onClick={() => setActiveTab('vouchers')}
          className={`pb-3.5 text-xs font-bold transition-all border-b-2 flex items-center gap-2 ${
            activeTab === 'vouchers'
              ? 'border-[#DE5795] text-[#9D174D]'
              : 'border-transparent text-gray-500 hover:text-gray-800'
          }`}
        >
          <Ticket className="w-4 h-4" />
          <span>Voucher Promo & Diskon Kiosk</span>
          <span className="px-2 py-0.5 rounded-full text-[10px] bg-emerald-100 text-emerald-700 font-bold">
            {mockPromoVouchers.filter((v) => v.status === 'ACTIVE').length} Aktif
          </span>
        </button>

        <button
          onClick={() => setActiveTab('broadcast')}
          className={`pb-3.5 text-xs font-bold transition-all border-b-2 flex items-center gap-2 ${
            activeTab === 'broadcast'
              ? 'border-[#DE5795] text-[#9D174D]'
              : 'border-transparent text-gray-500 hover:text-gray-800'
          }`}
        >
          <Send className="w-4 h-4" />
          <span>Otomasi Broadcast WA & Ulang Tahun</span>
          <span className="px-2 py-0.5 rounded-full text-[10px] bg-amber-100 text-amber-700 font-bold">
            3 Kampanye
          </span>
        </button>

        <button
          onClick={() => setActiveTab('tiers')}
          className={`pb-3.5 text-xs font-bold transition-all border-b-2 flex items-center gap-2 ${
            activeTab === 'tiers'
              ? 'border-[#DE5795] text-[#9D174D]'
              : 'border-transparent text-gray-500 hover:text-gray-800'
          }`}
        >
          <Crown className="w-4 h-4" />
          <span>Skema Tingkatan Member (Loyalty Tiers)</span>
        </button>
      </div>

      {/* TAB 1: Direktori Pelanggan */}
      {activeTab === 'customers' && (
        <div className="space-y-4">
          {/* Filter and Search Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl bg-white border border-gray-200/90 shadow-2xs">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Cari nama tamu, WhatsApp, email, atau tag..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-xs bg-gray-50/70 border border-gray-200 rounded-xl text-gray-900 placeholder:text-gray-400 focus:outline-hidden focus:bg-white focus:border-[#DE5795]"
              />
            </div>

            <div className="flex items-center gap-2.5 flex-wrap">
              {/* Filter Tier */}
              <select
                value={selectedTierFilter}
                onChange={(e) => setSelectedTierFilter(e.target.value)}
                className="px-3 py-2 text-xs bg-gray-50 border border-gray-200 rounded-xl text-gray-700 font-medium focus:outline-hidden focus:border-[#DE5795]"
              >
                <option value="ALL">Semua Tier Member</option>
                <option value="VIP">VIP Diamond</option>
                <option value="GOLD">Gold Enthusiast</option>
                <option value="SILVER">Silver Explorer</option>
                <option value="BRONZE">Bronze Member</option>
              </select>

              {/* Filter Booth */}
              <select
                value={selectedBoothFilter}
                onChange={(e) => setSelectedBoothFilter(e.target.value)}
                className="px-3 py-2 text-xs bg-gray-50 border border-gray-200 rounded-xl text-gray-700 font-medium focus:outline-hidden focus:border-[#DE5795]"
              >
                <option value="ALL">Semua Lokasi Booth</option>
                <option value="Grand Indonesia">Grand Indonesia</option>
                <option value="Central Park">Central Park</option>
                <option value="Paris Van Java">PVJ Bandung</option>
                <option value="Senayan City">Senayan City</option>
              </select>

              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedTierFilter('ALL');
                  setSelectedBoothFilter('ALL');
                }}
                className="px-3 py-2 text-xs text-gray-500 hover:text-gray-800 font-medium"
              >
                Reset Filter
              </button>
            </div>
          </div>

          {/* Customers Table */}
          <div className="rounded-2xl border border-gray-200/90 bg-white shadow-2xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-gray-50/75 border-b border-gray-200/90 text-gray-500 font-bold uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="px-5 py-3.5">Pelanggan & Kontak</th>
                    <th className="px-4 py-3.5">Tier & Saldo Poin</th>
                    <th className="px-4 py-3.5">Total Belanja & Sesi</th>
                    <th className="px-4 py-3.5">Booth Favorit</th>
                    <th className="px-4 py-3.5">Kunjungan Terakhir</th>
                    <th className="px-4 py-3.5 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredCustomers.map((cust) => (
                    <tr key={cust.id} className="hover:bg-pink-50/20 transition-colors group">
                      {/* Name & Contact */}
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={cust.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'}
                            alt={cust.name}
                            className="w-10 h-10 rounded-full object-cover border border-gray-200 shrink-0 shadow-2xs"
                          />
                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-gray-900 group-hover:text-[#DE5795] transition-colors">
                                {cust.name}
                              </span>
                            </div>
                            <div className="flex items-center gap-2 text-gray-500 text-[11px] mt-0.5">
                              <span className="flex items-center gap-1">
                                <Phone className="w-3 h-3 text-emerald-600" />
                                {cust.phone}
                              </span>
                              <span>•</span>
                              <span>{cust.email}</span>
                            </div>
                            {/* Tags */}
                            <div className="flex items-center gap-1.5 mt-1.5 flex-wrap">
                              {cust.tags.map((tag) => (
                                <span
                                  key={tag}
                                  className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-gray-100 text-gray-600 border border-gray-200"
                                >
                                  {tag}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Tier & Points */}
                      <td className="px-4 py-4">
                        <div className="space-y-1">
                          <span
                            className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${getTierBadgeStyle(
                              cust.tier
                            )}`}
                          >
                            <Crown className="w-3 h-3" />
                            {cust.tier} Member
                          </span>
                          <div className="text-[11px] text-gray-500 flex items-center gap-1">
                            <Sparkles className="w-3 h-3 text-purple-500" />
                            <span className="font-bold text-purple-700">{cust.pointsBalance} Pts</span>
                          </div>
                        </div>
                      </td>

                      {/* Total Spent & Sessions */}
                      <td className="px-4 py-4">
                        <div className="space-y-0.5">
                          <span className="font-bold text-gray-900 block">
                            {formatRupiah(cust.totalSpent)}
                          </span>
                          <span className="text-[11px] text-gray-500 flex items-center gap-1">
                            <Camera className="w-3 h-3 text-[#DE5795]" />
                            {cust.totalSessions} sesi foto
                          </span>
                        </div>
                      </td>

                      {/* Favorite Booth */}
                      <td className="px-4 py-4">
                        <div className="space-y-0.5">
                          <span className="font-semibold text-gray-800 text-[11px] block">
                            {cust.favoriteBooth}
                          </span>
                          <span className="text-[10px] text-gray-400">
                            Fav: {cust.favoriteTemplate}
                          </span>
                        </div>
                      </td>

                      {/* Last Visit */}
                      <td className="px-4 py-4">
                        <div className="space-y-0.5 text-[11px]">
                          <span className="text-gray-700 font-medium block">
                            {cust.lastVisitAt}
                          </span>
                          <span className="text-[10px] text-gray-400">
                            Sejak {cust.registeredAt}
                          </span>
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="px-4 py-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => {
                              setQuickWACustomer(cust);
                              setIsQuickWADrawerOpen(true);
                            }}
                            title="Kirim Voucher via WhatsApp"
                            className="p-1.5 rounded-lg border border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 transition-colors"
                          >
                            <Send className="w-3.5 h-3.5" />
                          </button>

                          <button
                            onClick={() => {
                              setSelectedCustomer(cust);
                              setIsCustomerDrawerOpen(true);
                            }}
                            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 hover:text-[#DE5795] text-[11px] font-semibold transition-colors"
                          >
                            <span>Detail Sesi</span>
                            <ChevronRight className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: Voucher Promo & Diskon Kiosk */}
      {activeTab === 'vouchers' && (
        <div className="space-y-6">
          {/* Header Action Card */}
          <div className="p-5 rounded-2xl bg-gradient-to-r from-pink-500 to-[#DE5795] text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm">
            <div>
              <span className="px-2.5 py-1 rounded-full bg-white/20 text-white text-[10px] font-bold tracking-wider uppercase">
                Loyalty & Promotion Engine
              </span>
              <h2 className="text-xl font-bold mt-2">Kupon & Voucher Promo Terintegrasi Kiosk</h2>
              <p className="text-xs text-pink-100 mt-1 max-w-xl">
                Kode voucher langsung dapat diinput pengunjung pada layar sentuh booth atau dipindai otomatis via QR Code sebelum pembayaran kasir/QRIS.
              </p>
            </div>
            <button
              onClick={() => setIsAddVoucherOpen(true)}
              className="px-4 py-2.5 bg-white text-[#9D174D] rounded-xl text-xs font-bold hover:bg-pink-50 transition-all shrink-0 shadow-xs"
            >
              + Tambah Voucher Baru
            </button>
          </div>

          {/* Grid of Vouchers */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {mockPromoVouchers.map((voucher) => {
              const quotaPercent = Math.round((voucher.usedCount / voucher.totalQuota) * 100);
              const isDepleted = voucher.status === 'DEPLETED';

              return (
                <div
                  key={voucher.id}
                  className={`rounded-2xl border bg-white p-5 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between relative overflow-hidden ${
                    isDepleted ? 'border-gray-200 opacity-75' : 'border-pink-200/90'
                  }`}
                >
                  {/* Decorative background circle */}
                  <div className="absolute -top-10 -right-10 w-28 h-28 bg-pink-50/50 rounded-full pointer-events-none" />

                  <div className="space-y-3">
                    {/* Top status & type */}
                    <div className="flex items-center justify-between">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                          voucher.status === 'ACTIVE'
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : 'bg-gray-100 text-gray-500 border-gray-200'
                        }`}
                      >
                        {voucher.status === 'ACTIVE' ? '● Aktif Digunakan' : '● Kuota Habis'}
                      </span>

                      <span className="text-[11px] font-bold text-gray-400">
                        {voucher.applicableBooths.includes('ALL') ? 'Semua Booth' : 'Khusus Mall'}
                      </span>
                    </div>

                    {/* Voucher Code Box */}
                    <div className="flex items-center justify-between p-3 rounded-xl bg-gray-50 border border-dashed border-gray-300 group">
                      <div className="flex items-center gap-2">
                        <Tag className="w-4 h-4 text-[#DE5795]" />
                        <span className="font-mono text-sm font-black text-gray-900 tracking-wider">
                          {voucher.code}
                        </span>
                      </div>
                      <button
                        onClick={() => handleCopyCode(voucher.code)}
                        className="p-1 rounded-md text-gray-400 hover:text-[#DE5795] transition-colors"
                        title="Salin Kode Kupon"
                      >
                        {copiedVoucherCode === voucher.code ? (
                          <Check className="w-4 h-4 text-emerald-600" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                      </button>
                    </div>

                    {/* Title & Description */}
                    <div>
                      <h4 className="font-bold text-gray-900 text-sm">{voucher.title}</h4>
                      <p className="text-xs text-gray-500 mt-1 line-clamp-2">{voucher.description}</p>
                    </div>

                    {/* Discount Value Highlight */}
                    <div className="p-2.5 rounded-xl bg-pink-50/70 border border-pink-100 flex items-center justify-between">
                      <span className="text-[11px] font-semibold text-[#9D174D]">Nilai Manfaat:</span>
                      <span className="text-xs font-black text-[#9D174D]">
                        {voucher.discountType === 'PERCENTAGE' && `Diskon ${voucher.discountValue}%`}
                        {voucher.discountType === 'FIXED_AMOUNT' && `Potongan ${formatRupiah(voucher.discountValue)}`}
                        {voucher.discountType === 'FREE_PRINT' && `Free 1 Strip Cetak`}
                      </span>
                    </div>

                    {/* Quota Progress Bar */}
                    <div className="space-y-1.5 pt-1">
                      <div className="flex items-center justify-between text-[11px] font-medium text-gray-500">
                        <span>Penggunaan Kuota:</span>
                        <span className="font-bold text-gray-800">
                          {voucher.usedCount} / {voucher.totalQuota} ({quotaPercent}%)
                        </span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-gray-100 overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all ${
                            quotaPercent >= 90
                              ? 'bg-rose-500'
                              : quotaPercent >= 60
                              ? 'bg-amber-500'
                              : 'bg-[#DE5795]'
                          }`}
                          style={{ width: `${Math.min(quotaPercent, 100)}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Expiry & Bottom actions */}
                  <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-[11px] text-gray-500">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-gray-400" />
                      s/d {voucher.validUntil}
                    </span>

                    <button
                      onClick={() => handleCopyCode(voucher.code)}
                      className="font-bold text-[#DE5795] hover:text-[#9D174D] flex items-center gap-1"
                    >
                      <span>Pakai Kupon</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 3: Otomasi Broadcast WA & Ulang Tahun */}
      {activeTab === 'broadcast' && (
        <div className="space-y-6">
          {/* Automation Overview Card */}
          <div className="p-5 rounded-2xl bg-white border border-gray-200/90 shadow-2xs">
            <div className="flex items-start justify-between gap-4">
              <div>
                <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold tracking-wider uppercase">
                  WhatsApp Cloud API Engine
                </span>
                <h3 className="text-lg font-bold text-gray-900 mt-2">
                  Otomasi Kirim Voucher & Pengingat Tamu
                </h3>
                <p className="text-xs text-gray-500 mt-1 max-w-2xl">
                  Sistem otomatis mendeteksi hari ulang tahun pelanggan dan tamu yang tidak berkunjung dalam 30 hari untuk mengirimkan voucher khusus via WhatsApp Resmi.
                </p>
              </div>

              <div className="text-right shrink-0">
                <span className="text-[11px] text-gray-400 block">Status WhatsApp Gateway</span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200 mt-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" /> Terhubung (Official WABA)
                </span>
              </div>
            </div>
          </div>

          {/* Campaign List */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400">
              Daftar Kampanye Broadcast Aktif & Terjadwal
            </h4>

            <div className="grid grid-cols-1 gap-4">
              {mockBroadcastCampaigns.map((camp) => (
                <div
                  key={camp.id}
                  className="p-5 rounded-2xl bg-white border border-gray-200/90 shadow-2xs hover:shadow-md transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  <div className="space-y-2">
                    <div className="flex items-center gap-2.5 flex-wrap">
                      <span className="font-bold text-gray-900 text-sm">{camp.title}</span>
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          camp.status === 'SENT'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-blue-50 text-blue-700 border border-blue-200'
                        }`}
                      >
                        {camp.status === 'SENT' ? '✓ Terkirim' : '🕒 Terjadwal'}
                      </span>
                    </div>

                    <div className="flex items-center gap-4 text-xs text-gray-500 flex-wrap">
                      <span className="flex items-center gap-1">
                        <Users className="w-3.5 h-3.5 text-gray-400" />
                        Target: <strong className="text-gray-700">{camp.targetAudience}</strong>
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Ticket className="w-3.5 h-3.5 text-[#DE5795]" />
                        Voucher: <strong className="text-[#DE5795]">{camp.voucherAttached}</strong>
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-gray-400" />
                        {camp.sentDate}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 self-end md:self-center">
                    <div className="text-right">
                      <span className="text-[10px] text-gray-400 uppercase font-bold block">
                        Tingkat Konversi
                      </span>
                      <span className="text-xs font-black text-emerald-700">
                        {camp.conversionRate}
                      </span>
                    </div>

                    <button
                      onClick={() => showToast(`Simulasi pemicuan ulang kampanye "${camp.title}" dimulai!`)}
                      className="px-3.5 py-2 bg-gray-50 hover:bg-pink-50 hover:text-[#9D174D] border border-gray-200 rounded-xl text-xs font-semibold text-gray-700 transition-colors"
                    >
                      Kirim Sekarang
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: Skema Tingkatan Member (Loyalty Tiers) */}
      {activeTab === 'tiers' && (
        <div className="space-y-6">
          <div className="p-5 rounded-2xl bg-white border border-gray-200/90 shadow-2xs">
            <h3 className="text-base font-bold text-gray-900">
              Struktur Keuntungan Tingkatan Member (Loyalty Rewards)
            </h3>
            <p className="text-xs text-gray-500 mt-1">
              Member otomatis naik tingkatan ketika total akumulasi transaksi mencapai batas minimal. Keuntungan langsung dapat dinikmati di seluruh mesin photo booth.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {mockLoyaltyTiers.map((tier) => (
              <div
                key={tier.tier}
                className="p-5 rounded-2xl bg-white border border-gray-200/90 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-black border ${tier.badgeBg}`}
                    >
                      {tier.name}
                    </span>
                    <Crown className="w-4 h-4" style={{ color: tier.colorHex }} />
                  </div>

                  <div>
                    <span className="text-[10px] text-gray-400 uppercase font-bold block">
                      Minimal Belanja
                    </span>
                    <span className="text-lg font-black text-gray-900">
                      {tier.minSpendThreshold === 0 ? 'Gratis Daftar' : formatRupiah(tier.minSpendThreshold)}
                    </span>
                  </div>

                  <div className="space-y-2.5 pt-2 border-t border-gray-100 text-xs">
                    <div className="flex items-center justify-between text-gray-600">
                      <span>Kelipatan Poin:</span>
                      <strong className="text-gray-900">{tier.pointsMultiplier}</strong>
                    </div>

                    <div className="flex items-center justify-between text-gray-600">
                      <span>Cashback Poin:</span>
                      <strong className="text-[#DE5795]">{tier.cashbackPercent}%</strong>
                    </div>

                    <div className="flex items-center justify-between text-gray-600">
                      <span>Gratis Extra Print:</span>
                      <strong className="text-gray-900">
                        {tier.freeExtraPrintPerSession > 0 ? `+${tier.freeExtraPrintPerSession} Strip / Sesi` : 'Tidak Ada'}
                      </strong>
                    </div>

                    <div className="flex items-center justify-between text-gray-600">
                      <span>Template Eksklusif:</span>
                      <strong className={tier.exclusiveFrames ? 'text-emerald-600 font-bold' : 'text-gray-400'}>
                        {tier.exclusiveFrames ? '✓ Terbuka' : 'Terkunci'}
                      </strong>
                    </div>
                  </div>
                </div>

                <div className="mt-5 pt-3 border-t border-gray-100">
                  <span className="text-[11px] text-gray-400 text-center block">
                    Otomatis terhubung dengan nomor HP WhatsApp tamu
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* DRAWER 1: Detail Profil Pelanggan & Riwayat Sesi Foto   */}
      {/* ======================================================== */}
      {isCustomerDrawerOpen && selectedCustomer && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          <div
            className="absolute inset-0 bg-gray-900/40 backdrop-blur-xs transition-opacity animate-in fade-in"
            onClick={() => setIsCustomerDrawerOpen(false)}
          />

          <div className="fixed inset-y-0 right-0 max-w-full flex pl-6 sm:pl-10 p-3 sm:p-4 pointer-events-none">
            <div className="w-screen max-w-md pointer-events-auto rounded-3xl bg-white shadow-2xl border border-gray-100 flex flex-col justify-between overflow-hidden animate-in slide-in-from-right duration-300">
              {/* Header */}
              <div className="px-8 pt-7 pb-7.5 border-b border-gray-100 flex items-center justify-between bg-gradient-to-b from-gray-50/60 to-white">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-pink-50 text-[#DE5795] flex items-center justify-center font-bold">
                    <Users className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-gray-900">Profil Tamu & Member</h3>
                    <p className="text-xs text-gray-400">ID: {selectedCustomer.id}</p>
                  </div>
                </div>

                <button
                  onClick={() => setIsCustomerDrawerOpen(false)}
                  className="p-2 rounded-xl text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Scrollable Content */}
              <div className="flex-1 overflow-y-auto px-8 py-6 space-y-6">
                {/* Profile Card */}
                <div className="p-4 rounded-2xl bg-pink-50/40 border border-pink-100 flex items-center gap-4">
                  <img
                    src={selectedCustomer.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'}
                    alt={selectedCustomer.name}
                    className="w-16 h-16 rounded-full object-cover border-2 border-white shadow-sm shrink-0"
                  />
                  <div className="min-w-0">
                    <h4 className="font-bold text-gray-900 text-base">{selectedCustomer.name}</h4>
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold border mt-1 ${getTierBadgeStyle(
                        selectedCustomer.tier
                      )}`}
                    >
                      <Crown className="w-3 h-3" />
                      {selectedCustomer.tier} Member
                    </span>
                    <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                      <Phone className="w-3 h-3 text-emerald-600" />
                      {selectedCustomer.phone}
                    </p>
                  </div>
                </div>

                {/* Metrics Summary */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3.5 rounded-xl bg-gray-50 border border-gray-100">
                    <span className="text-[10px] text-gray-400 font-bold uppercase block">Total Belanja</span>
                    <span className="text-sm font-black text-gray-900 mt-0.5 block">
                      {formatRupiah(selectedCustomer.totalSpent)}
                    </span>
                    <span className="text-[10px] text-gray-500">{selectedCustomer.totalSessions} sesi foto</span>
                  </div>

                  <div className="p-3.5 rounded-xl bg-purple-50/50 border border-purple-100">
                    <span className="text-[10px] text-purple-600 font-bold uppercase block">Saldo Poin</span>
                    <span className="text-sm font-black text-purple-800 mt-0.5 block">
                      {selectedCustomer.pointsBalance} Pts
                    </span>
                    <span className="text-[10px] text-purple-600">Setara diskon Rp {selectedCustomer.pointsBalance * 100}</span>
                  </div>
                </div>

                {/* Preferences */}
                <div className="p-3.5 rounded-xl bg-gray-50 border border-gray-100 space-y-1.5 text-xs">
                  <div className="flex items-center justify-between text-gray-600">
                    <span>Booth Favorit:</span>
                    <strong className="text-gray-900">{selectedCustomer.favoriteBooth}</strong>
                  </div>
                  <div className="flex items-center justify-between text-gray-600">
                    <span>Template Favorit:</span>
                    <strong className="text-[#DE5795]">{selectedCustomer.favoriteTemplate}</strong>
                  </div>
                </div>

                {/* Riwayat Sesi Foto */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h5 className="text-xs font-bold uppercase tracking-wider text-gray-700">
                      Riwayat Sesi Foto Tamu
                    </h5>
                    <span className="text-[11px] text-gray-400">
                      {selectedCustomer.sessionHistory?.length || 0} Sesi Tercatat
                    </span>
                  </div>

                  <div className="space-y-2.5">
                    {selectedCustomer.sessionHistory && selectedCustomer.sessionHistory.length > 0 ? (
                      selectedCustomer.sessionHistory.map((ses) => (
                        <div
                          key={ses.sessionId}
                          className="p-3.5 rounded-xl border border-gray-200/80 bg-white hover:border-[#DE5795]/50 transition-colors space-y-2"
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-mono text-xs font-bold text-gray-900">
                              {ses.sessionCode}
                            </span>
                            <span className="font-bold text-xs text-[#DE5795]">
                              {formatRupiah(ses.packagePrice)}
                            </span>
                          </div>

                          <div className="text-[11px] text-gray-500 space-y-0.5">
                            <p className="font-medium text-gray-800">{ses.templateName}</p>
                            <p>{ses.boothName} • {ses.date}</p>
                          </div>

                          <div className="flex items-center justify-between text-[10px] text-gray-400 pt-1 border-t border-gray-50">
                            <span>{ses.photosCount} Foto Diambil • {ses.printCopies} Strip Cetak</span>
                            <span className="font-semibold text-emerald-600">{ses.paymentMethod}</span>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="p-4 rounded-xl bg-gray-50 text-center text-xs text-gray-400">
                        Belum ada detail riwayat sesi foto sebelumnya.
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="px-8 pt-5.5 pb-7 border-t border-gray-100 bg-white flex items-center justify-between gap-3">
                <button
                  onClick={() => setIsCustomerDrawerOpen(false)}
                  className="px-4 py-2.5 text-xs font-semibold text-gray-600 hover:text-gray-900"
                >
                  Tutup
                </button>

                <button
                  onClick={() => {
                    setQuickWACustomer(selectedCustomer);
                    setIsCustomerDrawerOpen(false);
                    setIsQuickWADrawerOpen(true);
                  }}
                  className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-xs"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Kirim Voucher WhatsApp</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* DRAWER 2: Buat / Tambah Voucher Promo Baru               */}
      {/* ======================================================== */}
      {isAddVoucherOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          <div
            className="absolute inset-0 bg-gray-900/40 backdrop-blur-xs transition-opacity animate-in fade-in"
            onClick={() => setIsAddVoucherOpen(false)}
          />

          <div className="fixed inset-y-0 right-0 max-w-full flex pl-6 sm:pl-10 p-3 sm:p-4 pointer-events-none">
            <div className="w-screen max-w-md pointer-events-auto rounded-3xl bg-white shadow-2xl border border-gray-100 flex flex-col justify-between overflow-hidden animate-in slide-in-from-right duration-300">
              {/* Header */}
              <div className="px-8 pt-7 pb-7.5 border-b border-gray-100 flex items-center justify-between bg-gradient-to-b from-pink-50/50 to-white">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-pink-100 text-[#9D174D] flex items-center justify-center font-bold">
                    <Ticket className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-gray-900">Buat Kupon Promo Baru</h3>
                    <p className="text-xs text-gray-400">Terintegrasi otomatis ke mesin kiosk & POS</p>
                  </div>
                </div>

                <button
                  onClick={() => setIsAddVoucherOpen(false)}
                  className="p-2 rounded-xl text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Form Content */}
              <div className="flex-1 overflow-y-auto px-8 py-6 space-y-4 text-xs">
                <div>
                  <label className="font-bold text-gray-700 block mb-1">Kode Voucher (Kapital)*</label>
                  <input
                    type="text"
                    placeholder="Contoh: HEMAT20K, BDAYMEMBER"
                    value={newVoucher.code}
                    onChange={(e) => setNewVoucher({ ...newVoucher, code: e.target.value.toUpperCase() })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 uppercase font-mono font-bold focus:border-[#DE5795] focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="font-bold text-gray-700 block mb-1">Judul / Nama Promo*</label>
                  <input
                    type="text"
                    placeholder="Contoh: Diskon Pelajar & Mahasiswa 20%"
                    value={newVoucher.title}
                    onChange={(e) => setNewVoucher({ ...newVoucher, title: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 focus:border-[#DE5795] focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="font-bold text-gray-700 block mb-1">Jenis Potongan Diskon*</label>
                  <select
                    value={newVoucher.discountType}
                    onChange={(e) =>
                      setNewVoucher({
                        ...newVoucher,
                        discountType: e.target.value as any,
                      })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 bg-white focus:border-[#DE5795] focus:outline-hidden"
                  >
                    <option value="PERCENTAGE">Persentase Diskon (%)</option>
                    <option value="FIXED_AMOUNT">Potongan Nominal Tunai (Rp)</option>
                    <option value="FREE_PRINT">Gratis Strip Cetak Tambahan (Free Print)</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-gray-700 block mb-1">Nilai Diskon*</label>
                    <input
                      type="number"
                      placeholder="20 atau 15000"
                      value={newVoucher.discountValue}
                      onChange={(e) => setNewVoucher({ ...newVoucher, discountValue: Number(e.target.value) })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 focus:border-[#DE5795] focus:outline-hidden font-bold"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-gray-700 block mb-1">Total Kuota Penggunaan*</label>
                    <input
                      type="number"
                      placeholder="200"
                      value={newVoucher.totalQuota}
                      onChange={(e) => setNewVoucher({ ...newVoucher, totalQuota: Number(e.target.value) })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 focus:border-[#DE5795] focus:outline-hidden font-bold"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-gray-700 block mb-1">Min. Belanja (Rp)</label>
                    <input
                      type="number"
                      placeholder="50000"
                      value={newVoucher.minSpend}
                      onChange={(e) => setNewVoucher({ ...newVoucher, minSpend: Number(e.target.value) })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 focus:border-[#DE5795] focus:outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-gray-700 block mb-1">Berlaku Sampai*</label>
                    <input
                      type="date"
                      value={newVoucher.validUntil}
                      onChange={(e) => setNewVoucher({ ...newVoucher, validUntil: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 focus:border-[#DE5795] focus:outline-hidden"
                    />
                  </div>
                </div>

                <div>
                  <label className="font-bold text-gray-700 block mb-1">Berlaku di Booth Mall</label>
                  <select
                    value={newVoucher.applicableBooths}
                    onChange={(e) => setNewVoucher({ ...newVoucher, applicableBooths: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 bg-white focus:border-[#DE5795] focus:outline-hidden"
                  >
                    <option value="ALL">Semua Booth Mall (Seluruh Indonesia)</option>
                    <option value="Grand Indonesia (Booth Alpha)">Hanya Grand Indonesia (Booth Alpha)</option>
                    <option value="Central Park (Booth Beta)">Hanya Central Park (Booth Beta)</option>
                    <option value="Paris Van Java Bandung (Booth Gamma)">Hanya PVJ Bandung (Booth Gamma)</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-gray-700 block mb-1">Deskripsi Singkat</label>
                  <textarea
                    rows={2}
                    placeholder="Penjelasan promo yang tampil pada layar kios..."
                    value={newVoucher.description}
                    onChange={(e) => setNewVoucher({ ...newVoucher, description: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 focus:border-[#DE5795] focus:outline-hidden"
                  />
                </div>
              </div>

              {/* Footer */}
              <div className="px-8 pt-5.5 pb-7 border-t border-gray-100 bg-white flex items-center justify-between gap-3">
                <button
                  onClick={() => setIsAddVoucherOpen(false)}
                  className="px-4 py-2.5 text-xs font-semibold text-gray-600 hover:text-gray-900"
                >
                  Batal
                </button>

                <button
                  onClick={() => {
                    if (!newVoucher.code || !newVoucher.title) {
                      alert('Harap isi kode voucher dan nama promo!');
                      return;
                    }
                    setIsAddVoucherOpen(false);
                    showToast(`Voucher ${newVoucher.code} berhasil dibuat dan aktif di seluruh kiosk!`);
                  }}
                  className="px-5 py-2.5 rounded-xl bg-[#DE5795] hover:bg-[#c94982] text-white text-xs font-bold shadow-xs"
                >
                  Simpan & Rilis Voucher
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* DRAWER 3: Tambah / Registrasi Pelanggan Baru             */}
      {/* ======================================================== */}
      {isAddCustomerOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          <div
            className="absolute inset-0 bg-gray-900/40 backdrop-blur-xs transition-opacity animate-in fade-in"
            onClick={() => setIsAddCustomerOpen(false)}
          />

          <div className="fixed inset-y-0 right-0 max-w-full flex pl-6 sm:pl-10 p-3 sm:p-4 pointer-events-none">
            <div className="w-screen max-w-md pointer-events-auto rounded-3xl bg-white shadow-2xl border border-gray-100 flex flex-col justify-between overflow-hidden animate-in slide-in-from-right duration-300">
              {/* Header */}
              <div className="px-8 pt-7 pb-7.5 border-b border-gray-100 flex items-center justify-between bg-gradient-to-b from-gray-50/60 to-white">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-pink-50 text-[#DE5795] flex items-center justify-center font-bold">
                    <Plus className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-gray-900">Registrasi Pelanggan Baru</h3>
                    <p className="text-xs text-gray-400">Daftarkan nomor WhatsApp untuk poin loyalty</p>
                  </div>
                </div>

                <button
                  onClick={() => setIsAddCustomerOpen(false)}
                  className="p-2 rounded-xl text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Form Content */}
              <div className="flex-1 overflow-y-auto px-8 py-6 space-y-4 text-xs">
                <div>
                  <label className="font-bold text-gray-700 block mb-1">Nama Lengkap*</label>
                  <input
                    type="text"
                    placeholder="Contoh: Sarah Anindita"
                    value={newCustomer.name}
                    onChange={(e) => setNewCustomer({ ...newCustomer, name: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 focus:border-[#DE5795] focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="font-bold text-gray-700 block mb-1">Nomor WhatsApp Aktif*</label>
                  <input
                    type="text"
                    placeholder="0812-xxxx-xxxx"
                    value={newCustomer.phone}
                    onChange={(e) => setNewCustomer({ ...newCustomer, phone: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 focus:border-[#DE5795] focus:outline-hidden font-bold"
                  />
                </div>

                <div>
                  <label className="font-bold text-gray-700 block mb-1">Alamat Email</label>
                  <input
                    type="email"
                    placeholder="sarah.anindita@example.com"
                    value={newCustomer.email}
                    onChange={(e) => setNewCustomer({ ...newCustomer, email: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 focus:border-[#DE5795] focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="font-bold text-gray-700 block mb-1">Tanggal Lahir (Untuk Reward Ultah)</label>
                  <input
                    type="date"
                    value={newCustomer.birthDate}
                    onChange={(e) => setNewCustomer({ ...newCustomer, birthDate: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 focus:border-[#DE5795] focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="font-bold text-gray-700 block mb-1">Tier Awal Member</label>
                  <select
                    value={newCustomer.tier}
                    onChange={(e) => setNewCustomer({ ...newCustomer, tier: e.target.value as any })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 bg-white focus:border-[#DE5795] focus:outline-hidden"
                  >
                    <option value="BRONZE">Bronze Member (Default Tamu Baru)</option>
                    <option value="SILVER">Silver Explorer</option>
                    <option value="GOLD">Gold Enthusiast</option>
                    <option value="VIP">VIP Diamond</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-gray-700 block mb-1">Booth Lokasi Pertama</label>
                  <select
                    value={newCustomer.favoriteBooth}
                    onChange={(e) => setNewCustomer({ ...newCustomer, favoriteBooth: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 bg-white focus:border-[#DE5795] focus:outline-hidden"
                  >
                    <option value="Grand Indonesia (Booth Alpha)">Grand Indonesia (Booth Alpha)</option>
                    <option value="Central Park (Booth Beta)">Central Park (Booth Beta)</option>
                    <option value="Paris Van Java Bandung (Booth Gamma)">Paris Van Java Bandung</option>
                  </select>
                </div>
              </div>

              {/* Footer */}
              <div className="px-8 pt-5.5 pb-7 border-t border-gray-100 bg-white flex items-center justify-between gap-3">
                <button
                  onClick={() => setIsAddCustomerOpen(false)}
                  className="px-4 py-2.5 text-xs font-semibold text-gray-600 hover:text-gray-900"
                >
                  Batal
                </button>

                <button
                  onClick={() => {
                    if (!newCustomer.name || !newCustomer.phone) {
                      alert('Nama dan Nomor WhatsApp wajib diisi!');
                      return;
                    }
                    setIsAddCustomerOpen(false);
                    showToast(`Pelanggan ${newCustomer.name} berhasil didaftarkan!`);
                  }}
                  className="px-5 py-2.5 rounded-xl bg-[#DE5795] hover:bg-[#c94982] text-white text-xs font-bold shadow-xs"
                >
                  Daftarkan Member
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* DRAWER 4: Quick WhatsApp Voucher Blast Modal            */}
      {/* ======================================================== */}
      {isQuickWADrawerOpen && quickWACustomer && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          <div
            className="absolute inset-0 bg-gray-900/40 backdrop-blur-xs transition-opacity animate-in fade-in"
            onClick={() => setIsQuickWADrawerOpen(false)}
          />

          <div className="fixed inset-y-0 right-0 max-w-full flex pl-6 sm:pl-10 p-3 sm:p-4 pointer-events-none">
            <div className="w-screen max-w-md pointer-events-auto rounded-3xl bg-white shadow-2xl border border-gray-100 flex flex-col justify-between overflow-hidden animate-in slide-in-from-right duration-300">
              {/* Header */}
              <div className="px-8 pt-7 pb-7.5 border-b border-gray-100 flex items-center justify-between bg-gradient-to-b from-emerald-50/50 to-white">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
                    <Send className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-gray-900">Kirim Voucher via WhatsApp</h3>
                    <p className="text-xs text-gray-400">Pesan langsung ke {quickWACustomer.name}</p>
                  </div>
                </div>

                <button
                  onClick={() => setIsQuickWADrawerOpen(false)}
                  className="p-2 rounded-xl text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Message Preview Content */}
              <div className="flex-1 overflow-y-auto px-8 py-6 space-y-4 text-xs">
                <div className="p-3.5 rounded-xl bg-gray-50 border border-gray-200">
                  <span className="text-[10px] text-gray-400 font-bold uppercase block">Penerima Pesan:</span>
                  <span className="font-bold text-gray-900 block mt-0.5">{quickWACustomer.name}</span>
                  <span className="text-gray-500">{quickWACustomer.phone}</span>
                </div>

                <div>
                  <label className="font-bold text-gray-700 block mb-1">Pilih Hadiah Voucher yang Dikirim:</label>
                  <select className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 bg-white font-medium focus:border-emerald-600 focus:outline-hidden">
                    <option value="BDAYTREATFREE">BDAYTREATFREE - Gratis 1 Strip Cetak Tambahan</option>
                    <option value="WEEKENDSERU20">WEEKENDSERU20 - Diskon Spesial 20%</option>
                    <option value="HEMAT15KGI">HEMAT15KGI - Potongan Rp 15.000 Grand Indonesia</option>
                  </select>
                </div>

                {/* WhatsApp Chat Balloon Simulator */}
                <div className="space-y-1.5 pt-2">
                  <label className="font-bold text-gray-700 block">Preview Tampilan Pesan WhatsApp:</label>
                  <div className="p-4 rounded-2xl bg-[#EFEAE2] border border-gray-200 space-y-2">
                    <div className="bg-white p-3.5 rounded-2xl rounded-tl-none shadow-2xs space-y-2 text-gray-800 leading-relaxed text-[11px]">
                      <p>Halo kak <strong>{quickWACustomer.name}</strong>! ✨</p>
                      <p>
                        Terima kasih sudah setia berfoto bersama PhotoBooth OS! Spesial untukmu sebagai <strong>{quickWACustomer.tier} Member</strong>, kami punya hadiah voucher eksklusif:
                      </p>
                      <div className="p-2 rounded-lg bg-pink-50 border border-dashed border-[#DE5795] text-center font-mono font-bold text-[#9D174D]">
                        KODE: WEEKENDSERU20
                      </div>
                      <p className="text-[10px] text-gray-500">
                        Cukup ketik kode ini di layar kiosk sebelum cetak foto ya! Berlaku s/d 31 Okt 2026.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="px-8 pt-5.5 pb-7 border-t border-gray-100 bg-white flex items-center justify-between gap-3">
                <button
                  onClick={() => setIsQuickWADrawerOpen(false)}
                  className="px-4 py-2.5 text-xs font-semibold text-gray-600 hover:text-gray-900"
                >
                  Batal
                </button>

                <button
                  onClick={() => {
                    setIsQuickWADrawerOpen(false);
                    showToast(`Pesan WhatsApp voucher berhasil dikirimkan ke ${quickWACustomer.name} (${quickWACustomer.phone})!`);
                  }}
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-2 shadow-xs"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Kirim WhatsApp Sekarang</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
