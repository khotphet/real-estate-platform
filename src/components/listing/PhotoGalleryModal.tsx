'use client';

import React, { useState, useEffect } from 'react';
import { X, ChevronLeft, ChevronRight, Image as ImageIcon } from 'lucide-react';

interface PhotoGalleryModalProps {
  images: string[];
  title: string;
  isOpen: boolean;
  initialIndex?: number;
  onClose: () => void;
}

export function PhotoGalleryModal({
  images,
  title,
  isOpen,
  initialIndex = 0,
  onClose,
}: PhotoGalleryModalProps) {
  const [currentIndex, setCurrentIndex] = useState<number>(initialIndex);

  useEffect(() => {
    setCurrentIndex(initialIndex);
  }, [initialIndex, isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') handlePrev();
      if (e.key === 'ArrowRight') handleNext();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, currentIndex, images.length]);

  if (!isOpen || images.length === 0) return null;

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : images.length - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev < images.length - 1 ? prev + 1 : 0));
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/95 flex flex-col justify-between animate-in fade-in duration-200 select-none">
      {/* Top Header Bar */}
      <div className="flex items-center justify-between px-6 py-4 text-white border-b border-white/10 shrink-0">
        <div className="flex items-center gap-3">
          <ImageIcon className="w-5 h-5 text-teal-400" />
          <span className="font-semibold text-sm sm:text-base truncate max-w-md">
            {title}
          </span>
          <span className="text-xs px-2.5 py-1 bg-white/10 rounded-full font-mono text-zinc-300">
            {currentIndex + 1} / {images.length}
          </span>
        </div>
        <button
          onClick={onClose}
          className="w-10 h-10 rounded-full flex items-center justify-center bg-white/10 hover:bg-white/20 transition-colors text-white"
          aria-label="Close photo gallery"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Main Image Display */}
      <div className="relative flex-1 flex items-center justify-center p-4">
        {/* Prev Button */}
        {images.length > 1 && (
          <button
            onClick={handlePrev}
            className="absolute left-4 sm:left-8 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-black/60 hover:bg-black/80 text-white flex items-center justify-center transition-all z-10 backdrop-blur-sm"
            aria-label="Previous photo"
          >
            <ChevronLeft className="w-7 h-7" />
          </button>
        )}

        {/* Active Photo */}
        <div className="max-w-5xl max-h-[75vh] flex items-center justify-center overflow-hidden rounded-xl">
          <img
            src={images[currentIndex]}
            alt={`${title} - ภาพที่ ${currentIndex + 1}`}
            className="w-auto h-auto max-w-full max-h-[75vh] object-contain rounded-xl shadow-2xl"
          />
        </div>

        {/* Next Button */}
        {images.length > 1 && (
          <button
            onClick={handleNext}
            className="absolute right-4 sm:right-8 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-black/60 hover:bg-black/80 text-white flex items-center justify-center transition-all z-10 backdrop-blur-sm"
            aria-label="Next photo"
          >
            <ChevronRight className="w-7 h-7" />
          </button>
        )}
      </div>

      {/* Bottom Thumbnail Strip */}
      <div className="px-6 py-4 bg-black/80 border-t border-white/10 shrink-0 overflow-x-auto flex items-center gap-3 justify-center">
        {images.map((img, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentIndex(idx)}
            className={`relative w-16 h-12 sm:w-20 sm:h-14 rounded-lg overflow-hidden shrink-0 transition-all border-2 ${
              idx === currentIndex
                ? 'border-teal-400 scale-105 shadow-md shadow-teal-500/20'
                : 'border-transparent opacity-50 hover:opacity-100'
            }`}
          >
            <img src={img} alt="thumbnail" className="w-full h-full object-cover" />
          </button>
        ))}
      </div>
    </div>
  );
}
