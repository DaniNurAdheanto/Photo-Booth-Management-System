export type ContractScheme = 'PERCENTAGE_REVENUE_SHARE' | 'FLAT_RENT' | 'HYBRID_GUARANTEE';

export type SettlementStatus = 'SIAP_TRANSFER' | 'LUNAS' | 'JATUH_TEMPO' | 'VERIFIKASI_MALL';

export interface MallPartnership {
  id: string;
  mallName: string;
  mallBranch: string;
  boothId: string;
  boothName: string;
  contractType: ContractScheme;
  contractTypeLabel: string;
  revenueSharePercent: number; // e.g. 20%
  flatRentAmount?: number; // e.g. Rp 7.500.000
  minimumGuarantee?: number; // e.g. Rp 10.000.000
  grossRevenueMonth: number;
  totalSessions: number;
  materialHppCost: number; // Kertas & Ribbon (HPP)
  qrisMdrFee: number; // Biaya MDR QRIS (0.7%)
  mallShareDue: number; // Hak Bagi Hasil Pengelola Mall
  netProfitVendor: number; // Pendapatan Bersih Pemilik Photo Booth
  settlementStatus: SettlementStatus;
  period: string; // e.g., 'Oktober 2026'
  settlementDueDate: string;
  bankDetails: {
    bankName: string;
    accountNumber: string;
    accountHolder: string;
  };
  picMall: string;
  picPhone: string;
  contractEndDate: string;
}

export interface CashDrawerReconciliation {
  id: string;
  boothId: string;
  boothName: string;
  reconciliationDate: string;
  systemExpectedCash: number;
  actualCountedCash: number;
  difference: number;
  status: 'SESUAI' | 'SELISIH' | 'SUDAH_SETOR_BANK';
  auditorName: string;
  notes?: string;
}

export interface Transaction {
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
  paymentProvider: string;
  status: 'SUCCESS' | 'PENDING' | 'REFUNDED' | 'FAILED';
  paidAt: string;
  printCopies: number;
  digitalDownload: boolean;
}
