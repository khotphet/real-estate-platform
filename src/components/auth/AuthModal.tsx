'use client';

import React, { useEffect, useState } from 'react';
import { X, KeyRound } from 'lucide-react';
import { useAuth, TEST_USERS, TEST_OTP, ROLE_META, findUserByPhone, UserProfile, UserRole } from '@/context/AuthContext';

const ROLE_BADGE: Record<UserRole, string> = {
  owner: 'bg-teal-100 text-teal-800',
  agent: 'bg-blue-100 text-blue-800',
  buyer: 'bg-amber-100 text-amber-800',
  admin: 'bg-slate-800 text-white',
};

export function AuthModal() {
  const { isAuthModalOpen, closeLoginModal, loginAs } = useAuth();
  const [step, setStep] = useState<'login' | 'otp'>('login');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [timer, setTimer] = useState(59);
  const [matchedUser, setMatchedUser] = useState<UserProfile | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    if (step !== 'otp' || timer <= 0) return;
    const t = setTimeout(() => setTimer((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [step, timer]);

  if (!isAuthModalOpen) return null;

  const reset = () => {
    setStep('login');
    setPhone('');
    setOtp(['', '', '', '', '', '']);
    setMatchedUser(null);
    setError('');
  };

  const close = () => {
    reset();
    closeLoginModal();
  };

  const handlePhoneSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const found = findUserByPhone(phone);
    if (!found) {
      setError('ไม่พบบัญชีที่ใช้เบอร์นี้ (ช่วงทดสอบใช้ได้เฉพาะ 4 บัญชีทดสอบด้านล่าง)');
      return;
    }
    setError('');
    setMatchedUser(found);
    setOtp(['', '', '', '', '', '']);
    setTimer(59);
    setStep('otp');
  };

  const handleOtpChange = (index: number, raw: string) => {
    const val = raw.replace(/\D/g, '').slice(-1);
    const next = [...otp];
    next[index] = val;
    setOtp(next);
    setError('');
    if (val && index < 5) document.getElementById(`otp-${index + 1}`)?.focus();
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      document.getElementById(`otp-${index - 1}`)?.focus();
    }
  };

  const handleVerifyOtp = () => {
    if (!matchedUser) return;
    const code = otp.join('');
    if (code.length < 6) {
      setError('กรุณากรอกรหัส OTP ให้ครบ 6 หลัก');
      return;
    }
    if (code !== TEST_OTP) {
      setError('รหัส OTP ไม่ถูกต้อง');
      return;
    }
    loginAs(matchedUser);
    reset();
  };

  const handleQuickLogin = (profile: UserProfile) => {
    loginAs(profile);
    reset();
  };

  return (
    <div className="fixed inset-0 z-[60] bg-[#0F172A]/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="relative w-full max-w-[520px] bg-surface rounded-3xl shadow-2xl p-6 sm:p-8 flex flex-col border border-border my-auto">
        <button
          type="button"
          onClick={close}
          aria-label="ปิด"
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-muted hover:text-foreground transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {step === 'login' && (
          <div className="space-y-6">
            <div className="text-center">
              <div className="w-12 h-12 rounded-2xl bg-primary text-white flex items-center justify-center mx-auto mb-3 shadow-sm">
                <span className="material-symbols-outlined text-[26px]">home_pin</span>
              </div>
              <h2 className="text-2xl font-black text-foreground">เข้าสู่ระบบ</h2>
              <p className="text-xs text-muted mt-1">กรอกเบอร์โทรเพื่อรับ OTP หรือเลือกบัญชีทดสอบด้านล่าง</p>
            </div>

            <form onSubmit={handlePhoneSubmit} className="space-y-3">
              <label htmlFor="login-phone" className="block text-xs font-bold text-foreground">
                เบอร์โทรศัพท์มือถือ
              </label>
              <div className="flex gap-2">
                <div className="px-3.5 py-2.5 bg-background border border-border rounded-xl text-xs font-bold text-foreground flex items-center">
                  +66
                </div>
                <input
                  id="login-phone"
                  type="tel"
                  value={phone}
                  onChange={(e) => {
                    setPhone(e.target.value);
                    setError('');
                  }}
                  placeholder="08X-XXX-XXXX"
                  className="flex-1 px-3.5 py-2.5 bg-background border border-border rounded-xl text-sm font-semibold focus:border-primary focus:outline-none"
                  required
                />
              </div>
              {error && <p className="text-xs font-semibold text-status-sold">{error}</p>}
              <button
                type="submit"
                className="w-full py-2.5 bg-primary hover:bg-primary/90 text-white font-bold text-sm rounded-xl transition-all shadow-xs cursor-pointer"
              >
                ส่งรหัส OTP
              </button>
            </form>

            <div className="pt-4 border-t border-border">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-foreground">บัญชีทดสอบ</span>
                <span className="text-[11px] text-muted">คลิกเพื่อเข้าสู่ระบบทันที</span>
              </div>
              <div className="space-y-2">
                {Object.values(TEST_USERS).map((u) => (
                  <button
                    key={u.id}
                    type="button"
                    onClick={() => handleQuickLogin(u)}
                    className="w-full p-3 bg-slate-50 hover:bg-teal-50 border border-border hover:border-primary rounded-2xl flex items-center justify-between gap-3 cursor-pointer transition-all group text-left"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <img src={u.avatarUrl} alt="" className="w-10 h-10 rounded-xl object-cover border border-border shrink-0" />
                      <div className="min-w-0">
                        <div className="text-xs font-bold text-foreground group-hover:text-primary flex items-center gap-1.5 flex-wrap">
                          <span>{u.name}</span>
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${ROLE_BADGE[u.role]}`}>
                            {ROLE_META[u.role].short}
                          </span>
                        </div>
                        <div className="text-[11px] text-muted">
                          เบอร์ <span className="font-mono text-foreground">{u.phone}</span> · OTP {TEST_OTP}
                        </div>
                      </div>
                    </div>
                    <span className="material-symbols-outlined text-[18px] text-primary shrink-0">login</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {step === 'otp' && matchedUser && (
          <div className="space-y-6">
            <div className="text-center">
              <div className="w-12 h-12 rounded-2xl bg-teal-50 text-primary flex items-center justify-center mx-auto mb-3">
                <KeyRound className="w-6 h-6" />
              </div>
              <h2 className="text-2xl font-bold text-foreground">ยืนยันรหัส OTP</h2>
              <p className="text-xs text-muted mt-1">
                ส่งรหัส 6 หลักไปที่ <span className="font-semibold text-foreground">{matchedUser.phone}</span>
              </p>
              <div className="mt-2 inline-block px-3 py-1 bg-amber-50 border border-amber-200 rounded-lg text-xs font-bold text-amber-800">
                โหมดทดสอบ: OTP คือ <span className="font-mono">{TEST_OTP}</span>
              </div>
            </div>

            <div className="flex items-center justify-center gap-2">
              {otp.map((digit, idx) => (
                <input
                  key={idx}
                  id={`otp-${idx}`}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  autoFocus={idx === 0}
                  onChange={(e) => handleOtpChange(idx, e.target.value)}
                  onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                  aria-label={`OTP หลักที่ ${idx + 1}`}
                  className="w-11 h-12 text-center text-lg font-bold bg-background border-2 border-border focus:border-primary rounded-xl focus:outline-none transition-all"
                />
              ))}
            </div>
            {error && <p className="text-center text-xs font-semibold text-status-sold">{error}</p>}

            <div className="text-center text-xs text-muted">
              {timer > 0 ? (
                <span>ขอรหัสใหม่ได้ในอีก {timer} วินาที</span>
              ) : (
                <button type="button" onClick={() => setTimer(59)} className="text-primary font-bold hover:underline cursor-pointer">
                  ขอรหัส OTP ใหม่
                </button>
              )}
            </div>

            <div className="space-y-2">
              <button
                type="button"
                onClick={handleVerifyOtp}
                className="w-full py-2.5 bg-primary hover:bg-primary/90 text-white font-bold text-sm rounded-xl shadow-xs transition-all cursor-pointer"
              >
                ยืนยันและเข้าสู่ระบบ
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
