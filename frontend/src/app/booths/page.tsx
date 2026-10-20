'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  Store,
  Printer,
  Camera,
  Wifi,
  MapPin,
  Plus,
  Search,
  RefreshCw,
  Activity,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Sliders,
  Edit2,
  Trash2,
  X,
  Check,
  ExternalLink,
  Power,
  Radio,
  Clock,
  Sparkles,
  Server,
  Layers,
} from 'lucide-react';

export interface BoothUnit {
  id: string;
  code: string;
  name: string;
  location: string;
  status: 'ONLINE' | 'IN_SESSION' | 'OFFLINE' | 'MAINTENANCE' | 'REBOOTING';
  paperCount: number;
  maxPaperCapacity: number;
  printerModel: string;
  cameraBrand: 'Canon' | 'Sony';
  cameraModel: string;
  cameraResolution: string;
  ipAddress: string;
  wifiSsid: string;
  pingLatency: number | null;
  lastPing: string;
  notes?: string;
  createdAt: string;
}

const INITIAL_BOOTHS: BoothUnit[] = [
  {
    id: 'bth-001',
    code: 'PB-JKT-01',
    name: 'Booth Alpha - Grand Indonesia',
    location: 'Grand Indonesia Mall Lt. 3A (East Mall), Jakarta Pusat',
    status: 'ONLINE',
    paperCount: 650,
    maxPaperCapacity: 700,
    printerModel: 'DNP DS620A Dye-Sublimation',
    cameraBrand: 'Canon',
    cameraModel: 'Canon EOS R100',
    cameraResolution: '24.1 MP Dual Pixel AF',
    ipAddress: '192.168.1.101',
    wifiSsid: 'PhotoBooth_GI_5G',
    pingLatency: 14,
    lastPing: '10 detik lalu',
    notes: 'Kondisi prima, baru dibersihkan dan dicek teknisi pagi ini.',
    createdAt: '2026-10-01',
  },
  {
    id: 'bth-002',
    code: 'PB-JKT-02',
    name: 'Booth Beta - Central Park',
    location: 'Central Park Mall LG Promenade, Jakarta Barat',
    status: 'IN_SESSION',
    paperCount: 420,
    maxPaperCapacity: 700,
    printerModel: 'Citizen CY-02 High Speed',
    cameraBrand: 'Sony',
    cameraModel: 'Sony Alpha A6400',
    cameraResolution: '24.2 MP Real-time Eye AF',
    ipAddress: '192.168.1.102',
    wifiSsid: 'PhotoBooth_CP_5G',
    pingLatency: 18,
    lastPing: '5 detik lalu',
    notes: 'Sedang melayani sesi foto wedding event.',
    createdAt: '2026-10-05',
  },
  {
    id: 'bth-003',
    code: 'PB-BDG-01',
    name: 'Booth Gamma - Paris Van Java',
    location: 'PVJ Bandung Resort Level GL-12, Bandung',
    status: 'ONLINE',
    paperCount: 180,
    maxPaperCapacity: 700,
    printerModel: 'HiTi P525L Wireless Studio',
    cameraBrand: 'Canon',
    cameraModel: 'Canon EOS 200D II',
    cameraResolution: '24.1 MP Digic 8',
    ipAddress: '192.168.2.55',
    wifiSsid: 'PhotoBooth_PVJ_Mesh',
    pingLatency: 28,
    lastPing: '1 menit lalu',
    notes: 'Sisa kertas tinggal 180 lembar, siapkan cadangan roll di venue.',
    createdAt: '2026-10-10',
  },
  {
    id: 'bth-004',
    code: 'PB-SBY-01',
    name: 'Booth Delta - Tunjungan Plaza',
    location: 'Tunjungan Plaza 6 Lt. 4, Surabaya',
    status: 'OFFLINE',
    paperCount: 85,
    maxPaperCapacity: 700,
    printerModel: 'DNP DS-RX1HS Heavy Duty',
    cameraBrand: 'Sony',
    cameraModel: 'Sony ZV-E10 Mirrorless',
    cameraResolution: '24.2 MP Fast Hybrid',
    ipAddress: '192.168.3.110',
    wifiSsid: 'PhotoBooth_TP_WiFi',
    pingLatency: null,
    lastPing: '15 menit lalu',
    notes: 'Koneksi jaringan terputus sementara. Perlu cek switch router.',
    createdAt: '2026-10-12',
  },
  {
    id: 'bth-005',
    code: 'PB-BALI-01',
    name: 'Booth Epsilon - Beachwalk Bali',
    location: 'Beachwalk Shopping Center Kuta, Bali',
    status: 'MAINTENANCE',
    paperCount: 700,
    maxPaperCapacity: 700,
    printerModel: 'Citizen CY-02 High Speed',
    cameraBrand: 'Canon',
    cameraModel: 'Canon EOS R50',
    cameraResolution: '24.2 MP 4K Dual Pixel II',
    ipAddress: '192.168.4.20',
    wifiSsid: 'PhotoBooth_BW_Mesh',
    pingLatency: 35,
    lastPing: '2 menit lalu',
    notes: 'Jadwal kalibrasi sensor printer dan pembaruan firmware kamera.',
    createdAt: '2026-10-15',
  },
];

const PRINTER_OPTIONS = [
  'DNP DS620A Dye-Sublimation',
  'Citizen CY-02 High Speed',
  'HiTi P525L Wireless Studio',
  'DNP DS-RX1HS Heavy Duty',
  'Fujifilm ASK-300 Compact',
];

const CAMERA_OPTIONS = [
  { brand: 'Canon' as const, model: 'Canon EOS R100', resolution: '24.1 MP Dual Pixel AF' },
  { brand: 'Canon' as const, model: 'Canon EOS R50', resolution: '24.2 MP 4K Dual Pixel II' },
  { brand: 'Canon' as const, model: 'Canon EOS 200D II', resolution: '24.1 MP Digic 8' },
  { brand: 'Sony' as const, model: 'Sony Alpha A6400', resolution: '24.2 MP Real-time Eye AF' },
  { brand: 'Sony' as const, model: 'Sony ZV-E10 Mirrorless', resolution: '24.2 MP Fast Hybrid' },
];

export default function BoothsPage() {
  const [booths, setBooths] = useState<BoothUnit[]>(INITIAL_BOOTHS);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'ONLINE' | 'IN_SESSION' | 'OFFLINE' | 'MAINTENANCE'>('ALL');
  
  // Drawer CRUD States
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [editingBooth, setEditingBooth] = useState<BoothUnit | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [rebootingId, setRebootingId] = useState<string | null>(null);

  // Ping Loading state per booth id
  const [pingingId, setPingingId] = useState<string | null>(null);

  // Toast state
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Drawer Form fields
  const [formCode, setFormCode] = useState('');
  const [formName, setFormName] = useState('');
  const [formLocation, setFormLocation] = useState('');
  const [formStatus, setFormStatus] = useState<BoothUnit['status']>('ONLINE');
  const [formPaperCount, setFormPaperCount] = useState<number>(700);
  const [formMaxPaper, setFormMaxPaper] = useState<number>(700);
  const [formPrinterModel, setFormPrinterModel] = useState(PRINTER_OPTIONS[0]);
  const [formCameraIndex, setFormCameraIndex] = useState<number>(0);
  const [formIpAddress, setFormIpAddress] = useState('192.168.1.');
  const [formWifiSsid, setFormWifiSsid] = useState('PhotoBooth_WiFi_5G');
  const [formNotes, setFormNotes] = useState('');

  // Handle open Drawer for Create
  const handleOpenCreateDrawer = () => {
    setEditingBooth(null);
    setFormCode(`PB-ID-${String(booths.length + 1).padStart(2, '0')}`);
    setFormName('');
    setFormLocation('');
    setFormStatus('ONLINE');
    setFormPaperCount(700);
    setFormMaxPaper(700);
    setFormPrinterModel(PRINTER_OPTIONS[0]);
    setFormCameraIndex(0);
    setFormIpAddress(`192.168.1.${100 + booths.length + 1}`);
    setFormWifiSsid('PhotoBooth_Mesh_5G');
    setFormNotes('');
    setIsDrawerOpen(true);
  };

  // Handle open Drawer for Edit
  const handleOpenEditDrawer = (booth: BoothUnit) => {
    setEditingBooth(booth);
    setFormCode(booth.code);
    setFormName(booth.name);
    setFormLocation(booth.location);
    setFormStatus(booth.status);
    setFormPaperCount(booth.paperCount);
    setFormMaxPaper(booth.maxPaperCapacity);
    setFormPrinterModel(booth.printerModel);
    
    const camIdx = CAMERA_OPTIONS.findIndex((c) => c.model === booth.cameraModel);
    setFormCameraIndex(camIdx >= 0 ? camIdx : 0);
    setFormIpAddress(booth.ipAddress);
    setFormWifiSsid(booth.wifiSsid);
    setFormNotes(booth.notes || '');
    setIsDrawerOpen(true);
  };

  // Save Booth from Drawer
  const handleSaveBooth = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim() || !formCode.trim()) return;

    const selectedCamera = CAMERA_OPTIONS[formCameraIndex] || CAMERA_OPTIONS[0];

    if (editingBooth) {
      setBooths((prev) =>
        prev.map((b) =>
          b.id === editingBooth.id
            ? {
                ...b,
                code: formCode,
                name: formName,
                location: formLocation,
                status: formStatus,
                paperCount: formPaperCount,
                maxPaperCapacity: formMaxPaper,
                printerModel: formPrinterModel,
                cameraBrand: selectedCamera.brand,
                cameraModel: selectedCamera.model,
                cameraResolution: selectedCamera.resolution,
                ipAddress: formIpAddress,
                wifiSsid: formWifiSsid,
                notes: formNotes,
              }
            : b
        )
      );
      showToast(`Unit booth "${formName}" berhasil diperbarui!`);
    } else {
      const newBooth: BoothUnit = {
        id: `bth-${Date.now()}`,
        code: formCode,
        name: formName,
        location: formLocation,
        status: formStatus,
        paperCount: formPaperCount,
        maxPaperCapacity: formMaxPaper,
        printerModel: formPrinterModel,
        cameraBrand: selectedCamera.brand,
        cameraModel: selectedCamera.model,
        cameraResolution: selectedCamera.resolution,
        ipAddress: formIpAddress,
        wifiSsid: formWifiSsid,
        pingLatency: 16,
        lastPing: 'Baru saja',
        notes: formNotes,
        createdAt: new Date().toISOString().split('T')[0],
      };
      setBooths((prev) => [newBooth, ...prev]);
      showToast(`Unit booth baru "${formName}" berhasil ditambahkan!`);
    }
    setIsDrawerOpen(false);
  };

  // Quick Refill Paper
  const handleQuickRefill = (id: string, name: string) => {
    setBooths((prev) =>
      prev.map((b) => (b.id === id ? { ...b, paperCount: b.maxPaperCapacity } : b))
    );
    showToast(`Roll kertas untuk "${name}" berhasil diisi ulang (700 lembar)!`);
  };

  // Ping Booth Machine Simulation
  const handlePingBooth = (booth: BoothUnit) => {
    if (booth.status === 'OFFLINE') {
      showToast(`Ping gagal: Unit "${booth.name}" sedang OFFLINE / unreachable.`);
      return;
    }
    setPingingId(booth.id);
    setTimeout(() => {
      setPingingId(null);
      const simulatedLatency = Math.floor(Math.random() * 18) + 10;
      setBooths((prev) =>
        prev.map((b) =>
          b.id === booth.id
            ? { ...b, pingLatency: simulatedLatency, lastPing: 'Baru saja' }
            : b
        )
      );
      showToast(`Ping ${booth.ipAddress} Sukses! RTT: ${simulatedLatency}ms (Jaringan Stabil 100%)`);
    }, 800);
  };

  // Remote Restart Machine Simulation
  const handleRemoteRestart = (booth: BoothUnit) => {
    setRebootingId(booth.id);
    setBooths((prev) =>
      prev.map((b) => (b.id === booth.id ? { ...b, status: 'REBOOTING' } : b))
    );
    showToast(`Perintah Remote Restart dikirim ke ${booth.name}...`);

    setTimeout(() => {
      setBooths((prev) =>
        prev.map((b) => (b.id === booth.id ? { ...b, status: 'ONLINE', pingLatency: 12, lastPing: 'Baru saja' } : b))
      );
      setRebootingId(null);
      showToast(`Unit "${booth.name}" berhasil reboot dan kembali ONLINE!`);
    }, 3200);
  };

  // Delete Booth
  const handleDeleteBooth = (id: string) => {
    const target = booths.find((b) => b.id === id);
    setBooths((prev) => prev.filter((b) => b.id !== id));
    setDeleteConfirmId(null);
    showToast(`Unit booth "${target?.name || id}" berhasil dihapus.`);
  };

  // Filtered List
  const filteredBooths = useMemo(() => {
    return booths.filter((booth) => {
      const matchSearch =
        booth.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        booth.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
        booth.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
        booth.ipAddress.includes(searchQuery) ||
        booth.cameraModel.toLowerCase().includes(searchQuery.toLowerCase());

      if (!matchSearch) return false;

      if (statusFilter === 'ALL') return true;
      if (statusFilter === 'ONLINE') return booth.status === 'ONLINE';
      if (statusFilter === 'IN_SESSION') return booth.status === 'IN_SESSION';
      if (statusFilter === 'OFFLINE') return booth.status === 'OFFLINE';
      if (statusFilter === 'MAINTENANCE') return booth.status === 'MAINTENANCE';
      return true;
    });
  }, [booths, searchQuery, statusFilter]);

  // Executive Metrics
  const totalCount = booths.length;
  const onlineCount = booths.filter((b) => b.status === 'ONLINE' || b.status === 'IN_SESSION').length;
  const inSessionCount = booths.filter((b) => b.status === 'IN_SESSION').length;
  const criticalPaperCount = booths.filter((b) => b.paperCount <= 200).length;

  return (
    <div className="space-y-7 pb-12 font-sora">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-60 bg-gray-900 text-white text-xs px-4 py-3 rounded-2xl shadow-2xl border border-white/10 flex items-center gap-2.5 animate-bounce">
          <Sparkles className="w-4 h-4 text-[#DE5795]" />
          <span className="font-medium">{toastMessage}</span>
        </div>
      )}

      {/* ============================================================ */}
      {/* PAGE HEADER - UNTITLED UI STANDARD                           */}
      {/* ============================================================ */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-200 pb-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-pink-50 text-[#9D174D] border border-pink-200">
              <span className="w-1.5 h-1.5 rounded-full bg-[#DE5795]" />
              {totalCount} Unit Terdaftar
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-semibold text-gray-900 tracking-tight">
            Daftar Unit Booth
          </h1>
          <p className="text-sm text-gray-600 mt-1">
            Pantau status operasional mesin photo booth, sisa roll kertas printer, status kamera DSLR, dan remote control.
          </p>
        </div>

        {/* Action Button Group - Untitled UI Standard */}
        <div className="flex items-center gap-3 shrink-0">
          <Link
            href="/sessions/booth"
            target="_blank"
            className="px-4 py-2 text-sm font-semibold text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 shadow-xs transition-colors flex items-center gap-2"
          >
            <ExternalLink className="w-4 h-4 text-gray-500" />
            <span>Kiosk Booth Tamu</span>
          </Link>

          <button
            onClick={handleOpenCreateDrawer}
            className="px-4 py-2 text-sm font-semibold text-white bg-[#DE5795] hover:bg-[#c93d7e] rounded-lg shadow-xs transition-colors flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah Unit Booth</span>
          </button>
        </div>
      </div>

      {/* ============================================================ */}
      {/* EXECUTIVE KPI METRIC CARDS - UNTITLED UI STANDARD             */}
      {/* ============================================================ */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Total Booth */}
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-xs hover:border-gray-300 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-600">Total Unit Booth</span>
            <div className="w-10 h-10 rounded-lg bg-pink-50 border border-pink-100 flex items-center justify-center text-[#DE5795]">
              <Store className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline justify-between">
            <h3 className="text-3xl font-semibold text-gray-900 tracking-tight">
              {totalCount} <span className="text-lg font-normal text-gray-500">Unit</span>
            </h3>
          </div>
          <div className="mt-3 text-xs text-gray-500">
            Tersebar di 5 mall & venue mitra
          </div>
        </div>

        {/* Online & Siaga */}
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-xs hover:border-gray-300 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-600">Unit Siaga & Berjalan</span>
            <div className="w-10 h-10 rounded-lg bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-700">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline justify-between">
            <h3 className="text-3xl font-semibold text-gray-900 tracking-tight">
              {onlineCount} <span className="text-lg font-normal text-gray-500">Unit</span>
            </h3>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
              {Math.round((onlineCount / totalCount) * 100)}% Siaga
            </span>
          </div>
          <div className="mt-3 flex items-center gap-1.5 text-xs text-emerald-700 font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>Koneksi & kamera normal</span>
          </div>
        </div>

        {/* Sedang Sesi Tamu */}
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-xs hover:border-gray-300 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-600">Sedang Sesi Foto</span>
            <div className="w-10 h-10 rounded-lg bg-pink-50 border border-pink-100 flex items-center justify-center text-[#DE5795]">
              <Camera className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline justify-between">
            <h3 className="text-3xl font-semibold text-gray-900 tracking-tight">
              {inSessionCount} <span className="text-lg font-normal text-gray-500">Sesi Live</span>
            </h3>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-pink-50 text-[#9D174D] border border-pink-200 animate-pulse">
              Live
            </span>
          </div>
          <div className="mt-3 text-xs text-gray-500">
            Capture & countdown aktif
          </div>
        </div>

        {/* Sisa Kertas Kritis */}
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-xs hover:border-gray-300 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-600">Status Kertas Printer</span>
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center border ${
              criticalPaperCount > 0
                ? 'bg-amber-50 text-amber-700 border-amber-200'
                : 'bg-gray-50 text-gray-600 border-gray-200'
            }`}>
              <Printer className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline justify-between">
            <h3 className="text-3xl font-semibold text-gray-900 tracking-tight">
              {criticalPaperCount} <span className="text-lg font-normal text-gray-500">Unit</span>
            </h3>
            {criticalPaperCount > 0 && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-amber-50 text-amber-700 border border-amber-200">
                Perlu Refill
              </span>
            )}
          </div>
          <div className="mt-3 text-xs text-gray-500">
            {criticalPaperCount > 0 ? 'Sisa roll < 200 lembar' : 'Kapasitas semua printer prima'}
          </div>
        </div>
      </div>

      {/* ============================================================ */}
      {/* FILTER & SEARCH BAR - UNTITLED UI STANDARD                   */}
      {/* ============================================================ */}
      <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-xs space-y-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Status Tabs - Segmented Button Group */}
          <div className="p-1 bg-gray-50 border border-gray-200 rounded-lg inline-flex items-center gap-1 overflow-x-auto text-xs">
            {[
              { id: 'ALL', label: 'Semua Booth', count: totalCount },
              { id: 'ONLINE', label: 'Online Siaga', count: booths.filter((b) => b.status === 'ONLINE').length },
              { id: 'IN_SESSION', label: 'Sedang Sesi', count: inSessionCount },
              { id: 'OFFLINE', label: 'Offline', count: booths.filter((b) => b.status === 'OFFLINE').length },
              { id: 'MAINTENANCE', label: 'Perawatan', count: booths.filter((b) => b.status === 'MAINTENANCE').length },
            ].map((tab) => {
              const isActive = statusFilter === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setStatusFilter(tab.id as any)}
                  className={`px-3 py-1.5 rounded-md font-medium transition-all whitespace-nowrap flex items-center gap-1.5 ${
                    isActive
                      ? 'bg-white text-gray-900 shadow-xs border border-gray-200/50 font-semibold'
                      : 'text-gray-500 hover:text-gray-900'
                  }`}
                >
                  <span>{tab.label}</span>
                  <span
                    className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                      isActive ? 'bg-pink-50 text-[#9D174D]' : 'bg-gray-200/70 text-gray-600'
                    }`}
                  >
                    {tab.count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Search Box - Untitled UI Standard */}
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Cari nama booth, mall, atau IP..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm bg-white border border-gray-300 rounded-lg placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#DE5795]/20 focus:border-[#DE5795] shadow-xs"
            />
          </div>
        </div>
      </div>

      {/* ============================================================ */}
      {/* BOOTH UNITS GRID                                              */}
      {/* ============================================================ */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredBooths.map((booth) => {
          const paperPct = Math.round((booth.paperCount / booth.maxPaperCapacity) * 100);
          const isCritical = paperPct <= 25;
          const isRebooting = rebootingId === booth.id || booth.status === 'REBOOTING';
          const isPinging = pingingId === booth.id;

          return (
            <div
              key={booth.id}
              className="rounded-3xl bg-white border border-gray-200 shadow-xs hover:border-[#DE5795] hover:shadow-md transition-all flex flex-col justify-between overflow-hidden group"
            >
              {/* Card Header */}
              <div className="p-5 border-b border-gray-100 bg-gray-50/40 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-[#9D174D] bg-[#DE5795]/15 px-2.5 py-0.5 rounded-lg border border-[#DE5795]/30">
                      {booth.code}
                    </span>
                    <span className="text-[11px] text-gray-400">Unit ID</span>
                  </div>

                  {/* Status Badge */}
                  <div>
                    {isRebooting ? (
                      <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-amber-100 text-amber-800 border border-amber-300 flex items-center gap-1.5 animate-pulse">
                        <RefreshCw className="w-3 h-3 animate-spin" />
                        <span>REBOOTING...</span>
                      </span>
                    ) : booth.status === 'ONLINE' ? (
                      <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                        <span>Siap Pakai</span>
                      </span>
                    ) : booth.status === 'IN_SESSION' ? (
                      <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-[#DE5795] text-white border border-[#c93d7e] flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-white animate-ping" />
                        <span>Sedang Sesi</span>
                      </span>
                    ) : booth.status === 'OFFLINE' ? (
                      <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-red-50 text-red-700 border border-red-200 flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-red-500" />
                        <span>Offline</span>
                      </span>
                    ) : (
                      <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-gray-100 text-gray-700 border border-gray-200">
                        Perawatan
                      </span>
                    )}
                  </div>
                </div>

                <div>
                  <h3 className="text-base font-bold text-gray-900 group-hover:text-[#DE5795] transition-colors">
                    {booth.name}
                  </h3>
                  <div className="flex items-center gap-1.5 text-xs text-gray-500 mt-1">
                    <MapPin className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                    <span className="truncate">{booth.location}</span>
                  </div>
                </div>
              </div>

              {/* Card Body Details */}
              <div className="p-5 space-y-4 text-xs">
                {/* 1. Printer Roll Capacity Indicator */}
                <div className="p-3.5 rounded-2xl bg-gray-50 border border-gray-100 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-white border border-gray-200 flex items-center justify-center text-gray-700 shadow-2xs">
                        <Printer className="w-4 h-4 text-[#DE5795]" />
                      </div>
                      <div>
                        <span className="font-semibold text-gray-900 block">Sisa Roll Kertas</span>
                        <span className="text-[10px] text-gray-400">{booth.printerModel}</span>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="font-mono font-bold text-gray-900 text-sm">
                        {booth.paperCount}
                      </span>
                      <span className="text-[11px] text-gray-400 font-mono"> / {booth.maxPaperCapacity} lbr</span>
                    </div>
                  </div>

                  {/* Progress Bar with Color #DE5795 */}
                  <div className="w-full bg-gray-200 h-2.5 rounded-full overflow-hidden p-0.5">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        isCritical ? 'bg-amber-500' : 'bg-[#DE5795]'
                      }`}
                      style={{ width: `${paperPct}%` }}
                    />
                  </div>

                  <div className="flex items-center justify-between text-[11px]">
                    <span className={isCritical ? 'text-amber-700 font-semibold' : 'text-gray-500'}>
                      {isCritical ? '⚠️ Kertas Menipis' : 'Kapasitas Normal'}
                    </span>
                    <span className="font-bold font-mono text-[#9D174D]">
                      {paperPct}% Tersisa
                    </span>
                  </div>

                  {/* Quick Refill Button */}
                  {booth.paperCount < booth.maxPaperCapacity && (
                    <button
                      onClick={() => handleQuickRefill(booth.id, booth.name)}
                      className="w-full mt-1 py-1.5 px-3 rounded-lg border border-dashed border-gray-300 hover:border-[#DE5795] bg-white text-[11px] font-semibold text-gray-700 hover:text-[#9D174D] flex items-center justify-center gap-1.5 transition-colors shadow-2xs"
                    >
                      <RotateCcw className="w-3 h-3 text-[#DE5795]" />
                      <span>Isi Ulang Roll (Reset ke {booth.maxPaperCapacity} lbr)</span>
                    </button>
                  )}
                </div>

                {/* 2. Camera Status */}
                <div className="p-3 rounded-xl border border-gray-200 bg-white flex items-center justify-between">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-7 h-7 rounded-lg bg-[#DE5795]/10 border border-[#DE5795]/20 flex items-center justify-center text-[#9D174D] shrink-0">
                      <Camera className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-gray-900 truncate">{booth.cameraModel}</span>
                        <span className="px-1.5 py-0.2 rounded text-[9px] font-semibold bg-gray-100 text-gray-600">
                          {booth.cameraBrand}
                        </span>
                      </div>
                      <span className="text-[10px] text-gray-400 block truncate">{booth.cameraResolution}</span>
                    </div>
                  </div>
                  <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" title="Kamera Siap" />
                </div>

                {/* 3. Network & Connectivity */}
                <div className="p-3 rounded-xl border border-gray-200 bg-white space-y-1.5">
                  <div className="flex items-center justify-between text-[11px]">
                    <div className="flex items-center gap-1.5 text-gray-600">
                      <Wifi className="w-3.5 h-3.5 text-gray-400" />
                      <span className="font-mono text-gray-900">{booth.ipAddress}</span>
                    </div>
                    <span className="text-[10px] text-gray-400 truncate max-w-[120px]">{booth.wifiSsid}</span>
                  </div>

                  <div className="flex items-center justify-between text-[11px] pt-1 border-t border-gray-100">
                    <span className="text-gray-400 text-[10px]">Latensi Ping:</span>
                    <div className="flex items-center gap-1">
                      {booth.pingLatency ? (
                        <>
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                          <span className="font-mono font-bold text-emerald-700">{booth.pingLatency} ms</span>
                        </>
                      ) : (
                        <span className="text-gray-400 italic text-[10px]">Unreachable</span>
                      )}
                      <span className="text-[10px] text-gray-400 font-mono">({booth.lastPing})</span>
                    </div>
                  </div>
                </div>

                {/* Notes if any */}
                {booth.notes && (
                  <p className="text-[11px] text-gray-500 italic bg-gray-50 p-2.5 rounded-xl border border-gray-100">
                    "{booth.notes}"
                  </p>
                )}
              </div>

              {/* Card Footer Actions */}
              <div className="px-5 py-3.5 border-t border-gray-100 bg-gray-50/70 flex items-center justify-between gap-2">
                <div className="flex items-center gap-1.5">
                  {/* Ping Test Button */}
                  <button
                    onClick={() => handlePingBooth(booth)}
                    disabled={isPinging || isRebooting}
                    title="Uji Ping Respon Mesin"
                    className="p-2 rounded-xl border border-gray-200 bg-white hover:bg-gray-100 text-gray-600 hover:text-gray-900 transition shadow-2xs flex items-center gap-1 disabled:opacity-50"
                  >
                    <Activity className={`w-3.5 h-3.5 ${isPinging ? 'animate-spin text-[#DE5795]' : ''}`} />
                    <span className="text-[11px] font-semibold hidden sm:inline">
                      {isPinging ? 'Ping...' : 'Ping'}
                    </span>
                  </button>

                  {/* Remote Restart Button */}
                  <button
                    onClick={() => handleRemoteRestart(booth)}
                    disabled={isRebooting}
                    title="Remote Reboot Mesin Kiosk"
                    className="p-2 rounded-xl border border-gray-200 bg-white hover:bg-red-50 text-gray-600 hover:text-red-600 transition shadow-2xs flex items-center gap-1 disabled:opacity-50"
                  >
                    <Power className="w-3.5 h-3.5" />
                    <span className="text-[11px] font-semibold hidden sm:inline">Reboot</span>
                  </button>
                </div>

                <div className="flex items-center gap-1.5">
                  {/* Edit Booth */}
                  <button
                    onClick={() => handleOpenEditDrawer(booth)}
                    title="Edit Konfigurasi Booth"
                    className="p-2 rounded-xl border border-gray-200 bg-white hover:bg-[#DE5795]/10 hover:border-[#DE5795] text-gray-600 hover:text-[#9D174D] transition shadow-2xs"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>

                  {/* Delete Booth */}
                  <button
                    onClick={() => setDeleteConfirmId(booth.id)}
                    title="Hapus Unit Booth"
                    className="p-2 rounded-xl border border-gray-200 bg-white hover:bg-red-50 hover:border-red-300 text-gray-400 hover:text-red-600 transition shadow-2xs"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Empty State */}
      {filteredBooths.length === 0 && (
        <div className="p-12 text-center rounded-3xl bg-white border border-gray-200 space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-gray-100 flex items-center justify-center text-gray-400 mx-auto">
            <Store className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-bold text-gray-900">Tidak ada unit booth yang cocok</h3>
          <p className="text-xs text-gray-500 max-w-sm mx-auto">
            Coba ganti kata kunci pencarian atau ubah tab status filter di atas.
          </p>
        </div>
      )}

      {/* ============================================================ */}
      {/* DRAWER: TAMBAH / EDIT UNIT BOOTH                             */}
      {/* ============================================================ */}
      {isDrawerOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden font-sora">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-gray-950/60 backdrop-blur-xs transition-opacity animate-fade-in"
            onClick={() => setIsDrawerOpen(false)}
          />

          <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
            <div className="w-screen max-w-xl bg-white shadow-2xl border-l border-gray-100 flex flex-col animate-slide-left">
              {/* Drawer Header */}
              <div className="px-6 py-5 border-b border-gray-200/80 flex items-center justify-between bg-white shrink-0 sticky top-0 z-20 shadow-2xs">
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className="w-11 h-11 rounded-2xl bg-[#DE5795]/15 border border-[#DE5795]/30 flex items-center justify-center text-[#9D174D] shadow-xs shrink-0">
                    <Store className="w-5 h-5 text-[#DE5795]" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-base font-bold text-gray-900 leading-tight">
                        {editingBooth ? 'Edit Konfigurasi Unit Booth' : 'Tambah Unit Booth Baru'}
                      </h3>
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider font-mono border ${
                        editingBooth ? 'bg-amber-100 text-amber-800 border-amber-200' : 'bg-[#DE5795]/15 text-[#9D174D] border-[#DE5795]/30'
                      }`}>
                        {editingBooth ? formCode : 'Unit Baru'}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 mt-0.5 truncate">
                      Konfigurasi printer thermal, kamera DSLR, IP address, dan lokasi booth
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setIsDrawerOpen(false)}
                  className="w-9 h-9 rounded-xl text-gray-400 hover:text-gray-700 hover:bg-gray-100 border border-transparent hover:border-gray-200 transition-all flex items-center justify-center shrink-0 ml-3"
                  title="Tutup (Esc)"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Drawer Form Body */}
              <form onSubmit={handleSaveBooth} className="flex-1 flex flex-col min-h-0">
                <div className="p-6 overflow-y-auto flex-1 space-y-6 text-xs">

                  {/* SECTION 1: IDENTITAS & STATUS OPERASIONAL */}
                  <div className="space-y-3.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold text-gray-700 uppercase tracking-wider flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-[#DE5795]" />
                        1. Identitas & Status Operasional
                      </span>
                      <span className="text-[11px] text-gray-400">* Wajib diisi</span>
                    </div>

                    {/* Status Pill Selector */}
                    <div>
                      <label className="text-[11px] font-semibold text-gray-600 block mb-1.5">Status Operasional Unit:</label>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                        {[
                          { id: 'ONLINE', label: 'ONLINE', sub: 'Siap Pakai', color: 'bg-emerald-50 text-emerald-700 border-emerald-300 ring-emerald-500/20' },
                          { id: 'IN_SESSION', label: 'IN_SESSION', sub: 'Sesi Aktif', color: 'bg-blue-50 text-blue-700 border-blue-300 ring-blue-500/20' },
                          { id: 'MAINTENANCE', label: 'MAINTENANCE', sub: 'Perawatan', color: 'bg-amber-50 text-amber-800 border-amber-300 ring-amber-500/20' },
                          { id: 'OFFLINE', label: 'OFFLINE', sub: 'Mati / Putus', color: 'bg-rose-50 text-rose-700 border-rose-300 ring-rose-500/20' },
                        ].map((st) => {
                          const isSelected = formStatus === st.id;
                          return (
                            <button
                              key={st.id}
                              type="button"
                              onClick={() => setFormStatus(st.id as any)}
                              className={`p-2 rounded-xl border-2 text-center flex flex-col items-center justify-center transition-all ${
                                isSelected
                                  ? `${st.color} font-bold ring-2 shadow-xs`
                                  : 'border-gray-200 bg-white hover:bg-gray-50 text-gray-600'
                              }`}
                            >
                              <span className="text-[11px]">{st.label}</span>
                              <span className="text-[9px] opacity-75">{st.sub}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Code & Name */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div className="space-y-1">
                        <label className="font-semibold text-gray-700 block">Kode Unit *</label>
                        <input
                          type="text"
                          required
                          placeholder="PB-JKT-04"
                          value={formCode}
                          onChange={(e) => setFormCode(e.target.value)}
                          className="w-full px-3.5 py-2 text-xs rounded-xl border border-gray-200 font-mono font-bold focus:outline-hidden focus:border-[#DE5795] bg-white"
                        />
                      </div>
                      <div className="sm:col-span-2 space-y-1">
                        <label className="font-semibold text-gray-700 block">Nama Mesin Booth *</label>
                        <input
                          type="text"
                          required
                          placeholder="Contoh: Booth Zeta - Senayan City"
                          value={formName}
                          onChange={(e) => setFormName(e.target.value)}
                          className="w-full px-3.5 py-2 text-xs rounded-xl border border-gray-200 focus:outline-hidden focus:border-[#DE5795] bg-white"
                        />
                      </div>
                    </div>

                    {/* Venue Location */}
                    <div className="space-y-1">
                      <label className="font-semibold text-gray-700 flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-[#DE5795]" /> Lokasi Mall / Gedung Venue *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Senayan City Lt. 4, Jl. Asia Afrika, Jakarta Pusat"
                        value={formLocation}
                        onChange={(e) => setFormLocation(e.target.value)}
                        className="w-full px-3.5 py-2 text-xs rounded-xl border border-gray-200 focus:outline-hidden focus:border-[#DE5795] bg-white"
                      />
                    </div>
                  </div>

                  {/* SECTION 2: PRINTER & GAUGE KERTAS FOTO */}
                  <div className="p-4 rounded-2xl bg-gray-50/70 border border-gray-200/80 space-y-3.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold text-gray-700 uppercase tracking-wider flex items-center gap-1.5">
                        <Printer className="w-3.5 h-3.5 text-[#DE5795]" />
                        2. Konfigurasi Printer Foto & Kertas
                      </span>
                      <button
                        type="button"
                        onClick={() => setFormPaperCount(formMaxPaper)}
                        className="px-2 py-0.5 rounded-lg bg-[#DE5795]/10 text-[#9D174D] text-[10px] font-bold hover:bg-[#DE5795]/20 transition-colors"
                      >
                        Isi Roll Penuh ({formMaxPaper} Lembar)
                      </button>
                    </div>

                    <div className="space-y-1">
                      <label className="text-gray-600 font-semibold">Pilih Model Mesin Printer</label>
                      <select
                        value={formPrinterModel}
                        onChange={(e) => setFormPrinterModel(e.target.value)}
                        className="w-full px-3 py-2 text-xs rounded-xl border border-gray-200 bg-white font-medium focus:outline-hidden focus:border-[#DE5795]"
                      >
                        {PRINTER_OPTIONS.map((p) => (
                          <option key={p} value={p}>
                            {p}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Live Paper Gauge Preview inside Drawer */}
                    <div className="p-3 bg-white rounded-xl border border-gray-200 space-y-2 shadow-2xs">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-gray-700">Level Kertas Printer Saat Ini:</span>
                        <div className="flex items-center gap-1.5 font-mono text-xs">
                          <span className="font-bold text-[#9D174D]">{formPaperCount}</span>
                          <span className="text-gray-400">/</span>
                          <span className="text-gray-600">{formMaxPaper} lbr</span>
                          <span className="text-[10px] text-gray-400">
                            ({Math.round((formPaperCount / (formMaxPaper || 1)) * 100)}%)
                          </span>
                        </div>
                      </div>

                      {/* Interactive Progress Bar */}
                      <div className="w-full h-2.5 rounded-full bg-gray-100 overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-300"
                          style={{
                            width: `${Math.min(100, Math.round((formPaperCount / (formMaxPaper || 1)) * 100))}%`,
                            backgroundColor: formPaperCount < 50 ? '#EF4444' : '#DE5795',
                          }}
                        />
                      </div>

                      {/* Quick Stepper Buttons */}
                      <div className="flex items-center justify-between pt-1 text-[10px]">
                        <span className="text-gray-500">Tambah Cepat:</span>
                        <div className="flex items-center gap-1.5">
                          {[50, 100, 200].map((add) => (
                            <button
                              key={add}
                              type="button"
                              onClick={() => setFormPaperCount(Math.min(formMaxPaper, formPaperCount + add))}
                              className="px-2 py-0.5 rounded-md bg-gray-100 hover:bg-gray-200 text-gray-700 font-mono font-semibold transition-colors"
                            >
                              +{add}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Numeric Inputs */}
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="text-gray-600 font-semibold">Sisa Lembar Kertas</label>
                        <input
                          type="number"
                          min={0}
                          max={formMaxPaper}
                          value={formPaperCount}
                          onChange={(e) => setFormPaperCount(parseInt(e.target.value) || 0)}
                          className="w-full px-3 py-1.5 text-xs rounded-lg border border-gray-200 bg-white font-mono font-bold text-gray-900 focus:outline-hidden focus:border-[#DE5795]"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-gray-600 font-semibold">Kapasitas Maksimal Roll</label>
                        <input
                          type="number"
                          min={100}
                          max={1500}
                          step={50}
                          value={formMaxPaper}
                          onChange={(e) => setFormMaxPaper(parseInt(e.target.value) || 700)}
                          className="w-full px-3 py-1.5 text-xs rounded-lg border border-gray-200 bg-white font-mono font-bold text-gray-900 focus:outline-hidden focus:border-[#DE5795]"
                        />
                      </div>
                    </div>
                  </div>

                  {/* SECTION 3: KAMERA DSLR / MIRRORLESS */}
                  <div className="space-y-3">
                    <span className="text-[11px] font-bold text-gray-700 uppercase tracking-wider flex items-center gap-1.5">
                      <Camera className="w-3.5 h-3.5 text-[#DE5795]" />
                      3. Kamera DSLR / Mirrorless Studio
                    </span>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {CAMERA_OPTIONS.map((cam, idx) => {
                        const isSelected = formCameraIndex === idx;
                        const isCanon = cam.brand === 'Canon';

                        return (
                          <div
                            key={cam.model}
                            onClick={() => setFormCameraIndex(idx)}
                            className={`p-3 rounded-xl border-2 cursor-pointer transition-all flex items-start gap-2.5 ${
                              isSelected
                                ? 'border-[#DE5795] bg-[#DE5795]/10 shadow-2xs ring-1 ring-[#DE5795]/20'
                                : 'border-gray-200 bg-white hover:border-gray-300'
                            }`}
                          >
                            <div className="mt-0.5">
                              <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold uppercase ${
                                isCanon ? 'bg-red-100 text-red-800' : 'bg-indigo-100 text-indigo-800'
                              }`}>
                                {cam.brand}
                              </span>
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="font-bold text-gray-900 text-xs truncate">{cam.model}</p>
                              <p className="text-[10px] text-gray-500 mt-0.5">{cam.resolution}</p>
                            </div>
                            {isSelected && <Check className="w-4 h-4 text-[#DE5795] shrink-0 mt-0.5" />}
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* SECTION 4: JARINGAN & REMOTE CONTROL */}
                  <div className="p-4 rounded-2xl bg-gray-50/70 border border-gray-200/80 space-y-3">
                    <span className="text-[11px] font-bold text-gray-700 uppercase tracking-wider flex items-center gap-1.5">
                      <Wifi className="w-3.5 h-3.5 text-[#DE5795]" />
                      4. Jaringan & Akses Remote IOT
                    </span>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="text-gray-600 font-semibold">IP Address Lokal *</label>
                        <input
                          type="text"
                          required
                          placeholder="192.168.1.105"
                          value={formIpAddress}
                          onChange={(e) => setFormIpAddress(e.target.value)}
                          className="w-full px-3 py-2 text-xs rounded-xl border border-gray-200 bg-white font-mono font-bold focus:outline-hidden focus:border-[#DE5795]"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-gray-600 font-semibold">Nama SSID WiFi Terhubung</label>
                        <input
                          type="text"
                          placeholder="PhotoBooth_Mesh_5G"
                          value={formWifiSsid}
                          onChange={(e) => setFormWifiSsid(e.target.value)}
                          className="w-full px-3 py-2 text-xs rounded-xl border border-gray-200 bg-white focus:outline-hidden focus:border-[#DE5795]"
                        />
                      </div>
                    </div>
                  </div>

                  {/* SECTION 5: CATATAN TEKNISI */}
                  <div className="space-y-1.5">
                    <label className="font-semibold text-gray-700 block">Catatan Teknisi / Log Perawatan</label>
                    <textarea
                      rows={2}
                      placeholder="Misal: Cutter printer baru diganti, flash studio Godox sudah diselaraskan ke f/8..."
                      value={formNotes}
                      onChange={(e) => setFormNotes(e.target.value)}
                      className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-gray-200 focus:outline-hidden focus:border-[#DE5795] bg-white"
                    />
                  </div>
                </div>

                {/* Drawer Sticky Footer */}
                <div className="px-6 py-4 border-t border-gray-100 bg-gray-50/90 backdrop-blur-sm flex items-center justify-between gap-3 shrink-0 sticky bottom-0 z-10">
                  <span className="text-[11px] text-gray-400 hidden sm:inline">
                    Tekan <kbd className="px-1.5 py-0.5 rounded bg-gray-200 font-mono text-[10px]">ESC</kbd> untuk keluar
                  </span>
                  <div className="flex items-center gap-2.5">
                    <button
                      type="button"
                      onClick={() => setIsDrawerOpen(false)}
                      className="px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-xs font-semibold text-gray-700 hover:bg-gray-100 transition-colors"
                    >
                      Batal
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2.5 rounded-xl bg-[#DE5795] text-white text-xs font-bold hover:bg-[#c93d7e] transition-colors border border-[#DE5795] shadow-xs flex items-center gap-2"
                    >
                      <Check className="w-4 h-4 text-white" />
                      <span>{editingBooth ? 'Simpan Konfigurasi Booth' : 'Tambahkan Unit Booth'}</span>
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* DELETE CONFIRMATION MODAL                                    */}
      {/* ============================================================ */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-950/70 backdrop-blur-sm animate-fade-in font-sora">
          <div className="relative w-full max-w-sm rounded-3xl bg-white p-6 shadow-2xl border border-gray-200 text-center space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-bold text-gray-900">Hapus Unit Booth?</h3>
              <p className="text-xs text-gray-500">
                Unit booth ini akan dihapus dari sistem manajemen dan antrian cetak kiosk.
              </p>
            </div>
            <div className="flex items-center justify-center gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setDeleteConfirmId(null)}
                className="px-4 py-2 rounded-xl border border-gray-200 text-xs font-semibold text-gray-700 hover:bg-gray-100 transition"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={() => handleDeleteBooth(deleteConfirmId)}
                className="px-4 py-2 rounded-xl bg-red-600 text-white text-xs font-bold hover:bg-red-700 transition"
              >
                Ya, Hapus Unit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
