'use client';

import React, { useState, useEffect } from 'react';
import { X, Flag, CheckCircle2, AlertTriangle, Send, ShieldAlert } from 'lucide-react';
import { Listing } from '@/types/listing';
import { useAuth } from '@/context/AuthContext';

interface ReportListingModalProps {
  listing: Listing;
  isOpen: boolean;
  onClose: () => void;
}

const REPORT_REASONS = [
  { id: 'price', label: 'ราคาไม่ตรงกับความเป็นจริง หรือแอบแฝงค่าใช้จ่าย' },
  { id: 'sold', label: 'ทรัพย์นี้ขายหรือให้เช่าไปแล้ว (ควรปรับสถานะ)' },
  { id: 'deed', label: 'ข้อมูลโฉนด พิกัด ขนาดพื้นที่ หรือรูปภาพไม่ตรงกับหน้างาน' },
  { id: 'fraud', label: 'ต้องสงสัยว่าเป็นมิจฉาชีพ หลอกลวง หรือเรียกเก็บเงินนอกระบบ' },
  { id: 'duplicate', label: 'ประกาศซ้ำซ้อนกับรายการอื่นในระบบ' },
  { id: 'other', label: 'เหตุผลอื่นๆ' },
];

export function ReportListingModal({ listing, isOpen, onClose }: ReportListingModalProps) {
  const { user } = useAuth();
  const [selectedReason, setSelectedReason] = useState('price');
  const [description, setDescription] = useState('');
  const [reporterContact, setReporterContact] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    if (user && !reporterContact) {
      setReporterContact(`${user.name} (${user.phone})`);
    }
  }, [user, reporterContact]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
    }, 600);
  };

  const handleResetAndClose = () => {
    setIsSuccess(false);
    setDescription('');
    setSelectedReason('price');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#0F172A]/50 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-[540px] bg-surface-card rounded-2xl shadow-2xl overflow-hidden my-auto border border-border-subtle">
        {/* Header */}
        <div className="p-6 bg-red-50/70 border-b border-red-100 flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-red-600 text-white flex items-center justify-center shrink-0 shadow-sm">
              <Flag className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-headline-md text-base sm:text-lg font-bold text-red-950">
                แจ้งรายงานทรัพย์ไม่ถูกต้อง
              </h3>
              <p className="text-xs text-red-800">
                รหัสทรัพย์: {listing.code} · {listing.title}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleResetAndClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-red-700 hover:bg-red-100 transition-colors cursor-pointer"
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
                  ส่งรายงานให้ทีมงานตรวจสอบแล้ว
                </h4>
                <p className="text-sm text-text-muted mt-2 max-w-sm mx-auto leading-relaxed">
                  ทีมงาน MapNest จะตรวจสอบข้อเท็จจริงของประกาศรหัส{' '}
                  <strong className="text-on-surface">{listing.code}</strong> ภายใน 24 ชม.
                  และระงับประกาศหากพบการฝ่าฝืน ขอบคุณที่ช่วยรักษามาตรฐานชุมชน
                </p>
              </div>
              <div className="pt-2">
                <button
                  type="button"
                  onClick={handleResetAndClose}
                  className="px-6 py-2.5 bg-primary text-white font-medium rounded-xl hover:bg-primary-hover transition-colors cursor-pointer"
                >
                  ตกลงและปิดหน้านี้
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="p-3 bg-amber-50/80 border border-amber-200/60 rounded-xl flex items-start gap-2.5 text-xs text-amber-900 leading-tight">
                <ShieldAlert className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                <span>
                  รายงานของคุณจะถูกส่งตรงไปยังทีมงานตรวจสอบของ MapNest อุดรธานี โดยผู้ลงประกาศจะไม่ทราบตัวตนของผู้แจ้ง
                </span>
              </div>

              <div>
                <label className="block text-xs font-semibold text-on-surface mb-2">
                  สาเหตุที่รายงาน <span className="text-red-500">*</span>
                </label>
                <div className="space-y-2">
                  {REPORT_REASONS.map((reason) => (
                    <label
                      key={reason.id}
                      className={`flex items-center gap-3 p-3 rounded-xl border text-xs sm:text-sm font-medium cursor-pointer transition-all ${
                        selectedReason === reason.id
                          ? 'border-red-500 bg-red-50/40 text-red-950 font-semibold'
                          : 'border-border-subtle hover:bg-surface-container-low text-on-surface'
                      }`}
                    >
                      <input
                        type="radio"
                        name="reportReason"
                        value={reason.id}
                        checked={selectedReason === reason.id}
                        onChange={() => setSelectedReason(reason.id)}
                        className="text-red-600 focus:ring-red-500"
                      />
                      <span>{reason.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-on-surface mb-1.5">
                  รายละเอียดเพิ่มเติม (ถ้ามี)
                </label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="เช่น ราคาหน้างานแจ้ง 1.8 ล้านบาท แต่ในเว็บลง 1.45 ล้าน หรือเจ้าของแจ้งว่าขายไปแล้วเมื่อเดือนก่อน..."
                  className="w-full px-3 py-2 text-xs sm:text-sm bg-surface-card border border-border-subtle rounded-xl focus:outline-none focus:border-red-500 transition-all resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-on-surface mb-1.5">
                  ข้อมูลติดต่อผู้แจ้ง (เพื่อความโปร่งใสหรือติดต่อสอบถามเพิ่มเติม)
                </label>
                <input
                  type="text"
                  value={reporterContact}
                  onChange={(e) => setReporterContact(e.target.value)}
                  placeholder="เบอร์โทรศัพท์ หรือ Line ID ของคุณ"
                  className="w-full px-3 py-2 text-xs sm:text-sm bg-surface-card border border-border-subtle rounded-xl focus:outline-none focus:border-red-500 transition-all"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={handleResetAndClose}
                  className="px-4 py-2.5 text-xs sm:text-sm font-medium text-text-muted hover:text-on-surface hover:bg-surface-container transition-colors rounded-xl cursor-pointer"
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white font-semibold text-xs sm:text-sm rounded-xl transition-all shadow-sm flex items-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  <Send className="w-4 h-4" />
                  <span>{isSubmitting ? 'กำลังส่งข้อมูล...' : 'ส่งรายงาน'}</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
