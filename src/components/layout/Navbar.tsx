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
  const [isRoleDropdownOpen, setIsRoleDropdownOpen] = useState(false);
  const { user, isLoggedIn, switchRole, openLoginModal } = useAuth();

  const currentRole = user?.role || 'owner';

  // Dynamic Navigation Items adapted to active Role
  const navItems = React.useMemo(() => {
    if (currentRole === 'buyer') {
      return [
        { href: '/', label: 'สำรวจทรัพย์ (แผนที่)' },
        { href: '/compare', label: 'เปรียบเทียบ' },
        { href: '/demands', label: 'กระดานความต้องการ' },
        { href: '/demand/create', label: 'ปักหมุดหาทรัพย์' },
        { href: '/saved', label: 'ทรัพย์ที่บันทึก' },
        { href: '/appointments', label: 'นัดหมายของฉัน' },
      ];
    }
    if (currentRole === 'agent') {
      return [
        { href: '/', label: 'สำรวจทรัพย์' },
        { href: '/agent-hub', label: 'Agent Hub (Co-Broker)' },
        { href: '/demands', label: 'กระดานความต้องการ' },
        { href: '/my-listings', label: 'ประกาศของฉัน' },
        { href: '/agent/somying', label: 'โปรไฟล์เอเจนต์' },
        { href: '/packages', label: 'แพ็กเกจโปรโมท' },
        { href: '/admin', label: 'ศูนย์แอดมิน' },
      ];
    }
    // Owner
    return [
      { href: '/', label: 'สำรวจทรัพย์ (แผนที่)' },
      { href: '/my-listings', label: 'ประกาศของฉัน' },
      { href: '/post', label: 'ลงประกาศ' },
      { href: '/packages', label: 'แพ็กเกจโปรโมท' },
      { href: '/demands', label: 'กระดานความต้องการ' },
      { href: '/compare', label: 'เปรียบเทียบ' },
      { href: '/admin', label: 'ศูนย์แอดมิน' },
    ];
  }, [currentRole]);

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

        {/* Navigation Links (Desktop — Role Adaptive) */}
        <nav className="hidden lg:flex items-center gap-1 xl:gap-1.5">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`text-xs font-semibold px-2.5 py-1.5 rounded-lg transition-all ${
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
        <div className="flex items-center gap-2 shrink-0">
          {/* S03 Role Switcher Dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setIsRoleDropdownOpen(!isRoleDropdownOpen)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border border-border bg-slate-50 hover:bg-slate-100 text-xs font-bold text-foreground transition-all cursor-pointer shadow-2xs"
              title="สลับบทบาทผู้ใช้ (S03 Role Switcher)"
            >
              <span className="material-symbols-outlined text-[16px] text-primary">
                {currentRole === 'owner' ? 'home' : currentRole === 'agent' ? 'badge' : 'person_search'}
              </span>
              <span>
                {currentRole === 'owner' ? 'เจ้าของทรัพย์' : currentRole === 'agent' ? 'นายหน้า Pro' : 'ผู้ซื้อ/ผู้เช่า'}
              </span>
              <span className="material-symbols-outlined text-[14px] text-muted">arrow_drop_down</span>
            </button>

            {/* Dropdown Menu */}
            {isRoleDropdownOpen && (
              <div className="absolute right-0 mt-2 w-64 bg-surface rounded-2xl border border-border shadow-xl p-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                <div className="px-3 py-1.5 text-[11px] font-bold text-muted uppercase tracking-wider border-b border-border mb-1">
                  สลับบทบาทผู้ใช้งาน (Role Switcher):
                </div>

                <button
                  type="button"
                  onClick={() => {
                    switchRole('owner');
                    setIsRoleDropdownOpen(false);
                  }}
                  className={`w-full p-2.5 rounded-xl text-left flex items-start gap-2.5 transition-colors cursor-pointer ${
                    currentRole === 'owner' ? 'bg-primary/10 text-primary font-bold' : 'hover:bg-slate-50 text-foreground'
                  }`}
                >
                  <span className="material-symbols-outlined text-[20px] text-primary mt-0.5">home</span>
                  <div>
                    <div className="text-xs font-bold">🏠 คุณสมชาย (เจ้าของทรัพย์)</div>
                    <div className="text-[10px] text-muted">ลงประกาศขาย/เช่า, จัดการสถานะ</div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    switchRole('agent');
                    setIsRoleDropdownOpen(false);
                  }}
                  className={`w-full p-2.5 rounded-xl text-left flex items-start gap-2.5 transition-colors cursor-pointer ${
                    currentRole === 'agent' ? 'bg-primary/10 text-primary font-bold' : 'hover:bg-slate-50 text-foreground'
                  }`}
                >
                  <span className="material-symbols-outlined text-[20px] text-blue-600 mt-0.5">badge</span>
                  <div>
                    <div className="text-xs font-bold">💼 คุณสมหญิง (Verified Agent)</div>
                    <div className="text-[10px] text-muted">Co-Broker Hub 50/50, รับข้อเสนอ</div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    switchRole('buyer');
                    setIsRoleDropdownOpen(false);
                  }}
                  className={`w-full p-2.5 rounded-xl text-left flex items-start gap-2.5 transition-colors cursor-pointer ${
                    currentRole === 'buyer' ? 'bg-primary/10 text-primary font-bold' : 'hover:bg-slate-50 text-foreground'
                  }`}
                >
                  <span className="material-symbols-outlined text-[20px] text-amber-600 mt-0.5">search</span>
                  <div>
                    <div className="text-xs font-bold">🔍 คุณวิชัย (ผู้ซื้อ / ผู้เช่า)</div>
                    <div className="text-[10px] text-muted">ค้นหาบนแผนที่, นัดชม, ปักหมุดหา</div>
                  </div>
                </button>

                <div className="pt-1.5 mt-1 border-t border-border">
                  <Link
                    href="/role-selection"
                    onClick={() => setIsRoleDropdownOpen(false)}
                    className="block text-center text-xs font-semibold text-primary hover:underline py-1"
                  >
                    ดูหน้าเลือกบทบาทเต็มจอ (S03) →
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* Saved Link */}
          <Link
            href="/saved"
            aria-label="ทรัพย์ที่บันทึกไว้"
            className="w-9 h-9 rounded-xl flex items-center justify-center text-muted hover:text-foreground hover:bg-background transition-colors cursor-pointer"
            title="ทรัพย์ที่บันทึกไว้ & คิวจอง"
          >
            <span className="material-symbols-outlined text-[20px]">favorite_border</span>
          </Link>

          {/* Appointments Calendar Link */}
          <Link
            href="/appointments"
            aria-label="นัดหมายชมทรัพย์"
            className="w-9 h-9 rounded-xl flex items-center justify-center text-muted hover:text-foreground hover:bg-background transition-colors cursor-pointer"
            title="ตารางนัดหมายชมทรัพย์"
          >
            <span className="material-symbols-outlined text-[20px]">calendar_month</span>
          </Link>

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

          {/* Role Adaptive Action Button */}
          {currentRole === 'buyer' ? (
            <Link
              href="/demand/create"
              className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 bg-primary hover:bg-[#115e59] text-white text-xs font-bold rounded-xl shadow-xs transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-[16px]">pin_drop</span>
              <span>ปักหมุดหาทรัพย์</span>
            </Link>
          ) : (
            <Link
              href="/post"
              className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 bg-primary hover:bg-[#115e59] text-white text-xs font-bold rounded-xl shadow-xs transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-[16px]">add_circle</span>
              <span>ลงประกาศฟรี</span>
            </Link>
          )}

          {/* User Avatar / Account */}
          <div className="flex items-center pl-1 border-l border-border">
            {isLoggedIn && user ? (
              <Link
                href="/account"
                title={`โปรไฟล์: ${user.name}`}
                className="w-9 h-9 rounded-full overflow-hidden border border-primary/30 flex items-center justify-center text-primary font-bold text-sm hover:ring-2 hover:ring-primary/40 transition-all shrink-0 bg-primary/10"
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
          {/* Mobile Role Switcher */}
          <div className="p-3 bg-slate-50 rounded-2xl mb-2">
            <span className="text-xs font-bold text-muted block mb-2">เลือกบทบาทปัจจุบัน:</span>
            <div className="grid grid-cols-3 gap-1.5">
              {[
                { id: 'owner', label: 'เจ้าของ' },
                { id: 'agent', label: 'นายหน้า' },
                { id: 'buyer', label: 'ผู้ซื้อ' },
              ].map((r) => (
                <button
                  key={r.id}
                  type="button"
                  onClick={() => switchRole(r.id as any)}
                  className={`py-1.5 rounded-xl text-xs font-bold transition-all ${
                    currentRole === r.id ? 'bg-primary text-white shadow-xs' : 'bg-surface border border-border text-foreground'
                  }`}
                >
                  {r.label}
                </button>
              ))}
            </div>
          </div>

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

          <div className="pt-2 border-t border-border space-y-1">
            <Link
              href="/saved"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-semibold text-foreground hover:bg-slate-100"
            >
              <span className="material-symbols-outlined text-[18px] text-primary">favorite</span>
              <span>ทรัพย์ที่บันทึกไว้ & คิวจอง</span>
            </Link>
            <Link
              href="/appointments"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-semibold text-foreground hover:bg-slate-100"
            >
              <span className="material-symbols-outlined text-[18px] text-primary">calendar_month</span>
              <span>นัดหมายชมทรัพย์</span>
            </Link>
            <Link
              href="/account"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-semibold text-foreground hover:bg-slate-100"
            >
              <span className="material-symbols-outlined text-[18px] text-primary">badge</span>
              <span>ตั้งค่าบัญชี & ยืนยันตัวตน KYC</span>
            </Link>
            <Link
              href="/role-selection"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-semibold text-foreground hover:bg-slate-100"
            >
              <span className="material-symbols-outlined text-[18px] text-primary">switch_account</span>
              <span>หน้าเลือกบทบาท (S03 Role Selection)</span>
            </Link>
          </div>

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
