import { fetchFromApi } from '@/lib/api-client';
import { Booth, CreateBoothPayload } from '../types/booth.types';

export const boothService = {
  async getBooths(): Promise<Booth[]> {
    const res = await fetchFromApi<Booth[]>('/booths');
    return res.data;
  },

  async getBoothById(id: string): Promise<Booth> {
    const res = await fetchFromApi<Booth>(`/booths/${id}`);
    return res.data;
  },

  async createBooth(payload: CreateBoothPayload): Promise<Booth> {
    const res = await fetchFromApi<Booth>('/booths', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
    return res.data;
  },
};
