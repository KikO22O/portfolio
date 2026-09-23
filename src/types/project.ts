export type StageType = 'story' | 'demo' | 'more';

export interface MediaItem {
  id: string;
  type: 'image' | 'video';
  src: string;
  /** Smaller square-cropped preview; the lightbox always uses the original src. */
  previewSrc?: string;
  /** Safari-compatible H.264 fallback for WebM demo files. */
  mp4Src?: string;
  title?: string;
  titleBar?: boolean;
  /** Shared page title for grouped multi-image highlights. */
  groupId?: string;
  groupTitle?: string;
  hideGroupTitle?: boolean;
  /** Small caption shown directly below an image in a grouped page. */
  caption?: string;
  description?: string;
  poster?: string;
  duration?: string;
  startTime?: number;
  endTime?: number;
  skipRanges?: Array<{ start: number; end: number }>;
  playbackRate?: number;
  aspectRatio?: string; // e.g. '9/19.5' for phone, '16/10' for desktop, '3/4' for ticket
  placeholderType?: 'ticket' | 'bare' | 'mobile' | 'desktop' | 'diagram';
  /** Responsive ordering for grouped creation grids. */
  mobileOrder?: number;
  desktopOrder?: number;
  /** Number of columns used by a grouped gallery at each breakpoint. */
  mobileColumns?: number;
  desktopColumns?: number;
}

export interface Project {
  id: string;
  nameZh: string;
  nameEn: string;
  category: string;
  description: string;
  liveUrl?: string;
  liveLabel?: string;
  stageLabels?: Partial<Record<StageType, string>>;
  stageOrder?: StageType[];
  initialStage?: StageType;
  story: MediaItem[];
  demo?: MediaItem[];
  more?: MediaItem[];
}
