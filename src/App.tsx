import { useState, useEffect } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import ConfettiCanvas, { confettiEmitter } from './components/ConfettiCanvas';
import WelcomeScreen from './components/WelcomeScreen';
import ScrapbookScreen from './components/ScrapbookScreen';
import LetterScreen from './components/LetterScreen';
import { ScreenId } from './types';
import { partyAudio } from './utils/audio';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<ScreenId>('welcome-and-sawaal');
  const [isUnlocked, setIsUnlocked] = useState<boolean>(false);
  const [isAudioPlaying, setIsAudioPlaying] = useState<boolean>(false);

  // Initial welcome confetti burst on first mount
  useEffect(() => {
    const timer = setTimeout(() => {
      confettiEmitter.blast(window.innerWidth / 2, window.innerHeight * 0.35, 75);
    }, 600);
    return () => clearTimeout(timer);
  }, []);

  const handleScreenChange = (screen: ScreenId) => {
    setCurrentScreen(screen);
  };

  return (
    <div className="min-h-screen bg-[#fff7ff] text-[#25113e] flex flex-col relative selection:bg-[#ffb5c5] selection:text-[#25113e]">
      {/* Dynamic Confetti & Floating Hearts Canvas Overlay */}
      <ConfettiCanvas />

      {/* Fixed Sticky Header */}
      <Header
        currentScreen={currentScreen}
        onScreenChange={handleScreenChange}
        isAudioPlaying={isAudioPlaying}
        setIsAudioPlaying={setIsAudioPlaying}
      />

      {/* Main Screen Content with Padding for Fixed Header */}
      <main className="w-full pt-20 flex-1 relative">
        {currentScreen === 'welcome-and-sawaal' && (
          <WelcomeScreen
            onNavigate={handleScreenChange}
            isUnlocked={isUnlocked}
            setIsUnlocked={setIsUnlocked}
          />
        )}

        {currentScreen === 'memory-scrapbook' && (
          <ScrapbookScreen onNavigate={handleScreenChange} />
        )}

        {currentScreen === 'birthday-letter' && (
          <LetterScreen onNavigate={handleScreenChange} />
        )}

        {/* Floating Celebration Pill in Bottom-Right Corner */}
        <aside
          onClick={() => confettiEmitter.blast()}
          className="fixed bottom-6 right-6 z-30 flex items-center gap-1.5 px-3.5 py-2 bg-[#ffffff]/90 backdrop-blur-md rounded-full shadow-[0_12px_32px_-4px_rgba(76,29,149,0.18)] cursor-pointer hover:scale-105 active:scale-95 transition-transform border border-[#f2e2ff]"
          title="Click to celebrate!"
        >
          <span className="material-symbols-outlined text-[#614bbe] text-[20px] animate-bounce">
            celebration
          </span>
          <span className="font-label-sm text-xs text-[#25113e] font-bold">
            Birthday Mode Active ✨
          </span>
        </aside>
      </main>

      {/* Heartcrafted Footer */}
      <Footer />
    </div>
  );
}
