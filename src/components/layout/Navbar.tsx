'use client';

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth, ROLE_META, UserRole } from '@/context/AuthContext';
import { canAccessPath } from '@/lib/access';
import { NotificationDropdown } from '@/components/notifications/NotificationDropdown';

interface NavbarProps {
  onSearch?: (query: string) => void;
}

type NavItem = { href: string; label: string };

const NAV_BY_ROLE: Record<UserRole | 'guest', NavItem[]> = {
  guest: [
    { href: '/', label: 'สำรวจทรัพย์' },
    { href: '/compare', label: 'เปรียบเทียบ' },
    { href: '/demands', label: 'กระดานความต้องการ' },
  ],
  buyer: [
    { href: '/', label: 'สำรวจทรัพย์' },
    { href: '/compare', label: 'เปรียบเทียบ' },
    { href: '/demands', label: 'กระดานความต้องการ' },
    { href: '/saved', label: 'ที่บันทึกไว้' },
    { href: '/appointments', label: 'นัดหมาย' },
  ],
  owner: [
    { href: '/', label: 'สำรวจทรัพย์' },
    { href: '/my-listings', label: 'ประกาศของฉัน' },
    { href: '/packages', label: 'แพ็กเกจโปรโมท' },
    { href: '/demands', label: 'กระดานความต้องการ' },
    { href: '/appointments', label: 'นัดหมาย' },
  ],
  agent: [
    { href: '/', label: 'สำรวจทรัพย์' },
    { href: '/agent-hub', label: 'Agent Hub' },
    { href: '/demands', label: 'กระดานความต้องการ' },
    { href: '/my-listings', label: 'ประกาศของฉัน' },
    { href: '/packages', label: 'แพ็กเกจโปรโมท' },
  ],
  admin: [
    { href: '/admin', label: 'ศูนย์แอดมิน' },
    { href: '/', label: 'สำรวจทรัพย์' },
    { href: '/demands', label: 'กระดานความต้องการ' },
  ],
};

export function Navbar({ onSearch }: NavbarProps) {
  const pathname = usePathname();
  const [searchVal, setSearchVal] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const { user, isLoggedIn, isHydrated, openLoginModal, logout } = useAuth();

  const role = user?.role;
  // Filter through access rules too, so menus can never show a page the user can't open.
  const navItems = NAV_BY_ROLE[role ?? 'guest'].filter((i) => canAccessPath(i.href, role));
  const canPost = canAccessPath('/post', role);

  // close user menu on outside click
  useEffect(() => {
    if (!isUserMenuOpen) return;
    const onDown = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) setIsUserMenuOpen(false);
    };
    document.addEventListener('mousedown', onDown);
    return () => document.removeEventListener('mousedown', onDown);
  }, [isUserMenuOpen]);

  const handleLogout = () => {
    logout();
    setIsUserMenuOpen(false);
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 left-0 w-full z-50 bg-surface border-b border-border shadow-xs">
      <div className="h-18 max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
        {/* Brand & Search */}
        <div className="flex items-center gap-6 shrink-0">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-white shadow-xs group-hover:scale-105 transition-transform">
              <span className="material-symbols-outlined text-[24px]">home_pin</span>
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold tracking-tight text-primary leading-tight">MapNest</span>
              <span className="text-[10px] text-muted font-medium">อุดรธานี Pilot</span>
            </div>
          </Link>

          <div className="hidden xl:flex items-center relative w-56 lg:w-64">
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

        {/* Desktop nav */}
        <nav className="hidden lg:flex items-center gap-1 xl:gap-1.5">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`text-xs font-semibold px-2.5 py-1.5 rounded-lg transition-all ${
                  isActive ? 'bg-primary/10 text-primary font-bold' : 'text-muted hover:text-foreground hover:bg-slate-50'
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-2 shrink-0">
          {isLoggedIn && (
            <>
              <Link
                href="/saved"
                aria-label="ทรัพย์ที่บันทึกไว้"
                title="ทรัพย์ที่บันทึกไว้"
                className="hidden sm:flex w-9 h-9 rounded-xl items-center justify-center text-muted hover:text-foreground hover:bg-background transition-colors"
              >
                <span className="material-symbols-outlined text-[20px]">favorite_border</span>
              </Link>
              <NotificationDropdown />
              <Link
                href="/messages"
                aria-label="ข้อความแชท"
                title="ข้อความ"
                className="relative w-9 h-9 rounded-xl flex items-center justify-center text-muted hover:text-foreground hover:bg-background transition-colors"
              >
                <span className="material-symbols-outlined text-[22px]">chat_bubble_outline</span>
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-status-sold text-white text-[10px] font-bold flex items-center justify-center">
                  3
                </span>
              </Link>
            </>
          )}

          {/* Primary CTA — depends on role */}
          {canPost ? (
            <Link
              href="/post"
              className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 bg-primary hover:bg-[#115e59] text-white text-xs font-bold rounded-xl shadow-xs transition-colors"
            >
              <span className="material-symbols-outlined text-[16px]">add_circle</span>
              <span>ลงประกาศ</span>
            </Link>
          ) : role === 'buyer' ? (
            <Link
              href="/demand/create"
              className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 bg-primary hover:bg-[#115e59] text-white text-xs font-bold rounded-xl shadow-xs transition-colors"
            >
              <span className="material-symbols-outlined text-[16px]">pin_drop</span>
              <span>ปักหมุดหาทรัพย์</span>
            </Link>
          ) : null}

          {/* User menu / Login */}
          <div className="flex items-center pl-1 border-l border-border" ref={userMenuRef}>
            {!isHydrated ? (
              <div className="w-9 h-9 rounded-full bg-slate-100 animate-pulse" />
            ) : user ? (
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setIsUserMenuOpen((v) => !v)}
                  aria-haspopup="menu"
                  aria-expanded={isUserMenuOpen}
                  className="flex items-center gap-2 pl-1 pr-2 py-1 rounded-full hover:bg-slate-50 cursor-pointer"
                >
                  <img
                    src={user.avatarUrl}
                    alt={user.name}
                    className="w-8 h-8 rounded-full object-cover border border-primary/30"
                  />
                  <span className="hidden md:flex flex-col items-start leading-tight">
                    <span className="text-xs font-bold text-foreground max-w-[120px] truncate">{user.name}</span>
                    <span className="text-[10px] text-muted">{ROLE_META[user.role].short}</span>
                  </span>
                  <span className="material-symbols-outlined text-[16px] text-muted">expand_more</span>
                </button>

                {isUserMenuOpen && (
                  <div role="menu" className="absolute right-0 mt-2 w-64 bg-surface rounded-2xl border border-border shadow-xl p-2 z-50">
                    <div className="px-3 py-2 border-b border-border mb-1">
                      <div className="text-sm font-bold text-foreground">{user.name}</div>
                      <div className="text-[11px] text-muted">{user.phone} · {ROLE_META[user.role].label}</div>
                    </div>
                    <Link
                      href="/account"
                      onClick={() => setIsUserMenuOpen(false)}
                      className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm text-foreground hover:bg-slate-50"
                    >
                      <span className="material-symbols-outlined text-[18px] text-primary">manage_accounts</span>
                      บัญชีและ KYC
                    </Link>
                    {role === 'agent' && (
                      <Link
                        href="/agent/somying"
                        onClick={() => setIsUserMenuOpen(false)}
                        className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm text-foreground hover:bg-slate-50"
                      >
                        <span className="material-symbols-outlined text-[18px] text-primary">storefront</span>
                        หน้าโปรไฟล์สาธารณะ
                      </Link>
                    )}
                    <Link
                      href="/appointments"
                      onClick={() => setIsUserMenuOpen(false)}
                      className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm text-foreground hover:bg-slate-50"
                    >
                      <span className="material-symbols-outlined text-[18px] text-primary">calendar_month</span>
                      นัดหมายของฉัน
                    </Link>
                    <button
                      type="button"
                      onClick={() => {
                        setIsUserMenuOpen(false);
                        openLoginModal();
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-sm text-foreground hover:bg-slate-50 cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[18px] text-primary">switch_account</span>
                      สลับบัญชีทดสอบ
                    </button>
                    <div className="border-t border-border mt-1 pt-1">
                      <button
                        type="button"
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-semibold text-status-sold hover:bg-red-50 cursor-pointer"
                      >
                        <span className="material-symbols-outlined text-[18px]">logout</span>
                        ออกจากระบบ
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <button
                type="button"
                onClick={openLoginModal}
                className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-700 text-xs font-bold text-white transition-colors cursor-pointer"
              >
                เข้าสู่ระบบ
              </button>
            )}
          </div>

          <button
            type="button"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden w-9 h-9 rounded-xl flex items-center justify-center text-muted hover:text-foreground hover:bg-background transition-colors cursor-pointer"
            aria-label="เปิดเมนูหลัก"
          >
            <span className="material-symbols-outlined text-[24px]">{isMobileMenuOpen ? 'close' : 'menu'}</span>
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      {isMobileMenuOpen && (
        <div className="lg:hidden border-t border-border bg-surface px-4 py-4 space-y-1 shadow-lg">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setIsMobileMenuOpen(false)}
              className={`block px-3 py-2 rounded-xl text-sm font-semibold transition-colors ${
                pathname === item.href ? 'bg-primary text-white' : 'text-foreground hover:bg-slate-100'
              }`}
            >
              {item.label}
            </Link>
          ))}
          <div className="pt-2 mt-2 border-t border-border space-y-1">
            {user ? (
              <>
                <Link
                  href="/account"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block px-3 py-2 rounded-xl text-sm font-semibold text-foreground hover:bg-slate-100"
                >
                  บัญชีและ KYC
                </Link>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="w-full text-left px-3 py-2 rounded-xl text-sm font-semibold text-status-sold hover:bg-red-50"
                >
                  ออกจากระบบ
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  openLoginModal();
                }}
                className="w-full py-2.5 bg-primary text-white rounded-xl text-sm font-bold"
              >
                เข้าสู่ระบบ
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
