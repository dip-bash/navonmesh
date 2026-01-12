
import React, { useMemo, useCallback } from 'react';
import { NewsItem, ArchiveDay } from '../types';
import ProgressiveImage from './ProgressiveImage';

interface ArchiveViewProps {
  allNews: NewsItem[];
  onDateSelect: (date: string) => void;
  onClose: () => void;
  currentDate: string;
}

const ArchiveView: React.FC<ArchiveViewProps> = ({ allNews, onDateSelect, onClose, currentDate }) => {
  const archiveDays = useMemo(() => {
    const daysMap = new Map<string, ArchiveDay>();
    const sortedData = [...allNews].sort((a, b) => b.date.localeCompare(a.date));
    
    sortedData.forEach(item => {
      if (!daysMap.has(item.date)) {
        daysMap.set(item.date, {
          date: item.date,
          headline: item.title,
          image_url: item.image_url ? `posts/${item.date}/archive.jpg` : null
        });
      }
    });
    return Array.from(daysMap.values());
  }, [allNews]);

  const handleSelect = useCallback((date: string) => {
    if ('vibrate' in navigator) navigator.vibrate([15]);
    onDateSelect(date);
  }, [onDateSelect]);

  const handleClose = useCallback(() => {
    if ('vibrate' in navigator) navigator.vibrate(10);
    onClose();
  }, [onClose]);

  const handleContact = useCallback(() => {
    if ('vibrate' in navigator) navigator.vibrate(10);
    window.location.href = 'mailto:saumyadip.social@gmail.com';
  }, []);

  return (
    <div className="fixed inset-0 bg-[#F2F2F2] flex flex-col z-50 overflow-hidden">
      <header className="flex justify-between items-center p-8">
        <div className="text-left">
          <h2 className="font-serif text-3xl italic">Archives</h2>
          <p className="font-sans text-[10px] tracking-widest uppercase opacity-40">Choose an Edition</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={handleContact}
            className="border border-black/10 bg-white/50 backdrop-blur-sm text-black font-sans text-[10px] font-bold uppercase tracking-widest px-5 py-2.5 rounded-full shadow-sm active:scale-95 transition-transform"
          >
            Contact
          </button>
          <button 
            onClick={handleClose}
            className="bg-black text-white font-sans text-[10px] font-bold uppercase tracking-widest px-5 py-2.5 rounded-full shadow-lg active:scale-90 transition-transform"
          >
            Exit
          </button>
        </div>
      </header>

      <div className="flex-1 flex flex-col justify-center">
        <div className="w-full flex overflow-x-auto archive-snap gap-6 px-12 pb-12 items-center h-full no-scrollbar">
          {archiveDays.map((day) => (
            <button
              key={day.date}
              onClick={() => handleSelect(day.date)}
              className={`archive-item min-w-[300px] max-w-[300px] text-left transition-all duration-500 transform ${
                currentDate === day.date ? 'scale-105' : 'scale-90 opacity-60'
              } active:scale-95`}
            >
              <div className={`flex flex-col bg-white p-6 shadow-2xl rounded-sm border-t-8 h-[500px] transition-colors ${
                currentDate === day.date ? 'border-black' : 'border-gray-200'
              }`}>
                <div className="mb-6">
                  <span className="font-sans text-[11px] font-bold uppercase tracking-[0.2em] text-red-700">
                    {new Date(day.date).toLocaleDateString('en-US', { weekday: 'short' })}
                  </span>
                  <p className="font-serif text-2xl mt-1">
                    {new Date(day.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                  </p>
                </div>
                
                {day.image_url ? (
                  <ProgressiveImage
                    src={day.image_url}
                    fallbackBase={`https://picsum.photos/seed/editorial-${day.date}/800/1000`}
                    alt={day.headline}
                    className="flex-1 w-full mb-6"
                  />
                ) : (
                  <div className="flex-1 w-full mb-6 bg-gray-50 flex items-center justify-center italic font-serif text-sm opacity-20">
                    Typography Edition
                  </div>
                )}

                <div className="h-24 overflow-hidden">
                  <h3 className="font-serif text-xl leading-tight italic line-clamp-3">
                    {day.headline}
                  </h3>
                </div>
                
                <div className="mt-auto pt-6 border-t border-gray-100 flex justify-between items-center">
                  <span className="font-sans text-[10px] uppercase font-bold tracking-widest opacity-30">Open Dispatch</span>
                  <div className="w-8 h-8 rounded-full border border-black/10 flex items-center justify-center">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path d="M5 12h14m-7-7 7 7-7 7" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                </div>
              </div>
            </button>
          ))}
          <div className="min-w-[50px]"></div>
        </div>

        {/* Subtle Footer Info for Archives */}
        <div className="text-center pb-8 opacity-20 hover:opacity-100 transition-opacity">
          <p className="font-sans text-[9px] uppercase tracking-[0.3em] mb-1">Navonmesh Curated by Dip</p>
          <p className="font-sans text-[8px] uppercase tracking-widest">saumyadip.social@gmail.com</p>
        </div>
      </div>
    </div>
  );
};

export default ArchiveView;
