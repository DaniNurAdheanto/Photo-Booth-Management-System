'use client';

import React from 'react';
import { PhotoSession } from '../types/session.types';
import { X, QrCode, Printer, CheckCircle2, Clock, Camera, RefreshCw, AlertTriangle, ShieldCheck } from 'lucide-react';

interface SessionDetailModalProps {
  session: PhotoSession | null;
  isOpen: boolean;
  onClose: () => void;
  onCancelSession?: (sessionId: string) => void;
}

export function SessionDetailModal({
  session,
  isOpen,
  onClose,
  onCancelSession,
}: SessionDetailModalProps) {
  if (!isOpen || !session) return null;

  let capturedList: { slot: number; url: string; timestamp?: string }[] = [];
  try {
    const raw = session.captured_photos || session.capturedPhotos;
    if (raw) {
      capturedList = typeof raw === 'string' ? JSON.parse(raw) : raw;
    }
  } catch (e) {
    capturedList = [];
  }

  const sessionCode = session.session_code || session.sessionCode;
  const boothId = session.booth_id || session.boothId;
  const customerName = session.customer_name || session.customerName || 'Walk-in Guest';
  const customerEmail = session.customer_email || session.customerEmail || '-';
  const totalPhotos = session.total_photos || session.totalPhotos || 4;
  const printCopies = session.print_copies || session.printCopies || 2;
  const templateId = session.template_id || session.templateId || 'Standard';
  const retakeCount = session.retake_count || session.retakeCount || 0;
  const idempotencyKey = session.idempotency_key || session.idempotencyKey || 'None';
  const finalComposite = session.final_composite_url || session.finalCompositeUrl;
  const qrCodeUrl = session.qr_code_url || session.qrCodeUrl;
  const startedAt = session.started_at || session.startedAt;
  const endedAt = session.ended_at || session.endedAt;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm animate-fade-in font-poppins">
      <div className="relative w-full max-w-3xl rounded-2xl bg-white shadow-2xl border border-gray-100 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="px-6 py-4.5 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-[#C1E3D0]/60 border border-[#a8d7bc] flex items-center justify-center text-[#133825]">
              <Camera className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-gray-900">{sessionCode}</h3>
                <span
                  className={`px-2.5 py-0.5 text-[11px] font-semibold rounded-full ${
                    session.status === 'COMPLETED'
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      : session.status === 'REVIEWING'
                      ? 'bg-amber-50 text-amber-700 border border-amber-200'
                      : session.status === 'CAPTURING' || session.status === 'COUNTDOWN'
                      ? 'bg-[#C1E3D0] text-[#133825] border border-[#a8d7bc]'
                      : 'bg-gray-100 text-gray-700'
                  }`}
                >
                  {session.status}
                </span>
              </div>
              <p className="text-xs text-gray-500">ID: {session.id} • Booth: {boothId}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Key Metrics Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3 rounded-xl bg-gray-50 border border-gray-100">
              <span className="text-[11px] font-medium text-gray-500 uppercase tracking-wider">Pelanggan</span>
              <p className="text-sm font-semibold text-gray-900 truncate mt-0.5">{customerName}</p>
              <p className="text-[10px] text-gray-400 truncate">{customerEmail}</p>
            </div>
            <div className="p-3 rounded-xl bg-gray-50 border border-gray-100">
              <span className="text-[11px] font-medium text-gray-500 uppercase tracking-wider">Template & Slots</span>
              <p className="text-sm font-semibold text-gray-900 mt-0.5">{templateId}</p>
              <p className="text-[10px] text-gray-400">{capturedList.length} dari {totalPhotos} foto</p>
            </div>
            <div className="p-3 rounded-xl bg-gray-50 border border-gray-100">
              <span className="text-[11px] font-medium text-gray-500 uppercase tracking-wider">Cetak & Retake</span>
              <p className="text-sm font-semibold text-gray-900 mt-0.5">{printCopies} Salinan</p>
              <p className="text-[10px] text-gray-400">{retakeCount} kali retake</p>
            </div>
            <div className="p-3 rounded-xl bg-gray-50 border border-gray-100">
              <span className="text-[11px] font-medium text-gray-500 uppercase tracking-wider">Waktu Sesi</span>
              <p className="text-sm font-semibold text-gray-900 mt-0.5">
                {startedAt ? new Date(startedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '-'}
              </p>
              <p className="text-[10px] text-gray-400">
                {endedAt ? `Selesai: ${new Date(endedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}` : 'Berjalan'}
              </p>
            </div>
          </div>

          {/* Captured Photos Grid */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-xs font-semibold text-gray-900 uppercase tracking-wider">
                Foto Yang Diambil ({capturedList.length} / {totalPhotos})
              </h4>
              <span className="text-xs text-gray-400">Slot berurutan</span>
            </div>

            {capturedList.length === 0 ? (
              <div className="p-6 text-center rounded-xl bg-gray-50 border border-dashed border-gray-200">
                <Camera className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                <p className="text-xs text-gray-500">Belum ada foto yang diambil pada sesi ini.</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {capturedList.map((item, idx) => (
                  <div key={idx} className="group relative rounded-xl overflow-hidden border border-gray-200 bg-gray-100 shadow-xs">
                    <img
                      src={item.url}
                      alt={`Foto Slot ${item.slot + 1}`}
                      className="w-full h-32 object-cover transition-transform group-hover:scale-105"
                    />
                    <div className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-xs text-[10px] font-bold text-white">
                      Slot #{item.slot + 1}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Composite and QR Code Preview */}
          {(finalComposite || qrCodeUrl) && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 rounded-xl bg-[#C1E3D0]/20 border border-[#a8d7bc]/60">
              {finalComposite && (
                <div>
                  <span className="text-xs font-semibold text-[#133825] mb-2 block">
                    Hasil Cetak Final (Composite)
                  </span>
                  <div className="rounded-lg overflow-hidden border border-gray-200 bg-white max-h-48 flex items-center justify-center">
                    <img src={finalComposite} alt="Final composite" className="max-h-48 object-contain" />
                  </div>
                </div>
              )}
              {qrCodeUrl && (
                <div className="flex flex-col items-center justify-center p-3 rounded-lg bg-white border border-gray-200 text-center">
                  <span className="text-xs font-semibold text-[#133825] mb-2">QR Code Unduhan Digital</span>
                  <img src={qrCodeUrl} alt="QR Code" className="w-28 h-28 object-contain" />
                  <p className="text-[10px] text-gray-500 mt-2">Pindai dengan kamera ponsel untuk menyimpan foto.</p>
                </div>
              )}
            </div>
          )}

          {/* Idempotency & Safety Audit */}
          <div className="p-3 rounded-xl bg-gray-50 border border-gray-200 text-xs text-gray-600 flex items-start gap-2.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-gray-800">Integritas Transaksi & Idempotency</p>
              <p className="text-[11px] text-gray-500 mt-0.5">
                Key: <code className="bg-gray-200/80 px-1.5 py-0.5 rounded text-[10px] font-mono">{idempotencyKey}</code>. 
                Mencegah pembuatan tiket cetak ganda saat pengunjung menekan tombol berkali-kali.
              </p>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3.5 border-t border-gray-100 bg-gray-50/50 flex items-center justify-between">
          <div>
            {session.status !== 'COMPLETED' && session.status !== 'CANCELLED' && onCancelSession && (
              <button
                onClick={() => onCancelSession(session.id)}
                className="px-3 py-1.5 rounded-lg border border-red-200 bg-white text-xs font-medium text-red-600 hover:bg-red-50 transition-colors"
              >
                Batalkan Sesi
              </button>
            )}
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-gray-900 text-white text-xs font-medium hover:bg-gray-800 transition-colors"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
}
