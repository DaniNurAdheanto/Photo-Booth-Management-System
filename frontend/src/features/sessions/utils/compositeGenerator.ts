import { FilterPreset } from '../types/session.types';

export interface GenerateCompositeOptions {
  photos: { slot: number; url: string }[];
  layout: string;
  backgroundColor: string;
  templateName: string;
  filterPreset: FilterPreset;
}

export async function generateCompositeImage(options: GenerateCompositeOptions): Promise<string> {
  const { photos, layout, backgroundColor, templateName, filterPreset } = options;

  let width = 600;
  let height = 1800;

  if (layout === '4x6_postcard') {
    width = 1800;
    height = 1200;
  } else if (layout === '2x2_grid') {
    width = 1200;
    height = 1200;
  } else if (layout === 'polaroid') {
    width = 1000;
    height = 1200;
  }

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) return '';

  // 1. Draw Background
  ctx.fillStyle = backgroundColor || '#DE5795';
  ctx.fillRect(0, 0, width, height);

  // 2. Add subtle texture or border
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 12;
  ctx.strokeRect(12, 12, width - 24, height - 24);

  // Helper to load image
  const loadImage = (src: string): Promise<HTMLImageElement> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => resolve(img);
      img.onerror = () => {
        // Fallback: draw placeholder on failure
        const fallback = new Image();
        fallback.src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="600" height="400" viewBox="0 0 600 400"><rect width="600" height="400" fill="%23e2e8f0"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-family="sans-serif" font-size="24" fill="%2364748b">Photo Capture</text></svg>';
        fallback.onload = () => resolve(fallback);
      };
      img.src = src;
    });
  };

  // Helper to apply filter
  const applyFilter = (context: CanvasRenderingContext2D, filter: FilterPreset) => {
    if (filter === 'BW') {
      context.filter = 'grayscale(100%) contrast(110%)';
    } else if (filter === 'WARM') {
      context.filter = 'sepia(35%) saturate(140%) hue-rotate(-10deg) brightness(105%)';
    } else if (filter === 'VINTAGE') {
      context.filter = 'sepia(50%) contrast(90%) brightness(110%)';
    } else {
      context.filter = 'none';
    }
  };

  // 3. Render Photo Slots based on layout
  if (layout === '2x6_strip') {
    const pad = 30;
    const slotW = width - pad * 2;
    const slotH = 340;
    const topOffset = 40;

    for (let i = 0; i < 4; i++) {
      const photoItem = photos.find((p) => p.slot === i);
      const y = topOffset + i * (slotH + 20);

      // White frame behind photo
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(pad - 4, y - 4, slotW + 8, slotH + 8);

      if (photoItem && photoItem.url) {
        try {
          const img = await loadImage(photoItem.url);
          ctx.save();
          applyFilter(ctx, filterPreset);
          ctx.drawImage(img, pad, y, slotW, slotH);
          ctx.restore();
        } catch (e) {
          ctx.fillStyle = '#cbd5e1';
          ctx.fillRect(pad, y, slotW, slotH);
        }
      } else {
        ctx.fillStyle = '#e2e8f0';
        ctx.fillRect(pad, y, slotW, slotH);
      }
    }

    // Footer Branding
    ctx.fillStyle = '#470F29';
    ctx.font = 'bold 36px Sora, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('PHOTO BOOTH', width / 2, height - 100);

    ctx.font = '22px Sora, sans-serif';
    ctx.fillStyle = '#8C2454';
    ctx.fillText(templateName || 'Moments to Remember', width / 2, height - 60);

    const dateStr = new Date().toLocaleDateString('id-ID', { year: 'numeric', month: 'short', day: 'numeric' });
    ctx.font = '16px Sora, sans-serif';
    ctx.fillStyle = '#A92B66';
    ctx.fillText(dateStr, width / 2, height - 30);
  } else if (layout === '2x2_grid') {
    const pad = 40;
    const gap = 24;
    const slotW = (width - pad * 2 - gap) / 2;
    const slotH = (height - 240 - gap) / 2;

    for (let i = 0; i < 4; i++) {
      const row = Math.floor(i / 2);
      const col = i % 2;
      const x = pad + col * (slotW + gap);
      const y = pad + row * (slotH + gap);

      ctx.fillStyle = '#ffffff';
      ctx.fillRect(x - 4, y - 4, slotW + 8, slotH + 8);

      const photoItem = photos.find((p) => p.slot === i);
      if (photoItem && photoItem.url) {
        try {
          const img = await loadImage(photoItem.url);
          ctx.save();
          applyFilter(ctx, filterPreset);
          ctx.drawImage(img, x, y, slotW, slotH);
          ctx.restore();
        } catch (e) {
          ctx.fillStyle = '#cbd5e1';
          ctx.fillRect(x, y, slotW, slotH);
        }
      } else {
        ctx.fillStyle = '#e2e8f0';
        ctx.fillRect(x, y, slotW, slotH);
      }
    }

    // Bottom Branding
    ctx.fillStyle = '#470F29';
    ctx.font = 'bold 44px Sora, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(templateName || 'PHOTO BOOTH MOMENTS', width / 2, height - 100);

    ctx.font = '22px Sora, sans-serif';
    ctx.fillStyle = '#8C2454';
    ctx.fillText(new Date().toDateString(), width / 2, height - 50);
  } else {
    // Default / Postcard / Polaroid
    const pad = 40;
    const count = Math.max(1, photos.length);
    const slotH = (height - 250) / count;

    for (let i = 0; i < count; i++) {
      const y = pad + i * (slotH + 15);
      const photoItem = photos.find((p) => p.slot === i);

      ctx.fillStyle = '#ffffff';
      ctx.fillRect(pad - 4, y - 4, width - pad * 2 + 8, slotH + 8);

      if (photoItem && photoItem.url) {
        try {
          const img = await loadImage(photoItem.url);
          ctx.save();
          applyFilter(ctx, filterPreset);
          ctx.drawImage(img, pad, y, width - pad * 2, slotH);
          ctx.restore();
        } catch (e) {
          ctx.fillStyle = '#cbd5e1';
          ctx.fillRect(pad, y, width - pad * 2, slotH);
        }
      }
    }

    ctx.fillStyle = '#470F29';
    ctx.font = 'bold 36px Sora, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('PHOTO BOOTH', width / 2, height - 70);
  }

  return canvas.toDataURL('image/jpeg', 0.92);
}
