'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

interface NavbarProps {
  onSearch?: (query: string) => void;
}

export function Navbar({ onSearch }: NavbarProps) {
  const pathname = usePathname();
  const [lang, setLang] = useState<'th' | 'en'>('th');
  const [searchVal, setSearchVal] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, isLoggedIn, openLoginModal } = useAuth();

  const navItems = [
    { href: '/', label: 'สำรวจทรัพย์ (แผนที่)' },
    { href: '/compare', label: 'เปรียบเทียบ' },
    { href: '/demands', label: 'กระดานความต้องการ' },
    { href: '/agent-hub', label: 'Agent Hub' },
    { href: '/packages', label: 'แพ็กเกจโปรโมท' },
    { href: '/my-listings', label: 'ประกาศของฉัน' },
    { href: '/admin', label: 'ศูนย์แอดมิน' },
  ];

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
          <div className="hidden xl:flex items-center relative w-64 lg:w-72">
            <span className="material-symbols-outlined absolute left-3 text-muted text-[18px]">search</span>
            <input
              type="text"
              value={searchVal}
              onChange={(e) => {
                setSearchVal(e.target.value);
                onSearch?.(e.target.value);
              }}
              placeholder="ค้นหาทำเลในอุดรฯ..."
              className="w-full pl-9 pr-3 py-1.5 bg-background border border-border rounded-xl text-xs placeholder:text-muted focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
            />
          </div>
        </div>

        {/* Navigation Links (Desktop) */}
        <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`text-xs font-semibold px-3 py-1.5 rounded-lg transition-all ${
                  isActive
                    ? 'bg-primary/10 text-primary font-bold'
                    : 'text-muted hover:text-foreground hover:bg-slate-50'
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Actions / User Profile */}
        <div className="flex items-center gap-2.5 shrink-0">
          {/* Language Toggle */}
          <div className="hidden sm:flex items-center p-0.5 bg-background border border-border rounded-lg text-xs font-semibold">
            <button
              type="button"
              onClick={() => setLang('th')}
              className={`px-2 py-1 rounded-md transition-all cursor-pointer ${
                lang === 'th' ? 'bg-surface text-primary shadow-xs' : 'text-muted hover:text-foreground'
              }`}
            >
              TH
            </button>
            <button
              type="button"
              onClick={() => setLang('en')}
              className={`px-2 py-1 rounded-md transition-all cursor-pointer ${
                lang === 'en' ? 'bg-surface text-primary shadow-xs' : 'text-muted hover:text-foreground'
              }`}
            >
              EN
            </button>
          </div>

          {/* Messages Link */}
          <Link
            href="/messages"
            aria-label="ข้อความแชท"
            className="relative w-9 h-9 rounded-xl flex items-center justify-center text-muted hover:text-foreground hover:bg-background transition-colors"
          >
            <span className="material-symbols-outlined text-[22px]">chat_bubble_outline</span>
            <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-status-sold text-white text-[10px] font-bold flex items-center justify-center">
              3
            </span>
          </Link>

          {/* Post Property Button */}
          <Link
            href="/post"
            className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 bg-primary hover:bg-[#115e59] text-white text-xs font-bold rounded-xl shadow-xs transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[16px]">add_circle</span>
            <span>ลงประกาศฟรี</span>
          </Link>

          {/* User Avatar / Login Button */}
          <div className="flex items-center pl-1 border-l border-border">
            {isLoggedIn && user ? (
              <Link
                href="/my-listings"
                title={`${user.name} (${user.role === 'owner' ? 'เจ้าของ' : user.role === 'agent' ? 'นายหน้า' : 'ผู้ซื้อ'})`}
                className="w-9 h-9 rounded-full overflow-hidden border border-primary/20 flex items-center justify-center text-primary font-bold text-sm hover:ring-2 hover:ring-primary/30 transition-all shrink-0 bg-primary/10"
              >
                {user.avatarUrl ? (
                  <img src={user.avatarUrl} alt={user.name} className="w-full h-full object-cover" />
                ) : (
                  <span className="material-symbols-outlined text-[20px]">person</span>
                )}
              </Link>
            ) : (
              <button
                type="button"
                onClick={openLoginModal}
                className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-semibold text-slate-800 transition-colors cursor-pointer"
              >
                เข้าสู่ระบบ
              </button>
            )}
          </div>

          {/* Mobile Hamburger Button */}
          <button
            type="button"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden w-9 h-9 rounded-xl flex items-center justify-center text-muted hover:text-foreground hover:bg-background transition-colors cursor-pointer"
            aria-label="เปิดเมนูหลัก"
          >
            <span className="material-symbols-outlined text-[24px]">
              {isMobileMenuOpen ? 'close' : 'menu'}
            </span>
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {isMobileMenuOpen && (
        <div className="lg:hidden border-t border-border bg-surface px-4 py-4 space-y-2 shadow-lg animate-in slide-in-from-top-2 duration-200">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`block px-3 py-2 rounded-xl text-sm font-semibold transition-colors ${
                  isActive
                    ? 'bg-primary text-white font-bold'
                    : 'text-foreground hover:bg-slate-100'
                }`}
              >
                {item.label}
              </Link>
            );
          })}
          <div className="pt-2 border-t border-border flex flex-col gap-2">
            <Link
              href="/post"
              onClick={() => setIsMobileMenuOpen(false)}
              className="w-full py-2.5 bg-primary text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5"
            >
              <span className="material-symbols-outlined text-[16px]">add_circle</span>
              <span>ลงประกาศฟรี</span>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
