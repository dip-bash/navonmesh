
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { AppView, NewsItem } from './types';
import { fetchAllNews } from './data';
import FeedView from './components/FeedView';
import IndexOverlay from './components/IndexOverlay';
import ArchiveView from './components/ArchiveView';
import BottomNav from './components/BottomNav';

const App: React.FC = () => {
  const [newsData, setNewsData] = useState<NewsItem[]>([]);
  const [currentView, setCurrentView] = useState<AppView>('feed');
  const [currentDate, setCurrentDate] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const data = await fetchAllNews();
      setNewsData(data);
      setIsLoading(false);
    };
    load();
  }, []);

  const latestDate = useMemo(() => {
    if (newsData.length === 0) return '';
    const dates = [...newsData.map(n => n.date)].sort();
    return dates[dates.length - 1];
  }, [newsData]);

  useEffect(() => {
    if (isLoading || newsData.length === 0) return;

    const handleHashChange = () => {
      const hash = window.location.hash;
      const dateMatch = hash.match(/date=([\d-]{10})/);
      if (dateMatch) {
        setCurrentDate(dateMatch[1]);
        setCurrentView('feed');
      } else if (!currentDate) {
        setCurrentDate(latestDate);
      }
    };

    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [isLoading, newsData, currentDate, latestDate]);

  const filteredNews = useMemo(() => {
    if (!currentDate) return [];
    return newsData.filter(item => item.date === currentDate);
  }, [newsData, currentDate]);

  const showView = useCallback((view: AppView) => {
    if (view === currentView) {
      if (view === 'feed') window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    setCurrentView(view);
  }, [currentView]);

  const teleportToArticle = useCallback((id: string) => {
    setCurrentView('feed');
    setTimeout(() => {
      const element = document.getElementById(`article-${id}`);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  }, []);

  const handleDateSelect = useCallback((date: string) => {
    const targetDate = date || latestDate;
    window.location.hash = `date=${targetDate}`;
    setCurrentView('feed');
  }, [latestDate]);

  const handleMidNavClick = useCallback(() => {
    if (currentView === 'feed') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      setCurrentView('feed');
    }
  }, [currentView]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F9F9F9]">
        <div className="text-center">
          <h2 className="font-serif text-3xl italic mb-6">Navonmesh</h2>
          <div className="w-48 h-[1px] bg-black/10 mx-auto overflow-hidden">
            <div className="h-full bg-black w-1/2 animate-[loading-bar_1.2s_infinite_ease-in-out]"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#F9F9F9] overflow-hidden">
      <main className="flex-1 relative bg-[#F9F9F9]">
        {/* Feed View - PERSISTENT */}
        <div 
          className={`transition-opacity duration-300 w-full min-h-screen bg-[#F9F9F9] ${
            currentView === 'feed' ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
          }`}
        >
          <FeedView news={filteredNews} date={currentDate} />
        </div>
        
        {/* Index Overlay - PERSISTENT & ON TOP */}
        <div 
          className={`fixed inset-0 z-[60] bg-[#F9F9F9] transition-all duration-500 ease-in-out transform ${
            currentView === 'index' ? 'translate-y-0 opacity-100 pointer-events-auto' : 'translate-y-full opacity-0 pointer-events-none'
          }`}
        >
          <IndexOverlay 
            news={filteredNews} 
            onTeleport={teleportToArticle} 
            onClose={() => showView('feed')}
          />
        </div>

        {/* Archive View - PERSISTENT & ON TOP */}
        <div 
          className={`fixed inset-0 z-[70] bg-[#F9F9F9] transition-all duration-500 ease-in-out ${
            currentView === 'archive' ? 'opacity-100 pointer-events-auto scale-100' : 'opacity-0 pointer-events-none scale-105'
          }`}
        >
          <ArchiveView 
            allNews={newsData}
            onDateSelect={handleDateSelect} 
            currentDate={currentDate}
            onClose={() => showView('feed')}
          />
        </div>
      </main>

      {/* Bottom Nav Wrapper to ensure no layout shift */}
      <div className="relative z-[80]">
        <BottomNav 
          currentView={currentView} 
          currentDate={currentDate}
          latestDate={latestDate}
          onSwitch={showView} 
          onMidClick={handleMidNavClick}
        />
      </div>
      
      <style>{`
        @keyframes loading-bar { 0% { transform: translateX(-100%); } 100% { transform: translateX(200%); } }
      `}</style>
    </div>
  );
};

export default App;
