'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Film,
  Camera,
  Play,
  RotateCcw,
  CheckCircle2,
  Clock,
  Search,
  Filter,
  RefreshCw,
  Eye,
  Trash2,
  AlertTriangle,
  QrCode,
  Printer,
  ChevronRight,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import { Sidebar } from '@/components/layout/sidebar';
import { PhotoSession } from '@/features/sessions/types/session.types';
import { SessionDetailModal } from '@/features/sessions/components/SessionDetailModal';

export default function SessionsManagementPage() {
  const [sessions, setSessions] = useState<PhotoSession[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedBooth, setSelectedBooth] = useState<string>('');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Modals & detail inspect
  const [inspectSession, setInspectSession] = useState<PhotoSession | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Toast notifications
  const [toastMessage, setToastMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  const showToast = (text: string, type: 'success' | 'error' = 'success') => {
    setToastMessage({ text, type });
    setTimeout(() => setToastMessage(null), 3500);
  };

  const fetchSessions = async () => {
    setLoading(true);
    try {
      const query = new URLSearchParams();
      if (selectedBooth) query.set('booth_id', selectedBooth);
      if (selectedStatus !== 'ALL') query.set('status', selectedStatus);

      const res = await fetch(`/api/sessions?${query.toString()}`);
      const json = await res.json();
      if (json.success && Array.isArray(json.data)) {
        setSessions(json.data);
      }
    } catch (e) {
      showToast('Gagal memuat sesi foto dari database', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSessions();
  }, [selectedBooth, selectedStatus]);

  // Handle Delete Session
  const handleDeleteSession = async (id: string) => {
    try {
      const res = await fetch(`/api/sessions/${id}`, { method: 'DELETE' });
      const json = await res.json();
      if (json.success) {
        showToast('Sesi foto berhasil dihapus dari database');
        setSessions((prev) => prev.filter((s) => s.id !== id));
      } else {
        showToast(json.message || 'Gagal menghapus sesi', 'error');
      }
    } catch (e) {
      showToast('Terjadi kesalahan saat menghapus sesi', 'error');
    } finally {
      setDeleteConfirmId(null);
    }
  };

  // Handle Cancel Session from Modal
  const handleCancelSession = async (id: string) => {
    try {
      const res = await fetch(`/api/sessions/${id}/cancel`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ notes: 'Dibatalkan oleh operator dari dashboard' }),
      });
      const json = await res.json();
      if (json.success) {
        showToast('Sesi foto berhasil dibatalkan');
        setInspectSession(null);
        fetchSessions();
      }
    } catch (e) {
      showToast('Gagal membatalkan sesi', 'error');
    }
  };

  // Filtered Sessions
  const filteredSessions = sessions.filter((s) => {
    const code = (s.session_code || s.sessionCode || '').toLowerCase();
    const customer = (s.customer_name || s.customerName || '').toLowerCase();
    const q = searchQuery.toLowerCase();
    return code.includes(q) || customer.includes(q);
  });

  // Calculate Metrics
  const totalCount = sessions.length;
  const activeCount = sessions.filter(
    (s) => s.status === 'CAPTURING' || s.status === 'COUNTDOWN' || s.status === 'REVIEWING'
  ).length;
  const completedCount = sessions.filter((s) => s.status === 'COMPLETED').length;
  const totalRetakes = sessions.reduce((acc, s) => acc + (s.retake_count || s.retakeCount || 0), 0);
  const avgRetake = totalCount > 0 ? (totalRetakes / totalCount).toFixed(1) : '0';

  return (
    <div className="flex min-h-screen bg-gray-50/70 font-poppins text-gray-900">
      {/* Monorepo Sidebar */}
      <Sidebar />

      {/* Main Page Content */}
      <main className="flex-1 overflow-y-auto p-6 lg:p-8 space-y-6">
        {/* Toast Notification */}
        {toastMessage && (
          <div className="fixed top-6 right-6 z-50 animate-fade-in">
            <div
              className={`px-4 py-3 rounded-xl shadow-lg border flex items-center gap-2.5 text-xs font-semibold ${
                toastMessage.type === 'success'
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                  : 'bg-red-50 text-red-800 border-red-200'
              }`}
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>{toastMessage.text}</span>
            </div>
          </div>
        )}

        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold tracking-tight text-gray-900">
                Photo Session Management
              </h1>
              <span className="px-2.5 py-0.5 rounded-full bg-[#C1E3D0] text-[#133825] text-xs font-bold border border-[#a8d7bc]">
                PRD Verified
              </span>
            </div>
            <p className="text-xs text-gray-500 max-w-2xl">
              Pantau dan kelola seluruh alur sesi pengambilan foto, live camera preview, perlindungan idempotency transaksi, dan pemulihan sesi terputus.
            </p>
          </div>

          {/* Action CTAs */}
          <div className="flex items-center gap-3">
            <button
              onClick={fetchSessions}
              className="px-3.5 py-2.5 rounded-xl border border-gray-200 bg-white text-xs font-medium text-gray-600 hover:bg-gray-50 transition-colors flex items-center gap-2 shadow-xs"
              title="Refresh Sesi"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
              <span>Refresh</span>
            </button>

            <Link
              href="/sessions/booth"
              className="px-4.5 py-2.5 rounded-xl bg-[#C1E3D0] text-[#133825] text-xs font-bold hover:bg-[#aee0c2] transition-colors border border-[#418B63]/40 flex items-center gap-2 shadow-sm"
            >
              <Play className="w-4 h-4 fill-[#133825]" />
              <span>Buka Layar Kiosk Booth</span>
            </Link>
          </div>
        </div>

        {/* Metrics Row - Untitled UI Card Aesthetics */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-gray-500">Total Sesi Foto</span>
              <Film className="w-4 h-4 text-gray-400" />
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-2xl font-bold text-gray-900">{totalCount}</span>
              <span className="text-[11px] text-gray-500 font-medium">tersimpan di DB</span>
            </div>
          </div>

          <div className="rounded-2xl border border-[#C1E3D0] bg-[#C1E3D0]/20 p-4 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-[#133825]">Sesi Berjalan / Live</span>
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#418B63] opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#2C6D4C]" />
              </span>
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-2xl font-bold text-[#133825]">{activeCount}</span>
              <span className="text-[11px] text-[#2C6D4C] font-semibold">sedang aktif</span>
            </div>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-gray-500">Selesai Dicetak</span>
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-2xl font-bold text-gray-900">{completedCount}</span>
              <span className="text-[11px] text-emerald-600 font-medium">
                {totalCount > 0 ? `${Math.round((completedCount / totalCount) * 100)}% berhasil` : '100%'}
              </span>
            </div>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-gray-500">Rata-rata Retake</span>
              <RotateCcw className="w-4 h-4 text-amber-500" />
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-2xl font-bold text-gray-900">{avgRetake}</span>
              <span className="text-[11px] text-gray-500 font-medium">retake / sesi</span>
            </div>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-xs space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            {/* Status Tabs */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
              {[
                { label: 'Semua Status', value: 'ALL' },
                { label: 'Selesai', value: 'COMPLETED' },
                { label: 'Tinjauan (Review)', value: 'REVIEWING' },
                { label: 'Sedang Foto (Capturing)', value: 'CAPTURING' },
                { label: 'Dibatalkan', value: 'CANCELLED' },
              ].map((tab) => (
                <button
                  key={tab.value}
                  onClick={() => setSelectedStatus(tab.value)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
                    selectedStatus === tab.value
                      ? 'bg-[#C1E3D0] text-[#133825] border border-[#a8d7bc]'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Booth Selector */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-gray-500">Booth:</span>
              <select
                value={selectedBooth}
                onChange={(e) => setSelectedBooth(e.target.value)}
                className="px-2.5 py-1.5 rounded-lg border border-gray-200 bg-white text-xs font-medium text-gray-700 focus:outline-hidden focus:border-[#418B63]"
              >
                <option value="">Semua Booth</option>
                <option value="bth-001">Booth Alpha - GI</option>
                <option value="bth-002">Booth Beta - CP</option>
                <option value="bth-003">Booth Gamma - PVJ</option>
              </select>
            </div>
          </div>

          {/* Search Input */}
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Cari berdasarkan kode sesi (SES-...) atau nama pelanggan..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-xs rounded-xl border border-gray-200 focus:outline-hidden focus:border-[#418B63] focus:ring-2 focus:ring-[#C1E3D0]"
            />
          </div>
        </div>

        {/* Sessions Table - Untitled UI Aesthetics */}
        <div className="rounded-2xl border border-gray-200 bg-white shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-gray-600">
              <thead className="bg-gray-50/80 text-[11px] font-semibold text-gray-500 uppercase tracking-wider border-b border-gray-200">
                <tr>
                  <th className="px-5 py-3.5">Kode Sesi & ID</th>
                  <th className="px-4 py-3.5">Booth</th>
                  <th className="px-4 py-3.5">Pelanggan</th>
                  <th className="px-4 py-3.5">Template</th>
                  <th className="px-4 py-3.5">Status</th>
                  <th className="px-4 py-3.5">Foto Diambil</th>
                  <th className="px-4 py-3.5">Cetak & Retake</th>
                  <th className="px-4 py-3.5">Waktu</th>
                  <th className="px-5 py-3.5 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {loading ? (
                  <tr>
                    <td colSpan={9} className="py-12 text-center text-xs text-gray-500">
                      <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-gray-400" />
                      Memuat data sesi foto dari database...
                    </td>
                  </tr>
                ) : filteredSessions.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="py-12 text-center text-xs text-gray-500">
                      <Camera className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                      Tidak ada sesi foto yang cocok dengan filter.
                    </td>
                  </tr>
                ) : (
                  filteredSessions.map((session) => {
                    const sessionCode = session.session_code || session.sessionCode;
                    const boothId = session.booth_id || session.boothId;
                    const customerName = session.customer_name || session.customerName || 'Walk-in Guest';
                    const customerEmail = session.customer_email || session.customerEmail;
                    const totalPhotos = session.total_photos || session.totalPhotos || 4;
                    const printCopies = session.print_copies || session.printCopies || 2;
                    const templateId = session.template_id || session.templateId || 'Classic';
                    const retakeCount = session.retake_count || session.retakeCount || 0;
                    const startedAt = session.started_at || session.startedAt;

                    // Parse captured photos array
                    let capturedCount = 0;
                    try {
                      const raw = session.captured_photos || session.capturedPhotos;
                      if (raw) {
                        const parsed = typeof raw === 'string' ? JSON.parse(raw) : raw;
                        if (Array.isArray(parsed)) capturedCount = parsed.length;
                      }
                    } catch (e) {}

                    return (
                      <tr key={session.id} className="hover:bg-gray-50/60 transition-colors">
                        {/* Session Code & ID */}
                        <td className="px-5 py-3.5">
                          <span className="font-mono font-bold text-gray-900 block">{sessionCode}</span>
                          <span className="text-[10px] text-gray-400 font-mono">{session.id}</span>
                        </td>

                        {/* Booth */}
                        <td className="px-4 py-3.5">
                          <span className="font-semibold text-gray-800 block">
                            {boothId === 'bth-001' ? 'Booth Alpha (GI)' : boothId === 'bth-002' ? 'Booth Beta (CP)' : boothId}
                          </span>
                          <span className="text-[10px] text-gray-400">{boothId}</span>
                        </td>

                        {/* Customer */}
                        <td className="px-4 py-3.5">
                          <span className="font-medium text-gray-900 block">{customerName}</span>
                          <span className="text-[10px] text-gray-400">{customerEmail || '-'}</span>
                        </td>

                        {/* Template */}
                        <td className="px-4 py-3.5">
                          <span className="px-2 py-0.5 rounded-md bg-gray-100 text-gray-700 font-medium text-[11px]">
                            {templateId}
                          </span>
                        </td>

                        {/* Status Badge */}
                        <td className="px-4 py-3.5">
                          <span
                            className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${
                              session.status === 'COMPLETED'
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                : session.status === 'REVIEWING'
                                ? 'bg-amber-50 text-amber-700 border border-amber-200'
                                : session.status === 'CAPTURING' || session.status === 'COUNTDOWN'
                                ? 'bg-[#C1E3D0] text-[#133825] border border-[#a8d7bc]'
                                : 'bg-red-50 text-red-700 border border-red-200'
                            }`}
                          >
                            <span
                              className={`w-1.5 h-1.5 rounded-full ${
                                session.status === 'COMPLETED'
                                  ? 'bg-emerald-500'
                                  : session.status === 'REVIEWING'
                                  ? 'bg-amber-500'
                                  : session.status === 'CAPTURING'
                                  ? 'bg-[#2C6D4C] animate-pulse'
                                  : 'bg-red-500'
                              }`}
                            />
                            {session.status}
                          </span>
                        </td>

                        {/* Photos captured */}
                        <td className="px-4 py-3.5">
                          <span className="font-medium text-gray-800">
                            {capturedCount} / {totalPhotos} foto
                          </span>
                        </td>

                        {/* Print Copies & Retake */}
                        <td className="px-4 py-3.5">
                          <span className="font-medium text-gray-800">{printCopies}x cetak</span>
                          <span className="text-[10px] text-gray-400 block">{retakeCount}x retake</span>
                        </td>

                        {/* Timestamp */}
                        <td className="px-4 py-3.5">
                          <span className="text-gray-700 block">
                            {startedAt ? new Date(startedAt).toLocaleDateString([], { month: 'short', day: 'numeric' }) : '-'}
                          </span>
                          <span className="text-[10px] text-gray-400">
                            {startedAt ? new Date(startedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '-'}
                          </span>
                        </td>

                        {/* Actions */}
                        <td className="px-5 py-3.5 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => setInspectSession(session)}
                              className="p-1.5 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-colors"
                              title="Lihat Detail Sesi"
                            >
                              <Eye className="w-3.5 h-3.5" />
                            </button>

                            <button
                              onClick={() => setDeleteConfirmId(session.id)}
                              className="p-1.5 rounded-lg border border-red-200 text-red-600 hover:bg-red-50 transition-colors"
                              title="Hapus Sesi"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
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
      </main>

      {/* Inspect Session Detail Modal */}
      <SessionDetailModal
        session={inspectSession}
        isOpen={Boolean(inspectSession)}
        onClose={() => setInspectSession(null)}
        onCancelSession={handleCancelSession}
      />

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-950/60 backdrop-blur-sm animate-fade-in font-poppins">
          <div className="relative w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl border border-gray-100 text-center space-y-4">
            <div className="w-12 h-12 rounded-xl bg-red-100 text-red-600 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-bold text-gray-900">Hapus Sesi Foto?</h3>
              <p className="text-xs text-gray-500">
                Tindakan ini akan menghapus data sesi dan riwayat foto dari database secara permanen.
              </p>
            </div>
            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="flex-1 py-2 rounded-lg border border-gray-200 text-xs font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Batal
              </button>
              <button
                onClick={() => handleDeleteSession(deleteConfirmId)}
                className="flex-1 py-2 rounded-lg bg-red-600 text-white text-xs font-bold hover:bg-red-700 transition-colors shadow-xs"
              >
                Hapus
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
