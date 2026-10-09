'use client';

import React, { useState, useEffect } from 'react';
import { X, Clock, CheckCircle2, ShieldCheck, User, Phone, MessageSquare } from 'lucide-react';
import { Listing } from '@/types/listing';
import { useAuth } from '@/context/AuthContext';

interface WaitlistModalProps {
  listing: Listing;
  isOpen: boolean;
  onClose: () => void;
}

export function WaitlistModal({ listing, isOpen, onClose }: WaitlistModalProps) {
  const { user } = useAuth();
  const [name, setName] = useState(user?.name ?? '');
  const [phone, setPhone] = useState(user?.phone ?? '');
  const [lineId, setLineId] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    if (user) {
      if (!name) setName(user.name);
      if (!phone) setPhone(user.phone);
    }
  }, [user]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) return;
    setIsSuccess(true);
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#0F172A]/50 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-[540px] bg-surface-card rounded-2xl shadow-2xl overflow-hidden my-auto border border-border-subtle">
        {/* Header */}
        <div className="p-6 bg-amber-50 border-b border-amber-100 flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-sm">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-headline-md text-base sm:text-lg font-bold text-amber-950">
                ลงทะเบียนต่อคิวทรัพย์ติดจอง
              </h3>
              <p className="text-xs text-amber-800">
                รหัสทรัพย์: {listing.code} ({listing.title})
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-amber-700 hover:bg-amber-200/50 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {isSuccess ? (
            <div className="text-center py-6 space-y-4">
              <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <div>
                <h4 className="font-headline-md text-lg font-bold text-on-surface">
                  ต่อคิวสำเร็จ! คุณได้รับคิวลำดับที่ 1
                </h4>
                <p className="text-sm text-text-muted mt-2 max-w-sm mx-auto leading-relaxed">
                  หากสัญญาจะซื้อจะขายเดิมหมดอายุ หรือผู้จองเดิมไม่ผ่านอนุมัติสินเชื่อภายในกำหนด ระบบจะส่งข้อความแจ้งเตือนคุณผ่าน SMS และ LINE ทันที
                </p>
              </div>
              <div className="pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-6 py-2.5 bg-primary text-white font-medium rounded-xl hover:bg-primary-hover transition-colors"
                >
                  รับทราบและปิดหน้านี้
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="p-3.5 bg-canvas-background rounded-xl text-xs text-text-muted leading-relaxed border border-border-subtle flex items-start gap-2.5">
                <ShieldCheck className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                <span>
                  <strong>กติกา Waitlist โปร่งใส:</strong> หากผู้จองปัจจุบันสละสิทธิ์ ระบบจะมอบสิทธิ์ให้ผู้ลงทะเบียนตามลำดับเวลา โดยไม่มีการแซงคิวหรือค่าธรรมเนียม
                </span>
              </div>

              <div>
                <label className="block text-xs font-semibold text-on-surface mb-1.5">
                  ชื่อ - นามสกุล <span className="text-red-500">*</span>
                </label>
                <div className="relative flex items-center">
                  <User className="w-4 h-4 text-text-muted absolute left-3" />
                  <input
                    type="text"
                    required
                    placeholder="เช่น สมศักดิ์ มีสุข"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 text-sm bg-surface-card border border-border-subtle rounded-xl focus:outline-none focus:border-primary transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-on-surface mb-1.5">
                  เบอร์โทรศัพท์ (สำหรับรับ SMS ด่วน) <span className="text-red-500">*</span>
                </label>
                <div className="relative flex items-center">
                  <Phone className="w-4 h-4 text-text-muted absolute left-3" />
                  <input
                    type="tel"
                    required
                    placeholder="08x-xxx-xxxx"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 text-sm bg-surface-card border border-border-subtle rounded-xl focus:outline-none focus:border-primary transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-on-surface mb-1.5">
                  LINE ID (ถ้ามี)
                </label>
                <div className="relative flex items-center">
                  <MessageSquare className="w-4 h-4 text-text-muted absolute left-3" />
                  <input
                    type="text"
                    placeholder="LINE ID เพื่อรับการแจ้งเตือนสด"
                    value={lineId}
                    onChange={(e) => setLineId(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 text-sm bg-surface-card border border-border-subtle rounded-xl focus:outline-none focus:border-primary transition-all"
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3 bg-amber-500 hover:bg-amber-600 text-white font-medium rounded-xl shadow-sm transition-all flex items-center justify-center gap-2"
                >
                  <Clock className="w-4 h-4" />
                  <span>ยืนยันการต่อคิว (Waitlist)</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
