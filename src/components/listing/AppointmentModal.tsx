'use client';

import React, { useState } from 'react';
import { X, Calendar, Clock, CheckCircle2, User, Phone, FileText } from 'lucide-react';
import { Listing } from '@/types/listing';

interface AppointmentModalProps {
  listing: Listing;
  isOpen: boolean;
  onClose: () => void;
}

export function AppointmentModal({ listing, isOpen, onClose }: AppointmentModalProps) {
  const [date, setDate] = useState('');
  const [timeSlot, setTimeSlot] = useState('14:00 - 15:00');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [note, setNote] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim() || !date) return;
    setIsSuccess(true);
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#0F172A]/50 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-[540px] bg-surface-card rounded-2xl shadow-2xl overflow-hidden my-auto border border-border-subtle">
        {/* Header */}
        <div className="p-6 bg-primary-light border-b border-border-subtle flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary text-white flex items-center justify-center shrink-0 shadow-sm">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-headline-md text-base sm:text-lg font-bold text-primary">
                ขอนัดหมายชมห้องจริง
              </h3>
              <p className="text-xs text-text-muted">
                {listing.title} · ดูแลโดย {listing.poster.name}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-text-muted hover:bg-surface-container transition-colors"
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
                  ส่งคำขอนัดหมายเรียบร้อยแล้ว!
                </h4>
                <p className="text-sm text-text-muted mt-2 max-w-sm mx-auto leading-relaxed">
                  {listing.poster.name} ({listing.poster.role === 'agent' ? 'นายหน้าผู้ดูแล' : 'เจ้าของทรัพย์'}) จะติดต่อกลับเพื่อยืนยันเวลานัดหมายตามเบอร์ {phone} ภายใน 15-30 นาที
                </p>
              </div>
              <div className="pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-6 py-2.5 bg-primary text-white font-medium rounded-xl hover:bg-primary-hover transition-colors"
                >
                  ตกลงและปิดหน้านี้
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-on-surface mb-1.5">
                    วันที่สะดวกเข้าชม <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    required
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full px-3 py-2.5 text-sm bg-surface-card border border-border-subtle rounded-xl focus:outline-none focus:border-primary transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-on-surface mb-1.5">
                    ช่วงเวลาที่สะดวก
                  </label>
                  <select
                    value={timeSlot}
                    onChange={(e) => setTimeSlot(e.target.value)}
                    className="w-full px-3 py-2.5 text-sm bg-surface-card border border-border-subtle rounded-xl focus:outline-none focus:border-primary transition-all"
                  >
                    <option value="10:00 - 11:30">ช่วงสาย (10:00 - 11:30)</option>
                    <option value="13:30 - 15:00">ช่วงบ่าย (13:30 - 15:00)</option>
                    <option value="16:00 - 17:30">ช่วงเย็น (16:00 - 17:30)</option>
                    <option value="เสาร์-อาทิตย์ ทั้งวัน">วันเสาร์-อาทิตย์</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-on-surface mb-1.5">
                  ชื่อผู้ขอนัดหมาย <span className="text-red-500">*</span>
                </label>
                <div className="relative flex items-center">
                  <User className="w-4 h-4 text-text-muted absolute left-3" />
                  <input
                    type="text"
                    required
                    placeholder="เช่น คุณวิชัย ชัยมงคล"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 text-sm bg-surface-card border border-border-subtle rounded-xl focus:outline-none focus:border-primary transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-on-surface mb-1.5">
                  เบอร์โทรศัพท์ติดต่อ <span className="text-red-500">*</span>
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
                  ข้อความเพิ่มเติมถึงผู้ดูแล
                </label>
                <div className="relative flex items-center">
                  <FileText className="w-4 h-4 text-text-muted absolute left-3 top-3" />
                  <textarea
                    rows={2}
                    placeholder="เช่น ต้องการดูพื้นที่จอดรถและฟิตเนสส่วนกลางด้วย"
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 text-sm bg-surface-card border border-border-subtle rounded-xl focus:outline-none focus:border-primary transition-all resize-none"
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3 bg-primary hover:bg-primary-hover text-white font-medium rounded-xl shadow-sm transition-all flex items-center justify-center gap-2"
                >
                  <Clock className="w-4 h-4" />
                  <span>ยืนยันการขอนัดหมายชมสถานที่จริง</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
