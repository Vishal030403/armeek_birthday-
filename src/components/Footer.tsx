import { confettiEmitter } from './ConfettiCanvas';

export default function Footer() {
  return (
    <footer className="w-full bg-[#fbf0ff] py-8 sm:py-10 mt-16 shadow-[0_-2px_12px_rgba(157,136,255,0.06)] border-t border-[#f2e2ff]">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
        <button
          onClick={() => confettiEmitter.hearts(25)}
          className="flex items-center gap-2 group cursor-pointer transition-transform hover:scale-102"
        >
          <span className="material-symbols-outlined text-[#874d5b] text-[20px] group-hover:scale-125 transition-transform">
            favorite
          </span>
          <span className="font-body-sm text-sm text-[#484553]">
            Handcrafted with joy & chai for Armeek's special day
          </span>
        </button>

        <div className="flex items-center gap-2 font-label-sm text-xs text-[#484553]">
          <span>Forever Bros 🤞</span>
          <span>•</span>
          <span>Memories & Chaos</span>
          <span>•</span>
          <span>Happy Birthday Armeek!</span>
        </div>
      </div>
    </footer>
  );
}
