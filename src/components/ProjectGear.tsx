import React, { useRef, useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { ArrowUpRight } from 'lucide-react';
import { Project, StageType } from '../types/project';

interface ProjectGearProps {
  projects: Project[];
  currentProjectIndex: number;
  onSelectProject: (index: number) => void;
  currentStage: StageType;
  onSelectStage: (stage: StageType) => void;
}

export const ProjectGear: React.FC<ProjectGearProps> = ({
  projects,
  currentProjectIndex,
  onSelectProject,
  currentStage,
  onSelectStage,
}) => {
  const currentProject = projects[currentProjectIndex] || projects[0];
  const gearContainerRef = useRef<HTMLDivElement>(null);

  // Drag interaction state for rotational mechanical feel
  const [dragStartX, setDragStartX] = useState<number | null>(null);
  const [dragCurrentX, setDragCurrentX] = useState<number | null>(null);

  // Discrete gear angle: 4 projects mapped with 36 degree separation to strictly eliminate overlap
  // Index 0: +54 deg, Index 1: +18 deg, Index 2: -18 deg, Index 3: -54 deg
  const stepAngle = 36;
  const projectAngles = projects.map((_, idx) => (idx - 1.5) * stepAngle);
  const baseRotationAngle = -(currentProjectIndex - 1.5) * stepAngle;

  // Real-time drag displacement added to rotation
  const dragDeltaX = dragStartX !== null && dragCurrentX !== null ? dragCurrentX - dragStartX : 0;
  const liveRotationAngle = baseRotationAngle + dragDeltaX * 0.12;

  const handlePointerDown = (e: React.PointerEvent) => {
    setDragStartX(e.clientX);
    setDragCurrentX(e.clientX);
    (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (dragStartX !== null) {
      setDragCurrentX(e.clientX);
    }
  };

  const handlePointerUp = () => {
    if (dragStartX !== null && dragCurrentX !== null) {
      const diff = dragCurrentX - dragStartX;
      const threshold = 30; // pixel threshold to snap to adjacent project
      if (diff < -threshold && currentProjectIndex < projects.length - 1) {
        onSelectProject(currentProjectIndex + 1);
      } else if (diff > threshold && currentProjectIndex > 0) {
        onSelectProject(currentProjectIndex - 1);
      }
    }
    setDragStartX(null);
    setDragCurrentX(null);
  };

  // Determine available stages for current project
  const availableStages: { key: StageType; label: string }[] = [];
  if (currentProject.story && currentProject.story.length > 0) {
    availableStages.push({ key: 'story', label: 'HIGHLIGHTS' });
  }
  if (currentProject.demo && currentProject.demo.length > 0) {
    availableStages.push({ key: 'demo', label: 'DEMO' });
  }
  if (currentProject.more && currentProject.more.length > 0) {
    availableStages.push({ key: 'more', label: 'MORE' });
  }
  if (currentProject.stageOrder) {
    availableStages.sort((a, b) => currentProject.stageOrder!.indexOf(a.key) - currentProject.stageOrder!.indexOf(b.key));
  }

  const hasMultipleStages = availableStages.length > 1;

  // Ensure current stage exists on the selected project
  useEffect(() => {
    const stageExists = availableStages.some((s) => s.key === currentStage);
    if (!stageExists && availableStages.length > 0) {
      onSelectStage(availableStages[0].key);
    }
  }, [currentProjectIndex, availableStages, currentStage, onSelectStage]);

  // Calibration ticks around the perimeter:
  // 51 ticks from -75 deg to +75 deg (step 3 deg)
  // Regular ticks in light gray, medium ticks every 9 deg, and project anchors
  const calibrationTicks = Array.from({ length: 51 }, (_, i) => {
    const deg = -75 + i * 3;
    const isProjectAnchor = projectAngles.some((a) => Math.abs(deg - a) < 0.2);
    const isMediumTick = deg % 9 === 0;

    const tickLen = isProjectAnchor ? 11 : isMediumTick ? 7 : 4.5;
    const strokeWidth = isProjectAnchor ? 1.8 : isMediumTick ? 1.1 : 0.8;
    const opacity = isProjectAnchor ? 0.7 : isMediumTick ? 0.32 : 0.16;

    const rad = (deg * Math.PI) / 180;
    const rOuter = 472;
    const rInner = rOuter - tickLen;

    return {
      deg,
      isProjectAnchor,
      x1: 500 + rInner * Math.sin(rad),
      y1: 500 - rInner * Math.cos(rad),
      x2: 500 + rOuter * Math.sin(rad),
      y2: 500 - rOuter * Math.cos(rad),
      strokeWidth,
      opacity,
    };
  });

  return (
    <footer
      id="project-gear"
      ref={gearContainerRef}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      aria-label="Project selector and navigation gear"
      className="relative w-full select-none touch-pan-y cursor-grab active:cursor-grabbing flex flex-col items-center justify-end overflow-hidden z-20 flex-shrink-0 h-[144px] sm:h-[150px] md:h-[156px] lg:h-[164px]"
    >
      {/* 
        Rotational Abstract Mechanical Gear Base (SVG)
        - Semi-circular pure white disc (#FFFFFF) rising from the bottom with subtle shadow
        - Narrowed on desktop (md:w-[680px] lg:w-[740px]) to prevent overly wide/flat appearance
        - English project titles on arc lifted upward closer to ticks (R=450)
        - Mobile font size 12px, desktop font size 9.5px
      */}
      <div className="absolute inset-x-0 bottom-0 top-0 flex items-start justify-center pointer-events-none">
        <motion.div
          animate={{ rotate: dragStartX !== null ? liveRotationAngle : baseRotationAngle }}
          transition={{
            type: 'tween',
            ease: [0.22, 1, 0.36, 1],
            duration: dragStartX !== null ? 0 : 0.5,
          }}
          className="absolute top-1 left-1/2 -translate-x-1/2 w-[580px] h-[580px] sm:w-[640px] sm:h-[640px] md:w-[680px] md:h-[680px] lg:w-[740px] lg:h-[740px] flex-shrink-0 drop-shadow-[0_-6px_20px_rgba(0,0,0,0.04)]"
        >
          <svg
            viewBox="0 0 1000 1000"
            className="w-full h-full pointer-events-auto"
          >
            <defs>
              {/* 
                Curved Text Arc: Radius R=442 centered at (500, 500).
                Apex at y=58. Maintains generous clearance from ticks above
                and comfortable breathing room from Chinese title below.
              */}
              <path
                id="gear-curved-text-arc"
                d="M 90.2, 334.4 A 442,442 0 0,1 909.8, 334.4"
                fill="none"
              />
            </defs>

            {/* Central Main Disc - Semi-Circular Pure White Fill */}
            <circle
              cx="500"
              cy="500"
              r="474"
              fill="#FFFFFF"
              stroke="rgba(0,0,0,0.08)"
              strokeWidth="1.2"
            />

            {/* Subtle Inner Concentric Caliper Guide Rings */}
            <circle
              cx="500"
              cy="500"
              r="452"
              fill="none"
              stroke="rgba(0,0,0,0.03)"
              strokeWidth="1"
              strokeDasharray="2 4"
            />

            <circle
              cx="500"
              cy="500"
              r="432"
              fill="none"
              stroke="rgba(0,0,0,0.02)"
              strokeWidth="1"
            />

            {/* Fine Calibration Ticks (刻度线) */}
            {calibrationTicks.map((tick, i) => (
              <g key={`tick-${i}`}>
                <line
                  x1={tick.x1}
                  y1={tick.y1}
                  x2={tick.x2}
                  y2={tick.y2}
                  stroke={`rgba(0,0,0,${tick.opacity})`}
                  strokeWidth={tick.strokeWidth}
                  strokeLinecap="round"
                />
                {tick.isProjectAnchor && (
                  <circle
                    cx={tick.x1}
                    cy={tick.y1}
                    r={1.8}
                    fill="#1A1A1A"
                    opacity={0.65}
                  />
                )}
              </g>
            ))}

            {/* 
              Four Projects Curved Along the Arc:
              - Mobile font size: 20px in SVG (~11.6px on screen, slightly larger as requested)
              - Desktop font size: 14.5px in SVG (~10.0px on screen, identical to bottom STORY/DEMO/MORE)
              - Formatted with slash separator: '01 / CITYWALK AGENT'
            */}
            {projects.map((proj, idx) => {
              const isActive = idx === currentProjectIndex;
              const markerAngle = projectAngles[idx];

              return (
                <g
                  key={proj.id}
                  transform={`rotate(${markerAngle} 500 500)`}
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectProject(idx);
                  }}
                  className="cursor-pointer transition-opacity duration-200"
                >
                  <text
                    className="select-none transition-all duration-300 font-mono gear-scale-text"
                    style={{
                      fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
                      fontWeight: isActive ? 600 : 400,
                      letterSpacing: '0.15em',
                      fill: isActive ? '#1A1A1A' : '#737373',
                      opacity: isActive ? 1 : 0.65,
                    }}
                  >
                    <textPath
                      href="#gear-curved-text-arc"
                      startOffset="50%"
                      textAnchor="middle"
                    >
                      {`0${idx + 1} / ${proj.nameEn}`}
                    </textPath>
                  </text>
                </g>
              );
            })}
          </svg>
        </motion.div>
      </div>

      {/* 
        1. Mobile Information Layout
        - NO English name inside gear (only Chinese title!)
        - Dynamic Marquee Carousel for Description: Reads first part, slides smoothly, pauses at end, then loops!
        - Bottom Bar: Story/Demo/More on left, Experience Live on right (unified horizontal layout)
        - pt-[43px] provides clean clearance below the upper English arc text
      */}
      <div className="md:hidden relative z-20 w-full flex flex-col items-center text-center justify-between px-3 pt-[43px] pb-2 pointer-events-auto">
        <div className="flex flex-col items-center w-full">
          {/* Chinese Name (Only Chinese, NO English inside the gear) */}
          <motion.h2
            key={currentProject.id + '-m-zh'}
            initial={{ opacity: 0, y: 2 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
            className="text-[17px] xs:text-[18px] font-medium tracking-tight text-[#1A1A1A] leading-tight"
          >
            {currentProject.nameZh}
          </motion.h2>

          <motion.p
            key={currentProject.id + '-m-description'}
            initial={{ opacity: 0, y: 2 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, delay: 0.04 }}
            className="mt-1 max-w-[320px] text-[10px] leading-relaxed text-[#8E8E8E]"
          >
            {currentProject.description}
          </motion.p>

        </div>

        {/* Bottom Horizontal Bar: Stage Navigation on Left, Experience Live on Right, OR Centered if single stage */}
        <div className={`w-full flex items-center ${hasMultipleStages && currentProject.id !== 'aigc' ? 'justify-between' : 'justify-center'} pt-1.5 border-t border-black/5 mt-1 px-1 text-[9.5px] font-mono`}>
          {hasMultipleStages && (
            <div className={`flex items-center gap-3.5 tracking-[0.14em] uppercase text-[#8E8E8E] ${currentProject.id === 'aigc' ? 'justify-center' : ''}`}>
              {availableStages.map((stage) => {
                const isActive = stage.key === currentStage;
                return (
                  <button
                    key={stage.key}
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectStage(stage.key);
                    }}
                    className={`py-0.5 transition-colors cursor-pointer ${
                      isActive
                        ? 'text-[#1A1A1A] font-semibold underline underline-offset-4 decoration-1'
                        : 'text-[#8E8E8E] hover:text-[#1A1A1A] no-underline'
                    }`}
                  >
                    <span>{currentProject.stageLabels?.[stage.key] || stage.label}</span>
                  </button>
                );
              })}
            </div>
          )}

          {currentProject.liveUrl && (
            <a
              href={currentProject.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="inline-flex items-center text-[9.5px] font-medium tracking-[0.16em] uppercase text-[#1A1A1A] border-b border-[#1A1A1A] pb-[2px] hover:opacity-75 transition-opacity"
            >
              <span>{currentProject.liveLabel || 'OPEN PROJECT'}</span>
              <span className="ml-1 text-[10px] leading-none">↗</span>
            </a>
          )}
        </div>
      </div>

      {/* 
        2. Desktop Information Layout
        - Narrowed container width (max-w-[380px] lg:max-w-[420px]) matching the tightened gear diameter
        - Lifted English project names on arc (R=442), pt-[48px] creates clear separation with zero overlap!
        - Tightly grouped vertical spacing between Chinese title, description, and stage controls
        - Dynamic Marquee Carousel automatically scrolls if description exceeds container width
        - Bottom Row: Stage Navigation on left, Experience Live on right
      */}
      <div className="hidden md:flex relative z-20 flex-col items-center text-center justify-between w-full max-w-[380px] lg:max-w-[420px] mx-auto px-4 pb-2 pt-[48px] lg:pt-[50px] pointer-events-auto">
        <div className="flex flex-col items-center w-full">
          {/* Chinese Name (Clean and compact, no overlap with English project name) */}
          <motion.h2
            key={currentProject.id + '-d-zh'}
            initial={{ opacity: 0, y: 2 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
            className="text-[19px] lg:text-[21px] font-semibold tracking-tight text-[#1A1A1A] leading-tight"
          >
            {currentProject.nameZh}
          </motion.h2>

          <motion.p
            key={currentProject.id + '-d-description'}
            initial={{ opacity: 0, y: 2 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, delay: 0.04 }}
            className="mt-1 max-w-[420px] text-[11px] leading-relaxed text-[#8E8E8E]"
          >
            {currentProject.description}
          </motion.p>

        </div>

        {/* Bottom Row: Stage Navigation & Live URL (Centered if single stage like cocktail) */}
        <div className={`w-full flex items-center ${hasMultipleStages && currentProject.id !== 'aigc' ? 'justify-between' : 'justify-center'} pt-1.5 border-t border-black/5 mt-1.5 text-[10px] font-mono tracking-wider`}>
          {hasMultipleStages && (
            <nav aria-label="Stage Navigation" className={`flex items-center gap-4 text-[10px] tracking-[0.15em] uppercase text-[#8E8E8E] ${currentProject.id === 'aigc' ? 'justify-center' : ''}`}>
              {availableStages.map((stage) => {
                const isActive = stage.key === currentStage;
                return (
                  <button
                    key={stage.key}
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectStage(stage.key);
                    }}
                    className={`py-0.5 transition-colors cursor-pointer ${
                      isActive
                        ? 'text-[#1A1A1A] font-semibold underline underline-offset-4 decoration-1'
                        : 'text-[#8E8E8E] hover:text-[#1A1A1A] no-underline'
                    }`}
                  >
                    <span>{currentProject.stageLabels?.[stage.key] || stage.label}</span>
                  </button>
                );
              })}
            </nav>
          )}

          {currentProject.liveUrl && (
            <a
              href={currentProject.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="group inline-flex items-center text-[10px] font-medium tracking-[0.16em] uppercase text-[#1A1A1A] border-b border-[#1A1A1A] pb-[2px] hover:opacity-75 transition-all"
            >
              <span>{currentProject.liveLabel || 'OPEN PROJECT'}</span>
              <span className="ml-1 text-[11px] leading-none transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5">↗</span>
            </a>
          )}
        </div>
      </div>
    </footer>
  );
};
