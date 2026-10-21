'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  CalendarDays,
  Plus,
  Search,
  Calendar,
  Clock,
  MapPin,
  Store,
  Layers,
  Printer,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Edit3,
  Trash2,
  X,
  Phone,
  Mail,
  Sparkles,
  Users,
  Check,
  Shield,
  Heart,
  Briefcase,
  Cake,
  Building2,
  PartyPopper,
} from 'lucide-react';

interface AllowedTemplate {
  id: string;
  name: string;
  layout: string;
  backgroundColor: string;
}

interface EventItem {
  id: string;
  name: string;
  type: 'WEDDING' | 'BIRTHDAY' | 'CORPORATE' | 'EXHIBITION' | 'GATHERING';
  clientName: string;
  clientPhone: string;
  clientEmail: string;
  venueName: string;
  venueAddress: string;
  date: string;
  startTime: string;
  endTime: string;
  durationHours: number;
  assignedBoothId: string;
  assignedBoothName: string;
  packageType: 'UNLIMITED' | 'QUOTA';
  printQuota: number; // 0 if UNLIMITED
  printsUsed: number;
  maxPrintPerSession: number;
  allowedTemplates: AllowedTemplate[];
  status: 'LIVE' | 'UPCOMING' | 'COMPLETED' | 'CANCELLED';
  notes?: string;
}

const AVAILABLE_TEMPLATES: AllowedTemplate[] = [
  { id: 'tmpl-001', name: 'Wedding Elegance Strip', layout: '2x6_strip', backgroundColor: '#DE5795' },
  { id: 'tmpl-002', name: 'Minimalist Duo Postcard', layout: '4x6_postcard', backgroundColor: '#ffffff' },
  { id: 'tmpl-003', name: 'Party Quad Grid 2x2', layout: '2x2_grid', backgroundColor: '#FCE7F1' },
  { id: 'tmpl-004', name: 'Sweet 17 Floral Polaroid', layout: 'polaroid', backgroundColor: '#FFF5F8' },
  { id: 'tmpl-005', name: 'Corporate Tech Summit', layout: '4x6_postcard', backgroundColor: '#F1F5F9' },
];

const AVAILABLE_BOOTHS = [
  { id: 'bth-001', name: 'Booth Alpha - Grand Indonesia' },
  { id: 'bth-002', name: 'Booth Beta - Central Park' },
  { id: 'bth-003', name: 'Booth Gamma - Paris Van Java' },
];

const INITIAL_EVENTS: EventItem[] = [
  {
    id: 'evt-001',
    name: 'The Wedding of Sarah & Dani',
    type: 'WEDDING',
    clientName: 'Sarah & Dani',
    clientPhone: '+62 812-9876-5432',
    clientEmail: 'sarah.dani.wedding@gmail.com',
    venueName: 'Grand Ballroom Hotel Mulia',
    venueAddress: 'Jl. Asia Afrika No.6, Senayan, Jakarta Pusat',
    date: '2026-10-20',
    startTime: '18:00',
    endTime: '22:00',
    durationHours: 4,
    assignedBoothId: 'bth-001',
    assignedBoothName: 'Booth Alpha - Grand Indonesia',
    packageType: 'QUOTA',
    printQuota: 400,
    printsUsed: 284,
    maxPrintPerSession: 2,
    allowedTemplates: [
      { id: 'tmpl-001', name: 'Wedding Elegance Strip', layout: '2x6_strip', backgroundColor: '#DE5795' },
      { id: 'tmpl-002', name: 'Minimalist Duo Postcard', layout: '4x6_postcard', backgroundColor: '#ffffff' },
    ],
    status: 'LIVE',
    notes: 'Prioritaskan frame rose magenta sesuai tema dekorasi pelaminan.',
  },
  {
    id: 'evt-002',
    name: 'Google Tech Summit Jakarta 2026',
    type: 'CORPORATE',
    clientName: 'Panitia Google Cloud ID',
    clientPhone: '+62 811-2233-4455',
    clientEmail: 'events@googlecloud.id',
    venueName: 'The Ritz-Carlton Pacific Place',
    venueAddress: 'SCBD Jl. Jenderal Sudirman Kav. 52-53, Jakarta Selatan',
    date: '2026-10-20',
    startTime: '09:00',
    endTime: '17:00',
    durationHours: 8,
    assignedBoothId: 'bth-002',
    assignedBoothName: 'Booth Beta - Central Park',
    packageType: 'UNLIMITED',
    printQuota: 0,
    printsUsed: 540,
    maxPrintPerSession: 2,
    allowedTemplates: [
      { id: 'tmpl-005', name: 'Corporate Tech Summit', layout: '4x6_postcard', backgroundColor: '#F1F5F9' },
      { id: 'tmpl-003', name: 'Party Quad Grid 2x2', layout: '2x2_grid', backgroundColor: '#FCE7F1' },
    ],
    status: 'LIVE',
    notes: 'Cetak logo Google Cloud di setiap footer layout foto.',
  },
  {
    id: 'evt-003',
    name: "Kayla's Sweet 17th Birthday",
    type: 'BIRTHDAY',
    clientName: 'Ibu Ratna (Mama Kayla)',
    clientPhone: '+62 818-0912-3344',
    clientEmail: 'ratna.kayla17@yahoo.com',
    venueName: 'Plataran Dharmawangsa',
    venueAddress: 'Jl. Dharmawangsa Raya No.6, Kebayoran Baru, Jakarta Selatan',
    date: '2026-10-21',
    startTime: '19:00',
    endTime: '23:00',
    durationHours: 4,
    assignedBoothId: 'bth-003',
    assignedBoothName: 'Booth Gamma - Paris Van Java',
    packageType: 'QUOTA',
    printQuota: 250,
    printsUsed: 0,
    maxPrintPerSession: 2,
    allowedTemplates: [
      { id: 'tmpl-004', name: 'Sweet 17 Floral Polaroid', layout: 'polaroid', backgroundColor: '#FFF5F8' },
      { id: 'tmpl-001', name: 'Wedding Elegance Strip', layout: '2x6_strip', backgroundColor: '#DE5795' },
    ],
    status: 'UPCOMING',
    notes: 'Tema pastel pink, sertakan stiker kacamata dan mahkota di booth.',
  },
  {
    id: 'evt-004',
    name: 'BCA Prioritas Executive Gathering',
    type: 'CORPORATE',
    clientName: 'BCA Corporate Marketing',
    clientPhone: '+62 813-7788-9900',
    clientEmail: 'prioritas.event@bca.co.id',
    venueName: 'Grand Ballroom Ayana Midplaza',
    venueAddress: 'Jl. Jenderal Sudirman Kav. 10-11, Karet Tengsin, Jakarta Pusat',
    date: '2026-10-24',
    startTime: '18:30',
    endTime: '21:30',
    durationHours: 3,
    assignedBoothId: 'bth-001',
    assignedBoothName: 'Booth Alpha - Grand Indonesia',
    packageType: 'UNLIMITED',
    printQuota: 0,
    printsUsed: 0,
    maxPrintPerSession: 2,
    allowedTemplates: [
      { id: 'tmpl-005', name: 'Corporate Tech Summit', layout: '4x6_postcard', backgroundColor: '#F1F5F9' },
    ],
    status: 'UPCOMING',
    notes: 'Gunakan frame biru emas elegan BCA Prioritas.',
  },
  {
    id: 'evt-005',
    name: 'The Wedding of Kevin & Michelle',
    type: 'WEDDING',
    clientName: 'Kevin & Michelle',
    clientPhone: '+62 821-4455-6677',
    clientEmail: 'kevin.michelle.2026@gmail.com',
    venueName: 'Four Seasons Hotel Jakarta',
    venueAddress: 'Capital Place, Jl. Jend. Gatot Subroto Kav. 18, Jakarta Selatan',
    date: '2026-10-28',
    startTime: '17:00',
    endTime: '22:00',
    durationHours: 5,
    assignedBoothId: 'bth-002',
    assignedBoothName: 'Booth Beta - Central Park',
    packageType: 'QUOTA',
    printQuota: 500,
    printsUsed: 0,
    maxPrintPerSession: 3,
    allowedTemplates: [
      { id: 'tmpl-001', name: 'Wedding Elegance Strip', layout: '2x6_strip', backgroundColor: '#DE5795' },
      { id: 'tmpl-002', name: 'Minimalist Duo Postcard', layout: '4x6_postcard', backgroundColor: '#ffffff' },
    ],
    status: 'UPCOMING',
  },
  {
    id: 'evt-006',
    name: 'Indonesia FinTech Innovation Expo 2026',
    type: 'EXHIBITION',
    clientName: 'Asosiasi Fintech Indonesia',
    clientPhone: '+62 817-6655-4433',
    clientEmail: 'expo@aftech.or.id',
    venueName: 'Hall B Jakarta Convention Center (JCC)',
    venueAddress: 'Jl. Gatot Subroto No.1, Gelora, Tanah Abang, Jakarta Pusat',
    date: '2026-10-18',
    startTime: '10:00',
    endTime: '19:00',
    durationHours: 9,
    assignedBoothId: 'bth-001',
    assignedBoothName: 'Booth Alpha - Grand Indonesia',
    packageType: 'QUOTA',
    printQuota: 700,
    printsUsed: 682,
    maxPrintPerSession: 1,
    allowedTemplates: [
      { id: 'tmpl-005', name: 'Corporate Tech Summit', layout: '4x6_postcard', backgroundColor: '#F1F5F9' },
    ],
    status: 'COMPLETED',
  },
];

export default function EventsPage() {
  const [events, setEvents] = useState<EventItem[]>(INITIAL_EVENTS);
  const [activeTab, setActiveTab] = useState<'ALL' | 'LIVE' | 'UPCOMING' | 'COMPLETED'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('ALL');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<EventItem | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Form State
  const [formName, setFormName] = useState('');
  const [formType, setFormType] = useState<EventItem['type']>('WEDDING');
  const [formClientName, setFormClientName] = useState('');
  const [formClientPhone, setFormClientPhone] = useState('');
  const [formClientEmail, setFormClientEmail] = useState('');
  const [formVenueName, setFormVenueName] = useState('');
  const [formVenueAddress, setFormVenueAddress] = useState('');
  const [formDate, setFormDate] = useState(new Date().toISOString().split('T')[0]);
  const [formStartTime, setFormStartTime] = useState('18:00');
  const [formEndTime, setFormEndTime] = useState('22:00');
  const [formBoothId, setFormBoothId] = useState('bth-001');
  const [formPackageType, setFormPackageType] = useState<'UNLIMITED' | 'QUOTA'>('QUOTA');
  const [formPrintQuota, setFormPrintQuota] = useState(300);
  const [formMaxPerSession, setFormMaxPerSession] = useState(2);
  const [formSelectedTemplateIds, setFormSelectedTemplateIds] = useState<string[]>(['tmpl-001']);
  const [formNotes, setFormNotes] = useState('');

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Metrics
  const metrics = useMemo(() => {
    const liveEvents = events.filter((e) => e.status === 'LIVE');
    const upcomingEvents = events.filter((e) => e.status === 'UPCOMING');
    const totalPrintsUsed = events.reduce((acc, curr) => acc + curr.printsUsed, 0);
    const assignedBoothsCount = new Set(events.filter((e) => e.status === 'LIVE').map((e) => e.assignedBoothId)).size;

    return {
      liveCount: liveEvents.length,
      upcomingCount: upcomingEvents.length,
      totalPrintsUsed,
      assignedBoothsCount,
    };
  }, [events]);

  // Filtered Events
  const filteredEvents = useMemo(() => {
    return events.filter((evt) => {
      // Tab
      const matchTab = activeTab === 'ALL' || evt.status === activeTab;

      // Type
      const matchType = selectedType === 'ALL' || evt.type === selectedType;

      // Search
      const q = searchQuery.toLowerCase();
      const matchSearch =
        evt.name.toLowerCase().includes(q) ||
        evt.clientName.toLowerCase().includes(q) ||
        evt.venueName.toLowerCase().includes(q) ||
        evt.clientPhone.toLowerCase().includes(q) ||
        evt.assignedBoothName.toLowerCase().includes(q);

      return matchTab && matchType && matchSearch;
    });
  }, [events, activeTab, selectedType, searchQuery]);

  const handleOpenAddModal = () => {
    setEditingEvent(null);
    setFormName('');
    setFormType('WEDDING');
    setFormClientName('');
    setFormClientPhone('');
    setFormClientEmail('');
    setFormVenueName('');
    setFormVenueAddress('');
    setFormDate(new Date().toISOString().split('T')[0]);
    setFormStartTime('18:00');
    setFormEndTime('22:00');
    setFormBoothId('bth-001');
    setFormPackageType('QUOTA');
    setFormPrintQuota(300);
    setFormMaxPerSession(2);
    setFormSelectedTemplateIds(['tmpl-001']);
    setFormNotes('');
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (evt: EventItem) => {
    setEditingEvent(evt);
    setFormName(evt.name);
    setFormType(evt.type);
    setFormClientName(evt.clientName);
    setFormClientPhone(evt.clientPhone);
    setFormClientEmail(evt.clientEmail);
    setFormVenueName(evt.venueName);
    setFormVenueAddress(evt.venueAddress);
    setFormDate(evt.date);
    setFormStartTime(evt.startTime);
    setFormEndTime(evt.endTime);
    setFormBoothId(evt.assignedBoothId);
    setFormPackageType(evt.packageType);
    setFormPrintQuota(evt.printQuota);
    setFormMaxPerSession(evt.maxPrintPerSession);
    setFormSelectedTemplateIds(evt.allowedTemplates.map((t) => t.id));
    setFormNotes(evt.notes || '');
    setIsModalOpen(true);
  };

  const handleToggleTemplate = (templateId: string) => {
    if (formSelectedTemplateIds.includes(templateId)) {
      if (formSelectedTemplateIds.length === 1) {
        showToast('Minimal 1 template harus dipilih untuk event ini');
        return;
      }
      setFormSelectedTemplateIds(formSelectedTemplateIds.filter((id) => id !== templateId));
    } else {
      setFormSelectedTemplateIds([...formSelectedTemplateIds, templateId]);
    }
  };

  const handleSaveEvent = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formName.trim() || !formClientName.trim() || !formVenueName.trim()) {
      showToast('Harap lengkapi nama event, nama klien, dan venue acara');
      return;
    }

    const boothObj = AVAILABLE_BOOTHS.find((b) => b.id === formBoothId) || AVAILABLE_BOOTHS[0];
    const selectedTemplateObjs = AVAILABLE_TEMPLATES.filter((t) => formSelectedTemplateIds.includes(t.id));

    // Calculate hours duration roughly
    const startHour = parseInt(formStartTime.split(':')[0] || '18');
    const endHour = parseInt(formEndTime.split(':')[0] || '22');
    const duration = Math.max(1, endHour - startHour);

    if (editingEvent) {
      // Update
      setEvents(
        events.map((evt) =>
          evt.id === editingEvent.id
            ? {
                ...evt,
                name: formName,
                type: formType,
                clientName: formClientName,
                clientPhone: formClientPhone,
                clientEmail: formClientEmail,
                venueName: formVenueName,
                venueAddress: formVenueAddress,
                date: formDate,
                startTime: formStartTime,
                endTime: formEndTime,
                durationHours: duration,
                assignedBoothId: boothObj.id,
                assignedBoothName: boothObj.name,
                packageType: formPackageType,
                printQuota: formPackageType === 'UNLIMITED' ? 0 : formPrintQuota,
                maxPrintPerSession: formMaxPerSession,
                allowedTemplates: selectedTemplateObjs,
                notes: formNotes,
              }
            : evt
        )
      );
      showToast(`Jadwal acara "${formName}" berhasil diperbarui!`);
    } else {
      // Create New
      const newEvt: EventItem = {
        id: `evt-${Math.random().toString(36).substring(2, 7)}`,
        name: formName,
        type: formType,
        clientName: formClientName,
        clientPhone: formClientPhone,
        clientEmail: formClientEmail,
        venueName: formVenueName,
        venueAddress: formVenueAddress,
        date: formDate,
        startTime: formStartTime,
        endTime: formEndTime,
        durationHours: duration,
        assignedBoothId: boothObj.id,
        assignedBoothName: boothObj.name,
        packageType: formPackageType,
        printQuota: formPackageType === 'UNLIMITED' ? 0 : formPrintQuota,
        printsUsed: 0,
        maxPrintPerSession: formMaxPerSession,
        allowedTemplates: selectedTemplateObjs,
        status: 'UPCOMING',
        notes: formNotes,
      };
      setEvents([newEvt, ...events]);
      showToast(`Event baru "${formName}" berhasil dijadwalkan!`);
    }

    setIsModalOpen(false);
  };

  const handleDeleteEvent = (id: string) => {
    setEvents(events.filter((e) => e.id !== id));
    setDeleteConfirmId(null);
    showToast('Event berhasil dihapus dari jadwal');
  };

  return (
    <div className="space-y-6 font-sora animate-fade-in text-gray-900 pb-16">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 px-4 py-3 rounded-xl bg-gray-900 text-white text-xs font-semibold shadow-2xl flex items-center gap-2 border border-gray-800 animate-slide-up">
          <CheckCircle2 className="w-4 h-4 text-[#DE5795]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Page Header - Untitled UI Standard */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-200 pb-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-pink-50 text-[#9D174D] border border-pink-200">
              <span className="w-1.5 h-1.5 rounded-full bg-[#DE5795]" />
              {events.length} Event Terdaftar
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-semibold text-gray-900 tracking-tight">
            Jadwal Acara & Event
          </h1>
          <p className="text-sm text-gray-600 mt-1">
            Kelola pemesanan acara klien, alokasikan unit booth, kunci template desain khusus, dan kontrol kuota lembar cetak.
          </p>
        </div>

        {/* Primary Action Button - Untitled UI Standard */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={handleOpenAddModal}
            className="px-4 py-2 text-sm font-semibold text-white bg-[#DE5795] hover:bg-[#c93d7e] rounded-lg shadow-xs transition-colors flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>Jadwalkan Event Baru</span>
          </button>
        </div>
      </div>

      {/* KPI Metrics Cards - Untitled UI Standard */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Metric 1: Live Today */}
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-xs hover:border-gray-300 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-600">Event Hari Ini</span>
            <div className="w-10 h-10 rounded-lg bg-pink-50 border border-pink-100 flex items-center justify-center text-[#DE5795]">
              <CalendarDays className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline justify-between">
            <h3 className="text-3xl font-semibold text-gray-900 tracking-tight">
              {metrics.liveCount} <span className="text-lg font-normal text-gray-500">Acara</span>
            </h3>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-pink-50 text-[#9D174D] border border-pink-200 animate-pulse">
              Sedang Live
            </span>
          </div>
          <div className="mt-3 text-xs text-gray-500">
            Hotel Mulia & Ritz-Carlton
          </div>
        </div>

        {/* Metric 2: Upcoming */}
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-xs hover:border-gray-300 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-600">Event Mendatang</span>
            <div className="w-10 h-10 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-700">
              <Clock className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline justify-between">
            <h3 className="text-3xl font-semibold text-gray-900 tracking-tight">
              {metrics.upcomingCount} <span className="text-lg font-normal text-gray-500">Acara</span>
            </h3>
          </div>
          <div className="mt-3 text-xs text-gray-500">
            Terjadwal dalam 14 hari ke depan
          </div>
        </div>

        {/* Metric 3: Prints Used */}
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-xs hover:border-gray-300 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-600">Total Foto Tercetak</span>
            <div className="w-10 h-10 rounded-lg bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-700">
              <Printer className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline justify-between">
            <h3 className="text-3xl font-semibold text-gray-900 tracking-tight">
              {metrics.totalPrintsUsed.toLocaleString('id-ID')} <span className="text-lg font-normal text-gray-500">Lembar</span>
            </h3>
          </div>
          <div className="mt-3 flex items-center gap-1.5 text-xs text-emerald-700 font-medium">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Konsumsi kuota stabil & terkontrol</span>
          </div>
        </div>

        {/* Metric 4: Assigned Booths */}
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-xs hover:border-gray-300 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-600">Unit Booth Terjadwal</span>
            <div className="w-10 h-10 rounded-lg bg-purple-50 border border-purple-100 flex items-center justify-center text-purple-700">
              <Store className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline justify-between">
            <h3 className="text-3xl font-semibold text-gray-900 tracking-tight">
              {metrics.assignedBoothsCount} / {AVAILABLE_BOOTHS.length} <span className="text-lg font-normal text-gray-500">Unit</span>
            </h3>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
              100% Siaga
            </span>
          </div>
          <div className="mt-3 text-xs text-gray-500">
            Semua unit telah teralokasi
          </div>
        </div>
      </div>

      {/* Filter Tabs & Search Bar - Untitled UI Standard */}
      <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Status Tabs - Segmented Button Group */}
          <div className="p-1 bg-gray-50 border border-gray-200 rounded-lg inline-flex items-center gap-1 overflow-x-auto">
            {[
              { id: 'ALL', label: 'Semua Event', count: events.length },
              { id: 'LIVE', label: 'Sedang Berlangsung', count: events.filter((e) => e.status === 'LIVE').length },
              { id: 'UPCOMING', label: 'Mendatang', count: events.filter((e) => e.status === 'UPCOMING').length },
              { id: 'COMPLETED', label: 'Selesai', count: events.filter((e) => e.status === 'COMPLETED').length },
            ].map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all whitespace-nowrap flex items-center gap-1.5 ${
                    isActive
                      ? 'bg-white text-gray-900 shadow-xs border border-gray-200/50'
                      : 'text-gray-500 hover:text-gray-900'
                  }`}
                >
                  <span>{tab.label}</span>
                  <span
                    className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                      isActive ? 'bg-pink-50 text-[#9D174D]' : 'bg-gray-200/70 text-gray-600'
                    }`}
                  >
                    {tab.count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Search Box - Untitled UI Standard */}
          <div className="relative flex-1 max-w-sm">
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Cari event, klien, atau venue..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm bg-white border border-gray-300 rounded-lg placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#DE5795]/20 focus:border-[#DE5795] shadow-xs"
            />
          </div>
        </div>

        {/* Category Filters */}
        <div className="flex items-center gap-1.5 pt-3 border-t border-gray-200 text-xs overflow-x-auto">
          <span className="text-xs font-medium text-gray-500 mr-2">Kategori:</span>
          {[
            { id: 'ALL', label: 'Semua Kategori' },
            { id: 'WEDDING', label: 'Wedding' },
            { id: 'BIRTHDAY', label: 'Birthday' },
            { id: 'CORPORATE', label: 'Corporate' },
            { id: 'EXHIBITION', label: 'Exhibition' },
          ].map((cat) => {
            const isCatActive = selectedType === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedType(cat.id)}
                className={`px-2.5 py-1 rounded-md text-xs font-medium transition ${
                  isCatActive
                    ? 'bg-gray-900 text-white shadow-xs'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Events Grid Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredEvents.length === 0 ? (
          <div className="col-span-full p-12 text-center rounded-2xl bg-white border border-dashed border-gray-200">
            <CalendarDays className="w-10 h-10 text-gray-300 mx-auto mb-2" />
            <h4 className="text-sm font-bold text-gray-700">Tidak ada jadwal acara ditemukan</h4>
            <p className="text-xs text-gray-400 mt-1">Coba ubah kata kunci pencarian atau filter status acara.</p>
          </div>
        ) : (
          filteredEvents.map((evt) => {
            const quotaPercent =
              evt.packageType === 'QUOTA' && evt.printQuota > 0
                ? Math.min(100, Math.round((evt.printsUsed / evt.printQuota) * 100))
                : 0;

            return (
              <div
                key={evt.id}
                className={`rounded-2xl bg-white border transition-all duration-200 shadow-xs flex flex-col justify-between overflow-hidden group hover:shadow-md ${
                  evt.status === 'LIVE'
                    ? 'border-[#DE5795]/60 ring-2 ring-[#DE5795]/15'
                    : 'border-gray-200/90 hover:border-gray-300'
                }`}
              >
                {/* Card Header Strip */}
                <div className="p-5 pb-3 space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex flex-wrap items-center gap-1.5">
                      {/* Type Badge */}
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-gray-100 text-gray-700 border border-gray-200">
                        {evt.type === 'WEDDING' && <Heart className="w-3 h-3 text-[#DE5795]" />}
                        {evt.type === 'BIRTHDAY' && <Cake className="w-3 h-3 text-amber-500" />}
                        {evt.type === 'CORPORATE' && <Briefcase className="w-3 h-3 text-blue-600" />}
                        {evt.type === 'EXHIBITION' && <Building2 className="w-3 h-3 text-purple-600" />}
                        <span>{evt.type}</span>
                      </span>

                      {/* Status Badge */}
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                          evt.status === 'LIVE'
                            ? 'bg-[#DE5795]/15 text-[#9D174D] border-[#DE5795]/30'
                            : evt.status === 'UPCOMING'
                            ? 'bg-blue-50 text-blue-700 border-blue-200'
                            : 'bg-gray-100 text-gray-600 border-gray-200'
                        }`}
                      >
                        {evt.status === 'LIVE' && <span className="w-1.5 h-1.5 rounded-full bg-[#DE5795] animate-pulse" />}
                        <span>{evt.status === 'LIVE' ? 'Sedang Berlangsung' : evt.status === 'UPCOMING' ? 'Mendatang' : 'Selesai'}</span>
                      </span>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleOpenEditModal(evt)}
                        className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition"
                        title="Edit Acara"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => setDeleteConfirmId(evt.id)}
                        className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition"
                        title="Hapus Acara"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Title & Client */}
                  <div>
                    <h3 className="text-base font-bold text-gray-900 group-hover:text-[#DE5795] transition-colors leading-snug">
                      {evt.name}
                    </h3>
                    <p className="text-xs text-gray-500 mt-0.5">Klien: <strong className="text-gray-800">{evt.clientName}</strong></p>
                  </div>
                </div>

                {/* Card Middle: Date, Venue, Booth */}
                <div className="px-5 py-3 bg-gray-50/70 border-y border-gray-100 space-y-2 text-xs">
                  {/* Date & Time */}
                  <div className="flex items-center gap-2 text-gray-700">
                    <Calendar className="w-3.5 h-3.5 text-[#DE5795] shrink-0" />
                    <span>
                      {new Date(evt.date).toLocaleDateString('id-ID', {
                        weekday: 'short',
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </span>
                    <span className="text-gray-300">•</span>
                    <Clock className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                    <span className="font-mono text-[11px]">
                      {evt.startTime} - {evt.endTime} ({evt.durationHours} Jam)
                    </span>
                  </div>

                  {/* Venue */}
                  <div className="flex items-start gap-2 text-gray-600">
                    <MapPin className="w-3.5 h-3.5 text-gray-400 shrink-0 mt-0.5" />
                    <span className="truncate" title={evt.venueAddress}>
                      {evt.venueName}
                    </span>
                  </div>

                  {/* Booth Allocated */}
                  <div className="flex items-center gap-2 text-gray-600">
                    <Store className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                    <span className="font-semibold text-gray-800">{evt.assignedBoothName}</span>
                  </div>
                </div>

                {/* Card Lower: Locked Templates & Quota */}
                <div className="p-5 pt-3 space-y-3 text-xs">
                  {/* Locked Templates Badges */}
                  <div>
                    <div className="flex items-center justify-between text-[11px] font-semibold text-gray-500 mb-1.5">
                      <span>Template Desain Terkunci ({evt.allowedTemplates.length})</span>
                      <span className="text-[10px] text-gray-400">Kios terkunci</span>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {evt.allowedTemplates.map((tmpl) => (
                        <span
                          key={tmpl.id}
                          className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[10px] font-semibold bg-white border border-gray-200 text-gray-700 shadow-2xs"
                        >
                          <span
                            className="w-2 h-2 rounded-full border border-gray-300"
                            style={{ backgroundColor: tmpl.backgroundColor }}
                          />
                          <span className="truncate max-w-[130px]">{tmpl.name}</span>
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Print Quota Progress */}
                  <div className="space-y-1 pt-1">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-gray-500">Kuota Cetak Fisik</span>
                      {evt.packageType === 'UNLIMITED' ? (
                        <span className="font-bold text-emerald-700 font-mono">
                          Unlimited ({evt.printsUsed} Lembar)
                        </span>
                      ) : (
                        <span className="font-bold font-mono text-gray-800">
                          {evt.printsUsed} / {evt.printQuota} Lembar ({quotaPercent}%)
                        </span>
                      )}
                    </div>
                    <div className="w-full h-2 rounded-full bg-gray-100 overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          evt.packageType === 'UNLIMITED'
                            ? 'bg-emerald-500'
                            : quotaPercent > 90
                            ? 'bg-amber-500'
                            : 'bg-[#DE5795]'
                        }`}
                        style={{ width: `${evt.packageType === 'UNLIMITED' ? 100 : quotaPercent}%` }}
                      />
                    </div>
                  </div>

                  {/* Card Action Link */}
                  <div className="pt-2 flex items-center justify-between border-t border-gray-100">
                    <a
                      href={`https://wa.me/${evt.clientPhone.replace(/[^0-9]/g, '')}`}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-emerald-700 hover:text-emerald-800"
                    >
                      <Phone className="w-3.5 h-3.5" />
                      <span>Chat WhatsApp</span>
                    </a>

                    <Link
                      href="/sessions/booth"
                      target="_blank"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg bg-[#DE5795]/15 text-[#9D174D] hover:bg-[#DE5795] hover:text-white transition-colors border border-[#DE5795]/30"
                    >
                      <span>Buka Kios Acara</span>
                      <ExternalLink className="w-3 h-3" />
                    </Link>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* ============================================================ */}
      {/* MODAL: TAMBAH / EDIT EVENT                                   */}
      {/* ============================================================ */}
      {/* ============================================================ */}
      {/* DRAWER: TAMBAH / EDIT EVENT (MODERN SLIDE-OVER)               */}
      {/* ============================================================ */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden font-sora">
          {/* Backdrop with smooth blur */}
          <div
            className="fixed inset-0 bg-gray-950/45 backdrop-blur-xs transition-opacity animate-fade-in"
            onClick={() => setIsModalOpen(false)}
          />

          <div className="fixed inset-y-0 right-0 max-w-full flex pl-6 sm:pl-10 p-3 sm:p-4 pointer-events-none">
            <div className="w-screen max-w-2xl bg-white shadow-2xl border border-gray-200/90 rounded-3xl flex flex-col animate-slide-left overflow-hidden ring-1 ring-black/10 pointer-events-auto">
              {/* Drawer Header (Ref: Modern SaaS Floating Drawer) */}
              <div className="px-7 pt-6 pb-5.5 border-b border-gray-200/80 flex items-center justify-between bg-white/95 backdrop-blur-md shrink-0 sticky top-0 z-20 shadow-2xs">
                <div className="flex items-center gap-4 min-w-0">
                  <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-pink-500/15 to-[#DE5795]/20 border border-[#DE5795]/30 flex items-center justify-center text-[#9D174D] shadow-xs shrink-0">
                    <CalendarDays className="w-5 h-5 text-[#DE5795]" />
                  </div>
                  <div className="min-w-0 pr-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-base font-bold text-gray-900 leading-tight">
                        {editingEvent ? 'Edit Jadwal Acara' : 'Jadwalkan Event Baru'}
                      </h3>
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border shadow-2xs ${
                        editingEvent ? 'bg-amber-50 text-amber-800 border-amber-200' : 'bg-pink-50 text-[#9D174D] border-pink-200'
                      }`}>
                        {editingEvent ? 'Mode Edit' : 'Draft Baru'}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1 truncate">
                      Konfigurasi unit booth, kuota cetak, dan template foto khusus acara
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="w-9 h-9 rounded-xl text-gray-400 hover:text-gray-700 hover:bg-gray-100 border border-gray-200/80 transition-all flex items-center justify-center shrink-0 ml-4 shadow-2xs"
                  title="Tutup (Esc)"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Drawer Form */}
              <form onSubmit={handleSaveEvent} className="flex-1 flex flex-col min-h-0">
                {/* Scrollable Form Body */}
                <div className="px-7 py-6 overflow-y-auto flex-1 space-y-6 text-xs">

                  {/* SECTION 1: KATEGORI & NAMA ACARA */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold text-gray-700 uppercase tracking-wider flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-[#DE5795]" />
                        1. Identitas & Kategori Acara
                      </span>
                      <span className="text-[11px] text-gray-400">* Wajib diisi</span>
                    </div>

                    {/* Category Segmented Buttons */}
                    <div>
                      <label className="text-[11px] font-semibold text-gray-600 block mb-1.5">Pilih Kategori Event:</label>
                      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                        {[
                          { id: 'WEDDING', label: 'Wedding', icon: Heart, desc: 'Pernikahan' },
                          { id: 'BIRTHDAY', label: 'Birthday', icon: Cake, desc: 'Ulang Tahun' },
                          { id: 'CORPORATE', label: 'Corporate', icon: Briefcase, desc: 'Perusahaan' },
                          { id: 'EXHIBITION', label: 'Exhibition', icon: Building2, desc: 'Pameran' },
                          { id: 'GATHERING', label: 'Gathering', icon: PartyPopper, desc: 'Komunitas' },
                        ].map((cat) => {
                          const Icon = cat.icon;
                          const isSelected = formType === cat.id;
                          return (
                            <button
                              key={cat.id}
                              type="button"
                              onClick={() => setFormType(cat.id as any)}
                              className={`p-2.5 rounded-xl border-2 text-center flex flex-col items-center justify-center gap-1 transition-all ${
                                isSelected
                                  ? 'border-[#DE5795] bg-[#DE5795]/10 text-[#9D174D] font-bold shadow-xs ring-1 ring-[#DE5795]/30'
                                  : 'border-gray-200 bg-white hover:bg-gray-50 text-gray-700'
                              }`}
                            >
                              <Icon className={`w-4 h-4 ${isSelected ? 'text-[#DE5795]' : 'text-gray-400'}`} />
                              <span className="text-[11px] font-semibold">{cat.label}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Event Name Input */}
                    <div className="space-y-1">
                      <label className="font-semibold text-gray-700 block">Nama Acara / Event *</label>
                      <input
                        type="text"
                        required
                        placeholder="Contoh: The Wedding of Sarah & Dani"
                        value={formName}
                        onChange={(e) => setFormName(e.target.value)}
                        className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-gray-200 focus:outline-hidden focus:border-[#DE5795] focus:ring-2 focus:ring-[#DE5795]/20 bg-white"
                      />
                    </div>
                  </div>

                  {/* SECTION 2: INFORMASI KONTAK KLIEN */}
                  <div className="p-4 rounded-2xl bg-gray-50/70 border border-gray-200/80 space-y-3.5">
                    <span className="text-[11px] font-bold text-gray-700 uppercase tracking-wider flex items-center gap-1.5">
                      <Users className="w-3.5 h-3.5 text-[#DE5795]" />
                      2. Kontak Klien & Penanggung Jawab
                    </span>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div className="space-y-1">
                        <label className="text-gray-600 font-semibold flex items-center gap-1">
                          Nama Klien / PIC *
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="Sarah Wijaya"
                          value={formClientName}
                          onChange={(e) => setFormClientName(e.target.value)}
                          className="w-full px-3 py-2 text-xs rounded-xl border border-gray-200 bg-white focus:outline-hidden focus:border-[#DE5795]"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-gray-600 font-semibold flex items-center gap-1">
                          <Phone className="w-3 h-3 text-[#DE5795]" /> No. WhatsApp *
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="+62 812-xxxx-xxxx"
                          value={formClientPhone}
                          onChange={(e) => setFormClientPhone(e.target.value)}
                          className="w-full px-3 py-2 text-xs rounded-xl border border-gray-200 bg-white focus:outline-hidden focus:border-[#DE5795]"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-gray-600 font-semibold flex items-center gap-1">
                          <Mail className="w-3 h-3 text-gray-400" /> Email Klien
                        </label>
                        <input
                          type="email"
                          placeholder="sarah@example.com"
                          value={formClientEmail}
                          onChange={(e) => setFormClientEmail(e.target.value)}
                          className="w-full px-3 py-2 text-xs rounded-xl border border-gray-200 bg-white focus:outline-hidden focus:border-[#DE5795]"
                        />
                      </div>
                    </div>
                  </div>

                  {/* SECTION 3: WAKTU SEWA & LOKASI VENUE */}
                  <div className="space-y-3.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold text-gray-700 uppercase tracking-wider flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-[#DE5795]" />
                        3. Jadwal Sewa & Lokasi Acara
                      </span>
                      {/* Dynamic Duration Badge */}
                      {formStartTime && formEndTime && (
                        <span className="px-2.5 py-0.5 rounded-full bg-[#DE5795]/15 text-[#9D174D] font-mono font-bold text-[10px] flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          Durasi: {(() => {
                            const [sh, sm] = formStartTime.split(':').map(Number);
                            const [eh, em] = formEndTime.split(':').map(Number);
                            let min = (eh * 60 + em) - (sh * 60 + sm);
                            if (min <= 0) min += 24 * 60;
                            const h = Math.floor(min / 60);
                            const m = min % 60;
                            return m > 0 ? `${h} Jam ${m} Mnt` : `${h} Jam`;
                          })()}
                        </span>
                      )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div className="space-y-1">
                        <label className="font-semibold text-gray-700 flex items-center gap-1">
                          <Calendar className="w-3 h-3 text-gray-400" /> Tanggal Acara *
                        </label>
                        <input
                          type="date"
                          required
                          value={formDate}
                          onChange={(e) => setFormDate(e.target.value)}
                          className="w-full px-3 py-2 text-xs rounded-xl border border-gray-200 focus:outline-hidden focus:border-[#DE5795]"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="font-semibold text-gray-700 block">Jam Mulai *</label>
                        <input
                          type="time"
                          required
                          value={formStartTime}
                          onChange={(e) => setFormStartTime(e.target.value)}
                          className="w-full px-3 py-2 text-xs rounded-xl border border-gray-200 focus:outline-hidden focus:border-[#DE5795]"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="font-semibold text-gray-700 block">Jam Selesai *</label>
                        <input
                          type="time"
                          required
                          value={formEndTime}
                          onChange={(e) => setFormEndTime(e.target.value)}
                          className="w-full px-3 py-2 text-xs rounded-xl border border-gray-200 focus:outline-hidden focus:border-[#DE5795]"
                        />
                      </div>
                    </div>

                    {/* Venue & Address */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="font-semibold text-gray-700 flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-[#DE5795]" /> Nama Gedung / Ballroom *
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="Grand Ballroom Hotel Mulia Senayan"
                          value={formVenueName}
                          onChange={(e) => setFormVenueName(e.target.value)}
                          className="w-full px-3.5 py-2 text-xs rounded-xl border border-gray-200 focus:outline-hidden focus:border-[#DE5795]"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="font-semibold text-gray-700 block">Alamat Singkat Venue</label>
                        <input
                          type="text"
                          placeholder="Jl. Asia Afrika No.6, Senayan, Jakarta"
                          value={formVenueAddress}
                          onChange={(e) => setFormVenueAddress(e.target.value)}
                          className="w-full px-3.5 py-2 text-xs rounded-xl border border-gray-200 focus:outline-hidden focus:border-[#DE5795]"
                        />
                      </div>
                    </div>
                  </div>

                  {/* SECTION 4: ALOKASI BOOTH & PAKET CETAK */}
                  <div className="p-4 rounded-2xl bg-gray-50/70 border border-gray-200/80 space-y-4">
                    <span className="text-[11px] font-bold text-gray-700 uppercase tracking-wider flex items-center gap-1.5">
                      <Printer className="w-3.5 h-3.5 text-[#DE5795]" />
                      4. Alokasi Booth & Paket Cetak Foto
                    </span>

                    {/* Booth Picker */}
                    <div className="space-y-1.5">
                      <label className="font-semibold text-gray-700 block">Pilih Mesin Photo Booth Siaga *</label>
                      <select
                        value={formBoothId}
                        onChange={(e) => setFormBoothId(e.target.value)}
                        className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-gray-200 bg-white font-medium focus:outline-hidden focus:border-[#DE5795]"
                      >
                        {AVAILABLE_BOOTHS.map((b) => (
                          <option key={b.id} value={b.id}>
                            {b.name} ({b.id})
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Package Type Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div
                        onClick={() => setFormPackageType('QUOTA')}
                        className={`p-3.5 rounded-xl border-2 cursor-pointer transition-all flex items-start gap-3 ${
                          formPackageType === 'QUOTA'
                            ? 'border-[#DE5795] bg-white ring-2 ring-[#DE5795]/15 shadow-xs'
                            : 'border-gray-200 bg-white/70 hover:bg-white'
                        }`}
                      >
                        <input
                          type="radio"
                          name="packageType"
                          checked={formPackageType === 'QUOTA'}
                          onChange={() => setFormPackageType('QUOTA')}
                          className="mt-0.5 text-[#DE5795] accent-[#DE5795]"
                        />
                        <div>
                          <span className="font-bold text-gray-900 block">Paket Kuota Lembar</span>
                          <span className="text-[11px] text-gray-500 block mt-0.5">
                            Cetak dibatasi jumlah kuota sewa. Cocok untuk event budget terukur.
                          </span>
                        </div>
                      </div>

                      <div
                        onClick={() => setFormPackageType('UNLIMITED')}
                        className={`p-3.5 rounded-xl border-2 cursor-pointer transition-all flex items-start gap-3 ${
                          formPackageType === 'UNLIMITED'
                            ? 'border-[#DE5795] bg-white ring-2 ring-[#DE5795]/15 shadow-xs'
                            : 'border-gray-200 bg-white/70 hover:bg-white'
                        }`}
                      >
                        <input
                          type="radio"
                          name="packageType"
                          checked={formPackageType === 'UNLIMITED'}
                          onChange={() => setFormPackageType('UNLIMITED')}
                          className="mt-0.5 text-[#DE5795] accent-[#DE5795]"
                        />
                        <div>
                          <span className="font-bold text-gray-900 block">Paket Unlimited Cetak</span>
                          <span className="text-[11px] text-gray-500 block mt-0.5">
                            Cetak sepuasnya tanpa batas lembar selama jam operasional event.
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Quota Stepper if QUOTA package is selected */}
                    {formPackageType === 'QUOTA' && (
                      <div className="p-3 bg-white rounded-xl border border-gray-200 space-y-2.5">
                        <div className="flex items-center justify-between">
                          <label className="text-gray-700 font-semibold">Batas Kuota Lembar Cetak</label>
                          <div className="flex items-center gap-1.5">
                            {[150, 300, 500, 700].map((preset) => (
                              <button
                                key={preset}
                                type="button"
                                onClick={() => setFormPrintQuota(preset)}
                                className={`px-2 py-0.5 rounded-md text-[10px] font-mono font-bold transition-colors ${
                                  formPrintQuota === preset
                                    ? 'bg-[#DE5795] text-white'
                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                }`}
                              >
                                {preset}
                              </button>
                            ))}
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <div className="space-y-1">
                            <span className="text-[10px] text-gray-500 block">Input Jumlah Lembar:</span>
                            <input
                              type="number"
                              min={50}
                              max={3000}
                              step={25}
                              value={formPrintQuota}
                              onChange={(e) => setFormPrintQuota(parseInt(e.target.value) || 100)}
                              className="w-full px-3 py-1.5 text-xs rounded-lg border border-gray-200 bg-white font-mono font-bold text-gray-900 focus:outline-hidden focus:border-[#DE5795]"
                            />
                          </div>
                          <div className="space-y-1">
                            <span className="text-[10px] text-gray-500 block">Maksimal Cetak per Tamu:</span>
                            <select
                              value={formMaxPerSession}
                              onChange={(e) => setFormMaxPerSession(parseInt(e.target.value))}
                              className="w-full px-3 py-1.5 text-xs rounded-lg border border-gray-200 bg-white font-medium"
                            >
                              <option value={1}>1 Lembar Cetak</option>
                              <option value={2}>2 Lembar (Standar Strip)</option>
                              <option value={3}>3 Lembar</option>
                              <option value={4}>4 Lembar (Grup)</option>
                            </select>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* SECTION 5: CHECKLIST TEMPLATE KHUSUS ACARA */}
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-[11px] font-bold text-gray-700 uppercase tracking-wider flex items-center gap-1.5">
                          <Layers className="w-3.5 h-3.5 text-[#DE5795]" />
                          5. Checklist Template Desain Khusus Acara
                        </span>
                        <p className="text-[11px] text-gray-500 mt-0.5">
                          Hanya template terpilih yang akan muncul di layar touchscreen booth bagi para tamu.
                        </p>
                      </div>
                      <span className="px-2.5 py-1 rounded-full bg-[#DE5795]/15 text-[#9D174D] font-mono font-bold text-[10px]">
                        {formSelectedTemplateIds.length} Terpilih
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                      {AVAILABLE_TEMPLATES.map((tmpl) => {
                        const isChecked = formSelectedTemplateIds.includes(tmpl.id);

                        return (
                          <div
                            key={tmpl.id}
                            onClick={() => handleToggleTemplate(tmpl.id)}
                            className={`p-3 rounded-xl border-2 cursor-pointer transition-all flex items-center justify-between ${
                              isChecked
                                ? 'border-[#DE5795] bg-[#DE5795]/10 shadow-2xs'
                                : 'border-gray-200 bg-white hover:border-gray-300'
                            }`}
                          >
                            <div className="flex items-center gap-2.5 min-w-0">
                              <div
                                className="w-8 h-8 rounded-lg border border-gray-300 flex items-center justify-center shrink-0 shadow-2xs"
                                style={{ backgroundColor: tmpl.backgroundColor }}
                              >
                                <span className="text-[8px] font-bold text-gray-800 uppercase">
                                  {tmpl.layout.split('_')[0]}
                                </span>
                              </div>
                              <div className="min-w-0">
                                <p className="font-bold text-gray-900 truncate text-xs">{tmpl.name}</p>
                                <span className="text-[10px] text-gray-500 uppercase tracking-wider">{tmpl.layout}</span>
                              </div>
                            </div>

                            <div
                              className={`w-5 h-5 rounded-md flex items-center justify-center border transition-colors ${
                                isChecked
                                  ? 'bg-[#DE5795] border-[#DE5795] text-white'
                                  : 'border-gray-300 bg-white'
                              }`}
                            >
                              {isChecked && <Check className="w-3.5 h-3.5" />}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* SECTION 6: CATATAN UNTUK OPERATOR */}
                  <div className="space-y-1.5">
                    <label className="font-semibold text-gray-700 block">Catatan Khusus Operator / Briefing Kru</label>
                    <textarea
                      rows={2}
                      placeholder="Misal: Siapkan kacamata dan topi properti tema vintage, pastikan cadangan roll DNP DS620 sudah siap..."
                      value={formNotes}
                      onChange={(e) => setFormNotes(e.target.value)}
                      className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-gray-200 focus:outline-hidden focus:border-[#DE5795] bg-white"
                    />
                  </div>
                </div>

                {/* Drawer Sticky Footer */}
                <div className="px-7 py-4.5 border-t border-gray-200/80 bg-white/95 backdrop-blur-md flex items-center justify-between gap-3 shrink-0 sticky bottom-0 z-20 shadow-xs">
                  <span className="text-[11px] text-gray-400 hidden sm:inline">
                    Tekan <kbd className="px-1.5 py-0.5 rounded bg-gray-100 border border-gray-200 font-mono text-[10px] text-gray-500">ESC</kbd> untuk membatalkan
                  </span>
                  <div className="flex items-center gap-2.5">
                    <button
                      type="button"
                      onClick={() => setIsModalOpen(false)}
                      className="px-4 py-2.5 rounded-xl border border-gray-200/90 bg-white text-xs font-semibold text-gray-700 hover:bg-gray-50 transition-colors shadow-2xs"
                    >
                      Batal
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2.5 rounded-xl bg-[#DE5795] text-white text-xs font-bold hover:bg-[#c93d7e] transition-all border border-[#DE5795] shadow-xs flex items-center gap-2 active:scale-98"
                    >
                      <Check className="w-4 h-4 text-white" />
                      <span>{editingEvent ? 'Simpan Perubahan Acara' : 'Jadwalkan Acara Sekarang'}</span>
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* DELETE CONFIRMATION MODAL                                    */}
      {/* ============================================================ */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-950/70 backdrop-blur-sm animate-fade-in font-sora">
          <div className="relative w-full max-w-sm rounded-3xl bg-white p-6 shadow-2xl border border-gray-200 text-center space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-bold text-gray-900">Hapus Jadwal Acara?</h3>
              <p className="text-xs text-gray-500">
                Tindakan ini akan menghapus alokasi booth dan membatalkan jadwal event ini dari sistem.
              </p>
            </div>
            <div className="flex items-center gap-2 pt-2">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="flex-1 py-2.5 rounded-xl border border-gray-200 text-xs font-semibold text-gray-700 hover:bg-gray-50 transition"
              >
                Batal
              </button>
              <button
                onClick={() => handleDeleteEvent(deleteConfirmId)}
                className="flex-1 py-2.5 rounded-xl bg-red-600 text-white text-xs font-bold hover:bg-red-700 transition shadow-xs"
              >
                Ya, Hapus
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
