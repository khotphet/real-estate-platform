'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export interface UserProfile {
  id: string;
  name: string;
  phone: string;
  email?: string;
  role: 'buyer' | 'owner' | 'agent' | 'admin';
  roleLabel: string;
  avatarUrl?: string;
  isVerified: boolean;
  kycLevel: number;
  description?: string;
}

export const TEST_USERS: Record<string, UserProfile> = {
  owner: {
    id: '10000000-0000-0000-0000-000000000001',
    name: 'คุณสมชาย ยิ่งเจริญ',
    phone: '081-111-2222',
    email: 'somchai.owner@mapnest.io',
    role: 'owner',
    roleLabel: 'เจ้าของทรัพย์ (Owner)',
    avatarUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDLG8GjFLGTr4aP_WHHb2s4C2whuNsmS1TRDYDxlYltAXE9cKqwM5Lb-F7cWZG-kUIJ2zKAOzRMGd2k3tWuMVm2r-6-xfV94e1FLurx-GFJm8WBYlfISMOE5Vsas5zL4x0vq5WwYtIocdpKdr8NV8eidcERgpj36ppZfAHI6wZWiW543dSiDzTZYlSg4YCKex-nK3nD8Twxqg3_YWXF-zLh5kBBchCBT7n8tAHJJ5g',
    isVerified: true,
    kycLevel: 2,
    description: 'มีบ้านเดี่ยวและคอนโดปล่อยเช่า-ขาย ใน อ.เมืองอุดรธานี (UD-00101, UD-00102)',
  },
  agent: {
    id: '10000000-0000-0000-0000-000000000002',
    name: 'คุณสมหญิง บุญรักษา',
    phone: '081-882-9901',
    email: 'somying.agent@mapnest.io',
    role: 'agent',
    roleLabel: 'นายหน้ามืออาชีพ (Verified Agent Pro)',
    avatarUrl:
      'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&auto=format&fit=crop&q=80',
    isVerified: true,
    kycLevel: 3,
    description: 'ตัวแทนนายหน้า TREBA มีทรัพย์ในมือกว่า 12 รายการ และเปิดรับ Co-Broker 50/50',
  },
  buyer: {
    id: '10000000-0000-0000-0000-000000000003',
    name: 'คุณวิชัย รัตนประเสริฐ',
    phone: '089-123-4567',
    email: 'wichai.buyer@mapnest.io',
    role: 'buyer',
    roleLabel: 'ผู้ซื้อ / ผู้เช่า (Buyer / Tenant)',
    avatarUrl:
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80',
    isVerified: true,
    kycLevel: 1,
    description: 'กำลังมองหาบ้านเดี่ยวใกล้สวนหนองประจักษ์ งบ 4.5M - 6.5M พร้อมเข้าอยู่',
  },
  admin: {
    id: '10000000-0000-0000-0000-000000000004',
    name: 'แอดมินอุดรธานี (Admin Ops)',
    phone: '080-999-0000',
    email: 'admin@mapnest.io',
    role: 'admin',
    roleLabel: 'ผู้ดูแลระบบ & ความปลอดภัย (Admin & Trust)',
    avatarUrl:
      'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&auto=format&fit=crop&q=80',
    isVerified: true,
    kycLevel: 4,
    description: 'ฝ่ายตรวจสอบเอกสาร KYC, ตรวจประกาศใหม่ และจัดการข้อร้องเรียนความปลอดภัย',
  },
};

export const USER_PROFILES_BY_ROLE = TEST_USERS;

interface AuthContextType {
  user: UserProfile | null;
  isLoggedIn: boolean;
  isAuthModalOpen: boolean;
  openLoginModal: () => void;
  closeLoginModal: () => void;
  loginAs: (profile: UserProfile) => void;
  switchRole: (role: 'buyer' | 'owner' | 'agent' | 'admin') => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  user: TEST_USERS.owner,
  isLoggedIn: true,
  isAuthModalOpen: false,
  openLoginModal: () => {},
  closeLoginModal: () => {},
  loginAs: () => {},
  switchRole: () => {},
  logout: () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(TEST_USERS.owner);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  useEffect(() => {
    try {
      const savedRole = localStorage.getItem('mapnest_active_role');
      if (savedRole && TEST_USERS[savedRole]) {
        setUser(TEST_USERS[savedRole]);
      }
    } catch {
      // ignore
    }
  }, []);

  const openLoginModal = () => setIsAuthModalOpen(true);
  const closeLoginModal = () => setIsAuthModalOpen(false);

  const loginAs = (profile: UserProfile) => {
    setUser(profile);
    setIsAuthModalOpen(false);
    try {
      localStorage.setItem('mapnest_active_role', profile.role);
    } catch {
      // ignore
    }
  };

  const switchRole = (role: 'buyer' | 'owner' | 'agent' | 'admin') => {
    const profile = TEST_USERS[role];
    if (profile) {
      setUser(profile);
      try {
        localStorage.setItem('mapnest_active_role', role);
      } catch {
        // ignore
      }
    }
  };

  const logout = () => {
    setUser(null);
    try {
      localStorage.removeItem('mapnest_active_role');
    } catch {
      // ignore
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoggedIn: !!user,
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
  return useContext(AuthContext);
}
