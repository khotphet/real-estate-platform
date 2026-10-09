'use client';

import React, { useState, useEffect } from 'react';
import { X, KeyRound, Home, Briefcase, Search, ShieldCheck } from 'lucide-react';
import { useAuth, TEST_USERS, UserProfile } from '@/context/AuthContext';

export function AuthModal() {
  const { isAuthModalOpen, closeLoginModal, loginAs, switchRole } = useAuth();
  const [step, setStep] = useState<'login' | 'otp' | 'role'>('login');
  const [phone, setPhone] = useState('081-111-2222');
  const [otp, setOtp] = useState(['1', '2', '3', '4', '5', '6']);
  const [timer, setTimer] = useState(59);
  const [matchedUser, setMatchedUser] = useState<UserProfile>(TEST_USERS.owner);

  useEffect(() => {
    let interval: any;
    if (step === 'otp' && timer > 0) {
      interval = setInterval(() => setTimer((t) => t - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [step, timer]);

  if (!isAuthModalOpen) return null;

  // Find user by phone or normalize
  const handlePhoneSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = phone.replace(/[^0-9]/g, '');
    const found = Object.values(TEST_USERS).find(
      (u) => u.phone.replace(/[^0-9]/g, '') === clean
    );
    if (found) {
      setMatchedUser(found);
    } else {
      setMatchedUser({
        id: 'new-user',
        name: `ผู้ใช้ (${phone})`,
        phone: phone,
        role: 'buyer',
        roleLabel: 'ผู้ซื้อ / ผู้เช่า (Buyer)',
        isVerified: true,
        kycLevel: 1,
      });
    }
    setStep('otp');
  };

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
    loginAs(matchedUser);
    closeLoginModal();
    setStep('login');
  };

  const handleQuickLogin = (userKey: string) => {
    const profile = TEST_USERS[userKey];
    if (profile) {
      loginAs(profile);
      closeLoginModal();
      setStep('login');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#0F172A]/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-[520px] bg-surface rounded-3xl shadow-2xl p-6 sm:p-8 flex flex-col border border-border my-auto">
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
              <h2 className="text-2xl font-black text-foreground">เข้าสู่ระบบ / ลงทะเบียน</h2>
              <p className="text-xs text-muted mt-1">
                กรอกเบอร์โทรเพื่อรับ OTP หรือคลิกเลือกบัญชีทดสอบด้านล่างได้ทันที
              </p>
            </div>

            {/* Phone Input Form */}
            <form onSubmit={handlePhoneSubmit} className="space-y-3">
              <label className="block text-xs font-bold text-foreground">
                เบอร์โทรศัพท์มือถือ (10 หลัก)
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
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-primary hover:bg-primary/90 text-white font-bold text-sm rounded-xl transition-all shadow-xs cursor-pointer"
              >
                ส่งรหัส OTP (ฟรี)
              </button>
            </form>

            {/* 4 Seeded Test Accounts Section */}
            <div className="pt-4 border-t border-border">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-foreground">
                  เลือกบัญชีผู้ใช้ทดสอบ (Seeded Test Accounts):
                </span>
                <span className="text-[11px] text-primary font-semibold">คลิกเพื่อเข้าสู่ระบบ</span>
              </div>

              <div className="space-y-2">
                {/* 1. Owner */}
                <div
                  onClick={() => handleQuickLogin('owner')}
                  className="p-3 bg-slate-50 hover:bg-teal-50 border border-border hover:border-primary rounded-2xl flex items-center justify-between gap-3 cursor-pointer transition-all group"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={TEST_USERS.owner.avatarUrl}
                      alt=""
                      className="w-10 h-10 rounded-xl object-cover border border-border"
                    />
                    <div>
                      <div className="text-xs font-bold text-foreground group-hover:text-primary flex items-center gap-1.5">
                        <span>{TEST_USERS.owner.name}</span>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-teal-100 text-teal-800">
                          เจ้าของทรัพย์
                        </span>
                      </div>
                      <div className="text-[11px] text-muted">
                        เบอร์: <span className="font-mono text-foreground">{TEST_USERS.owner.phone}</span> • OTP: 123456
                      </div>
                    </div>
                  </div>
                  <span className="material-symbols-outlined text-[18px] text-primary group-hover:translate-x-1 transition-transform">
                    login
                  </span>
                </div>

                {/* 2. Agent */}
                <div
                  onClick={() => handleQuickLogin('agent')}
                  className="p-3 bg-slate-50 hover:bg-teal-50 border border-border hover:border-primary rounded-2xl flex items-center justify-between gap-3 cursor-pointer transition-all group"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={TEST_USERS.agent.avatarUrl}
                      alt=""
                      className="w-10 h-10 rounded-xl object-cover border border-border"
                    />
                    <div>
                      <div className="text-xs font-bold text-foreground group-hover:text-primary flex items-center gap-1.5">
                        <span>{TEST_USERS.agent.name}</span>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800">
                          Verified Agent Pro
                        </span>
                      </div>
                      <div className="text-[11px] text-muted">
                        เบอร์: <span className="font-mono text-foreground">{TEST_USERS.agent.phone}</span> • OTP: 123456
                      </div>
                    </div>
                  </div>
                  <span className="material-symbols-outlined text-[18px] text-primary group-hover:translate-x-1 transition-transform">
                    login
                  </span>
                </div>

                {/* 3. Buyer */}
                <div
                  onClick={() => handleQuickLogin('buyer')}
                  className="p-3 bg-slate-50 hover:bg-teal-50 border border-border hover:border-primary rounded-2xl flex items-center justify-between gap-3 cursor-pointer transition-all group"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={TEST_USERS.buyer.avatarUrl}
                      alt=""
                      className="w-10 h-10 rounded-xl object-cover border border-border"
                    />
                    <div>
                      <div className="text-xs font-bold text-foreground group-hover:text-primary flex items-center gap-1.5">
                        <span>{TEST_USERS.buyer.name}</span>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">
                          ผู้ซื้อ / ผู้เช่า
                        </span>
                      </div>
                      <div className="text-[11px] text-muted">
                        เบอร์: <span className="font-mono text-foreground">{TEST_USERS.buyer.phone}</span> • OTP: 123456
                      </div>
                    </div>
                  </div>
                  <span className="material-symbols-outlined text-[18px] text-primary group-hover:translate-x-1 transition-transform">
                    login
                  </span>
                </div>

                {/* 4. Admin */}
                <div
                  onClick={() => handleQuickLogin('admin')}
                  className="p-3 bg-slate-50 hover:bg-teal-50 border border-border hover:border-primary rounded-2xl flex items-center justify-between gap-3 cursor-pointer transition-all group"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={TEST_USERS.admin.avatarUrl}
                      alt=""
                      className="w-10 h-10 rounded-xl object-cover border border-border"
                    />
                    <div>
                      <div className="text-xs font-bold text-foreground group-hover:text-primary flex items-center gap-1.5">
                        <span>{TEST_USERS.admin.name}</span>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-100 text-purple-800">
                          Admin Ops
                        </span>
                      </div>
                      <div className="text-[11px] text-muted">
                        เบอร์: <span className="font-mono text-foreground">{TEST_USERS.admin.phone}</span> • OTP: 123456
                      </div>
                    </div>
                  </div>
                  <span className="material-symbols-outlined text-[18px] text-primary group-hover:translate-x-1 transition-transform">
                    login
                  </span>
                </div>
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
              <div className="mt-2 inline-block px-3 py-1 bg-amber-50 border border-amber-200 rounded-lg text-xs font-bold text-amber-800">
                🔑 รหัส OTP ทดสอบ: <span className="font-mono text-primary text-sm">123456</span>
              </div>
            </div>

            {/* Matched User Preview */}
            <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl flex items-center gap-3">
              {matchedUser.avatarUrl && (
                <img
                  src={matchedUser.avatarUrl}
                  alt=""
                  className="w-9 h-9 rounded-lg object-cover"
                />
              )}
              <div className="text-left">
                <div className="text-xs font-bold text-foreground">{matchedUser.name}</div>
                <div className="text-[11px] text-muted">{matchedUser.roleLabel}</div>
              </div>
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
                เข้าสู่ระบบในฐานะ {matchedUser.name}
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
      </div>
    </div>
  );
}
