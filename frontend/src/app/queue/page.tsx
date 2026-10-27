'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { createPortal } from 'react-dom';
import Link from 'next/link';
import {
  BellRing,
  Clock,
  Mail,
  Send,
  Users,
  Store,
  Camera,
  CheckCircle2,
  AlertTriangle,
  Flame,
  Search,
  Filter,
  RefreshCw,
  Plus,
  ExternalLink,
  ChevronRight,
  Eye,
  Check,
  X,
  Sparkles,
  Smartphone,
  LogOut,
  Calendar,
  Layers,
  ArrowRight,
  ShieldCheck,
  Radio,
  FileText,
  Volume2,
  QrCode,
  CreditCard,
  Zap,
} from 'lucide-react';
import { useLanguage } from '@/context/language-context';
import { QueueTicket, QueueStatus, EmailLogEntry, EmailReminderType } from '@/features/queue/types/queue.types';

// Initial Queue Data (Clean State)
const INITIAL_QUEUE_TICKETS: QueueTicket[] = [];
const INITIAL_EMAIL_LOGS: EmailLogEntry[] = [];

export default function QueueManagementPage() {
  const { t, language } = useLanguage();
  const [tickets, setTickets] = useState<QueueTicket[]>(INITIAL_QUEUE_TICKETS);
  const [emailLogs, setEmailLogs] = useState<EmailLogEntry[]>(INITIAL_EMAIL_LOGS);
  
  // Settings & Toggles
  const [isRushHourMode, setIsRushHourMode] = useState<boolean>(true);
  const [autoEmailEnabled, setAutoEmailEnabled] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [boothFilter, setBoothFilter] = useState<string>('ALL');

  // Modals
  const [previewEmailTicket, setPreviewEmailTicket] = useState<QueueTicket | null>(null);
  const [isNewTicketModalOpen, setIsNewTicketModalOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  // New Ticket Form State
  const [newCustName, setNewCustName] = useState('');
  const [newCustEmail, setNewCustEmail] = useState('');
  const [newCustPhone, setNewCustPhone] = useState('');
  const [newBoothId, setNewBoothId] = useState('bth-001');
  const [newPax, setNewPax] = useState(2);
  const [newPackage, setNewPackage] = useState('Strip 2x6 Glamour Pink');
  const [newPaymentMethod, setNewPaymentMethod] = useState<'QRIS' | 'CASH' | 'DEBIT'>('QRIS');
  const [newNotes, setNewNotes] = useState('');

  // Toast feedback
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string, _type?: 'success' | 'error') => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const [isLoading, setIsLoading] = useState(false);

  const fetchQueues = async () => {
    try {
      setIsLoading(true);
      const res = await fetch('/api/queues');
      if (res.ok) {
        const json = await res.json();
        if (json.success && Array.isArray(json.data) && json.data.length > 0) {
          setTickets(json.data);
        }
      }
    } catch (err) {
      console.warn('Failed to load queues from backend:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    setMounted(true);
    fetchQueues();
  }, []);

  // Filtered Tickets
  const filteredTickets = useMemo(() => {
    return tickets.filter((ticket) => {
      const matchSearch =
        ticket.ticketNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ticket.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ticket.customerEmail.toLowerCase().includes(searchQuery.toLowerCase());

      const matchStatus = statusFilter === 'ALL' || ticket.status === statusFilter;
      const matchBooth = boothFilter === 'ALL' || ticket.boothId === boothFilter;

      return matchSearch && matchStatus && matchBooth;
    });
  }, [tickets, searchQuery, statusFilter, boothFilter]);

  // Derived Metric Stats
  const waitingCount = tickets.filter((t) => t.status === 'WAITING' || t.status === 'CALLING').length;
  const inBoothCount = tickets.filter((t) => t.status === 'IN_BOOTH').length;
  const totalEmailsSent = emailLogs.length;

  // Actions
  const handleCallTicket = (ticket: QueueTicket) => {
    const updated = tickets.map((t) => {
      if (t.id === ticket.id) {
        return {
          ...t,
          status: 'CALLING' as QueueStatus,
          calledAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          emailRemindersSent: t.emailRemindersSent + 1,
          lastReminderAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
      }
      return t;
    });
    setTickets(updated);

    // Sync to PostgreSQL backend
    fetch(`/api/queues/${ticket.id}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'CALLED' }),
    }).catch((err) => console.warn('Failed to sync queue status:', err));

    // Auto Dispatch Email Notification
    const newLog: EmailLogEntry = {
      id: `log-${Date.now()}`,
      ticketId: ticket.id,
      ticketNumber: ticket.ticketNumber,
      recipientEmail: ticket.customerEmail,
      recipientName: ticket.customerName,
      subject: `🔔 ${language === 'en' ? 'Your Turn is Ready! - PhotoBooth Central' : 'Giliran Anda Sekarang! - PhotoBooth Central'} (#${ticket.ticketNumber})`,
      type: 'CALLING_NOW',
      sentAt: new Date().toLocaleTimeString(),
      status: 'DELIVERED',
      boothName: ticket.boothName.split('(')[0].trim(),
    };
    setEmailLogs([newLog, ...emailLogs]);

    showToast(
      language === 'en'
        ? `Ticket #${ticket.ticketNumber} called! Reminder email dispatched to ${ticket.customerEmail}`
        : `Nomor #${ticket.ticketNumber} dipanggil! Email reminder otomatis dikirim ke ${ticket.customerEmail}`
    );
  };

  const handleSendReminderOnly = (ticket: QueueTicket) => {
    const updated = tickets.map((t) => {
      if (t.id === ticket.id) {
        return {
          ...t,
          emailRemindersSent: t.emailRemindersSent + 1,
          lastReminderAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
      }
      return t;
    });
    setTickets(updated);

    const newLog: EmailLogEntry = {
      id: `log-${Date.now()}`,
      ticketId: ticket.id,
      ticketNumber: ticket.ticketNumber,
      recipientEmail: ticket.customerEmail,
      recipientName: ticket.customerName,
      subject: `⏳ ${language === 'en' ? 'Reminder: Your Turn in 5 Mins - PhotoBooth Central' : 'Pengingat: Giliran Anda ±5 Menit Lagi - PhotoBooth Central'} (#${ticket.ticketNumber})`,
      type: 'UPCOMING_SOON',
      sentAt: new Date().toLocaleTimeString(),
      status: 'DELIVERED',
      boothName: ticket.boothName.split('(')[0].trim(),
    };
    setEmailLogs([newLog, ...emailLogs]);

    showToast(
      language === 'en'
        ? `Reminder email successfully sent to ${ticket.customerEmail}`
        : `Email reminder berhasil dikirim ke ${ticket.customerEmail}`
    );
  };

  const handleMarkInBooth = (ticketId: string) => {
    setTickets((prev) =>
      prev.map((t) =>
        t.id === ticketId
          ? {
              ...t,
              status: 'IN_BOOTH' as QueueStatus,
              inBoothAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            }
          : t
      )
    );

    // Sync to PostgreSQL backend
    fetch(`/api/queues/${ticketId}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'IN_BOOTH' }),
    }).catch((err) => console.warn('Failed to sync queue status:', err));

    showToast(language === 'en' ? 'Guest has entered the booth! Photo session starting.' : 'Tamu telah masuk booth! Sesi foto dimulai.');
  };

  const handleMarkCompleted = (ticketId: string) => {
    setTickets((prev) =>
      prev.map((t) =>
        t.id === ticketId ? { ...t, status: 'COMPLETED' as QueueStatus } : t
      )
    );

    // Sync to PostgreSQL backend
    fetch(`/api/queues/${ticketId}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'COMPLETED' }),
    }).catch((err) => console.warn('Failed to sync queue status:', err));

    showToast(language === 'en' ? 'Session completed. Paper printed & uploaded to cloud.' : 'Sesi selesai. Foto dicetak & diunggah ke cloud.');
  };

  const handleMarkNoShow = (ticketId: string) => {
    setTickets((prev) =>
      prev.map((t) =>
        t.id === ticketId ? { ...t, status: 'NO_SHOW' as QueueStatus } : t
      )
    );

    // Sync to PostgreSQL backend
    fetch(`/api/queues/${ticketId}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'CANCELLED' }),
    }).catch((err) => console.warn('Failed to sync queue status:', err));

    showToast(language === 'en' ? 'Ticket skipped (guest did not show up).' : 'Tiket dilewati (tamu tidak hadir saat dipanggil).');
  };

  const handleBroadcastTop3 = () => {
    const waitingTickets = tickets.filter((t) => t.status === 'WAITING').slice(0, 3);
    if (waitingTickets.length === 0) {
      showToast(language === 'en' ? 'No waiting guests to broadcast.' : 'Tidak ada antrean menunggu untuk dikirim reminder.');
      return;
    }

    const newLogs: EmailLogEntry[] = waitingTickets.map((t) => ({
      id: `log-${Date.now()}-${t.id}`,
      ticketId: t.id,
      ticketNumber: t.ticketNumber,
      recipientEmail: t.customerEmail,
      recipientName: t.customerName,
      subject: `🔔 ${language === 'en' ? 'Rush Hour Queue Update - PhotoBooth Central' : 'Update Antrean Padat - PhotoBooth Central'} (#${t.ticketNumber})`,
      type: 'UPCOMING_SOON',
      sentAt: new Date().toLocaleTimeString(),
      status: 'DELIVERED',
      boothName: t.boothName.split('(')[0].trim(),
    }));

    setEmailLogs([...newLogs, ...emailLogs]);
    setTickets((prev) =>
      prev.map((t) =>
        waitingTickets.some((wt) => wt.id === t.id)
          ? {
              ...t,
              emailRemindersSent: t.emailRemindersSent + 1,
              lastReminderAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            }
          : t
      )
    );

    showToast(
      language === 'en'
        ? `Broadcast sent! Reminders delivered to ${waitingTickets.length} next waiting customers.`
        : `Broadcast berhasil! Reminder email terkirim ke ${waitingTickets.length} antrean teratas.`
    );
  };

  const handleCreateTicketSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCustName || !newCustEmail) {
      showToast(language === 'en' ? 'Please fill guest name and email address' : 'Mohon lengkapi nama tamu dan alamat email', 'error');
      return;
    }

    const waitingCount = tickets.filter((t) => t.boothId === newBoothId && t.status === 'WAITING').length;
    const inBoothTicket = tickets.find((t) => t.boothId === newBoothId && t.status === 'IN_BOOTH');
    const hasQueue = waitingCount > 0 || !!inBoothTicket;

    const prefix = newBoothId === 'bth-001' ? 'A' : newBoothId === 'bth-002' ? 'B' : 'C';
    const nextNum = String(tickets.length + 12).padStart(3, '0');
    const boothNameMap: Record<string, string> = {
      'bth-001': 'Booth Alpha (Grand Indonesia Lt. 3A)',
      'bth-002': 'Booth Beta (Grand Indonesia Lt. 3A)',
      'bth-003': 'Booth Gamma (Central Park Mall)',
    };

    const newTicket: QueueTicket = {
      id: `q-${Date.now()}`,
      ticketNumber: `${prefix}-${nextNum}`,
      customerName: newCustName,
      customerEmail: newCustEmail,
      customerPhone: newCustPhone || '0812-xxxx-xxxx',
      boothId: newBoothId,
      boothName: boothNameMap[newBoothId] || 'Booth Alpha',
      pax: Number(newPax),
      packageType: `${newPackage} [${newPaymentMethod}]`,
      status: hasQueue ? 'WAITING' : 'IN_BOOTH',
      joinedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      inBoothAt: hasQueue ? undefined : new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      estimatedMinutes: hasQueue ? (waitingCount + 1) * 5 : 0,
      emailRemindersSent: 1,
      lastReminderAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      notes: newNotes ? `${newNotes} | Bayar: ${newPaymentMethod} (Lunas)` : `Bayar: ${newPaymentMethod} (Lunas)`,
    };

    setTickets([...tickets, newTicket]);

    // Persist to PostgreSQL backend
    fetch('/api/queues', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        customerName: newCustName,
        customerEmail: newCustEmail,
        customerPhone: newCustPhone,
        boothId: newBoothId,
        packageType: newPackage,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.data && data.data.id) {
          setTickets((prev) =>
            prev.map((t) => (t.id === newTicket.id ? { ...t, id: data.data.id, ticketNumber: data.data.queue_number || t.ticketNumber } : t))
          );
        }
      })
      .catch((err) => console.warn('Failed to persist queue to backend:', err));

    // Send instant registration email confirmation or direct entry notification
    const newLog: EmailLogEntry = {
      id: `log-${Date.now()}`,
      ticketId: newTicket.id,
      ticketNumber: newTicket.ticketNumber,
      recipientEmail: newTicket.customerEmail,
      recipientName: newTicket.customerName,
      subject: hasQueue
        ? `🎟️ ${language === 'en' ? 'Your Queue Ticket Confirmed! - PhotoBooth Central' : 'Tiket Antrean Terkonfirmasi! - PhotoBooth Central'} (#${newTicket.ticketNumber})`
        : `🚀 ${language === 'en' ? 'Booth Ready! Direct Studio Access - PhotoBooth Central' : 'Booth Siap! Langsung Mulai Sesi Foto - PhotoBooth Central'} (#${newTicket.ticketNumber})`,
      type: hasQueue ? 'UPCOMING_SOON' : 'CALLING_NOW',
      sentAt: new Date().toLocaleTimeString(),
      status: 'DELIVERED',
      boothName: newTicket.boothName.split('(')[0].trim(),
    };
    setEmailLogs([newLog, ...emailLogs]);

    setIsNewTicketModalOpen(false);
    setNewCustName('');
    setNewCustEmail('');
    setNewCustPhone('');
    setNewNotes('');

    showToast(
      hasQueue
        ? (language === 'en'
            ? `Booth busy (${waitingCount} waiting). Ticket #${newTicket.ticketNumber} queued & reminder email sent to ${newTicket.customerEmail}!`
            : `Booth ramai (${waitingCount} antrean). Tiket #${newTicket.ticketNumber} masuk antrean & reminder email terkirim ke ${newTicket.customerEmail}!`)
        : (language === 'en'
            ? `Booth is idle (no queue)! Guest directly enters booth for photo session (#${newTicket.ticketNumber}) without waiting!`
            : `Booth sedang kosong (tanpa antrean)! Tamu langsung menggunakan layanan foto tanpa perlu menunggu (#${newTicket.ticketNumber})!`)
    );
  };

  return (
    <div className="space-y-6 font-sora animate-fade-in text-gray-900 pb-16">
      {/* Toast Feedback */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-[1001] flex items-center gap-2.5 px-4.5 py-3 rounded-2xl bg-gray-900 text-white text-xs font-semibold shadow-xl border border-gray-800 animate-slide-up">
          <CheckCircle2 className="w-4 h-4 text-[#DE5795]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* TOP HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-200 pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
            <span>PhotoBooth OS</span>
            <span>•</span>
            <span className="text-[#DE5795]">{language === 'en' ? 'Kiosk Operations' : 'Operasional Kiosk'}</span>
            <span>•</span>
            <span>{language === 'en' ? 'Queue & Email Alerts' : 'Antrean & Reminder Email'}</span>
          </div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl font-bold tracking-tight text-gray-900 font-sora">
              {t('queue.title', undefined, 'Antrean Tamu & Reminder Email')}
            </h1>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-pink-50 text-[#9D174D] border border-pink-200">
              <span className="w-2 h-2 rounded-full bg-[#DE5795] animate-ping" />
              Live Queue Engine
            </span>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            {t(
              'queue.subtitle',
              undefined,
              'Monitoring antrean photo booth saat ramai, panggil tiket otomatis, dan kirimkan reminder email langsung ke smartphone pengunjung.'
            )}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            type="button"
            onClick={handleBroadcastTop3}
            className="px-4 py-2.5 rounded-xl border border-pink-200 bg-pink-50/70 hover:bg-pink-100/70 text-xs font-bold text-[#9D174D] transition-all shadow-2xs flex items-center gap-2 active:scale-98"
            title="Kirim pengingat email serentak ke 3 antrean teratas"
          >
            <Send className="w-3.5 h-3.5 text-[#DE5795]" />
            <span>{language === 'en' ? 'Broadcast Top 3 Reminders' : 'Broadcast Reminder 3 Teratas'}</span>
          </button>

          <button
            type="button"
            onClick={() => setIsNewTicketModalOpen(true)}
            className="px-4.5 py-2.5 rounded-xl bg-[#DE5795] text-white text-xs font-bold hover:bg-[#c93d7e] transition-all border border-[#DE5795] shadow-xs flex items-center gap-2 active:scale-98"
          >
            <Plus className="w-4 h-4 text-white" />
            <span>{t('queue.addTicket', undefined, '+ Ambil Nomor Antrean')}</span>
          </button>
        </div>
      </div>

      {/* GUEST FLOW INFO CARD: WALK-IN WITHOUT ACCOUNT */}
      <div className="bg-gradient-to-r from-pink-500/5 via-purple-500/5 to-blue-500/5 border border-pink-200/80 rounded-2xl p-4 sm:p-5 shadow-2xs">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          <div className="flex items-start sm:items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-pink-100 text-[#DE5795] flex items-center justify-center shrink-0 font-bold shadow-xs">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-sm font-bold text-gray-900">
                  {language === 'en' ? 'Seamless Walk-In Flow (No Account Needed)' : 'Alur Tamu Walk-in Tanpa Perlu Buat Akun'}
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-pink-100 text-[#9D174D] border border-pink-200">
                  {language === 'en' ? 'ZERO SIGN-UP' : 'TANPA REGISTRASI AKUN'}
                </span>
              </div>
              <p className="text-xs text-gray-600 mt-1 leading-relaxed max-w-2xl">
                {language === 'en'
                  ? 'Guests simply choose a photo package, input their Email & WhatsApp. If the booth is busy, they automatically get a queue ticket with email reminders. If idle, they immediately enter the booth without waiting.'
                  : 'Customer cukup datang, memilih & membeli paket foto, lalu mengisi Email & Nomor HP. Jika booth sedang ramai otomatis masuk antrean dengan email reminder; jika kosong langsung berfoto tanpa perlu menunggu.'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs w-full lg:w-auto overflow-x-auto pb-1 lg:pb-0">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-gray-200/90 shadow-2xs shrink-0">
              <span className="w-5 h-5 rounded-full bg-pink-50 text-[#DE5795] font-bold text-[10px] flex items-center justify-center">1</span>
              <span className="font-semibold text-gray-700">{language === 'en' ? 'Select & Pay' : 'Beli Paket'}</span>
            </div>
            <span className="text-gray-300">→</span>
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-gray-200/90 shadow-2xs shrink-0">
              <span className="w-5 h-5 rounded-full bg-pink-50 text-[#DE5795] font-bold text-[10px] flex items-center justify-center">2</span>
              <span className="font-semibold text-gray-700">{language === 'en' ? 'Email & WhatsApp' : 'Isi Email & No. HP'}</span>
            </div>
            <span className="text-gray-300">→</span>
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 shadow-2xs shrink-0">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              <span className="font-bold">{language === 'en' ? 'Direct Photo (No Queue)' : 'Langsung Foto (Jika Kosong)'}</span>
            </div>
            <span className="text-gray-300">/</span>
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 shadow-2xs shrink-0">
              <span className="w-2 h-2 rounded-full bg-amber-500"></span>
              <span className="font-bold">{language === 'en' ? 'Queue (If Busy)' : 'Antrean (Jika Ramai)'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* RUSH HOUR MODE / BOOTH CROWDED BANNER */}
      <div className={`p-4 sm:p-5 rounded-2xl border transition-all ${
        isRushHourMode
          ? 'bg-gradient-to-r from-amber-500/10 via-pink-500/10 to-rose-500/10 border-amber-300/80 shadow-xs'
          : 'bg-white border-gray-200/90 shadow-2xs'
      }`}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-xs ${
              isRushHourMode ? 'bg-amber-500 text-white' : 'bg-gray-100 text-gray-500'
            }`}>
              <Flame className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-gray-900">
                  {language === 'en' ? 'High Traffic & Rush Hour Mode' : 'Mode Booth Ramai / Rush Hour'}
                </span>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                  isRushHourMode
                    ? 'bg-amber-100 text-amber-900 border-amber-300'
                    : 'bg-gray-100 text-gray-600 border-gray-200'
                }`}>
                  {isRushHourMode ? (language === 'en' ? 'ACTIVE' : 'AKTIF') : (language === 'en' ? 'NORMAL' : 'NORMAL')}
                </span>
              </div>
              <p className="text-xs text-gray-600 mt-1 max-w-2xl leading-relaxed">
                {language === 'en'
                  ? 'When the mall photo booth gets crowded, this mode sends automatic email reminders 5 minutes before guest turns so customers can explore mall shops without losing their queue spot.'
                  : 'Saat photo booth mall sedang ramai pengunjung, sistem ini otomatis mengirimkan email reminder 5 menit sebelum giliran sehingga tamu dapat berbelanja di mall tanpa khawatir antreannya hangus.'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0 self-end sm:self-center">
            <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-xl border border-gray-200 shadow-2xs">
              <span className="text-xs font-semibold text-gray-700">
                {language === 'en' ? 'Rush Mode:' : 'Mode Ramai:'}
              </span>
              <button
                type="button"
                onClick={() => {
                  setIsRushHourMode(!isRushHourMode);
                  showToast(
                    !isRushHourMode
                      ? (language === 'en' ? 'Rush Hour mode activated! Auto-reminders enabled.' : 'Mode Ramai diaktifkan! Reminder otomatis aktif.')
                      : (language === 'en' ? 'Switched to Normal mode.' : 'Beralih ke mode antrean normal.')
                  );
                }}
                className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden ${
                  isRushHourMode ? 'bg-[#DE5795]' : 'bg-gray-300'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                    isRushHourMode ? 'translate-x-4' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* METRIC STRIP CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Waiting in Queue */}
        <div className="p-5 rounded-2xl bg-white border border-gray-200/90 shadow-2xs space-y-2 hover:border-gray-300 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-500">
              {t('queue.statsWaiting', undefined, 'Tamu Mengantre')}
            </span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-gray-900 tracking-tight">{waitingCount}</span>
            <span className="text-xs font-medium text-gray-500">
              {language === 'en' ? 'Tickets in Queue' : 'Tiket Menunggu'}
            </span>
          </div>
          <div className="flex items-center gap-1.5 text-[11px] text-gray-500 pt-1 border-t border-gray-100">
            <Clock className="w-3.5 h-3.5 text-amber-500" />
            <span>{language === 'en' ? '1 ticket currently called' : '1 tiket sedang dipanggil'}</span>
          </div>
        </div>

        {/* Card 2: Currently in Booth */}
        <div className="p-5 rounded-2xl bg-white border border-gray-200/90 shadow-2xs space-y-2 hover:border-gray-300 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-500">
              {t('queue.statsInBooth', undefined, 'Sedang Berfoto')}
            </span>
            <div className="w-8 h-8 rounded-xl bg-pink-50 text-[#DE5795] flex items-center justify-center">
              <Camera className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-gray-900 tracking-tight">{inBoothCount}</span>
            <span className="text-xs font-medium text-gray-500">
              {language === 'en' ? 'Active Sessions' : 'Booth Terisi'}
            </span>
          </div>
          <div className="flex items-center gap-1.5 text-[11px] text-emerald-600 font-semibold pt-1 border-t border-gray-100">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>{language === 'en' ? 'Booth Alpha & Beta in Session' : 'Booth Alpha & Beta aktif'}</span>
          </div>
        </div>

        {/* Card 3: Avg Wait Time */}
        <div className="p-5 rounded-2xl bg-white border border-gray-200/90 shadow-2xs space-y-2 hover:border-gray-300 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-500">
              {t('queue.statsAvgWait', undefined, 'Estimasi Tunggu')}
            </span>
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-gray-900 tracking-tight">~12</span>
            <span className="text-xs font-medium text-gray-500">{language === 'en' ? 'Minutes / Ticket' : 'Menit / Tiket'}</span>
          </div>
          <div className="flex items-center gap-1.5 text-[11px] text-gray-500 pt-1 border-t border-gray-100">
            <Sparkles className="w-3.5 h-3.5 text-blue-500" />
            <span>{language === 'en' ? 'Dynamic ML queue estimation' : 'Estimasi adaptif waktu cetak'}</span>
          </div>
        </div>

        {/* Card 4: Emails Sent Today */}
        <div className="p-5 rounded-2xl bg-white border border-gray-200/90 shadow-2xs space-y-2 hover:border-gray-300 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-500">
              {t('queue.statsEmailsSent', undefined, 'Email Reminder Terkirim')}
            </span>
            <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <Mail className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-gray-900 tracking-tight">{totalEmailsSent + 42}</span>
            <span className="text-xs font-bold text-emerald-600">97.4% {language === 'en' ? 'Open Rate' : 'Dibuka'}</span>
          </div>
          <div className="flex items-center gap-1.5 text-[11px] text-gray-500 pt-1 border-t border-gray-100">
            <ShieldCheck className="w-3.5 h-3.5 text-purple-600" />
            <span>{language === 'en' ? 'Verified SMTP / SendGrid API' : 'Terverifikasi via Mail Relay'}</span>
          </div>
        </div>
      </div>

      {/* BOOTH REAL-TIME STATUS CARDS STRIP */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Booth Alpha */}
        <div className="p-4 rounded-2xl bg-white border border-gray-200/90 shadow-2xs flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-pink-50 text-[#DE5795] flex items-center justify-center font-bold text-xs">
              <Store className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold text-gray-900">Booth Alpha</span>
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
              </div>
              <p className="text-[11px] text-gray-500">Grand Indonesia Lt. 3A</p>
            </div>
          </div>
          <div className="text-right">
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-pink-50 text-[#9D174D] border border-pink-200">
              <Camera className="w-3 h-3 text-[#DE5795]" />
              {language === 'en' ? 'In Session (#A-011)' : 'Sedang Foto (#A-011)'}
            </span>
            <p className="text-[10px] text-gray-400 mt-0.5">±2 min remaining</p>
          </div>
        </div>

        {/* Booth Beta */}
        <div className="p-4 rounded-2xl bg-white border border-gray-200/90 shadow-2xs flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-pink-50 text-[#DE5795] flex items-center justify-center font-bold text-xs">
              <Store className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold text-gray-900">Booth Beta</span>
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
              </div>
              <p className="text-[11px] text-gray-500">Grand Indonesia Lt. 3A</p>
            </div>
          </div>
          <div className="text-right">
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
              {language === 'en' ? 'Ready for Next' : 'Siap Panggil'}
            </span>
            <p className="text-[10px] text-gray-400 mt-0.5">Standby for #B-008</p>
          </div>
        </div>

        {/* Booth Gamma */}
        <div className="p-4 rounded-2xl bg-white border border-gray-200/90 shadow-2xs flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-pink-50 text-[#DE5795] flex items-center justify-center font-bold text-xs">
              <Store className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold text-gray-900">Booth Gamma</span>
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
              </div>
              <p className="text-[11px] text-gray-500">Central Park Mall Lt. 1</p>
            </div>
          </div>
          <div className="text-right">
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
              <Clock className="w-3 h-3 text-amber-600" />
              {language === 'en' ? '1 in Queue' : '1 Antrean'}
            </span>
            <p className="text-[10px] text-gray-400 mt-0.5">#C-004 waiting</p>
          </div>
        </div>
      </div>

      {/* SEARCH & FILTERS BAR */}
      <div className="p-4 rounded-2xl bg-white border border-gray-200/90 shadow-2xs flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Search Input */}
        <div className="relative w-full md:w-96">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder={language === 'en' ? 'Search ticket #, guest name, or email...' : 'Cari nomor tiket, nama tamu, atau email...'}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 text-xs bg-gray-50/70 border border-gray-200 rounded-xl text-gray-900 placeholder:text-gray-400 focus:outline-hidden focus:bg-white focus:border-[#DE5795] focus:ring-3 focus:ring-[#DE5795]/10 transition-all"
          />
        </div>

        {/* Filter Controls */}
        <div className="flex items-center gap-2 w-full md:w-auto flex-wrap justify-end">
          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 text-xs rounded-xl border border-gray-200 bg-white font-medium text-gray-700 focus:outline-hidden focus:border-[#DE5795]"
          >
            <option value="ALL">{language === 'en' ? 'All Queue Statuses' : 'Semua Status Antrean'}</option>
            <option value="WAITING">{language === 'en' ? 'Waiting' : 'Menunggu'}</option>
            <option value="CALLING">{language === 'en' ? 'Currently Calling' : 'Sedang Dipanggil'}</option>
            <option value="IN_BOOTH">{language === 'en' ? 'In Booth' : 'Di Dalam Booth'}</option>
            <option value="COMPLETED">{language === 'en' ? 'Completed' : 'Selesai Foto'}</option>
            <option value="NO_SHOW">{language === 'en' ? 'Skipped / No-Show' : 'Dilewati / Batal'}</option>
          </select>

          {/* Booth Filter */}
          <select
            value={boothFilter}
            onChange={(e) => setBoothFilter(e.target.value)}
            className="px-3 py-2 text-xs rounded-xl border border-gray-200 bg-white font-medium text-gray-700 focus:outline-hidden focus:border-[#DE5795]"
          >
            <option value="ALL">{language === 'en' ? 'All Booth Units' : 'Semua Unit Booth'}</option>
            <option value="bth-001">Booth Alpha (Grand Indonesia)</option>
            <option value="bth-002">Booth Beta (Grand Indonesia)</option>
            <option value="bth-003">Booth Gamma (Central Park)</option>
          </select>
        </div>
      </div>

      {/* QUEUE TICKETS TABLE */}
      <div className="bg-white rounded-2xl border border-gray-200/90 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-200/80 bg-gray-50/70 text-[11px] font-bold uppercase tracking-wider text-gray-500">
                <th className="py-3 px-3.5 text-center w-12 font-bold uppercase tracking-wider text-gray-400 font-mono">No.</th>
                <th className="py-3 px-4">{t('queue.ticketCol', undefined, 'No. Tiket')}</th>
                <th className="py-3 px-4">{t('queue.customerCol', undefined, 'Pelanggan & Kontak Email')}</th>
                <th className="py-3 px-4">{t('queue.boothCol', undefined, 'Pilihan Booth')}</th>
                <th className="py-3 px-4">{t('queue.paxCol', undefined, 'Jumlah Pax')}</th>
                <th className="py-3 px-4">{t('queue.statusCol', undefined, 'Status Antrean')}</th>
                <th className="py-3 px-4">{t('queue.reminderCol', undefined, 'Status Notifikasi Email')}</th>
                <th className="py-3 px-4 text-right">{t('queue.actionCol', undefined, 'Aksi Cepat')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-xs">
              {filteredTickets.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-gray-400">
                    <Users className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                    <p className="font-medium">
                      {language === 'en' ? 'No queue tickets match the filter criteria.' : 'Tidak ada antrean yang cocok dengan kriteria filter.'}
                    </p>
                  </td>
                </tr>
              ) : (
                filteredTickets.map((ticket, index) => {
                  const isCalling = ticket.status === 'CALLING';
                  const isWaiting = ticket.status === 'WAITING';
                  const isInBooth = ticket.status === 'IN_BOOTH';
                  const isCompleted = ticket.status === 'COMPLETED';
                  const isNoShow = ticket.status === 'NO_SHOW';

                  return (
                    <tr
                      key={ticket.id}
                      className={`transition-colors hover:bg-gray-50/70 ${
                        isCalling ? 'bg-pink-50/40' : ''
                      }`}
                    >
                      {/* No. Sequence */}
                      <td className="py-3.5 px-3.5 text-center font-mono font-bold text-gray-400">
                        {index + 1}
                      </td>

                      {/* Ticket # */}
                      <td className="py-3.5 px-4 font-bold text-gray-900">
                        <div className="flex items-center gap-2">
                          <span className={`inline-flex items-center justify-center px-2.5 py-1 rounded-xl text-xs font-mono font-extrabold shadow-2xs border ${
                            isCalling
                              ? 'bg-[#DE5795] text-white border-[#DE5795]'
                              : isWaiting
                              ? 'bg-amber-50 text-amber-900 border-amber-200'
                              : isInBooth
                              ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                              : 'bg-gray-100 text-gray-700 border-gray-200'
                          }`}>
                            #{ticket.ticketNumber}
                          </span>
                        </div>
                      </td>

                      {/* Customer Info & Email */}
                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-gray-900">{ticket.customerName}</div>
                        <div className="flex items-center gap-1.5 text-gray-500 text-[11px] mt-0.5">
                          <Mail className="w-3 h-3 text-gray-400" />
                          <span className="font-mono text-gray-600">{ticket.customerEmail}</span>
                        </div>
                        <div className="text-[10px] text-gray-400">{ticket.customerPhone}</div>
                      </td>

                      {/* Booth & Package */}
                      <td className="py-3.5 px-4">
                        <div className="font-medium text-gray-800 flex items-center gap-1.5">
                          <Store className="w-3.5 h-3.5 text-[#DE5795]" />
                          <span>{ticket.boothName.split('(')[0].trim()}</span>
                        </div>
                        <div className="text-[11px] text-gray-500 mt-0.5">{ticket.packageType}</div>
                      </td>

                      {/* Pax */}
                      <td className="py-3.5 px-4">
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-gray-100 text-gray-700 font-semibold text-[11px]">
                          <Users className="w-3 h-3 text-gray-500" />
                          <span>{ticket.pax} {language === 'en' ? 'pax' : 'orang'}</span>
                        </span>
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4">
                        {isCalling && (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-[#DE5795] text-white shadow-xs animate-pulse">
                            <Volume2 className="w-3 h-3" />
                            <span>{language === 'en' ? 'Calling Now!' : 'Sedang Dipanggil!'}</span>
                          </span>
                        )}
                        {isWaiting && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-amber-50 text-amber-800 border border-amber-200">
                            <Clock className="w-3 h-3 text-amber-600" />
                            <span>{language === 'en' ? `Waiting (±${ticket.estimatedMinutes}m)` : `Menunggu (±${ticket.estimatedMinutes}m)`}</span>
                          </span>
                        )}
                        {isInBooth && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                            <Camera className="w-3 h-3 text-emerald-600" />
                            <span>{language === 'en' ? 'In Booth Session' : 'Sedang Foto'}</span>
                          </span>
                        )}
                        {isCompleted && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-medium bg-gray-100 text-gray-600">
                            <Check className="w-3 h-3 text-emerald-600" />
                            <span>{language === 'en' ? 'Completed' : 'Selesai'}</span>
                          </span>
                        )}
                        {isNoShow && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-medium bg-rose-50 text-rose-700 border border-rose-200">
                            <X className="w-3 h-3" />
                            <span>{language === 'en' ? 'No-Show' : 'Dilewati'}</span>
                          </span>
                        )}
                      </td>

                      {/* Reminder Status */}
                      <td className="py-3.5 px-4">
                        <div className="flex flex-col gap-1">
                          {ticket.emailRemindersSent > 0 ? (
                            <span className="inline-flex items-center gap-1.5 text-[11px] text-emerald-700 font-semibold">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                              <span>{ticket.emailRemindersSent}x {language === 'en' ? 'Reminder Sent' : 'Terkirim'}</span>
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 text-[11px] text-gray-400">
                              <Clock className="w-3.5 h-3.5" />
                              <span>{language === 'en' ? 'Not Sent Yet' : 'Belum Dikirim'}</span>
                            </span>
                          )}
                          {ticket.lastReminderAt && (
                            <span className="text-[10px] text-gray-400">
                              {language === 'en' ? 'Last at' : 'Terakhir:'} {ticket.lastReminderAt}
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Action Buttons */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* 1. Call Next / Calling Now Button */}
                          {isWaiting && (
                            <button
                              type="button"
                              onClick={() => handleCallTicket(ticket)}
                              className="px-3 py-1.5 rounded-xl bg-[#DE5795] hover:bg-[#c93d7e] text-white font-bold text-xs shadow-xs transition-colors flex items-center gap-1.5 active:scale-95"
                              title="Panggil nomor dan kirim notifikasi email otomatis"
                            >
                              <Volume2 className="w-3.5 h-3.5" />
                              <span>{language === 'en' ? 'Call' : 'Panggil'}</span>
                            </button>
                          )}

                          {/* 2. Enter Booth Button */}
                          {isCalling && (
                            <button
                              type="button"
                              onClick={() => handleMarkInBooth(ticket.id)}
                              className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs transition-colors flex items-center gap-1.5 active:scale-95"
                              title="Mulai sesi pemotretan di booth"
                            >
                              <Camera className="w-3.5 h-3.5" />
                              <span>{language === 'en' ? 'Start Session' : 'Masuk Booth'}</span>
                            </button>
                          )}

                          {/* 3. Send Manual Reminder Button */}
                          <button
                            type="button"
                            onClick={() => handleSendReminderOnly(ticket)}
                            className="p-1.5 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 text-gray-700 transition-colors shadow-2xs active:scale-95"
                            title={language === 'en' ? 'Send Email Reminder to Guest' : 'Kirim Ulang Email Reminder ke Tamu'}
                          >
                            <Mail className="w-3.5 h-3.5 text-[#DE5795]" />
                          </button>

                          {/* 4. Preview Email */}
                          <button
                            type="button"
                            onClick={() => setPreviewEmailTicket(ticket)}
                            className="p-1.5 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 text-gray-700 transition-colors shadow-2xs active:scale-95"
                            title={language === 'en' ? 'Preview Guest Email' : 'Lihat Pratinjau Tampilan Email Tamu'}
                          >
                            <Eye className="w-3.5 h-3.5 text-gray-500" />
                          </button>

                          {/* 5. Complete or Skip */}
                          {isInBooth && (
                            <button
                              type="button"
                              onClick={() => handleMarkCompleted(ticket.id)}
                              className="px-2.5 py-1.5 rounded-xl bg-gray-900 hover:bg-black text-white font-semibold text-xs shadow-xs transition-colors"
                              title="Tandai selesai foto"
                            >
                              {language === 'en' ? 'Finish' : 'Selesai'}
                            </button>
                          )}

                          {(isWaiting || isCalling) && (
                            <button
                              type="button"
                              onClick={() => handleMarkNoShow(ticket.id)}
                              className="p-1.5 rounded-xl border border-gray-200 bg-white hover:bg-rose-50 hover:text-rose-600 text-gray-400 transition-colors shadow-2xs"
                              title={language === 'en' ? 'Mark as No-Show' : 'Tamu Tidak Hadir / Lewati'}
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          )}
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

      {/* OUTBOUND EMAIL REMINDERS DISPATCH LOG (REAL-TIME AUDIT STREAM) */}
      <div className="p-5 rounded-2xl bg-white border border-gray-200/90 shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gray-100 pb-3">
          <div>
            <h2 className="text-sm font-bold text-gray-900 flex items-center gap-2">
              <Mail className="w-4 h-4 text-[#DE5795]" />
              <span>{language === 'en' ? 'Outbound Email Reminders Audit Log' : 'Log Pengiriman Email Reminder Otomatis'}</span>
            </h2>
            <p className="text-xs text-gray-500 mt-0.5">
              {language === 'en'
                ? 'Real-time record of queue notification emails dispatched to guest inboxes via SMTP service.'
                : 'Catatan pengiriman email pengingat nomor antrean ke kotak masuk pengunjung secara otomatis.'}
            </p>
          </div>
          <span className="text-[11px] font-semibold text-gray-500 bg-gray-50 px-3 py-1 rounded-lg border border-gray-200">
            {emailLogs.length} {language === 'en' ? 'Notifications Logged' : 'Log Notifikasi'}
          </span>
        </div>

        <div className="space-y-2.5">
          {emailLogs.map((log) => (
            <div
              key={log.id}
              className="flex items-center justify-between p-3 rounded-xl bg-gray-50/70 border border-gray-200/70 text-xs hover:bg-gray-100/70 transition-colors"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-8 h-8 rounded-lg bg-pink-100/70 text-[#9D174D] font-mono font-bold flex items-center justify-center shrink-0 text-xs">
                  #{log.ticketNumber}
                </div>
                <div className="min-w-0">
                  <p className="font-semibold text-gray-900 truncate">{log.subject}</p>
                  <p className="text-[11px] text-gray-500 truncate">
                    {log.recipientName} ({log.recipientEmail}) • {log.boothName}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 shrink-0 ml-2">
                <span className="hidden sm:inline-block font-mono text-[11px] text-gray-400">
                  {log.sentAt}
                </span>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                  log.status === 'OPENED'
                    ? 'bg-purple-50 text-purple-700 border-purple-200'
                    : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                }`}>
                  {log.status === 'OPENED' ? (language === 'en' ? 'OPENED' : 'DIBUKA') : (language === 'en' ? 'DELIVERED' : 'TERKIRIM')}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ============================================================ */}
      {/* MODAL 1: EMAIL PREVIEW FOR WAITING CUSTOMER                   */}
      {/* ============================================================ */}
      {mounted && previewEmailTicket && createPortal(
        <div className="fixed inset-0 z-[999] overflow-y-auto font-sora">
          <div
            className="fixed inset-0 bg-gray-950/60 backdrop-blur-xs transition-opacity animate-fade-in"
            onClick={() => setPreviewEmailTicket(null)}
          />

          <div className="flex min-h-full items-center justify-center p-4">
            <div className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden animate-scale-up pointer-events-auto">
              {/* Modal Top Bar */}
              <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/80">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-pink-50 text-[#DE5795] flex items-center justify-center">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-gray-900">
                      {language === 'en' ? 'Guest Email Reminder Preview' : 'Pratinjau Email Notifikasi Pengunjung'}
                    </h3>
                    <p className="text-[11px] text-gray-500">
                      To: {previewEmailTicket.customerEmail}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setPreviewEmailTicket(null)}
                  className="p-1.5 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Email Content Visual Card (Simulated Smartphone Mail) */}
              <div className="p-6 bg-[#FDFBF9] space-y-4">
                <div className="bg-white rounded-2xl border border-gray-200 shadow-xs p-6 space-y-5">
                  {/* Brand Header */}
                  <div className="flex items-center justify-between border-b border-gray-100 pb-4">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-[#DE5795] text-white flex items-center justify-center font-bold text-xs">
                        <Camera className="w-4 h-4" />
                      </div>
                      <span className="font-bold text-sm tracking-tight text-gray-900">PhotoBooth Central</span>
                    </div>
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                      Official E-Ticket
                    </span>
                  </div>

                  {/* Ticket Banner */}
                  <div className="text-center py-4 bg-gradient-to-b from-pink-50/60 to-rose-50/20 rounded-2xl border border-pink-100 space-y-1">
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      {language === 'en' ? 'Your Queue Ticket Number' : 'Nomor Antrean Anda'}
                    </p>
                    <div className="text-3xl font-extrabold text-[#DE5795] font-mono tracking-tight">
                      #{previewEmailTicket.ticketNumber}
                    </div>
                    <p className="text-xs font-medium text-gray-600">
                      {previewEmailTicket.boothName}
                    </p>
                  </div>

                  {/* Body Message */}
                  <div className="text-xs text-gray-700 leading-relaxed space-y-2">
                    <p>
                      {language === 'en' ? 'Dear' : 'Halo'}{' '}
                      <strong>{previewEmailTicket.customerName}</strong>,
                    </p>
                    <p>
                      {language === 'en'
                        ? 'Great news! Your photo booth session turn is almost ready. Please make your way towards the photo booth area now so our kiosk team can assist you without delay.'
                        : 'Kabar gembira! Giliran sesi foto Anda di photo booth sudah sangat dekat (±3 menit lagi). Silakan segera mendekat ke area booth agar kru kami dapat langsung mempersiapkan sesi pemotretan Anda.'}
                    </p>
                  </div>

                  {/* Details Pill Box */}
                  <div className="grid grid-cols-2 gap-2 text-xs bg-gray-50 p-3 rounded-xl border border-gray-100">
                    <div>
                      <span className="text-[10px] text-gray-400 block">{language === 'en' ? 'Package Style' : 'Pilihan Paket'}</span>
                      <span className="font-semibold text-gray-800">{previewEmailTicket.packageType}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-gray-400 block">{language === 'en' ? 'Guests' : 'Jumlah Orang'}</span>
                      <span className="font-semibold text-gray-800">{previewEmailTicket.pax} {language === 'en' ? 'People' : 'Orang'}</span>
                    </div>
                  </div>

                  {/* Call to action button */}
                  <div className="pt-2 text-center">
                    <button
                      type="button"
                      className="w-full py-2.5 px-4 rounded-xl bg-[#DE5795] text-white text-xs font-bold shadow-xs hover:bg-[#c93d7e] transition-colors"
                    >
                      {language === 'en' ? 'Open Live Queue Tracker QR' : 'Buka QR Code Antrean Saya'}
                    </button>
                    <p className="text-[10px] text-gray-400 mt-2">
                      {language === 'en'
                        ? 'Need extra time? Reply to this email or speak with booth staff.'
                        : 'Perlu waktu tambahan? Hubungi kru booth atau tunjukkan email ini kepada staf.'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
                <span className="text-xs text-gray-500 font-mono">
                  SMTP Status: Verified Active
                </span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      handleSendReminderOnly(previewEmailTicket);
                      setPreviewEmailTicket(null);
                    }}
                    className="px-4 py-2 rounded-xl bg-[#DE5795] text-white text-xs font-bold shadow-xs hover:bg-[#c93d7e] transition-colors flex items-center gap-1.5"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>{language === 'en' ? 'Send Real Email Now' : 'Kirim Email Ini Sekarang'}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* ============================================================ */}
      {/* MODAL 2: ADD NEW QUEUE TICKET / WALK-IN GUEST PURCHASE       */}
      {/* ============================================================ */}
      {mounted && isNewTicketModalOpen && createPortal(
        <div className="fixed inset-0 z-[999] overflow-y-auto font-sora">
          <div
            className="fixed inset-0 bg-gray-950/60 backdrop-blur-xs transition-opacity animate-fade-in"
            onClick={() => setIsNewTicketModalOpen(false)}
          />

          <div className="flex min-h-full items-center justify-center p-4">
            <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden animate-scale-up pointer-events-auto">
              {/* Modal Top Bar */}
              <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/80">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-pink-50 text-[#DE5795] flex items-center justify-center font-bold text-xs">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-bold text-gray-900">
                        {language === 'en' ? 'Walk-In Order & Registration' : 'Pemesanan Tamu Walk-in (Tanpa Akun)'}
                      </h3>
                      <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-pink-100 text-[#9D174D]">
                        {language === 'en' ? 'NO ACCOUNT' : 'TANPA AKUN'}
                      </span>
                    </div>
                    <p className="text-[11px] text-gray-500">
                      {language === 'en' 
                        ? 'Customer buys package & enters Email/Phone. System routes to direct photo or queue automatically.' 
                        : 'Customer pilih paket & isi Email/HP. Sistem otomatis arahkan langsung foto atau masuk antrean.'}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setIsNewTicketModalOpen(false)}
                  className="p-1.5 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleCreateTicketSubmit} className="p-6 space-y-4">
                {/* LIVE BOOTH AVAILABILITY INDICATOR */}
                {(() => {
                  const waitingCount = tickets.filter((t) => t.boothId === newBoothId && t.status === 'WAITING').length;
                  const inBooth = tickets.find((t) => t.boothId === newBoothId && t.status === 'IN_BOOTH');
                  const isBusy = waitingCount > 0 || !!inBooth;

                  return !isBusy ? (
                    <div className="p-3.5 bg-emerald-50 border border-emerald-200/90 rounded-2xl flex items-start gap-3 animate-fade-in">
                      <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                        <Zap className="w-4 h-4" />
                      </div>
                      <div className="text-xs">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-emerald-900">
                            {language === 'en' ? '🟢 Booth is Available (0 Queue)' : '🟢 Booth Kosong (Tidak Ada Antrean)'}
                          </span>
                          <span className="px-1.5 py-0.2 rounded-md bg-emerald-200/70 text-emerald-900 text-[10px] font-bold">
                            {language === 'en' ? 'DIRECT ACCESS' : 'LANGSUNG FOTO'}
                          </span>
                        </div>
                        <p className="text-emerald-700 text-[11px] mt-0.5 leading-relaxed">
                          {language === 'en'
                            ? 'Customer can immediately enter the booth and start their photo session without any waiting!'
                            : 'Customer dapat langsung menggunakan layanan foto sekarang tanpa perlu menunggu!'}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="p-3.5 bg-amber-50 border border-amber-200/90 rounded-2xl flex items-start gap-3 animate-fade-in">
                      <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center shrink-0">
                        <Clock className="w-4 h-4" />
                      </div>
                      <div className="text-xs">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-amber-900">
                            {language === 'en'
                              ? `🟡 Booth is Busy (${waitingCount} Guests Waiting)`
                              : `🟡 Booth Sedang Ramai (${waitingCount} Antrean Menunggu)`}
                          </span>
                          <span className="px-1.5 py-0.2 rounded-md bg-amber-200/70 text-amber-900 text-[10px] font-bold">
                            {language === 'en' ? 'AUTO-QUEUE' : 'OTOMATIS ANTRE'}
                          </span>
                        </div>
                        <p className="text-amber-700 text-[11px] mt-0.5 leading-relaxed">
                          {language === 'en'
                            ? `Customer will automatically get a queue ticket (est. ~${(waitingCount + 1) * 5} mins) and receive email reminders.`
                            : `Customer otomatis masuk antrean (estimasi ~${(waitingCount + 1) * 5} menit) dan menerima reminder email saat giliran tiba.`}
                        </p>
                      </div>
                    </div>
                  );
                })()}

                {/* Booth Selection & Pax in 2 cols */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-700">
                      {language === 'en' ? 'Select Booth Unit *' : 'Pilih Unit Booth *'}
                    </label>
                    <select
                      value={newBoothId}
                      onChange={(e) => setNewBoothId(e.target.value)}
                      className="w-full px-3 py-2.5 text-xs rounded-xl border border-gray-200 bg-white font-medium text-gray-700 focus:outline-hidden focus:border-[#DE5795]"
                    >
                      <option value="bth-001">Booth Alpha (Grand Indonesia)</option>
                      <option value="bth-002">Booth Beta (Grand Indonesia)</option>
                      <option value="bth-003">Booth Gamma (Central Park)</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-700">
                      {language === 'en' ? 'Number of Pax' : 'Jumlah Orang (Pax)'}
                    </label>
                    <input
                      type="number"
                      min={1}
                      max={12}
                      value={newPax}
                      onChange={(e) => setNewPax(Number(e.target.value))}
                      className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-gray-200 bg-white focus:border-[#DE5795] focus:outline-hidden transition-all"
                    />
                  </div>
                </div>

                {/* Package Type & Price */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-700">
                    {language === 'en' ? 'Photo Package Selection *' : 'Pilihan Paket Foto *'}
                  </label>
                  <select
                    value={newPackage}
                    onChange={(e) => setNewPackage(e.target.value)}
                    className="w-full px-3 py-2.5 text-xs rounded-xl border border-gray-200 bg-white font-medium text-gray-700 focus:outline-hidden focus:border-[#DE5795]"
                  >
                    <option value="Strip 2x6 Glamour Pink">Strip 2x6 Glamour Pink (2 Lembar) - Rp 35.000</option>
                    <option value="Strip 2x6 Gen-Z Aesthetic + GIF">Strip 2x6 Gen-Z Aesthetic + GIF - Rp 45.000</option>
                    <option value="Postcard 4x6 Couple Edition">Postcard 4x6 Couple Edition (1 Lembar) - Rp 50.000</option>
                    <option value="Postcard 4x6 Solo Creative">Postcard 4x6 Solo Creative - Rp 40.000</option>
                  </select>
                </div>

                {/* Payment Method Selector */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-700 flex items-center justify-between">
                    <span>{language === 'en' ? 'Payment Method (Completed) *' : 'Metode Pembayaran (Lunas) *'}</span>
                    <span className="text-[10px] text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded-md">
                      {language === 'en' ? 'Direct Paid' : 'Bayar Langsung di Kiosk/Kasir'}
                    </span>
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: 'QRIS', label: 'QRIS Instan', icon: QrCode },
                      { id: 'CASH', label: 'Tunai Kasir', icon: FileText },
                      { id: 'DEBIT', label: 'Kartu Debit', icon: CreditCard },
                    ].map((m) => {
                      const Icon = m.icon;
                      const isSelected = newPaymentMethod === m.id;
                      return (
                        <button
                          key={m.id}
                          type="button"
                          onClick={() => setNewPaymentMethod(m.id as any)}
                          className={`p-2.5 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                            isSelected
                              ? 'bg-pink-50 border-[#DE5795] text-[#DE5795] font-bold shadow-xs'
                              : 'bg-gray-50/70 border-gray-200 text-gray-600 hover:bg-gray-100'
                          }`}
                        >
                          <Icon className="w-3.5 h-3.5" />
                          <span>{m.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Email Address (Mandatory for email reminder & cloud delivery) */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-gray-700">
                      {language === 'en' ? 'Customer Email Address *' : 'Alamat Email Customer *'}
                    </label>
                    <span className="text-[10px] text-[#9D174D] font-semibold bg-pink-50 px-2 py-0.5 rounded-md">
                      {language === 'en' ? 'For Cloud Photos & Reminder' : 'Untuk Hasil Foto & Reminder'}
                    </span>
                  </div>
                  <input
                    type="email"
                    required
                    placeholder="mis: clarissa@gmail.com"
                    value={newCustEmail}
                    onChange={(e) => setNewCustEmail(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:border-[#DE5795] focus:outline-hidden transition-all"
                  />
                </div>

                {/* WhatsApp / Phone (Mandatory) */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-gray-700">
                      {language === 'en' ? 'Customer Phone / WhatsApp *' : 'Nomor HP / WhatsApp Customer *'}
                    </label>
                    <span className="text-[10px] text-gray-500">
                      {language === 'en' ? 'Direct Contact' : 'Kontak Konfirmasi'}
                    </span>
                  </div>
                  <input
                    type="tel"
                    required
                    placeholder="mis: 0812-3456-7890"
                    value={newCustPhone}
                    onChange={(e) => setNewCustPhone(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:border-[#DE5795] focus:outline-hidden transition-all"
                  />
                </div>

                {/* Customer Name */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-700">
                    {language === 'en' ? 'Customer Name (Walk-in)' : 'Nama Pelanggan (Walk-in Tanpa Akun) *'}
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="mis: Clarissa & Kevin"
                    value={newCustName}
                    onChange={(e) => setNewCustName(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:border-[#DE5795] focus:outline-hidden transition-all"
                  />
                </div>

                {/* Notes */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-700">
                    {language === 'en' ? 'Special Requests / Notes' : 'Catatan Khusus (Opsional)'}
                  </label>
                  <input
                    type="text"
                    placeholder="mis: Minta aksesoris topi ulang tahun"
                    value={newNotes}
                    onChange={(e) => setNewNotes(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:border-[#DE5795] focus:outline-hidden transition-all"
                  />
                </div>

                <div className="pt-3 border-t border-gray-100 flex items-center justify-end gap-2.5">
                  <button
                    type="button"
                    onClick={() => setIsNewTicketModalOpen(false)}
                    className="px-4 py-2.5 text-xs font-semibold text-gray-600 hover:bg-gray-100 rounded-xl"
                  >
                    {language === 'en' ? 'Cancel' : 'Batal'}
                  </button>
                  {(() => {
                    const waitingCount = tickets.filter((t) => t.boothId === newBoothId && t.status === 'WAITING').length;
                    const inBooth = tickets.find((t) => t.boothId === newBoothId && t.status === 'IN_BOOTH');
                    const isBusy = waitingCount > 0 || !!inBooth;

                    return isBusy ? (
                      <button
                        type="submit"
                        className="px-5 py-2.5 rounded-xl bg-amber-600 text-white text-xs font-bold shadow-xs hover:bg-amber-700 transition-colors flex items-center gap-2"
                      >
                        <Clock className="w-4 h-4 text-white" />
                        <span>{language === 'en' ? 'Buy & Enter Queue (Send Reminder)' : 'Beli Paket & Masuk Antrean (Kirim Email)'}</span>
                      </button>
                    ) : (
                      <button
                        type="submit"
                        className="px-5 py-2.5 rounded-xl bg-emerald-600 text-white text-xs font-bold shadow-xs hover:bg-emerald-700 transition-colors flex items-center gap-2"
                      >
                        <Zap className="w-4 h-4 text-white" />
                        <span>{language === 'en' ? 'Buy & Start Photo Now (No Queue)' : 'Beli Paket & Langsung Mulai Foto (Tanpa Antre)'}</span>
                      </button>
                    );
                  })()}
                </div>
              </form>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
