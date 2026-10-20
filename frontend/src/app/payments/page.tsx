'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  CreditCard,
  QrCode,
  TrendingUp,
  Receipt,
  Download,
  Printer,
  Calendar,
  Filter,
  Search,
  CheckCircle2,
  Clock,
  AlertCircle,
  RotateCcw,
  Store,
  ChevronDown,
  ArrowUpRight,
  FileSpreadsheet,
  X,
  ExternalLink,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';

interface Transaction {
  id: string;
  invoiceNumber: string;
  sessionCode: string;
  customerName: string;
  customerPhone?: string;
  boothId: string;
  boothName: string;
  packageName: string;
  amount: number;
  paymentMethod: 'QRIS' | 'EDC_CARD' | 'CASH';
  paymentProvider: string; // e.g., 'GoPay', 'BCA QRIS', 'Mandiri EDC', 'Kasir Tunai'
  status: 'SUCCESS' | 'PENDING' | 'REFUNDED' | 'FAILED';
  paidAt: string;
  printCopies: number;
  digitalDownload: boolean;
}

const INITIAL_TRANSACTIONS: Transaction[] = [
  {
    id: 'tx-001',
    invoiceNumber: 'INV-20261020-001',
    sessionCode: 'PB-CP-9021',
    customerName: 'Sarah & Budi',
    customerPhone: '+62 812-3456-7890',
    boothId: 'bth-002',
    boothName: 'Booth Beta - Central Park',
    packageName: 'Paket Strip 2x6 (4 Pose)',
    amount: 50000,
    paymentMethod: 'QRIS',
    paymentProvider: 'GoPay QRIS',
    status: 'SUCCESS',
    paidAt: '2026-10-20T12:42:15+07:00',
    printCopies: 2,
    digitalDownload: true,
  },
  {
    id: 'tx-002',
    invoiceNumber: 'INV-20261020-002',
    sessionCode: 'PB-GI-8842',
    customerName: 'Maya Angelica',
    customerPhone: '+62 813-8899-1122',
    boothId: 'bth-001',
    boothName: 'Booth Alpha - Grand Indonesia',
    packageName: 'Paket Postcard 4x6 (2 Pose)',
    amount: 65000,
    paymentMethod: 'QRIS',
    paymentProvider: 'BCA QRIS',
    status: 'SUCCESS',
    paidAt: '2026-10-20T12:15:30+07:00',
    printCopies: 4,
    digitalDownload: true,
  },
  {
    id: 'tx-003',
    invoiceNumber: 'INV-20261020-003',
    sessionCode: 'PB-PVJ-1029',
    customerName: 'Dimas Prasetyo',
    customerPhone: '+62 818-0912-3344',
    boothId: 'bth-003',
    boothName: 'Booth Gamma - Paris Van Java',
    packageName: 'Paket Grid 2x2 Party',
    amount: 50000,
    paymentMethod: 'EDC_CARD',
    paymentProvider: 'Mandiri Visa EDC',
    status: 'SUCCESS',
    paidAt: '2026-10-20T11:50:00+07:00',
    printCopies: 2,
    digitalDownload: true,
  },
  {
    id: 'tx-004',
    invoiceNumber: 'INV-20261020-004',
    sessionCode: 'PB-GI-8841',
    customerName: 'Rian & Jessica',
    customerPhone: '+62 856-7788-9900',
    boothId: 'bth-001',
    boothName: 'Booth Alpha - Grand Indonesia',
    packageName: 'Paket Strip 2x6 + Ekstra 2 Cetak',
    amount: 75000,
    paymentMethod: 'QRIS',
    paymentProvider: 'ShopeePay QRIS',
    status: 'SUCCESS',
    paidAt: '2026-10-20T11:20:10+07:00',
    printCopies: 4,
    digitalDownload: true,
  },
  {
    id: 'tx-005',
    invoiceNumber: 'INV-20261020-005',
    sessionCode: 'PB-CP-9020',
    customerName: 'Alif Kurnia',
    customerPhone: '+62 821-4455-6677',
    boothId: 'bth-002',
    boothName: 'Booth Beta - Central Park',
    packageName: 'Paket Polaroid Single',
    amount: 35000,
    paymentMethod: 'CASH',
    paymentProvider: 'Kasir Booth',
    status: 'SUCCESS',
    paidAt: '2026-10-20T10:45:00+07:00',
    printCopies: 1,
    digitalDownload: true,
  },
  {
    id: 'tx-006',
    invoiceNumber: 'INV-20261020-006',
    sessionCode: 'PB-PVJ-1028',
    customerName: 'Tamu Booth #1028',
    customerPhone: '',
    boothId: 'bth-003',
    boothName: 'Booth Gamma - Paris Van Java',
    packageName: 'Paket Strip 2x6',
    amount: 50000,
    paymentMethod: 'QRIS',
    paymentProvider: 'OVO QRIS',
    status: 'PENDING',
    paidAt: '2026-10-20T10:30:12+07:00',
    printCopies: 2,
    digitalDownload: false,
  },
  {
    id: 'tx-007',
    invoiceNumber: 'INV-20261019-099',
    sessionCode: 'PB-GI-8839',
    customerName: 'Nadia Safira',
    customerPhone: '+62 811-2233-4455',
    boothId: 'bth-001',
    boothName: 'Booth Alpha - Grand Indonesia',
    packageName: 'Paket Strip 2x6 (4 Pose)',
    amount: 50000,
    paymentMethod: 'QRIS',
    paymentProvider: 'GoPay QRIS',
    status: 'REFUNDED',
    paidAt: '2026-10-19T20:14:00+07:00',
    printCopies: 0,
    digitalDownload: false,
  },
  {
    id: 'tx-008',
    invoiceNumber: 'INV-20261019-098',
    sessionCode: 'PB-CP-9018',
    customerName: 'Kevin Sanjaya & Partner',
    customerPhone: '+62 819-3322-1100',
    boothId: 'bth-002',
    boothName: 'Booth Beta - Central Park',
    packageName: 'Paket Deluxe Wedding 4x6',
    amount: 100000,
    paymentMethod: 'EDC_CARD',
    paymentProvider: 'BCA Mastercard EDC',
    status: 'SUCCESS',
    paidAt: '2026-10-19T19:40:22+07:00',
    printCopies: 6,
    digitalDownload: true,
  },
];

export default function PaymentsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>(INITIAL_TRANSACTIONS);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBooth, setSelectedBooth] = useState('ALL');
  const [selectedMethod, setSelectedMethod] = useState('ALL');
  const [selectedStatus, setSelectedStatus] = useState('ALL');
  const [selectedPeriod, setSelectedPeriod] = useState('TODAY');
  const [activeReceipt, setActiveReceipt] = useState<Transaction | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Filtered transactions
  const filteredTransactions = useMemo(() => {
    return transactions.filter((tx) => {
      // Search
      const matchSearch =
        tx.invoiceNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tx.sessionCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tx.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tx.packageName.toLowerCase().includes(searchQuery.toLowerCase());

      // Booth
      const matchBooth = selectedBooth === 'ALL' || tx.boothId === selectedBooth;

      // Method
      const matchMethod = selectedMethod === 'ALL' || tx.paymentMethod === selectedMethod;

      // Status
      const matchStatus = selectedStatus === 'ALL' || tx.status === selectedStatus;

      return matchSearch && matchBooth && matchMethod && matchStatus;
    });
  }, [transactions, searchQuery, selectedBooth, selectedMethod, selectedStatus]);

  // Aggregate KPI metrics
  const metrics = useMemo(() => {
    const successList = transactions.filter((t) => t.status === 'SUCCESS');
    const totalRevenue = successList.reduce((acc, curr) => acc + curr.amount, 0);
    const totalCount = transactions.length;
    const successCount = successList.length;
    const aov = successCount > 0 ? Math.round(totalRevenue / successCount) : 0;

    const qrisRevenue = successList
      .filter((t) => t.paymentMethod === 'QRIS')
      .reduce((acc, curr) => acc + curr.amount, 0);
    const qrisShare = totalRevenue > 0 ? Math.round((qrisRevenue / totalRevenue) * 100) : 0;

    return {
      totalRevenue,
      successCount,
      totalCount,
      aov,
      qrisRevenue,
      qrisShare,
    };
  }, [transactions]);

  const handleExportCSV = () => {
    const headers = 'Invoice,Kode Sesi,Pelanggan,Unit Booth,Paket,Metode,Provider,Nominal,Status,Waktu\n';
    const rows = filteredTransactions
      .map(
        (t) =>
          `"${t.invoiceNumber}","${t.sessionCode}","${t.customerName}","${t.boothName}","${t.packageName}","${t.paymentMethod}","${t.paymentProvider}",${t.amount},"${t.status}","${t.paidAt}"`
      )
      .join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `laporan-pembayaran-photobooth-${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Laporan berhasil diekspor ke file CSV');
  };

  const handlePrintReport = () => {
    window.print();
  };

  return (
    <div className="space-y-6 font-sora animate-fade-in text-gray-900 pb-16">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 px-4 py-3 rounded-xl bg-gray-900 text-white text-xs font-semibold shadow-2xl flex items-center gap-2 border border-gray-800 animate-slide-up">
          <CheckCircle2 className="w-4 h-4 text-[#DE5795]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-200/80 pb-5">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl font-bold tracking-tight text-gray-900">
              Laporan & Pembayaran
            </h1>
            <span className="px-2.5 py-0.5 text-xs font-semibold rounded-full bg-[#DE5795]/15 text-[#9D174D] border border-[#DE5795]/30">
              Financial POS
            </span>
          </div>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            Pantau arus kas masuk, performa omzet per unit booth, transaksi QRIS dinamis, dan riwayat struk pembayaran.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2.5 shrink-0">
          <button
            onClick={handleExportCSV}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-xl bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 transition shadow-xs"
            title="Ekspor ke Excel / CSV"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
            <span>Ekspor CSV</span>
          </button>

          <button
            onClick={handlePrintReport}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-xl bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 transition shadow-xs"
            title="Cetak Laporan ke Printer atau PDF"
          >
            <Printer className="w-4 h-4 text-gray-600" />
            <span>Cetak PDF</span>
          </button>
        </div>
      </div>

      {/* KPI Metrics Cards (Untitled UI Standard) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Gross Revenue */}
        <div className="p-5 rounded-2xl bg-white border border-gray-200/90 shadow-xs space-y-3 hover:border-gray-300 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-gray-500">Total Omzet (Bulan Ini)</span>
            <div className="w-9 h-9 rounded-xl bg-[#DE5795]/15 border border-[#DE5795]/30 flex items-center justify-center text-[#9D174D]">
              <TrendingUp className="w-4.5 h-4.5" />
            </div>
          </div>
          <div>
            <h3 className="text-2xl font-black text-gray-900 tracking-tight">
              Rp {metrics.totalRevenue.toLocaleString('id-ID')}
            </h3>
            <div className="flex items-center gap-1.5 mt-1 text-xs">
              <span className="text-emerald-700 font-semibold flex items-center">
                <ArrowUpRight className="w-3.5 h-3.5" /> +14.2%
              </span>
              <span className="text-gray-400">vs bulan lalu</span>
            </div>
          </div>
        </div>

        {/* Card 2: Successful Transactions */}
        <div className="p-5 rounded-2xl bg-white border border-gray-200/90 shadow-xs space-y-3 hover:border-gray-300 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-gray-500">Transaksi Berhasil</span>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700">
              <CheckCircle2 className="w-4.5 h-4.5" />
            </div>
          </div>
          <div>
            <h3 className="text-2xl font-black text-gray-900 tracking-tight">
              {metrics.successCount} Sesi
            </h3>
            <div className="flex items-center gap-1.5 mt-1 text-xs text-gray-500">
              <span className="font-semibold text-emerald-700">
                {Math.round((metrics.successCount / (metrics.totalCount || 1)) * 100)}%
              </span>
              <span>tingkat sukses pembayaran</span>
            </div>
          </div>
        </div>

        {/* Card 3: Average Order Value */}
        <div className="p-5 rounded-2xl bg-white border border-gray-200/90 shadow-xs space-y-3 hover:border-gray-300 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-gray-500">Rata-rata per Tamu (AOV)</span>
            <div className="w-9 h-9 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-700">
              <Receipt className="w-4.5 h-4.5" />
            </div>
          </div>
          <div>
            <h3 className="text-2xl font-black text-gray-900 tracking-tight">
              Rp {metrics.aov.toLocaleString('id-ID')}
            </h3>
            <p className="text-xs text-gray-400 mt-1">Paket terlaris: Strip 2x6</p>
          </div>
        </div>

        {/* Card 4: QRIS Digital Share */}
        <div className="p-5 rounded-2xl bg-white border border-gray-200/90 shadow-xs space-y-3 hover:border-gray-300 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-gray-500">Pangsa QRIS Dinamis</span>
            <div className="w-9 h-9 rounded-xl bg-purple-50 border border-purple-200 flex items-center justify-center text-purple-700">
              <QrCode className="w-4.5 h-4.5" />
            </div>
          </div>
          <div>
            <h3 className="text-2xl font-black text-gray-900 tracking-tight">
              {metrics.qrisShare}%
            </h3>
            <p className="text-xs text-gray-400 mt-1">
              Rp {metrics.qrisRevenue.toLocaleString('id-ID')} via GoPay / BCA
            </p>
          </div>
        </div>
      </div>

      {/* Visual Analytics / Revenue Breakdown Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Weekly Trend Mini Visual */}
        <div className="lg:col-span-2 p-5 rounded-2xl bg-white border border-gray-200/90 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-bold text-gray-900">Grafik Penjualan 7 Hari Terakhir</h4>
              <p className="text-xs text-gray-500">Aktivitas penerimaan transaksi per hari</p>
            </div>
            <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded-md bg-gray-100 text-gray-700">
              Update Otomatis
            </span>
          </div>

          {/* Stylized Weekly Bars */}
          <div className="pt-2">
            <div className="h-40 flex items-end justify-between gap-2 sm:gap-4 px-2 border-b border-gray-100 pb-2">
              {[
                { day: 'Sen', amount: 2800000, height: '45%' },
                { day: 'Sel', amount: 3200000, height: '52%' },
                { day: 'Rab', amount: 2950000, height: '48%' },
                { day: 'Kam', amount: 3800000, height: '62%' },
                { day: 'Jum', amount: 4900000, height: '80%' },
                { day: 'Sab', amount: 6200000, height: '100%', isPeak: true },
                { day: 'Min', amount: 5400000, height: '88%' },
              ].map((item, idx) => (
                <div key={idx} className="flex-1 flex flex-col items-center gap-2 group cursor-pointer">
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity text-[10px] font-mono font-semibold text-[#9D174D] bg-[#DE5795]/15 px-1.5 py-0.5 rounded shadow-xs whitespace-nowrap">
                    Rp {(item.amount / 1000000).toFixed(1)}jt
                  </div>
                  <div className="w-full bg-gray-100 rounded-t-lg h-32 flex items-end overflow-hidden">
                    <div
                      className={`w-full rounded-t-lg transition-all duration-500 ${
                        item.isPeak
                          ? 'bg-[#DE5795] shadow-xs'
                          : 'bg-[#DE5795]/50 group-hover:bg-[#DE5795]'
                      }`}
                      style={{ height: item.height }}
                    />
                  </div>
                  <span className="text-xs font-medium text-gray-600 group-hover:text-gray-900">
                    {item.day}
                  </span>
                </div>
              ))}
            </div>
            <div className="flex items-center justify-between text-[11px] text-gray-400 pt-2">
              <span>*Hari Sabtu merupakan puncak kunjungan terpadat (Rp 6,2 Juta)</span>
              <span>Satuan: IDR</span>
            </div>
          </div>
        </div>

        {/* Share of Payment Method & Booth Breakdown */}
        <div className="p-5 rounded-2xl bg-white border border-gray-200/90 shadow-xs space-y-4 flex flex-col justify-between">
          <div>
            <h4 className="text-sm font-bold text-gray-900">Metode Pembayaran</h4>
            <p className="text-xs text-gray-500">Proporsi saluran penerimaan dana</p>
          </div>

          <div className="space-y-3">
            <div>
              <div className="flex items-center justify-between text-xs font-semibold mb-1">
                <span className="flex items-center gap-1.5 text-gray-800">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#DE5795]" /> QRIS Dinamis
                </span>
                <span className="font-mono text-gray-900">78%</span>
              </div>
              <div className="h-2 w-full rounded-full bg-gray-100 overflow-hidden">
                <div className="h-full bg-[#DE5795] rounded-full" style={{ width: '78%' }} />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between text-xs font-semibold mb-1">
                <span className="flex items-center gap-1.5 text-gray-800">
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-600" /> EDC Kartu Debit/Kredit
                </span>
                <span className="font-mono text-gray-900">16%</span>
              </div>
              <div className="h-2 w-full rounded-full bg-gray-100 overflow-hidden">
                <div className="h-full bg-blue-600 rounded-full" style={{ width: '16%' }} />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between text-xs font-semibold mb-1">
                <span className="flex items-center gap-1.5 text-gray-800">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500" /> Kasir Tunai (Cash)
                </span>
                <span className="font-mono text-gray-900">6%</span>
              </div>
              <div className="h-2 w-full rounded-full bg-gray-100 overflow-hidden">
                <div className="h-full bg-amber-500 rounded-full" style={{ width: '6%' }} />
              </div>
            </div>
          </div>

          {/* Settlement Info Banner */}
          <div className="p-3 rounded-xl bg-gray-50 border border-gray-200 text-xs text-gray-600 flex items-start gap-2.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-gray-800">Auto-Settlement T+1</p>
              <p className="text-[11px] text-gray-500 mt-0.5">
                Dana QRIS otomatis dicairkan ke rekening operasional setiap pukul 02:00 WIB.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters & Search Toolbar */}
      <div className="p-4 rounded-2xl bg-white border border-gray-200/90 shadow-xs space-y-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Search Box */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Cari invoice, kode sesi, atau nama tamu..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-gray-200 focus:outline-hidden focus:border-[#DE5795] focus:ring-2 focus:ring-[#DE5795]/20 font-sora"
            />
          </div>

          {/* Quick Period Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            {[
              { id: 'TODAY', label: 'Hari Ini' },
              { id: 'WEEK', label: '7 Hari' },
              { id: 'MONTH', label: 'Bulan Ini' },
              { id: 'ALL', label: 'Semua' },
            ].map((p) => (
              <button
                key={p.id}
                onClick={() => setSelectedPeriod(p.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${
                  selectedPeriod === p.id
                    ? 'bg-[#DE5795] text-white shadow-xs'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        {/* Dropdowns Filter Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-2 border-t border-gray-100 text-xs">
          {/* Booth Filter */}
          <div>
            <label className="text-[11px] font-medium text-gray-500 block mb-1">Unit Booth</label>
            <select
              value={selectedBooth}
              onChange={(e) => setSelectedBooth(e.target.value)}
              className="w-full px-3 py-1.5 rounded-lg border border-gray-200 focus:outline-hidden focus:border-[#DE5795]"
            >
              <option value="ALL">Semua Booth</option>
              <option value="bth-001">Booth Alpha - Grand Indonesia</option>
              <option value="bth-002">Booth Beta - Central Park</option>
              <option value="bth-003">Booth Gamma - Paris Van Java</option>
            </select>
          </div>

          {/* Payment Method Filter */}
          <div>
            <label className="text-[11px] font-medium text-gray-500 block mb-1">Metode Bayar</label>
            <select
              value={selectedMethod}
              onChange={(e) => setSelectedMethod(e.target.value)}
              className="w-full px-3 py-1.5 rounded-lg border border-gray-200 focus:outline-hidden focus:border-[#DE5795]"
            >
              <option value="ALL">Semua Metode</option>
              <option value="QRIS">QRIS Dinamis</option>
              <option value="EDC_CARD">EDC Kartu</option>
              <option value="CASH">Kasir Tunai</option>
            </select>
          </div>

          {/* Status Filter */}
          <div>
            <label className="text-[11px] font-medium text-gray-500 block mb-1">Status Transaksi</label>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full px-3 py-1.5 rounded-lg border border-gray-200 focus:outline-hidden focus:border-[#DE5795]"
            >
              <option value="ALL">Semua Status</option>
              <option value="SUCCESS">Berhasil / Lunas</option>
              <option value="PENDING">Menunggu Pembayaran</option>
              <option value="REFUNDED">Refund / Dibatalkan</option>
            </select>
          </div>
        </div>
      </div>

      {/* Transactions Table Ledger */}
      <div className="rounded-2xl bg-white border border-gray-200/90 shadow-xs overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-bold text-gray-900">Daftar Transaksi Kasir & Kios</h3>
            <span className="px-2 py-0.5 rounded-md bg-gray-100 text-gray-700 text-[11px] font-semibold">
              {filteredTransactions.length} Baris
            </span>
          </div>
          <span className="text-xs text-gray-400">Sinkronisasi otomatis real-time</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-gray-50/70 border-b border-gray-200 text-gray-500 font-semibold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="px-5 py-3.5">Invoice & Waktu</th>
                <th className="px-5 py-3.5">Kode Sesi & Tamu</th>
                <th className="px-5 py-3.5">Unit Booth</th>
                <th className="px-5 py-3.5">Paket & Cetak</th>
                <th className="px-5 py-3.5">Metode Bayar</th>
                <th className="px-5 py-3.5 text-right">Nominal</th>
                <th className="px-5 py-3.5 text-center">Status</th>
                <th className="px-5 py-3.5 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredTransactions.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-5 py-12 text-center text-gray-400">
                    <Receipt className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                    <p className="font-medium">Tidak ada transaksi yang cocok dengan filter ini.</p>
                  </td>
                </tr>
              ) : (
                filteredTransactions.map((tx) => (
                  <tr key={tx.id} className="hover:bg-gray-50/80 transition-colors">
                    {/* Invoice & Time */}
                    <td className="px-5 py-4">
                      <div className="font-mono font-bold text-gray-900">{tx.invoiceNumber}</div>
                      <div className="text-[11px] text-gray-500 mt-0.5">
                        {new Date(tx.paidAt).toLocaleTimeString('id-ID', {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}{' '}
                        •{' '}
                        {new Date(tx.paidAt).toLocaleDateString('id-ID', {
                          day: 'numeric',
                          month: 'short',
                        })}
                      </div>
                    </td>

                    {/* Session & Guest */}
                    <td className="px-5 py-4">
                      <div className="font-semibold text-gray-900">{tx.customerName}</div>
                      <span className="font-mono text-[10px] text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded">
                        {tx.sessionCode}
                      </span>
                    </td>

                    {/* Booth */}
                    <td className="px-5 py-4 text-gray-700">
                      <div className="font-medium truncate max-w-[150px]">{tx.boothName}</div>
                      <span className="text-[10px] text-gray-400">{tx.boothId}</span>
                    </td>

                    {/* Package */}
                    <td className="px-5 py-4">
                      <div className="font-medium text-gray-800">{tx.packageName}</div>
                      <div className="text-[11px] text-gray-500">
                        {tx.printCopies} Lembar Cetak • {tx.digitalDownload ? 'QR Aktif' : 'Tanpa QR'}
                      </div>
                    </td>

                    {/* Method */}
                    <td className="px-5 py-4">
                      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-gray-100 text-gray-800 border border-gray-200">
                        {tx.paymentMethod === 'QRIS' && <QrCode className="w-3 h-3 text-[#DE5795]" />}
                        {tx.paymentMethod === 'EDC_CARD' && <CreditCard className="w-3 h-3 text-blue-600" />}
                        {tx.paymentMethod === 'CASH' && <Receipt className="w-3 h-3 text-emerald-600" />}
                        <span>{tx.paymentProvider}</span>
                      </div>
                    </td>

                    {/* Amount */}
                    <td className="px-5 py-4 text-right">
                      <span className="font-mono font-bold text-sm text-gray-900">
                        Rp {tx.amount.toLocaleString('id-ID')}
                      </span>
                    </td>

                    {/* Status */}
                    <td className="px-5 py-4 text-center">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold border ${
                          tx.status === 'SUCCESS'
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : tx.status === 'PENDING'
                            ? 'bg-amber-50 text-amber-700 border-amber-200'
                            : 'bg-gray-100 text-gray-600 border-gray-200'
                        }`}
                      >
                        {tx.status === 'SUCCESS' && <CheckCircle2 className="w-3 h-3" />}
                        {tx.status === 'PENDING' && <Clock className="w-3 h-3" />}
                        {tx.status === 'REFUNDED' && <RotateCcw className="w-3 h-3" />}
                        <span>
                          {tx.status === 'SUCCESS' && 'Lunas'}
                          {tx.status === 'PENDING' && 'Pending'}
                          {tx.status === 'REFUNDED' && 'Refund'}
                        </span>
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="px-5 py-4 text-right">
                      <button
                        onClick={() => setActiveReceipt(tx)}
                        className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-white border border-gray-200 text-gray-700 hover:bg-[#DE5795]/10 hover:text-[#9D174D] hover:border-[#DE5795]/40 transition shadow-xs"
                      >
                        Struk Kasir
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Table Footer Summary */}
        <div className="px-5 py-3.5 bg-gray-50/80 border-t border-gray-200 flex flex-col sm:flex-row sm:items-center justify-between text-xs text-gray-500 gap-2">
          <span>
            Menampilkan <strong className="text-gray-900">{filteredTransactions.length}</strong> transaksi dari total {transactions.length}
          </span>
          <div className="flex items-center gap-2">
            <span>Subtotal Ditampilkan:</span>
            <strong className="text-sm font-mono font-bold text-[#9D174D]">
              Rp {filteredTransactions.reduce((acc, c) => acc + (c.status === 'SUCCESS' ? c.amount : 0), 0).toLocaleString('id-ID')}
            </strong>
          </div>
        </div>
      </div>

      {/* ============================================================ */}
      {/* DIGITAL RECEIPT / INVOICE MODAL                              */}
      {/* ============================================================ */}
      {activeReceipt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-950/70 backdrop-blur-sm animate-fade-in font-sora">
          <div className="relative w-full max-w-sm rounded-3xl bg-white p-6 shadow-2xl border border-gray-200 space-y-4 text-left">
            {/* Modal Header */}
            <div className="flex items-start justify-between border-b border-dashed border-gray-200 pb-3">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-gray-400">Bukti Transaksi Resmi</span>
                <h3 className="text-base font-bold text-gray-900">PhotoBooth OS</h3>
                <p className="text-xs text-gray-500">{activeReceipt.boothName}</p>
              </div>
              <button
                onClick={() => setActiveReceipt(null)}
                className="p-1 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Receipt Meta */}
            <div className="space-y-1 text-xs text-gray-600 bg-gray-50 p-3 rounded-xl border border-gray-100 font-mono">
              <div className="flex justify-between">
                <span>No. Invoice:</span>
                <strong className="text-gray-900">{activeReceipt.invoiceNumber}</strong>
              </div>
              <div className="flex justify-between">
                <span>Kode Sesi:</span>
                <strong className="text-gray-900">{activeReceipt.sessionCode}</strong>
              </div>
              <div className="flex justify-between">
                <span>Pelanggan:</span>
                <span className="text-gray-800">{activeReceipt.customerName}</span>
              </div>
              <div className="flex justify-between">
                <span>Waktu Bayar:</span>
                <span>{new Date(activeReceipt.paidAt).toLocaleString('id-ID')}</span>
              </div>
            </div>

            {/* Itemized Breakdown */}
            <div className="space-y-2 py-2 border-y border-dashed border-gray-200 text-xs">
              <div className="flex justify-between font-medium">
                <span>{activeReceipt.packageName}</span>
                <span className="font-mono">Rp {activeReceipt.amount.toLocaleString('id-ID')}</span>
              </div>
              <div className="flex justify-between text-gray-500 text-[11px]">
                <span>Cetak Fisik: {activeReceipt.printCopies} Lembar</span>
                <span>Termasuk</span>
              </div>
              <div className="flex justify-between text-gray-500 text-[11px]">
                <span>File Digital QR Code HD</span>
                <span>Gratis</span>
              </div>
            </div>

            {/* Total Section */}
            <div className="space-y-1.5 pt-1">
              <div className="flex justify-between text-xs text-gray-500">
                <span>Metode:</span>
                <span className="font-semibold text-gray-800">{activeReceipt.paymentProvider}</span>
              </div>
              <div className="flex justify-between text-sm font-bold text-gray-900 pt-1">
                <span>Total Bayar:</span>
                <span className="font-mono text-base text-[#9D174D]">
                  Rp {activeReceipt.amount.toLocaleString('id-ID')}
                </span>
              </div>
              <div className="flex items-center gap-1.5 text-[11px] text-emerald-700 font-semibold pt-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Transaksi Terverifikasi Sukses</span>
              </div>
            </div>

            {/* Receipt QR Code */}
            <div className="text-center pt-2">
              <img
                src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=https://photobooth.local/receipt/${activeReceipt.invoiceNumber}`}
                alt="Receipt QR"
                className="w-24 h-24 mx-auto rounded-lg border border-gray-200 p-1"
              />
              <p className="text-[10px] text-gray-400 mt-1 font-mono">Pindai untuk unduh e-Struk digital</p>
            </div>

            {/* Modal Actions */}
            <div className="flex items-center gap-2 pt-2 border-t border-gray-100">
              <button
                onClick={() => {
                  window.print();
                  showToast('Perintah cetak struk dikirim');
                }}
                className="flex-1 py-2.5 rounded-xl bg-[#DE5795] text-white font-bold text-xs hover:bg-[#c93d7e] transition flex items-center justify-center gap-1.5 shadow-xs"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Cetak Struk Fisik</span>
              </button>
              <button
                onClick={() => setActiveReceipt(null)}
                className="px-4 py-2.5 rounded-xl border border-gray-200 text-xs font-semibold text-gray-700 hover:bg-gray-100 transition"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
