import React, { useState, useRef, useEffect, useLayoutEffect } from 'react';
import { Play, Pause, Maximize2, LoaderCircle } from 'lucide-react';
import { MediaItem } from '../types/project';
import { assetUrl } from '../utils/assetUrl';
import { PORTRAIT_SHELL, PORTRAIT_FRAME, PORTRAIT_CAPTION_SPACE, PORTRAIT_FOOTER_SIZE } from './portraitLayout';

interface DemoViewerProps {
  demoItem: MediaItem;
}

export const DemoViewer: React.FC<DemoViewerProps> = ({ demoItem }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [playError, setPlayError] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [videoWidth, setVideoWidth] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);
  const viewerRef = useRef<HTMLDivElement>(null);
  const controlsRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const [landscapeSize, setLandscapeSize] = useState<{ width: number; height: number } | null>(null);
  const roundedMediaStyle: React.CSSProperties = {
    borderRadius: 'inherit',
  };
  const startTime = demoItem.startTime || 0;
  const endTime = demoItem.endTime;
  const skipRanges = demoItem.skipRanges || [];
  const playbackRate = demoItem.playbackRate || 1;
  const sourceIsMp4 = demoItem.src.toLowerCase().endsWith('.mp4');
  const isLandscapeVideo = demoItem.aspectRatio === '16/9' || demoItem.aspectRatio === '47/20';
  useLayoutEffect(() => {
    const viewer = viewerRef.current;
    if (!viewer || !isLandscapeVideo) return;
    const [ratioWidth, ratioHeight] = demoItem.aspectRatio!.split('/').map(Number);
    const ratio = ratioWidth / ratioHeight;
    const outerHeight = (element: HTMLElement | null) => {
      if (!element) return 0;
      const style = getComputedStyle(element);
      return element.offsetHeight + parseFloat(style.marginTop) + parseFloat(style.marginBottom);
    };
    const measure = () => {
      const style = getComputedStyle(viewer);
      const availableWidth = viewer.clientWidth - parseFloat(style.paddingLeft) - parseFloat(style.paddingRight);
      const availableHeight = Math.max(0, viewer.clientHeight - outerHeight(controlsRef.current) - outerHeight(titleRef.current));
      // Fit BOTH dimensions before sizing the frame. Flex shrinking only its
      // height leaves object-contain letterboxing inside the rounded corners.
      const desktop = window.innerWidth >= 768;
      const width = Math.max(0, Math.min(availableWidth, desktop ? 1020 : Infinity,
        availableHeight * ratio, desktop ? window.innerHeight * 0.7 * ratio : Infinity));
      setLandscapeSize({ width, height: width / ratio });
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(viewer);
    if (controlsRef.current) observer.observe(controlsRef.current);
    if (titleRef.current) observer.observe(titleRef.current);
    window.addEventListener('resize', measure);
    return () => { observer.disconnect(); window.removeEventListener('resize', measure); };
  }, [demoItem.id, demoItem.aspectRatio, isLandscapeVideo]);
  const isAppleWebKit = typeof navigator !== 'undefined' && (
    /iPad|iPhone|iPod/.test(navigator.userAgent)
    || (/Safari/.test(navigator.userAgent) && !/Chrome|Chromium|Android/.test(navigator.userAgent))
  );

  const clampPlaybackTime = (time: number) => {
    const range = skipRanges.find(({ start, end }) => time >= start && time < end);
    if (range) return range.end;
    if (endTime !== undefined) return Math.min(time, endTime);
    return time;
  };

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const setStartTime = () => {
      video.currentTime = startTime;
      video.playbackRate = playbackRate;
      setCurrentTime(startTime);
      setDuration(video.duration || 0);
      setIsPlaying(false);
      setIsLoading(false);
      setPlayError(false);
      setHasStarted(false);
    };

    if (video.readyState >= 1) {
      setStartTime();
    } else {
      video.addEventListener('loadedmetadata', setStartTime, { once: true });
    }

    return () => video.removeEventListener('loadedmetadata', setStartTime);
  }, [demoItem.id, startTime, playbackRate]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const measure = () => {
      const width = video.getBoundingClientRect().width;
      if (width > 0) setVideoWidth(Math.round(width));
    };

    measure();
    const resizeObserver = new ResizeObserver(measure);
    resizeObserver.observe(video);
    window.addEventListener('resize', measure);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener('resize', measure);
    };
  }, [demoItem.id]);

  const handleStartPlay = () => {
    const video = videoRef.current;
    if (!video || isLoading || isPlaying) return;
    if (video.ended || video.currentTime >= (endTime || video.duration)) {
      video.currentTime = startTime;
    } else if (video.currentTime < startTime) {
      video.currentTime = startTime;
    }
    video.playbackRate = playbackRate;
    setPlayError(false);
    setIsLoading(true);
    setHasStarted(true);
    video.play().then(() => {
      setIsLoading(false);
      setIsPlaying(true);
    }).catch(() => {
      setIsLoading(false);
      setIsPlaying(false);
      setHasStarted(false);
      setPlayError(true);
    });
  };

  const togglePlayPause = () => {
    if (!videoRef.current || isLoading) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      setIsLoading(true);
      setPlayError(false);
      videoRef.current.play().then(() => {
        setIsLoading(false);
        setIsPlaying(true);
      }).catch(() => {
        setIsLoading(false);
        setIsPlaying(false);
        setPlayError(true);
      });
    }
  };

  const formatTime = (time: number) => {
    const seconds = Math.max(0, Math.floor(time));
    return `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, '0')}`;
  };

  const handleFullscreen = () => {
    const video = videoRef.current;
    if (!video) return;
    if (video.requestFullscreen) {
      void video.requestFullscreen();
      return;
    }
    const safariVideo = video as HTMLVideoElement & { webkitEnterFullscreen?: () => void };
    safariVideo.webkitEnterFullscreen?.();
  };

  return (
    <div 
      ref={viewerRef}
      className="relative w-full h-full flex flex-col items-center justify-center px-4"
    >
      <div className={isLandscapeVideo ? 'contents' : 'relative shrink-0 flex flex-col items-center justify-center'}>
      <div className={isLandscapeVideo ? 'contents' : `${PORTRAIT_SHELL} translate-y-4`}>
      <div
        style={isLandscapeVideo ? { aspectRatio: demoItem.aspectRatio, ...landscapeSize } : undefined}
        className={`video-rounded-shell relative isolate flex flex-col items-center justify-center overflow-hidden rounded-[32px] bg-transparent [transform:translateZ(0)] ${isLandscapeVideo
          ? 'shrink-0 w-full'
          : PORTRAIT_FRAME}`}
      >
        <div className="video-rounded-clip absolute inset-0 z-0 flex items-center justify-center" style={roundedMediaStyle}>
        {demoItem.poster && !hasStarted && (
          <img
            src={assetUrl(demoItem.poster)}
            alt=""
            aria-hidden="true"
            className={`absolute inset-0 z-[1] h-full w-full ${isLandscapeVideo ? 'object-cover' : 'object-contain'}`}
            style={roundedMediaStyle}
          />
        )}
        {/* If video source is local file or webm */}
        <video
          ref={videoRef}
          poster={assetUrl(demoItem.poster)}
          preload="metadata"
          playsInline
          className="video-rounded-media h-full w-full object-contain select-none"
          style={roundedMediaStyle}
          onClick={togglePlayPause}
          onLoadedMetadata={() => {
            if (videoRef.current) {
              setDuration(videoRef.current.duration || 0);
              videoRef.current.currentTime = startTime;
              videoRef.current.playbackRate = playbackRate;
              setCurrentTime(startTime);
            }
          }}
          onTimeUpdate={() => {
            if (!videoRef.current) return;
            const sourceTime = videoRef.current.currentTime;
            const nextTime = clampPlaybackTime(sourceTime);

            if (nextTime !== sourceTime) {
              videoRef.current.currentTime = nextTime;
            }

            setCurrentTime(nextTime);

            if (endTime !== undefined && sourceTime >= endTime) {
              videoRef.current.pause();
              setIsPlaying(false);
            }
          }}
          onEnded={() => {
            setIsPlaying(false);
            setHasStarted(false);
            if (videoRef.current) {
              videoRef.current.currentTime = startTime;
              setCurrentTime(startTime);
            }
          }}
        >
          {isAppleWebKit ? (
            <>
              {demoItem.mp4Src && <source src={assetUrl(demoItem.mp4Src)} type="video/mp4" />}
              <source src={assetUrl(demoItem.src)} type={sourceIsMp4 ? 'video/mp4' : 'video/webm'} />
            </>
          ) : (
            <>
              <source src={assetUrl(demoItem.src)} type={sourceIsMp4 ? 'video/mp4' : 'video/webm'} />
              {demoItem.mp4Src && <source src={assetUrl(demoItem.mp4Src)} type="video/mp4" />}
            </>
          )}
        </video>
        </div>

        {/* The real video remains visible; only the centered play control is overlaid. */}
        {!isPlaying && (
          <div 
            onClick={isLoading ? undefined : handleStartPlay}
            className={`group absolute inset-0 z-10 flex flex-col items-center justify-center gap-3 text-[#1A1A1A] ${isLoading ? 'cursor-wait' : 'cursor-pointer'}`}
          >
            <div className="w-16 h-16 rounded-full flex items-center justify-center bg-white/90 border border-black/10 shadow-[0_4px_20px_rgba(0,0,0,0.08)] text-[#1A1A1A] group-hover:scale-105 transition-transform duration-300">
              {isLoading
                ? <LoaderCircle className="w-6 h-6 animate-spin" strokeWidth={1.5} />
                : <Play className="w-6 h-6 ml-0.5 fill-[#1A1A1A]" strokeWidth={1.5} />}
            </div>
            {isLoading && <span className="rounded bg-white/90 px-2 py-1 text-xs">视频加载中，请稍候…</span>}
            {playError && <span className="rounded bg-white/90 px-2 py-1 text-xs">播放失败，请再试一次</span>}
          </div>
        )}

      </div>

      {!isLandscapeVideo && <p className={PORTRAIT_CAPTION_SPACE} aria-hidden="true">&nbsp;</p>}
      </div>

      {/* Playback menu below the video, including a live seconds timeline. */}
      <div
        ref={controlsRef}
        style={{
          width: videoWidth > 0 ? `${videoWidth}px` : undefined,
          visibility: hasStarted ? 'visible' : 'hidden',
        }}
        className={`shrink-0 w-full max-w-[calc(100vw-2rem)] mt-3 min-h-[24px] flex items-center gap-1.5 text-[#1A1A1A] ${isLandscapeVideo ? '' : PORTRAIT_FOOTER_SIZE}`}
      >
          <button
            onClick={togglePlayPause}
            aria-label={isPlaying ? 'Pause' : 'Play'}
            className="shrink-0 p-0.5 hover:opacity-70 transition-opacity cursor-pointer"
          >
            {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
          </button>

          <div className="min-w-0 flex-1 flex items-center gap-2 text-[10px] font-mono text-[#8E8E8E]">
            <span className="w-8 shrink-0 text-right">{formatTime(currentTime)}</span>
            <input
              type="range"
              min={startTime}
              max={endTime || duration || startTime}
              step="0.1"
              value={Math.min(currentTime, endTime || duration || startTime)}
              onChange={(event) => {
                const nextTime = clampPlaybackTime(Number(event.target.value));
                if (videoRef.current) videoRef.current.currentTime = nextTime;
                setCurrentTime(nextTime);
              }}
              aria-label="Video progress in seconds"
              className="h-1 min-w-0 flex-1 accent-[#1A1A1A] cursor-pointer"
            />
            <span className="w-8 shrink-0">{formatTime(endTime || duration)}</span>
          </div>

          <button
            onClick={handleFullscreen}
            aria-label="View video fullscreen"
            title="全屏查看"
            className="shrink-0 p-0.5 hover:opacity-70 transition-opacity cursor-pointer"
          >
            <Maximize2 className="w-3.5 h-3.5" />
          </button>
      </div>

      {demoItem.titleBar && demoItem.title && (
        <div ref={titleRef} className="relative shrink-0 z-20 mt-6 flex w-fit max-w-full items-center rounded-[10px] border border-white bg-white px-3 py-1.5 text-center text-[12px] font-medium tracking-tight text-[#1A1A1A]">
          {demoItem.title}
        </div>
      )}
      </div>

    </div>
  );
};
