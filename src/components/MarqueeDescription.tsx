import React, { useRef, useState, useEffect } from 'react';
import { motion } from 'motion/react';

interface MarqueeDescriptionProps {
  text: string;
  className?: string;
  projectId: string;
  maxWidthClass?: string;
}

export const MarqueeDescription: React.FC<MarqueeDescriptionProps> = ({
  text,
  className = '',
  projectId,
  maxWidthClass = 'max-w-[232px] xs:max-w-[264px]',
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLSpanElement>(null);
  const [overflowDistance, setOverflowDistance] = useState<number>(0);

  useEffect(() => {
    const measure = () => {
      if (!containerRef.current || !textRef.current) return;
      const containerWidth = containerRef.current.clientWidth;
      const textWidth = textRef.current.scrollWidth;

      if (textWidth > containerWidth) {
        // Add 14px buffer so the full ending is clearly visible
        setOverflowDistance(textWidth - containerWidth + 14);
      } else {
        setOverflowDistance(0);
      }
    };

    measure();
    const timer = setTimeout(measure, 150);

    window.addEventListener('resize', measure);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', measure);
    };
  }, [text, projectId]);

  // If text does not overflow, display cleanly centered
  if (overflowDistance <= 0) {
    return (
      <div ref={containerRef} className={`w-full ${maxWidthClass} overflow-hidden text-center ${className}`}>
        <span ref={textRef} className="inline-block truncate">
          {text}
        </span>
      </div>
    );
  }

  // Calculate proportional scroll time based on distance (comfort reading speed ~28px/s)
  const scrollSeconds = Math.max(3.5, overflowDistance / 28);
  const initialPause = 2.2; // Pause at the beginning
  const endPause = 2.5; // Pause at the end
  const resetTime = 1.0; // Return to origin
  const totalCycle = initialPause + scrollSeconds + endPause + resetTime;

  // Keyframe percentages: [0, initialPause, initialPause + scroll, initialPause + scroll + endPause, total]
  const p1 = initialPause / totalCycle;
  const p2 = (initialPause + scrollSeconds) / totalCycle;
  const p3 = (initialPause + scrollSeconds + endPause) / totalCycle;

  return (
    <div
      ref={containerRef}
      style={{
        maskImage: 'linear-gradient(to right, transparent, black 10px, black calc(100% - 10px), transparent)',
        WebkitMaskImage: 'linear-gradient(to right, transparent, black 10px, black calc(100% - 10px), transparent)',
      }}
      className={`w-full ${maxWidthClass} overflow-hidden relative select-none ${className}`}
    >
      <motion.div
        key={`${projectId}-${text}`}
        initial={{ x: 0 }}
        animate={{
          x: [0, 0, -overflowDistance, -overflowDistance, 0],
        }}
        transition={{
          duration: totalCycle,
          times: [0, p1, p2, p3, 1],
          repeat: Infinity,
          repeatDelay: 0.8,
          ease: 'easeInOut',
        }}
        className="inline-block whitespace-nowrap pl-2.5 pr-2.5"
      >
        <span ref={textRef} className="inline-block">
          {text}
        </span>
      </motion.div>
    </div>
  );
};
