'use client';

import React, { useRef, useState, useEffect } from 'react';
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  Minimize,
  RotateCcw,
  RotateCw,
  Settings,
  AlertCircle,
} from 'lucide-react';

interface VideoPlayerProps {
  src: string;
  poster?: string;
  title?: string;
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({ src, poster, title }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.8);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [showSettings, setShowSettings] = useState(false);
  const [hasError, setHasError] = useState(false);

  const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleTimeUpdate = () => setCurrentTime(video.currentTime);
    const handleLoadedMetadata = () => {
      setDuration(video.duration);
      setHasError(false);
    };
    const handleEnded = () => setIsPlaying(false);
    const handleError = () => setHasError(true);

    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('loadedmetadata', handleLoadedMetadata);
    video.addEventListener('ended', handleEnded);
    video.addEventListener('error', handleError);

    return () => {
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
      video.removeEventListener('ended', handleEnded);
      video.removeEventListener('error', handleError);
    };
  }, [src]);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = parseFloat(e.target.value);
    if (videoRef.current) {
      videoRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVol = parseFloat(e.target.value);
    setVolume(newVol);
    if (videoRef.current) {
      videoRef.current.volume = newVol;
      videoRef.current.muted = newVol === 0;
      setIsMuted(newVol === 0);
    }
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    const nextMuted = !isMuted;
    videoRef.current.muted = nextMuted;
    setIsMuted(nextMuted);
  };

  const handleSkip = (seconds: number) => {
    if (!videoRef.current) return;
    videoRef.current.currentTime = Math.min(Math.max(videoRef.current.currentTime + seconds, 0), duration);
  };

  const toggleFullscreen = async () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      await containerRef.current.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      await document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  const handleSpeedChange = (speed: number) => {
    if (videoRef.current) {
      videoRef.current.playbackRate = speed;
      setPlaybackSpeed(speed);
      setShowSettings(false);
    }
  };

  const handleMouseMove = () => {
    setShowControls(true);
    if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
    controlsTimeoutRef.current = setTimeout(() => {
      if (isPlaying) setShowControls(false);
    }, 3000);
  };

  const formatTime = (time: number) => {
    if (isNaN(time)) return '00:00';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => isPlaying && setShowControls(false)}
      className="relative aspect-video w-full rounded-2xl overflow-hidden bg-black shadow-2xl border border-slate-800 select-none group"
    >
      {/* Video Tag */}
      <video
        ref={videoRef}
        src={src}
        poster={poster}
        className="w-full h-full object-contain cursor-pointer"
        onClick={togglePlay}
        playsInline
      />

      {/* Error Overlay */}
      {hasError && (
        <div className="absolute inset-0 bg-slate-950/90 flex flex-col items-center justify-center text-slate-300 space-y-3 z-30">
          <AlertCircle className="w-12 h-12 text-red-500" />
          <p className="text-base font-semibold">Gagal memuat streaming video.</p>
          <button
            onClick={() => {
              setHasError(false);
              videoRef.current?.load();
            }}
            className="px-4 py-2 text-xs rounded-lg bg-pink-600 text-white font-medium hover:bg-pink-500"
          >
            Coba Lagi
          </button>
        </div>
      )}

      {/* Big Play Button Overlay when paused */}
      {!isPlaying && !hasError && (
        <div
          onClick={togglePlay}
          className="absolute inset-0 flex items-center justify-center bg-black/40 cursor-pointer transition-opacity z-20"
        >
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-pink-600/90 hover:bg-pink-500 text-white flex items-center justify-center shadow-2xl hover:scale-110 active:scale-95 transition-all">
            <Play className="w-8 h-8 sm:w-10 sm:h-10 fill-white ml-1" />
          </div>
        </div>
      )}

      {/* Controls Container */}
      <div
        className={`absolute inset-0 flex flex-col justify-between p-4 sm:p-6 bg-gradient-to-t from-black/90 via-black/20 to-black/60 pointer-events-none transition-opacity duration-300 z-20 ${
          showControls ? 'opacity-100' : 'opacity-0'
        }`}
      >
        {/* Top bar (Title) */}
        <div className="pointer-events-auto flex items-center justify-between">
          <h2 className="text-sm sm:text-base font-semibold text-white drop-shadow truncate pr-4">
            {title}
          </h2>
          <div className="flex items-center space-x-2">
            <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-pink-600/80 text-white backdrop-blur">
              HD 1080p
            </span>
          </div>
        </div>

        {/* Bottom controls */}
        <div className="pointer-events-auto space-y-3">
          {/* Progress Bar / Timeline */}
          <div className="flex items-center space-x-3">
            <span className="text-xs text-slate-300 font-mono">{formatTime(currentTime)}</span>
            <div className="relative flex-1 flex items-center">
              <input
                type="range"
                min={0}
                max={duration || 100}
                value={currentTime}
                onChange={handleSeek}
                className="w-full h-1.5 bg-slate-700/80 rounded-lg appearance-none cursor-pointer accent-pink-500 hover:h-2.5 transition-all"
              />
            </div>
            <span className="text-xs text-slate-400 font-mono">{formatTime(duration)}</span>
          </div>

          {/* Action Buttons Row */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3 sm:space-x-4">
              <button
                onClick={togglePlay}
                className="text-white hover:text-pink-400 transition-colors p-1"
                aria-label={isPlaying ? 'Pause' : 'Play'}
              >
                {isPlaying ? <Pause className="w-5 h-5 fill-white" /> : <Play className="w-5 h-5 fill-white" />}
              </button>

              <button
                onClick={() => handleSkip(-10)}
                className="text-slate-300 hover:text-white transition-colors p-1 hidden sm:block"
                aria-label="Mundur 10 detik"
              >
                <RotateCcw className="w-4 h-4" />
              </button>

              <button
                onClick={() => handleSkip(10)}
                className="text-slate-300 hover:text-white transition-colors p-1 hidden sm:block"
                aria-label="Maju 10 detik"
              >
                <RotateCw className="w-4 h-4" />
              </button>

              {/* Volume Slider */}
              <div className="flex items-center space-x-2 group/volume">
                <button
                  onClick={toggleMute}
                  className="text-slate-300 hover:text-white transition-colors p-1"
                  aria-label="Volume"
                >
                  {isMuted || volume === 0 ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                </button>
                <input
                  type="range"
                  min={0}
                  max={1}
                  step={0.05}
                  value={isMuted ? 0 : volume}
                  onChange={handleVolumeChange}
                  className="w-16 sm:w-20 h-1 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-pink-500"
                />
              </div>
            </div>

            <div className="flex items-center space-x-3 relative">
              {/* Speed / Settings Button */}
              <div className="relative">
                <button
                  onClick={() => setShowSettings(!showSettings)}
                  className="flex items-center space-x-1 text-xs font-semibold text-slate-300 hover:text-white px-2 py-1 rounded bg-slate-800/80 border border-slate-700/80 transition-colors"
                >
                  <Settings className="w-3.5 h-3.5" />
                  <span>{playbackSpeed}x</span>
                </button>

                {showSettings && (
                  <div className="absolute right-0 bottom-full mb-2 w-32 bg-slate-900 border border-slate-700 rounded-lg shadow-xl p-1 z-30 text-xs">
                    <div className="px-2 py-1 text-slate-400 font-semibold border-b border-slate-800">
                      Kecepatan
                    </div>
                    {[0.5, 0.75, 1, 1.25, 1.5, 2].map((spd) => (
                      <button
                        key={spd}
                        onClick={() => handleSpeedChange(spd)}
                        className={`w-full text-left px-2 py-1.5 rounded hover:bg-slate-800 transition-colors ${
                          playbackSpeed === spd ? 'text-pink-400 font-bold' : 'text-slate-200'
                        }`}
                      >
                        {spd === 1 ? 'Normal' : `${spd}x`}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Fullscreen Button */}
              <button
                onClick={toggleFullscreen}
                className="text-slate-300 hover:text-white transition-colors p-1"
                aria-label="Fullscreen"
              >
                {isFullscreen ? <Minimize className="w-5 h-5" /> : <Maximize className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

