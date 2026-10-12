import React, { useState, useRef, useEffect } from 'react';
import { ScreenId } from '../types';
import { confettiEmitter } from './ConfettiCanvas';
import voiceNote from '../utils/WhatsApp Audio 2026-10-12 at 22.43.38.opus';
import giftPhoto from '../photos/WhatsApp Image 2026-10-12 at 22.50.42.jpeg';

interface LetterScreenProps {
  onNavigate: (screen: ScreenId) => void;
}

export default function LetterScreen({ onNavigate }: LetterScreenProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [hasPlayed, setHasPlayed] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const animFrameRef = useRef<number | null>(null);

  useEffect(() => {
    const audio = new Audio(voiceNote);
    audioRef.current = audio;

    audio.addEventListener('loadedmetadata', () => {
      setDuration(audio.duration);
      setIsLoading(false);
    });
    audio.addEventListener('ended', () => {
      setIsPlaying(false);
      setCurrentTime(0);
      confettiEmitter.hearts(30);
    });
    audio.addEventListener('error', () => setIsLoading(false));

    return () => {
      audio.pause();
      audio.src = '';
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, []);

  const tick = () => {
    if (!audioRef.current) return;
    setCurrentTime(audioRef.current.currentTime);
    if (!audioRef.current.paused) {
      animFrameRef.current = requestAnimationFrame(tick);
    }
  };

  const togglePlay = async () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    } else {
      await audio.play();
      setIsPlaying(true);
      setHasPlayed(true);
      animFrameRef.current = requestAnimationFrame(tick);
      const rect = document.getElementById('voice-player')?.getBoundingClientRect();
      if (rect) confettiEmitter.sparkles(rect);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const audio = audioRef.current;
    if (!audio) return;
    const val = parseFloat(e.target.value);
    audio.currentTime = val;
    setCurrentTime(val);
  };

  const formatTime = (secs: number) => {
    if (!isFinite(secs)) return '0:00';
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  // Waveform bars – decorative
  const BAR_COUNT = 40;
  const bars = Array.from({ length: BAR_COUNT }, (_, i) => {
    const heights = [30, 55, 45, 70, 35, 80, 60, 40, 90, 50, 65, 38, 75, 48, 85, 42, 68, 55, 30, 78,
      62, 44, 88, 52, 36, 72, 58, 46, 82, 40, 66, 54, 32, 76, 60, 48, 86, 38, 70, 56];
    return heights[i % heights.length];
  });

  return (
    <div className="flex flex-col w-full relative overflow-hidden min-h-[80vh]">
      {/* Ambient glows */}
      <div className="absolute top-12 left-1/2 -translate-x-1/2 w-[700px] h-[360px] bg-gradient-to-tr from-[#cabeff]/30 via-[#ffb5c5]/40 to-[#ffdcc5]/30 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute top-[500px] right-4 w-80 h-80 bg-[#9d88ff]/20 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10 sm:py-16 w-full flex flex-col items-center gap-10">

        {/* ── Header ── */}
        <div className="flex flex-col items-center text-center gap-3">
          <div className="inline-flex items-center gap-1.5 px-4 py-1 rounded-full bg-[#874d5b] text-white shadow-md -rotate-1 hover:rotate-0 transition-transform">
            <span
              className="material-symbols-outlined text-[16px] text-[#ffd9e0]"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              verified
            </span>
            <span className="font-label-sm text-xs uppercase tracking-wider text-[#ffd9e0] font-bold">
              Official BFF Seal • Strictly Confidential 🎙️
            </span>
          </div>

          <h1 className="font-display-hero text-display-hero text-[#25113e] tracking-tight leading-tight mt-1">
            One Last Thing, Armeek... 🎙️❤️
          </h1>
          <p className="font-body-lg text-base sm:text-lg text-[#484553] max-w-xl mx-auto">
            A little voice note straight from the heart. Listen carefully, bestie!
          </p>
        </div>

        {/* ── Voice Note Player Card ── */}
        <div
          id="voice-player"
          className="w-full bg-gradient-to-br from-[#ffffff] via-[#fbf0ff] to-[#f6e9ff] rounded-3xl p-7 sm:p-10 shadow-[0_20px_60px_-10px_rgba(97,75,190,0.18),0_6px_20px_rgba(255,181,197,0.2)] border border-[#eedbff] relative overflow-hidden"
        >
          {/* Decorative corner blobs */}
          <div className="absolute -top-6 -left-6 w-28 h-28 bg-[#cabeff]/30 rounded-full blur-xl pointer-events-none" />
          <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-[#ffb5c5]/30 rounded-full blur-xl pointer-events-none" />

          {/* WhatsApp-style header */}
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#614bbe] to-[#874d5b] flex items-center justify-center shadow-md shrink-0">
              <span className="material-symbols-outlined text-white text-[22px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                mic
              </span>
            </div>
            <div>
              <p className="font-bold text-[#25113e] text-sm">Voice Note 🎙️</p>
              <p className="text-xs text-[#614bbe] font-medium">
                {isLoading ? 'Loading...' : `${formatTime(duration)} • From your bestie`}
              </p>
            </div>
            {/* Animated mic ping when playing */}
            {isPlaying && (
              <div className="ml-auto flex items-center gap-1">
                {[1, 2, 3].map((n) => (
                  <div
                    key={n}
                    className="w-1 bg-[#614bbe] rounded-full animate-bounce"
                    style={{
                      height: `${8 + n * 5}px`,
                      animationDelay: `${n * 0.1}s`,
                    }}
                  />
                ))}
              </div>
            )}
          </div>

          {/* ── Waveform visualiser ── */}
          <div className="flex items-end justify-center gap-[3px] h-16 mb-6 px-2">
            {bars.map((h, i) => {
              const barProgress = (i / BAR_COUNT) * 100;
              const isActive = barProgress <= progress;
              return (
                <div
                  key={i}
                  className="rounded-full transition-all duration-75"
                  style={{
                    width: '4px',
                    height: `${h}%`,
                    backgroundColor: isActive
                      ? isPlaying
                        ? '#614bbe'
                        : '#9d88ff'
                      : '#e2d5ff',
                    transform: isActive && isPlaying ? `scaleY(${0.8 + Math.random() * 0.4})` : 'scaleY(1)',
                  }}
                />
              );
            })}
          </div>

          {/* ── Seek bar ── */}
          <div className="mb-6">
            <input
              type="range"
              min={0}
              max={duration || 0}
              step={0.01}
              value={currentTime}
              onChange={handleSeek}
              className="w-full h-1.5 rounded-full appearance-none cursor-pointer"
              style={{
                background: `linear-gradient(to right, #614bbe ${progress}%, #e2d5ff ${progress}%)`,
              }}
            />
            <div className="flex justify-between text-[11px] text-[#484553] font-mono mt-1.5">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>

          {/* ── Play / Pause button ── */}
          <div className="flex justify-center">
            <button
              onClick={togglePlay}
              disabled={isLoading}
              className={`
                w-20 h-20 rounded-full flex items-center justify-center shadow-xl
                transition-all duration-200 active:scale-90
                ${isLoading
                  ? 'bg-[#eedbff] cursor-not-allowed'
                  : isPlaying
                    ? 'bg-gradient-to-br from-[#874d5b] to-[#614bbe] hover:scale-110 ring-4 ring-[#cabeff]/60 animate-pulse'
                    : 'bg-gradient-to-br from-[#614bbe] to-[#874d5b] hover:scale-110 ring-4 ring-[#cabeff]/40'
                }
              `}
              aria-label={isPlaying ? 'Pause voice note' : 'Play voice note'}
            >
              {isLoading ? (
                <span className="material-symbols-outlined text-[#9d88ff] text-[32px] animate-spin">refresh</span>
              ) : isPlaying ? (
                <span className="material-symbols-outlined text-white text-[36px]" style={{ fontVariationSettings: "'FILL' 1" }}>pause</span>
              ) : (
                <span className="material-symbols-outlined text-white text-[36px]" style={{ fontVariationSettings: "'FILL' 1" }}>play_arrow</span>
              )}
            </button>
          </div>

          {/* Post-play message */}
          {hasPlayed && !isPlaying && currentTime === 0 && (
            <div className="mt-6 text-center animate-fade-in">
              <p className="text-sm text-[#614bbe] font-semibold">
                Happy Birthday, Armeek Bestie! 🥳❤️
              </p>
              <p className="text-xs text-[#484553] mt-1">
                Hope that made you smile! 💜
              </p>
            </div>
          )}
        </div>

        {/* ── 51 Rupees Gift Photo ── */}
        <div className="w-full relative">
          {/* Washi tape strip */}
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-32 h-6 bg-[#ffdcc5]/90 backdrop-blur-sm -rotate-1 rounded-sm shadow-sm pointer-events-none z-10" />

          <div className="bg-white rounded-3xl p-5 sm:p-6 shadow-[0_12px_40px_-6px_rgba(97,75,190,0.14),0_4px_16px_rgba(255,181,197,0.2)] border border-[#eedbff] -rotate-1 hover:rotate-0 transition-transform group overflow-hidden">
            {/* Photo */}
            <div className="w-full rounded-2xl overflow-hidden mb-4 relative">
              <img
                src={giftPhoto}
                alt="A little something for Armeek's birthday"
                className="w-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <span className="absolute bottom-2 left-2 px-2.5 py-1 bg-[#25113e]/70 backdrop-blur-sm text-white text-[11px] font-mono rounded-md">
                SPECIAL DELIVERY 🎁
              </span>
            </div>

            {/* Caption */}
            <div className="text-center space-y-1 px-2">
              <p className="font-bold text-[#25113e] text-base sm:text-lg">
                ₹51 — to make your bday more special 🎂💜
              </p>
              <p className="text-sm text-[#484553] leading-relaxed">
                A small token, straight from the heart. Happy Birthday, Armeek Bestie! Thank you for being you. 🙏❤️
              </p>
            </div>
          </div>
        </div>

        {/* ── Proceed Button ── */}
        <div className="flex flex-col items-center gap-2 mt-4">
          <button
            className="px-8 py-3.5 rounded-full bg-gradient-to-r from-[#614bbe] to-[#874d5b] text-white font-headline-sm text-base shadow-xl hover:scale-105 active:scale-95 transition-all flex items-center gap-2 cursor-pointer font-bold"
            onClick={(e) => {
              confettiEmitter.blast(e.clientX, e.clientY, 80);
              confettiEmitter.hearts(20);
              setTimeout(() => {
                onNavigate('welcome-and-sawaal');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }, 500);
            }}
          >
            <span>🎉 Back to the celebration!</span>
            <span className="material-symbols-outlined text-[20px]">celebration</span>
          </button>
          <span className="text-xs text-[#484553] font-body-sm">
            Strictly Confidential • For Armeek's Ears Only 🔒
          </span>
        </div>

      </div>
    </div>
  );
}
