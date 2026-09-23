import React, { useState } from 'react';
import { MediaItem } from '../types/project';
import { assetUrl } from '../utils/assetUrl';

interface MediaAssetProps {
  item: MediaItem;
  className?: string;
  priority?: boolean;
}

export const MediaAsset: React.FC<MediaAssetProps> = ({ item, className = '' }) => {
  const [imageError, setImageError] = useState(false);

  // Local files in /public and remote URLs are both real image sources.
  // The old implementation incorrectly treated every /assets/projects path
  // as a placeholder, so files copied into public were never rendered.
  const isStoryGroupAsset = className.includes('story-group-asset');
  const isSquarePreview = className.includes('story-square-asset');
  const resolvedSrc = assetUrl(isSquarePreview && item.previewSrc ? item.previewSrc : item.src);
  const isDirectImage = item.type === 'image' && Boolean(resolvedSrc) && !imageError;
  const isBareImage = item.placeholderType === 'ticket' || item.placeholderType === 'bare';
  const isMoreAsset = className.includes('more-asset');
  const isLightboxAsset = className.includes('lightbox-asset');

  if (isDirectImage) {
    return (
      <div
        className={`media-crop-shell relative inline-flex h-auto w-auto items-center justify-center overflow-hidden max-w-full max-h-full ${className}`}
      >
        <img
          src={resolvedSrc}
          alt={item.title || 'Project preview'}
          onError={() => setImageError(true)}
          className={isLightboxAsset
            ? 'trim-screenshot-edge block h-auto w-auto max-w-full max-h-full object-contain select-none'
            : isStoryGroupAsset
            ? `trim-screenshot-edge block h-full w-full ${className.includes('story-square-asset') ? 'object-cover' : 'object-contain'} select-none`
            : isBareImage && isMoreAsset
            ? 'trim-screenshot-edge block h-full w-auto max-w-full max-h-full object-contain select-none'
            : isBareImage
            ? 'trim-screenshot-edge block h-full w-auto max-w-full max-h-full object-contain select-none drop-shadow-[0_6px_12px_rgba(0,0,0,0.12)]'
            : 'trim-screenshot-edge max-w-full max-h-full w-auto h-auto object-contain select-none'}
          loading="eager"
          decoding="async"
        />
      </div>
    );
  }

  // Pure Placeholder Space:
  // Strictly 390 × 844 viewport dimensions.
  // Zero fake status bars, zero cameras/notches, zero bottom home bars.
  // Just a clean, sophisticated, architectural placeholder canvas ready for local PNG/WEBM assets.
  return (
    <div
      className={`relative flex flex-col justify-between p-4 sm:p-5 md:p-6 bg-white border border-neutral-300/80 rounded-[28px] sm:rounded-[36px] shadow-[0_12px_40px_rgba(0,0,0,0.04)] aspect-[390/844] text-[#1A1A1A] select-none overflow-hidden transition-all duration-300 ${className}`}
    >
      {/* Top Spec Header (Clean Editorial Metadata, NO Fake Status Bar) */}
      <div className="flex items-center justify-between border-b border-black/5 pb-2 text-[9px] font-mono tracking-widest text-[#8E8E8E] uppercase">
        <span className="font-semibold text-[#1A1A1A]">SCREEN SPEC</span>
        <span>390 × 844</span>
      </div>

      {/* Center Narrative & Content Blueprint */}
      <div className="my-auto flex flex-col justify-center space-y-3">
        <div>
          <span className="text-[8px] font-mono tracking-[0.2em] text-[#8E8E8E] uppercase block mb-1">
            390 × 844 VIEWPORT
          </span>
          <h3 className="text-base sm:text-lg font-medium tracking-tight text-[#1A1A1A] leading-snug">
            {item.title}
          </h3>
        </div>

        {/* Minimal Wireframe Blueprint Grid (Architectural representation of the screen) */}
        <div className="w-full p-3 bg-[#FAF9F7] rounded-xl border border-black/5 space-y-2">
          <div className="flex items-center justify-between">
            <div className="w-12 h-1.5 bg-neutral-300 rounded-full" />
            <div className="w-4 h-1.5 bg-neutral-200 rounded-full" />
          </div>
          <div className="w-full h-16 sm:h-20 bg-white rounded-lg border border-dashed border-neutral-300/80 flex flex-col items-center justify-center text-center p-2">
            <span className="text-[9px] font-mono text-[#8E8E8E] tracking-wider uppercase">
              RESERVED FOR LOCAL PNG / WEBM
            </span>
            <span className="text-[8px] text-[#A3A3A3] mt-0.5">
              {item.src.split('/').pop()}
            </span>
          </div>
          <div className="grid grid-cols-2 gap-1.5">
            <div className="h-6 bg-white rounded border border-black/5" />
            <div className="h-6 bg-white rounded border border-black/5" />
          </div>
        </div>
      </div>

      {/* Bottom Architectural Anchor (Clean Frame Information, NO Fake Home Bar) */}
      <div className="pt-2 border-t border-black/5 flex items-center justify-between text-[9px] font-mono text-[#8E8E8E]">
        <span className="tracking-wider uppercase">STAGE ASSET</span>
        <span className="tracking-widest font-medium text-[#1A1A1A]">390 × 844 (1:2.164)</span>
      </div>
    </div>
  );
};
