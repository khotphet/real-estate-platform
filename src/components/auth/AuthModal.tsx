'use client';

import React, { useState, useEffect } from 'react';
import { X, KeyRound, User, Home, Briefcase, Search, CheckCircle2 } from 'lucide-react';
import { useAuth, USER_PROFILES_BY_ROLE } from '@/context/AuthContext';

export function AuthModal() {
  const { isAuthModalOpen, closeLoginModal, loginAs, switchRole } = useAuth();
  const [step, setStep] = useState<'login' | 'otp' | 'role'>('login');
  const [phone, setPhone] = useState('081-234-5678');
  const [otp, setOtp] = useState(['1', '2', '3', '4', '5', '6']);
  const [timer, setTimer] = useState(59);

  useEffect(() => {
    let interval: any;
    if (step === 'otp' && timer > 0) {
      interval = setInterval(() => setTimer((t) => t - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [step, timer]);

  if (!isAuthModalOpen) return null;

  const handleOtpChange = (index: number, val: string) => {
    if (val.length > 1) val = val[val.length - 1];
    const newOtp = [...otp];
    newOtp[index] = val;
    setOtp(newOtp);

    if (val && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleVerifyOtp = () => {
    // Advance to S03 Role Selection step!
    setStep('role');
  };

  const handleSelectRole = (role: 'owner' | 'agent' | 'buyer') => {
    switchRole(role);
    closeLoginModal();
    setStep('login');
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#0F172A]/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-[500px] bg-surface rounded-3xl shadow-2xl p-6 sm:p-8 flex flex-col border border-border my-auto">
        {/* Close Button */}
        <button
          type="button"
          onClick={closeLoginModal}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-muted hover:text-foreground transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* STEP 1: S01 Login */}
        {step === 'login' && (
          <div className="space-y-6">
            <div className="text-center">
              <div className="w-12 h-12 rounded-2xl bg-primary text-white flex items-center justify-center mx-auto mb-3 shadow-sm">
                <span className="material-symbols-outlined text-[26px]">home_pin</span>
              </div>
              <h2 className="text-2xl font-bold text-foreground">เข้าสู่ระบบ / ลงทะเบียน</h2>
              <p className="text-xs text-muted mt-1">
                เริ่มต้นค้นหาและจัดการอสังหาริมทรัพย์ในอุดรธานี
              </p>
            </div>

            {/* Phone Input */}
            <div className="space-y-3">
              <label className="block text-xs font-bold text-foreground">
                เบอร์โทรศัพท์มือถือ (รับรหัส OTP)
              </label>
              <div className="flex gap-2">
                <div className="px-3.5 py-2.5 bg-background border border-border rounded-xl text-xs font-bold text-foreground flex items-center">
                  +66 (TH)
                </div>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="08X-XXX-XXXX"
                  className="flex-1 px-3.5 py-2.5 bg-background border border-border rounded-xl text-sm font-semibold focus:border-primary focus:outline-none"
                />
              </div>

              <button
                type="button"
                onClick={() => setStep('otp')}
                className="w-full py-2.5 bg-primary hover:bg-primary/90 text-white font-bold text-sm rounded-xl transition-all shadow-xs cursor-pointer"
              >
                ส่งรหัส OTP (ฟรี)
              </button>
            </div>

            {/* Quick Demo Selector */}
            <div className="pt-4 border-t border-border">
              <div className="text-center text-[11px] font-bold text-muted uppercase tracking-wider mb-2">
                หรือเลือกทดสอบบทบาททันที (S03 Quick Switch):
              </div>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'owner', label: 'คุณสมชาย', sub: 'เจ้าของทรัพย์', icon: 'home' },
                  { id: 'agent', label: 'คุณสมหญิง', sub: 'นายหน้า Pro', icon: 'badge' },
                  { id: 'buyer', label: 'คุณวิชัย', sub: 'ผู้ซื้อ/ผู้เช่า', icon: 'search' },
                ].map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => handleSelectRole(p.id as any)}
                    className="p-2.5 bg-slate-50 hover:bg-teal-50 hover:border-primary border border-border rounded-xl text-center transition-all cursor-pointer group"
                  >
                    <span className="material-symbols-outlined text-[18px] text-primary block mb-0.5">
                      {p.icon}
                    </span>
                    <span className="block text-xs font-bold text-foreground group-hover:text-primary">
                      {p.label}
                    </span>
                    <span className="block text-[10px] text-muted">{p.sub}</span>
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
              <div className="w-12 h-12 rounded-2xl bg-teal-50 text-primary flex items-center justify-center mx-auto mb-3">
                <KeyRound className="w-6 h-6" />
              </div>
              <h2 className="text-2xl font-bold text-foreground">ยืนยันรหัส OTP (S02)</h2>
              <p className="text-xs text-muted mt-1">
                ระบบได้ส่งรหัส 6 หลักไปยังเบอร์ <span className="font-semibold text-foreground">{phone}</span>
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
                  className="w-11 h-12 text-center text-lg font-bold bg-background border-2 border-border focus:border-primary rounded-xl focus:outline-none transition-all"
                />
              ))}
            </div>

            <div className="text-center text-xs text-muted">
              {timer > 0 ? (
                <span>ขอรหัสใหม่ได้ในอีก {timer} วินาที</span>
              ) : (
                <button
                  type="button"
                  onClick={() => setTimer(59)}
                  className="text-primary font-bold hover:underline cursor-pointer"
                >
                  ขอรหัส OTP ใหม่อีกครั้ง
                </button>
              )}
            </div>

            <div className="space-y-2">
              <button
                type="button"
                onClick={handleVerifyOtp}
                className="w-full py-2.5 bg-primary hover:bg-primary/90 text-white font-bold text-sm rounded-xl shadow-xs transition-all cursor-pointer"
              >
                ยืนยันรหัส OTP และเลือกบทบาท
              </button>
              <button
                type="button"
                onClick={() => setStep('login')}
                className="w-full py-2 text-muted hover:text-foreground text-xs font-semibold cursor-pointer"
              >
                เปลี่ยนเบอร์โทรศัพท์
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: S03 Role Selection */}
        {step === 'role' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="text-center">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-teal-50 text-teal-800 border border-teal-200 mb-2 inline-block">
                S03 Role Selection
              </span>
              <h2 className="text-2xl font-black text-foreground">เลือกบทบาทของคุณใน MapNest</h2>
              <p className="text-xs text-muted mt-1">
                เลือกบทบาทที่ตรงกับเป้าหมายของคุณมากที่สุด (สามารถสลับเปลี่ยนได้ตลอดเวลา)
              </p>
            </div>

            <div className="space-y-3">
              {/* Option 1: Owner */}
              <div
                onClick={() => handleSelectRole('owner')}
                className="p-4 rounded-2xl border-2 border-border hover:border-primary hover:bg-teal-50/50 transition-all cursor-pointer group flex items-start gap-4"
              >
                <div className="w-11 h-11 rounded-xl bg-teal-100 text-teal-800 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                  <Home className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold text-foreground group-hover:text-primary">
                      เจ้าของทรัพย์ (Property Owner)
                    </h3>
                    <span className="text-[11px] font-semibold text-primary">เลือกบทบาทนี้ →</span>
                  </div>
                  <p className="text-xs text-muted mt-1 leading-relaxed">
                    ต้องการลงประกาศขายหรือให้เช่าบ้าน คอนโด ที่ดิน จัดการสถานะ และรับการติดต่อโดยตรงจากผู้สนใจ
                  </p>
                </div>
              </div>

              {/* Option 2: Agent */}
              <div
                onClick={() => handleSelectRole('agent')}
                className="p-4 rounded-2xl border-2 border-border hover:border-primary hover:bg-teal-50/50 transition-all cursor-pointer group flex items-start gap-4"
              >
                <div className="w-11 h-11 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                  <Briefcase className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold text-foreground group-hover:text-primary">
                      นายหน้าอสังหาริมทรัพย์ (Real Estate Agent)
                    </h3>
                    <span className="text-[11px] font-semibold text-primary">เลือกบทบาทนี้ →</span>
                  </div>
                  <p className="text-xs text-muted mt-1 leading-relaxed">
                    เข้าถึง Co-Broker Hub 50/50, รับข้อเสนอลูกค้าจากกระดานความต้องการ, และสร้างโปรไฟล์มืออาชีพ
                  </p>
                </div>
              </div>

              {/* Option 3: Buyer */}
              <div
                onClick={() => handleSelectRole('buyer')}
                className="p-4 rounded-2xl border-2 border-border hover:border-primary hover:bg-teal-50/50 transition-all cursor-pointer group flex items-start gap-4"
              >
                <div className="w-11 h-11 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                  <Search className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold text-foreground group-hover:text-primary">
                      ผู้ซื้อ / ผู้เช่า (Buyer / Tenant)
                    </h3>
                    <span className="text-[11px] font-semibold text-primary">เลือกบทบาทนี้ →</span>
                  </div>
                  <p className="text-xs text-muted mt-1 leading-relaxed">
                    ค้นหาบ้านบนแผนที่อุดรธานี, เปรียบเทียบสเปก, จองคิวสำรอง, และปักหมุดบอกความต้องการ
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
