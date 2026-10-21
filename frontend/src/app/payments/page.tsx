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
  Plus,
  Check,
  Banknote,
  Building2,
  PieChart,
  Percent,
  Wallet,
  ArrowRightLeft,
  ChevronRight,
  Landmark,
  BadgePercent,
  CalendarDays,
  FileText,
  User,
  Phone,
} from 'lucide-react';
import {
  MallPartnership,
  CashDrawerReconciliation,
  Transaction,
  ContractScheme,
  SettlementStatus,
} from '@/features/payments/types/payments.types';
import {
  INITIAL_MALL_PARTNERSHIPS,
  INITIAL_CASH_RECONCILIATIONS,
} from '@/features/payments/data/payments.mock';

const BOOTHS_LIST = [
  { id: 'bth-001', name: 'Booth Alpha - Grand Indonesia' },
  { id: 'bth-002', name: 'Booth Beta - Central Park' },
  { id: 'bth-003', name: 'Booth Gamma - Paris Van Java' },
  { id: 'bth-004', name: 'Booth Delta - Senayan City' },
];

const MANUAL_PACKAGES = [
  { name: 'Paket Strip 2x6 (4 Pose)', price: 50000, desc: '2 lembar cetak strip + file digital' },
  { name: 'Paket Postcard 4x6 (2 Pose)', price: 65000, desc: '1 lembar postcard jumbo' },
  { name: 'Paket Grid 2x2 Party', price: 50000, desc: '4 foto kotak estetik modern' },
  { name: 'Paket Polaroid Single', price: 35000, desc: '1 foto polaroid retro' },
];

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
  // Navigation Tabs: 'revenue-share' | 'transactions' | 'cash-reconciliation'
  const [activeTab, setActiveTab] = useState<'revenue-share' | 'transactions' | 'cash-reconciliation'>('revenue-share');

  // Transactions State
  const [transactions, setTransactions] = useState<Transaction[]>(INITIAL_TRANSACTIONS);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBooth, setSelectedBooth] = useState('ALL');
  const [selectedMethod, setSelectedMethod] = useState('ALL');
  const [selectedStatus, setSelectedStatus] = useState('ALL');
  const [activeReceipt, setActiveReceipt] = useState<Transaction | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Mall Partnerships State
  const [mallPartnerships, setMallPartnerships] = useState<MallPartnership[]>(INITIAL_MALL_PARTNERSHIPS);
  const [selectedMallDetail, setSelectedMallDetail] = useState<MallPartnership | null>(null);
  const [isConfigMallOpen, setIsConfigMallOpen] = useState(false);

  // Cash Reconciliations State
  const [cashReconciliations, setCashReconciliations] = useState<CashDrawerReconciliation[]>(INITIAL_CASH_RECONCILIATIONS);

  // Manual Payment Drawer State
  const [isManualModalOpen, setIsManualModalOpen] = useState(false);
  const [manualCustomer, setManualCustomer] = useState('');
  const [manualPhone, setManualPhone] = useState('');
  const [manualBoothId, setManualBoothId] = useState('bth-001');
  const [manualPackageIndex, setManualPackageIndex] = useState(0);
  const [manualMethod, setManualMethod] = useState<'CASH' | 'EDC_CARD' | 'QRIS'>('CASH');
  const [manualProvider, setManualProvider] = useState('Kasir Tunai Booth');
  const [manualCopies, setManualCopies] = useState(2);

  // Form State: Tambah / Edit Skema Mall
  const [newMallName, setNewMallName] = useState('');
  const [newMallBranch, setNewMallBranch] = useState('');
  const [newMallBoothId, setNewMallBoothId] = useState('bth-001');
  const [newContractType, setNewContractType] = useState<ContractScheme>('PERCENTAGE_REVENUE_SHARE');
  const [newSharePercent, setNewSharePercent] = useState<number>(20);
  const [newFlatRent, setNewFlatRent] = useState<number>(7500000);
  const [newPicMall, setNewPicMall] = useState('');
  const [newPicPhone, setNewPicPhone] = useState('');
  const [newBankName, setNewBankName] = useState('BCA');
  const [newAccountNo, setNewAccountNo] = useState('');
  const [newAccountHolder, setNewAccountHolder] = useState('');

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleSaveManualPayment = (e: React.FormEvent) => {
    e.preventDefault();
    const pkg = MANUAL_PACKAGES[manualPackageIndex] || MANUAL_PACKAGES[0];
    const boothObj = BOOTHS_LIST.find((b) => b.id === manualBoothId) || BOOTHS_LIST[0];
    const newInv = `INV-20261020-${String(transactions.length + 1).padStart(3, '0')}`;
    const newSession = `PB-${manualBoothId.slice(-3).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`;

    const newTx: Transaction = {
      id: `tx-${Date.now()}`,
      invoiceNumber: newInv,
      sessionCode: newSession,
      customerName: manualCustomer || 'Tamu Kasir Walk-in',
      customerPhone: manualPhone,
      boothId: manualBoothId,
      boothName: boothObj.name,
      packageName: pkg.name,
      amount: pkg.price,
      paymentMethod: manualMethod,
      paymentProvider: manualProvider,
      status: 'SUCCESS',
      paidAt: new Date().toISOString(),
      printCopies: manualCopies,
      digitalDownload: true,
    };

    setTransactions([newTx, ...transactions]);
    setIsManualModalOpen(false);
    setManualCustomer('');
    setManualPhone('');
    showToast(`Transaksi ${newInv} berhasil dicatat & divalidasi`);
    setActiveReceipt(newTx);
  };

  const handleSaveMallScheme = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMallName) {
      alert('Nama mall pengelola harus diisi');
      return;
    }

    const boothObj = BOOTHS_LIST.find((b) => b.id === newMallBoothId) || BOOTHS_LIST[0];
    const newPartner: MallPartnership = {
      id: `MALL-${Date.now().toString().slice(-4)}`,
      mallName: newMallName,
      mallBranch: newMallBranch || 'Area Kios PhotoBooth',
      boothId: newMallBoothId,
      boothName: boothObj.name,
      contractType: newContractType,
      contractTypeLabel:
        newContractType === 'PERCENTAGE_REVENUE_SHARE'
          ? `Bagi Hasil Omzet ${newSharePercent}%`
          : 'Sewa Tetap Flat Bulanan',
      revenueSharePercent: newContractType === 'PERCENTAGE_REVENUE_SHARE' ? newSharePercent : 0,
      flatRentAmount: newContractType === 'FLAT_RENT' ? newFlatRent : undefined,
      grossRevenueMonth: 25000000,
      totalSessions: 500,
      materialHppCost: 2900000,
      qrisMdrFee: 175000,
      mallShareDue:
        newContractType === 'PERCENTAGE_REVENUE_SHARE'
          ? (25000000 * newSharePercent) / 100
          : newFlatRent,
      netProfitVendor:
        newContractType === 'PERCENTAGE_REVENUE_SHARE'
          ? 25000000 - (25000000 * newSharePercent) / 100 - 2900000 - 175000
          : 25000000 - newFlatRent - 2900000 - 175000,
      settlementStatus: 'SIAP_TRANSFER',
      period: 'Oktober 2026',
      settlementDueDate: '30 Okt 2026',
      bankDetails: {
        bankName: newBankName,
        accountNumber: newAccountNo || '112-99-0021-99',
        accountHolder: newAccountHolder || `PT ${newMallName}`,
      },
      picMall: newPicMall || 'Tenant Relation Dept',
      picPhone: newPicPhone || '+62 812-0000-0000',
      contractEndDate: '31 Des 2027',
    };

    setMallPartnerships([...mallPartnerships, newPartner]);
    setIsConfigMallOpen(false);
    showToast(`Skema kemitraan "${newPartner.mallName}" berhasil didaftarkan`);

    // Reset Form
    setNewMallName('');
    setNewMallBranch('');
  };

  const handleMarkSettlementPaid = (mallId: string) => {
    setMallPartnerships((prev) =>
      prev.map((m) => (m.id === mallId ? { ...m, settlementStatus: 'LUNAS' } : m))
    );
    if (selectedMallDetail && selectedMallDetail.id === mallId) {
      setSelectedMallDetail({ ...selectedMallDetail, settlementStatus: 'LUNAS' });
    }
    showToast('Status tagihan berhasil diubah menjadi LUNAS');
  };

  // Filtered transactions
  const filteredTransactions = useMemo(() => {
    return transactions.filter((tx) => {
      const matchSearch =
        tx.invoiceNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tx.sessionCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tx.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tx.packageName.toLowerCase().includes(searchQuery.toLowerCase());

      const matchBooth = selectedBooth === 'ALL' || tx.boothId === selectedBooth;
      const matchMethod = selectedMethod === 'ALL' || tx.paymentMethod === selectedMethod;
      const matchStatus = selectedStatus === 'ALL' || tx.status === selectedStatus;

      return matchSearch && matchBooth && matchMethod && matchStatus;
    });
  }, [transactions, searchQuery, selectedBooth, selectedMethod, selectedStatus]);

  // Aggregate Metrics for Mall Revenue Sharing & Financials
  const mallAggregates = useMemo(() => {
    const totalGross = mallPartnerships.reduce((acc, curr) => acc + curr.grossRevenueMonth, 0);
    const totalMallDue = mallPartnerships.reduce((acc, curr) => acc + curr.mallShareDue, 0);
    const totalHpp = mallPartnerships.reduce((acc, curr) => acc + curr.materialHppCost + curr.qrisMdrFee, 0);
    const totalNetProfit = mallPartnerships.reduce((acc, curr) => acc + curr.netProfitVendor, 0);
    const totalSessions = mallPartnerships.reduce((acc, curr) => acc + curr.totalSessions, 0);
    const pendingSettlementCount = mallPartnerships.filter((m) => m.settlementStatus !== 'LUNAS').length;

    return {
      totalGross,
      totalMallDue,
      totalHpp,
      totalNetProfit,
      totalSessions,
      pendingSettlementCount,
      netMarginPercentage: totalGross > 0 ? Math.round((totalNetProfit / totalGross) * 100) : 0,
    };
  }, [mallPartnerships]);

  const handleExportCSV = () => {
    const headers = 'Mall,Unit Booth,Skema Kontrak,Omzet Kotor,Hak Mall Due,HPP Bahan,MDR QRIS,Laba Bersih,Status,Jatuh Tempo\n';
    const rows = mallPartnerships
      .map(
        (m) =>
          `"${m.mallName}","${m.boothName}","${m.contractTypeLabel}",${m.grossRevenueMonth},${m.mallShareDue},${m.materialHppCost},${m.qrisMdrFee},${m.netProfitVendor},"${m.settlementStatus}","${m.settlementDueDate}"`
      )
      .join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `laporan-bagi-hasil-mall-${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Laporan Finansial & Bagi Hasil berhasil diekspor (CSV)');
  };

  const handlePrintReport = () => {
    window.print();
  };

  return (
    <div className="space-y-6 font-sora animate-fade-in text-gray-900 pb-16">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 flex items-center gap-2.5 px-4 py-3 bg-gray-900 text-white text-xs rounded-2xl shadow-2xl border border-gray-700 animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* 1. Page Header (Untitled UI Standard) */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-gray-200 pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
            <span>PhotoBooth OS</span>
            <span>•</span>
            <span className="text-[#DE5795]">Finansial & Kasir</span>
            <span>•</span>
            <span>Bagi Hasil Mall</span>
          </div>
          <div className="flex items-center gap-3">
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight">
              Laporan Finansial Kasir & Bagi Hasil Mall
            </h1>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-pink-50 text-[#9D174D] border border-pink-200 shadow-2xs">
              <span className="w-1.5 h-1.5 rounded-full bg-[#DE5795] animate-pulse" />
              Financial POS & Settlement Live
            </span>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Rekonsiliasi omzet harian, bagi hasil sewa mall kiosk (revenue sharing), biaya MDR QRIS, serta audit kasir fisik.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2.5 shrink-0 flex-wrap">
          <button
            onClick={handleExportCSV}
            className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-gray-700 bg-white border border-gray-200/90 rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all shadow-2xs"
            title="Ekspor Laporan ke Excel / CSV"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
            <span>Ekspor CSV</span>
          </button>
          <button
            onClick={() => setIsConfigMallOpen(true)}
            className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-gray-700 bg-white border border-gray-200/90 rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all shadow-2xs"
          >
            <Building2 className="w-3.5 h-3.5 text-blue-600" />
            <span>+ Atur Skema Mall</span>
          </button>
          <button
            onClick={() => setIsManualModalOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-gradient-to-r from-pink-600 to-[#DE5795] rounded-xl hover:opacity-95 transition-all shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>+ Catat Kasir Manual</span>
          </button>
        </div>
      </div>

      {/* 2. Top Metric Cards Strip (Untitled UI 4 Cards) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Gross Revenue */}
        <div className="p-5 bg-white border border-gray-200/90 rounded-2xl shadow-2xs space-y-2 hover:shadow-md transition-all">
          <div className="flex items-center justify-between text-xs text-gray-500">
            <span className="font-semibold uppercase tracking-wider text-[11px]">Total Omzet Kotor</span>
            <div className="w-9 h-9 rounded-xl bg-pink-50 text-[#DE5795] flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-black text-gray-900 tracking-tight font-mono">
              Rp {mallAggregates.totalGross.toLocaleString('id-ID')}
            </div>
            <p className="text-[11px] text-gray-500 mt-1 flex items-center gap-1.5">
              <span className="font-semibold text-gray-700">{mallAggregates.totalSessions.toLocaleString('id-ID')} sesi cetak</span> di 4 mall
            </p>
          </div>
        </div>

        {/* Card 2: Bagi Hasil Hak Mall */}
        <div className="p-5 bg-white border border-gray-200/90 rounded-2xl shadow-2xs space-y-2 hover:shadow-md transition-all">
          <div className="flex items-center justify-between text-xs text-gray-500">
            <span className="font-semibold uppercase tracking-wider text-[11px]">Bagi Hasil Mall (Due)</span>
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Building2 className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-black text-blue-700 tracking-tight font-mono">
              Rp {mallAggregates.totalMallDue.toLocaleString('id-ID')}
            </div>
            <p className="text-[11px] text-blue-600 mt-1 font-semibold flex items-center gap-1">
              <span>{mallAggregates.pendingSettlementCount} Tagihan Perlu Ditransfer</span>
            </p>
          </div>
        </div>

        {/* Card 3: Biaya Bahan (HPP) & MDR QRIS */}
        <div className="p-5 bg-white border border-gray-200/90 rounded-2xl shadow-2xs space-y-2 hover:shadow-md transition-all">
          <div className="flex items-center justify-between text-xs text-gray-500">
            <span className="font-semibold uppercase tracking-wider text-[11px]">Biaya HPP & MDR</span>
            <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <PieChart className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-black text-amber-700 tracking-tight font-mono">
              Rp {mallAggregates.totalHpp.toLocaleString('id-ID')}
            </div>
            <p className="text-[11px] text-gray-500 mt-1">
              Kertas dye-sub, ribbon & MDR QRIS 0.7%
            </p>
          </div>
        </div>

        {/* Card 4: Net Profit Vendor */}
        <div className="p-5 bg-white border border-gray-200/90 rounded-2xl shadow-2xs space-y-2 hover:shadow-md transition-all">
          <div className="flex items-center justify-between text-xs text-gray-500">
            <span className="font-semibold uppercase tracking-wider text-[11px]">Laba Bersih Vendor</span>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Wallet className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-black text-emerald-700 tracking-tight font-mono">
              Rp {mallAggregates.totalNetProfit.toLocaleString('id-ID')}
            </div>
            <p className="text-[11px] text-emerald-600 mt-1 font-semibold flex items-center gap-1">
              <ArrowUpRight className="w-3.5 h-3.5" />
              <span>Margin Bersih {mallAggregates.netMarginPercentage}%</span>
            </p>
          </div>
        </div>
      </div>

      {/* 3. Navigation Tabs (Untitled UI Underline Tabs) */}
      <div className="flex items-center border-b border-gray-200 gap-6 overflow-x-auto">
        <button
          onClick={() => setActiveTab('revenue-share')}
          className={`pb-3.5 text-xs font-bold transition-all border-b-2 flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'revenue-share'
              ? 'border-[#DE5795] text-[#9D174D]'
              : 'border-transparent text-gray-500 hover:text-gray-800'
          }`}
        >
          <Building2 className="w-4 h-4" />
          <span>Bagi Hasil & Sewa Mall</span>
          <span className="px-2 py-0.5 rounded-full text-[10px] bg-pink-100 text-[#9D174D] font-bold">
            {mallPartnerships.length} Mall
          </span>
        </button>

        <button
          onClick={() => setActiveTab('transactions')}
          className={`pb-3.5 text-xs font-bold transition-all border-b-2 flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'transactions'
              ? 'border-[#DE5795] text-[#9D174D]'
              : 'border-transparent text-gray-500 hover:text-gray-800'
          }`}
        >
          <Receipt className="w-4 h-4" />
          <span>Sesi Kasir & Transaksi</span>
          <span className="px-2 py-0.5 rounded-full text-[10px] bg-emerald-100 text-emerald-700 font-bold">
            {transactions.length} Sesi
          </span>
        </button>

        <button
          onClick={() => setActiveTab('cash-reconciliation')}
          className={`pb-3.5 text-xs font-bold transition-all border-b-2 flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'cash-reconciliation'
              ? 'border-[#DE5795] text-[#9D174D]'
              : 'border-transparent text-gray-500 hover:text-gray-800'
          }`}
        >
          <Banknote className="w-4 h-4" />
          <span>Audit Selisih Kasir & Kas Fisik</span>
          <span className="px-2 py-0.5 rounded-full text-[10px] bg-blue-100 text-blue-700 font-bold">
            {cashReconciliations.length} Shift
          </span>
        </button>
      </div>

        {/* ================================================================= */}
        {/* TAB 1: BAGI HASIL MALL & REVENUE SHARING (THE HERO FEATURE)       */}
        {/* ================================================================= */}
        {activeTab === 'revenue-share' && (
          <div className="space-y-4">
            {/* Alert Rekonsiliasi Tagihan */}
            {mallAggregates.pendingSettlementCount > 0 && (
              <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-50 via-pink-50 to-amber-50 border border-blue-200/90 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                    <Landmark className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-900">
                      Periode Tutup Buku {mallPartnerships[0]?.period}: Terdapat {mallAggregates.pendingSettlementCount} Tagihan Bagi Hasil Mall Siap Ditransfer
                    </p>
                    <p className="text-[11px] text-gray-600 mt-0.5">
                      Total hak bagi hasil pengelola mall bulan ini: <strong className="text-blue-700">Rp {mallAggregates.totalMallDue.toLocaleString('id-ID')}</strong>. Verifikasi rincian sebelum batas jatuh tempo.
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedMallDetail(mallPartnerships[0])}
                  className="px-3.5 py-1.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-all shrink-0 shadow-xs flex items-center gap-1.5"
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>Lihat Slip Tagihan Terdekat</span>
                </button>
              </div>
            )}

            {/* Table of Mall Revenue Sharing */}
            <div className="bg-white border border-gray-200/90 rounded-2xl shadow-2xs overflow-hidden">
              <div className="p-4 border-b border-gray-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider">
                    Rincian Kemitraan & Perhitungan Bagi Hasil Booth Mall
                  </h3>
                  <p className="text-[11px] text-gray-500 mt-0.5">
                    Kalkulasi otomatis: Omzet Kotor dikurangi Hak Mall, Biaya Kertas (HPP), dan MDR QRIS menghasilkan Laba Bersih Vendor.
                  </p>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <span className="text-gray-400">Periode:</span>
                  <span className="font-bold text-gray-800 bg-gray-100 px-2.5 py-1 rounded-lg">
                    Oktober 2026
                  </span>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="bg-gray-50/80 border-b border-gray-200/80 text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                      <th className="py-3 px-3 text-center w-12 font-mono text-gray-400 font-bold uppercase tracking-wider">No.</th>
                      <th className="py-3 px-4">Mall Pengelola & Unit Booth</th>
                      <th className="py-3 px-4">Skema Kontrak</th>
                      <th className="py-3 px-4">Omzet Kotor</th>
                      <th className="py-3 px-4">Hak Mall (Due)</th>
                      <th className="py-3 px-4">Biaya Bahan (HPP)</th>
                      <th className="py-3 px-4">Laba Bersih Vendor</th>
                      <th className="py-3 px-4">Status & Jatuh Tempo</th>
                      <th className="py-3 px-4 text-right">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {mallPartnerships.map((mall, index) => {
                      const isPaid = mall.settlementStatus === 'LUNAS';
                      const isDueSoon = mall.settlementStatus === 'JATUH_TEMPO';

                      return (
                        <tr key={mall.id} className="hover:bg-gray-50/60 transition-colors group">
                          {/* 0. No. */}
                          <td className="py-3.5 px-3 text-center font-mono font-bold text-gray-400">
                            {index + 1}
                          </td>

                          {/* 1. Mall & Booth */}
                          <td className="py-3.5 px-4">
                            <div className="flex items-center gap-3">
                              <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 border border-blue-100 flex items-center justify-center shrink-0 font-bold">
                                <Building2 className="w-4 h-4" />
                              </div>
                              <div className="min-w-0">
                                <div className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors truncate max-w-xs">
                                  {mall.mallName}
                                </div>
                                <div className="text-[11px] text-gray-500 flex items-center gap-1">
                                  <Store className="w-3 h-3 text-gray-400 shrink-0" />
                                  <span className="truncate max-w-[180px]">{mall.boothName}</span>
                                </div>
                              </div>
                            </div>
                          </td>

                          {/* 2. Skema Kontrak */}
                          <td className="py-3.5 px-4">
                            <span className="inline-block px-2.5 py-0.5 text-[11px] font-semibold bg-gray-100 text-gray-800 rounded-md">
                              {mall.contractTypeLabel}
                            </span>
                            <div className="text-[10px] text-gray-400 mt-0.5">
                              Berakhir: {mall.contractEndDate}
                            </div>
                          </td>

                          {/* 3. Omzet Kotor */}
                          <td className="py-3.5 px-4">
                            <div className="font-mono font-bold text-gray-900 text-sm">
                              Rp {mall.grossRevenueMonth.toLocaleString('id-ID')}
                            </div>
                            <div className="text-[10px] text-gray-400">
                              {mall.totalSessions} sesi selesai
                            </div>
                          </td>

                          {/* 4. Hak Mall */}
                          <td className="py-3.5 px-4">
                            <div className="font-mono font-bold text-blue-700 text-sm">
                              Rp {mall.mallShareDue.toLocaleString('id-ID')}
                            </div>
                            <div className="text-[10px] text-gray-400">
                              {mall.contractType === 'PERCENTAGE_REVENUE_SHARE'
                                ? `${mall.revenueSharePercent}% Omzet`
                                : 'Flat Bulanan'}
                            </div>
                          </td>

                          {/* 5. Biaya Bahan & MDR */}
                          <td className="py-3.5 px-4">
                            <div className="font-mono font-semibold text-gray-700">
                              Rp {(mall.materialHppCost + mall.qrisMdrFee).toLocaleString('id-ID')}
                            </div>
                            <div className="text-[10px] text-gray-400">
                              HPP: {mall.materialHppCost.toLocaleString('id-ID')}
                            </div>
                          </td>

                          {/* 6. Laba Bersih Vendor */}
                          <td className="py-3.5 px-4">
                            <div className="font-mono font-bold text-emerald-700 text-sm">
                              Rp {mall.netProfitVendor.toLocaleString('id-ID')}
                            </div>
                            <div className="text-[10px] text-emerald-600 font-semibold">
                              {Math.round((mall.netProfitVendor / mall.grossRevenueMonth) * 100)}% Margin
                            </div>
                          </td>

                          {/* 7. Status */}
                          <td className="py-3.5 px-4">
                            {isPaid ? (
                              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                                <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                                Lunas Ditransfer
                              </span>
                            ) : isDueSoon ? (
                              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
                                <Clock className="w-3 h-3 text-rose-500" />
                                Jatuh Tempo
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
                                <Clock className="w-3 h-3 text-blue-500" />
                                Siap Transfer
                              </span>
                            )}
                            <div className="text-[10px] text-gray-400 mt-1 font-mono">
                              Due: {mall.settlementDueDate}
                            </div>
                          </td>

                          {/* 8. Aksi */}
                          <td className="py-3.5 px-4 text-right">
                            <button
                              onClick={() => setSelectedMallDetail(mall)}
                              className="px-3 py-1.5 text-xs font-semibold text-gray-700 bg-gray-50 hover:bg-gray-100 hover:text-blue-600 border border-gray-200 rounded-xl transition-all shadow-2xs inline-flex items-center gap-1.5"
                            >
                              <FileText className="w-3.5 h-3.5" />
                              <span>Lihat Slip</span>
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ================================================================= */}
        {/* TAB 2: SESI KASIR & TRANSAKSI (POS LOG)                           */}
        {/* ================================================================= */}
        {activeTab === 'transactions' && (
          <div className="space-y-4">
            {/* Filter Bar */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 bg-white p-4 border border-gray-200/90 rounded-2xl shadow-2xs">
              <div className="relative flex-1 min-w-[240px]">
                <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  placeholder="Cari invoice, kode sesi, pelanggan, atau paket foto..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-8 pr-11 py-2 text-xs bg-gray-50/70 border border-gray-200/90 rounded-xl text-gray-900 placeholder:text-gray-400 focus:outline-hidden focus:bg-white focus:border-[#DE5795] focus:ring-3 focus:ring-[#DE5795]/10 transition-all"
                />
                <kbd className="absolute right-2.5 top-1/2 -translate-y-1/2 px-1.5 py-0.5 text-[9px] font-mono text-gray-400 bg-white border border-gray-200 rounded shadow-2xs">
                  ⌘K
                </kbd>
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                <select
                  value={selectedBooth}
                  onChange={(e) => setSelectedBooth(e.target.value)}
                  className="px-3 py-2 text-xs bg-gray-50/70 border border-gray-200/90 rounded-xl text-gray-700 focus:outline-hidden focus:border-[#DE5795]"
                >
                  <option value="ALL">Semua Booth</option>
                  {BOOTHS_LIST.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.name}
                    </option>
                  ))}
                </select>

                <select
                  value={selectedMethod}
                  onChange={(e) => setSelectedMethod(e.target.value)}
                  className="px-3 py-2 text-xs bg-gray-50/70 border border-gray-200/90 rounded-xl text-gray-700 focus:outline-hidden focus:border-[#DE5795]"
                >
                  <option value="ALL">Semua Metode</option>
                  <option value="QRIS">QRIS Dinamis</option>
                  <option value="EDC_CARD">Mesin EDC / Debit</option>
                  <option value="CASH">Tunai Kasir</option>
                </select>

                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="px-3 py-2 text-xs bg-gray-50/70 border border-gray-200/90 rounded-xl text-gray-700 focus:outline-hidden focus:border-[#DE5795]"
                >
                  <option value="ALL">Semua Status</option>
                  <option value="SUCCESS">Sukses (Lunas)</option>
                  <option value="PENDING">Menunggu Bayar</option>
                  <option value="REFUNDED">Refund</option>
                </select>
              </div>
            </div>

            {/* Transactions Table */}
            <div className="bg-white border border-gray-200/90 rounded-2xl shadow-2xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="bg-gray-50/80 border-b border-gray-200/80 text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                      <th className="py-3 px-3 text-center w-12 font-mono text-gray-400 font-bold uppercase tracking-wider">No.</th>
                      <th className="py-3 px-4">No. Invoice & Kode Sesi</th>
                      <th className="py-3 px-4">Unit Booth & Lokasi</th>
                      <th className="py-3 px-4">Paket Foto & Cetakan</th>
                      <th className="py-3 px-4">Metode Bayar</th>
                      <th className="py-3 px-4">Nominal</th>
                      <th className="py-3 px-4">Status Transaksi</th>
                      <th className="py-3 px-4 text-right">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {filteredTransactions.map((tx, index) => (
                      <tr key={tx.id} className="hover:bg-gray-50/60 transition-colors">
                        <td className="py-3.5 px-3 text-center font-mono font-bold text-gray-400">
                          {index + 1}
                        </td>
                        <td className="py-3.5 px-4">
                          <div className="font-bold text-gray-900 font-mono">{tx.invoiceNumber}</div>
                          <div className="text-[10px] text-gray-400 font-mono">Sesi: {tx.sessionCode}</div>
                        </td>
                        <td className="py-3.5 px-4">
                          <div className="font-semibold text-gray-800 truncate max-w-[180px]">{tx.boothName}</div>
                          <div className="text-[10px] text-gray-400">{tx.customerName}</div>
                        </td>
                        <td className="py-3.5 px-4">
                          <div className="font-semibold text-gray-800">{tx.packageName}</div>
                          <div className="text-[10px] text-gray-400">{tx.printCopies} Lembar Cetak Fisik</div>
                        </td>
                        <td className="py-3.5 px-4">
                          <span className="inline-block px-2 py-0.5 rounded text-[10px] font-semibold bg-gray-100 text-gray-700">
                            {tx.paymentProvider}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 font-mono font-bold text-gray-900">
                          Rp {tx.amount.toLocaleString('id-ID')}
                        </td>
                        <td className="py-3.5 px-4">
                          {tx.status === 'SUCCESS' ? (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                              <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                              Lunas
                            </span>
                          ) : tx.status === 'PENDING' ? (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                              <Clock className="w-3 h-3 text-amber-500" />
                              Pending
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
                              <RotateCcw className="w-3 h-3 text-rose-500" />
                              Refund
                            </span>
                          )}
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <button
                            onClick={() => setActiveReceipt(tx)}
                            className="p-1.5 text-gray-500 hover:text-[#DE5795] hover:bg-pink-50 rounded-lg transition-colors"
                            title="Lihat Bukti e-Struk"
                          >
                            <Receipt className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ================================================================= */}
        {/* TAB 3: AUDIT SELISIH KASIR & KAS FISIK                            */}
        {/* ================================================================= */}
        {activeTab === 'cash-reconciliation' && (
          <div className="space-y-4">
            <div className="bg-white border border-gray-200/90 rounded-2xl shadow-2xs overflow-hidden">
              <div className="p-4 border-b border-gray-200/80 flex items-center justify-between">
                <div>
                  <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider">
                    Log Rekonsiliasi Kasir & Uang Fisik Bill Acceptor
                  </h3>
                  <p className="text-[11px] text-gray-500 mt-0.5">
                    Pencocokan antara penerimaan tunai sistem kiosk dengan uang fisik yang dihitung saat kasir tutup shift.
                  </p>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="bg-gray-50/80 border-b border-gray-200/80 text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                      <th className="py-3 px-3 text-center w-12 font-mono text-gray-400 font-bold uppercase tracking-wider">No.</th>
                      <th className="py-3 px-4">Waktu Audit & ID</th>
                      <th className="py-3 px-4">Unit Booth</th>
                      <th className="py-3 px-4">Uang Sistem Kiosk</th>
                      <th className="py-3 px-4">Uang Fisik Dihitung</th>
                      <th className="py-3 px-4">Selisih Kas</th>
                      <th className="py-3 px-4">Status & Auditor</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {cashReconciliations.map((rec, index) => (
                      <tr key={rec.id} className="hover:bg-gray-50/60 transition-colors">
                        <td className="py-3.5 px-3 text-center font-mono font-bold text-gray-400">
                          {index + 1}
                        </td>
                        <td className="py-3.5 px-4">
                          <div className="font-semibold text-gray-900">{rec.reconciliationDate}</div>
                          <div className="text-[10px] font-mono text-gray-400">{rec.id}</div>
                        </td>
                        <td className="py-3.5 px-4 font-bold text-gray-800">{rec.boothName}</td>
                        <td className="py-3.5 px-4 font-mono font-semibold text-gray-700">
                          Rp {rec.systemExpectedCash.toLocaleString('id-ID')}
                        </td>
                        <td className="py-3.5 px-4 font-mono font-bold text-gray-900">
                          Rp {rec.actualCountedCash.toLocaleString('id-ID')}
                        </td>
                        <td className="py-3.5 px-4 font-mono font-bold text-emerald-600">
                          {rec.difference === 0 ? 'Rp 0 (Sesuai 100%)' : `Rp ${rec.difference.toLocaleString('id-ID')}`}
                        </td>
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-1.5">
                            <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                              {rec.status === 'SUDAH_SETOR_BANK' ? 'Sudah Setor Bank' : 'Audit Sesuai'}
                            </span>
                            <span className="text-[11px] text-gray-500">oleh {rec.auditorName}</span>
                          </div>
                          {rec.notes && <div className="text-[10px] text-gray-400 italic mt-0.5">{rec.notes}</div>}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

      {/* ========================================================================= */}
      {/* DRAWER 1: SLIP REKONSILIASI & TAGIHAN MALL (Floating Slide-Over)          */}
      {/* ========================================================================= */}
      {selectedMallDetail && (
        <div className="fixed inset-0 z-50 overflow-hidden font-sora">
          <div
            onClick={() => setSelectedMallDetail(null)}
            className="absolute inset-0 bg-black/40 backdrop-blur-xs transition-opacity animate-fade-in"
          />

          <div className="fixed inset-y-0 right-0 max-w-full flex pl-6 sm:pl-10 p-3 sm:p-4 pointer-events-none">
            <div className="w-screen max-w-xl bg-white shadow-2xl border border-gray-200/90 rounded-3xl flex flex-col animate-slide-left overflow-hidden ring-1 ring-black/10 pointer-events-auto">
              {/* Header with generous pb-7.5 and pt-7 */}
              <div className="px-8 pt-7 pb-7.5 border-b border-gray-200/80 flex items-start justify-between bg-white">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white flex items-center justify-center shadow-xs">
                    <Building2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-gray-900">Slip Tagihan Bagi Hasil Mall</h2>
                    <p className="text-xs text-gray-500 mt-0.5">{selectedMallDetail.mallName}</p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedMallDetail(null)}
                  className="p-2 text-gray-400 hover:text-gray-600 rounded-xl hover:bg-gray-100 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Body */}
              <div className="px-8 py-6 overflow-y-auto flex-1 space-y-5 text-xs">
                {/* Status Box */}
                <div className="p-4 rounded-2xl bg-blue-50/60 border border-blue-200/80 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-blue-600 tracking-wider">Status Tagihan Periode Ini</span>
                    <h4 className="text-sm font-bold text-gray-900 mt-0.5">{selectedMallDetail.settlementStatus}</h4>
                    <p className="text-[11px] text-gray-500">Jatuh Tempo: {selectedMallDetail.settlementDueDate}</p>
                  </div>
                  {selectedMallDetail.settlementStatus !== 'LUNAS' ? (
                    <button
                      onClick={() => handleMarkSettlementPaid(selectedMallDetail.id)}
                      className="px-3.5 py-1.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-xs transition-all flex items-center gap-1.5"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Tandai Lunas Ditransfer</span>
                    </button>
                  ) : (
                    <span className="px-3 py-1 text-xs font-bold bg-emerald-100 text-emerald-800 rounded-xl border border-emerald-300">
                      LUNAS
                    </span>
                  )}
                </div>

                {/* Calculation Breakdown Table */}
                <div className="space-y-2">
                  <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider">
                    Rincian Kalkulasi Rekonsiliasi Finansial
                  </h4>
                  <div className="p-4 rounded-xl border border-gray-200 bg-white space-y-2.5 text-xs">
                    <div className="flex justify-between py-1 border-b border-gray-100">
                      <span className="text-gray-600">Omzet Kotor Kios ({selectedMallDetail.totalSessions} sesi)</span>
                      <span className="font-mono font-bold text-gray-900">
                        Rp {selectedMallDetail.grossRevenueMonth.toLocaleString('id-ID')}
                      </span>
                    </div>

                    <div className="flex justify-between py-1 border-b border-gray-100 text-blue-700">
                      <span>Hak Bagi Hasil Pengelola Mall ({selectedMallDetail.contractTypeLabel})</span>
                      <span className="font-mono font-bold">
                        - Rp {selectedMallDetail.mallShareDue.toLocaleString('id-ID')}
                      </span>
                    </div>

                    <div className="flex justify-between py-1 border-b border-gray-100 text-gray-600">
                      <span>Biaya Bahan Habis Pakai Kertas Dye-Sub (HPP)</span>
                      <span className="font-mono">
                        - Rp {selectedMallDetail.materialHppCost.toLocaleString('id-ID')}
                      </span>
                    </div>

                    <div className="flex justify-between py-1 border-b border-gray-100 text-gray-600">
                      <span>Biaya MDR Transaksi QRIS (0.7%)</span>
                      <span className="font-mono">
                        - Rp {selectedMallDetail.qrisMdrFee.toLocaleString('id-ID')}
                      </span>
                    </div>

                    <div className="flex justify-between pt-2 text-sm font-bold text-emerald-700">
                      <span>Laba Bersih Vendor (Net Profit)</span>
                      <span className="font-mono text-base">
                        Rp {selectedMallDetail.netProfitVendor.toLocaleString('id-ID')}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Bank Transfer Details for Mall */}
                <div className="space-y-2">
                  <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider flex items-center gap-1.5">
                    <Landmark className="w-4 h-4 text-gray-500" />
                    <span>Rekening Bank Pengelola Mall (Tujuan Transfer)</span>
                  </h4>
                  <div className="p-4 rounded-xl border border-gray-200 bg-gray-50/70 space-y-2 text-xs">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Bank Tujuan:</span>
                      <span className="font-bold text-gray-800">{selectedMallDetail.bankDetails.bankName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Nomor Rekening:</span>
                      <span className="font-mono font-bold text-blue-700 text-sm">{selectedMallDetail.bankDetails.accountNumber}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Atas Nama (A/N):</span>
                      <span className="font-semibold text-gray-800">{selectedMallDetail.bankDetails.accountHolder}</span>
                    </div>
                    <div className="flex justify-between pt-1 border-t border-gray-200/80">
                      <span className="text-gray-500">Kontak PIC Leasing Mall:</span>
                      <span className="font-semibold text-gray-800">{selectedMallDetail.picMall} ({selectedMallDetail.picPhone})</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer with generous padding */}
              <div className="px-8 pt-5.5 pb-7 border-t border-gray-200/80 bg-white/95 backdrop-blur-md flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setSelectedMallDetail(null)}
                  className="px-4 py-2.5 text-xs font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors"
                >
                  Tutup
                </button>
                <button
                  type="button"
                  onClick={() => {
                    window.print();
                    showToast('Dokumen tagihan dikirim ke printer/PDF');
                  }}
                  className="px-5 py-2.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-all shadow-xs flex items-center gap-1.5"
                >
                  <Printer className="w-4 h-4" />
                  <span>Cetak Slip Rekonsiliasi PDF</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* DRAWER 2: ATUR SKEMA BAGI HASIL MALL BARU (Floating Slide-Over)           */}
      {/* ========================================================================= */}
      {isConfigMallOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden font-sora">
          <div
            onClick={() => setIsConfigMallOpen(false)}
            className="absolute inset-0 bg-black/40 backdrop-blur-xs transition-opacity animate-fade-in"
          />

          <div className="fixed inset-y-0 right-0 max-w-full flex pl-6 sm:pl-10 p-3 sm:p-4 pointer-events-none">
            <div className="w-screen max-w-xl bg-white shadow-2xl border border-gray-200/90 rounded-3xl flex flex-col animate-slide-left overflow-hidden ring-1 ring-black/10 pointer-events-auto">
              <div className="px-8 pt-7 pb-7.5 border-b border-gray-200/80 flex items-start justify-between bg-white">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-blue-600 text-white flex items-center justify-center shadow-xs">
                    <Building2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-gray-900">Atur Skema Bagi Hasil Mall</h2>
                    <p className="text-xs text-gray-500 mt-0.5">Konfigurasi kontrak sewa kiosk atau bagi hasil persentase.</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsConfigMallOpen(false)}
                  className="p-2 text-gray-400 hover:text-gray-600 rounded-xl hover:bg-gray-100 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form id="mall-scheme-form" onSubmit={handleSaveMallScheme} className="px-8 py-6 overflow-y-auto flex-1 space-y-4 text-xs">
                {/* Mall Name & Branch */}
                <div className="space-y-1.5">
                  <label className="font-bold text-gray-800">Nama Gedung Mall / Pusat Perbelanjaan *</label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Senayan City Shopping Mall"
                    value={newMallName}
                    onChange={(e) => setNewMallName(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:bg-white focus:border-blue-600 focus:outline-hidden"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-bold text-gray-800">Lokasi Penempatan Booth Kiosk</label>
                  <input
                    type="text"
                    placeholder="Contoh: Lantai 3 Depan Cinema XXI #K-12"
                    value={newMallBranch}
                    onChange={(e) => setNewMallBranch(e.target.value)}
                    className="w-full px-3.5 py-2 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:bg-white focus:border-blue-600 focus:outline-hidden"
                  />
                </div>

                {/* Booth Selector */}
                <div className="space-y-1.5">
                  <label className="font-bold text-gray-800">Unit Booth yang Dialokasikan *</label>
                  <select
                    value={newMallBoothId}
                    onChange={(e) => setNewMallBoothId(e.target.value)}
                    className="w-full px-3.5 py-2 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 font-medium focus:bg-white focus:border-blue-600 focus:outline-hidden"
                  >
                    {BOOTHS_LIST.map((b) => (
                      <option key={b.id} value={b.id}>
                        {b.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Contract Scheme Selection */}
                <div className="space-y-1.5">
                  <label className="font-bold text-gray-800">Model Skema Kontrak Kemitraan *</label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setNewContractType('PERCENTAGE_REVENUE_SHARE')}
                      className={`p-3 rounded-xl border text-left transition-all ${
                        newContractType === 'PERCENTAGE_REVENUE_SHARE'
                          ? 'border-blue-600 bg-blue-50 text-blue-900 font-bold shadow-2xs'
                          : 'border-gray-200 bg-white text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      <Percent className="w-4 h-4 mb-1 text-blue-600" />
                      <div>Bagi Hasil Omzet (%)</div>
                      <span className="text-[10px] text-gray-500 font-normal">Persentase dari gross revenue</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setNewContractType('FLAT_RENT')}
                      className={`p-3 rounded-xl border text-left transition-all ${
                        newContractType === 'FLAT_RENT'
                          ? 'border-blue-600 bg-blue-50 text-blue-900 font-bold shadow-2xs'
                          : 'border-gray-200 bg-white text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      <Landmark className="w-4 h-4 mb-1 text-blue-600" />
                      <div>Sewa Tetap (Flat Rent)</div>
                      <span className="text-[10px] text-gray-500 font-normal">Nominal tetap bulanan</span>
                    </button>
                  </div>
                </div>

                {/* Rate Details */}
                {newContractType === 'PERCENTAGE_REVENUE_SHARE' ? (
                  <div className="space-y-1.5">
                    <label className="font-bold text-gray-800">Persentase Bagi Hasil Mall (%) *</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        min={5}
                        max={50}
                        value={newSharePercent}
                        onChange={(e) => setNewSharePercent(parseInt(e.target.value) || 20)}
                        className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 font-bold focus:bg-white focus:border-blue-600 focus:outline-hidden"
                      />
                      <div className="flex gap-1.5">
                        {[15, 18, 20, 25].map((pct) => (
                          <button
                            key={pct}
                            type="button"
                            onClick={() => setNewSharePercent(pct)}
                            className="px-2.5 py-2 text-[11px] font-semibold bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg"
                          >
                            {pct}%
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-1.5">
                    <label className="font-bold text-gray-800">Biaya Sewa Tetap Per Bulan (Rp) *</label>
                    <input
                      type="number"
                      step={500000}
                      value={newFlatRent}
                      onChange={(e) => setNewFlatRent(parseInt(e.target.value) || 0)}
                      className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 font-bold focus:bg-white focus:border-blue-600 focus:outline-hidden"
                    />
                  </div>
                )}

                {/* Bank Account Details */}
                <div className="p-3.5 rounded-xl border border-gray-200 bg-gray-50/70 space-y-3">
                  <span className="text-[11px] font-bold text-gray-700 uppercase tracking-wider block">
                    Informasi Rekening & PIC Mall
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    <div className="space-y-1">
                      <label className="text-gray-600">Bank Pengelola</label>
                      <input
                        type="text"
                        placeholder="BCA / Mandiri / CIMB"
                        value={newBankName}
                        onChange={(e) => setNewBankName(e.target.value)}
                        className="w-full px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-gray-900 focus:outline-hidden"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-gray-600">Nomor Rekening</label>
                      <input
                        type="text"
                        placeholder="Contoh: 008-992-1829"
                        value={newAccountNo}
                        onChange={(e) => setNewAccountNo(e.target.value)}
                        className="w-full px-3 py-1.5 bg-white border border-gray-200 rounded-lg font-mono text-gray-900 focus:outline-hidden"
                      />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="text-gray-600">Nama Pemilik Rekening (A/N)</label>
                    <input
                      type="text"
                      placeholder="Contoh: PT Metropolitan Retail Mall"
                      value={newAccountHolder}
                      onChange={(e) => setNewAccountHolder(e.target.value)}
                      className="w-full px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-gray-900 focus:outline-hidden"
                    />
                  </div>
                </div>
              </form>

              <div className="px-8 pt-5.5 pb-7 border-t border-gray-200/80 bg-white/95 backdrop-blur-md flex items-center justify-between">
                <span className="text-[11px] text-gray-400">Tekan ESC untuk membatalkan</span>
                <div className="flex items-center gap-2.5">
                  <button
                    type="button"
                    onClick={() => setIsConfigMallOpen(false)}
                    className="px-4 py-2.5 text-xs font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    form="mall-scheme-form"
                    className="px-5 py-2.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-all shadow-xs"
                  >
                    Simpan Skema Kemitraan
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* DRAWER 3: CATAT PEMBAYARAN KASIR MANUAL (Floating Slide-Over)             */}
      {/* ========================================================================= */}
      {isManualModalOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden font-sora">
          <div
            onClick={() => setIsManualModalOpen(false)}
            className="absolute inset-0 bg-black/40 backdrop-blur-xs transition-opacity animate-fade-in"
          />

          <div className="fixed inset-y-0 right-0 max-w-full flex pl-6 sm:pl-10 p-3 sm:p-4 pointer-events-none">
            <div className="w-screen max-w-xl bg-white shadow-2xl border border-gray-200/90 rounded-3xl flex flex-col animate-slide-left overflow-hidden ring-1 ring-black/10 pointer-events-auto">
              <div className="px-8 pt-7 pb-7.5 border-b border-gray-200/80 flex items-start justify-between bg-white">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-pink-500/15 to-[#DE5795]/20 border border-[#DE5795]/30 flex items-center justify-center text-[#9D174D] shadow-xs shrink-0">
                    <Banknote className="w-5 h-5 text-[#DE5795]" />
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-gray-900 leading-tight">Catat Pembayaran Kasir Manual</h2>
                    <p className="text-xs text-gray-500 mt-1">
                      Entri transaksi tunai kasir, debit kartu EDC, atau transfer darurat.
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setIsManualModalOpen(false)}
                  className="p-2 text-gray-400 hover:text-gray-600 rounded-xl hover:bg-gray-100 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSaveManualPayment} className="flex-1 flex flex-col min-h-0">
                <div className="px-8 py-6 overflow-y-auto flex-1 space-y-5 text-xs">
                  {/* Metode Pembayaran Segmented Buttons */}
                  <div className="space-y-2">
                    <label className="text-[11px] font-semibold text-gray-600 block">Pilih Jalur Pembayaran:</label>
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { id: 'CASH', label: 'Tunai Kasir', icon: Banknote, provider: 'Kasir Tunai Booth' },
                        { id: 'EDC_CARD', label: 'Kartu Debit/EDC', icon: CreditCard, provider: 'BCA EDC Mesin' },
                        { id: 'QRIS', label: 'QRIS Statis', icon: QrCode, provider: 'QRIS Statis Kasir' },
                      ].map((m) => {
                        const Icon = m.icon;
                        const isSelected = manualMethod === m.id;
                        return (
                          <button
                            key={m.id}
                            type="button"
                            onClick={() => {
                              setManualMethod(m.id as any);
                              setManualProvider(m.provider);
                            }}
                            className={`p-3 rounded-xl border-2 text-center flex flex-col items-center justify-center gap-1 transition-all ${
                              isSelected
                                ? 'border-[#DE5795] bg-[#DE5795]/10 text-[#9D174D] font-bold shadow-xs ring-1 ring-[#DE5795]/20'
                                : 'border-gray-200 bg-white hover:bg-gray-50 text-gray-700'
                            }`}
                          >
                            <Icon className={`w-4 h-4 ${isSelected ? 'text-[#DE5795]' : 'text-gray-400'}`} />
                            <span className="text-[11px] font-semibold">{m.label}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Pilihan Paket Foto */}
                  <div className="space-y-2">
                    <label className="text-[11px] font-semibold text-gray-600 block">Pilih Paket Foto:</label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {MANUAL_PACKAGES.map((pkg, idx) => {
                        const isSelected = manualPackageIndex === idx;
                        return (
                          <div
                            key={pkg.name}
                            onClick={() => setManualPackageIndex(idx)}
                            className={`p-3 rounded-xl border-2 cursor-pointer transition-all flex items-start justify-between ${
                              isSelected
                                ? 'border-[#DE5795] bg-[#DE5795]/10 shadow-2xs'
                                : 'border-gray-200 bg-white hover:border-gray-300'
                            }`}
                          >
                            <div>
                              <p className="font-bold text-gray-900 text-xs">{pkg.name}</p>
                              <p className="text-[10px] text-gray-500 mt-0.5">{pkg.desc}</p>
                              <span className="font-mono font-bold text-xs text-[#9D174D] mt-1 block">
                                Rp {pkg.price.toLocaleString('id-ID')}
                              </span>
                            </div>
                            {isSelected && <Check className="w-4 h-4 text-[#DE5795] shrink-0 mt-0.5" />}
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Unit Booth Alokasi */}
                  <div className="space-y-1">
                    <label className="font-semibold text-gray-700 block">Lokasi Unit Booth *</label>
                    <select
                      value={manualBoothId}
                      onChange={(e) => setManualBoothId(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-gray-200 bg-white font-medium focus:outline-hidden focus:border-[#DE5795]"
                    >
                      {BOOTHS_LIST.map((b) => (
                        <option key={b.id} value={b.id}>
                          {b.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Data Pelanggan */}
                  <div className="p-4 rounded-2xl bg-gray-50/70 border border-gray-200/80 space-y-3">
                    <span className="text-[11px] font-bold text-gray-700 uppercase tracking-wider block">
                      Informasi Pelanggan (Opsional)
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="text-gray-600 font-semibold">Nama Tamu / Pelanggan</label>
                        <input
                          type="text"
                          placeholder="Misal: Dimas & Nisa"
                          value={manualCustomer}
                          onChange={(e) => setManualCustomer(e.target.value)}
                          className="w-full px-3 py-1.5 text-xs rounded-lg border border-gray-200 bg-white focus:outline-hidden focus:border-[#DE5795]"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-gray-600 font-semibold">No. WhatsApp</label>
                        <input
                          type="text"
                          placeholder="+62 812-xxxx-xxxx"
                          value={manualPhone}
                          onChange={(e) => setManualPhone(e.target.value)}
                          className="w-full px-3 py-1.5 text-xs rounded-lg border border-gray-200 bg-white focus:outline-hidden focus:border-[#DE5795]"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Salinan Cetak */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="font-semibold text-gray-700 block">Jumlah Lembar Cetak</label>
                      <select
                        value={manualCopies}
                        onChange={(e) => setManualCopies(parseInt(e.target.value))}
                        className="w-full px-3 py-2 text-xs rounded-xl border border-gray-200 bg-white"
                      >
                        <option value={1}>1 Lembar</option>
                        <option value={2}>2 Lembar (Standar Strip)</option>
                        <option value={4}>4 Lembar (Grup)</option>
                      </select>
                    </div>
                    <div className="space-y-1">
                      <label className="font-semibold text-gray-700 block">Total Tagihan Kasir</label>
                      <div className="px-3.5 py-2 rounded-xl bg-gray-100 border border-gray-200 font-mono font-bold text-sm text-[#9D174D]">
                        Rp {(MANUAL_PACKAGES[manualPackageIndex]?.price || 50000).toLocaleString('id-ID')}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="px-8 pt-5.5 pb-7 border-t border-gray-200/80 bg-white/95 backdrop-blur-md flex items-center justify-between gap-3 shrink-0 sticky bottom-0 z-20 shadow-xs">
                  <span className="text-[11px] text-gray-400 hidden sm:inline">
                    Tekan <kbd className="px-1.5 py-0.5 rounded bg-gray-100 border border-gray-200 font-mono text-[10px] text-gray-500">ESC</kbd> untuk membatalkan
                  </span>
                  <div className="flex items-center gap-2.5">
                    <button
                      type="button"
                      onClick={() => setIsManualModalOpen(false)}
                      className="px-4 py-2.5 rounded-xl border border-gray-200/90 bg-white text-xs font-semibold text-gray-700 hover:bg-gray-50 transition-colors shadow-2xs"
                    >
                      Batal
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-pink-600 to-[#DE5795] text-white text-xs font-bold hover:opacity-95 transition-all shadow-xs flex items-center gap-2 active:scale-98"
                    >
                      <Check className="w-4 h-4 text-white" />
                      <span>Validasi & Simpan Transaksi</span>
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* DRAWER 4: BUKTI TRANSAKSI RESMI E-STRUK (Floating Slide-Over)             */}
      {/* ========================================================================= */}
      {activeReceipt && (
        <div className="fixed inset-0 z-50 overflow-hidden font-sora">
          <div
            className="fixed inset-0 bg-gray-950/45 backdrop-blur-xs transition-opacity animate-fade-in"
            onClick={() => setActiveReceipt(null)}
          />

          <div className="fixed inset-y-0 right-0 max-w-full flex pl-6 sm:pl-10 p-3 sm:p-4 pointer-events-none">
            <div className="w-screen max-w-md bg-white shadow-2xl border border-gray-200/90 rounded-3xl flex flex-col animate-slide-left overflow-hidden ring-1 ring-black/10 pointer-events-auto">
              <div className="px-8 pt-7 pb-7.5 border-b border-gray-200/80 flex items-center justify-between bg-white shrink-0">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-pink-500/15 to-[#DE5795]/20 border border-[#DE5795]/30 flex items-center justify-center text-[#9D174D] shadow-xs shrink-0">
                    <Receipt className="w-5 h-5 text-[#DE5795]" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-gray-900 leading-tight">Bukti Pembayaran</h3>
                    <p className="text-xs text-gray-500 font-mono mt-0.5">{activeReceipt.invoiceNumber}</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveReceipt(null)}
                  className="p-2 text-gray-400 hover:text-gray-600 rounded-xl hover:bg-gray-100 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="px-8 py-6 overflow-y-auto flex-1 space-y-4 text-xs">
                <div className="p-5 rounded-2xl bg-gray-50 border border-gray-200 space-y-4">
                  <div className="flex items-start justify-between border-b border-dashed border-gray-200 pb-3">
                    <div>
                      <span className="text-[10px] font-mono uppercase tracking-widest text-gray-400">Bukti Transaksi Resmi</span>
                      <h4 className="text-sm font-bold text-gray-900">PhotoBooth OS</h4>
                      <p className="text-xs text-gray-500">{activeReceipt.boothName}</p>
                    </div>
                    <div className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-semibold flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>LUNAS</span>
                    </div>
                  </div>

                  <div className="space-y-1.5 text-xs text-gray-600 font-mono">
                    <div className="flex justify-between">
                      <span className="text-gray-400">No. Invoice:</span>
                      <strong className="text-gray-900">{activeReceipt.invoiceNumber}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Kode Sesi:</span>
                      <strong className="text-gray-900">{activeReceipt.sessionCode}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Pelanggan:</span>
                      <span className="text-gray-800 font-sans">{activeReceipt.customerName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Waktu Bayar:</span>
                      <span>{new Date(activeReceipt.paidAt).toLocaleString('id-ID')}</span>
                    </div>
                  </div>

                  <div className="space-y-2 py-3 border-y border-dashed border-gray-200 text-xs">
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

                  <div className="space-y-1.5 pt-1">
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>Metode Pembayaran:</span>
                      <span className="font-semibold text-gray-800">{activeReceipt.paymentProvider}</span>
                    </div>
                    <div className="flex justify-between text-sm font-bold text-gray-900 pt-1">
                      <span>Total Bayar:</span>
                      <span className="font-mono text-base text-[#9D174D]">
                        Rp {activeReceipt.amount.toLocaleString('id-ID')}
                      </span>
                    </div>
                  </div>

                  <div className="text-center pt-3 border-t border-dashed border-gray-200">
                    <img
                      src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=https://photobooth.local/receipt/${activeReceipt.invoiceNumber}`}
                      alt="Receipt QR"
                      className="w-24 h-24 mx-auto rounded-lg border border-gray-200 p-1 bg-white"
                    />
                    <p className="text-[10px] text-gray-400 mt-1 font-mono">Pindai untuk unduh e-Struk digital</p>
                  </div>
                </div>
              </div>

              <div className="px-8 pt-5.5 pb-7 border-t border-gray-100 bg-gray-50/80 backdrop-blur-sm flex items-center justify-end gap-3 shrink-0">
                <button
                  type="button"
                  onClick={() => setActiveReceipt(null)}
                  className="px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-xs font-semibold text-gray-700 hover:bg-gray-100 transition-colors"
                >
                  Tutup
                </button>
                <button
                  type="button"
                  onClick={() => {
                    window.print();
                    showToast('Perintah cetak struk dikirim');
                  }}
                  className="px-5 py-2.5 rounded-xl bg-[#DE5795] text-white font-bold text-xs hover:bg-[#c93d7e] transition-colors shadow-xs flex items-center gap-1.5"
                >
                  <Printer className="w-4 h-4 text-white" />
                  <span>Cetak Struk Fisik</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
