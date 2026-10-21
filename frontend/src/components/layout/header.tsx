'use client';

import React from 'react';
import { Camera, Search, Bell } from 'lucide-react';
import { useLanguage } from '@/context/language-context';
import { LanguageSelector } from '@/components/ui/language-selector';

export function Header() {
  const { t } = useLanguage();

  return (
    <header className="sticky top-0 z-30 border-b border-gray-200 bg-white/95 backdrop-blur-md">
      <div className="flex h-16 items-center justify-between px-6 lg:px-8">
        {/* Brand & Title */}
        <div className="flex items-center gap-3.5">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#DE5795] text-white border border-[#DE5795] shadow-xs">
            <Camera className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-sm font-bold tracking-tight text-gray-900 font-sora">
                {t('header.brandTitle', undefined, 'PhotoBooth OS')}
              </h1>
              <span className="hidden sm:inline-block px-2 py-0.5 text-[10px] font-semibold bg-[#DE5795]/15 text-[#9D174D] rounded-full border border-[#DE5795]/30">
                {t('header.operationalBadge', undefined, 'Operasional')}
              </span>
            </div>
            <p className="text-xs text-gray-500 font-medium">
              {t('header.subtitle', undefined, 'Sistem Manajemen & Kiosk Foto')}
            </p>
          </div>
        </div>

        {/* Search Bar */}
        <div className="hidden md:flex items-center relative w-72">
          <Search className="absolute left-3 h-4 w-4 text-gray-400 pointer-events-none" />
          <input
            type="text"
            placeholder={t('header.searchPlaceholder', undefined, 'Cari booth, sesi foto, template...')}
            className="w-full pl-9 pr-12 py-2 text-xs bg-gray-50 border border-gray-300 rounded-lg text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-4 focus:ring-[#DE5795]/20 focus:border-[#DE5795] transition-all shadow-xs"
            readOnly
          />
          <div className="absolute right-2.5 flex items-center gap-0.5">
            <kbd className="px-1.5 py-0.5 text-[10px] font-mono text-gray-500 bg-white border border-gray-200 rounded shadow-xs">
              ⌘K
            </kbd>
          </div>
        </div>

        {/* Status Indicators, Language Switcher & Profile */}
        <div className="flex items-center gap-3 sm:gap-4">
          <div className="hidden lg:flex items-center gap-2.5">
            <div className="flex items-center gap-2 px-3 py-1 bg-pink-50/60 text-[#9D174D] text-xs font-semibold rounded-lg border border-[#DE5795]/30 shadow-xs">
              <span className="h-2 w-2 rounded-full bg-[#DE5795] animate-pulse" />
              <span>{t('header.allSystemsNormal', undefined, 'Semua Sistem Normal')}</span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1 bg-gray-50 text-gray-700 text-xs font-medium rounded-lg border border-gray-200">
              <Camera className="h-3.5 w-3.5 text-gray-500" />
              <span>{t('header.boothsReady', { count: 3 }, '3 Booth Siaga')}</span>
            </div>
          </div>

          <div className="h-6 w-px bg-gray-200 hidden sm:block" />

          {/* Language Selector */}
          <LanguageSelector />

          {/* Action Bell */}
          <button
            className="relative p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            title={t('header.notifications', undefined, 'Notifikasi')}
          >
            <Bell className="h-4 w-4" />
            <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-[#DE5795] ring-2 ring-white" />
          </button>

          {/* User Profile Avatar */}
          <div className="flex items-center gap-2.5 pl-1">
            <div className="relative">
              <div className="h-9 w-9 rounded-full bg-[#DE5795] text-white font-bold flex items-center justify-center text-xs shadow-xs border border-[#DE5795]">
                DA
              </div>
              <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-emerald-500 ring-2 ring-white" />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
