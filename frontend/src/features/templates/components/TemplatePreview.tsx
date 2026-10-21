'use client';

import React, { useState } from 'react';
import { Camera, Sparkles, Image as ImageIcon, Calendar } from 'lucide-react';
import { TemplateLayout, TextElementConfig } from '../types/template.types';

interface TemplatePreviewProps {
  layout: TemplateLayout | string;
  slotsCount: number;
  backgroundColor: string;
  backgroundGradient?: string;
  backgroundImageUrl?: string;
  overlayPngUrl?: string;
  orientation?: string;
  padding?: number;
  gap?: number;
  borderRadius?: number;
  textElements?: TextElementConfig[] | string;
  logoUrl?: string;
  showDate?: boolean;
  eventName?: string;
  templateName?: string;
  className?: string;
  showSamplePhotos?: boolean;
}

export function TemplatePreview({
  layout,
  slotsCount = 4,
  backgroundColor = '#DE5795',
  backgroundGradient = '',
  backgroundImageUrl = '',
  overlayPngUrl = '',
  orientation = 'PORTRAIT',
  padding = 24,
  gap = 14,
  borderRadius = 8,
  textElements = [],
  logoUrl = '',
  showDate = true,
  eventName = '',
  templateName = 'Photo Booth',
  className = '',
  showSamplePhotos = true,
}: TemplatePreviewProps) {
  const [imgError, setImgError] = useState(false);

  // Parse text elements safely
  let parsedTexts: TextElementConfig[] = [];
  try {
    if (typeof textElements === 'string') {
      parsedTexts = JSON.parse(textElements || '[]');
    } else if (Array.isArray(textElements)) {
      parsedTexts = textElements;
    }
  } catch (e) {
    parsedTexts = [];
  }

  // Realistic sample portraits for live preview
  const samplePhotos = [
    'https://images.unsplash.com/photo-1519741497674-611481863552?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1520854221256-17451cc331bf?w=600&auto=format&fit=crop&q=80',
  ];

  const actualSlots = Array.from({ length: Math.max(1, Math.min(slotsCount, 6)) }, (_, i) => i);

  // Theme detection
  const lowerName = (templateName + ' ' + eventName).toLowerCase();
  const isMonochrome = lowerName.includes('monochrome') || lowerName.includes('black & white');
  const isCyberpunk = lowerName.includes('cyber') || lowerName.includes('y2k') || lowerName.includes('matrix');
  const isKoreanPastel = lowerName.includes('korean') || lowerName.includes('pastel') || lowerName.includes('life4cuts') || lowerName.includes('인생네컷');
  const isVintage90s = lowerName.includes('vintage') || lowerName.includes('90s') || lowerName.includes('film') || lowerName.includes('noir');

  // Background style
  const bgStyle: React.CSSProperties = {
    backgroundColor: backgroundColor || '#DE5795',
    backgroundImage: backgroundGradient
      ? backgroundGradient
      : backgroundImageUrl
      ? `url(${backgroundImageUrl})`
      : undefined,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  };

  // Determine if background is dark
  const isDarkBg =
    isMonochrome ||
    isCyberpunk ||
    backgroundColor === '#121214' ||
    backgroundColor === '#18181B' ||
    backgroundColor === '#0D0B24' ||
    backgroundColor === '#0A091E' ||
    backgroundColor === '#0F172A' ||
    (backgroundGradient &&
      (backgroundGradient.includes('#18181B') ||
        backgroundGradient.includes('#0D0B24') ||
        backgroundGradient.includes('#0A091E') ||
        backgroundGradient.includes('#0F172A')));

  // Photo filter styling based on theme
  const photoFilter = isMonochrome
    ? 'grayscale(100%) contrast(125%)'
    : isVintage90s
    ? 'sepia(35%) contrast(110%) brightness(96%) saturate(85%)'
    : isCyberpunk
    ? 'contrast(125%) saturate(135%) hue-rotate(10deg)'
    : isKoreanPastel
    ? 'contrast(98%) brightness(105%) saturate(108%)'
    : undefined;

  // Header & Title text color
  const headerTextColor = isDarkBg
    ? isCyberpunk
      ? '#00F0FF'
      : '#FFFFFF'
    : isKoreanPastel
    ? '#7C3AED'
    : isVintage90s
    ? '#78350F'
    : '#831843';

  const subTextColor = isDarkBg
    ? isCyberpunk
      ? '#F43F5E'
      : '#A1A1AA'
    : isKoreanPastel
    ? '#DB2777'
    : isVintage90s
    ? '#B45309'
    : '#9D174D';

  const dividerBorderColor = isDarkBg ? 'border-white/15' : 'border-black/10';

  return (
    <div
      className={`relative mx-auto rounded-xl shadow-md border ${
        isCyberpunk ? 'border-cyan-500/40' : isDarkBg ? 'border-zinc-700/80' : 'border-gray-200/90'
      } transition-all overflow-hidden flex flex-col justify-between font-sora select-none ${className}`}
      style={bgStyle}
    >
      {/* 1. Transparent PNG Frame Overlay (if provided and valid) */}
      {overlayPngUrl && !imgError && (
        <img
          src={overlayPngUrl}
          alt="Transparent Frame Overlay"
          onError={() => setImgError(true)}
          className="absolute inset-0 w-full h-full object-cover z-30 pointer-events-none"
        />
      )}

      {/* Cyberpunk ambient top tag */}
      {isCyberpunk && (
        <div className="absolute top-1 left-2 right-2 z-20 flex justify-between items-center text-[6px] font-mono text-cyan-400 font-bold tracking-widest pointer-events-none">
          <span className="flex items-center gap-0.5">
            <span className="w-1 h-1 rounded-full bg-red-500 animate-pulse"></span> REC 60FPS
          </span>
          <span className="text-pink-400">Y2K MATRIX</span>
        </div>
      )}

      {/* Korean Pastel cute top deco */}
      {isKoreanPastel && (
        <div className="absolute top-0.5 left-0 right-0 z-20 flex justify-center text-[7px] text-pink-400 font-bold tracking-widest pointer-events-none">
          ♡ ♡ ♡
        </div>
      )}

      {/* Main Content Area */}
      <div className={`relative z-10 flex flex-col justify-between h-full w-full p-2.5 ${isCyberpunk ? 'pt-3.5' : isKoreanPastel ? 'pt-2.5' : ''}`}>
        {/* Top Header / Logo Space (if logo provided) */}
        {logoUrl && (
          <div className="flex items-center justify-center mb-1">
            <img src={logoUrl} alt="Event Logo" className="h-5 object-contain" />
          </div>
        )}

        {/* ============================================================== */}
        {/* LAYOUT RENDERERS                                               */}
        {/* ============================================================== */}

        {/* 1. Strip 2x6 (Vertical 3 or 4 photos) */}
        {(layout === '2x6_strip' || layout === 'photo_strip') && (
          <div className="flex flex-col justify-between h-full gap-1.5 flex-1">
            <div className="flex flex-col gap-1 flex-1">
              {actualSlots.map((slotIdx) => (
                <div
                  key={slotIdx}
                  className={`flex-1 min-h-[38px] bg-white/95 shadow-xs flex flex-col items-center justify-center text-gray-500 overflow-hidden relative group ${
                    isCyberpunk
                      ? 'border border-cyan-400/80 shadow-[0_0_6px_rgba(0,240,255,0.35)]'
                      : isMonochrome
                      ? 'border border-zinc-700/60'
                      : isKoreanPastel
                      ? 'border-2 border-white/90 shadow-xs'
                      : 'border border-white/60'
                  }`}
                  style={{ borderRadius: `${borderRadius}px` }}
                >
                  {showSamplePhotos ? (
                    <img
                      src={samplePhotos[slotIdx % samplePhotos.length]}
                      alt={`Slot ${slotIdx + 1}`}
                      className="w-full h-full object-cover"
                      style={photoFilter ? { filter: photoFilter } : undefined}
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center">
                      <Camera className="h-3 w-3 text-gray-400" />
                      <span className="text-[7px] font-mono text-gray-400">Slot {slotIdx + 1}</span>
                    </div>
                  )}

                  {/* 90s Vintage orange digital quartz date stamp on first photo */}
                  {isVintage90s && slotIdx === actualSlots.length - 1 && (
                    <div className="absolute bottom-1 right-1 px-1 py-0.5 rounded bg-black/60 text-orange-400 font-mono text-[6.5px] font-bold tracking-wider">
                      &apos;96 10 24
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Bottom Typography & Branding */}
            <div className={`pt-1.5 text-center border-t ${dividerBorderColor}`}>
              <p
                className={`text-[8.5px] font-black uppercase tracking-wide truncate ${
                  isCyberpunk ? 'tracking-wider drop-shadow-[0_0_4px_rgba(0,240,255,0.6)]' : ''
                }`}
                style={{ color: headerTextColor }}
              >
                {eventName || templateName}
              </p>

              {parsedTexts.length > 0 ? (
                parsedTexts.map((txt) => (
                  <p key={txt.id} className="text-[7px] font-medium truncate" style={{ color: txt.color || subTextColor }}>
                    {txt.text}
                  </p>
                ))
              ) : isMonochrome ? (
                <div className="flex flex-col items-center gap-0.5 mt-0.5">
                  <p className="text-[6.5px] font-mono tracking-widest text-zinc-400 uppercase">||| || ||| | ||||</p>
                </div>
              ) : (
                <p className="text-[7px] font-medium" style={{ color: subTextColor }}>
                  {isKoreanPastel ? '인생네컷 ♡ Memories' : 'Moments to Remember'}
                </p>
              )}

              {showDate && (
                <p className={`text-[6px] font-mono mt-0.5 ${isDarkBg ? 'text-zinc-400' : 'text-gray-500'}`}>
                  {new Date().toLocaleDateString('id-ID', { year: 'numeric', month: 'short', day: 'numeric' })}
                </p>
              )}
            </div>
          </div>
        )}

        {/* 2. Grid 2x2 / Collage */}
        {(layout === 'grid_2x2' || layout === 'collage') && (
          <div className="flex flex-col justify-between h-full gap-1.5 flex-1">
            <div className="grid grid-cols-2 gap-1.5 flex-1">
              {actualSlots.slice(0, 4).map((slotIdx) => (
                <div
                  key={slotIdx}
                  className={`aspect-square bg-white/95 shadow-xs flex flex-col items-center justify-center overflow-hidden relative ${
                    isCyberpunk
                      ? 'border border-cyan-400/80 shadow-[0_0_6px_rgba(0,240,255,0.35)]'
                      : isMonochrome
                      ? 'border border-zinc-700/60'
                      : 'border border-white/60'
                  }`}
                  style={{ borderRadius: `${borderRadius}px` }}
                >
                  {showSamplePhotos ? (
                    <img
                      src={samplePhotos[slotIdx % samplePhotos.length]}
                      alt={`Slot ${slotIdx + 1}`}
                      className="w-full h-full object-cover"
                      style={photoFilter ? { filter: photoFilter } : undefined}
                    />
                  ) : (
                    <Camera className="h-4 w-4 text-gray-400" />
                  )}
                </div>
              ))}
            </div>

            <div className={`pt-1 text-center border-t ${dividerBorderColor}`}>
              <p
                className={`text-[8.5px] font-bold tracking-wide truncate ${
                  isCyberpunk ? 'tracking-wider drop-shadow-[0_0_4px_rgba(0,240,255,0.6)]' : ''
                }`}
                style={{ color: headerTextColor }}
              >
                {eventName || templateName}
              </p>

              {parsedTexts.length > 0 ? (
                parsedTexts.map((txt) => (
                  <p key={txt.id} className="text-[7px] font-medium truncate" style={{ color: txt.color || subTextColor }}>
                    {txt.text}
                  </p>
                ))
              ) : null}

              {showDate && (
                <p className={`text-[6.5px] font-mono ${isDarkBg ? 'text-zinc-400' : 'text-gray-500'}`}>
                  {new Date().toDateString()}
                </p>
              )}
            </div>
          </div>
        )}

        {/* 3. Postcard 4x6 (Landscape or Portrait) */}
        {(layout === '4x6_postcard' || layout === 'postcard') && (
          <div className="flex flex-col justify-between h-full gap-2 flex-1">
            <div className="grid grid-cols-2 gap-2 flex-1 items-center">
              {actualSlots.slice(0, Math.min(actualSlots.length, 2)).map((slotIdx) => (
                <div
                  key={slotIdx}
                  className={`aspect-4/3 bg-white/95 shadow-xs flex flex-col items-center justify-center overflow-hidden relative ${
                    isCyberpunk
                      ? 'border border-cyan-400/80 shadow-[0_0_6px_rgba(0,240,255,0.35)]'
                      : 'border border-white/60'
                  }`}
                  style={{ borderRadius: `${borderRadius}px` }}
                >
                  {showSamplePhotos ? (
                    <img
                      src={samplePhotos[slotIdx % samplePhotos.length]}
                      alt={`Slot ${slotIdx + 1}`}
                      className="w-full h-full object-cover"
                      style={photoFilter ? { filter: photoFilter } : undefined}
                    />
                  ) : (
                    <Camera className="h-4 w-4 text-gray-400" />
                  )}
                </div>
              ))}
            </div>

            <div className={`flex items-center justify-between px-1 pt-1 border-t ${dividerBorderColor} text-[7.5px]`}>
              <span className="font-bold truncate" style={{ color: headerTextColor }}>
                {eventName || templateName}
              </span>
              {showDate && (
                <span className={`font-mono ${isDarkBg ? 'text-zinc-400' : 'text-gray-500'}`}>
                  {new Date().getFullYear()}
                </span>
              )}
            </div>
          </div>
        )}

        {/* 4. Single Photo Frame */}
        {layout === 'single_photo' && (
          <div className="flex flex-col justify-between h-full gap-2 flex-1">
            <div
              className="flex-1 w-full bg-white/95 border border-white/60 shadow-xs overflow-hidden relative"
              style={{ borderRadius: `${borderRadius}px` }}
            >
              {showSamplePhotos ? (
                <img
                  src={samplePhotos[0]}
                  alt="Single Portrait"
                  className="w-full h-full object-cover"
                  style={photoFilter ? { filter: photoFilter } : undefined}
                />
              ) : (
                <div className="flex flex-col items-center justify-center h-full">
                  <Camera className="h-6 w-6 text-gray-400 mb-1" />
                  <span className="text-xs text-gray-500">Single Photo Focus</span>
                </div>
              )}
            </div>

            <div className={`text-center pt-1 border-t ${dividerBorderColor}`}>
              <p className="text-[9.5px] font-bold truncate" style={{ color: headerTextColor }}>
                {eventName || templateName}
              </p>
            </div>
          </div>
        )}

        {/* 5. Polaroid Frame */}
        {layout === 'polaroid' && (
          <div className="flex flex-col justify-between h-full bg-[#FCFBF7] p-2 pb-3.5 rounded-sm shadow-md border border-neutral-300">
            <div className="aspect-square bg-neutral-900 border border-neutral-300 overflow-hidden relative">
              {showSamplePhotos ? (
                <img
                  src={samplePhotos[0]}
                  alt="Polaroid Sample"
                  className="w-full h-full object-cover"
                  style={photoFilter ? { filter: photoFilter } : undefined}
                />
              ) : (
                <div className="flex flex-col items-center justify-center h-full">
                  <Camera className="h-6 w-6 text-gray-400" />
                </div>
              )}

              {/* 90s Vintage orange digital quartz date stamp */}
              {isVintage90s && (
                <div className="absolute bottom-1 right-1 px-1 py-0.5 rounded bg-black/60 text-orange-400 font-mono text-[7px] font-bold tracking-wider">
                  &apos;96 10 24
                </div>
              )}
            </div>

            <div className="pt-2 text-center">
              <p className="text-[9px] font-bold text-amber-950 font-sora truncate">
                {eventName || templateName}
              </p>
              {parsedTexts.length > 0 ? (
                parsedTexts.map((txt) => (
                  <p key={txt.id} className="text-[7px] font-medium text-amber-800 truncate" style={{ color: txt.color }}>
                    {txt.text}
                  </p>
                ))
              ) : null}
              {showDate && (
                <p className="text-[7px] text-neutral-500 font-mono italic mt-0.5">
                  {new Date().toLocaleDateString('id-ID', { month: 'short', day: 'numeric', year: 'numeric' })}
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
