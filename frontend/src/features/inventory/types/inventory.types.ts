export type InventoryCategory = 'consumable' | 'frame' | 'hardware' | 'maintenance';

export type StockStatus = 'Aman' | 'Menipis' | 'Kritis' | 'Dalam Perjalanan';

export type StorageLocation =
  | 'Semua Lokasi'
  | 'Gudang Pusat (HQ Jakarta)'
  | 'Booth Alpha - Grand Indonesia'
  | 'Booth Beta - Central Park'
  | 'Flight Case Mobile Unit 1';

export interface InventoryItem {
  id: string;
  sku: string;
  name: string;
  category: InventoryCategory;
  categoryLabel: string;
  location: StorageLocation;
  currentStock: number;
  maxCapacity: number;
  minThreshold: number;
  unit: string;
  costPerUnit: number;
  supplier: string;
  status: StockStatus;
  estimatedPrintsLeft?: number;
  lastRestocked: string;
  burnRatePerDay?: number; // rata-rata lembar per hari
  deviceDetails?: {
    model: string;
    serialNumber: string;
    firmware?: string;
    totalCyclesOrPrints?: number;
    operatingTemp?: string;
    healthPercentage: number;
  };
}

export interface StockMutationLog {
  id: string;
  timestamp: string;
  itemSku: string;
  itemName: string;
  type: 'RESTOCK_MASUK' | 'TRANSFER_KE_BOOTH' | 'TERPAKAI_SESI' | 'RUSAK_PENYESUAIAN';
  typeLabel: string;
  quantity: number;
  unit: string;
  fromLocation: string;
  toLocation: string;
  picName: string;
  notes?: string;
}

export interface InventorySummary {
  totalAssetValue: number;
  totalPaperPrintsReady: number;
  criticalItemsCount: number;
  hardwareHealthyPercentage: number;
  activeBoothsMonitored: number;
}
