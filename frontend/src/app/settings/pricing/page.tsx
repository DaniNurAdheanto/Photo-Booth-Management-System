'use client';

import React, { useState } from 'react';
import {
  Tag,
  DollarSign,
  Plus,
  Edit2,
  Check,
  CheckCircle2,
  SlidersHorizontal,
  Clock,
  Printer,
  Sparkles,
  Camera,
  Layers,
  Store,
  Calendar,
  AlertCircle,
  HelpCircle,
  ShieldCheck,
  Eye,
  X,
  TrendingUp,
  Percent,
  Receipt,
  Tv,
} from 'lucide-react';
import {
  mockPhotoSessionPackages,
  mockPricingAddOns,
  mockSurgePricingRules,
  mockMallLocationPricingRules,
  mockTaxAndPaymentPolicy,
} from '@/features/pricing/data/pricing.mock';
import {
  PhotoSessionPackage,
  PricingAddOn,
  SurgePricingRule,
  TaxAndPaymentPolicy,
} from '@/features/pricing/types/pricing.types';

export default function PricingSettingsPage() {
  const [activeTab, setActiveTab] = useState<'packages' | 'addons' | 'surge' | 'policy'>('packages');
  const [packages, setPackages] = useState<PhotoSessionPackage[]>(mockPhotoSessionPackages);
  const [addOns, setAddOns] = useState<PricingAddOn[]>(mockPricingAddOns);
  const [surgeRules, setSurgeRules] = useState<SurgePricingRule[]>(mockSurgePricingRules);
  const [taxPolicy, setTaxPolicy] = useState<TaxAndPaymentPolicy>(mockTaxAndPaymentPolicy);

  // Drawer & Modal States
  const [isPackageDrawerOpen, setIsPackageDrawerOpen] = useState(false);
  const [editingPackage, setEditingPackage] = useState<PhotoSessionPackage | null>(null);
  const [isSimulatorOpen, setIsSimulatorOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Form state for creating/editing a package
  const [formData, setFormData] = useState<Partial<PhotoSessionPackage>>({
    name: '',
    tagline: '',
    badge: '',
    paperFormat: 'STRIP_2X6',
    defaultPoseCount: 4,
    printCopiesCount: 2,
    sessionDurationSec: 120,
    countdownPerPoseSec: 5,
    basePrice: 40000,
    isPopular: false,
    isActive: true,
    includesDigitalGif: true,
    includesHighResDownload: true,
    paperCostEstimate: 5800,
    description: '',
  });

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const formatRupiah = (val: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(val);
  };

  const handleOpenCreateDrawer = () => {
    setEditingPackage(null);
    setFormData({
      name: '',
      tagline: '',
      badge: '',
      paperFormat: 'STRIP_2X6',
      defaultPoseCount: 4,
      printCopiesCount: 2,
      sessionDurationSec: 120,
      countdownPerPoseSec: 5,
      basePrice: 40000,
      isPopular: false,
      isActive: true,
      includesDigitalGif: true,
      includesHighResDownload: true,
      paperCostEstimate: 5800,
      description: '',
    });
    setIsPackageDrawerOpen(true);
  };

  const handleOpenEditDrawer = (pkg: PhotoSessionPackage) => {
    setEditingPackage(pkg);
    setFormData({ ...pkg });
    setIsPackageDrawerOpen(true);
  };

  const handleSavePackage = () => {
    if (!formData.name || !formData.basePrice) {
      alert('Harap lengkapi nama paket dan harga dasar!');
      return;
    }

    if (editingPackage) {
      setPackages((prev) =>
        prev.map((p) => (p.id === editingPackage.id ? ({ ...p, ...formData } as PhotoSessionPackage) : p))
      );
      showToast(`Paket "${formData.name}" berhasil diperbarui!`);
    } else {
      const newPkg: PhotoSessionPackage = {
        id: `PKG-${Date.now().toString().slice(-4)}`,
        name: formData.name || 'Paket Baru',
        tagline: formData.tagline || '',
        badge: formData.badge || '',
        paperFormat: formData.paperFormat || 'STRIP_2X6',
        defaultPoseCount: Number(formData.defaultPoseCount) || 4,
        printCopiesCount: Number(formData.printCopiesCount) || 2,
        sessionDurationSec: Number(formData.sessionDurationSec) || 120,
        countdownPerPoseSec: Number(formData.countdownPerPoseSec) || 5,
        basePrice: Number(formData.basePrice) || 40000,
        isPopular: !!formData.isPopular,
        isActive: true,
        includesDigitalGif: !!formData.includesDigitalGif,
        includesHighResDownload: !!formData.includesHighResDownload,
        paperCostEstimate: Number(formData.paperCostEstimate) || 5800,
        description: formData.description || '',
        applicableBooths: ['ALL'],
      };
      setPackages((prev) => [...prev, newPkg]);
      showToast(`Paket baru "${newPkg.name}" berhasil ditambahkan ke seluruh mesin kiosk!`);
    }
    setIsPackageDrawerOpen(false);
  };

  const togglePackageActive = (id: string) => {
    setPackages((prev) =>
      prev.map((p) => {
        if (p.id === id) {
          const nextState = !p.isActive;
          showToast(`Paket ${p.name} kini ${nextState ? 'Aktif di Kiosk' : 'Dinonaktifkan'}`);
          return { ...p, isActive: nextState };
        }
        return p;
      })
    );
  };

  const toggleAddonActive = (id: string) => {
    setAddOns((prev) =>
      prev.map((a) => {
        if (a.id === id) {
          const nextState = !a.isActive;
          showToast(`Add-on ${a.name} ${nextState ? 'diaktifkan' : 'dinonaktifkan'}`);
          return { ...a, isActive: nextState };
        }
        return a;
      })
    );
  };

  const toggleSurgeActive = (id: string) => {
    setSurgeRules((prev) =>
      prev.map((r) => {
        if (r.id === id) {
          const nextState = !r.isActive;
          showToast(`Aturan penyesuaian ${r.name} kini ${nextState ? 'Aktif' : 'Non-aktif'}`);
          return { ...r, isActive: nextState };
        }
        return r;
      })
    );
  };

  return (
    <div className="space-y-6 font-sora animate-fade-in text-gray-900 pb-16">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-6 right-6 z-50 flex items-center gap-3 bg-gray-900 text-white px-5 py-3.5 rounded-2xl shadow-xl border border-gray-800 text-xs font-semibold animate-in fade-in slide-in-from-top-3">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-200 pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
            <span>PhotoBooth OS</span>
            <span>•</span>
            <span className="text-[#DE5795]">Pengaturan Sistem</span>
            <span>•</span>
            <span>Tarif & Harga Kios</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
            Pengaturan Harga & Paket Sesi Foto
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Konfigurasi tarif sesi foto dasar, harga cetak ekstra, diskon happy hour, dan kebijakan pajak PB1 di seluruh mesin booth.
          </p>
        </div>

        {/* Action Header Buttons */}
        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            onClick={() => setIsSimulatorOpen(true)}
            className="inline-flex items-center gap-2 px-3.5 py-2.5 bg-white border border-gray-200/90 rounded-xl text-xs font-semibold text-gray-700 hover:bg-gray-50 hover:text-gray-900 shadow-2xs transition-all"
          >
            <Tv className="w-3.5 h-3.5 text-purple-600" />
            <span>Simulasi Layar Kios</span>
          </button>

          <button
            onClick={handleOpenCreateDrawer}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#DE5795] text-white rounded-xl text-xs font-bold hover:bg-[#c94982] shadow-xs hover:shadow-md transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>+ Tambah Paket Baru</span>
          </button>
        </div>
      </div>

      {/* 4 Top KPI Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: Average Session Price (ASP) */}
        <div className="p-5 rounded-2xl bg-white border border-gray-200/90 shadow-2xs hover:shadow-md transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Rata-rata Harga / Sesi</span>
            <div className="w-9 h-9 rounded-xl bg-pink-50 text-[#DE5795] flex items-center justify-center">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <h3 className="text-2xl font-black text-gray-900">Rp 46.250</h3>
            <div className="flex items-center gap-1.5 mt-1 text-xs">
              <span className="text-emerald-600 font-bold flex items-center gap-0.5">
                <TrendingUp className="w-3.5 h-3.5" /> +8.5%
              </span>
              <span className="text-gray-400">kontribusi upselling</span>
            </div>
          </div>
          <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between text-[11px] text-gray-500">
            <span>Paket Paling Laris</span>
            <span className="font-bold text-gray-800">Classic 2-Strip (68%)</span>
          </div>
        </div>

        {/* Metric 2: Gross Margin */}
        <div className="p-5 rounded-2xl bg-white border border-gray-200/90 shadow-2xs hover:shadow-md transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Estimasi Margin Kotor</span>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Percent className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <h3 className="text-2xl font-black text-emerald-700">84.6%</h3>
            <div className="flex items-center gap-1.5 mt-1 text-xs">
              <span className="text-gray-500">HPP Kertas Dye-sub:</span>
              <span className="font-bold text-gray-800">~Rp 5.800 / sesi</span>
            </div>
          </div>
          <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between text-[11px] text-gray-500">
            <span>Laba Kotor / Sesi</span>
            <span className="font-bold text-emerald-700">~Rp 39.200</span>
          </div>
        </div>

        {/* Metric 3: Add-on Extra Prints */}
        <div className="p-5 rounded-2xl bg-white border border-gray-200/90 shadow-2xs hover:shadow-md transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Omzet Cetak Ekstra</span>
            <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <Printer className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <h3 className="text-2xl font-black text-gray-900">Rp 14.280.000</h3>
            <div className="flex items-center gap-1.5 mt-1 text-xs">
              <span className="text-purple-600 font-bold">31.4% Tamu</span>
              <span className="text-gray-400">membeli cetak tambahan</span>
            </div>
          </div>
          <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between text-[11px] text-gray-500">
            <span>Harga Cetak Tambahan</span>
            <span className="font-bold text-gray-800">Rp 15.000 / strip</span>
          </div>
        </div>

        {/* Metric 4: Tax & Policy */}
        <div className="p-5 rounded-2xl bg-white border border-gray-200/90 shadow-2xs hover:shadow-md transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Kebijakan Kasir</span>
            <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <h3 className="text-xl font-black text-gray-900">Tax Inclusive</h3>
            <div className="flex items-center gap-1.5 mt-1 text-xs">
              <span className="text-emerald-600 font-bold">PB1 10% Included</span>
              <span className="text-gray-400">• Bebas MDR</span>
            </div>
          </div>
          <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between text-[11px] text-gray-500">
            <span>Pembulatan Kasir</span>
            <span className="font-bold text-gray-800">Rp 1.000 (Tunai)</span>
          </div>
        </div>
      </div>

      {/* Segmented Navigation Tabs */}
      <div className="flex items-center border-b border-gray-200 gap-6">
        <button
          onClick={() => setActiveTab('packages')}
          className={`pb-3.5 text-xs font-bold transition-all border-b-2 flex items-center gap-2 ${
            activeTab === 'packages'
              ? 'border-[#DE5795] text-[#9D174D]'
              : 'border-transparent text-gray-500 hover:text-gray-800'
          }`}
        >
          <Tag className="w-4 h-4" />
          <span>Paket Sesi Foto Dasar</span>
          <span className="px-2 py-0.5 rounded-full text-[10px] bg-pink-100 text-[#9D174D] font-bold">
            {packages.length} Paket
          </span>
        </button>

        <button
          onClick={() => setActiveTab('addons')}
          className={`pb-3.5 text-xs font-bold transition-all border-b-2 flex items-center gap-2 ${
            activeTab === 'addons'
              ? 'border-[#DE5795] text-[#9D174D]'
              : 'border-transparent text-gray-500 hover:text-gray-800'
          }`}
        >
          <Printer className="w-4 h-4" />
          <span>Add-On & Cetak Tambahan</span>
          <span className="px-2 py-0.5 rounded-full text-[10px] bg-purple-100 text-purple-700 font-bold">
            {addOns.length} Opsi
          </span>
        </button>

        <button
          onClick={() => setActiveTab('surge')}
          className={`pb-3.5 text-xs font-bold transition-all border-b-2 flex items-center gap-2 ${
            activeTab === 'surge'
              ? 'border-[#DE5795] text-[#9D174D]'
              : 'border-transparent text-gray-500 hover:text-gray-800'
          }`}
        >
          <Clock className="w-4 h-4" />
          <span>Penyesuaian Jam Ramai / Happy Hour</span>
          <span className="px-2 py-0.5 rounded-full text-[10px] bg-amber-100 text-amber-700 font-bold">
            2 Aturan
          </span>
        </button>

        <button
          onClick={() => setActiveTab('policy')}
          className={`pb-3.5 text-xs font-bold transition-all border-b-2 flex items-center gap-2 ${
            activeTab === 'policy'
              ? 'border-[#DE5795] text-[#9D174D]'
              : 'border-transparent text-gray-500 hover:text-gray-800'
          }`}
        >
          <Receipt className="w-4 h-4" />
          <span>Kebijakan Pajak PB1 & Kasir Kiosk</span>
        </button>
      </div>

      {/* TAB 1: Paket Sesi Foto Dasar */}
      {activeTab === 'packages' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl bg-white border border-gray-200/90 shadow-2xs">
            <div>
              <h3 className="text-sm font-bold text-gray-900">Katalog Pilihan Paket di Layar Sentuh Booth</h3>
              <p className="text-xs text-gray-500 mt-0.5">
                Pengunjung memilih salah satu paket ini saat pertama kali menekan layar booth untuk memulai sesi foto.
              </p>
            </div>
            <button
              onClick={handleOpenCreateDrawer}
              className="px-4 py-2 bg-[#DE5795] hover:bg-[#c94982] text-white text-xs font-bold rounded-xl transition-colors shrink-0 shadow-xs"
            >
              + Tambah Paket
            </button>
          </div>

          {/* Grid of Packages */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {packages.map((pkg) => {
              const grossProfit = pkg.basePrice - pkg.paperCostEstimate;
              const marginPercent = Math.round((grossProfit / pkg.basePrice) * 100);

              return (
                <div
                  key={pkg.id}
                  className={`rounded-2xl border bg-white p-5 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between relative ${
                    pkg.isPopular ? 'border-[#DE5795] ring-2 ring-pink-100' : 'border-gray-200/90'
                  } ${!pkg.isActive && 'opacity-60 bg-gray-50/70'}`}
                >
                  {/* Badge */}
                  {pkg.badge && (
                    <div className="absolute -top-3 left-4">
                      <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-gradient-to-r from-pink-500 to-[#DE5795] text-white shadow-xs">
                        {pkg.badge}
                      </span>
                    </div>
                  )}

                  <div className="space-y-4 pt-2">
                    {/* Header info */}
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h4 className="font-bold text-gray-900 text-base">{pkg.name}</h4>
                        <p className="text-xs text-gray-500 mt-0.5">{pkg.tagline}</p>
                      </div>

                      {/* Active Status Toggle */}
                      <button
                        onClick={() => togglePackageActive(pkg.id)}
                        className={`w-9 h-5 rounded-full transition-colors relative shrink-0 ${
                          pkg.isActive ? 'bg-[#DE5795]' : 'bg-gray-300'
                        }`}
                        title={pkg.isActive ? 'Klik untuk nonaktifkan' : 'Klik untuk aktifkan'}
                      >
                        <span
                          className={`w-4 h-4 rounded-full bg-white absolute top-0.5 transition-transform ${
                            pkg.isActive ? 'left-4.5' : 'left-0.5'
                          }`}
                        />
                      </button>
                    </div>

                    {/* Price Tag */}
                    <div className="p-3 rounded-xl bg-gray-50 border border-gray-100 flex items-baseline justify-between">
                      <div>
                        <span className="text-[10px] text-gray-400 uppercase font-bold block">Tarif Sesi</span>
                        <span className="text-xl font-black text-gray-900">{formatRupiah(pkg.basePrice)}</span>
                      </div>
                      <span className="text-[11px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                        Margin {marginPercent}%
                      </span>
                    </div>

                    {/* Package Specs */}
                    <div className="space-y-2 text-xs border-t border-gray-100 pt-3">
                      <div className="flex items-center justify-between text-gray-600">
                        <span className="flex items-center gap-1.5">
                          <Camera className="w-3.5 h-3.5 text-[#DE5795]" />
                          Jumlah Pose:
                        </span>
                        <strong className="text-gray-900">{pkg.defaultPoseCount} Pose</strong>
                      </div>

                      <div className="flex items-center justify-between text-gray-600">
                        <span className="flex items-center gap-1.5">
                          <Printer className="w-3.5 h-3.5 text-purple-600" />
                          Lembar Cetak:
                        </span>
                        <strong className="text-gray-900">
                          {pkg.printCopiesCount} {pkg.paperFormat === 'STRIP_2X6' ? 'Strip (2x6")' : 'Lembar (4R)'}
                        </strong>
                      </div>

                      <div className="flex items-center justify-between text-gray-600">
                        <span className="flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5 text-amber-600" />
                          Batas Waktu Sesi:
                        </span>
                        <strong className="text-gray-900">{pkg.sessionDurationSec} Detik</strong>
                      </div>

                      <div className="flex items-center justify-between text-gray-600">
                        <span className="flex items-center gap-1.5">
                          <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                          Boomerang GIF:
                        </span>
                        <strong className={pkg.includesDigitalGif ? 'text-emerald-600 font-bold' : 'text-gray-400'}>
                          {pkg.includesDigitalGif ? 'Termasuk' : 'Tidak Ada'}
                        </strong>
                      </div>
                    </div>

                    {/* HPP Breakdown */}
                    <div className="p-2.5 rounded-xl bg-gray-50/80 border border-gray-100 text-[11px] space-y-1 text-gray-500">
                      <div className="flex items-center justify-between">
                        <span>Estimasi HPP Kertas:</span>
                        <span className="font-bold text-gray-800">{formatRupiah(pkg.paperCostEstimate)}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Estimasi Laba Kotor:</span>
                        <span className="font-bold text-emerald-700">{formatRupiah(grossProfit)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Card Bottom Actions */}
                  <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between">
                    <span className="text-[11px] text-gray-400">
                      {pkg.isActive ? '● Tayang di Kiosk' : '● Disembunyikan'}
                    </span>

                    <button
                      onClick={() => handleOpenEditDrawer(pkg)}
                      className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 hover:text-[#DE5795] text-xs font-semibold transition-colors"
                    >
                      <Edit2 className="w-3 h-3" />
                      <span>Edit Paket</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 2: Add-On & Cetak Tambahan */}
      {activeTab === 'addons' && (
        <div className="space-y-6">
          <div className="p-5 rounded-2xl bg-white border border-gray-200/90 shadow-2xs">
            <h3 className="text-base font-bold text-gray-900">
              Layanan Tambahan & Cetak Ekstra di Layar Kios (*Upselling*)
            </h3>
            <p className="text-xs text-gray-500 mt-1">
              Setelah selesai berpose, layar sentuh kios akan menawarkan opsi tambahan ini sebelum pengunjung melakukan pembayaran via QRIS atau Tunai.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {addOns.map((addon) => {
              const addonMargin = addon.price - addon.costEstimate;
              const marginPercent = Math.round((addonMargin / addon.price) * 100);

              return (
                <div
                  key={addon.id}
                  className="p-5 rounded-2xl bg-white border border-gray-200/90 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-gray-900 text-sm">{addon.name}</h4>
                          {addon.isUpsellOnKiosk && (
                            <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-pink-50 text-[#9D174D] border border-pink-200">
                              Kiosk Upsell
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-gray-500 mt-1">{addon.description}</p>
                      </div>

                      <button
                        onClick={() => toggleAddonActive(addon.id)}
                        className={`w-9 h-5 rounded-full transition-colors relative shrink-0 ${
                          addon.isActive ? 'bg-[#DE5795]' : 'bg-gray-300'
                        }`}
                        title={addon.isActive ? 'Klik untuk nonaktifkan' : 'Klik untuk aktifkan'}
                      >
                        <span
                          className={`w-4 h-4 rounded-full bg-white absolute top-0.5 transition-transform ${
                            addon.isActive ? 'left-4.5' : 'left-0.5'
                          }`}
                        />
                      </button>
                    </div>

                    <div className="grid grid-cols-3 gap-2 p-3 rounded-xl bg-gray-50 border border-gray-100 text-xs">
                      <div>
                        <span className="text-[10px] text-gray-400 uppercase font-bold block">Harga Jual</span>
                        <span className="font-bold text-gray-900">{formatRupiah(addon.price)}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-gray-400 uppercase font-bold block">Estimasi HPP</span>
                        <span className="font-bold text-gray-600">{formatRupiah(addon.costEstimate)}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-gray-400 uppercase font-bold block">Margin Keuntungan</span>
                        <span className="font-bold text-emerald-700">{marginPercent}%</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-[11px] text-gray-500">
                    <span>Satuan: {addon.unit}</span>
                    <button
                      onClick={() => showToast(`Fitur ubah harga add-on "${addon.name}" tersimpan`)}
                      className="font-bold text-[#DE5795] hover:text-[#9D174D]"
                    >
                      Ubah Tarif Add-On
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 3: Penyesuaian Jam Ramai / Happy Hour */}
      {activeTab === 'surge' && (
        <div className="space-y-6">
          <div className="p-5 rounded-2xl bg-white border border-gray-200/90 shadow-2xs">
            <h3 className="text-base font-bold text-gray-900">
              Penyesuaian Tarif Waktu Khusus (Dynamic & Surge Pricing)
            </h3>
            <p className="text-xs text-gray-500 mt-1">
              Atur harga promo otomatis pada jam sepi mall (*Happy Hour Pelajar*) atau penambahan harga pada saat akhir pekan ramai tanpa perlu mengubah satu per satu.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {surgeRules.map((rule) => (
              <div
                key={rule.id}
                className="p-5 rounded-2xl bg-white border border-gray-200/90 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                          rule.type === 'HAPPY_HOUR_DISCOUNT'
                            ? 'bg-blue-50 text-blue-700 border-blue-200'
                            : 'bg-amber-50 text-amber-700 border-amber-200'
                        }`}
                      >
                        {rule.type === 'HAPPY_HOUR_DISCOUNT' ? 'Diskon Otomatis' : 'Surcharge Akhir Pekan'}
                      </span>
                      <h4 className="font-bold text-gray-900 text-sm mt-2">{rule.name}</h4>
                      <p className="text-xs text-gray-500 mt-1">{rule.description}</p>
                    </div>

                    <button
                      onClick={() => toggleSurgeActive(rule.id)}
                      className={`w-9 h-5 rounded-full transition-colors relative shrink-0 ${
                        rule.isActive ? 'bg-[#DE5795]' : 'bg-gray-300'
                      }`}
                      title={rule.isActive ? 'Klik untuk nonaktifkan' : 'Klik untuk aktifkan'}
                    >
                      <span
                        className={`w-4 h-4 rounded-full bg-white absolute top-0.5 transition-transform ${
                          rule.isActive ? 'left-4.5' : 'left-0.5'
                        }`}
                      />
                    </button>
                  </div>

                  <div className="p-3 rounded-xl bg-gray-50 border border-gray-100 space-y-1.5 text-xs">
                    <div className="flex items-center justify-between text-gray-600">
                      <span>Nilai Penyesuaian:</span>
                      <strong className={rule.adjustmentType.includes('DISCOUNT') ? 'text-emerald-600 font-bold' : 'text-amber-700 font-bold'}>
                        {rule.adjustmentType.includes('DISCOUNT') ? '-' : '+'}{formatRupiah(rule.adjustmentValue)}
                      </strong>
                    </div>

                    <div className="flex items-center justify-between text-gray-600">
                      <span>Hari Aktif:</span>
                      <strong className="text-gray-900">{rule.daysActive.join(', ')}</strong>
                    </div>

                    <div className="flex items-center justify-between text-gray-600">
                      <span>Rentang Jam:</span>
                      <strong className="text-gray-900">{rule.timeStart} - {rule.timeEnd} WIB</strong>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-[11px]">
                  <span className={rule.isActive ? 'text-emerald-600 font-semibold' : 'text-gray-400'}>
                    {rule.isActive ? '● Aturan Sedang Berjalan' : '● Aturan Dinonaktifkan'}
                  </span>
                  <button
                    onClick={() => showToast(`Edit jadwal untuk ${rule.name}`)}
                    className="font-bold text-[#DE5795] hover:text-[#9D174D]"
                  >
                    Edit Jadwal & Jam
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: Kebijakan Pajak PB1 & Kasir Kiosk */}
      {activeTab === 'policy' && (
        <div className="space-y-6">
          <div className="p-6 rounded-2xl bg-white border border-gray-200/90 shadow-2xs space-y-6 max-w-3xl">
            <div>
              <h3 className="text-base font-bold text-gray-900">
                Kebijakan Pajak Restoran / Hiburan (PB1) & Kasir
              </h3>
              <p className="text-xs text-gray-500 mt-1">
                Aturan pembebanan pajak dan biaya transaksi pada tagihan yang dicetak di struk kasir pengunjung.
              </p>
            </div>

            <div className="space-y-4 text-xs">
              {/* Option 1: Tax Inclusive */}
              <div className="p-4 rounded-xl border border-gray-200 flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <h4 className="font-bold text-gray-900 text-sm">Harga Sudah Termasuk Pajak PB1 (Tax-Inclusive)</h4>
                  <p className="text-gray-500 leading-relaxed">
                    Pengunjung membayar tepat sesuai harga paket yang tertera (contoh Rp 35.000). Rincian PB1 10% dihitung mundur otomatis pada struk untuk pelaporan pajak daerah.
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={taxPolicy.isTaxIncludedInPrice}
                  onChange={(e) => {
                    setTaxPolicy({ ...taxPolicy, isTaxIncludedInPrice: e.target.checked });
                    showToast('Kebijakan PB1 berhasil diperbarui');
                  }}
                  className="w-5 h-5 accent-[#DE5795] rounded mt-1 shrink-0"
                />
              </div>

              {/* Option 2: Absorb QRIS MDR */}
              <div className="p-4 rounded-xl border border-gray-200 flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <h4 className="font-bold text-gray-900 text-sm">Bebaskan Biaya MDR QRIS 0.7% untuk Tamu</h4>
                  <p className="text-gray-500 leading-relaxed">
                    Vendor menanggung biaya pemrosesan QRIS Bank Indonesia (0.7%). Pengunjung tidak dikenakan biaya tambahan saat scan QRIS di layar kiosk.
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={taxPolicy.absorbQrisMdr}
                  onChange={(e) => {
                    setTaxPolicy({ ...taxPolicy, absorbQrisMdr: e.target.checked });
                    showToast('Kebijakan MDR QRIS berhasil diperbarui');
                  }}
                  className="w-5 h-5 accent-[#DE5795] rounded mt-1 shrink-0"
                />
              </div>

              {/* Option 3: Cash Rounding Unit */}
              <div className="p-4 rounded-xl border border-gray-200 space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-gray-900 text-sm">Pembulatan Nominal Kasir Uang Tunai</h4>
                  <span className="text-xs font-bold text-gray-700">Rp 1.000</span>
                </div>
                <p className="text-gray-500 leading-relaxed">
                  Menghindari pecahan kecil koin pada mesin bill acceptor atau uang kembalian kasir.
                </p>
              </div>
            </div>

            <div className="pt-4 border-t border-gray-100 flex items-center justify-end">
              <button
                onClick={() => showToast('Seluruh konfigurasi kebijakan kasir berhasil disimpan!')}
                className="px-5 py-2.5 rounded-xl bg-[#DE5795] hover:bg-[#c94982] text-white text-xs font-bold shadow-xs"
              >
                Simpan Perubahan Kebijakan
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* DRAWER: Tambah / Edit Paket Sesi Foto                     */}
      {/* ======================================================== */}
      {isPackageDrawerOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          <div
            className="absolute inset-0 bg-gray-900/40 backdrop-blur-xs transition-opacity animate-in fade-in"
            onClick={() => setIsPackageDrawerOpen(false)}
          />

          <div className="fixed inset-y-0 right-0 max-w-full flex pl-6 sm:pl-10 p-3 sm:p-4 pointer-events-none">
            <div className="w-screen max-w-md pointer-events-auto rounded-3xl bg-white shadow-2xl border border-gray-100 flex flex-col justify-between overflow-hidden animate-in slide-in-from-right duration-300">
              {/* Header */}
              <div className="px-8 pt-7 pb-7.5 border-b border-gray-100 flex items-center justify-between bg-gradient-to-b from-pink-50/50 to-white">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-pink-100 text-[#9D174D] flex items-center justify-center font-bold">
                    <Tag className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-gray-900">
                      {editingPackage ? 'Edit Paket Sesi Foto' : 'Tambah Paket Baru'}
                    </h3>
                    <p className="text-xs text-gray-400">Tampil otomatis pada touchscreen seluruh booth</p>
                  </div>
                </div>

                <button
                  onClick={() => setIsPackageDrawerOpen(false)}
                  className="p-2 rounded-xl text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Form Content */}
              <div className="flex-1 overflow-y-auto px-8 py-6 space-y-4 text-xs">
                <div>
                  <label className="font-bold text-gray-700 block mb-1">Nama Paket Sesi*</label>
                  <input
                    type="text"
                    placeholder="Contoh: Classic 2-Strip Photo"
                    value={formData.name || ''}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 font-semibold focus:border-[#DE5795] focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="font-bold text-gray-700 block mb-1">Tagline Ringkas</label>
                  <input
                    type="text"
                    placeholder="Contoh: Format favorit pasangan & sahabat"
                    value={formData.tagline || ''}
                    onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 focus:border-[#DE5795] focus:outline-hidden"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-gray-700 block mb-1">Harga Dasar (Rp)*</label>
                    <input
                      type="number"
                      placeholder="35000"
                      value={formData.basePrice || ''}
                      onChange={(e) => setFormData({ ...formData, basePrice: Number(e.target.value) })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 font-bold text-[#DE5795] focus:border-[#DE5795] focus:outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-gray-700 block mb-1">Format Kertas Cetak</label>
                    <select
                      value={formData.paperFormat || 'STRIP_2X6'}
                      onChange={(e) => setFormData({ ...formData, paperFormat: e.target.value as any })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 bg-white font-medium focus:border-[#DE5795] focus:outline-hidden"
                    >
                      <option value="STRIP_2X6">Photo Strip (2 x 6 Inch)</option>
                      <option value="POSTCARD_4R">Postcard Tunggal (4 x 6 Inch / 4R)</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-gray-700 block mb-1">Jumlah Pose Foto</label>
                    <input
                      type="number"
                      placeholder="4"
                      value={formData.defaultPoseCount || 4}
                      onChange={(e) => setFormData({ ...formData, defaultPoseCount: Number(e.target.value) })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 font-bold focus:border-[#DE5795] focus:outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-gray-700 block mb-1">Lembar Cetak Otomatis</label>
                    <input
                      type="number"
                      placeholder="2"
                      value={formData.printCopiesCount || 2}
                      onChange={(e) => setFormData({ ...formData, printCopiesCount: Number(e.target.value) })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 font-bold focus:border-[#DE5795] focus:outline-hidden"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-gray-700 block mb-1">Durasi Sesi (Detik)</label>
                    <input
                      type="number"
                      placeholder="120"
                      value={formData.sessionDurationSec || 120}
                      onChange={(e) => setFormData({ ...formData, sessionDurationSec: Number(e.target.value) })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 focus:border-[#DE5795] focus:outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-gray-700 block mb-1">HPP Kertas (Rp)</label>
                    <input
                      type="number"
                      placeholder="5800"
                      value={formData.paperCostEstimate || 5800}
                      onChange={(e) => setFormData({ ...formData, paperCostEstimate: Number(e.target.value) })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 focus:border-[#DE5795] focus:outline-hidden"
                    />
                  </div>
                </div>

                <div>
                  <label className="font-bold text-gray-700 block mb-1">Badge Promosi (Opsional)</label>
                  <input
                    type="text"
                    placeholder="Contoh: Paling Populer, Favorit Gen-Z"
                    value={formData.badge || ''}
                    onChange={(e) => setFormData({ ...formData, badge: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 focus:border-[#DE5795] focus:outline-hidden"
                  />
                </div>

                {/* Digital Perks Switches */}
                <div className="space-y-2 pt-2 border-t border-gray-100">
                  <span className="font-bold text-gray-700 block">Fitur Digital Tambahan:</span>

                  <label className="flex items-center justify-between p-2.5 rounded-xl bg-gray-50 border border-gray-100 cursor-pointer">
                    <span className="font-medium text-gray-700">Sertakan Boomerang GIF Bergerak</span>
                    <input
                      type="checkbox"
                      checked={formData.includesDigitalGif}
                      onChange={(e) => setFormData({ ...formData, includesDigitalGif: e.target.checked })}
                      className="w-4 h-4 accent-[#DE5795] rounded"
                    />
                  </label>

                  <label className="flex items-center justify-between p-2.5 rounded-xl bg-gray-50 border border-gray-100 cursor-pointer">
                    <span className="font-medium text-gray-700">Download High-Res via Cloud QR Code</span>
                    <input
                      type="checkbox"
                      checked={formData.includesHighResDownload}
                      onChange={(e) => setFormData({ ...formData, includesHighResDownload: e.target.checked })}
                      className="w-4 h-4 accent-[#DE5795] rounded"
                    />
                  </label>
                </div>
              </div>

              {/* Footer */}
              <div className="px-8 pt-5.5 pb-7 border-t border-gray-100 bg-white flex items-center justify-between gap-3">
                <button
                  onClick={() => setIsPackageDrawerOpen(false)}
                  className="px-4 py-2.5 text-xs font-semibold text-gray-600 hover:text-gray-900"
                >
                  Batal
                </button>

                <button
                  onClick={handleSavePackage}
                  className="px-5 py-2.5 rounded-xl bg-[#DE5795] hover:bg-[#c94982] text-white text-xs font-bold shadow-xs"
                >
                  {editingPackage ? 'Simpan Perubahan' : 'Rilis Paket ke Kiosk'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL: Simulasi Tampilan Layar Sentuh Kiosk Tamu         */}
      {/* ======================================================== */}
      {isSimulatorOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-gray-900/60 backdrop-blur-xs transition-opacity animate-in fade-in"
            onClick={() => setIsSimulatorOpen(false)}
          />

          <div className="relative w-full max-w-4xl bg-gray-950 rounded-3xl p-6 shadow-2xl border border-gray-800 text-white z-10 space-y-6 animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-gray-800 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
                <div>
                  <h3 className="font-bold text-base text-white">Live Simulator: Layar Sentuh Pemilihan Paket Tamu</h3>
                  <p className="text-xs text-gray-400">Resolusi Kiosk Vertikal Full-HD 1080 x 1920</p>
                </div>
              </div>

              <button
                onClick={() => setIsSimulatorOpen(false)}
                className="p-1.5 rounded-xl text-gray-400 hover:text-white hover:bg-gray-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Simulated Kiosk Screen Body */}
            <div className="bg-gradient-to-b from-gray-900 via-purple-950/30 to-gray-900 rounded-2xl p-6 border border-gray-800/80 space-y-6">
              <div className="text-center space-y-2">
                <span className="px-3 py-1 rounded-full bg-pink-500/20 text-pink-300 text-[11px] font-bold border border-pink-500/30">
                  Langkah 1 dari 4: Pilih Paket Foto
                </span>
                <h2 className="text-2xl font-black text-white">Pilih Format & Paket Sesi Fotomu!</h2>
                <p className="text-xs text-gray-400">Tekan salah satu kartu di bawah ini untuk memulai sesi berpose</p>
              </div>

              {/* Kiosk Package Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {packages.filter((p) => p.isActive).map((pkg) => (
                  <div
                    key={pkg.id}
                    className="p-5 rounded-2xl bg-gray-900/90 border border-gray-700/80 hover:border-[#DE5795] hover:ring-2 hover:ring-pink-500/30 transition-all cursor-pointer group flex flex-col justify-between"
                  >
                    <div className="space-y-3">
                      {pkg.badge && (
                        <span className="inline-block px-2 py-0.5 rounded-md text-[9px] font-bold bg-[#DE5795] text-white">
                          {pkg.badge}
                        </span>
                      )}
                      <div>
                        <h4 className="font-bold text-white text-base group-hover:text-pink-300 transition-colors">
                          {pkg.name}
                        </h4>
                        <p className="text-[11px] text-gray-400 mt-1">{pkg.tagline}</p>
                      </div>

                      <div className="pt-2 text-xs space-y-1 text-gray-300">
                        <p>📸 {pkg.defaultPoseCount} Pose Bergantian</p>
                        <p>🖨️ {pkg.printCopiesCount} Strip Cetak Otomatis</p>
                        <p>⏱️ {pkg.sessionDurationSec} Detik Sesi</p>
                      </div>
                    </div>

                    <div className="mt-4 pt-3 border-t border-gray-800 flex items-center justify-between">
                      <span className="text-lg font-black text-[#DE5795]">{formatRupiah(pkg.basePrice)}</span>
                      <span className="text-[11px] px-2 py-1 rounded-lg bg-pink-500/20 text-pink-300 font-bold">
                        PILIH ➔
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between text-xs text-gray-400 pt-2">
              <span>*Tampilan ini sinkron secara langsung dengan perubahan harga yang Anda lakukan.</span>
              <button
                onClick={() => setIsSimulatorOpen(false)}
                className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white font-bold rounded-xl"
              >
                Tutup Simulator
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
