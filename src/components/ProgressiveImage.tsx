
import React, { useState, useEffect, useRef, memo } from 'react';

interface ProgressiveImageProps {
  src: string;
  fallbackBase: string;
  alt: string;
  className?: string;
  onFailure?: () => void;
}

// Cache of loaded URLs to prevent flickering between loads in a session
const loadedImageCache = new Set<string>();

const ProgressiveImage: React.FC<ProgressiveImageProps> = memo(({ src, fallbackBase, alt, className, onFailure }) => {
  const [isHDLoaded, setIsHDLoaded] = useState(loadedImageCache.has(src));
  const [currentHdSrc, setCurrentHdSrc] = useState<string>(src);
  const activeLoadRef = useRef<string | null>(null);

  useEffect(() => {
    // If already in cache, don't trigger a new load cycle
    if (loadedImageCache.has(src)) {
      setIsHDLoaded(true);
      return;
    }

    setIsHDLoaded(false);
    setCurrentHdSrc(src);
    activeLoadRef.current = src;

    const attemptLoad = (url: string) => {
      const img = new Image();
      img.src = url;
      img.onload = () => {
        if (activeLoadRef.current === src) {
          loadedImageCache.add(src);
          setCurrentHdSrc(url);
          setIsHDLoaded(true);
        }
      };
      img.onerror = () => {
        // Fallback logic
        if (url !== fallbackBase && activeLoadRef.current === src) {
          const fallbackImg = new Image();
          fallbackImg.src = fallbackBase;
          fallbackImg.onload = () => {
            if (activeLoadRef.current === src) {
              loadedImageCache.add(src);
              setCurrentHdSrc(fallbackBase);
              setIsHDLoaded(true);
            }
          };
          fallbackImg.onerror = () => {
            if (activeLoadRef.current === src && onFailure) onFailure();
          };
        } else if (activeLoadRef.current === src && onFailure) {
          onFailure();
        }
      };
    };

    attemptLoad(src);

    return () => {
      activeLoadRef.current = null;
    };
  }, [src, fallbackBase, onFailure]);

  return (
    <div className={`relative overflow-hidden bg-[#EAEAEA] ${className}`}>
      {/* 
          Placeholder is only visible if HD hasn't loaded. 
          We use simple opacity to avoid "blur-filter" recalculations on mobile GPUs.
      */}
      {!isHDLoaded && (
        <div className="absolute inset-0 bg-[#EAEAEA] animate-pulse" />
      )}
      
      <img
        src={currentHdSrc}
        alt={alt}
        loading="lazy"
        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ease-out ${
          isHDLoaded ? 'opacity-100' : 'opacity-0'
        }`}
      />
      
      <div className="absolute inset-0 pointer-events-none shadow-[inset_0_0_40px_rgba(0,0,0,0.01)]" />
    </div>
  );
});

export default ProgressiveImage;
