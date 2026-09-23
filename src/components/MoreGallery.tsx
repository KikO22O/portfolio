import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X } from 'lucide-react';
import { MediaItem } from '../types/project';
import { MediaAsset } from './MediaAsset';

interface MoreGalleryProps {
  items: MediaItem[];
}

export const MoreGallery: React.FC<MoreGalleryProps> = ({ items }) => {
  const [activeExpandedItem, setActiveExpandedItem] = useState<MediaItem | null>(null);
  const isFourImageBareGallery = items.length === 4 && items.every((item) => item.placeholderType === 'bare');
  const isThreeImageBareGallery = items.length === 3 && items.every((item) => item.placeholderType === 'bare');
  const isBareGallery = isFourImageBareGallery || isThreeImageBareGallery;

  return (
    <div className="relative w-full h-full min-h-0 box-border flex flex-col items-center justify-center px-4 overflow-hidden pt-4 pb-10">
      {/* Loose, Floating Gallery Layout without Card Slop */}
      <div className={isFourImageBareGallery
          ? 'grid grid-cols-2 md:grid-cols-4 grid-rows-2 md:grid-rows-1 items-center justify-items-center gap-x-[clamp(12px,3vw,48px)] gap-y-4 md:gap-y-0 min-h-0 h-full w-full max-w-[1600px] overflow-visible'
        : isThreeImageBareGallery
          ? 'grid grid-cols-2 md:grid-cols-3 grid-rows-2 md:grid-rows-1 items-center justify-items-center gap-x-[clamp(12px,3vw,48px)] gap-y-4 md:gap-y-0 min-h-0 h-full w-full max-w-[1200px] overflow-visible'
        : 'flex flex-wrap items-center justify-center gap-6 sm:gap-8 md:gap-12 max-w-5xl'}>
        {items.map((item, index) => (
          <div
            key={item.id}
            onClick={() => setActiveExpandedItem(item)}
            className={`group cursor-pointer flex flex-col items-center transition-all duration-300 opacity-100 ${
              isBareGallery ? `min-h-0 h-full w-full min-w-0 justify-between ${
                isThreeImageBareGallery && index === 0 ? 'col-span-2 md:col-span-1' : ''
              }` : ''
            }`}
          >
            {/* Asset itself directly in whitespace */}
            <div className={`transition-transform duration-300 ease-out group-hover:scale-[1.015] flex items-center justify-center ${
              isBareGallery ? 'min-h-0 flex-1 w-full min-w-0 max-w-full' : 'max-h-[38vh] sm:max-h-[44vh]'
            }`}>
              <MediaAsset
                item={item}
                className={isBareGallery
                  ? 'more-asset h-full max-h-full max-w-full'
                  : 'max-h-[36vh] sm:max-h-[42vh]'}
              />
            </div>

            {/* Editorial Typographic Tag */}
            <div className={`relative z-20 text-center ${isBareGallery ? 'mt-2 h-5 shrink-0 overflow-visible' : 'mt-3'}`}>
              <p className="border border-white bg-white px-2 py-0.5 text-xs text-[#666666] font-normal tracking-wide mt-0.5 group-hover:text-[#1A1A1A] transition-colors">
                {item.title}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Enlarged Single Asset Focus Overlay */}
      <AnimatePresence>
        {activeExpandedItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="viewport-overlay fixed inset-0 z-50 bg-[#F7F7F5]/95 backdrop-blur-[20px] flex flex-col items-center justify-center p-6 md:p-12"
          >
            {/* Close button */}
            <button
              onClick={() => setActiveExpandedItem(null)}
              aria-label="Close enlarged view"
              className="absolute top-6 right-6 sm:top-10 sm:right-10 w-12 h-12 rounded-full flex items-center justify-center bg-white/50 backdrop-blur-[10px] border border-black/5 text-[#1A1A1A] hover:bg-white hover:scale-105 shadow-[0_4px_20px_rgba(0,0,0,0.03)] transition-all cursor-pointer"
            >
              <X className="w-5 h-5 stroke-[1.5]" />
            </button>

            {/* Focus Asset */}
            <div className="flex-1 flex flex-col items-center justify-center max-h-[75vh]">
              <MediaAsset
                item={activeExpandedItem}
                className={activeExpandedItem.placeholderType === 'bare' || activeExpandedItem.placeholderType === 'ticket'
                  ? 'h-[72vh] max-h-[72vh] max-w-[90vw]'
                  : 'max-h-[68vh] md:max-h-[72vh]'}
              />
              <div className="mt-4 text-center">
                <h4 className="text-sm md:text-base font-medium text-[#1A1A1A] tracking-tight">
                  {activeExpandedItem.title}
                </h4>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
