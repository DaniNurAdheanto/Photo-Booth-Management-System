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
  backgroundColor = '#C1E3D0',
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

  // Background style
  const bgStyle: React.CSSProperties = {
    backgroundColor: backgroundColor || '#C1E3D0',
    backgroundImage: backgroundGradient
      ? backgroundGradient
      : backgroundImageUrl
      ? `url(${backgroundImageUrl})`
      : undefined,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  };

  const isLandscape = orientation === 'LANDSCAPE' || layout === '4x6_postcard' || layout === 'postcard';

  return (
    <div
      className={`relative mx-auto rounded-xl shadow-md border border-gray-200/90 transition-all overflow-hidden flex flex-col justify-between font-poppins select-none ${className}`}
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

      {/* Main Content Area */}
      <div className="relative z-10 flex flex-col justify-between h-full w-full p-3">
        {/* Top Header / Logo Space (if logo provided) */}
        {logoUrl && (
          <div className="flex items-center justify-center mb-1">
            <img src={logoUrl} alt="Event Logo" className="h-6 object-contain" />
          </div>
        )}

        {/* ============================================================== */}
        {/* LAYOUT RENDERERS                                               */}
        {/* ============================================================== */}

        {/* 1. Strip 2x6 (Vertical 3 or 4 photos) */}
        {(layout === '2x6_strip' || layout === 'photo_strip') && (
          <div className="flex flex-col justify-between h-full gap-1.5 flex-1">
            <div className="flex flex-col gap-1.5 flex-1">
              {actualSlots.map((slotIdx) => (
                <div
                  key={slotIdx}
                  className="flex-1 min-h-[44px] bg-white/95 border border-white/60 shadow-xs flex flex-col items-center justify-center text-gray-500 overflow-hidden relative group"
                  style={{ borderRadius: `${borderRadius}px` }}
                >
                  {showSamplePhotos ? (
                    <img
                      src={samplePhotos[slotIdx % samplePhotos.length]}
                      alt={`Slot ${slotIdx + 1}`}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center">
                      <Camera className="h-3 w-3 text-gray-400" />
                      <span className="text-[8px] font-mono text-gray-400">Slot {slotIdx + 1}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Bottom Typography & Branding */}
            <div className="pt-1.5 text-center border-t border-black/10">
              <p className="text-[9px] font-black uppercase text-[#133825] truncate">
                {eventName || templateName}
              </p>
              {parsedTexts.length > 0 ? (
                parsedTexts.map((txt) => (
                  <p key={txt.id} className="text-[7.5px] font-medium text-[#2C6D4C] truncate" style={{ color: txt.color }}>
                    {txt.text}
                  </p>
                ))
              ) : (
                <p className="text-[7px] text-[#418B63] font-medium">Moments to Remember</p>
              )}
              {showDate && (
                <p className="text-[6.5px] text-gray-500 font-mono mt-0.5">
                  {new Date().toLocaleDateString('id-ID', { year: 'numeric', month: 'short', day: 'numeric' })}
                </p>
              )}
            </div>
          </div>
        )}

        {/* 2. Grid 2x2 / Collage */}
        {(layout === 'grid_2x2' || layout === 'collage') && (
          <div className="flex flex-col justify-between h-full gap-2 flex-1">
            <div className="grid grid-cols-2 gap-1.5 flex-1">
              {actualSlots.slice(0, 4).map((slotIdx) => (
                <div
                  key={slotIdx}
                  className="aspect-square bg-white/95 border border-white/60 shadow-xs flex flex-col items-center justify-center overflow-hidden relative"
                  style={{ borderRadius: `${borderRadius}px` }}
                >
                  {showSamplePhotos ? (
                    <img
                      src={samplePhotos[slotIdx % samplePhotos.length]}
                      alt={`Slot ${slotIdx + 1}`}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <Camera className="h-4 w-4 text-gray-400" />
                  )}
                </div>
              ))}
            </div>

            <div className="pt-1 text-center border-t border-black/10">
              <p className="text-[9px] font-bold text-[#133825] truncate">
                {eventName || templateName}
              </p>
              {showDate && (
                <p className="text-[7px] text-gray-500 font-mono">
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
                  className="aspect-4/3 bg-white/95 border border-white/60 shadow-xs flex flex-col items-center justify-center overflow-hidden relative"
                  style={{ borderRadius: `${borderRadius}px` }}
                >
                  {showSamplePhotos ? (
                    <img
                      src={samplePhotos[slotIdx % samplePhotos.length]}
                      alt={`Slot ${slotIdx + 1}`}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <Camera className="h-4 w-4 text-gray-400" />
                  )}
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between px-1 pt-1 border-t border-black/10 text-[8px]">
              <span className="font-bold text-[#133825] truncate">{eventName || templateName}</span>
              {showDate && <span className="text-gray-500 font-mono">{new Date().getFullYear()}</span>}
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
                />
              ) : (
                <div className="flex flex-col items-center justify-center h-full">
                  <Camera className="h-6 w-6 text-gray-400 mb-1" />
                  <span className="text-xs text-gray-500">Single Photo Focus</span>
                </div>
              )}
            </div>

            <div className="text-center pt-1 border-t border-black/10">
              <p className="text-[10px] font-bold text-[#133825] truncate">{eventName || templateName}</p>
            </div>
          </div>
        )}

        {/* 5. Polaroid Frame */}
        {layout === 'polaroid' && (
          <div className="flex flex-col justify-between h-full bg-white p-2 pb-4 rounded-sm shadow-md">
            <div className="aspect-square bg-gray-100 border border-gray-200 overflow-hidden relative">
              {showSamplePhotos ? (
                <img
                  src={samplePhotos[0]}
                  alt="Polaroid Sample"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="flex flex-col items-center justify-center h-full">
                  <Camera className="h-6 w-6 text-gray-400" />
                </div>
              )}
            </div>

            <div className="pt-2 text-center">
              <p className="text-[10px] font-semibold text-gray-800 font-poppins truncate">
                {eventName || templateName}
              </p>
              {showDate && (
                <p className="text-[7.5px] text-gray-400 italic">
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
