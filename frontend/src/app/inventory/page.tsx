'use client';

import React, { useState, useMemo } from 'react';
import {
  Boxes,
  Plus,
  ArrowRightLeft,
  Search,
  AlertTriangle,
  CheckCircle2,
  PackageCheck,
  Printer,
  Camera,
  Layers,
  Sparkles,
  ArrowDownToLine,
  X,
  History,
  Info,
  SlidersHorizontal,
  ChevronRight,
  TrendingDown,
  Warehouse,
  Store,
  RefreshCw,
  Cpu,
  Clock,
  User,
  ShieldCheck,
  Check,
  Activity,
  AlertCircle,
} from 'lucide-react';
import {
  InventoryItem,
  StockMutationLog,
  InventoryCategory,
  StockStatus,
  StorageLocation,
} from '@/features/inventory/types/inventory.types';
import {
  INITIAL_INVENTORY_ITEMS,
  INITIAL_MUTATION_LOGS,
} from '@/features/inventory/data/inventory.mock';

export default function InventoryPage() {
  // Main Data States
  const [items, setItems] = useState<InventoryItem[]>(INITIAL_INVENTORY_ITEMS);
  const [mutationLogs, setMutationLogs] = useState<StockMutationLog[]>(INITIAL_MUTATION_LOGS);

  // Filters & Tabs
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLocation, setSelectedLocation] = useState<StorageLocation>('Semua Lokasi');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [activeTab, setActiveTab] = useState<'table' | 'history'>('table');

  // Drawers & Modals
  const [isMutationDrawerOpen, setIsMutationDrawerOpen] = useState(false);
  const [isAddItemDrawerOpen, setIsAddItemDrawerOpen] = useState(false);
  const [selectedItemForDetail, setSelectedItemForDetail] = useState<InventoryItem | null>(null);

  // Form States - Mutasi / Transfer
  const [mutationItemId, setMutationItemId] = useState<string>(items[0]?.id || '');
  const [mutationFrom, setMutationFrom] = useState<string>('Gudang Pusat (HQ Jakarta)');
  const [mutationTo, setMutationTo] = useState<string>('Booth Alpha - Grand Indonesia');
  const [mutationQty, setMutationQty] = useState<number>(50);
  const [mutationPic, setMutationPic] = useState<string>('Rian Maulana (Teknisi Kiosk)');
  const [mutationNotes, setMutationNotes] = useState<string>('Restock kertas darurat menjelang weekend rush');

  // Form States - Tambah Item Baru
  const [newItemName, setNewItemName] = useState('');
  const [newItemSku, setNewItemSku] = useState('');
  const [newItemCategory, setNewItemCategory] = useState<InventoryCategory>('consumable');
  const [newItemLocation, setNewItemLocation] = useState<StorageLocation>('Gudang Pusat (HQ Jakarta)');
  const [newItemStock, setNewItemStock] = useState<number>(100);
  const [newItemMinThreshold, setNewItemMinThreshold] = useState<number>(30);
  const [newItemUnit, setNewItemUnit] = useState('Lembar Cetak');
  const [newItemCost, setNewItemCost] = useState<number>(1450000);
  const [newItemSupplier, setNewItemSupplier] = useState('PT DNP Indonesia Imaging');

  // Toast Notification
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Locations List
  const locationOptions: StorageLocation[] = [
    'Semua Lokasi',
    'Gudang Pusat (HQ Jakarta)',
    'Booth Alpha - Grand Indonesia',
    'Booth Beta - Central Park',
    'Flight Case Mobile Unit 1',
  ];

  // Calculated Metrics
  const metrics = useMemo(() => {
    const totalAssetVal = items.reduce((acc, curr) => acc + curr.costPerUnit * curr.currentStock, 0);
    const criticalList = items.filter((i) => i.status === 'Kritis' || (i.category !== 'hardware' && i.currentStock <= i.minThreshold / 2));
    const paperConsumables = items.filter((i) => i.category === 'consumable');
    const totalSheetsReady = paperConsumables.reduce((acc, curr) => {
      if (curr.unit.includes('Box')) return acc + curr.currentStock * 1400;
      return acc + curr.currentStock;
    }, 0);

    return {
      totalAssetVal,
      criticalCount: criticalList.length,
      criticalList,
      totalSheetsReady,
      hardwareCount: items.filter((i) => i.category === 'hardware').length,
    };
  }, [items]);

  // Filtered Items
  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const matchSearch =
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.supplier.toLowerCase().includes(searchQuery.toLowerCase());

      const matchLocation =
        selectedLocation === 'Semua Lokasi' || item.location === selectedLocation;

      const matchCategory =
        selectedCategory === 'all' || item.category === selectedCategory;

      const matchStatus =
        selectedStatus === 'all' ||
        (selectedStatus === 'critical' && (item.status === 'Kritis' || (item.category !== 'hardware' && item.currentStock <= item.minThreshold / 2))) ||
        (selectedStatus === 'low' && (item.status === 'Menipis' || (item.category !== 'hardware' && item.currentStock <= item.minThreshold))) ||
        (selectedStatus === 'safe' && item.status === 'Aman');

      return matchSearch && matchLocation && matchCategory && matchStatus;
    });
  }, [items, searchQuery, selectedLocation, selectedCategory, selectedStatus]);

  // Handler: Submit Mutasi / Transfer
  const handleTransferSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const targetItem = items.find((i) => i.id === mutationItemId);
    if (!targetItem) return;

    if (mutationQty <= 0) {
      alert('Jumlah mutasi harus lebih besar dari 0');
      return;
    }

    // Update stock in target item
    setItems((prev) =>
      prev.map((item) => {
        if (item.id === mutationItemId) {
          const newStock = Math.max(0, item.currentStock + mutationQty);
          let newStatus: StockStatus = 'Aman';
          if (newStock <= item.minThreshold / 2) newStatus = 'Kritis';
          else if (newStock <= item.minThreshold) newStatus = 'Menipis';

          return {
            ...item,
            currentStock: newStock,
            status: newStatus,
            lastRestocked: 'Hari Ini',
          };
        }
        return item;
      })
    );

    // Add mutation log
    const newLog: StockMutationLog = {
      id: `MUT-2026-${String(mutationLogs.length + 82).padStart(3, '0')}`,
      timestamp: 'Hari Ini • Baru Saja',
      itemSku: targetItem.sku,
      itemName: targetItem.name,
      type: 'TRANSFER_KE_BOOTH',
      typeLabel: 'Pengisian Unit Booth',
      quantity: mutationQty,
      unit: targetItem.unit,
      fromLocation: mutationFrom,
      toLocation: mutationTo,
      picName: mutationPic,
      notes: mutationNotes,
    };

    setMutationLogs([newLog, ...mutationLogs]);
    setIsMutationDrawerOpen(false);
    showToast(`Berhasil transfer ${mutationQty} ${targetItem.unit} ke ${mutationTo}`);
  };

  // Handler: Submit Tambah Item Baru
  const handleAddItemSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemName || !newItemSku) {
      alert('Mohon isi nama barang dan SKU');
      return;
    }

    const newItem: InventoryItem = {
      id: `INV-NEW-${Date.now().toString().slice(-4)}`,
      sku: newItemSku.toUpperCase(),
      name: newItemName,
      category: newItemCategory,
      categoryLabel:
        newItemCategory === 'consumable'
          ? 'Kertas & Tinta'
          : newItemCategory === 'frame'
          ? 'Frame & Souvenir'
          : newItemCategory === 'hardware'
          ? 'Hardware & IoT'
          : 'Maintenance & Kabel',
      location: newItemLocation,
      currentStock: newItemStock,
      maxCapacity: Math.max(newItemStock * 2, 100),
      minThreshold: newItemMinThreshold,
      unit: newItemUnit,
      costPerUnit: newItemCost,
      supplier: newItemSupplier,
      status: newItemStock <= newItemMinThreshold ? 'Menipis' : 'Aman',
      lastRestocked: 'Hari Ini',
      estimatedPrintsLeft: newItemCategory === 'consumable' ? newItemStock : undefined,
    };

    setItems([newItem, ...items]);
    setIsAddItemDrawerOpen(false);
    showToast(`Item "${newItem.name}" berhasil ditambahkan ke inventaris`);

    // Reset Form
    setNewItemName('');
    setNewItemSku('');
  };

  return (
    <div className="flex-1 flex flex-col min-w-0 bg-[#F9FAFB] font-sora min-h-screen">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 flex items-center gap-2.5 px-4 py-3 bg-gray-900 text-white text-xs rounded-2xl shadow-2xl border border-gray-700 animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Container */}
      <div className="px-6 py-6 lg:px-8 space-y-6 max-w-7xl">
        {/* 1. Header Section (Untitled UI Standard) */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-gray-200/80 pb-5">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight">
                Manajemen Stok Kertas & Inventaris
              </h1>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 shadow-2xs">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                IoT Telemetry Live
              </span>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Monitoring persediaan kertas dye-sublimation, ribbon printer, frame karton, serta status perangkat IoT booth.
            </p>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            <button
              onClick={() => setIsMutationDrawerOpen(true)}
              className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-gray-700 bg-white border border-gray-200/90 rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all shadow-2xs"
            >
              <ArrowRightLeft className="w-3.5 h-3.5 text-gray-500" />
              <span>Catat Mutasi / Pengisian</span>
            </button>
            <button
              onClick={() => setIsAddItemDrawerOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-gradient-to-r from-pink-600 to-[#DE5795] rounded-xl hover:opacity-95 transition-all shadow-xs"
            >
              <Plus className="w-4 h-4" />
              <span>+ Tambah Stok / Item Baru</span>
            </button>
          </div>
        </div>

        {/* 2. Top Metrics Strip (Untitled UI 4 Cards) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1: Total Nilai Aset */}
          <div className="p-4.5 bg-white border border-gray-200/90 rounded-2xl shadow-2xs space-y-2">
            <div className="flex items-center justify-between text-xs text-gray-500">
              <span className="font-medium">Total Nilai Aset & Bahan</span>
              <div className="w-8 h-8 rounded-xl bg-pink-50 text-[#DE5795] flex items-center justify-center">
                <Boxes className="w-4 h-4" />
              </div>
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900 tracking-tight">
                Rp {metrics.totalAssetVal.toLocaleString('id-ID')}
              </div>
              <p className="text-[11px] text-gray-500 mt-1 flex items-center gap-1.5">
                <span className="font-semibold text-gray-700">{items.length} SKU</span> terdaftar di sistem
              </p>
            </div>
          </div>

          {/* Card 2: Kertas Siaga Cetak */}
          <div className="p-4.5 bg-white border border-gray-200/90 rounded-2xl shadow-2xs space-y-2">
            <div className="flex items-center justify-between text-xs text-gray-500">
              <span className="font-medium">Kertas & Tinta Siaga</span>
              <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <Printer className="w-4 h-4" />
              </div>
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900 tracking-tight">
                {metrics.totalSheetsReady.toLocaleString('id-ID')} <span className="text-xs font-normal text-gray-500">Lembar</span>
              </div>
              <p className="text-[11px] text-emerald-600 mt-1 font-semibold flex items-center gap-1">
                <span>Est. ~14 hari operasional normal</span>
              </p>
            </div>
          </div>

          {/* Card 3: Peringatan Kritis */}
          <div className="p-4.5 bg-white border border-gray-200/90 rounded-2xl shadow-2xs space-y-2">
            <div className="flex items-center justify-between text-xs text-gray-500">
              <span className="font-medium">Peringatan Stok Kritis</span>
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${metrics.criticalCount > 0 ? 'bg-rose-50 text-rose-600' : 'bg-gray-50 text-gray-400'}`}>
                <AlertTriangle className="w-4 h-4" />
              </div>
            </div>
            <div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold text-rose-600 tracking-tight">
                  {metrics.criticalCount}
                </span>
                <span className="text-xs text-gray-500 font-medium">Item Perlu Restock</span>
              </div>
              <p className="text-[11px] text-rose-600 mt-1 font-medium">
                {metrics.criticalCount > 0 ? 'DNP RX1HS Booth Alpha < 50 lembar' : 'Semua persediaan aman'}
              </p>
            </div>
          </div>

          {/* Card 4: Kondisi Hardware IoT */}
          <div className="p-4.5 bg-white border border-gray-200/90 rounded-2xl shadow-2xs space-y-2">
            <div className="flex items-center justify-between text-xs text-gray-500">
              <span className="font-medium">Kondisi Hardware IoT</span>
              <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                <Activity className="w-4 h-4" />
              </div>
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900 tracking-tight">
                98.4% <span className="text-xs font-normal text-emerald-600 font-semibold">Prima</span>
              </div>
              <p className="text-[11px] text-gray-500 mt-1">
                3 Printer, 3 Kamera, 3 Mini PC Online
              </p>
            </div>
          </div>
        </div>

        {/* 3. Critical Stock Alert Banner (Jika Ada Item Kritis) */}
        {metrics.criticalCount > 0 && (
          <div className="p-4 rounded-2xl bg-gradient-to-r from-rose-50/90 via-amber-50/70 to-pink-50/60 border border-rose-200/90 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs">
            <div className="flex items-start sm:items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-rose-500 text-white flex items-center justify-center shrink-0 shadow-xs">
                <AlertCircle className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-gray-900">
                  Perhatian Mendesak: Kertas Dye-Sub di Booth Alpha (Grand Indonesia) tersisa 35 lembar cetak!
                </p>
                <p className="text-[11px] text-gray-600 mt-0.5">
                  Batas minimum aman adalah 100 lembar. Gudang Pusat memiliki stok cadangan 8 box (11.200 lembar).
                </p>
              </div>
            </div>
            <button
              onClick={() => {
                setMutationItemId(items[0]?.id || '');
                setMutationFrom('Gudang Pusat (HQ Jakarta)');
                setMutationTo('Booth Alpha - Grand Indonesia');
                setMutationQty(100);
                setIsMutationDrawerOpen(true);
              }}
              className="inline-flex items-center justify-center gap-1.5 px-3.5 py-1.5 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-xl transition-all shrink-0 shadow-xs"
            >
              <ArrowRightLeft className="w-3.5 h-3.5" />
              <span>Kirim 100 Lembar Sekarang</span>
            </button>
          </div>
        )}

        {/* 4. Hardware Telemetry Quick Cards (Live Hardware Health) */}
        <div className="bg-white border border-gray-200/90 rounded-2xl p-4 shadow-2xs space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Printer className="w-4 h-4 text-[#DE5795]" />
              <h2 className="text-xs font-bold text-gray-900 uppercase tracking-wider">
                Status Real-Time Hardware & Printer Kiosk
              </h2>
            </div>
            <span className="text-[11px] text-gray-400">Pembaruan otomatis tiap 30 detik</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {/* Unit 1: Booth Alpha */}
            <div className="p-3 bg-gray-50/70 border border-gray-200/80 rounded-xl space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
                  <span className="text-xs font-bold text-gray-900">Booth Alpha (GI)</span>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-rose-50 text-rose-700 border border-rose-200">
                  Kertas Kritis (5%)
                </span>
              </div>
              <p className="text-[11px] text-gray-600">DNP DS-RX1HS • SN: RX1HS-ID-99218</p>
              <div className="w-full bg-gray-200 rounded-full h-1.5 overflow-hidden">
                <div className="bg-rose-500 h-1.5 rounded-full w-[5%]" />
              </div>
              <div className="flex items-center justify-between text-[10px] text-gray-500 pt-0.5">
                <span>Sisa: 35 / 700 Print</span>
                <span>Suhu: 37.8°C</span>
                <span>Total: 14.820 Print</span>
              </div>
            </div>

            {/* Unit 2: Booth Beta */}
            <div className="p-3 bg-gray-50/70 border border-gray-200/80 rounded-xl space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  <span className="text-xs font-bold text-gray-900">Booth Beta (Central Park)</span>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  Kertas Aman (60%)
                </span>
              </div>
              <p className="text-[11px] text-gray-600">DNP DS-RX1HS • SN: RX1HS-ID-99411</p>
              <div className="w-full bg-gray-200 rounded-full h-1.5 overflow-hidden">
                <div className="bg-emerald-500 h-1.5 rounded-full w-[60%]" />
              </div>
              <div className="flex items-center justify-between text-[10px] text-gray-500 pt-0.5">
                <span>Sisa: 420 / 700 Print</span>
                <span>Suhu: 35.4°C</span>
                <span>Total: 8.340 Print</span>
              </div>
            </div>

            {/* Unit 3: Mobile Event */}
            <div className="p-3 bg-gray-50/70 border border-gray-200/80 rounded-xl space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-blue-500" />
                  <span className="text-xs font-bold text-gray-900">Mobile Flight Case 1</span>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-blue-50 text-blue-700 border border-blue-200">
                  Siap Wedding (Standby)
                </span>
              </div>
              <p className="text-[11px] text-gray-600">Canon M50 II + DNP DS620 Event Ready</p>
              <div className="w-full bg-gray-200 rounded-full h-1.5 overflow-hidden">
                <div className="bg-blue-500 h-1.5 rounded-full w-[85%]" />
              </div>
              <div className="flex items-center justify-between text-[10px] text-gray-500 pt-0.5">
                <span>Sisa: 340 / 400 Print</span>
                <span>Baterai: AC Adapter OK</span>
                <span>Kondisi: 100%</span>
              </div>
            </div>
          </div>
        </div>

        {/* 5. Horizontal Warehouse Location Tabs */}
        <div className="space-y-1">
          <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
            Pilih Lokasi Gudang / Kios Booth:
          </p>
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            {locationOptions.map((loc) => {
              const isSelected = selectedLocation === loc;
              const countForLoc =
                loc === 'Semua Lokasi'
                  ? items.length
                  : items.filter((i) => i.location === loc).length;

              return (
                <button
                  key={loc}
                  onClick={() => setSelectedLocation(loc)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-2 ${
                    isSelected
                      ? 'bg-gray-900 text-white shadow-2xs'
                      : 'bg-white text-gray-600 hover:bg-gray-100/80 border border-gray-200/80'
                  }`}
                >
                  {loc === 'Semua Lokasi' ? (
                    <Boxes className="w-3.5 h-3.5" />
                  ) : loc.includes('Gudang') ? (
                    <Warehouse className="w-3.5 h-3.5" />
                  ) : (
                    <Store className="w-3.5 h-3.5" />
                  )}
                  <span>{loc}</span>
                  <span
                    className={`px-1.5 py-0.2 rounded-md text-[10px] font-bold ${
                      isSelected
                        ? 'bg-white/20 text-white'
                        : 'bg-gray-100 text-gray-600'
                    }`}
                  >
                    {countForLoc}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 6. Filter & Search Bar + Tab Switcher */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 bg-white p-3 border border-gray-200/90 rounded-2xl shadow-2xs">
          {/* Search Box */}
          <div className="relative flex-1 min-w-[240px]">
            <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Cari SKU, nama barang (DNP, Canon, Frame), atau supplier..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-11 py-2 text-xs bg-gray-50/70 border border-gray-200/90 rounded-xl text-gray-900 placeholder:text-gray-400 focus:outline-hidden focus:bg-white focus:border-[#DE5795] focus:ring-3 focus:ring-[#DE5795]/10 transition-all"
            />
            <kbd className="absolute right-2.5 top-1/2 -translate-y-1/2 px-1.5 py-0.5 text-[9px] font-mono text-gray-400 bg-white border border-gray-200 rounded shadow-2xs">
              ⌘K
            </kbd>
          </div>

          {/* Category Dropdown */}
          <div className="flex items-center gap-2">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-2 text-xs bg-gray-50/70 border border-gray-200/90 rounded-xl text-gray-700 focus:outline-hidden focus:border-[#DE5795] transition-all"
            >
              <option value="all">Semua Kategori</option>
              <option value="consumable">Kertas & Tinta</option>
              <option value="frame">Frame & Souvenir</option>
              <option value="hardware">Hardware & IoT</option>
              <option value="maintenance">Maintenance & Kabel</option>
            </select>

            {/* Status Dropdown */}
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-3 py-2 text-xs bg-gray-50/70 border border-gray-200/90 rounded-xl text-gray-700 focus:outline-hidden focus:border-[#DE5795] transition-all"
            >
              <option value="all">Semua Status</option>
              <option value="critical">Stok Kritis</option>
              <option value="low">Stok Menipis</option>
              <option value="safe">Stok Aman</option>
            </select>

            {/* View Switch: Tabel Inventaris vs Riwayat Log */}
            <div className="flex items-center bg-gray-100 p-0.5 rounded-xl border border-gray-200/80">
              <button
                onClick={() => setActiveTab('table')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  activeTab === 'table'
                    ? 'bg-white text-gray-900 shadow-2xs'
                    : 'text-gray-500 hover:text-gray-900'
                }`}
              >
                Daftar Aset ({filteredItems.length})
              </button>
              <button
                onClick={() => setActiveTab('history')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                  activeTab === 'history'
                    ? 'bg-white text-gray-900 shadow-2xs'
                    : 'text-gray-500 hover:text-gray-900'
                }`}
              >
                <History className="w-3 h-3" />
                <span>Log Mutasi</span>
              </button>
            </div>
          </div>
        </div>

        {/* 7. Content Tab 1: Tabel Inventaris */}
        {activeTab === 'table' && (
          <div className="bg-white border border-gray-200/90 rounded-2xl shadow-2xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-gray-50/80 border-b border-gray-200/80 text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                    <th className="py-3 px-4">Barang & SKU</th>
                    <th className="py-3 px-4">Kategori & Lokasi</th>
                    <th className="py-3 px-4">Tingkat Persediaan</th>
                    <th className="py-3 px-4">Jumlah Stok</th>
                    <th className="py-3 px-4">Nilai Satuan / Supplier</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Aksi Cepat</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredItems.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="text-center py-12 text-gray-400">
                        <Boxes className="w-10 h-10 mx-auto text-gray-300 mb-2" />
                        <p className="text-sm font-semibold text-gray-600">Tidak ada item inventaris yang cocok</p>
                        <p className="text-xs text-gray-400 mt-0.5">Coba ubah kata kunci pencarian atau lokasi gudang.</p>
                      </td>
                    </tr>
                  ) : (
                    filteredItems.map((item) => {
                      const isCritical = item.status === 'Kritis' || (item.category !== 'hardware' && item.currentStock <= item.minThreshold / 2);
                      const isLow = item.status === 'Menipis' || (item.category !== 'hardware' && item.currentStock <= item.minThreshold);
                      const percentage = Math.min(100, Math.round((item.currentStock / item.maxCapacity) * 100));

                      return (
                        <tr key={item.id} className="hover:bg-gray-50/60 transition-colors group">
                          {/* 1. Item & SKU */}
                          <td className="py-3.5 px-4">
                            <div className="flex items-center gap-3">
                              <div
                                className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border ${
                                  item.category === 'hardware'
                                    ? 'bg-blue-50 text-blue-600 border-blue-100'
                                    : item.category === 'consumable'
                                    ? 'bg-pink-50 text-[#DE5795] border-pink-100'
                                    : item.category === 'frame'
                                    ? 'bg-amber-50 text-amber-600 border-amber-100'
                                    : 'bg-emerald-50 text-emerald-600 border-emerald-100'
                                }`}
                              >
                                {item.category === 'hardware' ? (
                                  <Cpu className="w-4 h-4" />
                                ) : item.category === 'consumable' ? (
                                  <Printer className="w-4 h-4" />
                                ) : item.category === 'frame' ? (
                                  <Layers className="w-4 h-4" />
                                ) : (
                                  <PackageCheck className="w-4 h-4" />
                                )}
                              </div>
                              <div className="min-w-0">
                                <div className="font-bold text-gray-900 group-hover:text-[#DE5795] transition-colors truncate max-w-xs">
                                  {item.name}
                                </div>
                                <div className="text-[10px] font-mono text-gray-400">
                                  SKU: {item.sku}
                                </div>
                              </div>
                            </div>
                          </td>

                          {/* 2. Kategori & Lokasi */}
                          <td className="py-3.5 px-4">
                            <div className="space-y-1">
                              <span className="inline-block px-2 py-0.5 text-[10px] font-semibold bg-gray-100 text-gray-700 rounded-md">
                                {item.categoryLabel}
                              </span>
                              <div className="text-[11px] text-gray-600 flex items-center gap-1">
                                {item.location.includes('Gudang') ? (
                                  <Warehouse className="w-3 h-3 text-gray-400 shrink-0" />
                                ) : (
                                  <Store className="w-3 h-3 text-gray-400 shrink-0" />
                                )}
                                <span className="truncate max-w-[150px]">{item.location}</span>
                              </div>
                            </div>
                          </td>

                          {/* 3. Tingkat Persediaan (Bar) */}
                          <td className="py-3.5 px-4 min-w-[140px]">
                            <div className="space-y-1">
                              <div className="flex items-center justify-between text-[10px]">
                                <span className="font-bold text-gray-700">{percentage}%</span>
                                <span className="text-gray-400">Min: {item.minThreshold}</span>
                              </div>
                              <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
                                <div
                                  className={`h-1.5 rounded-full transition-all duration-500 ${
                                    isCritical
                                      ? 'bg-rose-500'
                                      : isLow
                                      ? 'bg-amber-500'
                                      : 'bg-emerald-500'
                                  }`}
                                  style={{ width: `${percentage}%` }}
                                />
                              </div>
                            </div>
                          </td>

                          {/* 4. Jumlah Stok */}
                          <td className="py-3.5 px-4">
                            <div>
                              <div className="font-bold text-gray-900 text-sm">
                                {item.currentStock.toLocaleString('id-ID')}{' '}
                                <span className="text-xs font-normal text-gray-500">{item.unit}</span>
                              </div>
                              {item.estimatedPrintsLeft !== undefined && (
                                <p className="text-[10px] text-emerald-600 font-medium">
                                  ~{item.estimatedPrintsLeft.toLocaleString('id-ID')} cetakan sesi
                                </p>
                              )}
                            </div>
                          </td>

                          {/* 5. Nilai Satuan & Supplier */}
                          <td className="py-3.5 px-4">
                            <div>
                              <div className="font-semibold text-gray-800">
                                Rp {item.costPerUnit.toLocaleString('id-ID')}
                              </div>
                              <div className="text-[10px] text-gray-400 truncate max-w-[140px]">
                                {item.supplier}
                              </div>
                            </div>
                          </td>

                          {/* 6. Status Badge */}
                          <td className="py-3.5 px-4">
                            {isCritical ? (
                              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
                                <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                                Kritis Restock
                              </span>
                            ) : isLow ? (
                              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                                <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                                Stok Menipis
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                Stok Aman
                              </span>
                            )}
                          </td>

                          {/* 7. Fast Actions */}
                          <td className="py-3.5 px-4 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                onClick={() => {
                                  setMutationItemId(item.id);
                                  setMutationFrom(item.location.includes('Gudang') ? item.location : 'Gudang Pusat (HQ Jakarta)');
                                  setMutationTo(item.location.includes('Gudang') ? 'Booth Alpha - Grand Indonesia' : item.location);
                                  setMutationQty(item.unit.includes('Box') ? 1 : 50);
                                  setIsMutationDrawerOpen(true);
                                }}
                                title="Catat Mutasi / Pengisian"
                                className="p-1.5 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                              >
                                <ArrowRightLeft className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => setSelectedItemForDetail(item)}
                                title="Detail & Riwayat Item"
                                className="p-1.5 text-gray-500 hover:text-[#DE5795] hover:bg-pink-50 rounded-lg transition-colors"
                              >
                                <Info className="w-3.5 h-3.5" />
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
          </div>
        )}

        {/* 8. Content Tab 2: Riwayat Log Mutasi */}
        {activeTab === 'history' && (
          <div className="bg-white border border-gray-200/90 rounded-2xl shadow-2xs overflow-hidden">
            <div className="p-4 border-b border-gray-200/80 flex items-center justify-between">
              <div>
                <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider">
                  Riwayat Log Mutasi & Pengeluaran Bahan
                </h3>
                <p className="text-[11px] text-gray-500 mt-0.5">
                  Audit trail perpindahan kertas, ribbon, dan frame dari gudang ke tiap unit booth.
                </p>
              </div>
              <button
                onClick={() => setIsMutationDrawerOpen(true)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-gray-700 bg-gray-50 border border-gray-200 rounded-xl hover:bg-gray-100"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Catat Pengisian Baru</span>
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-gray-50/80 border-b border-gray-200/80 text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                    <th className="py-3 px-4">Waktu & Ref ID</th>
                    <th className="py-3 px-4">Jenis Mutasi</th>
                    <th className="py-3 px-4">Nama Barang & SKU</th>
                    <th className="py-3 px-4">Perpindahan (Dari → Ke)</th>
                    <th className="py-3 px-4">Jumlah</th>
                    <th className="py-3 px-4">Penanggung Jawab (PIC)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {mutationLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-gray-50/60 transition-colors">
                      <td className="py-3 px-4">
                        <div className="font-semibold text-gray-900">{log.timestamp}</div>
                        <div className="text-[10px] font-mono text-gray-400">{log.id}</div>
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            log.type === 'RESTOCK_MASUK'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : log.type === 'TRANSFER_KE_BOOTH'
                              ? 'bg-blue-50 text-blue-700 border border-blue-200'
                              : 'bg-purple-50 text-purple-700 border border-purple-200'
                          }`}
                        >
                          {log.typeLabel}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-bold text-gray-800">{log.itemName}</div>
                        <div className="text-[10px] font-mono text-gray-400">SKU: {log.itemSku}</div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="text-[11px] text-gray-700 font-medium flex items-center gap-1.5">
                          <span className="text-gray-500 truncate max-w-[130px]">{log.fromLocation}</span>
                          <span className="text-gray-400">→</span>
                          <span className="font-bold text-gray-900 truncate max-w-[130px]">{log.toLocation}</span>
                        </div>
                        {log.notes && <div className="text-[10px] text-gray-400 italic mt-0.5">{log.notes}</div>}
                      </td>
                      <td className="py-3 px-4 font-bold text-gray-900">
                        {log.quantity} {log.unit}
                      </td>
                      <td className="py-3 px-4 text-gray-700">
                        <div className="flex items-center gap-1.5">
                          <User className="w-3.5 h-3.5 text-gray-400" />
                          <span>{log.picName}</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* DRAWER 1: Catat Mutasi & Pengisian Booth (Floating Slide-Over)            */}
      {/* ========================================================================= */}
      {isMutationDrawerOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          {/* Backdrop */}
          <div
            onClick={() => setIsMutationDrawerOpen(false)}
            className="absolute inset-0 bg-black/40 backdrop-blur-xs transition-opacity animate-fade-in"
          />

          {/* Floating Slide-over container */}
          <div className="fixed inset-y-0 right-0 max-w-full flex pl-6 sm:pl-10 p-3 sm:p-4 pointer-events-none">
            <div className="w-screen max-w-xl bg-white shadow-2xl border border-gray-200/90 rounded-3xl flex flex-col animate-slide-left overflow-hidden ring-1 ring-black/10 pointer-events-auto">
              {/* Header with generous bottom padding (pb-7.5) and top clearance (pt-7) */}
              <div className="px-8 pt-7 pb-7.5 border-b border-gray-200/80 flex items-start justify-between bg-white">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-pink-500 to-[#DE5795] text-white flex items-center justify-center shadow-xs">
                    <ArrowRightLeft className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-gray-900">Catat Mutasi / Pengisian Booth</h2>
                    <p className="text-xs text-gray-500 mt-0.5">
                      Kirim kertas, ribbon, atau frame dari gudang ke unit booth aktif.
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setIsMutationDrawerOpen(false)}
                  className="p-2 text-gray-400 hover:text-gray-600 rounded-xl hover:bg-gray-100 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Body */}
              <form id="mutation-form" onSubmit={handleTransferSubmit} className="px-8 py-6 overflow-y-auto flex-1 space-y-5 text-xs">
                {/* Select Item */}
                <div className="space-y-1.5">
                  <label className="font-bold text-gray-800">Pilih Barang yang Ditransfer *</label>
                  <select
                    value={mutationItemId}
                    onChange={(e) => setMutationItemId(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 font-medium focus:bg-white focus:border-[#DE5795] focus:outline-hidden"
                  >
                    {items.map((it) => (
                      <option key={it.id} value={it.id}>
                        {it.name} ({it.currentStock} {it.unit} di {it.location})
                      </option>
                    ))}
                  </select>
                </div>

                {/* From -> To Locations */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="font-bold text-gray-800">Dari Lokasi (Sumber) *</label>
                    <select
                      value={mutationFrom}
                      onChange={(e) => setMutationFrom(e.target.value)}
                      className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 font-medium focus:bg-white focus:border-[#DE5795] focus:outline-hidden"
                    >
                      {locationOptions.filter((l) => l !== 'Semua Lokasi').map((l) => (
                        <option key={l} value={l}>
                          {l}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-bold text-gray-800">Ke Lokasi (Tujuan) *</label>
                    <select
                      value={mutationTo}
                      onChange={(e) => setMutationTo(e.target.value)}
                      className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 font-medium focus:bg-white focus:border-[#DE5795] focus:outline-hidden"
                    >
                      {locationOptions.filter((l) => l !== 'Semua Lokasi').map((l) => (
                        <option key={l} value={l}>
                          {l}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Quantity */}
                <div className="space-y-1.5">
                  <label className="font-bold text-gray-800">Jumlah yang Ditransfer *</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      min={1}
                      value={mutationQty}
                      onChange={(e) => setMutationQty(parseInt(e.target.value) || 0)}
                      className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 font-bold focus:bg-white focus:border-[#DE5795] focus:outline-hidden"
                    />
                    <div className="flex gap-1.5">
                      {[50, 100, 200, 700].map((quickQty) => (
                        <button
                          key={quickQty}
                          type="button"
                          onClick={() => setMutationQty(quickQty)}
                          className="px-2.5 py-2 text-[11px] font-semibold bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
                        >
                          +{quickQty}
                        </button>
                      ))}
                    </div>
                  </div>
                  <p className="text-[11px] text-gray-400">1 Roll DNP RX1HS standar berisi 700 lembar foto cetak 4x6.</p>
                </div>

                {/* PIC Name */}
                <div className="space-y-1.5">
                  <label className="font-bold text-gray-800">Teknisi / PIC yang Bertugas *</label>
                  <input
                    type="text"
                    value={mutationPic}
                    onChange={(e) => setMutationPic(e.target.value)}
                    placeholder="Contoh: Rian Maulana (Teknisi Kiosk)"
                    className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:bg-white focus:border-[#DE5795] focus:outline-hidden"
                  />
                </div>

                {/* Notes */}
                <div className="space-y-1.5">
                  <label className="font-bold text-gray-800">Catatan / No. Surat Jalan</label>
                  <textarea
                    rows={2}
                    value={mutationNotes}
                    onChange={(e) => setMutationNotes(e.target.value)}
                    placeholder="Tuliskan keterangan pengisian (opsional)..."
                    className="w-full px-3.5 py-2 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:bg-white focus:border-[#DE5795] focus:outline-hidden"
                  />
                </div>
              </form>

              {/* Footer with generous padding around buttons */}
              <div className="px-8 pt-5.5 pb-7 border-t border-gray-200/80 bg-white/95 backdrop-blur-md flex items-center justify-between">
                <span className="text-[11px] text-gray-400">Tekan ESC untuk menutup</span>
                <div className="flex items-center gap-2.5">
                  <button
                    type="button"
                    onClick={() => setIsMutationDrawerOpen(false)}
                    className="px-4 py-2.5 text-xs font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    form="mutation-form"
                    className="px-5 py-2.5 text-xs font-semibold text-white bg-gradient-to-r from-pink-600 to-[#DE5795] hover:opacity-95 rounded-xl transition-all shadow-xs flex items-center gap-1.5"
                  >
                    <Check className="w-4 h-4" />
                    <span>Konfirmasi Mutasi</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* DRAWER 2: Tambah Stok / Item Baru (Floating Slide-Over)                   */}
      {/* ========================================================================= */}
      {isAddItemDrawerOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          <div
            onClick={() => setIsAddItemDrawerOpen(false)}
            className="absolute inset-0 bg-black/40 backdrop-blur-xs transition-opacity animate-fade-in"
          />

          <div className="fixed inset-y-0 right-0 max-w-full flex pl-6 sm:pl-10 p-3 sm:p-4 pointer-events-none">
            <div className="w-screen max-w-xl bg-white shadow-2xl border border-gray-200/90 rounded-3xl flex flex-col animate-slide-left overflow-hidden ring-1 ring-black/10 pointer-events-auto">
              <div className="px-8 pt-7 pb-7.5 border-b border-gray-200/80 flex items-start justify-between bg-white">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-gray-900 text-white flex items-center justify-center shadow-xs">
                    <Plus className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-gray-900">Tambah Item / Restock Masuk</h2>
                    <p className="text-xs text-gray-500 mt-0.5">
                      Daftarkan bahan habis pakai baru atau aset hardware booth.
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setIsAddItemDrawerOpen(false)}
                  className="p-2 text-gray-400 hover:text-gray-600 rounded-xl hover:bg-gray-100 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form id="add-item-form" onSubmit={handleAddItemSubmit} className="px-8 py-6 overflow-y-auto flex-1 space-y-4 text-xs">
                {/* Category */}
                <div className="space-y-1.5">
                  <label className="font-bold text-gray-800">Kategori Barang *</label>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { id: 'consumable', label: 'Kertas & Tinta', icon: Printer },
                      { id: 'frame', label: 'Frame & Souvenir', icon: Layers },
                      { id: 'hardware', label: 'Hardware & IoT', icon: Cpu },
                      { id: 'maintenance', label: 'Maintenance / Kabel', icon: PackageCheck },
                    ].map((cat) => {
                      const Icon = cat.icon;
                      const isSel = newItemCategory === cat.id;
                      return (
                        <button
                          key={cat.id}
                          type="button"
                          onClick={() => setNewItemCategory(cat.id as InventoryCategory)}
                          className={`p-2.5 rounded-xl border flex items-center gap-2 text-left transition-all ${
                            isSel
                              ? 'border-[#DE5795] bg-pink-50 text-[#9D174D] font-bold shadow-2xs'
                              : 'border-gray-200 bg-white text-gray-600 hover:bg-gray-50'
                          }`}
                        >
                          <Icon className="w-4 h-4 shrink-0" />
                          <span>{cat.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Name */}
                <div className="space-y-1.5">
                  <label className="font-bold text-gray-800">Nama Barang / Deskripsi *</label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Kertas DNP 4x6 Box (2 Roll + 2 Ribbon)"
                    value={newItemName}
                    onChange={(e) => setNewItemName(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:bg-white focus:border-[#DE5795] focus:outline-hidden"
                  />
                </div>

                {/* SKU & Unit */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="font-bold text-gray-800">SKU / Kode Barcode *</label>
                    <input
                      type="text"
                      required
                      placeholder="Contoh: DNP-RX1-BOX"
                      value={newItemSku}
                      onChange={(e) => setNewItemSku(e.target.value)}
                      className="w-full px-3.5 py-2 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 uppercase font-mono focus:bg-white focus:border-[#DE5795] focus:outline-hidden"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="font-bold text-gray-800">Satuan Unit *</label>
                    <input
                      type="text"
                      placeholder="Lembar / Roll / Box / Pcs"
                      value={newItemUnit}
                      onChange={(e) => setNewItemUnit(e.target.value)}
                      className="w-full px-3.5 py-2 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:bg-white focus:border-[#DE5795] focus:outline-hidden"
                    />
                  </div>
                </div>

                {/* Storage Location */}
                <div className="space-y-1.5">
                  <label className="font-bold text-gray-800">Lokasi Penempatan Awal *</label>
                  <select
                    value={newItemLocation}
                    onChange={(e) => setNewItemLocation(e.target.value as StorageLocation)}
                    className="w-full px-3.5 py-2 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 font-medium focus:bg-white focus:border-[#DE5795] focus:outline-hidden"
                  >
                    {locationOptions.filter((l) => l !== 'Semua Lokasi').map((l) => (
                      <option key={l} value={l}>
                        {l}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Stock & Min Threshold */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="font-bold text-gray-800">Jumlah Stok Masuk *</label>
                    <input
                      type="number"
                      min={1}
                      value={newItemStock}
                      onChange={(e) => setNewItemStock(parseInt(e.target.value) || 0)}
                      className="w-full px-3.5 py-2 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 font-bold focus:bg-white focus:border-[#DE5795] focus:outline-hidden"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="font-bold text-gray-800">Batas Minimum Peringatan *</label>
                    <input
                      type="number"
                      min={1}
                      value={newItemMinThreshold}
                      onChange={(e) => setNewItemMinThreshold(parseInt(e.target.value) || 0)}
                      className="w-full px-3.5 py-2 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 font-bold focus:bg-white focus:border-[#DE5795] focus:outline-hidden"
                    />
                  </div>
                </div>

                {/* Cost & Supplier */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="font-bold text-gray-800">Harga Beli Satuan (Rp) *</label>
                    <input
                      type="number"
                      step={5000}
                      value={newItemCost}
                      onChange={(e) => setNewItemCost(parseInt(e.target.value) || 0)}
                      className="w-full px-3.5 py-2 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 font-bold focus:bg-white focus:border-[#DE5795] focus:outline-hidden"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="font-bold text-gray-800">Supplier / Vendor *</label>
                    <input
                      type="text"
                      placeholder="Contoh: PT DNP Indonesia"
                      value={newItemSupplier}
                      onChange={(e) => setNewItemSupplier(e.target.value)}
                      className="w-full px-3.5 py-2 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:bg-white focus:border-[#DE5795] focus:outline-hidden"
                    />
                  </div>
                </div>
              </form>

              <div className="px-8 pt-5.5 pb-7 border-t border-gray-200/80 bg-white/95 backdrop-blur-md flex items-center justify-between">
                <span className="text-[11px] text-gray-400">Tekan ESC untuk membatalkan</span>
                <div className="flex items-center gap-2.5">
                  <button
                    type="button"
                    onClick={() => setIsAddItemDrawerOpen(false)}
                    className="px-4 py-2.5 text-xs font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    form="add-item-form"
                    className="px-5 py-2.5 text-xs font-semibold text-white bg-gradient-to-r from-pink-600 to-[#DE5795] hover:opacity-95 rounded-xl transition-all shadow-xs"
                  >
                    Simpan Item ke Inventaris
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* DRAWER 3: Detail Item & Telemetri Hardware (Floating Slide-Over)          */}
      {/* ========================================================================= */}
      {selectedItemForDetail && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          <div
            onClick={() => setSelectedItemForDetail(null)}
            className="absolute inset-0 bg-black/40 backdrop-blur-xs transition-opacity animate-fade-in"
          />

          <div className="fixed inset-y-0 right-0 max-w-full flex pl-6 sm:pl-10 p-3 sm:p-4 pointer-events-none">
            <div className="w-screen max-w-xl bg-white shadow-2xl border border-gray-200/90 rounded-3xl flex flex-col animate-slide-left overflow-hidden ring-1 ring-black/10 pointer-events-auto">
              <div className="px-8 pt-7 pb-7.5 border-b border-gray-200/80 flex items-start justify-between bg-white">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-pink-50 text-[#DE5795] flex items-center justify-center shadow-xs">
                    <Info className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-gray-900">{selectedItemForDetail.name}</h2>
                    <p className="text-xs font-mono text-gray-400 mt-0.5">SKU: {selectedItemForDetail.sku}</p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedItemForDetail(null)}
                  className="p-2 text-gray-400 hover:text-gray-600 rounded-xl hover:bg-gray-100 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="px-8 py-6 overflow-y-auto flex-1 space-y-5 text-xs">
                {/* Status Box */}
                <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200/80 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-500 font-medium">Status Kesiapan</span>
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      {selectedItemForDetail.status}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-[11px]">
                    <div>
                      <span className="text-gray-400">Lokasi:</span>
                      <p className="font-bold text-gray-800">{selectedItemForDetail.location}</p>
                    </div>
                    <div>
                      <span className="text-gray-400">Total Stok Saat Ini:</span>
                      <p className="font-bold text-gray-800">{selectedItemForDetail.currentStock} {selectedItemForDetail.unit}</p>
                    </div>
                  </div>
                </div>

                {/* Device Details if Hardware */}
                {selectedItemForDetail.deviceDetails && (
                  <div className="space-y-2">
                    <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider flex items-center gap-1.5">
                      <Cpu className="w-4 h-4 text-blue-600" />
                      <span>Diagnostik & Telemetri Hardware IoT</span>
                    </h4>
                    <div className="p-3.5 rounded-xl border border-gray-200 bg-white space-y-2 text-[11px]">
                      <div className="flex justify-between py-1 border-b border-gray-100">
                        <span className="text-gray-500">Nomor Seri (Serial No)</span>
                        <span className="font-mono font-bold text-gray-800">{selectedItemForDetail.deviceDetails.serialNumber}</span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-gray-100">
                        <span className="text-gray-500">Suhu Operasional Head</span>
                        <span className="font-semibold text-emerald-600">{selectedItemForDetail.deviceDetails.operatingTemp || '36°C'}</span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-gray-100">
                        <span className="text-gray-500">Siklus / Counter Cetak Total</span>
                        <span className="font-bold text-gray-800">{selectedItemForDetail.deviceDetails.totalCyclesOrPrints?.toLocaleString()} cetakan</span>
                      </div>
                      <div className="flex justify-between py-1">
                        <span className="text-gray-500">Tingkat Kesehatan Alat</span>
                        <span className="font-bold text-emerald-600">{selectedItemForDetail.deviceDetails.healthPercentage}% Prima</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Supplier & Financials */}
                <div className="space-y-2">
                  <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider">
                    Informasi Pembelian & Pengadaan
                  </h4>
                  <div className="p-3.5 rounded-xl border border-gray-200 bg-white space-y-1.5 text-[11px]">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Nama Supplier / Vendor</span>
                      <span className="font-semibold text-gray-800">{selectedItemForDetail.supplier}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Harga Beli Satuan</span>
                      <span className="font-bold text-gray-900">Rp {selectedItemForDetail.costPerUnit.toLocaleString('id-ID')}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Terakhir Direstock</span>
                      <span className="text-gray-700">{selectedItemForDetail.lastRestocked}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="px-8 pt-5.5 pb-7 border-t border-gray-200/80 bg-white/95 backdrop-blur-md flex items-center justify-end">
                <button
                  type="button"
                  onClick={() => setSelectedItemForDetail(null)}
                  className="px-5 py-2.5 text-xs font-semibold text-white bg-gray-900 hover:bg-black rounded-xl transition-all shadow-xs"
                >
                  Tutup Rincian
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
