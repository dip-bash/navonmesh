
import React, { useState, useEffect, useCallback, memo } from 'react';
import { NewsItem } from '../types';
import ProgressiveImage from './ProgressiveImage';

interface FeedViewProps {
  news: NewsItem[];
  date: string;
}

// Isolated Progress Bar to prevent FeedView re-renders
const ScrollProgressBar = () => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      const p = totalHeight > 0 ? (window.scrollY / totalHeight) * 100 : 0;
      setProgress(p);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div 
      className="fixed top-0 left-0 h-[2px] bg-black z-[60] transition-transform duration-75 origin-left" 
      style={{ transform: `scaleX(${progress / 100})`, width: '100%' }}
    />
  );
};

// Memoized FeedItem to prevent re-renders on scroll
const FeedItem = memo(({ item, getFallback }: { item: NewsItem, getFallback: (cat: string) => string }) => {
  const [imageFailed, setImageFailed] = useState(false);

  const triggerHaptic = useCallback(() => {
    if ('vibrate' in navigator) navigator.vibrate(10);
  }, []);

  return (
    <article 
      id={`article-${item.id}`}
      className="py-16 first:pt-12 px-2 -mx-2"
      onClick={triggerHaptic}
    >
      <div className="flex flex-col">
        <span className="font-sans text-[10px] tracking-widest font-bold text-red-700 uppercase mb-4">
          {item.category}
        </span>
        <h2 className="font-serif text-3xl leading-tight mb-6">
          {item.title}
        </h2>
        
        {item.image_url && !imageFailed && (
          <ProgressiveImage
            src={item.image_url}
            fallbackBase={getFallback(item.category)}
            alt={item.title}
            className="aspect-[4/5] w-full mb-8 shadow-sm rounded-sm"
            onFailure={() => setImageFailed(true)}
          />
        )}

        <div className="flex items-center gap-3 mb-6">
          <div className="h-[1px] w-8 bg-black opacity-30"></div>
          <p className="font-sans text-[11px] font-semibold uppercase tracking-wider">
            {item.author && <>{item.author} <span className="mx-2 text-gray-400">|</span></>} {item.readTime}
          </p>
        </div>

        <div className="font-body-serif text-lg leading-relaxed text-[#222222] text-justify space-y-6">
          {item.content.split('\n\n').map((para, idx) => (
            <p key={idx} className={`${idx === 0 ? 'first-letter:text-6xl first-letter:font-serif first-letter:float-left first-letter:mr-3 first-letter:mt-1 first-letter:leading-none' : ''}`}>
              {para.trim()}
            </p>
          ))}
        </div>
      </div>
    </article>
  );
});

const FeedView: React.FC<FeedViewProps> = ({ news, date }) => {
  const getFallbackImage = useCallback((category: string) => {
    const map: Record<string, string> = {
      'GLOBAL AFFAIRS': 'https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?auto=format&fit=crop&q=80',
      'TECHNOLOGY': 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&q=80',
      'ECONOMY': 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80',
      'ENVIRONMENT': 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80',
      'CULTURE': 'https://images.unsplash.com/photo-1518998053574-53f0201f9b0d?auto=format&fit=crop&q=80',
      'GENERAL': 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&q=80'
    };
    return map[category] || map['GENERAL'];
  }, []);

  const formattedDate = new Date(date).toLocaleDateString('en-US', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
  });

  return (
    <div className="flex flex-col items-center w-full px-4 md:px-0 pb-32">
      <ScrollProgressBar />

      <header className="w-full max-w-2xl pt-12 pb-8 border-b border-black text-center">
        <h2 className="font-sans text-xs tracking-[0.3em] font-bold uppercase mb-4 opacity-70">Navonmesh</h2>
        <h1 className="font-serif text-4xl mb-2 italic">Editorial</h1>
        <p className="font-sans text-xs font-medium uppercase opacity-50">{formattedDate}</p>
      </header>

      <div className="w-full max-w-2xl divide-y divide-gray-200">
        {news.length > 0 ? (
          news.map((item) => (
            <FeedItem key={item.id} item={item} getFallback={getFallbackImage} />
          ))
        ) : (
          <div className="py-24 text-center">
            <p className="font-serif italic text-xl opacity-50">No dispatches found for this date.</p>
          </div>
        )}
      </div>

      <footer className="w-full max-w-2xl py-12 border-t border-black text-center mt-8 space-y-4">
        <p className="font-serif italic opacity-40">End of Edition</p>
        <div className="space-y-1">
          <p className="font-sans text-[10px] uppercase tracking-widest font-bold opacity-30">© 2026 Navonmesh</p>
          <p className="font-sans text-[10px] uppercase tracking-widest opacity-30">Curated by Dip</p>
          <a href="mailto:saumyadip.social@gmail.com" className="font-sans text-[10px] uppercase tracking-widest opacity-50 hover:opacity-100 transition-opacity block">
            saumyadip.social@gmail.com
          </a>
        </div>
      </footer>
    </div>
  );
};

export default FeedView;
