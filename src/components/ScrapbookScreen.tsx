import React, { useState, useEffect, useCallback } from 'react';
import { ScreenId } from '../types';
import { confettiEmitter } from './ConfettiCanvas';

// ─── Auto-import every image in src/photos/ ──────────────────────────────────
// Drop any .jpg / .jpeg / .png / .webp / .gif into src/photos/ and it will
// automatically appear as a polaroid card here. No code changes needed!
const photoModules = import.meta.glob(
  '../photos/*.{jpg,jpeg,png,webp,gif,JPG,JPEG,PNG,WEBP,GIF}',
  { eager: true, as: 'url' }
);
const PHOTO_URLS: string[] = Object.values(photoModules) as string[];

// ─── Polaroid styling helpers ─────────────────────────────────────────────────
const ROTATIONS = ['-rotate-2', 'rotate-2', '-rotate-1', 'rotate-1', '-rotate-3', 'rotate-3'];
const TAPE_COLORS = [
  'bg-[#ffdcc5]/80',
  'bg-[#ffb5c5]/80',
  'bg-[#cabeff]/80',
  'bg-[#ffd9e0]/80',
  'bg-[#f2e2ff]/80',
];
const LABELS = [
  'GOLDEN HOUR ✨',
  'BFF MOMENT 🤝',
  'CHAOS ERA 😂',
  'LEGENDARY VIBES 🔥',
  'DAY ONE 💜',
  'BEST TIMES 🎉',
  'MEMORIES 📸',
  'UNFORGETTABLE 🌟',
];

// ─── Types ────────────────────────────────────────────────────────────────────
interface ScrapbookScreenProps {
  onNavigate: (screen: ScreenId) => void;
}

interface NoteItem {
  id: string;
  text: string;
  author: string;
  color: string;
  rotation: string;
}

const INITIAL_NOTES: NoteItem[] = [
  {
    id: '1',
    text: 'Bhai treats when? Party venue kab decide kar raha hai? 🍕🍻',
    author: 'The Gang',
    color: 'bg-[#ffdcc5] text-[#301400]',
    rotation: '-rotate-2',
  },
  {
    id: '2',
    text: 'May you find someone who looks at you the way you look at chicken roll! 🌯😂',
    author: 'Canteen Bro',
    color: 'bg-[#ffb5c5] text-[#370c19]',
    rotation: 'rotate-3',
  },
  {
    id: '3',
    text: 'Remember Goa pact: Whatever happened in Goa stays in Goa! 🏖️🤫',
    author: 'Secret Keeper',
    color: 'bg-[#cabeff] text-[#1c0062]',
    rotation: '-rotate-1',
  },
  {
    id: '4',
    text: 'Bro code rule #42: Never let Armeek drive if there is Google Maps involved. 🗺️🚗',
    author: 'Navigator',
    color: 'bg-[#ffd9e0] text-[#6c3644]',
    rotation: 'rotate-2',
  },
];

// ─── Placeholder polaroids shown when src/photos/ is empty ───────────────────
const PLACEHOLDER_POLAROIDS = [
  {
    label: 'CHAI TAPRI • 5:45 PM',
    title: 'Chai, Bakchodi & Big Dreams',
    caption: '"Bhai sun ek startup idea hai…" and then we laughed for 2 hours over Rs 10 ki cutting chai.',
    src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDSIrp57C_5_VL3UH9m11cHzI1RLdgpm_xp_35v71cKiADSbGBj2aUlmf6SoXICJOrwUXivBTkelHTOmJ_ONz91n_7PpCpRYV0O_raaYqHy-085D4S6E-SrOLz1oEB4jg3MP48RGcXN4b3qdN44brN4zRNKhG_iY-3J04_sveRUT8bpcZBFDrhGi06sot9gzqO5gfJPKYkM-YobBsEuwRsVPc2mw-U9zjsYbqAFcDqz-sE8Tt_M1C6Ozw',
    rotation: '-rotate-1',
    tape: 'bg-[#ffdcc5]/80',
  },
  {
    label: 'GOLDEN HOUR SMILES',
    title: 'The Man. The Legend. Armeek.',
    caption: 'That trademark laugh when someone makes a terrible dad joke. Keep radiating this happy energy!',
    src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAyjVozyIV8MHKoJKF6hpB0VqMRskA169oZREIoRaizQTaj3NAaeACqQ0UU4qIEe25fhf2eDSE5PqRpC0QKP0K3zRky3mfr6D8ra8fSQiBwwfuedcaUCbwg44Ilk_FqvJMprZ5ZveW6gSpkJB8ZvtDDRED5292rNUg7HE3TgKbntQxy3yf2mR_0QnquHbLceRX6EkzKdIU-GMIX3rPn8EOG70-LnFUseBgrFxrD3_eMubMG4-Iz-4aqXg',
    rotation: 'rotate-2',
    tape: 'bg-[#ffb5c5]/80',
  },
];

// ─── Component ────────────────────────────────────────────────────────────────
export default function ScrapbookScreen({ onNavigate }: ScrapbookScreenProps) {
  const [notes, setNotes] = useState<NoteItem[]>(INITIAL_NOTES);
  const [newNoteText, setNewNoteText] = useState('');
  const [lightbox, setLightbox] = useState<{ url: string; index: number } | null>(null);

  // All photos available for lightbox prev/next
  const allPhotos = PHOTO_URLS.length > 0
    ? PHOTO_URLS
    : PLACEHOLDER_POLAROIDS.map((p) => p.src);

  const openLightbox = (url: string, index: number) => setLightbox({ url, index });
  const closeLightbox = () => setLightbox(null);

  const goNext = useCallback(() => {
    if (!lightbox) return;
    const next = (lightbox.index + 1) % allPhotos.length;
    setLightbox({ url: allPhotos[next], index: next });
  }, [lightbox, allPhotos]);

  const goPrev = useCallback(() => {
    if (!lightbox) return;
    const prev = (lightbox.index - 1 + allPhotos.length) % allPhotos.length;
    setLightbox({ url: allPhotos[prev], index: prev });
  }, [lightbox, allPhotos]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!lightbox) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowRight') goNext();
      if (e.key === 'ArrowLeft') goPrev();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [lightbox, goNext, goPrev]);

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNoteText.trim()) return;

    const colors = [
      'bg-[#ffdcc5] text-[#301400]',
      'bg-[#ffb5c5] text-[#370c19]',
      'bg-[#cabeff] text-[#1c0062]',
      'bg-[#ffd9e0] text-[#6c3644]',
      'bg-[#f2e2ff] text-[#33128f]',
    ];
    const rotations = ['-rotate-3', 'rotate-2', '-rotate-1', 'rotate-3', '-rotate-2'];

    const newNote: NoteItem = {
      id: Date.now().toString(),
      text: newNoteText.trim(),
      author: 'You (Bestie)',
      color: colors[Math.floor(Math.random() * colors.length)],
      rotation: rotations[Math.floor(Math.random() * rotations.length)],
    };

    setNotes((prev) => [newNote, ...prev]);
    setNewNoteText('');
    confettiEmitter.blast(window.innerWidth / 2, window.innerHeight * 0.7, 50);
  };

  const hasPhotos = PHOTO_URLS.length > 0;

  return (
    <div className="flex flex-col w-full relative overflow-hidden">
      {/* ── Lightbox Modal ── */}
      {lightbox && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center"
          style={{ background: 'rgba(10,5,25,0.88)' }}
          onClick={closeLightbox}
        >
          {/* Backdrop blur layer */}
          <div className="absolute inset-0 backdrop-blur-sm" />

          {/* Image container — stop propagation so clicking image doesn't close */}
          <div
            className="relative z-10 flex flex-col items-center max-w-[92vw] max-h-[92vh]"
            onClick={(e) => e.stopPropagation()}
            style={{ animation: 'lightboxIn 0.22s cubic-bezier(0.34,1.56,0.64,1) both' }}
          >
            <img
              src={lightbox.url}
              alt="Memory"
              className="max-w-full max-h-[80vh] rounded-2xl shadow-[0_32px_80px_-10px_rgba(0,0,0,0.6)] object-contain"
            />
            {/* Counter */}
            <p className="mt-3 text-white/60 text-xs font-mono">
              {lightbox.index + 1} / {allPhotos.length}
            </p>
          </div>

          {/* Close button */}
          <button
            className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-white/15 hover:bg-white/30 backdrop-blur-sm flex items-center justify-center transition-all"
            onClick={closeLightbox}
            aria-label="Close"
          >
            <span className="material-symbols-outlined text-white text-[22px]">close</span>
          </button>

          {/* Prev button */}
          {allPhotos.length > 1 && (
            <button
              className="absolute left-3 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-white/15 hover:bg-white/30 backdrop-blur-sm flex items-center justify-center transition-all"
              onClick={(e) => { e.stopPropagation(); goPrev(); }}
              aria-label="Previous"
            >
              <span className="material-symbols-outlined text-white text-[24px]">chevron_left</span>
            </button>
          )}

          {/* Next button */}
          {allPhotos.length > 1 && (
            <button
              className="absolute right-3 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-white/15 hover:bg-white/30 backdrop-blur-sm flex items-center justify-center transition-all"
              onClick={(e) => { e.stopPropagation(); goNext(); }}
              aria-label="Next"
            >
              <span className="material-symbols-outlined text-white text-[24px]">chevron_right</span>
            </button>
          )}
        </div>
      )}

      {/* Ambient background glows */}
      <div className="absolute top-10 left-1/3 -translate-x-1/2 w-[680px] h-[400px] bg-gradient-to-tr from-[#9d88ff]/20 via-[#ffd9e0]/30 to-[#ffdcc5]/25 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute top-[800px] -right-24 w-96 h-96 bg-[#ffb5c5]/20 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-12 py-8 sm:py-12 w-full flex flex-col items-center">

        {/* ── Page Header ── */}
        <div className="flex flex-col items-center text-center gap-2 mb-10">
          <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-[#874d5b] text-white shadow-md transform -rotate-1">
            <span
              className="material-symbols-outlined text-[16px] text-[#ffd9e0]"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              photo_library
            </span>
            <span className="font-label-sm text-xs uppercase tracking-wider text-[#ffd9e0] font-bold">
              Brotherhood Archive • Scrapbook 📸
            </span>
          </div>
          <h1 className="font-display-hero text-display-hero text-[#25113e] tracking-tight mt-2">
            The Golden Scrapbook 📸✨
          </h1>
          <p className="font-body-lg text-base sm:text-lg text-[#484553] max-w-2xl mx-auto">
            A curated museum of our most chaotic, legendary, and wholesome bro moments. Hand-pinned with love!
          </p>
        </div>

        {/* ── Polaroids Section ── */}
        <div className="w-full mb-14">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-headline-md text-xl sm:text-2xl font-bold text-[#25113e] flex items-center gap-2">
              <span className="material-symbols-outlined text-[#614bbe]">collections_bookmark</span>
              <span>Polaroids from the Vault</span>
            </h2>
            <button
              onClick={() => confettiEmitter.blast(window.innerWidth / 2, 300, 60)}
              className="px-3.5 py-1.5 rounded-full bg-[#f6e9ff] text-[#614bbe] font-label-sm text-xs hover:bg-[#f2e2ff] transition-all flex items-center gap-1 cursor-pointer font-bold"
            >
              <span className="material-symbols-outlined text-[16px]">celebration</span> Sparkle
            </button>
          </div>

          {/* Upload hint banner — visible only when folder is empty */}
          {!hasPhotos && (
            <div className="w-full mb-8 px-5 py-4 rounded-2xl border-2 border-dashed border-[#cabeff] bg-[#f6e9ff]/60 flex items-center gap-4 text-[#614bbe]">
              <span className="material-symbols-outlined text-[32px] shrink-0">add_photo_alternate</span>
              <div>
                <p className="font-bold text-sm">
                  Drop your photos into{' '}
                  <code className="bg-[#eedbff] px-1.5 py-0.5 rounded text-xs font-mono">
                    src/photos/
                  </code>
                </p>
                <p className="text-xs text-[#484553] mt-0.5">
                  Add any JPG, PNG, or WEBP images — they'll auto-appear as polaroid cards instantly after save!
                </p>
              </div>
            </div>
          )}

          {/* Real photos grid (when images exist in src/photos/) */}
          {hasPhotos ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {PHOTO_URLS.map((url, i) => {
                const rotation = ROTATIONS[i % ROTATIONS.length];
                const tapeColor = TAPE_COLORS[i % TAPE_COLORS.length];
                const label = LABELS[i % LABELS.length];
                return (
                  <div
                    key={url}
                    className={`bg-[#ffffff] p-4 sm:p-5 rounded-2xl shadow-[0_8px_24px_-4px_rgba(97,75,190,0.12)] border border-[#eedbff] relative ${rotation} hover:rotate-0 transition-transform group cursor-pointer`}
                    onClick={() => openLightbox(url, i)}
                  >
                    {/* Washi tape strip */}
                    <div className={`absolute -top-3 left-1/2 -translate-x-1/2 w-28 h-6 ${tapeColor} backdrop-blur-sm rounded-xs shadow-xs pointer-events-none`} />

                    {/* Photo */}
                    <div className="aspect-4/3 w-full rounded-xl overflow-hidden bg-[#eedbff] mb-3 relative">
                      <img
                        src={url}
                        alt={`Memory ${i + 1}`}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <span className="absolute bottom-2 left-2 px-2.5 py-1 bg-[#25113e]/70 backdrop-blur-sm text-white text-[11px] font-mono rounded-md">
                        {label}
                      </span>
                      {/* Zoom hint */}
                      <span className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <span className="material-symbols-outlined text-white text-[15px]">zoom_in</span>
                      </span>
                    </div>

                    {/* Footer strip */}
                    <div className="mt-1 pt-2 border-t border-[#f2e2ff] flex items-center justify-between text-xs text-[#874d5b] font-medium">
                      <span>📍 Memory #{i + 1}</span>
                      <span>⭐️ Tap to expand</span>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            /* Placeholder polaroids while src/photos/ is still empty */
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {PLACEHOLDER_POLAROIDS.map((p, i) => (
                <div
                  key={i}
                  className={`bg-[#ffffff] p-4 sm:p-5 rounded-2xl shadow-[0_8px_24px_-4px_rgba(97,75,190,0.12)] border border-[#eedbff] relative ${p.rotation} hover:rotate-0 transition-transform group cursor-pointer`}
                  onClick={() => openLightbox(p.src, i)}
                >
                  <div className={`absolute -top-3 left-1/2 -translate-x-1/2 w-28 h-6 ${p.tape} backdrop-blur-sm rounded-xs shadow-xs pointer-events-none`} />
                  <div className="aspect-4/3 w-full rounded-xl overflow-hidden bg-[#eedbff] mb-3 relative">
                    <img
                      src={p.src}
                      alt={p.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <span className="absolute bottom-2 left-2 px-2.5 py-1 bg-[#25113e]/70 backdrop-blur-sm text-white text-[11px] font-mono rounded-md">
                      {p.label}
                    </span>
                    {/* Zoom hint */}
                    <span className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <span className="material-symbols-outlined text-white text-[15px]">zoom_in</span>
                    </span>
                  </div>
                  <h3 className="font-headline-sm text-base text-[#25113e] font-bold">{p.title}</h3>
                  <p className="font-body-sm text-xs sm:text-sm text-[#484553] mt-1 leading-snug">{p.caption}</p>
                  <div className="mt-3 pt-2 border-t border-[#f2e2ff] flex items-center justify-between text-xs text-[#874d5b] font-medium">
                    <span>📍 Replace with your real fotos!</span>
                    <span>⭐️ Tap to expand</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ── Sticky Note Wall ── */}
        <div className="w-full bg-[#fbf0ff] rounded-3xl p-6 sm:p-8 border border-[#f2e2ff] mb-12 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <span className="font-label-sm text-xs text-[#614bbe] uppercase tracking-wider font-bold">
                POST-IT PINBOARD
              </span>
              <h3 className="font-headline-md text-xl sm:text-2xl font-bold text-[#25113e] mt-0.5">
                Leave a Note on Armeek's Wall 📌
              </h3>
              <p className="font-body-sm text-xs sm:text-sm text-[#484553]">
                Post a crazy wish, inside joke, or roast right here!
              </p>
            </div>
            <button
              onClick={() => confettiEmitter.hearts(20)}
              className="px-3.5 py-1.5 rounded-full bg-[#ffd9e0] text-[#370c19] text-xs font-bold self-start sm:self-center cursor-pointer hover:scale-105 transition-transform"
            >
              💕 Throw Love
            </button>
          </div>

          {/* Add note form */}
          <form onSubmit={handleAddNote} className="flex gap-2 mb-6">
            <input
              type="text"
              value={newNoteText}
              onChange={(e) => setNewNoteText(e.target.value)}
              placeholder="Write a sweet/funny birthday note for Armeek..."
              className="flex-1 px-4 py-2.5 rounded-full bg-white border border-[#eedbff] text-sm focus:outline-none focus:ring-2 focus:ring-[#9d88ff] text-[#25113e]"
              maxLength={120}
            />
            <button
              type="submit"
              className="px-5 py-2.5 rounded-full bg-[#614bbe] text-white font-label-md text-xs sm:text-sm font-bold shadow-md hover:scale-105 active:scale-95 transition-transform shrink-0 cursor-pointer"
            >
              Pin Note 📌
            </button>
          </form>

          {/* Sticky notes grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {notes.map((note) => (
              <div
                key={note.id}
                onClick={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  confettiEmitter.sparkles(rect);
                }}
                className={`p-4 rounded-xl shadow-xs border border-black/5 transform ${note.rotation} hover:rotate-0 hover:scale-105 transition-all cursor-pointer ${note.color} flex flex-col justify-between min-h-[140px]`}
              >
                {/* Thumbtack pinhead */}
                <div className="w-3 h-3 rounded-full bg-red-400 mx-auto -mt-2 shadow-xs ring-2 ring-white/50" />
                <p className="font-body-sm text-sm font-medium mt-2 leading-relaxed">
                  "{note.text}"
                </p>
                <div className="text-[11px] font-mono opacity-80 pt-2 border-t border-black/10 text-right">
                  — {note.author}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Advance to Birthday Letter ── */}
        <div className="w-full flex flex-col items-center gap-3">
          <button
            onClick={() => {
              onNavigate('birthday-letter');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="px-8 sm:px-10 py-4 rounded-full bg-gradient-to-r from-[#614bbe] to-[#874d5b] text-white font-headline-sm text-base sm:text-lg shadow-xl hover:scale-105 active:scale-95 transition-all flex items-center gap-3 cursor-pointer font-bold"
          >
            <span>Proceed to Step 3: Birthday Letter 💌</span>
            <span className="material-symbols-outlined text-[22px]">arrow_forward</span>
          </button>
          <span className="font-body-sm text-xs text-[#484553]">
            Strictly Confidential • For Armeek's Eyes Only 🔒
          </span>
        </div>

      </div>
    </div>
  );
}
