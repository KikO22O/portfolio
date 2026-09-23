import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Project, StageType } from '../types/project';
import { StoryViewer } from './StoryViewer';
import { DemoViewer } from './DemoViewer';
import { MoreGallery } from './MoreGallery';

interface MediaStageProps {
  project: Project;
  currentStage: StageType;
  storyIndex: number;
  onSelectStoryIndex: (index: number) => void;
  onNavigate: (direction: -1 | 1) => void;
  canNavigatePrevious: boolean;
  canNavigateNext: boolean;
}

export const MediaStage: React.FC<MediaStageProps> = ({
  project,
  currentStage,
  storyIndex,
  onSelectStoryIndex,
  onNavigate,
  canNavigatePrevious,
  canNavigateNext,
}) => {
  return (
    <section 
      id="media-stage"
      aria-label="Project Media Stage"
      className="relative z-30 w-full flex-1 flex flex-col items-center justify-center min-h-0 overflow-visible py-1 sm:py-2 md:py-4 px-2"
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={`${project.id}-${currentStage}`}
          initial={{ opacity: 0, scale: 0.985 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.985 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="w-full h-full flex flex-col items-center justify-center"
        >
          {currentStage === 'story' && (
            <StoryViewer
              items={project.story}
              currentIndex={storyIndex}
              onSelectIndex={onSelectStoryIndex}
              onNavigate={onNavigate}
            />
          )}

          {currentStage === 'demo' && project.demo && project.demo.length > 0 && (
            <DemoViewer key={project.demo[storyIndex]?.id || project.demo[0].id} demoItem={project.demo[storyIndex] || project.demo[0]} />
          )}

          {currentStage === 'more' && project.more && project.more.length > 0 && (
            <MoreGallery items={project.more} />
          )}

        </motion.div>
      </AnimatePresence>
      {/* Keep navigation anchored to the media stage, independent of the
          changing dimensions and animation of individual media modules. */}
      {canNavigatePrevious && <button
                onClick={() => onNavigate(-1)}
                aria-label="Previous project asset"
                className="absolute left-1 sm:left-4 md:left-8 top-1/2 -translate-y-1/2 w-9 h-9 sm:w-11 sm:h-11 rounded-full flex items-center justify-center bg-white/60 hover:bg-white text-[#1A1A1A] border border-black/5 backdrop-blur-[10px] transition-all duration-200 hover:scale-105 shadow-[0_4px_16px_rgba(0,0,0,0.03)] cursor-pointer z-40"
              >
                <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" strokeWidth={1.5} />
      </button>}
      {canNavigateNext && <button
                onClick={() => onNavigate(1)}
                aria-label="Next project asset"
                className="absolute right-1 sm:right-4 md:right-8 top-1/2 -translate-y-1/2 w-9 h-9 sm:w-11 sm:h-11 rounded-full flex items-center justify-center bg-white/60 hover:bg-white text-[#1A1A1A] border border-black/5 backdrop-blur-[10px] transition-all duration-200 hover:scale-105 shadow-[0_4px_16px_rgba(0,0,0,0.03)] cursor-pointer z-40"
              >
                <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" strokeWidth={1.5} />
      </button>}
    </section>
  );
};
