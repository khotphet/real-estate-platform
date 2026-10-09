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

interface AuthContextType {
  user: UserProfile | null;
  isLoggedIn: boolean;
  isAuthModalOpen: boolean;
  openLoginModal: () => void;
  closeLoginModal: () => void;
  loginAs: (profile: UserProfile) => void;
  logout: () => void;
}

const defaultUser: UserProfile = {
  id: '10000000-0000-0000-0000-000000000001',
  name: 'สมชาย เจ้าของห้อง',
  phone: '081-111-2222',
  email: 'somchai.owner@mapnest.io',
  role: 'owner',
  avatarUrl:
    'https://lh3.googleusercontent.com/aida-public/AB6AXuDLG8GjFLGTr4aP_WHHb2s4C2whuNsmS1TRDYDxlYltAXE9cKqwM5Lb-F7cWZG-kUIJ2zKAOzRMGd2k3tWuMVm2r-6-xfV94e1FLurx-GFJm8WBYlfISMOE5Vsas5zL4x0vq5WwYtIocdpKdr8NV8eidcERgpj36ppZfAHI6wZWiW543dSiDzTZYlSg4YCKex-nK3nD8Twxqg3_YWXF-zLh5kBBchCBT7n8tAHJJ5g',
  isVerified: true,
  kycLevel: 2,
};

const AuthContext = createContext<AuthContextType>({
  user: defaultUser,
  isLoggedIn: true,
  isAuthModalOpen: false,
  openLoginModal: () => {},
  closeLoginModal: () => {},
  loginAs: () => {},
  logout: () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(defaultUser);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  const openLoginModal = () => setIsAuthModalOpen(true);
  const closeLoginModal = () => setIsAuthModalOpen(false);

  const loginAs = (profile: UserProfile) => {
    setUser(profile);
    setIsAuthModalOpen(false);
  };

  const logout = () => {
    setUser(null);
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
