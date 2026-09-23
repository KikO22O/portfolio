import React, { useState, useEffect, useCallback } from 'react';
import { CREATIONS_DATA, PROJECTS_DATA } from './data/projects';
import { Project, StageType } from './types/project';
import { MediaStage } from './components/MediaStage';
import { ProjectGear } from './components/ProjectGear';

type MediaNavigationTarget = {
  projectIndex: number;
  stage: StageType;
  index: number;
};

type CollectionKey = 'products' | 'creations';

const getMediaSequence = (projects: Project[]): MediaNavigationTarget[] => projects.flatMap((project, projectIndex) => {
  const seenStoryGroups = new Set<string>();
  const availableStages = new Set<StageType>();
  if (project.story.length) availableStages.add('story');
  if (project.demo?.length) availableStages.add('demo');
  if (project.more?.length) availableStages.add('more');
  const stageOrder = [...(project.stageOrder || []), 'story', 'demo', 'more']
    .filter((stage, index, stages): stage is StageType => stages.indexOf(stage) === index && availableStages.has(stage as StageType));

  return stageOrder.flatMap<MediaNavigationTarget>((stage): MediaNavigationTarget[] => {
    if (stage === 'story') {
      return project.story.flatMap((item, index) => {
        if (item.groupId && seenStoryGroups.has(item.groupId)) return [];
        if (item.groupId) seenStoryGroups.add(item.groupId);
        return [{ projectIndex, stage, index }];
      });
    }
    const items = stage === 'demo' ? project.demo || [] : project.more || [];
    return items.map((_, index) => ({ projectIndex, stage, index }));
  });
});

interface CollectionTabsProps {
  activeCollection: CollectionKey;
  onChange: (collection: CollectionKey) => void;
}

const CollectionTabs: React.FC<CollectionTabsProps> = ({ activeCollection, onChange }) => (
  <div className="flex items-center gap-1 rounded-full border border-black/5 bg-white p-1 text-[#1A1A1A] font-semibold tracking-[0.12em] shadow-[0_2px_10px_rgba(0,0,0,0.05)]">
    {(['products', 'creations'] as const).map((collection) => (
      <button
        key={collection}
        type="button"
        onClick={() => onChange(collection)}
        className={`rounded-full px-3 py-1.5 sm:px-4 sm:py-2 text-[9px] sm:text-[16px] transition-colors ${
          activeCollection === collection ? 'bg-[#1A1A1A] text-white' : 'bg-transparent text-[#1A1A1A] hover:bg-black/5'
        }`}
      >
        {collection === 'products' ? 'Products' : 'Creations'}
      </button>
    ))}
  </div>
);

export default function App() {
  const [activeCollection, setActiveCollection] = useState<CollectionKey>('products');
  const [currentProjectIndex, setCurrentProjectIndex] = useState(0);
  const [currentStage, setCurrentStage] = useState<StageType>('story');
  const [storyIndex, setStoryIndex] = useState(0);

  // Responsive device detection: mobile (< 768px) vs desktop/other (>= 768px)
  const [isMobile, setIsMobile] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return window.innerWidth < 768;
    }
    return false;
  });

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const collectionProjects = activeCollection === 'products' ? PROJECTS_DATA : CREATIONS_DATA;
  const currentProject = collectionProjects[currentProjectIndex] || collectionProjects[0];

  const mediaSequence = getMediaSequence(collectionProjects);
  const currentMediaPosition = mediaSequence.findIndex((target) => (
    target.projectIndex === currentProjectIndex &&
    target.stage === currentStage &&
    target.index === storyIndex
  ));
  const canNavigatePrevious = currentMediaPosition > 0;
  const canNavigateNext = currentMediaPosition >= 0 && currentMediaPosition < mediaSequence.length - 1;

  const navigateMedia = useCallback((direction: -1 | 1) => {
    const sequence = getMediaSequence(collectionProjects);
    const currentPosition = sequence.findIndex((target) => (
      target.projectIndex === currentProjectIndex &&
      target.stage === currentStage &&
      target.index === storyIndex
    ));
    const nextPosition = currentPosition + direction;
    if (currentPosition < 0 || nextPosition < 0 || nextPosition >= sequence.length) return;
    const nextTarget = sequence[nextPosition];

    setCurrentProjectIndex(nextTarget.projectIndex);
    setCurrentStage(nextTarget.stage);
    setStoryIndex(nextTarget.index);
  }, [collectionProjects, currentProjectIndex, currentStage, storyIndex]);

  // Handle Project Change
  const handleSelectProject = useCallback((index: number) => {
    if (index >= 0 && index < collectionProjects.length) {
      setCurrentProjectIndex(index);
      const nextProject = collectionProjects[index];
      setCurrentStage(nextProject.initialStage || (nextProject.story.length > 0 ? 'story' : 'demo'));
      setStoryIndex(0);
    }
  }, [collectionProjects]);

  const handleSelectCollection = useCallback((collection: CollectionKey) => {
    const nextProjects = collection === 'products' ? PROJECTS_DATA : CREATIONS_DATA;
    const firstProject = nextProjects[0];
    setActiveCollection(collection);
    setCurrentProjectIndex(0);
    setCurrentStage(firstProject.initialStage || (firstProject.story.length > 0 ? 'story' : 'demo'));
    setStoryIndex(0);
  }, []);

  // Handle Stage Change
  const handleSelectStage = useCallback((stage: StageType) => {
    setCurrentStage(stage);
    setStoryIndex(0);
  }, []);

  // Keyboard navigation: Up / Down changes project; Left / Right cycles every
  // asset across the active collection, including its project boundaries.
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowUp') {
        if (currentProjectIndex > 0) {
          handleSelectProject(currentProjectIndex - 1);
        }
      } else if (e.key === 'ArrowDown') {
        if (currentProjectIndex < collectionProjects.length - 1) {
          handleSelectProject(currentProjectIndex + 1);
        }
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
        e.preventDefault();
        navigateMedia(e.key === 'ArrowLeft' ? -1 : 1);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentProjectIndex, collectionProjects.length, handleSelectProject, navigateMedia]);

  return (
    <>
      {/* 
        ================================================================
        1. REAL MOBILE VIEWPORT (< 768px)
        Safari's browser chrome is external to the page. The shell uses the
        dynamic viewport and device safe-area insets.
        ================================================================
      */}
      {isMobile ? (
          /* Real mobile browser viewport. Safari's browser UI is outside the page. */
          <main className="app-shell relative w-full min-h-[100dvh] h-[100dvh] overflow-hidden flex flex-col justify-between font-sans text-[#1A1A1A] selection:bg-neutral-200 select-none">
            {/* Top Header with portfolio identity */}
          <header className="w-full flex items-center justify-between px-3 pt-3 pb-1.5 select-none z-30 text-[9px] font-mono tracking-widest text-[#8E8E8E] uppercase whitespace-nowrap overflow-hidden flex-shrink-0">
              <div className="flex items-center gap-1.5 flex-shrink-0">
                <CollectionTabs activeCollection={activeCollection} onChange={handleSelectCollection} />
              </div>

              <div className="flex items-center gap-1 text-right">
                <span className="flex h-[32px] items-center rounded-full border border-black/5 bg-white px-3 text-[#1A1A1A] font-semibold tracking-[0.12em] shadow-[0_2px_10px_rgba(0,0,0,0.05)] normal-case">
                  Kiko Chen
                </span>
              </div>
            </header>

            {/* Media Stage: Central presentation adapted for 390 × 844 */}
            <MediaStage
              project={currentProject}
              currentStage={currentStage}
              storyIndex={storyIndex}
              onSelectStoryIndex={setStoryIndex}
              onNavigate={navigateMedia}
              canNavigatePrevious={canNavigatePrevious}
              canNavigateNext={canNavigateNext}
            />

            {/* Project Gear: Bottom rotational dial */}
            <ProjectGear
              projects={collectionProjects}
              currentProjectIndex={currentProjectIndex}
              onSelectProject={handleSelectProject}
              currentStage={currentStage}
              onSelectStage={handleSelectStage}
            />
          </main>
      ) : (
        /* 
          2. DESKTOP / OTHER DEVICES (>= 768px)
          - Pure desktop editorial portfolio layout
          - 100% full-bleed edge-to-edge, clean #F7F7F5
          ================================================================
        */
        <main className="app-shell relative w-full min-h-[100dvh] h-[100dvh] overflow-hidden flex flex-col justify-between font-sans text-[#1A1A1A] selection:bg-neutral-200 select-none">
          {/* Top Header: Pure Editorial Metadata (Zero Safari buttons/switchers) */}
        <header className="w-full flex items-center justify-between px-6 sm:px-8 pt-5 sm:pt-6 pb-2.5 sm:pb-3 select-none z-30 text-[10px] font-mono tracking-widest text-[#8E8E8E] uppercase whitespace-nowrap overflow-hidden flex-shrink-0">
            <div className="flex items-center gap-2 flex-shrink-0">
              <CollectionTabs activeCollection={activeCollection} onChange={handleSelectCollection} />
            </div>

            <div className="flex items-center gap-2 text-right">
              <span className="flex h-[42px] items-center rounded-full border border-black/5 bg-white px-6 text-[16px] text-[#1A1A1A] font-semibold tracking-[0.12em] shadow-[0_2px_10px_rgba(0,0,0,0.05)] normal-case">
                Kiko Chen
              </span>
            </div>
          </header>

          {/* Media Stage: Central presentation */}
          <MediaStage
            project={currentProject}
            currentStage={currentStage}
            storyIndex={storyIndex}
            onSelectStoryIndex={setStoryIndex}
            onNavigate={navigateMedia}
            canNavigatePrevious={canNavigatePrevious}
            canNavigateNext={canNavigateNext}
          />

          {/* Project Gear: Bottom rotational controller */}
          <ProjectGear
            projects={collectionProjects}
            currentProjectIndex={currentProjectIndex}
            onSelectProject={handleSelectProject}
            currentStage={currentStage}
            onSelectStage={handleSelectStage}
          />

        </main>
      )}
    </>
  );
}
