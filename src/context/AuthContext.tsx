'use client';

import React, { createContext, useCallback, useContext, useSyncExternalStore } from 'react';

export type UserRole = 'buyer' | 'owner' | 'agent' | 'admin';

export interface UserProfile {
  id: string;
  name: string;
  phone: string;
  email?: string;
  role: UserRole;
  roleLabel: string;
  avatarUrl?: string;
  isVerified: boolean;
  kycLevel: number;
  description?: string;
}

/** Labels shared by Navbar, AuthModal, guards, etc. */
export const ROLE_META: Record<UserRole, { label: string; short: string; icon: string }> = {
  owner: { label: 'เจ้าของทรัพย์ (Owner)', short: 'เจ้าของทรัพย์', icon: 'home' },
  agent: { label: 'นายหน้ามืออาชีพ (Agent Pro)', short: 'นายหน้า Pro', icon: 'badge' },
  buyer: { label: 'ผู้ซื้อ / ผู้เช่า (Buyer)', short: 'ผู้ซื้อ/ผู้เช่า', icon: 'person_search' },
  admin: { label: 'ผู้ดูแลระบบ (Admin Ops)', short: 'แอดมิน', icon: 'admin_panel_settings' },
};

/** Test accounts — mirror rows seeded in m1_identity.users (see docs/TEST_ACCOUNTS.md). */
export const TEST_USERS: Record<UserRole, UserProfile> = {
  owner: {
    id: '10000000-0000-0000-0000-000000000001',
    name: 'คุณสมชาย ยิ่งเจริญ',
    phone: '081-111-2222',
    email: 'somchai.owner@mapnest.io',
    role: 'owner',
    roleLabel: ROLE_META.owner.label,
    avatarUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDLG8GjFLGTr4aP_WHHb2s4C2whuNsmS1TRDYDxlYltAXE9cKqwM5Lb-F7cWZG-kUIJ2zKAOzRMGd2k3tWuMVm2r-6-xfV94e1FLurx-GFJm8WBYlfISMOE5Vsas5zL4x0vq5WwYtIocdpKdr8NV8eidcERgpj36ppZfAHI6wZWiW543dSiDzTZYlSg4YCKex-nK3nD8Twxqg3_YWXF-zLh5kBBchCBT7n8tAHJJ5g',
    isVerified: true,
    kycLevel: 2,
    description: 'เจ้าของคอนโดและบ้านใน อ.เมืองอุดรธานี',
  },
  agent: {
    id: '10000000-0000-0000-0000-000000000002',
    name: 'คุณสมหญิง บุญรักษา',
    phone: '081-882-9901',
    email: 'somying.agent@mapnest.io',
    role: 'agent',
    roleLabel: ROLE_META.agent.label,
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&auto=format&fit=crop&q=80',
    isVerified: true,
    kycLevel: 3,
    description: 'นายหน้า TREBA ที่ยืนยันตัวตนแล้ว เปิดรับ Co-Broker 50/50',
  },
  buyer: {
    id: '10000000-0000-0000-0000-000000000003',
    name: 'คุณวิชัย รัตนประเสริฐ',
    phone: '089-123-4567',
    email: 'wichai.buyer@mapnest.io',
    role: 'buyer',
    roleLabel: ROLE_META.buyer.label,
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80',
    isVerified: true,
    kycLevel: 1,
    description: 'กำลังหาบ้านเดี่ยวใกล้หนองประจักษ์',
  },
  admin: {
    id: '10000000-0000-0000-0000-000000000004',
    name: 'แอดมินอุดรธานี',
    phone: '080-999-0000',
    email: 'admin@mapnest.io',
    role: 'admin',
    roleLabel: ROLE_META.admin.label,
    avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&auto=format&fit=crop&q=80',
    isVerified: true,
    kycLevel: 4,
    description: 'ตรวจ KYC, อนุมัติประกาศ, จัดการรายงาน',
  },
};

export const TEST_OTP = '123456';

/** Find a test user by phone number (ignores dashes/spaces, accepts +66 prefix). */
export function findUserByPhone(phone: string): UserProfile | undefined {
  let digits = phone.replace(/\D/g, '');
  if (digits.startsWith('66')) digits = '0' + digits.slice(2);
  return Object.values(TEST_USERS).find((u) => u.phone.replace(/\D/g, '') === digits);
}

// ---------- session store (localStorage, SSR-safe via useSyncExternalStore) ----------
const STORAGE_KEY = 'mapnest_session_role';
const listeners = new Set<() => void>();

function readRole(): UserRole | null {
  try {
    const v = localStorage.getItem(STORAGE_KEY) as UserRole | null;
    return v && v in TEST_USERS ? v : null;
  } catch {
    return null;
  }
}
function writeRole(role: UserRole | null) {
  try {
    if (role) localStorage.setItem(STORAGE_KEY, role);
    else localStorage.removeItem(STORAGE_KEY);
  } catch {
    // ignore storage errors
  }
  listeners.forEach((l) => l());
}
function subscribe(cb: () => void) {
  listeners.add(cb);
  const onStorage = (e: StorageEvent) => e.key === STORAGE_KEY && cb();
  window.addEventListener('storage', onStorage);
  return () => {
    listeners.delete(cb);
    window.removeEventListener('storage', onStorage);
  };
}
// undefined on the server = "not hydrated yet"
const getServerSnapshot = (): UserRole | null | undefined => undefined;

// ---------- modal store ----------
let modalOpen = false;
const modalListeners = new Set<() => void>();
function setModal(v: boolean) {
  modalOpen = v;
  modalListeners.forEach((l) => l());
}

interface AuthContextType {
  user: UserProfile | null;
  isLoggedIn: boolean;
  /** false during SSR / first paint — guards should wait instead of flashing "access denied" */
  isHydrated: boolean;
  isAuthModalOpen: boolean;
  openLoginModal: () => void;
  closeLoginModal: () => void;
  loginAs: (profile: UserProfile) => void;
  switchRole: (role: UserRole) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const role = useSyncExternalStore(subscribe, readRole, getServerSnapshot);
  const isAuthModalOpen = useSyncExternalStore(
    (cb) => {
      modalListeners.add(cb);
      return () => modalListeners.delete(cb);
    },
    () => modalOpen,
    () => false
  );

  const user = role ? TEST_USERS[role] : null;

  const loginAs = useCallback((profile: UserProfile) => {
    writeRole(profile.role);
    setModal(false);
  }, []);
  const switchRole = useCallback((r: UserRole) => writeRole(r), []);
  const logout = useCallback(() => writeRole(null), []);
  const openLoginModal = useCallback(() => setModal(true), []);
  const closeLoginModal = useCallback(() => setModal(false), []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoggedIn: !!user,
        isHydrated: role !== undefined,
        isAuthModalOpen,
        openLoginModal,
        closeLoginModal,
        loginAs,
        switchRole,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
  return ctx;
}
