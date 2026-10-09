'use client';

import React from 'react';
import Link from 'next/link';
import { useAuth, ROLE_META } from '@/context/AuthContext';
import { Access, canAccess } from '@/lib/access';
import { Navbar } from '@/components/layout/Navbar';

/** Blocks a page unless the current user satisfies `access`. Waits for hydration to avoid flashing. */
export function RoleGuard({ access, children }: { access: Access; children: React.ReactNode }) {
  const { user, isHydrated, openLoginModal } = useAuth();

  if (!isHydrated) {
    return (
      <>
        <Navbar />
        <div className="min-h-[60vh] flex items-center justify-center text-muted">
          <span className="material-symbols-outlined animate-spin text-primary text-3xl">progress_activity</span>
        </div>
      </>
    );
  }

  if (canAccess(access, user?.role)) return <>{children}</>;

  const needLogin = !user;
  const allowed = Array.isArray(access) ? access.map((r) => ROLE_META[r].short).join(' / ') : '';

  return (
    <>
    <Navbar />
    <div className="min-h-[70vh] flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-surface border border-border rounded-3xl p-8 text-center shadow-xs">
        <div className="w-14 h-14 rounded-2xl bg-amber-50 text-status-reserved flex items-center justify-center mx-auto mb-4">
          <span className="material-symbols-outlined text-[30px]">{needLogin ? 'lock' : 'block'}</span>
        </div>
        <h1 className="text-xl font-black text-foreground">
          {needLogin ? 'กรุณาเข้าสู่ระบบ' : 'ไม่มีสิทธิ์เข้าถึงหน้านี้'}
        </h1>
        <p className="text-sm text-muted mt-2">
          {needLogin
            ? 'หน้านี้สำหรับสมาชิกเท่านั้น'
            : `หน้านี้สำหรับ ${allowed} เท่านั้น (คุณเข้าสู่ระบบในฐานะ ${ROLE_META[user.role].short})`}
        </p>
        <div className="mt-6 flex flex-col sm:flex-row gap-2 justify-center">
          <button
            type="button"
            onClick={openLoginModal}
            className="px-5 py-2.5 bg-primary text-white rounded-xl text-sm font-bold hover:bg-primary/90 cursor-pointer"
          >
            {needLogin ? 'เข้าสู่ระบบ' : 'เปลี่ยนบัญชี'}
          </button>
          <Link
            href="/"
            className="px-5 py-2.5 border border-border rounded-xl text-sm font-bold text-foreground hover:bg-slate-50"
          >
            กลับหน้าแรก
          </Link>
        </div>
      </div>
    </div>
    </>
  );
}
