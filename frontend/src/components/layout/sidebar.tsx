'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Store,
  Film,
  CalendarDays,
  Layers,
  CreditCard,
  LogOut,
  ExternalLink,
  Search,
  ChevronsUpDown,
  SlidersHorizontal,
  Images,
  Boxes,
  Users,
} from 'lucide-react';
import { useLanguage } from '@/context/language-context';

interface NavGroup {
  category: string;
  items: {
    label: string;
    href: string;
    icon: React.ComponentType<{ className?: string }>;
  }[];
}

export function Sidebar() {
  const pathname = usePathname();
  const [searchQuery, setSearchQuery] = useState('');
  const { t } = useLanguage();

  const navGroups: NavGroup[] = [
    {
      category: t('sidebar.categories.workspace', undefined, 'WORKSPACE UTAMA'),
      items: [
        { label: t('sidebar.menu.overview', undefined, 'Ringkasan Utama'), href: '/', icon: LayoutDashboard },
        { label: t('sidebar.menu.sessions', undefined, 'Manajemen Sesi Foto'), href: '/sessions', icon: Film },
      ],
    },
    {
      category: t('sidebar.categories.operations', undefined, 'OPERASIONAL KIOSK'),
      items: [
        { label: t('sidebar.menu.booths', undefined, 'Daftar Unit Booth'), href: '/booths', icon: Store },
        { label: t('sidebar.menu.events', undefined, 'Jadwal Acara & Event'), href: '/events', icon: CalendarDays },
        { label: t('sidebar.menu.inventory', undefined, 'Stok & Inventaris'), href: '/inventory', icon: Boxes },
      ],
    },
    {
      category: t('sidebar.categories.crm', undefined, 'PELANGGAN & CRM'),
      items: [
        { label: t('sidebar.menu.customers', undefined, 'Data & Kontak Pelanggan'), href: '/customers', icon: Users },
      ],
    },
    {
      category: t('sidebar.categories.content', undefined, 'KONTEN & ASSET'),
      items: [
        { label: t('sidebar.menu.templates', undefined, 'Template & Desain'), href: '/templates', icon: Layers },
        { label: t('sidebar.menu.gallery', undefined, 'Galeri Tamu & Cloud'), href: '/gallery', icon: Images },
      ],
    },
    {
      category: t('sidebar.categories.finance', undefined, 'FINANSIAL & KASIR'),
      items: [
        { label: t('sidebar.menu.payments', undefined, 'Finansial & Bagi Hasil Mall'), href: '/payments', icon: CreditCard },
      ],
    },
    {
      category: t('sidebar.categories.settings', undefined, 'PENGATURAN & SISTEM'),
      items: [
        { label: t('sidebar.menu.pricing', undefined, 'Tarif & Harga Sesi Kios'), href: '/settings/pricing', icon: SlidersHorizontal },
      ],
    },
  ];

  return (
    <aside className="w-[264px] min-w-[264px] max-w-[264px] h-full border-r border-gray-200/90 bg-white flex flex-col justify-between shrink-0 font-sora select-none">
      {/* Top Header & Searchable Nav Section */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-5">
        {/* 1. Location / Branch Switcher Card */}
        <div className="p-2.5 rounded-2xl border border-gray-200/90 bg-gray-50/70 hover:bg-gray-100/70 hover:border-gray-300 transition-all cursor-pointer group shadow-2xs">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-pink-500 to-[#DE5795] text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-xs">
                <Store className="w-4 h-4 text-white" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-bold text-gray-900 truncate">
                    {t('sidebar.locationTitle', undefined, 'PhotoBooth Central')}
                  </span>
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" title="Online" />
                </div>
                <p className="text-[11px] text-gray-500 truncate">
                  {t('sidebar.locationSub', undefined, 'Grand Indonesia • 3 Booth')}
                </p>
              </div>
            </div>
            <ChevronsUpDown className="w-4 h-4 text-gray-400 group-hover:text-gray-600 shrink-0 ml-1" />
          </div>
        </div>

        {/* 2. Quick Search Menu Box */}
        <div className="relative">
          <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder={t('sidebar.searchPlaceholder', undefined, 'Cari menu & fitur...')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-11 py-2 text-xs bg-gray-50/70 border border-gray-200/90 rounded-xl text-gray-900 placeholder:text-gray-400 focus:outline-hidden focus:bg-white focus:border-[#DE5795] focus:ring-3 focus:ring-[#DE5795]/10 transition-all"
          />
          <kbd className="absolute right-2.5 top-1/2 -translate-y-1/2 px-1.5 py-0.5 text-[9px] font-mono text-gray-400 bg-white border border-gray-200 rounded shadow-2xs">
            ⌘K
          </kbd>
        </div>

        {/* 3. Grouped Navigation with Uppercase Category Labels */}
        <nav className="space-y-4">
          {navGroups.map((group) => {
            const filteredItems = group.items.filter((item) =>
              item.label.toLowerCase().includes(searchQuery.toLowerCase())
            );

            if (filteredItems.length === 0) return null;

            return (
              <div key={group.category} className="space-y-1">
                <p className="px-3 text-[10px] font-bold uppercase tracking-wider text-gray-400">
                  {group.category}
                </p>
                <div className="space-y-0.5 mt-1">
                  {filteredItems.map((item) => {
                    const Icon = item.icon;
                    const isActive =
                      item.href === '/'
                        ? pathname === '/'
                        : pathname.startsWith(item.href);

                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        className={`group relative flex w-full items-center rounded-xl px-3 py-2 text-xs transition-all ${
                          isActive
                            ? 'bg-pink-50 text-[#9D174D] font-semibold shadow-2xs border border-pink-200/80'
                            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 font-medium'
                        }`}
                      >
                        {/* Left Active Indicator Bar */}
                        {isActive && (
                          <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 rounded-r-full bg-[#DE5795]" />
                        )}

                        <div className="flex items-center gap-2.5 min-w-0">
                          <Icon
                            className={`h-4 w-4 shrink-0 transition-colors ${
                              isActive
                                ? 'text-[#DE5795]'
                                : 'text-gray-400 group-hover:text-gray-600'
                            }`}
                          />
                          <span className="truncate">{item.label}</span>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </nav>

        {/* 4. Interactive Kiosk Quick Launch Card */}
        <div className="rounded-2xl border border-gray-200/90 bg-gradient-to-b from-gray-50 to-pink-50/30 p-3.5 space-y-2.5 shadow-2xs">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#DE5795] animate-ping" />
              <span className="text-xs font-bold text-gray-900">
                {t('sidebar.kioskTitle', undefined, 'Layar Kios Tamu')}
              </span>
            </div>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
              {t('sidebar.kioskReady', undefined, 'Siaga')}
            </span>
          </div>
          <p className="text-[11px] text-gray-500 leading-snug">
            {t('sidebar.kioskDescription', undefined, 'Buka tampilan layar sentuh interaktif untuk pengunjung photo booth.')}
          </p>
          <Link
            href="/sessions/booth"
            target="_blank"
            className="flex items-center justify-center gap-1.5 w-full py-2 px-3 text-xs font-semibold rounded-xl bg-[#DE5795] hover:bg-[#c93d7e] text-white shadow-xs transition-colors"
          >
            <span>{t('sidebar.openKiosk', undefined, 'Buka Layar Kios')}</span>
            <ExternalLink className="h-3.5 w-3.5 text-white" />
          </Link>
        </div>
      </div>

      {/* 5. User Profile Footer */}
      <div className="p-3 border-t border-gray-200/90 bg-white">
        <div className="flex items-center justify-between p-2 rounded-xl hover:bg-gray-50 transition-colors">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="relative">
              <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-[#DE5795] to-pink-400 text-white font-bold text-xs flex items-center justify-center shrink-0 shadow-xs">
                DA
              </div>
              <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-emerald-500 ring-2 ring-white" />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-bold text-gray-900 truncate">Dani Adheanto</p>
              <p className="text-[10px] text-gray-500 truncate">
                {t('sidebar.userRole', undefined, 'Super Admin Operasional')}
              </p>
            </div>
          </div>
          <button
            className="text-gray-400 hover:text-gray-600 p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
            title={t('sidebar.logout', undefined, 'Keluar / Ganti Akun')}
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>
    </aside>
  );
}
