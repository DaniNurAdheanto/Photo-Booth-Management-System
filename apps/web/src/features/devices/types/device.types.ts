export type DeviceType = 'CAMERA' | 'PRINTER' | 'PAYMENT_GATEWAY' | 'TOUCH_MONITOR' | 'LIGHTING';

export interface Device {
  id: string;
  boothId: string;
  deviceType: DeviceType;
  deviceName: string;
  serialNumber?: string;
  isConnected: boolean;
  lastPing?: string;
}
