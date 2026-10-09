'use client';

import React, { useState, useEffect } from 'react';
import { X, Phone, ShieldCheck, CheckCircle2, User, KeyRound, Sparkles } from 'lucide-react';
import { useAuth, UserProfile } from '@/context/AuthContext';

export function AuthModal() {
  const { isAuthModalOpen, closeLoginModal, loginAs } = useAuth();
  const [step, setStep] = useState<'login' | 'otp' | 'role'>('login');
  const [phone, setPhone] = useState('081-234-5678');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [timer, setTimer] = useState(59);

  useEffect(() => {
    let interval: any;
    if (step === 'otp' && timer > 0) {
      interval = setInterval(() => setTimer((t) => t - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [step, timer]);

  if (!isAuthModalOpen) return null;

  const mockProfiles: UserProfile[] = [
    {
      id: '10000000-0000-0000-0000-000000000001',
      name: 'สมชาย เจ้าของห้อง',
      phone: '081-111-2222',
      email: 'somchai.owner@mapnest.io',
      role: 'owner',
      avatarUrl:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuDLG8GjFLGTr4aP_WHHb2s4C2whuNsmS1TRDYDxlYltAXE9cKqwM5Lb-F7cWZG-kUIJ2zKAOzRMGd2k3tWuMVm2r-6-xfV94e1FLurx-GFJm8WBYlfISMOE5Vsas5zL4x0vq5WwYtIocdpKdr8NV8eidcERgpj36ppZfAHI6wZWiW543dSiDzTZYlSg4YCKex-nK3nD8Twxqg3_YWXF-zLh5kBBchCBT7n8tAHJJ5g',
      isVerified: true,
      kycLevel: 2,
    },
    {
      id: '10000000-0000-0000-0000-000000000002',
      name: 'สมหญิง นายหน้ามือทอง',
      phone: '083-333-4444',
      email: 'somying.agent@mapnest.io',
      role: 'agent',
      avatarUrl:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuCYwILPVniQr0OJxcX-nLxnJkZ8yr4QmddEn-yev-RfXVFAISqRzLBtiVXD9SDEJQ10QUtCuCsyLWavJRWT6OEBaIbgZTaFyMg1fxQXzHKzdV3yksXmPNGOprxkSujVbCDaA8WOMNfPSN0Iwf5q3xw-dwDvbX_U6DmSyJhYhjq1mFbYz_ULRx-T9nF_lKUTbvYiHdB2Eumb8opLNKJkJvaU6WMvsIR8maBQ1a3GUTQ',
      isVerified: true,
      kycLevel: 2,
    },
    {
      id: '10000000-0000-0000-0000-000000000003',
      name: 'วิชัย ผู้ซื้อใจถึง',
      phone: '085-555-6666',
      email: 'wichai.buyer@mapnest.io',
      role: 'buyer',
      avatarUrl:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuDdR_PqzxHb2cfK6aLdUsXjGuKAiKUcfyRT8oGCHn6BpMU_pT2aEGqWjcRGssn8BPAIAEYqx5Pez2_y5w9IPBubjbpoginuQZ6kCWV_agGlPpsQ2jGmuiOpGXxoH2Da9kyG3C63S4cdmkdYvhSHmUEKiEvgjnhZ2UAbpuLYnQvoqCmH8z6valFu170os-fhWO9oEWJiVUVXL0a-qWT6ejpmuj2GVvQt3Q6hatnhWSg',
      isVerified: false,
      kycLevel: 1,
    },
  ];

  const handleOtpChange = (index: number, val: string) => {
    if (val.length > 1) val = val[val.length - 1];
    const newOtp = [...otp];
    newOtp[index] = val;
    setOtp(newOtp);

    // Auto advance
    if (val && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleVerifyOtp = () => {
    loginAs(mockProfiles[0]);
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#0F172A]/50 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-[460px] bg-surface-card rounded-2xl shadow-2xl p-6 sm:p-8 flex flex-col border border-border-subtle my-auto">
        {/* Close Button */}
        <button
          onClick={closeLoginModal}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-text-muted hover:text-on-surface transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* STEP 1: Login */}
        {step === 'login' && (
          <div className="space-y-6">
            <div className="text-center">
              <div className="w-12 h-12 rounded-xl bg-primary text-white flex items-center justify-center mx-auto mb-3 shadow-sm">
                <span className="material-symbols-outlined text-[26px]">home_pin</span>
              </div>
              <h2 className="text-2xl font-bold text-on-surface">เข้าสู่ระบบ / ลงทะเบียน</h2>
              <p className="text-xs text-text-muted mt-1">
                เริ่มต้นค้นหาและจัดการอสังหาริมทรัพย์ในอุดรธานี
              </p>
            </div>

            {/* Social Logins */}
            <div className="space-y-2.5">
              {/* LINE Login */}
              <button
                type="button"
                onClick={() => loginAs(mockProfiles[0])}
                className="w-full h-11 bg-[#06C755] hover:bg-[#05b34c] text-white font-semibold text-sm rounded-xl flex items-center justify-center gap-2.5 shadow-xs transition-all active:scale-[0.99]"
              >
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                  <path d="M19.365 9.863c.349 0 .63.285.63.631 0 .345-.281.63-.63.63H17.61v1.125h1.755c.349 0 .63.283.63.63 0 .344-.281.629-.63.629h-2.386c-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63h2.386c.346 0 .627.285.627.63 0 .349-.281.63-.63.63H17.61v1.125h1.755zm-3.855 3.016c0 .27-.174.51-.432.596-.064.021-.133.031-.199.031-.211 0-.391-.09-.51-.25l-2.443-3.317v2.31c0 .344-.279.63-.629.63-.346 0-.626-.286-.626-.63V8.108c0-.27.173-.51.431-.595.065-.023.132-.033.201-.033.211 0 .389.09.51.25l2.438 3.308v-2.3c0-.348.282-.631.629-.631.345 0 .63.283.63.631v4.771zm-5.741 0c0 .344-.282.63-.63.63-.346 0-.628-.286-.628-.63V8.108c0-.345.282-.63.628-.63.348 0 .63.285.63.63v4.771zm-2.466.63H4.918c-.347 0-.63-.286-.63-.63V8.108c0-.345.283-.63.63-.63.348 0 .63.285.63.63v4.141h1.756c.348 0 .629.283.629.63 0 .344-.281.629-.629.629M24 10.314C24 4.943 18.615.572 12 .572S0 4.943 0 10.314c0 4.811 4.27 8.842 10.035 9.608.391.082.923.258 1.058.59.12.301.079.766.038 1.08l-.164 1.02c-.045.301-.24 1.186 1.049.645 1.291-.539 6.916-4.078 9.436-6.975C23.176 14.393 24 12.458 24 10.314" />
                </svg>
                <span>เข้าสู่ระบบด้วย LINE</span>
              </button>

              {/* Google Login */}
              <button
                type="button"
                onClick={() => loginAs(mockProfiles[1])}
                className="w-full h-11 bg-white hover:bg-slate-50 text-slate-700 font-semibold text-sm rounded-xl border border-slate-300 flex items-center justify-center gap-2.5 shadow-2xs transition-all active:scale-[0.99]"
              >
                <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
                  <path
                    d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.66v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.15z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.26v3.15C3.25 21.36 7.33 24 12 24z"
                    fill="#34A853"
                  />
                  <path
                    d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.14-1.55.38-2.27V6.58H1.26C.46 8.16 0 9.99 0 12s.46 3.84 1.26 5.42l4.02-3.15z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.25 2.64 1.26 6.58l4.02 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                    fill="#EA4335"
                  />
                </svg>
                <span>เข้าสู่ระบบด้วย Google</span>
              </button>
            </div>

            {/* Divider */}
            <div className="flex items-center gap-3">
              <div className="flex-1 h-px bg-border-subtle"></div>
              <span className="text-[11px] text-text-muted uppercase">หรือเข้าสู่ระบบด้วยเบอร์โทร</span>
              <div className="flex-1 h-px bg-border-subtle"></div>
            </div>

            {/* Phone Number Form */}
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-on-surface mb-1">
                  เบอร์โทรศัพท์มือถือ
                </label>
                <div className="relative flex items-center">
                  <span className="absolute left-3 text-xs font-bold text-slate-500 border-r border-slate-200 pr-2">
                    +66
                  </span>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="81 234 5678"
                    className="w-full pl-16 pr-4 py-2.5 text-sm bg-surface-card border border-border-subtle rounded-xl focus:outline-none focus:border-primary transition-all font-mono"
                  />
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  setStep('otp');
                  setTimer(59);
                }}
                className="w-full py-2.5 bg-primary hover:bg-primary-hover text-white font-semibold text-sm rounded-xl shadow-xs transition-all"
              >
                ขอรหัสผ่าน OTP
              </button>
            </div>

            {/* Quick Demo Selector */}
            <div className="pt-3 border-t border-border-subtle">
              <span className="text-[11px] font-semibold text-text-muted block mb-2 text-center">
                🚀 คลิกเข้าสู่ระบบด่วนเพื่อทดสอบ:
              </span>
              <div className="grid grid-cols-3 gap-1.5">
                {mockProfiles.map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => loginAs(p)}
                    className="p-2 text-left bg-canvas-background hover:bg-primary-light border border-border-subtle rounded-xl transition-all group"
                  >
                    <span className="block text-[11px] font-bold text-on-surface group-hover:text-primary truncate">
                      {p.name.split(' ')[0]}
                    </span>
                    <span className="block text-[10px] text-text-muted capitalize">
                      {p.role === 'owner' ? 'เจ้าของ' : p.role === 'agent' ? 'นายหน้า' : 'ผู้ซื้อ'}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: S02 OTP Verification */}
        {step === 'otp' && (
          <div className="space-y-6">
            <div className="text-center">
              <div className="w-12 h-12 rounded-xl bg-primary-light text-primary flex items-center justify-center mx-auto mb-3">
                <KeyRound className="w-6 h-6" />
              </div>
              <h2 className="text-2xl font-bold text-on-surface">ยืนยันรหัส OTP</h2>
              <p className="text-xs text-text-muted mt-1">
                ระบบได้ส่งรหัส 6 หลักไปยังเบอร์ <span className="font-semibold text-on-surface">{phone}</span>
              </p>
            </div>

            {/* 6 Digit Inputs */}
            <div className="flex items-center justify-center gap-2">
              {otp.map((digit, idx) => (
                <input
                  key={idx}
                  id={`otp-${idx}`}
                  type="text"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleOtpChange(idx, e.target.value)}
                  className="w-11 h-12 text-center text-lg font-bold bg-canvas-background border-2 border-border-subtle focus:border-primary rounded-xl focus:outline-none transition-all"
                />
              ))}
            </div>

            <div className="text-center text-xs text-text-muted">
              {timer > 0 ? (
                <span>ขอรหัสใหม่ได้ในอีก {timer} วินาที</span>
              ) : (
                <button
                  type="button"
                  onClick={() => setTimer(59)}
                  className="text-primary font-bold hover:underline"
                >
                  ขอรหัส OTP ใหม่อีกครั้ง
                </button>
              )}
            </div>

            <div className="space-y-2">
              <button
                type="button"
                onClick={handleVerifyOtp}
                className="w-full py-2.5 bg-primary hover:bg-primary-hover text-white font-semibold text-sm rounded-xl shadow-xs transition-all"
              >
                ยืนยันและเข้าสู่ระบบ
              </button>
              <button
                type="button"
                onClick={() => setStep('login')}
                className="w-full py-2 text-text-muted hover:text-on-surface text-xs font-medium"
              >
                เปลี่ยนเบอร์โทรศัพท์
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
