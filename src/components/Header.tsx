import React from 'react';
import { ScreenId } from '../types';
import { partyAudio } from '../utils/audio';
import { confettiEmitter } from './ConfettiCanvas';

interface HeaderProps {
  currentScreen: ScreenId;
  onScreenChange: (screen: ScreenId) => void;
  isAudioPlaying: boolean;
  setIsAudioPlaying: (playing: boolean) => void;
}

export default function Header({
  currentScreen,
  onScreenChange,
  isAudioPlaying,
  setIsAudioPlaying,
}: HeaderProps) {
  const toggleMusic = (e: React.MouseEvent<HTMLButtonElement>) => {
    const newState = partyAudio.toggle(setIsAudioPlaying);
    setIsAudioPlaying(newState);
    if (newState) {
      const rect = e.currentTarget.getBoundingClientRect();
      confettiEmitter.sparkles(rect);
    }
  };

  const navItems: { id: ScreenId; label: string }[] = [
    { id: 'welcome-and-sawaal', label: '1. Welcome & Sawaal 👀' },
    { id: 'memory-scrapbook', label: '2. Memory Scrapbook 📸' },
    { id: 'birthday-letter', label: '3. Birthday Letter 💌' },
  ];

  return (
    <header className="fixed top-0 w-full z-40 bg-[#fff7ff]/85 backdrop-blur-xl shadow-[0_4px_20px_-2px_rgba(157,136,255,0.12)] border-b border-[#f2e2ff]/50">
      <div className="h-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 flex items-center justify-between gap-2">
        {/* Brand / Logo */}
        <button
          onClick={() => onScreenChange('welcome-and-sawaal')}
          className="flex items-center gap-2 sm:gap-2.5 text-left group transition-transform active:scale-95"
        >
          <img
            alt="Armeek's Birthday Emblem"
            className="h-8 w-auto object-contain drop-shadow-sm group-hover:rotate-6 transition-transform"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuBCBVgE68Gf9EEIibLo7zoMypdfXVLWtyPGHrvNJduriizcwX6D5ToH12HD-OWbdAsZF7mVHux5h2pQ5q3Fg02s6rIno9UrwWFXwKkoyzWU2RAQPr3M77FwI2YhSgCwWsXoOzdKMp8MZCVau5HcrUmvrvaGMwiI_x92HWhX_PNbgHPwY4VlT9Y3zaYU78t95R33dILOdu4KOEMcKr-Hy6bPdCUgcR6hUCKWNpxekk5WYmZXV98QmTS5CQ"
          />
          <span className="font-headline-sm text-lg sm:text-xl text-[#25113e] tracking-tight font-bold">
            Armeek's Birthday 🎂
          </span>
        </button>

        {/* Desktop Tabs */}
        <nav className="hidden md:flex items-center p-1 bg-[#fbf0ff] rounded-full border border-[#f2e2ff]">
          {navItems.map((item) => {
            const isActive = currentScreen === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  onScreenChange(item.id);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className={`px-3.5 py-2 transition-all font-label-md text-xs sm:text-sm rounded-full ${
                  isActive
                    ? 'bg-[#9d88ff] text-[#33128f] font-bold shadow-[0_2px_8px_rgba(157,136,255,0.28)]'
                    : 'text-[#484553] hover:text-[#25113e] hover:bg-[#f6e9ff]'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Right Action Icons: Party Audio & Profile */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          <button
            onClick={toggleMusic}
            aria-label="Toggle party mode sound"
            className={`flex items-center gap-1.5 px-3 sm:px-4 py-2 rounded-full transition-all active:scale-95 shadow-[0_2px_6px_-1px_rgba(255,181,197,0.25)] ${
              isAudioPlaying
                ? 'bg-[#614bbe] text-white ring-2 ring-[#9d88ff] animate-pulse'
                : 'bg-[#ffb5c5] text-[#7b4351] hover:bg-[#ffd9e0] hover:text-[#370c19]'
            }`}
            title={isAudioPlaying ? 'Mute Party Audio' : 'Play Celebratory Birthday Track'}
          >
            <span
              className={`material-symbols-outlined text-[18px] ${
                isAudioPlaying ? 'animate-spin' : ''
              }`}
            >
              music_note
            </span>
            <span className="hidden sm:inline font-label-sm text-xs font-bold">
              {isAudioPlaying ? 'Playing ♪' : 'Party Audio'}
            </span>
          </button>

          <div
            className="w-8 h-8 rounded-full bg-[#614bbe] flex items-center justify-center text-white shadow-sm ring-2 ring-[#cabeff]/60 cursor-pointer"
            title="VIP Birthday Profile: Armeek"
            onClick={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              confettiEmitter.sparkles(rect);
            }}
          >
            <span className="material-symbols-outlined text-white text-[18px]">person</span>
          </div>
        </div>
      </div>

      {/* Mobile Nav Drawer / Horizontal scroll tabs */}
      <div className="md:hidden flex items-center justify-center gap-1.5 px-3 py-2 bg-[#fbf0ff]/95 border-t border-[#f2e2ff] overflow-x-auto">
        {navItems.map((item) => {
          const isActive = currentScreen === item.id;
          return (
            <button
              key={item.id}
              onClick={() => {
                onScreenChange(item.id);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className={`px-2.5 py-1.5 whitespace-nowrap text-xs font-semibold rounded-full transition-all ${
                isActive
                  ? 'bg-[#9d88ff] text-[#33128f] shadow-sm font-bold'
                  : 'text-[#484553] hover:bg-[#f6e9ff]'
              }`}
            >
              {item.label}
            </button>
          );
        })}
      </div>
    </header>
  );
}
