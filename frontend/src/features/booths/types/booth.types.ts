export interface Booth {
  id: string;
  code: string;
  name: string;
  location: string;
  status: 'ONLINE' | 'OFFLINE' | 'IN_SESSION' | 'MAINTENANCE';
  ipAddress?: string;
  paperCount: number;
  maxPaperCapacity: number;
  cameraModel?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateBoothPayload {
  code: string;
  name: string;
  location: string;
  paperCount: number;
  maxPaperCapacity: number;
  cameraModel?: string;
  notes?: string;
}
