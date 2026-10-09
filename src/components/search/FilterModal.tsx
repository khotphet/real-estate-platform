'use client';

import React, { useState } from 'react';
import { DealType, PropertyType } from '@/types/listing';

interface FilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: (filters: any) => void;
  totalResults: number;
}

export function FilterModal({ isOpen, onClose, onApply, totalResults }: FilterModalProps) {
  const [dealType, setDealType] = useState<DealType | 'all'>('all');
  const [propertyType, setPropertyType] = useState<PropertyType | 'all'>('all');
  const [priceMin, setPriceMin] = useState<string>('');
  const [priceMax, setPriceMax] = useState<string>('');
  const [bedrooms, setBedrooms] = useState<string>('all');
  const [verifiedOnly, setVerifiedOnly] = useState<boolean>(false);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-surface w-full max-w-xl rounded-2xl border border-border shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-border flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-[22px]">tune</span>
            <h2 className="text-lg font-bold text-foreground">ตัวกรองการค้นหา (S07)</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full hover:bg-background flex items-center justify-center text-muted hover:text-foreground transition-colors"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Filter Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-sm">
          {/* Transaction Type */}
          <div>
            <label className="block text-xs font-bold text-muted uppercase tracking-wider mb-2">
              รูปแบบธุรกรรม
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(['all', 'sale', 'rent'] as const).map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setDealType(t)}
                  className={`py-2 px-3 rounded-xl border text-xs font-semibold transition-all ${
                    dealType === t
                      ? 'bg-primary text-white border-primary shadow-xs'
                      : 'border-border text-foreground hover:bg-background'
                  }`}
                >
                  {t === 'all' ? 'ทั้งหมด' : t === 'sale' ? 'ซื้อ (ขาย)' : 'เช่า'}
                </button>
              ))}
            </div>
          </div>

          {/* Property Category */}
          <div>
            <label className="block text-xs font-bold text-muted uppercase tracking-wider mb-2">
              ประเภทอสังหาริมทรัพย์
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {[
                { id: 'all', label: 'ทุกประเภท' },
                { id: 'condo', label: 'คอนโดมิเนียม' },
                { id: 'house', label: 'บ้านเดี่ยว' },
                { id: 'townhome', label: 'ทาวน์โฮม' },
                { id: 'land', label: 'ที่ดินเปล่า' },
                { id: 'commercial', label: 'อาคารพาณิชย์' },
              ].map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setPropertyType(cat.id as any)}
                  className={`py-2 px-3 rounded-xl border text-xs font-semibold transition-all ${
                    propertyType === cat.id
                      ? 'bg-primary text-white border-primary shadow-xs'
                      : 'border-border text-foreground hover:bg-background'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* Price Range */}
          <div>
            <label className="block text-xs font-bold text-muted uppercase tracking-wider mb-2">
              ช่วงราคา (บาท)
            </label>
            <div className="grid grid-cols-2 gap-3 items-center">
              <input
                type="number"
                placeholder="ต่ำสุด"
                value={priceMin}
                onChange={(e) => setPriceMin(e.target.value)}
                className="w-full px-3 py-2 bg-background border border-border rounded-xl text-xs placeholder:text-muted focus:outline-none focus:border-primary"
              />
              <input
                type="number"
                placeholder="สูงสุด"
                value={priceMax}
                onChange={(e) => setPriceMax(e.target.value)}
                className="w-full px-3 py-2 bg-background border border-border rounded-xl text-xs placeholder:text-muted focus:outline-none focus:border-primary"
              />
            </div>
          </div>

          {/* Bedrooms */}
          <div>
            <label className="block text-xs font-bold text-muted uppercase tracking-wider mb-2">
              จำนวนห้องนอน
            </label>
            <div className="flex gap-2 flex-wrap">
              {['all', 'studio', '1', '2', '3+'].map((b) => (
                <button
                  key={b}
                  type="button"
                  onClick={() => setBedrooms(b)}
                  className={`py-1.5 px-3.5 rounded-full border text-xs font-semibold transition-all ${
                    bedrooms === b
                      ? 'bg-primary text-white border-primary shadow-xs'
                      : 'border-border text-foreground hover:bg-background'
                  }`}
                >
                  {b === 'all'
                    ? 'ไม่จำกัด'
                    : b === 'studio'
                    ? 'สตูดิโอ'
                    : `${b} ห้องนอน`}
                </button>
              ))}
            </div>
          </div>

          {/* Verification Checkbox */}
          <div className="pt-2">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={verifiedOnly}
                onChange={(e) => setVerifiedOnly(e.target.checked)}
                className="w-4 h-4 rounded text-primary focus:ring-primary border-border"
              />
              <div className="flex flex-col">
                <span className="font-semibold text-xs text-foreground flex items-center gap-1">
                  <span>เฉพาะประกาศที่ตรวจสอบแล้ว (Verified Listing)</span>
                  <span className="material-symbols-outlined text-[16px] text-emerald-600">verified</span>
                </span>
                <span className="text-[11px] text-muted">
                  ตรวจสอบเอกสารสิทธิ์ โฉนดที่ดิน หรือแต่งตั้งนายหน้าถูกต้อง
                </span>
              </div>
            </label>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 border-t border-border bg-slate-50 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => {
              setDealType('all');
              setPropertyType('all');
              setPriceMin('');
              setPriceMax('');
              setBedrooms('all');
              setVerifiedOnly(false);
            }}
            className="text-xs font-semibold text-muted hover:text-foreground underline underline-offset-4"
          >
            ล้างตัวกรองทั้งหมด
          </button>
          <button
            type="button"
            onClick={() => {
              onApply({ dealType, propertyType, priceMin, priceMax, bedrooms, verifiedOnly });
              onClose();
            }}
            className="px-6 py-2.5 rounded-xl bg-primary hover:bg-[#115e59] text-white text-xs font-bold shadow-xs transition-colors"
          >
            แสดงผล ({totalResults} รายการ)
          </button>
        </div>
      </div>
    </div>
  );
}
