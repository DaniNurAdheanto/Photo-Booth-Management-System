'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Camera, RefreshCw, Volume2, VolumeX, AlertCircle, Sparkles } from 'lucide-react';
import { soundEffects } from '../utils/soundEffects';

interface KioskCameraProps {
  countdownDuration: number;
  isCountingDown: boolean;
  onPhotoCaptured: (photoDataUrl: string) => void;
  currentSlot: number;
  totalSlots: number;
  soundEnabled: boolean;
  onToggleSound: () => void;
}

export function KioskCamera({
  countdownDuration,
  isCountingDown,
  onPhotoCaptured,
  currentSlot,
  totalSlots,
  soundEnabled,
  onToggleSound,
}: KioskCameraProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const [stream, setStream] = useState<MediaStream | null>(null);
  const [cameraActive, setCameraActive] = useState<boolean>(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [countdownNum, setCountdownNum] = useState<number>(countdownDuration);
  const [flashActive, setFlashActive] = useState<boolean>(false);
  const [simulatedPoseIndex, setSimulatedPoseIndex] = useState<number>(0);

  // Simulated photobooth sample captures if webcam not accessible
  const fallbackPoses = [
    'https://images.unsplash.com/photo-1519741497674-611481863552?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1520854221256-17451cc331bf?w=800&auto=format&fit=crop&q=80',
  ];

  // Initialize webcam
  useEffect(() => {
    let currentStream: MediaStream | null = null;

    async function startCamera() {
      try {
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
          throw new Error('Webcam not supported in this environment');
        }
        const mediaStream = await navigator.mediaDevices.getUserMedia({
          video: {
            width: { ideal: 1280 },
            height: { ideal: 720 },
            facingMode: 'user',
          },
          audio: false,
        });
        currentStream = mediaStream;
        setStream(mediaStream);
        setCameraActive(true);
        setCameraError(null);

        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
          videoRef.current.play().catch(() => {});
        }
      } catch (err: any) {
        console.warn('Camera access error (using simulated preview fallback):', err.message);
        setCameraActive(false);
        setCameraError('Webcam tidak terdeteksi atau izin belum diberikan. Mode Simulasi Kamera Studio Aktif.');
      }
    }

    startCamera();

    return () => {
      if (currentStream) {
        currentStream.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  // Handle countdown logic
  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;

    if (isCountingDown) {
      setCountdownNum(countdownDuration);

      let current = countdownDuration;
      soundEffects.playBeep(800, 80);

      timer = setInterval(() => {
        current -= 1;
        if (current > 0) {
          setCountdownNum(current);
          soundEffects.playBeep(current === 1 ? 1200 : 880, 100);
        } else if (current === 0) {
          setCountdownNum(0); // SMILE!
          soundEffects.playBeep(1400, 120);

          // Flash and capture
          setTimeout(() => {
            triggerShutterAndCapture();
          }, 300);

          if (timer) clearInterval(timer);
        }
      }, 1000);
    }

    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isCountingDown, countdownDuration]);

  // Capture photo from video feed or fallback canvas
  const triggerShutterAndCapture = () => {
    setFlashActive(true);
    soundEffects.playShutter();

    setTimeout(() => {
      setFlashActive(false);
    }, 250);

    let photoData = '';

    if (cameraActive && videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth || 1280;
      canvas.height = video.videoHeight || 720;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        // Mirror horizontally
        ctx.translate(canvas.width, 0);
        ctx.scale(-1, 1);
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        photoData = canvas.toDataURL('image/jpeg', 0.92);
      }
    }

    // Fallback if video frame wasn't grabbed
    if (!photoData) {
      const poseUrl = fallbackPoses[currentSlot % fallbackPoses.length];
      photoData = poseUrl;
      setSimulatedPoseIndex((prev) => prev + 1);
    }

    onPhotoCaptured(photoData);
  };

  return (
    <div className="relative w-full h-[520px] rounded-2xl overflow-hidden bg-gray-950 border-4 border-[#DE5795]/60 shadow-2xl flex items-center justify-center font-sora select-none">
      {/* Hidden processing canvas */}
      <canvas ref={canvasRef} className="hidden" />

      {/* Video Feed */}
      {cameraActive ? (
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="w-full h-full object-cover transform -scale-x-100"
        />
      ) : (
        /* Realistic Camera Simulation Viewport when no webcam is connected */
        <div className="relative w-full h-full flex flex-col items-center justify-center bg-gradient-to-b from-gray-900 to-black text-white p-6">
          <img
            src={fallbackPoses[currentSlot % fallbackPoses.length]}
            alt="Camera Preview Simulation"
            className="absolute inset-0 w-full h-full object-cover opacity-60 filter contrast-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/50" />

          {/* Simulation Watermark Badge */}
          <div className="absolute top-4 left-4 z-10 flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-xs font-medium text-pink-300">
            <Sparkles className="w-3.5 h-3.5 text-[#DE5795]" />
            <span>Studio Simulation Live Feed</span>
          </div>
        </div>
      )}

      {/* Flash Overlay Effect */}
      <div
        className={`absolute inset-0 bg-white z-50 pointer-events-none transition-opacity duration-200 ${
          flashActive ? 'opacity-100' : 'opacity-0'
        }`}
      />

      {/* Top Bar with Slot Counter & Sound Toggle */}
      <div className="absolute top-4 right-4 z-20 flex items-center gap-3">
        <button
          onClick={onToggleSound}
          className="p-2.5 rounded-full bg-black/50 backdrop-blur-md border border-white/20 text-white hover:bg-black/70 transition-all hover:scale-105"
          title={soundEnabled ? 'Mute Sounds' : 'Unmute Sounds'}
        >
          {soundEnabled ? (
            <Volume2 className="w-4 h-4 text-[#DE5795]" />
          ) : (
            <VolumeX className="w-4 h-4 text-gray-400" />
          )}
        </button>

        <div className="px-3.5 py-1.5 rounded-full bg-black/50 backdrop-blur-md border border-white/20 text-xs font-semibold text-white flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#DE5795] animate-pulse" />
          <span>
            Foto {currentSlot + 1} dari {totalSlots}
          </span>
        </div>
      </div>

      {/* Viewfinder Grid Lines (Professional Camera Overlay) */}
      <div className="absolute inset-8 pointer-events-none border border-white/20 rounded-xl">
        <div className="absolute top-0 bottom-0 left-1/3 border-r border-white/10" />
        <div className="absolute top-0 bottom-0 left-2/3 border-r border-white/10" />
        <div className="absolute left-0 right-0 top-1/3 border-b border-white/10" />
        <div className="absolute left-0 right-0 top-2/3 border-b border-white/10" />
        {/* Center Crosshair */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-6 border border-white/30 rounded-full" />
      </div>

      {/* Countdown Overlay Animation */}
      {isCountingDown && (
        <div className="absolute inset-0 z-40 flex flex-col items-center justify-center bg-black/35 backdrop-blur-xs">
          {countdownNum > 0 ? (
            <div className="relative flex items-center justify-center">
              <span className="text-[120px] font-black text-[#DE5795] drop-shadow-[0_8px_24px_rgba(0,0,0,0.8)] animate-ping">
                {countdownNum}
              </span>
              <span className="absolute text-[120px] font-black text-white drop-shadow-[0_4px_12px_rgba(0,0,0,0.9)]">
                {countdownNum}
              </span>
            </div>
          ) : (
            <div className="text-center animate-bounce">
              <span className="text-6xl font-black text-[#DE5795] tracking-wider drop-shadow-[0_8px_24px_rgba(0,0,0,0.9)] uppercase">
                SMILE! 📸
              </span>
            </div>
          )}
          <p className="mt-4 text-sm font-medium text-white/90 bg-black/40 px-4 py-1.5 rounded-full backdrop-blur-sm">
            Tatap kamera & bersiaplah berpose!
          </p>
        </div>
      )}

      {/* Camera status error notification if any */}
      {cameraError && !cameraActive && (
        <div className="absolute bottom-4 left-4 right-4 z-20 flex items-center gap-2.5 px-3 py-2 rounded-xl bg-black/75 backdrop-blur-md border border-amber-500/40 text-amber-200 text-xs">
          <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
          <span className="truncate">{cameraError}</span>
        </div>
      )}
    </div>
  );
}
