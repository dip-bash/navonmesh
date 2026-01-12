
import React, { useCallback } from 'react';
import { NewsItem } from '../types';

interface IndexOverlayProps {
  news: NewsItem[];
  onTeleport: (id: string) => void;
  onClose: () => void;
}

const IndexOverlay: React.FC<IndexOverlayProps> = ({ news, onTeleport, onClose }) => {
  const handleTeleport = useCallback((id: string) => {
    if ('vibrate' in navigator) navigator.vibrate(15);
    onTeleport(id);
  }, [onTeleport]);

  const handleClose = useCallback(() => {
    if ('vibrate' in navigator) navigator.vibrate(10);
    onClose();
  }, [onClose]);

  return (
    <div className="h-full w-full bg-[#F9F9F9] flex flex-col shadow-2xl">
      <header className="flex justify-between items-center p-8 border-b border-black/5">
        <div>
          <h2 className="font-serif text-3xl italic">Index</h2>
          <p className="font-sans text-[10px] tracking-[0.2em] uppercase opacity-40">Today's Briefing</p>
        </div>
        <button 
          onClick={handleClose}
          className="bg-black text-white font-sans text-[10px] font-bold uppercase tracking-widest px-6 py-3 rounded-full shadow-xl active:scale-90 transition-transform"
        >
          Close
        </button>
      </header>

      <div className="flex-1 overflow-y-auto px-8 py-10 space-y-12 pb-32">
        {news.length > 0 ? (
          news.map((item, index) => (
            <button 
              key={item.id}
              onClick={() => handleTeleport(item.id)}
              className="w-full text-left group flex gap-6 items-start active:bg-black/[0.03] p-2 -m-2 rounded-xl transition-colors"
            >
              <span className="font-serif text-3xl opacity-10 group-active:opacity-100 transition-all duration-300 transform group-active:translate-x-1">
                {String(index + 1).padStart(2, '0')}
              </span>
              <div className="flex-1 border-b border-gray-100 pb-8 group-last:border-none">
                <span className="font-sans text-[10px] tracking-widest font-bold text-red-700 uppercase mb-2 block">
                  {item.category}
                </span>
                <h3 className="font-serif text-xl leading-tight transition-colors">
                  {item.title}
                </h3>
                <div className="flex items-center gap-2 mt-3 opacity-40">
                  <span className="font-sans text-[10px] uppercase font-bold tracking-tighter">Reading Time</span>
                  <span className="w-1 h-1 bg-black rounded-full"></span>
                  <span className="font-sans text-[10px] uppercase font-medium">{item.readTime}</span>
                </div>
              </div>
            </button>
          ))
        ) : (
          <div className="h-full flex flex-col items-center justify-center opacity-30 text-center px-10">
            <p className="font-serif italic text-xl mb-2">The index is empty.</p>
            <p className="font-sans text-[10px] uppercase tracking-widest">No articles found for this date.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default IndexOverlay;
