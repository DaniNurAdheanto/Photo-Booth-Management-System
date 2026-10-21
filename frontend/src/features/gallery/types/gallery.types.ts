export type MediaType = 'STRIP_2X6' | 'POSTCARD_4X6' | 'GIF_ANIMATED' | 'BOOMERANG_MP4' | 'RAW_BURST';

export interface GalleryMediaItem {
  id: string;
  sessionCode: string;
  eventId?: string;
  eventName: string;
  albumSlug: string;
  boothId: string;
  boothName: string;
  customerName: string;
  customerPhone?: string;
  customerEmail?: string;
  mediaType: MediaType;
  highResUrl: string;
  previewUrl: string;
  gifUrl?: string;
  burstPhotos: string[];
  fileSizeMb: number;
  downloadCount: number;
  qrCodeUrl: string;
  portalUrl: string;
  isPinProtected: boolean;
  pinCode?: string;
  expiryDays: number;
  createdAt: string;
  lastDownloadedAt?: string;
  printCopies: number;
  isWatermarked: boolean;
}

export interface CloudAlbum {
  id: string;
  name: string;
  slug: string;
  eventCategory: 'Wedding' | 'Corporate' | 'Birthday' | 'Mall Kiosk';
  mediaCount: number;
  totalSizeMb: number;
  downloadCount: number;
  coverUrl: string;
  venue: string;
  eventDate: string;
  isLocked: boolean;
}

export interface DownloadAccessLog {
  id: string;
  mediaId: string;
  sessionCode: string;
  timestamp: string;
  ipAddress: string;
  deviceType: 'iPhone' | 'Android' | 'Desktop';
  downloadItem: 'Print HD' | 'GIF Animation' | 'Single Photos ZIP';
}
