
import React, { useMemo, useCallback } from 'react';
import { AppView } from '../types';

interface BottomNavProps {
  currentView: AppView;
  currentDate: string;
  latestDate: string;
  onSwitch: (view: AppView) => void;
  onMidClick: () => void;
}

const BottomNav: React.FC<BottomNavProps> = ({ currentView, currentDate, latestDate, onSwitch, onMidClick }) => {
  const centerLabel = useMemo(() => {
    if (currentDate === latestDate) return "Today";
    const dateObj = new Date(currentDate);
    return dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  }, [currentDate, latestDate]);

  const handleAction = useCallback((callback: () => void) => {
    if ('vibrate' in navigator) navigator.vibrate(10);
    callback();
  }, []);

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-[100] bg-[#F9F9F9]/95 backdrop-blur-xl border-t border-black/5 safe-bottom h-16 shadow-[0_-5px_20px_rgba(0,0,0,0.03)]">
      <div className="flex items-stretch h-full max-w-lg mx-auto">
        <button 
          onClick={() => handleAction(() => onSwitch('index'))}
          className={`flex-1 flex flex-col items-center justify-center gap-1.5 transition-all active:scale-90 ${
            currentView === 'index' ? 'text-black' : 'text-black/40'
          }`}
        >
          <span className="font-sans text-[10px] font-bold uppercase tracking-widest">Index</span>
          <div className={`h-1 w-1 rounded-full bg-black transition-all transform ${currentView === 'index' ? 'scale-100' : 'scale-0'}`}></div>
        </button>

        <button 
          onClick={() => handleAction(onMidClick)}
          className={`flex-1 flex flex-col items-center justify-center gap-1.5 transition-all active:scale-90 ${
            currentView === 'feed' ? 'text-black' : 'text-black/40'
          }`}
        >
          <span className="font-serif text-xl italic leading-none font-bold">{centerLabel}</span>
          <div className={`h-1 w-1 rounded-full bg-black transition-all transform ${currentView === 'feed' ? 'scale-100' : 'scale-0'}`}></div>
        </button>

        <button 
          onClick={() => handleAction(() => onSwitch('archive'))}
          className={`flex-1 flex flex-col items-center justify-center gap-1.5 transition-all active:scale-90 ${
            currentView === 'archive' ? 'text-black' : 'text-black/40'
          }`}
        >
          <span className="font-sans text-[10px] font-bold uppercase tracking-widest">Archive</span>
          <div className={`h-1 w-1 rounded-full bg-black transition-all transform ${currentView === 'archive' ? 'scale-100' : 'scale-0'}`}></div>
        </button>
      </div>
    </nav>
  );
};

export default BottomNav;
