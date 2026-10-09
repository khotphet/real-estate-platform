'use client';

import React from 'react';
import { useAuth } from '@/context/AuthContext';
import { useFavorites } from '@/lib/favorites';

interface FavoriteButtonProps {
  code: string;
  /** 'icon' = round icon button on cards, 'pill' = labelled button on the detail page */
  variant?: 'icon' | 'pill';
  className?: string;
}

export function FavoriteButton({ code, variant = 'icon', className = '' }: FavoriteButtonProps) {
  const { openLoginModal } = useAuth();
  const { isFavorite, toggle, canSave } = useFavorites();
  const fav = isFavorite(code);

  const onClick = (e: React.MouseEvent) => {
    // cards are often wrapped in links — don't navigate
    e.preventDefault();
    e.stopPropagation();
    if (!canSave) {
      openLoginModal();
      return;
    }
    toggle(code);
  };

  if (variant === 'pill') {
    return (
      <button
        type="button"
        onClick={onClick}
        aria-pressed={fav}
        className={`flex items-center gap-2 px-3.5 py-2 bg-surface hover:bg-slate-50 font-medium text-xs sm:text-sm rounded-xl border border-border shadow-sm transition-colors cursor-pointer ${
          fav ? 'text-red-500' : 'text-foreground'
        } ${className}`}
      >
        <span className="material-symbols-outlined text-[18px]" style={fav ? { fontVariationSettings: "'FILL' 1" } : undefined}>
          favorite
        </span>
        <span>{fav ? 'บันทึกแล้ว' : 'บันทึก'}</span>
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={fav}
      aria-label={fav ? 'เลิกบันทึกทรัพย์' : 'บันทึกทรัพย์'}
      title={fav ? 'เลิกบันทึก' : 'บันทึก'}
      className={`w-8 h-8 rounded-full bg-white/90 hover:bg-white flex items-center justify-center shadow-xs transition-colors cursor-pointer ${
        fav ? 'text-red-500' : 'text-muted hover:text-red-500'
      } ${className}`}
    >
      <span className="material-symbols-outlined text-[18px]" style={fav ? { fontVariationSettings: "'FILL' 1" } : undefined}>
        favorite
      </span>
    </button>
  );
}
