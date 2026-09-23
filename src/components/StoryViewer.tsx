import React, { useEffect, useCallback, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MediaItem } from '../types/project';
import { MediaAsset } from './MediaAsset';
import { CocktailGallery } from './CocktailGallery';
import { ImageLightbox } from './ImageLightbox';
import { PORTRAIT_SHELL, PORTRAIT_FRAME, PORTRAIT_CAPTION_SPACE, PORTRAIT_FOOTER_SIZE } from './portraitLayout';

interface StoryGroupGalleryProps {
  items: MediaItem[];
  pageTitle?: string;
  pageNumber: number;
  pageTotal: number;
}

const STORY_MEDIA_SHELL_CLASS = PORTRAIT_SHELL;

const StoryGroupGallery: React.FC<StoryGroupGalleryProps> = ({
  items,
  pageTitle,
  pageNumber,
  pageTotal,
}) => {
  const [expandedItem, setExpandedItem] = useState<MediaItem | null>(null);
  const groupDefaults = items[0] || {};
  const isSquareGrid = items.length === 8 && groupDefaults.aspectRatio === '1/1';
  const gridStyle = {
    '--story-mobile-columns': groupDefaults.mobileColumns || 2,
    '--story-desktop-columns': groupDefaults.desktopColumns || 2,
  } as React.CSSProperties;

  return (
  <>
  <div className="relative w-full h-full flex flex-col items-center justify-center px-3">
    <div className="relative flex flex-col items-center justify-center w-full">
      <div className={`${STORY_MEDIA_SHELL_CLASS} w-full`}>
        <div className={`relative w-full ${isSquareGrid ? 'max-w-[1120px]' : 'max-w-[820px] md:max-w-none'}`}>
          <div className={`story-group-grid ${isSquareGrid ? 'story-square-grid' : 'product-portrait-grid'} items-start justify-items-center`} style={gridStyle}>
            {items.map((item, index) => (
              <div
                key={item.id}
                onClick={() => setExpandedItem(item)}
                style={{
                  '--story-mobile-order': item.mobileOrder ?? index,
                  '--story-desktop-order': item.desktopOrder ?? index,
                } as React.CSSProperties}
                className={`story-group-grid-item ${isSquareGrid ? 'story-square-grid-item' : ''} min-w-0 w-full flex flex-col items-center cursor-zoom-in`}
              >
                <div className="min-h-0 w-full flex items-center justify-center">
                  <div className={`w-full ${isSquareGrid ? 'story-square-grid-frame' : 'min-h-0 max-w-[33.2dvh] md:max-w-none product-portrait-frame'}`} style={{ aspectRatio: item.aspectRatio || '393/852' }}>
                    <MediaAsset item={item} className={`story-group-asset h-full w-full rounded-[10px] ${isSquareGrid ? 'story-square-asset' : ''}`} />
                  </div>
                </div>
                {item.caption && (
                  <p className="mt-2 shrink-0 border border-white bg-white px-2 py-0.5 text-center text-[11px] text-[#8E8E8E] tracking-wide">
                    {item.caption}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
      {pageTitle && !groupDefaults.hideGroupTitle && (
        <div className="relative z-40 mt-3 mx-auto flex w-fit max-w-full items-center gap-7 rounded-[10px] border border-white bg-white px-2.5 py-1.5 sm:px-3 select-none">
          <div className="flex min-w-0 items-center gap-2 text-[#1A1A1A]">
            <span className="font-mono text-[11px] sm:text-[12px] font-semibold tracking-wider">
              {String(pageNumber).padStart(2, '0')}
            </span>
            <span className="truncate text-[11.5px] sm:text-[12.5px] font-medium tracking-tight">
              {pageTitle}
            </span>
          </div>
          <span className="ml-2 shrink-0 font-mono text-[11px] sm:text-[12px] tracking-wider text-[#8E8E8E]">
            / {String(pageTotal).padStart(2, '0')}
          </span>
        </div>
      )}
    </div>
  </div>
  <ImageLightbox item={expandedItem} onClose={() => setExpandedItem(null)} />
  </>
  );
};

interface StoryViewerProps {
  items: MediaItem[];
  currentIndex: number;
  onSelectIndex: (index: number) => void;
  onNavigate: (direction: -1 | 1) => void;
}

export const StoryViewer: React.FC<StoryViewerProps> = ({
  items,
  currentIndex,
  onSelectIndex,
  onNavigate,
}) => {
  const currentItem = items[currentIndex] || items[0];
  const total = items.length;
  const isCocktailGallery = items.length === 3 && items.every((item) => item.placeholderType === 'ticket');
  const groupedItems = currentItem?.groupId
    ? items.filter((item) => item.groupId === currentItem.groupId)
    : [];
  const pageStartIndices = items.reduce((indices: number[], item, index) => {
    if (index === 0 || !item.groupId || item.groupId !== items[index - 1].groupId) {
      indices.push(index);
    }
    return indices;
  }, []);
  const currentPageIndex = Math.max(0, pageStartIndices.findIndex((index) => {
    const pageItem = items[index];
    return pageItem.groupId
      ? pageItem.groupId === currentItem.groupId
      : index === currentIndex;
  }));

  const handlePrev = useCallback(() => onNavigate(-1), [onNavigate]);
  const handleNext = useCallback(() => onNavigate(1), [onNavigate]);

  // Ref to track mockup's rendered pixel width dynamically
  const mockupRef = useRef<HTMLDivElement>(null);
  const [mockupWidth, setMockupWidth] = useState<number>(0);
  const [expandedItem, setExpandedItem] = useState<MediaItem | null>(null);

  useEffect(() => {
    const el = mockupRef.current;
    if (!el) return;

    const measure = () => {
      const rect = el.getBoundingClientRect();
      if (rect.width > 0) {
        setMockupWidth(Math.round(rect.width));
      }
    };

    measure();

    const ro = new ResizeObserver((entries) => {
      for (const entry of entries) {
        if (entry.contentRect.width > 0) {
          setMockupWidth(Math.round(entry.contentRect.width));
        }
      }
    });

    ro.observe(el);
    window.addEventListener('resize', measure);

    return () => {
      ro.disconnect();
      window.removeEventListener('resize', measure);
    };
  }, [currentIndex]);

  useEffect(() => {
    if (!expandedItem) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setExpandedItem(null);
    };
    window.addEventListener('keydown', closeOnEscape);
    return () => window.removeEventListener('keydown', closeOnEscape);
  }, [expandedItem]);

  // Format indices and clean title (clean up to 8 characters)
  const currentNum = String(currentPageIndex + 1).padStart(2, '0');
  const totalNum = String(pageStartIndices.length).padStart(2, '0');
  const cleanTitle = (currentItem.groupTitle || currentItem.title || '')
    .replace(/^\d+[\s·.-]*/, '')
    .trim();
  const isPortraitMockup = currentItem.placeholderType === 'mobile';

  if (isCocktailGallery) {
    return <CocktailGallery items={items} />;
  }

  if (groupedItems.length > 1) {
    return (
      <StoryGroupGallery
        items={groupedItems}
        pageTitle={currentItem.groupTitle}
        pageNumber={currentPageIndex + 1}
        pageTotal={pageStartIndices.length}
      />
    );
  }

  return (
    <>
    <div className="relative w-full h-full flex flex-col items-center justify-center min-h-0">
      {/* Visual Asset Stage */}
      <div className="relative w-full flex-1 flex flex-col items-center justify-center overflow-visible px-3 sm:px-4 min-h-0">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentItem.id}
            initial={{ opacity: 0, scale: 0.98, x: 20 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            exit={{ opacity: 0, scale: 0.98, x: -20 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.12}
            onDragEnd={(_e, info) => {
              if (info.offset.x > 35) {
                handlePrev();
              } else if (info.offset.x < -35) {
                handleNext();
              }
            }}
            onClick={() => setExpandedItem(currentItem)}
            className="relative cursor-grab active:cursor-grabbing flex flex-col items-center justify-center"
          >
            <div className={`${STORY_MEDIA_SHELL_CLASS} ${isPortraitMockup ? 'translate-y-4' : ''}`}>
              {/* The iPhone 390x844 Viewport Mockup */}
              <div
                ref={mockupRef}
                className={isPortraitMockup ? PORTRAIT_FRAME : 'min-h-0 flex-1 w-auto max-h-full max-w-full flex items-center justify-center'}
              >
                <MediaAsset
                  item={currentItem}
                  className={isPortraitMockup ? 'w-full h-full' : 'h-full w-auto max-w-full'}
                />
              </div>

              {/* Reserve exactly the same caption space used by grouped pages. */}
              <p className={PORTRAIT_CAPTION_SPACE} aria-hidden="true">
                &nbsp;
              </p>
            </div>

            {/* 
              Bottom Module Indicator Bar:
              - Width strictly matches the 390x844 mockup
              - Left side (Black): '01 灵感探索与城市情绪' (aligned left of mockup, inset slightly)
              - Right side (Gray): '/ 05' (aligned right of mockup, inset slightly)
              - Modest padding (px-2.5) keeps it from touching the absolute outer edge
            */}
            <div
              style={{ width: mockupWidth > 0 ? `${mockupWidth}px` : undefined }}
              className={`relative z-40 mt-3 w-full flex items-center justify-between rounded-[10px] border border-white bg-white px-2.5 py-1.5 select-none ${isPortraitMockup ? PORTRAIT_FOOTER_SIZE : ''}`}
            >
              {/* Left Segment: '01 灵感探索与城市情绪' in Black */}
              <div className="flex items-center gap-1.5 sm:gap-2 text-[#1A1A1A] min-w-0">
                <span className="font-mono font-semibold text-[11px] sm:text-[12px] tracking-wider flex-shrink-0">
                  {currentNum}
                </span>
                <span className="font-medium text-[11.5px] sm:text-[12.5px] tracking-tight truncate">
                  {cleanTitle}
                </span>
              </div>

              {/* Right Segment: '/ 05' in Original Gray */}
              <div className="text-[#8E8E8E] font-mono text-[11px] sm:text-[12px] tracking-wider font-normal flex-shrink-0 ml-2">
                <span>/ {totalNum}</span>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

      </div>
    </div>
    <ImageLightbox item={expandedItem} onClose={() => setExpandedItem(null)} />
    </>
  );
};
