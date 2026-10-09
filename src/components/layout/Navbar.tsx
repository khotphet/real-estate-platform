'use client';

import React, { useState } from 'react';
import Link from 'next/link';

interface NavbarProps {
  onSearch?: (query: string) => void;
}

export function Navbar({ onSearch }: NavbarProps) {
  const [lang, setLang] = useState<'th' | 'en'>('th');
  const [searchVal, setSearchVal] = useState('');

  return (
    <header className="sticky top-0 left-0 w-full z-50 bg-surface border-b border-border shadow-xs">
      <div className="h-18 max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
        {/* Brand & Search */}
        <div className="flex items-center gap-6 shrink-0">
          <Link href="/" className="flex items-center gap-2 group">
            {/* MapNest Teal Nest Icon */}
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-white shadow-xs group-hover:scale-105 transition-transform">
              <span className="material-symbols-outlined text-[24px]">home_pin</span>
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold tracking-tight text-primary leading-tight">MapNest</span>
              <span className="text-[10px] text-muted font-medium">อุดรธานี Pilot</span>
            </div>
          </Link>

          {/* Quick Search Field in Navbar */}
          <div className="hidden md:flex items-center relative w-72 lg:w-80">
            <span className="material-symbols-outlined absolute left-3 text-muted text-[20px]">search</span>
            <input
              type="text"
              value={searchVal}
              onChange={(e) => {
                setSearchVal(e.target.value);
                onSearch?.(e.target.value);
              }}
              placeholder="ค้นหาทำเล, โครงการ ในอุดร..."
              className="w-full pl-10 pr-4 py-2 bg-background border border-border rounded-xl text-sm placeholder:text-muted focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
            />
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="hidden lg:flex items-center gap-6">
          <Link
            href="/"
            className="text-sm font-semibold text-primary hover:text-primary transition-colors py-1"
          >
            สำรวจ / ค้นหาทรัพย์
          </Link>
          <Link
            href="/my-listings"
            className="text-sm font-medium text-muted hover:text-primary py-1 transition-colors"
          >
            จัดการประกาศของฉัน
          </Link>
          <Link
            href="/post"
            className="text-sm font-medium text-muted hover:text-primary py-1 transition-colors"
          >
            ลงประกาศฟรี
          </Link>
        </nav>

        {/* Actions / User Profile */}
        <div className="flex items-center gap-3 shrink-0">
          {/* Language Toggle */}
          <div className="flex items-center p-0.5 bg-background border border-border rounded-lg text-xs font-semibold">
            <button
              type="button"
              onClick={() => setLang('th')}
              className={`px-2 py-1 rounded-md transition-all ${
                lang === 'th' ? 'bg-surface text-primary shadow-xs' : 'text-muted hover:text-foreground'
              }`}
            >
              TH
            </button>
            <button
              type="button"
              onClick={() => setLang('en')}
              className={`px-2 py-1 rounded-md transition-all ${
                lang === 'en' ? 'bg-surface text-primary shadow-xs' : 'text-muted hover:text-foreground'
              }`}
            >
              EN
            </button>
          </div>

          {/* Notifications */}
          <button
            type="button"
            aria-label="แจ้งเตือน"
            className="relative w-9 h-9 rounded-xl flex items-center justify-center text-muted hover:text-foreground hover:bg-background transition-colors"
          >
            <span className="material-symbols-outlined text-[22px]">notifications</span>
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-status-sold ring-2 ring-surface"></span>
          </button>

          {/* Post Property Button */}
          <Link
            href="/post"
            className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 bg-primary hover:bg-[#115e59] text-white text-sm font-medium rounded-xl shadow-xs transition-colors"
          >
            <span className="material-symbols-outlined text-[18px]">add_circle</span>
            <span>ลงประกาศฟรี</span>
          </Link>

          {/* User Avatar */}
          <div className="flex items-center pl-1 border-l border-border">
            <Link
              href="/my-listings"
              title="จัดการประกาศของฉัน"
              className="w-9 h-9 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-bold text-sm hover:ring-2 hover:ring-primary/30 transition-all"
            >
              <span className="material-symbols-outlined text-[20px]">person</span>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
