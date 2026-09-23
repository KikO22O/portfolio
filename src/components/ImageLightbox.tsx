import React from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { X } from 'lucide-react';
import { MediaItem } from '../types/project';
import { assetUrl } from '../utils/assetUrl';

interface ImageLightboxProps {
  item: MediaItem | null;
  onClose: () => void;
}

export const ImageLightbox: React.FC<ImageLightboxProps> = ({ item, onClose }) => (
  <AnimatePresence>
    {item && (
      <motion.div
        className="fixed inset-0 z-[100] flex items-center justify-center bg-black/45 p-5 backdrop-blur-sm cursor-zoom-out"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className="relative max-h-full max-w-full overflow-visible"
          initial={{ opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.94 }}
          onClick={(event) => event.stopPropagation()}
        >
          <img
            src={assetUrl(item.src)}
            alt={item.title || 'Project preview'}
            className="block h-auto w-auto max-h-[calc(100dvh-40px)] max-w-[calc(100vw-40px)] rounded-[18px] object-contain select-none"
          />
          <button
            type="button"
            aria-label="关闭大图"
            onClick={onClose}
            className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-white text-[#1A1A1A] shadow-lg"
          >
            <X className="h-4 w-4" strokeWidth={1.5} />
          </button>
        </motion.div>
      </motion.div>
    )}
  </AnimatePresence>
);
