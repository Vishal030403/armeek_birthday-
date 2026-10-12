import React, { useState, useRef } from 'react';
import { ScreenId } from '../types';
import { confettiEmitter } from './ConfettiCanvas';
import lordPunitVideo from '../utils/lord_punit_screaming.mp4';

interface WelcomeScreenProps {
  onNavigate: (screen: ScreenId) => void;
  isUnlocked: boolean;
  setIsUnlocked: (unlocked: boolean) => void;
}

const DODGE_LINES = [
  "Nope! Can't click me! 😜",
  "Nice try Armeek ! 🏃💨",
  "Gussa not allowed today! 🙅‍♂️",
  "Bhai maan ja ab! 🥺",
  "Error 404: Anger not found! 😂",
  "Click NO already! ❤️",
  "Fast hands, but not fast enough! ⚡️",
  "Are you seriously still trying? 😂",
  "Dosti mein no gussa allowed! 🤝",
];

export default function WelcomeScreen({
  onNavigate,
  isUnlocked,
  setIsUnlocked,
}: WelcomeScreenProps) {
  const [dodgeIndex, setDodgeIndex] = useState(0);
  const [dodgeMessage, setDodgeMessage] = useState("Nope! Can't click me! 😜");
  const [showDodgeToast, setShowDodgeToast] = useState(false);
  const [dodgeOffset, setDodgeOffset] = useState({ x: 0, y: 0, rot: 0 });
  const [hasClickedNo, setHasClickedNo] = useState(isUnlocked);
  const [showVideo, setShowVideo] = useState(false);
  const toastTimeoutRef = useRef<number | null>(null);
  const arenaRef = useRef<HTMLDivElement | null>(null);

  const dodgeButton = (e?: React.SyntheticEvent) => {
    if (e) {
      e.preventDefault();
    }
    const arenaWidth = arenaRef.current ? arenaRef.current.clientWidth : 340;
    const maxX = Math.min(arenaWidth > 640 ? 200 : 120, arenaWidth / 2 - 30);
    const maxY = 65;

    // Calculate new position away from 0
    let randX = (Math.random() * (maxX * 2)) - maxX;
    let randY = (Math.random() * (maxY * 2)) - maxY;

    // Ensure it noticeably moves
    if (Math.abs(randX - dodgeOffset.x) < 40) {
      randX = randX > 0 ? randX + 50 : randX - 50;
    }
    const randRot = (Math.random() * 24) - 12;

    setDodgeOffset({ x: randX, y: randY, rot: randRot });

    // Show witty toast
    const nextLine = DODGE_LINES[dodgeIndex % DODGE_LINES.length];
    setDodgeMessage(nextLine);
    setDodgeIndex((prev) => prev + 1);
    setShowDodgeToast(true);

    if (toastTimeoutRef.current) {
      window.clearTimeout(toastTimeoutRef.current);
    }
    toastTimeoutRef.current = window.setTimeout(() => {
      setShowDodgeToast(false);
    }, 1800);
  };

  const handleNoClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const originX = rect.left + rect.width / 2;
    const originY = rect.top + rect.height / 2;

    // Big celebration blasts
    confettiEmitter.blast(originX, originY, 110);
    setTimeout(() => confettiEmitter.blast(originX - 120, originY - 40, 80), 220);
    setTimeout(() => confettiEmitter.blast(originX + 120, originY - 40, 80), 450);
    confettiEmitter.hearts(35);

    setShowDodgeToast(false);
    setHasClickedNo(true);
    setIsUnlocked(true);

    // Smoothly scroll down to success card
    setTimeout(() => {
      const el = document.getElementById('successCard');
      el?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 150);
  };

  return (
    <div className="flex flex-col w-full relative overflow-hidden">
      {/* ── Lord Punit Video Modal ── */}
      {showVideo && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center"
          style={{ background: 'rgba(8,4,20,0.92)' }}
          onClick={() => setShowVideo(false)}
        >
          <div className="absolute inset-0 backdrop-blur-sm" />
          <div
            className="relative z-10 flex flex-col items-center w-full max-w-[92vw] sm:max-w-xl"
            onClick={(e) => e.stopPropagation()}
            style={{ animation: 'lightboxIn 0.22s cubic-bezier(0.34,1.56,0.64,1) both' }}
          >
            <video
              src={lordPunitVideo}
              autoPlay
              controls
              playsInline
              className="w-full rounded-2xl shadow-[0_32px_80px_-10px_rgba(0,0,0,0.7)] max-h-[80vh] object-contain"
            />
            <p className="mt-3 text-white/50 text-xs font-mono">Tap outside to close 😂</p>
          </div>
          {/* Close button */}
          <button
            className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-white/15 hover:bg-white/30 backdrop-blur-sm flex items-center justify-center transition-all"
            onClick={() => setShowVideo(false)}
            aria-label="Close video"
          >
            <span className="material-symbols-outlined text-white text-[22px]">close</span>
          </button>
        </div>
      )}

      {/* Ambient Living Pastel Orbs */}
      <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[720px] h-[520px] bg-gradient-to-br from-[#e6deff]/50 via-[#ffd9e0]/40 to-[#ffdcc5]/30 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute top-[480px] -left-48 w-96 h-96 bg-[#9d88ff]/20 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute top-[720px] -right-48 w-[420px] h-[420px] bg-[#ffb5c5]/25 rounded-full blur-3xl pointer-events-none -z-10" />

      {/* Hero Content Section */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-12 pt-8 pb-12 w-full flex flex-col items-center text-center relative">
        {/* Top Festive Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#f2e2ff] shadow-sm shadow-[#9d88ff]/20 mb-6 animate-pulse">
          <span
            className="material-symbols-outlined text-[16px] text-[#944a00]"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            cake
          </span>
          <span className="font-label-sm text-xs sm:text-sm text-[#25113e] tracking-wider uppercase font-extrabold">
            Special Edition for Armeek  • It's Celebration Time 🎉
          </span>
          <span
            className="material-symbols-outlined text-[16px] text-[#614bbe]"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            celebration
          </span>
        </div>

        {/* Joyful Typography Heading with Floating Visual Elements */}
        <div className="relative w-full max-w-4xl mx-auto mb-10">
          {/* Floating Decorative Balloon 1 */}
          <div className="hidden md:flex absolute -left-12 top-2 flex-col items-center animate-bounce duration-1000 select-none">
            <span className="text-4xl filter drop-shadow-md">🎈</span>
            <div className="w-0.5 h-12 bg-[#c9c4d5]/60" />
          </div>
          {/* Floating Decorative Balloon 2 */}
          <div className="hidden md:flex absolute -right-10 top-0 flex-col items-center animate-bounce duration-700 select-none">
            <span className="text-4xl filter drop-shadow-md">🎈</span>
            <div className="w-0.5 h-10 bg-[#c9c4d5]/60" />
          </div>

          <div className="flex items-center justify-center gap-1.5 mb-2 text-[#614bbe] font-label-md text-xs sm:text-sm uppercase tracking-widest">
            <span className="material-symbols-outlined text-[18px]">auto_awesome</span>
            <span>The Main Event Is Here</span>
            <span className="material-symbols-outlined text-[18px]">auto_awesome</span>
          </div>

          <h1 className="font-display-hero text-display-hero text-[#25113e] tracking-tight leading-none mb-3 drop-shadow-sm">
            Happiest Birthday,{' '}
            <span className="bg-gradient-to-r from-[#614bbe] via-[#874d5b] to-[#e4802b] bg-clip-text text-transparent">
              Armeek !
            </span>{' '}
            🎂❤️
          </h1>
          <p className="font-headline-sm text-base sm:text-lg md:text-xl text-[#484553] max-w-2xl mx-auto">
            Another year of unmatched banter, late-night talks, and timeless brotherhood.
          </p>
        </div>

        {/* Asymmetric Scrapbook Showcase (Intro Card + Cake & Gifts Visual Bento) */}
        <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch text-left">
          {/* Heartfelt Intro Card (Handcrafted polaroid / papercraft feel) */}
          <div className="lg:col-span-7 bg-[#ffffff] rounded-3xl p-6 sm:p-8 lg:p-10 shadow-[0_4px_24px_-2px_rgba(157,136,255,0.14),0_2px_8px_-1px_rgba(255,181,197,0.12)] relative flex flex-col justify-between overflow-hidden group border border-[#f2e2ff]">
            {/* Washi Tape Accent at Top Center */}
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-28 h-7 bg-[#ffdcc5]/80 backdrop-blur-sm -rotate-2 rounded-sm shadow-xs pointer-events-none" />

            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="px-3 py-1 bg-[#f6e9ff] rounded-full font-label-sm text-xs text-[#614bbe] flex items-center gap-1">
                  <span className="material-symbols-outlined text-[14px]">favorite</span> Bro Code Certified
                </span>
                <span className="font-label-sm text-xs text-[#484553]">Est. Day One ⚡️</span>
              </div>

              <h2 className="font-headline-md text-xl sm:text-2xl text-[#25113e] mb-4 font-bold">
                Happy Birthday to my best friend, Armeek ! 🥳
              </h2>

              <div className="space-y-4 font-body-lg text-base sm:text-lg text-[#484553] leading-relaxed">
                <p>
                  Many many happy returns of the day, bro! May your life always be filled with boundless happiness,
                  unstoppable success, contagious laughter, and unforgettable memories.
                </p>
                <p>
                  or agar iske baad tune mujhe unblock nhi kia to tu piti bete . aalu se terko rehpte padwaunga
                </p>
                <p className="font-headline-sm text-base sm:text-lg text-[#614bbe] font-semibold">
                  jab dekho naatak krwalo inse .
                </p>
              </div>
            </div>

            <div className="mt-6 pt-4 flex flex-wrap items-center justify-between gap-3 bg-[#fbf0ff]/70 rounded-2xl p-3 border border-[#f2e2ff]/50">
              <div className="flex items-center gap-1.5 text-[#874d5b] font-label-md text-sm">
                <span className="material-symbols-outlined text-[18px]">verified</span>
                <span>Unbreakable Bond</span>
              </div>
              <div className="flex gap-2">
                <button
                  className="px-4 py-2 rounded-full bg-[#614bbe] text-white font-label-sm text-xs sm:text-sm hover:scale-105 active:scale-95 transition-transform flex items-center gap-1.5 shadow-md cursor-pointer"
                  onClick={(e) => {
                    const rect = e.currentTarget.getBoundingClientRect();
                    confettiEmitter.blast(rect.left + rect.width / 2, rect.top + rect.height / 2, 70);
                    setShowVideo(true);
                  }}
                  type="button"
                >
                  <span className="material-symbols-outlined text-[16px]">celebration</span> party pooper!
                </button>
              </div>
            </div>
          </div>

          {/* Festive Graphics Card (Cake + Gift Illustration Bento Stack) */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            {/* Interactive Multi-tier Birthday Cake Card */}
            <div
              className="bg-[#f6e9ff] rounded-3xl p-6 shadow-sm flex flex-col items-center justify-center relative overflow-hidden text-center group cursor-pointer border border-[#f2e2ff]"
              onClick={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                confettiEmitter.sparkles(rect);
              }}
              title="Click the cake for birthday magic!"
            >
              <div className="absolute -right-4 -bottom-4 w-28 h-28 bg-[#ffd9e0]/40 rounded-full blur-xl pointer-events-none" />

              {/* Cute SVG Cake Graphic */}
              <div className="relative my-2 select-none">
                {/* Glow Behind Flame */}
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-6 h-6 bg-[#e4802b]/50 rounded-full blur-sm animate-ping" />
                <svg className="w-36 h-36" fill="none" viewBox="0 0 160 160" xmlns="http://www.w3.org/2000/svg">
                  {/* Plate */}
                  <ellipse cx="80" cy="142" fill="#EEDBFF" rx="60" ry="10" />
                  {/* Bottom Tier */}
                  <rect fill="#9D88FF" height="40" rx="10" width="88" x="36" y="98" />
                  {/* Bottom Tier Frosting Drops */}
                  <path
                    d="M36 108C42 114 46 104 52 110C58 116 64 104 70 110C76 116 82 104 88 110C94 116 100 104 106 110C112 116 118 106 124 108V98H36V108Z"
                    fill="#FFF7FF"
                  />
                  {/* Middle Tier */}
                  <rect fill="#FFB5C5" height="34" rx="8" width="64" x="48" y="66" />
                  {/* Middle Tier Frosting Drops */}
                  <path
                    d="M48 74C54 78 58 72 64 76C70 80 74 72 80 76C86 80 90 72 96 76C102 80 106 74 112 74V66H48V74Z"
                    fill="#FFF7FF"
                  />
                  {/* Top Candles */}
                  <rect fill="#CABEFF" height="28" rx="4" width="8" x="76" y="38" />
                  <rect fill="#E4802B" height="22" rx="3" width="6" x="58" y="44" />
                  <rect fill="#E4802B" height="22" rx="3" width="6" x="96" y="44" />
                  {/* Candle Flames (Animated) */}
                  <path
                    className="animate-pulse origin-bottom"
                    d="M80 20C77 26 75 30 78 36C80 38 82 38 82 36C85 30 83 26 80 20Z"
                    fill="#E4802B"
                  />
                  <path
                    className="animate-pulse origin-bottom delay-100"
                    d="M61 28C59 33 57 36 60 41C61 43 63 43 63 41C65 36 63 33 61 28Z"
                    fill="#FFB783"
                  />
                  <path
                    className="animate-pulse origin-bottom delay-200"
                    d="M99 28C97 33 95 36 98 41C99 43 101 43 101 41C103 36 101 33 99 28Z"
                    fill="#FFB783"
                  />
                </svg>
              </div>

              <div className="mt-2">
                <span className="font-label-md text-sm sm:text-base text-[#25113e] font-bold">
                  100% Homemade Friendship Cake
                </span>
                <p className="font-body-sm text-xs sm:text-sm text-[#484553]">
                  Calories: 0 • Good Vibes: 10,000,000%
                </p>
              </div>
            </div>


          </div>
        </div>
      </section>

      {/* Section Divider with Cute Badge */}
      <div className="max-w-2xl mx-auto flex items-center justify-center gap-4 my-4 px-6 w-full">
        <div className="h-[2px] flex-1 bg-[#f2e2ff] rounded-full" />
        <span className="font-label-sm text-xs text-[#484553] uppercase tracking-widest px-3 py-1 bg-[#f6e9ff] rounded-full font-bold">
          HALT • VERIFICATION REQUIRED
        </span>
        <div className="h-[2px] flex-1 bg-[#f2e2ff] rounded-full" />
      </div>

      {/* The Interactive Sawaal (Question) Card Section */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-12 py-8 w-full flex flex-col items-center">
        <div
          ref={arenaRef}
          className="w-full relative bg-gradient-to-br from-[#f6e9ff] via-[#fbf0ff] to-[#ffd9e0]/30 rounded-3xl p-6 sm:p-10 md:p-12 shadow-[0_16px_40px_-6px_rgba(157,136,255,0.22),0_6px_16px_rgba(251,146,60,0.12)] text-center overflow-visible border border-[#eedbff]"
        >
          {/* Quirky Corner Stickers */}
          <div className="absolute -top-4 -left-3 px-3 sm:px-4 py-1 bg-[#ffdcc5] text-[#301400] rounded-full font-label-sm text-xs shadow-sm -rotate-6 select-none font-bold">
            ⚠️ Warning: High Drama Zone
          </div>
          <div className="absolute -bottom-3 -right-2 px-3 sm:px-4 py-1 bg-[#e6deff] text-[#1c0062] rounded-full font-label-sm text-xs shadow-sm rotate-3 select-none font-bold">
            No Lies Allowed 🤥
          </div>

          {/* Icon & Overline */}
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-[#ffffff] text-[#614bbe] shadow-sm mb-4">
            <span
              className="material-symbols-outlined text-[28px]"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              psychology_alt
            </span>
          </div>

          {/* The Core Question Texts */}
          <h3 className="font-headline-sm text-sm sm:text-base text-[#484553] mb-1 font-semibold">
            Okay, birthday boy... but ek important sawaal hai! 👀
          </h3>
          <h2 className="font-headline-lg text-2xl sm:text-3xl md:text-4xl text-[#25113e] font-extrabold tracking-tight mb-4">
            Are you still angry with me? 🥺👉👈
          </h2>
          <p className="font-body-md text-sm sm:text-base text-[#484553] max-w-md mx-auto mb-8">
            Be 100% honest! Your genuine response will automatically unlock your digital birthday gift box below.
          </p>

          {/* Button Arena (Relative playground container for the dodging button) */}
          <div className="relative min-h-[140px] flex items-center justify-center gap-6 flex-wrap py-4">
            {/* Stationary "NO" Button (The Gateway) */}
            <button
              onClick={handleNoClick}
              type="button"
              className={`z-20 px-6 sm:px-8 py-3.5 sm:py-4 rounded-full text-white font-headline-sm text-base sm:text-lg shadow-[0_8px_24px_rgba(97,75,190,0.35)] hover:shadow-[0_12px_32px_rgba(97,75,190,0.5)] hover:scale-105 active:scale-95 transition-all flex items-center gap-2 group cursor-pointer ${hasClickedNo ? 'bg-[#614bbe]' : 'bg-gradient-to-r from-[#614bbe] to-[#9d88ff]'
                }`}
            >
              {hasClickedNo ? (
                <>
                  <span className="material-symbols-outlined text-[24px]">done_all</span>
                  <span>Dosti Amar Rahegi! 🤝</span>
                </>
              ) : (
                <>
                  <span
                    className="material-symbols-outlined text-[24px] text-[#ffd9e0] group-hover:scale-125 transition-transform"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    favorite
                  </span>
                  <span>NO 🥹❤️</span>
                </>
              )}
            </button>

            {/* The Famous Running "YES" Button */}
            <div
              className="relative z-10 transition-transform duration-200"
              style={{
                transform: `translate(${dodgeOffset.x}px, ${dodgeOffset.y}px) rotate(${dodgeOffset.rot}deg)`,
              }}
            >
              <button
                onMouseEnter={dodgeButton}
                onTouchStart={dodgeButton}
                onClick={dodgeButton}
                type="button"
                className="px-6 sm:px-8 py-3.5 sm:py-4 rounded-full bg-gradient-to-r from-[#874d5b] to-[#ffb5c5] text-white font-headline-sm text-base sm:text-lg shadow-[0_4px_16px_rgba(135,77,91,0.25)] select-none cursor-pointer flex items-center gap-1.5 transition-colors active:scale-95"
              >
                <span>YES 😤</span>
              </button>
            </div>
          </div>

          {/* Mini Toast Alert Display For Dodge Attempts */}
          <div
            className={`h-8 mt-2 flex items-center justify-center transition-opacity duration-300 ${showDodgeToast ? 'opacity-100' : 'opacity-0'
              }`}
          >
            <span className="px-4 py-1.5 bg-[#eedbff] text-[#25113e] rounded-full font-label-md text-xs sm:text-sm shadow-xs font-semibold">
              {dodgeMessage}
            </span>
          </div>
        </div>

        {/* Forgiven Celebration Reveal Card (Unlocked upon clicking NO) */}
        {hasClickedNo && (
          <div
            id="successCard"
            className="w-full mt-8 bg-[#ffffff] rounded-3xl p-6 sm:p-10 shadow-[0_20px_48px_-10px_rgba(97,75,190,0.25)] border-2 border-[#9d88ff]/40 text-center animate-in fade-in zoom-in-95 duration-500"
          >
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#ffd9e0] text-[#370c19] mb-4 animate-bounce">
              <span
                className="material-symbols-outlined text-[36px]"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                volunteer_activism
              </span>
            </div>
            <h3 className="font-headline-lg text-xl sm:text-2xl md:text-3xl text-[#25113e] mb-2 font-black">
              Hehe, I knew you'd forgive me! 🥹❤️
            </h3>
            <p className="font-body-lg text-sm sm:text-base md:text-lg text-[#484553] max-w-lg mx-auto mb-6">
              Best friends can never stay mad for too long! Now you have unlocked your special treasure vault
              packed with memories, roasts, and nostalgia.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={() => {
                  onNavigate('memory-scrapbook');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="w-full sm:w-auto px-8 py-3.5 sm:py-4 rounded-full bg-gradient-to-r from-[#614bbe] to-[#874d5b] text-white font-headline-sm text-base sm:text-lg shadow-lg hover:scale-105 active:scale-95 transition-transform flex items-center justify-center gap-2 cursor-pointer font-bold"
              >
                <span>Proceed to Memory Scrapbook 📸</span>
                <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
              </button>
              <button
                onClick={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  confettiEmitter.blast(rect.left + rect.width / 2, rect.top + rect.height / 2, 85);
                }}
                className="w-full sm:w-auto px-6 py-3.5 sm:py-4 rounded-full bg-[#f6e9ff] text-[#25113e] font-label-md text-sm hover:bg-[#f2e2ff] transition-colors flex items-center justify-center gap-1.5 cursor-pointer font-semibold"
                type="button"
              >
                <span className="material-symbols-outlined text-[20px]">celebration</span>
                <span>More Confetti!</span>
              </button>
            </div>
          </div>
        )}
      </section>

      {/* Friendship Micro-Delight Footnote Quotes */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 py-6 text-center w-full">
        <div className="p-5 sm:p-6 bg-[#fbf0ff] rounded-2xl shadow-xs flex flex-col md:flex-row items-center justify-between gap-4 border border-[#f2e2ff]">
          <div className="flex items-center gap-3 text-left">
            <span
              className="material-symbols-outlined text-[32px] text-[#614bbe] shrink-0"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              format_quote
            </span>
            <div>
              <p className="font-body-md text-sm sm:text-base text-[#25113e] font-medium italic">
                "A true friend is someone who thinks that you are a good egg even though he knows that you are slightly cracked."
              </p>
              <span className="font-label-sm text-xs text-[#484553]">— That's us, Armeek . Happy Birthday! 🥂</span>
            </div>
          </div>
          <div className="shrink-0 flex items-center gap-2">
            <button
              aria-label="Send love"
              className="w-12 h-12 rounded-full bg-[#ffd9e0] text-[#370c19] flex items-center justify-center hover:scale-110 active:scale-90 transition-transform shadow-xs cursor-pointer"
              onClick={() => confettiEmitter.hearts(35)}
              type="button"
              title="Send floating hearts"
            >
              <span className="material-symbols-outlined text-[22px]">favorite</span>
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
