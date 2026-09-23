import React, { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { X } from 'lucide-react';
import { MediaItem } from '../types/project';
import { MediaAsset } from './MediaAsset';

interface CocktailGalleryProps {
  items: MediaItem[];
}

export const CocktailGallery: React.FC<CocktailGalleryProps> = ({ items }) => {
  const [mobileOrder, setMobileOrder] = useState([0, 2, 1]);
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  const orderedItems = useMemo(() => [0, 2, 1].map((index) => items[index]).filter(Boolean), [items]);

  useEffect(() => {
    setMobileOrder([0, 2, 1]);
  }, [items]);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(max-width: 767px)');
    let timer: number | undefined;
    const startCarousel = () => {
      if (timer !== undefined) window.clearInterval(timer);
      if (!mediaQuery.matches) return;
      timer = window.setInterval(() => {
        // 2 → 1, 3 → 2, 1 → 3: move each ticket to the next fan position.
        setMobileOrder((current) => [current[1], current[2], current[0]]);
      }, 2000);
    };
    startCarousel();
    mediaQuery.addEventListener('change', startCarousel);
    return () => {
      if (timer !== undefined) window.clearInterval(timer);
      mediaQuery.removeEventListener('change', startCarousel);
    };
  }, [expandedIndex]);

  useEffect(() => {
    if (expandedIndex === null) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setExpandedIndex(null);
    };
    window.addEventListener('keydown', closeOnEscape);
    return () => window.removeEventListener('keydown', closeOnEscape);
  }, [expandedIndex]);

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center px-3">
      <div className="hidden md:flex items-center justify-center gap-[clamp(20px,4vw,72px)] w-full h-[72dvh] max-w-[1800px]">
        {orderedItems.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => {
              // DouBar keeps the same rule as the fan layout: only the
              // visually top/primary ticket opens the enlarged view.
              if (items.indexOf(item) === 2) setExpandedIndex(2);
            }}
            className={`h-full w-auto min-w-0 flex items-center justify-center ${items.indexOf(item) === 2 ? 'cursor-zoom-in' : 'cursor-default'}`}
          >
            <MediaAsset item={item} className="h-full w-auto max-w-full" />
          </button>
        ))}
      </div>

      <div className="md:hidden relative w-full h-[calc(100dvh-250px)] max-w-[390px]">
        <AnimatePresence initial={false}>
        {mobileOrder.map((itemIndex, position) => {
          const item = items[itemIndex];
          if (!item) return null;
          const isFront = position === 1;
          const rotation = position === 0 ? -5 : position === 2 ? 5 : 0;
          // The card centers follow a shallow circular arc: the outer cards
          // sit slightly lower while all three remain visibly overlapped.
          const xOffset = position === 0 ? -58 : position === 2 ? 58 : 0;
          const yOffset = position === 1 ? -4 : 10;
          return (
            <motion.button
              key={item.id}
              type="button"
              initial={false}
              animate={{ x: `calc(-50% + ${xOffset}px)`, y: `calc(-50% + ${yOffset}px)`, rotate: rotation, scale: isFront ? 1 : 0.985 }}
              transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
              onClick={() => { if (isFront) setExpandedIndex(itemIndex); }}
              className={`absolute left-1/2 top-1/2 h-full w-auto max-w-[90vw] flex items-center justify-center ${isFront ? 'cursor-zoom-in' : 'cursor-default'}`}
              style={{
                zIndex: isFront ? 10 : position === 0 ? 2 : 1,
                pointerEvents: isFront ? 'auto' : 'none',
              }}
              aria-label={isFront ? `查看${item.title || '票根'}大图` : undefined}
            >
              <MediaAsset item={item} className="h-full w-auto max-w-[90vw]" />
            </motion.button>
          );
        })}
        </AnimatePresence>
      </div>

      <p className="relative z-40 mt-3 rounded-[10px] border border-white bg-white px-2.5 py-1.5 text-[11.5px] text-[#1A1A1A] font-medium tracking-tight text-center">
        图片生成结果示意
      </p>

      <AnimatePresence>
        {expandedIndex !== null && items[expandedIndex] && (
          <motion.div
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/45 p-5 backdrop-blur-sm cursor-zoom-out"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setExpandedIndex(null)}
          >
            <motion.div
              className="relative max-h-full max-w-full"
              initial={{ opacity: 0, scale: 0.94 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.94 }}
              onClick={(event) => event.stopPropagation()}
            >
              <img
                src={items[expandedIndex].src}
                alt={items[expandedIndex].title || 'Project preview'}
                className="block h-auto w-auto max-h-[calc(100dvh-40px)] max-w-[calc(100vw-40px)] object-contain select-none"
              />
              <button type="button" aria-label="关闭大图" onClick={() => setExpandedIndex(null)} className="absolute -right-3 -top-3 flex h-8 w-8 items-center justify-center rounded-full bg-white text-[#1A1A1A] shadow-lg">
                <X className="h-4 w-4" strokeWidth={1.5} />
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
