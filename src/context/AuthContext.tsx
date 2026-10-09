'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export interface UserProfile {
  id: string;
  name: string;
  phone: string;
  email?: string;
  role: 'buyer' | 'owner' | 'agent';
  avatarUrl?: string;
  isVerified: boolean;
  kycLevel: number;
}

export const USER_PROFILES_BY_ROLE: Record<'owner' | 'agent' | 'buyer', UserProfile> = {
  owner: {
    id: '10000000-0000-0000-0000-000000000001',
    name: 'คุณสมชาย (เจ้าของทรัพย์)',
    phone: '081-111-2222',
    email: 'somchai.owner@mapnest.io',
    role: 'owner',
    avatarUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDLG8GjFLGTr4aP_WHHb2s4C2whuNsmS1TRDYDxlYltAXE9cKqwM5Lb-F7cWZG-kUIJ2zKAOzRMGd2k3tWuMVm2r-6-xfV94e1FLurx-GFJm8WBYlfISMOE5Vsas5zL4x0vq5WwYtIocdpKdr8NV8eidcERgpj36ppZfAHI6wZWiW543dSiDzTZYlSg4YCKex-nK3nD8Twxqg3_YWXF-zLh5kBBchCBT7n8tAHJJ5g',
    isVerified: true,
    kycLevel: 2,
  },
  agent: {
    id: '10000000-0000-0000-0000-000000000002',
    name: 'คุณสมหญิง (Verified Agent Pro)',
    phone: '081-882-9901',
    email: 'somying.agent@mapnest.io',
    role: 'agent',
    avatarUrl:
      'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&auto=format&fit=crop&q=80',
    isVerified: true,
    kycLevel: 3,
  },
  buyer: {
    id: '10000000-0000-0000-0000-000000000003',
    name: 'คุณวิชัย (ผู้ซื้อ / ผู้เช่า)',
    phone: '089-123-4567',
    email: 'wichai.buyer@mapnest.io',
    role: 'buyer',
    avatarUrl:
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80',
    isVerified: false,
    kycLevel: 1,
  },
};

interface AuthContextType {
  user: UserProfile | null;
  isLoggedIn: boolean;
  isAuthModalOpen: boolean;
  openLoginModal: () => void;
  closeLoginModal: () => void;
  loginAs: (profile: UserProfile) => void;
  switchRole: (role: 'buyer' | 'owner' | 'agent') => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  user: USER_PROFILES_BY_ROLE.owner,
  isLoggedIn: true,
  isAuthModalOpen: false,
  openLoginModal: () => {},
  closeLoginModal: () => {},
  loginAs: () => {},
  switchRole: () => {},
  logout: () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(USER_PROFILES_BY_ROLE.owner);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  // Initialize from localStorage if present
  useEffect(() => {
    try {
      const savedRole = localStorage.getItem('mapnest_active_role') as 'buyer' | 'owner' | 'agent' | null;
      if (savedRole && USER_PROFILES_BY_ROLE[savedRole]) {
        setUser(USER_PROFILES_BY_ROLE[savedRole]);
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

  const switchRole = (role: 'buyer' | 'owner' | 'agent') => {
    const profile = USER_PROFILES_BY_ROLE[role];
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
