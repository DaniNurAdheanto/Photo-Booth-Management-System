'use client';

import React from 'react';
import {
  Layers,
  Copy,
  Edit2,
  Trash2,
  CheckCircle2,
  Power,
  Archive,
  Store,
  Sparkles,
  RotateCw,
} from 'lucide-react';
import { Template } from '../types/template.types';
import { TemplatePreview } from './TemplatePreview';

interface TemplateCardProps {
  template: Template;
  onEdit: (template: Template) => void;
  onDuplicate: (template: Template) => void;
  onDelete: (id: string, name: string) => void;
  onToggleActive: (id: string) => void;
  onToggleArchive?: (id: string) => void;
  isToggling?: boolean;
}

export function TemplateCard({
  template,
  onEdit,
  onDuplicate,
  onDelete,
  onToggleActive,
  onToggleArchive,
  isToggling = false,
}: TemplateCardProps) {
  const isActive = template.is_active !== undefined ? template.is_active : template.isActive ?? true;
  const isArchived = template.is_archived !== undefined ? template.is_archived : template.isArchived ?? false;
  const slotsCount = template.slots_count || template.slotsCount || 4;
  const bgColor = template.background_color || template.backgroundColor || '#DE5795';
  const assignedBooth = template.assigned_booth_id || template.assignedBoothId || 'ALL';
  const version = template.version || 1;
  const eventName = template.event_name || template.eventName;

  const layoutLabel: Record<string, string> = {
    '2x6_strip': '2×6 Photo Strip',
    photo_strip: '2×6 Photo Strip',
    '4x6_postcard': '4×6 Postcard',
    postcard: '4×6 Postcard',
    grid_2x2: '2×2 Grid Box',
    collage: 'Collage Grid',
    polaroid: 'Classic Polaroid',
    single_photo: 'Single Portrait',
  };

  return (
    <div
      className={`rounded-2xl border transition-all flex flex-col justify-between overflow-hidden bg-white shadow-xs hover:shadow-md font-sora ${
        isArchived
          ? 'opacity-70 border-dashed border-gray-300 bg-gray-50/50'
          : isActive
          ? 'border-gray-200 hover:border-[#DE5795]/50'
          : 'border-gray-200 opacity-90'
      }`}
    >
      <div>
        {/* Visual Mockup Preview Header */}
        <div className="bg-gray-50/70 p-4 border-b border-gray-100 flex items-center justify-center min-h-[220px] relative">
          {/* Top Badges Bar */}
          <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-20 pointer-events-none">
            <div className="flex items-center gap-1.5 pointer-events-auto">
              <span className="font-mono text-[10px] font-bold text-gray-800 bg-white/95 px-2 py-0.5 rounded-md border border-gray-200 shadow-2xs">
                {template.id}
              </span>
              <span className="font-mono text-[9px] font-semibold text-gray-500 bg-white/90 px-1.5 py-0.5 rounded border border-gray-200">
                v{version}
              </span>
            </div>

            <div className="flex items-center gap-1 pointer-events-auto">
              {isArchived ? (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-gray-200 text-gray-700">
                  Arsip
                </span>
              ) : isActive ? (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  Aktif
                </span>
              ) : (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-gray-100 text-gray-600">
                  Nonaktif
                </span>
              )}
            </div>
          </div>

          {/* Scaled Preview Frame */}
          <div className="transform scale-90 group-hover:scale-95 transition-transform duration-200">
            <TemplatePreview
              layout={template.layout}
              slotsCount={slotsCount}
              backgroundColor={bgColor}
              backgroundGradient={template.background_gradient || template.backgroundGradient}
              backgroundImageUrl={template.background_image_url || template.backgroundImageUrl}
              overlayPngUrl={template.overlay_png_url || template.overlayPngUrl}
              orientation={template.orientation}
              padding={template.padding}
              gap={template.gap}
              borderRadius={template.border_radius || template.borderRadius}
              textElements={template.text_elements || template.textElements}
              logoUrl={template.logo_url || template.logoUrl}
              showDate={template.show_date !== undefined ? template.show_date : template.showDate}
              eventName={eventName}
              templateName={template.name}
              showSamplePhotos={true}
              className={
                template.layout === '2x6_strip' || template.layout === 'photo_strip'
                  ? 'w-[75px] h-[190px]'
                  : template.layout === '4x6_postcard' || template.layout === 'postcard'
                  ? 'w-[155px] h-[105px]'
                  : 'w-[125px] h-[125px]'
              }
            />
          </div>
        </div>

        {/* Card Body Details */}
        <div className="p-4 space-y-2.5">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <h4 className="text-sm font-bold text-gray-900 truncate font-sora">{template.name}</h4>
              <p className="text-[11px] text-gray-500 truncate font-medium">
                {eventName || template.description || 'Tidak ada catatan acara'}
              </p>
            </div>
          </div>

          {/* Badges Strip */}
          <div className="flex flex-wrap items-center gap-1.5 text-[10px]">
            <span className="px-2 py-0.5 rounded-md bg-[#DE5795]/15 text-[#9D174D] font-semibold border border-[#DE5795]/30">
              {layoutLabel[template.layout as string] || template.layout}
            </span>

            <span className="px-2 py-0.5 rounded-md bg-gray-100 text-gray-700 font-medium">
              {slotsCount} Slot Foto
            </span>

            <span className="px-2 py-0.5 rounded-md bg-gray-50 text-gray-600 border border-gray-200 flex items-center gap-1">
              <Store className="w-3 h-3 text-gray-400" />
              <span>{assignedBooth === 'ALL' ? 'Semua Booth' : assignedBooth}</span>
            </span>
          </div>
        </div>
      </div>

      {/* Card Actions Footer */}
      <div className="px-4 py-3 border-t border-gray-100 bg-gray-50/50 flex items-center justify-between text-xs">
        {/* Toggle Status */}
        <button
          onClick={() => onToggleActive(template.id)}
          disabled={isToggling}
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-colors ${
            isActive
              ? 'text-emerald-700 hover:bg-emerald-50'
              : 'text-gray-500 hover:bg-gray-100'
          }`}
          title="Klik untuk mengaktifkan/menonaktifkan"
        >
          <Power className={`w-3.5 h-3.5 ${isActive ? 'text-emerald-600' : 'text-gray-400'}`} />
          <span>{isActive ? 'Aktif' : 'Nonaktif'}</span>
        </button>

        {/* Right Actions */}
        <div className="flex items-center gap-1">
          {/* Duplicate Button */}
          <button
            onClick={() => onDuplicate(template)}
            className="p-1.5 rounded-lg text-gray-500 hover:text-gray-800 hover:bg-white transition-colors"
            title="Duplikasi Template Ini"
          >
            <Copy className="w-3.5 h-3.5" />
          </button>

          {/* Archive Button */}
          {onToggleArchive && (
            <button
              onClick={() => onToggleArchive(template.id)}
              className="p-1.5 rounded-lg text-gray-500 hover:text-gray-800 hover:bg-white transition-colors"
              title={isArchived ? 'Batal Arsipkan' : 'Arsipkan Template'}
            >
              <Archive className={`w-3.5 h-3.5 ${isArchived ? 'text-amber-600' : ''}`} />
            </button>
          )}

          {/* Edit Button */}
          <button
            onClick={() => onEdit(template)}
            className="p-1.5 rounded-lg text-[#DE5795] hover:bg-[#DE5795]/15 transition-colors"
            title="Edit Template"
          >
            <Edit2 className="w-3.5 h-3.5" />
          </button>

          {/* Delete Button */}
          <button
            onClick={() => onDelete(template.id, template.name)}
            className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
            title="Hapus Template"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
