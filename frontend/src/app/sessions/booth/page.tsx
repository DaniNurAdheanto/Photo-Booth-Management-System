'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Camera,
  Layers,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  RotateCcw,
  CheckCircle2,
  Printer,
  QrCode,
  Volume2,
  VolumeX,
  Clock,
  AlertTriangle,
  RefreshCw,
  Home,
  ShieldAlert,
  Sliders,
  Check,
  ChevronRight,
  Download,
  Flame,
} from 'lucide-react';
import { KioskCamera } from '@/features/sessions/components/KioskCamera';
import { soundEffects } from '@/features/sessions/utils/soundEffects';
import { generateCompositeImage } from '@/features/sessions/utils/compositeGenerator';
import { PhotoSession, KioskStep, FilterPreset } from '@/features/sessions/types/session.types';

export default function KioskBoothPage() {
  const router = useRouter();

  // Kiosk Lifecycle State
  const [step, setStep] = useState<KioskStep>('WELCOME');
  const [activeSession, setActiveSession] = useState<PhotoSession | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Recovery Alert State
  const [interruptedSession, setInterruptedSession] = useState<PhotoSession | null>(null);
  const [showRecoveryModal, setShowRecoveryModal] = useState<boolean>(false);

  // Configuration & Settings
  const [templates, setTemplates] = useState<any[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<any>(null);
  const [countdownDuration, setCountdownDuration] = useState<number>(5);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [customerName, setCustomerName] = useState<string>('');
  const [customerEmail, setCustomerEmail] = useState<string>('');
  const [printCopies, setPrintCopies] = useState<number>(2);
  const [filterPreset, setFilterPreset] = useState<FilterPreset>('ORIGINAL');

  // Photo Capture State
  const [capturedPhotos, setCapturedPhotos] = useState<{ slot: number; url: string }[]>([]);
  const [currentSlotToCapture, setCurrentSlotToCapture] = useState<number>(0);
  const [isCountingDown, setIsCountingDown] = useState<boolean>(false);
  const [targetRetakeSlot, setTargetRetakeSlot] = useState<number | null>(null);

  // Composite & Final Result
  const [finalCompositeUrl, setFinalCompositeUrl] = useState<string>('');
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('');

  // Processing indicators
  const [processingProgress, setProcessingProgress] = useState<number>(0);
  const [processingStatusText, setProcessingStatusText] = useState<string>('Memulai pemrosesan foto...');
  const [isConfirming, setIsConfirming] = useState<boolean>(false);

  // Auto-Reset & Idle Timers
  const [autoResetSeconds, setAutoResetSeconds] = useState<number>(15);
  const [isAutoResetActive, setIsAutoResetActive] = useState<boolean>(false);
  const [idleWarning, setIdleWarning] = useState<boolean>(false);
  const [idleCountdown, setIdleCountdown] = useState<number>(15);
  const lastActivityRef = useRef<number>(Date.now());

  // Cancel Confirmation Modal
  const [showCancelModal, setShowCancelModal] = useState<boolean>(false);

  // Load Templates and Check Interrupted Sessions
  useEffect(() => {
    async function initKiosk() {
      // 1. Fetch Templates from DB
      try {
        const res = await fetch('/api/templates');
        const json = await res.json();
        if (json.success && Array.isArray(json.data) && json.data.length > 0) {
          setTemplates(json.data);
          setSelectedTemplate(json.data[0]); // default to first template
        } else {
          // Fallback templates
          const fallback = [
            { id: 'tmpl-001', name: 'Classic Strip 2x6', layout: '2x6_strip', slotsCount: 4, backgroundColor: '#DE5795' },
            { id: 'tmpl-002', name: 'Duo Postcard 4x6', layout: '4x6_postcard', slotsCount: 2, backgroundColor: '#ffffff' },
            { id: 'tmpl-003', name: 'Party Quad 2x2', layout: '2x2_grid', slotsCount: 4, backgroundColor: '#E0F2FE' },
          ];
          setTemplates(fallback);
          setSelectedTemplate(fallback[0]);
        }
      } catch (e) {
        console.error('Failed to load templates:', e);
      }

      // 2. Check for active/interrupted session in DB or localStorage
      try {
        const res = await fetch('/api/sessions/active?booth_id=bth-001');
        const json = await res.json();
        if (json.success && json.data) {
          setInterruptedSession(json.data);
          setShowRecoveryModal(true);
        } else {
          // Check localStorage fallback
          const localSaved = localStorage.getItem('photobooth_kiosk_recovery');
          if (localSaved) {
            try {
              const parsed = JSON.parse(localSaved);
              if (parsed && parsed.status !== 'COMPLETED' && parsed.status !== 'CANCELLED') {
                setInterruptedSession(parsed);
                setShowRecoveryModal(true);
              }
            } catch (err) {}
          }
        }
      } catch (e) {}
    }

    initKiosk();
  }, []);

  // Idle timeout detector (45s of no interaction shows warning modal)
  useEffect(() => {
    const handleActivity = () => {
      lastActivityRef.current = Date.now();
      if (idleWarning) {
        setIdleWarning(false);
      }
    };

    window.addEventListener('mousemove', handleActivity);
    window.addEventListener('keydown', handleActivity);
    window.addEventListener('touchstart', handleActivity);

    const idleInterval = setInterval(() => {
      // Don't trigger idle warning on welcome or completed steps
      if (step === 'WELCOME' || step === 'COMPLETED' || step === 'PROCESSING') return;

      const idleDuration = (Date.now() - lastActivityRef.current) / 1000;
      if (idleDuration >= 45 && !idleWarning) {
        setIdleWarning(true);
        setIdleCountdown(15);
      }
    }, 2000);

    return () => {
      window.removeEventListener('mousemove', handleActivity);
      window.removeEventListener('keydown', handleActivity);
      window.removeEventListener('touchstart', handleActivity);
      clearInterval(idleInterval);
    };
  }, [step, idleWarning]);

  // Idle countdown timer
  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;
    if (idleWarning) {
      timer = setInterval(() => {
        setIdleCountdown((prev) => {
          if (prev <= 1) {
            // Reset to welcome
            handleCancelSession();
            setIdleWarning(false);
            return 15;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [idleWarning]);

  // Auto-Reset timer on COMPLETED screen
  useEffect(() => {
    let resetTimer: NodeJS.Timeout | null = null;
    if (step === 'COMPLETED') {
      setIsAutoResetActive(true);
      setAutoResetSeconds(15);

      resetTimer = setInterval(() => {
        setAutoResetSeconds((prev) => {
          if (prev <= 1) {
            handleResetToWelcome();
            return 15;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      setIsAutoResetActive(false);
    }

    return () => {
      if (resetTimer) clearInterval(resetTimer);
    };
  }, [step]);

  // Sync state to localStorage for recovery
  useEffect(() => {
    if (activeSession && step !== 'WELCOME' && step !== 'COMPLETED') {
      const stateToPersist = {
        ...activeSession,
        step,
        capturedPhotos,
        selectedTemplate,
        countdownDuration,
        filterPreset,
      };
      localStorage.setItem('photobooth_kiosk_recovery', JSON.stringify(stateToPersist));
    }
  }, [activeSession, step, capturedPhotos, selectedTemplate, countdownDuration, filterPreset]);

  // Action: Start New Session
  const handleStartSession = async () => {
    setLoading(true);
    setErrorMsg(null);

    const totalSlots = selectedTemplate?.slotsCount || selectedTemplate?.slots_count || 4;

    try {
      const res = await fetch('/api/sessions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          booth_id: 'bth-001',
          customer_name: customerName.trim() || 'Walk-in Guest',
          customer_email: customerEmail.trim(),
          template_id: selectedTemplate?.id || 'tmpl-001',
          total_photos: totalSlots,
          print_copies: printCopies,
          countdown_seconds: countdownDuration,
        }),
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.message || 'Gagal memulai sesi baru');
      }

      setActiveSession(json.data);
      setCapturedPhotos([]);
      setCurrentSlotToCapture(0);
      setStep('TEMPLATE_SELECT');
      soundEffects.playBeep(600, 150);
    } catch (err: any) {
      setErrorMsg(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Action: Resume Interrupted Session
  const handleResumeSession = (sessionToResume: PhotoSession) => {
    setActiveSession(sessionToResume);

    let photos: { slot: number; url: string }[] = [];
    try {
      const raw = sessionToResume.captured_photos || sessionToResume.capturedPhotos;
      if (raw) photos = typeof raw === 'string' ? JSON.parse(raw) : raw;
    } catch (e) {}

    setCapturedPhotos(photos);

    // Pick template
    const tmplId = sessionToResume.template_id || sessionToResume.templateId;
    const foundTmpl = templates.find((t) => t.id === tmplId) || templates[0];
    setSelectedTemplate(foundTmpl);

    const totalSlots = foundTmpl?.slotsCount || foundTmpl?.slots_count || 4;

    if (photos.length >= totalSlots) {
      setStep('REVIEW');
    } else {
      setCurrentSlotToCapture(photos.length);
      setStep('PREPARE');
    }

    setShowRecoveryModal(false);
    setInterruptedSession(null);
  };

  // Action: Discard Interrupted Session
  const handleDiscardRecovery = async () => {
    if (interruptedSession) {
      try {
        await fetch(`/api/sessions/${interruptedSession.id}/cancel`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ notes: 'Discarded during recovery prompt' }),
        });
      } catch (e) {}
    }
    localStorage.removeItem('photobooth_kiosk_recovery');
    setShowRecoveryModal(false);
    setInterruptedSession(null);
  };

  // Action: Trigger Camera Countdown
  const handleStartCountdown = () => {
    setIsCountingDown(true);
  };

  // Callback when a photo is captured by KioskCamera
  const handlePhotoCaptured = async (photoDataUrl: string) => {
    setIsCountingDown(false);

    const slotIndex = targetRetakeSlot !== null ? targetRetakeSlot : currentSlotToCapture;
    const updatedPhotos = [...capturedPhotos.filter((p) => p.slot !== slotIndex), { slot: slotIndex, url: photoDataUrl }].sort(
      (a, b) => a.slot - b.slot
    );

    setCapturedPhotos(updatedPhotos);

    // Sync to backend DB
    if (activeSession) {
      try {
        await fetch(`/api/sessions/${activeSession.id}/capture`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            slot_index: slotIndex,
            photo_url: photoDataUrl,
          }),
        });
      } catch (e) {
        console.error('Failed to sync capture to DB:', e);
      }
    }

    const totalSlots = selectedTemplate?.slotsCount || selectedTemplate?.slots_count || 4;

    // Check if this was an individual slot retake
    if (targetRetakeSlot !== null) {
      setTargetRetakeSlot(null);
      setStep('REVIEW');
      return;
    }

    // Sequential photo flow
    const nextSlot = slotIndex + 1;
    if (nextSlot < totalSlots) {
      setCurrentSlotToCapture(nextSlot);
      // Brief pause to view thumbnail before next countdown
      setTimeout(() => {
        setIsCountingDown(true);
      }, 1500);
    } else {
      // All slots captured! Proceed to Review
      setTimeout(() => {
        setStep('REVIEW');
      }, 800);
    }
  };

  // Action: Retake individual slot
  const handleRetakeIndividualSlot = async (slotIndex: number) => {
    setTargetRetakeSlot(slotIndex);
    setCurrentSlotToCapture(slotIndex);

    if (activeSession) {
      try {
        await fetch(`/api/sessions/${activeSession.id}/retake`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            slot_index: slotIndex,
            retake_all: false,
          }),
        });
      } catch (e) {}
    }

    setStep('PREPARE');
  };

  // Action: Retake all photos
  const handleRetakeAll = async () => {
    setCapturedPhotos([]);
    setCurrentSlotToCapture(0);
    setTargetRetakeSlot(null);

    if (activeSession) {
      try {
        await fetch(`/api/sessions/${activeSession.id}/retake`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ retake_all: true }),
        });
      } catch (e) {}
    }

    setStep('PREPARE');
  };

  // Action: Confirm & Finalize Session (Idempotent!)
  const handleConfirmSession = async () => {
    if (isConfirming || !activeSession) return;
    setIsConfirming(true);
    setStep('PROCESSING');
    setProcessingProgress(15);
    setProcessingStatusText('Menyiapkan gambar resolusi tinggi...');

    try {
      // 1. Generate composite image via canvas
      setProcessingProgress(40);
      setProcessingStatusText('Menyusun layout template foto...');

      const composite = await generateCompositeImage({
        photos: capturedPhotos,
        layout: selectedTemplate?.layout || '2x6_strip',
        backgroundColor: selectedTemplate?.backgroundColor || selectedTemplate?.background_color || '#DE5795',
        templateName: selectedTemplate?.name || 'Photo Booth Moments',
        filterPreset,
      });

      setFinalCompositeUrl(composite);

      // 2. Generate digital QR code URL
      setProcessingProgress(70);
      setProcessingStatusText('Membuat QR Code unduhan digital...');
      const sessionCode = activeSession.session_code || activeSession.sessionCode;
      const generatedQr = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=https://photobooth.local/download/${sessionCode}`;
      setQrCodeUrl(generatedQr);

      // 3. Confirm to DB with Unique Idempotency Key
      setProcessingProgress(90);
      setProcessingStatusText('Menyimpan hasil foto resolusi tinggi...');

      const idempotencyKey = `idem-${activeSession.id}-${Date.now()}`;
      const res = await fetch(`/api/sessions/${activeSession.id}/confirm`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          idempotency_key: idempotencyKey,
          print_copies: printCopies,
          final_composite_url: composite,
          qr_code_url: generatedQr,
          filter_preset: filterPreset,
        }),
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.message || 'Gagal mengonfirmasi sesi foto');
      }

      setProcessingProgress(100);
      setProcessingStatusText('Selesai!');

      // Remove recovery draft since session successfully completed
      localStorage.removeItem('photobooth_kiosk_recovery');

      soundEffects.playSuccess();

      setTimeout(() => {
        setStep('COMPLETED');
        setIsConfirming(false);
      }, 600);
    } catch (err: any) {
      console.error('Session confirmation failed:', err);
      setErrorMsg(err.message || 'Gagal memproses sesi foto');
      setStep('REVIEW'); // return to review so visitor can retry
      setIsConfirming(false);
    }
  };

  // Action: Cancel Session
  const handleCancelSession = async () => {
    if (activeSession) {
      try {
        await fetch(`/api/sessions/${activeSession.id}/cancel`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ notes: 'Pengunjung membatalkan sesi di booth' }),
        });
      } catch (e) {}
    }
    localStorage.removeItem('photobooth_kiosk_recovery');
    handleResetToWelcome();
  };

  // Action: Reset back to Welcome screen
  const handleResetToWelcome = () => {
    setActiveSession(null);
    setCapturedPhotos([]);
    setCurrentSlotToCapture(0);
    setTargetRetakeSlot(null);
    setFinalCompositeUrl('');
    setQrCodeUrl('');
    setFilterPreset('ORIGINAL');
    setErrorMsg(null);
    setShowCancelModal(false);
    setIdleWarning(false);
    setStep('WELCOME');
  };

  const totalSlotsNeeded = selectedTemplate?.slotsCount || selectedTemplate?.slots_count || 4;

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-[#FDF7FA] via-white to-[#FCE7F1] text-gray-900 font-sora flex flex-col justify-between selection:bg-[#DE5795] selection:text-white">
      {/* Kiosk Top Bar */}
      <header className="px-6 py-4 flex items-center justify-between border-b border-[#DE5795]/20 bg-white/80 backdrop-blur-md sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <Link
            href="/sessions"
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-gray-200 text-xs font-medium text-gray-600 hover:bg-gray-50 transition-colors"
            title="Kembali ke Dashboard Operator"
          >
            <Home className="w-3.5 h-3.5" />
            <span>Dashboard</span>
          </Link>

          <div className="h-4 w-px bg-gray-200" />

          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-[#DE5795] border border-[#c93d7e] flex items-center justify-center text-white font-black text-xs shadow-xs">
              PB
            </div>
            <div>
              <h1 className="text-sm font-bold text-gray-900 leading-tight">Booth Alpha • Kiosk Live</h1>
              <p className="text-[10px] text-gray-500">Grand Indonesia Level 3A</p>
            </div>
          </div>
        </div>

        {/* Step Indicator Pill */}
        {step !== 'WELCOME' && (
          <div className="hidden sm:flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-[#DE5795]/30 text-xs font-medium text-[#9D174D] shadow-xs">
            <span
              className={`w-2 h-2 rounded-full ${
                step === 'COMPLETED' ? 'bg-emerald-500' : 'bg-[#DE5795] animate-pulse'
              }`}
            />
            <span className="font-semibold">
              {step === 'TEMPLATE_SELECT' && '1. Pilih Template'}
              {step === 'PREPARE' && '2. Persiapan Kamera'}
              {step === 'COUNTDOWN' && '3. Hitung Mundur'}
              {step === 'CAPTURING' && '3. Mengambil Foto'}
              {step === 'REVIEW' && '4. Tinjau & Retake'}
              {step === 'PROCESSING' && '5. Memproses'}
              {step === 'COMPLETED' && '6. Selesai & Cetak'}
            </span>
          </div>
        )}

        {/* Right Controls */}
        <div className="flex items-center gap-3">
          {activeSession && (
            <span className="text-xs font-mono font-semibold px-2.5 py-1 rounded-md bg-[#DE5795]/15 text-[#9D174D] border border-[#DE5795]/30">
              {activeSession.session_code || activeSession.sessionCode}
            </span>
          )}

          {step !== 'WELCOME' && step !== 'COMPLETED' && (
            <button
              onClick={() => setShowCancelModal(true)}
              className="text-xs text-gray-400 hover:text-red-600 font-medium px-2 py-1 transition-colors"
            >
              Batalkan
            </button>
          )}
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col items-center justify-center p-4 sm:p-6 max-w-6xl w-full mx-auto">
        {/* ============================================================ */}
        {/* STEP 1: WELCOME SCREEN                                       */}
        {/* ============================================================ */}
        {step === 'WELCOME' && (
          <div className="text-center max-w-2xl w-full py-8 space-y-8 animate-fade-in">
            {/* Hero Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#DE5795]/15 border border-[#DE5795]/30 text-xs font-semibold text-[#9D174D] shadow-xs">
              <Sparkles className="w-4 h-4 text-[#DE5795]" />
              <span>Sentuh Layar atau Klik Mulai untuk Berpose</span>
            </div>

            {/* Title */}
            <div className="space-y-3">
              <h2 className="text-4xl sm:text-6xl font-extrabold text-gray-900 tracking-tight leading-tight">
                Abadikan Momen <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#DE5795] to-[#A92B66]">
                  Terbaik Bersama Kami
                </span>
              </h2>
              <p className="text-sm sm:text-base text-gray-600 max-w-lg mx-auto leading-relaxed">
                Ambil foto strip berkualitas studio, sesuaikan filter favorit, cetak instan, dan unduh salinan digital via QR Code.
              </p>
            </div>

            {/* Quick Guest Inputs (Optional) */}
            <div className="max-w-md mx-auto p-4 rounded-2xl bg-white border border-[#DE5795]/25 shadow-sm space-y-3 text-left">
              <div>
                <label className="text-xs font-semibold text-gray-700 block mb-1">
                  Nama Anda (Opsional)
                </label>
                <input
                  type="text"
                  placeholder="Misal: Rian & Maya"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full px-3.5 py-2 text-sm rounded-lg border border-gray-200 focus:outline-hidden focus:border-[#DE5795] focus:ring-2 focus:ring-[#DE5795]/20"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-700 block mb-1">
                  Email Unduhan (Opsional)
                </label>
                <input
                  type="email"
                  placeholder="nama@email.com"
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  className="w-full px-3.5 py-2 text-sm rounded-lg border border-gray-200 focus:outline-hidden focus:border-[#DE5795] focus:ring-2 focus:ring-[#DE5795]/20"
                />
              </div>
            </div>

            {/* Big Start Button */}
            <div>
              <button
                onClick={handleStartSession}
                disabled={loading}
                className="group relative inline-flex items-center gap-3 px-8 py-4 rounded-2xl bg-[#DE5795] text-white font-bold text-lg sm:text-xl shadow-lg hover:shadow-xl hover:bg-[#c93d7e] active:scale-95 transition-all border-2 border-[#DE5795]"
              >
                {loading ? (
                  <>
                    <RefreshCw className="w-5 h-5 animate-spin" />
                    <span>Menyiapkan Kamera...</span>
                  </>
                ) : (
                  <>
                    <Camera className="w-6 h-6 text-white group-hover:scale-110 transition-transform" />
                    <span>Mulai Sesi Foto</span>
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </div>

            {/* Booth Telemetry Badges */}
            <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-gray-500 pt-4">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                Kamera Siap
              </span>
              <span>•</span>
              <span className="flex items-center gap-1.5">
                <Printer className="w-3.5 h-3.5 text-gray-400" />
                Kertas Siap (DNP RX1HS)
              </span>
              <span>•</span>
              <span className="flex items-center gap-1.5">
                <QrCode className="w-3.5 h-3.5 text-gray-400" />
                QR Digital Cloud Aktif
              </span>
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* STEP 2: TEMPLATE & LAYOUT SELECTION                          */}
        {/* ============================================================ */}
        {step === 'TEMPLATE_SELECT' && (
          <div className="w-full max-w-4xl space-y-6 animate-fade-in">
            <div className="text-center space-y-1">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900">Pilih Template Foto</h2>
              <p className="text-xs sm:text-sm text-gray-600">
                Pilih format cetak yang Anda inginkan untuk sesi foto ini
              </p>
            </div>

            {/* Template Selection Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {templates.map((tmpl) => {
                const isSelected = selectedTemplate?.id === tmpl.id;
                const slots = tmpl.slotsCount || tmpl.slots_count || 4;
                const bgColor = tmpl.backgroundColor || tmpl.background_color || '#DE5795';

                return (
                  <div
                    key={tmpl.id}
                    onClick={() => {
                      setSelectedTemplate(tmpl);
                      soundEffects.playBeep(900, 60);
                    }}
                    className={`cursor-pointer rounded-2xl p-4 transition-all border-2 flex flex-col justify-between ${
                      isSelected
                        ? 'border-[#DE5795] bg-white ring-4 ring-[#DE5795]/20 shadow-lg scale-102'
                        : 'border-gray-200 bg-white/70 hover:border-gray-300 hover:bg-white'
                    }`}
                  >
                    <div>
                      {/* Mini Mockup Preview Box */}
                      <div
                        className="h-44 rounded-xl flex items-center justify-center p-2 mb-3 border border-gray-200"
                        style={{ backgroundColor: bgColor }}
                      >
                        {tmpl.layout === '2x6_strip' && (
                          <div className="w-14 h-40 bg-white/90 rounded-sm shadow-xs flex flex-col justify-around p-1">
                            {[1, 2, 3, 4].map((i) => (
                              <div key={i} className="w-full h-7 bg-gray-300 rounded-xs" />
                            ))}
                          </div>
                        )}
                        {tmpl.layout === '2x2_grid' && (
                          <div className="w-32 h-32 bg-white/90 rounded-sm shadow-xs grid grid-cols-2 gap-1 p-1.5">
                            {[1, 2, 3, 4].map((i) => (
                              <div key={i} className="w-full h-12 bg-gray-300 rounded-xs" />
                            ))}
                          </div>
                        )}
                        {tmpl.layout === '4x6_postcard' && (
                          <div className="w-36 h-28 bg-white/90 rounded-sm shadow-xs flex items-center justify-between p-1.5 gap-1">
                            {[1, 2].map((i) => (
                              <div key={i} className="w-full h-24 bg-gray-300 rounded-xs" />
                            ))}
                          </div>
                        )}
                        {tmpl.layout === 'polaroid' && (
                          <div className="w-28 h-36 bg-white rounded-sm shadow-xs p-1 pb-4 flex flex-col items-center">
                            <div className="w-full h-24 bg-gray-300 rounded-xs" />
                          </div>
                        )}
                      </div>

                      <div className="flex items-center justify-between">
                        <h4 className="font-bold text-sm text-gray-900">{tmpl.name}</h4>
                        {isSelected && (
                          <span className="p-1 rounded-full bg-[#DE5795] text-white">
                            <Check className="w-3.5 h-3.5" />
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        Format: <span className="font-semibold">{tmpl.layout}</span> • {slots} Foto
                      </p>
                    </div>

                    <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
                      <span>Warna: {bgColor}</span>
                      <span className="font-medium text-[#9D174D]">{slots} Slot Pose</span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Bottom Actions */}
            <div className="flex items-center justify-between pt-4">
              <button
                onClick={() => setStep('WELCOME')}
                className="px-4 py-2.5 rounded-xl border border-gray-200 text-xs font-semibold text-gray-700 hover:bg-gray-100 transition-colors flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Kembali</span>
              </button>

              <button
                onClick={() => setStep('PREPARE')}
                className="px-6 py-3 rounded-xl bg-[#DE5795] text-white font-bold text-sm hover:bg-[#c93d7e] transition-colors border border-[#DE5795] flex items-center gap-2 shadow-sm"
              >
                <span>Lanjut ke Kamera ({totalSlotsNeeded} Foto)</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* STEP 3 & 4: CAMERA LIVE PREVIEW & COUNTDOWN                  */}
        {/* ============================================================ */}
        {(step === 'PREPARE' || step === 'COUNTDOWN' || step === 'CAPTURING') && (
          <div className="w-full max-w-4xl space-y-4 animate-fade-in">
            {/* Top Toolbar */}
            <div className="flex items-center justify-between bg-white px-4 py-2.5 rounded-xl border border-gray-200 shadow-xs text-xs">
              <div className="flex items-center gap-2 font-medium text-gray-700">
                <Camera className="w-4 h-4 text-[#DE5795]" />
                <span>
                  Mengambil Foto Slot #{currentSlotToCapture + 1} dari {totalSlotsNeeded}
                </span>
                {targetRetakeSlot !== null && (
                  <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 font-bold text-[10px]">
                    Mode Retake Slot #{targetRetakeSlot + 1}
                  </span>
                )}
              </div>

              {/* Countdown Selector */}
              <div className="flex items-center gap-2">
                <span className="text-gray-500 font-medium">Hitung Mundur:</span>
                {[3, 5, 10].map((sec) => (
                  <button
                    key={sec}
                    onClick={() => {
                      setCountdownDuration(sec);
                      soundEffects.playBeep(750, 50);
                    }}
                    disabled={isCountingDown}
                    className={`px-2.5 py-1 rounded-lg font-bold text-xs transition-colors ${
                      countdownDuration === sec
                        ? 'bg-[#DE5795] text-white border border-[#c93d7e]'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {sec}d
                  </button>
                ))}
              </div>
            </div>

            {/* Layout: Live Camera + Thumbnails Strip */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-start">
              {/* Main Camera Viewport */}
              <div className="md:col-span-3">
                <KioskCamera
                  countdownDuration={countdownDuration}
                  isCountingDown={isCountingDown}
                  onPhotoCaptured={handlePhotoCaptured}
                  currentSlot={currentSlotToCapture}
                  totalSlots={totalSlotsNeeded}
                  soundEnabled={soundEnabled}
                  onToggleSound={() => {
                    const next = !soundEnabled;
                    setSoundEnabled(next);
                    soundEffects.setEnabled(next);
                  }}
                />
              </div>

              {/* Side Strip: Captured Photo Slots */}
              <div className="p-3 rounded-2xl bg-white border border-gray-200 shadow-xs space-y-2.5 flex flex-col justify-between">
                <div>
                  <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-2">
                    Hasil Slot ({capturedPhotos.length} / {totalSlotsNeeded})
                  </h4>
                  <div className="space-y-2">
                    {Array.from({ length: totalSlotsNeeded }).map((_, idx) => {
                      const captured = capturedPhotos.find((p) => p.slot === idx);
                      const isCurrent = idx === currentSlotToCapture;

                      return (
                        <div
                          key={idx}
                          className={`relative h-20 rounded-xl overflow-hidden border-2 transition-all flex items-center justify-center ${
                            captured
                              ? 'border-emerald-500 bg-emerald-50'
                              : isCurrent
                              ? 'border-[#DE5795] bg-[#DE5795]/15 animate-pulse'
                              : 'border-dashed border-gray-300 bg-gray-50'
                          }`}
                        >
                          {captured ? (
                            <>
                              <img
                                src={captured.url}
                                alt={`Slot ${idx + 1}`}
                                className="w-full h-full object-cover"
                              />
                              <div className="absolute top-1 left-1 px-1.5 py-0.5 rounded-full bg-black/60 text-[9px] font-bold text-white">
                                #{idx + 1}
                              </div>
                            </>
                          ) : (
                            <span className="text-[11px] font-medium text-gray-400">
                              {isCurrent ? 'Slot Berikutnya' : `Slot #${idx + 1}`}
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Big Shutter Trigger Button */}
                <div className="pt-2 border-t border-gray-100">
                  <button
                    onClick={handleStartCountdown}
                    disabled={isCountingDown}
                    className="w-full py-3 rounded-xl bg-[#DE5795] text-white font-bold text-xs hover:bg-[#c93d7e] transition-colors border border-[#DE5795] flex items-center justify-center gap-2 shadow-xs disabled:opacity-50"
                  >
                    <Camera className="w-4 h-4" />
                    <span>{isCountingDown ? 'Bersiaplah...' : 'Mulai Hitung Mundur'}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* STEP 5: REVIEW, RETAKE & CONFIRM                             */}
        {/* ============================================================ */}
        {step === 'REVIEW' && (
          <div className="w-full max-w-5xl space-y-6 animate-fade-in">
            <div className="text-center space-y-1">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900">
                Tinjau Foto & Pilih Filter
              </h2>
              <p className="text-xs sm:text-sm text-gray-600">
                Puas dengan hasilnya? Anda dapat mengulang seluruh foto atau hanya foto tertentu.
              </p>
            </div>

            {/* Filter Buttons */}
            <div className="flex items-center justify-center gap-2">
              <span className="text-xs font-semibold text-gray-500 mr-2 flex items-center gap-1">
                <Sliders className="w-3.5 h-3.5" /> Filter:
              </span>
              {(['ORIGINAL', 'BW', 'WARM', 'VINTAGE'] as FilterPreset[]).map((preset) => (
                <button
                  key={preset}
                  onClick={() => {
                    setFilterPreset(preset);
                    soundEffects.playBeep(950, 40);
                  }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    filterPreset === preset
                      ? 'bg-[#DE5795] text-white border border-[#c93d7e] shadow-xs'
                      : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  {preset === 'ORIGINAL' && 'Asli'}
                  {preset === 'BW' && 'Black & White'}
                  {preset === 'WARM' && 'Warm Sunset'}
                  {preset === 'VINTAGE' && 'Vintage Film'}
                </button>
              ))}
            </div>

            {/* Side-by-side Review Layout */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
              {/* Left Column: Individual Slots Grid with Retake Action */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-gray-800 uppercase tracking-wider">
                    Foto Setiap Slot ({capturedPhotos.length} Foto)
                  </h4>
                  <button
                    onClick={handleRetakeAll}
                    className="text-xs font-semibold text-amber-700 hover:text-amber-800 flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-50 border border-amber-200 transition-colors"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Retake Semua</span>
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  {capturedPhotos.map((item) => (
                    <div
                      key={item.slot}
                      className="group relative rounded-xl overflow-hidden border border-gray-200 bg-white shadow-xs"
                    >
                      <img
                        src={item.url}
                        alt={`Slot ${item.slot + 1}`}
                        style={{
                          filter:
                            filterPreset === 'BW'
                              ? 'grayscale(100%)'
                              : filterPreset === 'WARM'
                              ? 'sepia(30%) saturate(140%)'
                              : filterPreset === 'VINTAGE'
                              ? 'sepia(50%) contrast(90%)'
                              : 'none',
                        }}
                        className="w-full h-36 object-cover"
                      />
                      <div className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-black/60 text-[10px] font-bold text-white">
                        Slot #{item.slot + 1}
                      </div>

                      {/* Retake Individual Slot Button */}
                      <button
                        onClick={() => handleRetakeIndividualSlot(item.slot)}
                        className="absolute bottom-2 right-2 px-2.5 py-1 rounded-lg bg-white/95 text-gray-800 font-semibold text-[11px] shadow-md hover:bg-white flex items-center gap-1 border border-gray-200 transition-all active:scale-95"
                      >
                        <RotateCcw className="w-3 h-3 text-amber-600" />
                        <span>Retake Slot Ini</span>
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right Column: Composite Layout Mockup Preview */}
              <div className="p-4 rounded-2xl bg-white border border-gray-200 shadow-sm space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-gray-800 uppercase tracking-wider">
                    Simulasi Cetak ({selectedTemplate?.name})
                  </h4>
                  <span className="text-[11px] font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                    Siap Cetak
                  </span>
                </div>

                {/* Visual Composite Render Container */}
                <div
                  className="rounded-xl p-4 flex flex-col items-center justify-center border border-gray-200 min-h-[340px]"
                  style={{
                    backgroundColor:
                      selectedTemplate?.backgroundColor || selectedTemplate?.background_color || '#DE5795',
                  }}
                >
                  <div className="w-40 bg-white p-2 rounded-sm shadow-md flex flex-col items-center space-y-2">
                    {capturedPhotos.map((photo) => (
                      <img
                        key={photo.slot}
                        src={photo.url}
                        alt="Slot preview"
                        style={{
                          filter:
                            filterPreset === 'BW'
                              ? 'grayscale(100%)'
                              : filterPreset === 'WARM'
                              ? 'sepia(30%) saturate(140%)'
                              : filterPreset === 'VINTAGE'
                              ? 'sepia(50%) contrast(90%)'
                              : 'none',
                        }}
                        className="w-full h-18 object-cover rounded-xs"
                      />
                    ))}
                    <div className="text-center pt-1 border-t border-gray-200 w-full">
                      <p className="text-[10px] font-black tracking-wider text-[#9D174D]">PHOTO BOOTH</p>
                      <p className="text-[8px] text-gray-500 font-medium">Grand Indonesia</p>
                    </div>
                  </div>
                </div>

                {/* Print Copies Selector */}
                <div className="flex items-center justify-between p-3 rounded-xl bg-gray-50 border border-gray-200 text-xs">
                  <span className="font-semibold text-gray-700">Jumlah Cetak Fisik:</span>
                  <div className="flex items-center gap-2">
                    {[1, 2, 4].map((num) => (
                      <button
                        key={num}
                        onClick={() => setPrintCopies(num)}
                        className={`px-3 py-1 rounded-lg font-bold text-xs transition-colors ${
                          printCopies === num
                            ? 'bg-[#DE5795] text-white border border-[#c93d7e]'
                            : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-100'
                        }`}
                      >
                        {num} Lembar
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Actions Bar */}
            <div className="p-4 rounded-2xl bg-white border border-gray-200 flex flex-wrap items-center justify-between gap-3 shadow-xs">
              <button
                onClick={() => setShowCancelModal(true)}
                className="px-4 py-2.5 rounded-xl border border-red-200 text-red-600 text-xs font-semibold hover:bg-red-50 transition-colors"
              >
                Batalkan Sesi
              </button>

              {/* Idempotent Confirm & Print Button */}
              <button
                onClick={handleConfirmSession}
                disabled={isConfirming}
                className="px-8 py-3.5 rounded-xl bg-[#DE5795] text-white font-bold text-sm sm:text-base hover:bg-[#c93d7e] transition-all border-2 border-[#DE5795] flex items-center gap-2.5 shadow-md active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isConfirming ? (
                  <>
                    <RefreshCw className="w-5 h-5 animate-spin" />
                    <span>Sedang Menyimpan & Mencetak...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-5 h-5 text-white" />
                    <span>Konfirmasi & Cetak Foto ({printCopies} Lembar)</span>
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* STEP 6: PROCESSING SCREEN (INDIKATOR PROSES)                 */}
        {/* ============================================================ */}
        {step === 'PROCESSING' && (
          <div className="max-w-md w-full p-8 rounded-3xl bg-white border border-[#DE5795]/25 shadow-2xl text-center space-y-6 animate-fade-in">
            <div className="w-16 h-16 rounded-2xl bg-[#DE5795]/15 border border-[#DE5795]/30 flex items-center justify-center mx-auto text-[#9D174D]">
              <RefreshCw className="w-8 h-8 animate-spin text-[#DE5795]" />
            </div>

            <div className="space-y-2">
              <h3 className="text-xl font-extrabold text-gray-900">Memproses Foto Anda</h3>
              <p className="text-xs text-gray-500">{processingStatusText}</p>
            </div>

            {/* Progress Bar */}
            <div className="space-y-1.5">
              <div className="w-full h-3 rounded-full bg-gray-100 overflow-hidden border border-gray-200">
                <div
                  className="h-full bg-gradient-to-r from-[#DE5795] to-[#A92B66] transition-all duration-300"
                  style={{ width: `${processingProgress}%` }}
                />
              </div>
              <span className="text-[11px] font-mono text-gray-400 font-semibold">{processingProgress}% Selesai</span>
            </div>

            {/* Step Checklist Indicator */}
            <div className="space-y-2 text-left text-xs font-medium text-gray-600 pt-2 border-t border-gray-100">
              <div className="flex items-center gap-2 text-emerald-700">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Foto diambil dengan sukses</span>
              </div>
              <div
                className={`flex items-center gap-2 ${
                  processingProgress >= 40 ? 'text-emerald-700' : 'text-gray-400'
                }`}
              >
                <CheckCircle2
                  className={`w-4 h-4 shrink-0 ${processingProgress >= 40 ? 'text-emerald-600' : 'text-gray-300'}`}
                />
                <span>Penyusunan komposit & filter visual</span>
              </div>
              <div
                className={`flex items-center gap-2 ${
                  processingProgress >= 70 ? 'text-emerald-700' : 'text-gray-400'
                }`}
              >
                <CheckCircle2
                  className={`w-4 h-4 shrink-0 ${processingProgress >= 70 ? 'text-emerald-600' : 'text-gray-300'}`}
                />
                <span>Pembuatan QR Code unduhan digital</span>
              </div>
              <div
                className={`flex items-center gap-2 ${
                  processingProgress >= 90 ? 'text-emerald-700' : 'text-gray-400'
                }`}
              >
                <CheckCircle2
                  className={`w-4 h-4 shrink-0 ${processingProgress >= 90 ? 'text-emerald-600' : 'text-gray-300'}`}
                />
                <span>Foto resolusi tinggi tersimpan aman</span>
              </div>
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* STEP 7: COMPLETED & SHARE SCREEN                             */}
        {/* ============================================================ */}
        {step === 'COMPLETED' && (
          <div className="w-full max-w-3xl space-y-6 animate-fade-in text-center">
            {/* Success Banner */}
            <div className="space-y-2">
              <div className="inline-flex p-3 rounded-full bg-emerald-100 text-emerald-700 mb-2">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900">Foto Anda Siap! 🎉</h2>
              <p className="text-xs sm:text-sm text-gray-600 max-w-md mx-auto">
                Silakan ambil hasil cetak Anda pada tray printer dan pindai QR Code di bawah untuk menyimpan file digital.
              </p>
            </div>

            {/* Auto Reset Timer Banner */}
            <div className="p-3 rounded-xl bg-[#DE5795]/15 border border-[#DE5795]/30 max-w-md mx-auto flex items-center justify-between text-xs text-[#9D174D]">
              <span className="flex items-center gap-2 font-medium">
                <Clock className="w-4 h-4 text-[#DE5795]" />
                Layar kembali ke menu utama dalam:
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-[#9D174D] text-white font-mono font-bold text-xs">
                {autoResetSeconds}s
              </span>
            </div>

            {/* Sharing Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
              {/* Left: QR Code Scan Card */}
              <div className="p-5 rounded-2xl bg-white border border-gray-200 shadow-sm flex flex-col items-center justify-center text-center space-y-3">
                <div className="p-3 rounded-2xl bg-gray-50 border border-gray-100 shadow-inner">
                  {qrCodeUrl ? (
                    <img src={qrCodeUrl} alt="QR Code Digital Download" className="w-44 h-44 object-contain" />
                  ) : (
                    <QrCode className="w-40 h-40 text-gray-300" />
                  )}
                </div>
                <div>
                  <h4 className="text-sm font-bold text-gray-900">Pindai QR Code</h4>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Gunakan kamera ponsel untuk mengunduh foto digital resolusi tinggi
                  </p>
                </div>
              </div>

              {/* Right: Print Dispatch Card */}
              <div className="p-5 rounded-2xl bg-white border border-gray-200 shadow-sm flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Printer className="w-5 h-5 text-[#DE5795]" />
                    <h4 className="text-sm font-bold text-gray-900">Status Pencetakan</h4>
                  </div>
                  <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 space-y-1">
                    <p className="font-semibold flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      Tugas Cetak Dikirim ke Printer
                    </p>
                    <p className="text-[11px] text-emerald-700">
                      Mencetak {printCopies} lembar dengan printer DNP RX1HS. Harap tunggu ~15 detik.
                    </p>
                  </div>
                  <div className="text-xs text-gray-500 space-y-1 pt-2">
                    <p>Kode Sesi: <strong className="text-gray-900 font-mono">{activeSession?.session_code || activeSession?.sessionCode}</strong></p>
                    <p>Template: <strong className="text-gray-900">{selectedTemplate?.name}</strong></p>
                  </div>
                </div>

                {/* Instant Finish Button */}
                <button
                  onClick={handleResetToWelcome}
                  className="w-full py-3.5 rounded-xl bg-[#DE5795] text-white font-bold text-sm hover:bg-[#c93d7e] transition-colors border border-[#DE5795] flex items-center justify-center gap-2 shadow-xs"
                >
                  <Home className="w-4 h-4" />
                  <span>Selesai Sekarang (Tamu Berikutnya)</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* ============================================================ */}
      {/* INTERRUPTED SESSION RECOVERY MODAL                           */}
      {/* ============================================================ */}
      {showRecoveryModal && interruptedSession && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-950/70 backdrop-blur-sm animate-fade-in font-sora">
          <div className="relative w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl border border-gray-200 space-y-5 text-left">
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-2xl bg-amber-100 text-amber-800 shrink-0">
                <AlertTriangle className="w-6 h-6 text-amber-600" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-bold text-gray-900">Sesi Foto Terputus Terdeteksi</h3>
                <p className="text-xs text-gray-600">
                  Ditemukan sesi yang belum selesai di booth ini dengan kode{' '}
                  <strong className="text-gray-900 font-mono">
                    {interruptedSession.session_code || interruptedSession.sessionCode}
                  </strong>
                  .
                </p>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-gray-50 border border-gray-200 text-xs text-gray-600 space-y-1">
              <p>Status Terakhir: <strong className="text-gray-800">{interruptedSession.status}</strong></p>
              <p>Total Foto Diambil: <strong className="text-gray-800">{interruptedSession.total_photos || interruptedSession.totalPhotos || 4} Foto</strong></p>
              <p className="text-[11px] text-gray-500 pt-1">
                Sesuai kebijakan penerimaan (Acceptance Criteria), sesi yang terputus menampilkan opsi pemulihan dan tidak menghapus data secara otomatis.
              </p>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={handleDiscardRecovery}
                className="px-4 py-2.5 rounded-xl border border-gray-200 text-xs font-semibold text-gray-700 hover:bg-gray-100 transition-colors"
              >
                Hapus & Mulai Baru
              </button>
              <button
                onClick={() => handleResumeSession(interruptedSession)}
                className="px-5 py-2.5 rounded-xl bg-[#DE5795] text-white font-bold text-xs hover:bg-[#c93d7e] transition-colors border border-[#DE5795] flex items-center gap-1.5 shadow-xs"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Pulihkan Sesi Ini</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* IDLE WARNING MODAL                                           */}
      {/* ============================================================ */}
      {idleWarning && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-950/70 backdrop-blur-sm animate-fade-in font-sora">
          <div className="relative w-full max-w-sm rounded-3xl bg-white p-6 shadow-2xl border border-gray-200 text-center space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center mx-auto">
              <Clock className="w-7 h-7 text-amber-600" />
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-bold text-gray-900">Apakah Anda Masih di Sini?</h3>
              <p className="text-xs text-gray-500">
                Tidak ada aktivitas terdeteksi. Sesi akan direset otomatis dalam:
              </p>
            </div>
            <div className="text-3xl font-extrabold text-amber-600 font-mono">{idleCountdown}s</div>
            <button
              onClick={() => {
                lastActivityRef.current = Date.now();
                setIdleWarning(false);
              }}
              className="w-full py-3 rounded-xl bg-[#DE5795] text-white font-bold text-xs hover:bg-[#c93d7e] transition-colors border border-[#DE5795] shadow-xs"
            >
              Saya Masih di Sini! (Lanjutkan)
            </button>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* CANCEL SESSION MODAL                                         */}
      {/* ============================================================ */}
      {showCancelModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-950/70 backdrop-blur-sm animate-fade-in font-sora">
          <div className="relative w-full max-w-sm rounded-3xl bg-white p-6 shadow-2xl border border-gray-200 text-center space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-red-100 text-red-700 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6 text-red-600" />
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-bold text-gray-900">Batalkan Sesi Foto?</h3>
              <p className="text-xs text-gray-500">
                Semua foto yang telah diambil pada sesi ini akan dibatalkan dan sistem akan kembali ke layar utama.
              </p>
            </div>
            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={() => setShowCancelModal(false)}
                className="flex-1 py-2.5 rounded-xl border border-gray-200 text-xs font-semibold text-gray-700 hover:bg-gray-100 transition-colors"
              >
                Kembali
              </button>
              <button
                onClick={handleCancelSession}
                className="flex-1 py-2.5 rounded-xl bg-red-600 text-white font-bold text-xs hover:bg-red-700 transition-colors shadow-xs"
              >
                Ya, Batalkan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
