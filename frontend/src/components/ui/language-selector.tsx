'use client';

import React from 'react';
import { useLanguage } from '@/context/language-context';
import { Globe } from 'lucide-react';

export function LanguageSelector({ variant = 'default' }: { variant?: 'default' | 'compact' | 'pill' }) {
  const { language, setLanguage } = useLanguage();

  if (variant === 'compact') {
    return (
      <div className="flex items-center bg-gray-100 p-0.5 rounded-lg border border-gray-200 shadow-2xs">
        <button
          onClick={() => setLanguage('id')}
          className={`flex items-center gap-1 px-2 py-1 text-xs font-semibold rounded-md transition-all ${
            language === 'id'
              ? 'bg-white text-[#9D174D] shadow-xs'
              : 'text-gray-500 hover:text-gray-800'
          }`}
          title="Bahasa Indonesia"
        >
          <span>🇮🇩</span>
          <span>ID</span>
        </button>
        <button
          onClick={() => setLanguage('en')}
          className={`flex items-center gap-1 px-2 py-1 text-xs font-semibold rounded-md transition-all ${
            language === 'en'
              ? 'bg-white text-[#9D174D] shadow-xs'
              : 'text-gray-500 hover:text-gray-800'
          }`}
          title="English"
        >
          <span>🇬🇧</span>
          <span>EN</span>
        </button>
      </div>
    );
  }

  return (
    <div className="relative inline-flex items-center bg-gray-50/90 hover:bg-gray-100/90 p-1 rounded-xl border border-gray-200/90 shadow-2xs transition-colors">
      <div className="flex items-center gap-1.5 pl-1.5 pr-1 text-gray-400">
        <Globe className="h-3.5 w-3.5 text-gray-500" />
      </div>

      <div className="flex items-center gap-0.5">
        <button
          type="button"
          onClick={() => setLanguage('id')}
          className={`flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-bold rounded-lg transition-all ${
            language === 'id'
              ? 'bg-[#DE5795] text-white shadow-xs'
              : 'text-gray-500 hover:text-gray-900 hover:bg-white/60'
          }`}
        >
          <span className="text-xs">🇮🇩</span>
          <span>ID</span>
        </button>

        <button
          type="button"
          onClick={() => setLanguage('en')}
          className={`flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-bold rounded-lg transition-all ${
            language === 'en'
              ? 'bg-[#DE5795] text-white shadow-xs'
              : 'text-gray-500 hover:text-gray-900 hover:bg-white/60'
          }`}
        >
          <span className="text-xs">🇬🇧</span>
          <span>EN</span>
        </button>
      </div>
    </div>
  );
}
