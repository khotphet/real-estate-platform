'use client';

import React from 'react';
import { PropertyType, SearchViewMode } from '@/types/listing';
import { THAILAND_PROVINCES } from '@/data/provinces';

interface FilterBarProps {
  activeType: string;
  onSelectType: (type: string) => void;
  activeView: SearchViewMode;
  onChangeView: (view: SearchViewMode) => void;
  onOpenFilterModal?: () => void;
  selectedProvince: string;
  onSelectProvince: (province: string) => void;
  counts: {
    all: number;
    condo: number;
    house: number;
    townhome: number;
    land: number;
  };
}

export function FilterBar({
  activeType,
  onSelectType,
  activeView,
  onChangeView,
  onOpenFilterModal,
  selectedProvince,
  onSelectProvince,
  counts,
}: FilterBarProps) {
  return (
    <div className="w-full bg-surface border-b border-border sticky top-18 z-40 shadow-xs">
      <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Category Chips and Quick Filter Controls */}
        <div className="flex items-center flex-wrap gap-2">
          {/* Province Selector Dropdown */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/30 text-primary text-xs font-bold transition-all shadow-2xs">
            <span className="material-symbols-outlined text-[16px]">location_on</span>
            <select
              value={selectedProvince}
              onChange={(e) => onSelectProvince(e.target.value)}
              className="bg-transparent text-primary font-bold focus:outline-none cursor-pointer pr-1 text-xs"
              aria-label="เลือกจังหวัด"
            >
              <option value="all" className="text-foreground font-semibold">📍 ทุกจังหวัด (ทั่วประเทศ)</option>
              <optgroup label="จังหวัดยอดนิยม" className="text-muted font-bold">
                <option value="กรุงเทพมหานคร" className="text-foreground">กรุงเทพมหานคร</option>
                <option value="เชียงใหม่" className="text-foreground">เชียงใหม่</option>
                <option value="ชลบุรี" className="text-foreground">ชลบุรี (พัทยา)</option>
                <option value="ภูเก็ต" className="text-foreground">ภูเก็ต</option>
                <option value="ขอนแก่น" className="text-foreground">ขอนแก่น</option>
                <option value="อุดรธานี" className="text-foreground">อุดรธานี</option>
              </optgroup>
              <optgroup label="ทั้ง 77 จังหวัด" className="text-muted font-bold">
                {THAILAND_PROVINCES.map((p) => (
                  <option key={p.nameTh} value={p.nameTh} className="text-foreground">
                    {p.nameTh}
                  </option>
                ))}
              </optgroup>
            </select>
          </div>

          <div className="h-5 w-px bg-border mx-1 hidden sm:block"></div>

          {/* All chip */}
          <button
            type="button"
            onClick={() => onSelectType('all')}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
              activeType === 'all'
                ? 'bg-primary text-white shadow-xs'
                : 'bg-background border border-border text-foreground hover:border-primary/50'
            }`}
          >
            <span>ทั้งหมด</span>
            <span
              className={`px-1.5 py-0.5 rounded-full text-[10px] ${
                activeType === 'all' ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'
              }`}
            >
              {counts.all}
            </span>
          </button>

          {/* Condo chip */}
          <button
            type="button"
            onClick={() => onSelectType('condo')}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
              activeType === 'condo'
                ? 'bg-primary text-white shadow-xs'
                : 'bg-background border border-border text-foreground hover:border-primary/50'
            }`}
          >
            <span>คอนโด</span>
            <span
              className={`px-1.5 py-0.5 rounded-full text-[10px] ${
                activeType === 'condo' ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'
              }`}
            >
              {counts.condo}
            </span>
          </button>

          {/* House chip */}
          <button
            type="button"
            onClick={() => onSelectType('house')}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
              activeType === 'house'
                ? 'bg-primary text-white shadow-xs'
                : 'bg-background border border-border text-foreground hover:border-primary/50'
            }`}
          >
            <span>บ้านเดี่ยว</span>
            <span
              className={`px-1.5 py-0.5 rounded-full text-[10px] ${
                activeType === 'house' ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'
              }`}
            >
              {counts.house}
            </span>
          </button>

          {/* Townhome chip */}
          <button
            type="button"
            onClick={() => onSelectType('townhome')}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
              activeType === 'townhome'
                ? 'bg-primary text-white shadow-xs'
                : 'bg-background border border-border text-foreground hover:border-primary/50'
            }`}
          >
            <span>ทาวน์โฮม</span>
            <span
              className={`px-1.5 py-0.5 rounded-full text-[10px] ${
                activeType === 'townhome' ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'
              }`}
            >
              {counts.townhome}
            </span>
          </button>

          {/* Land chip */}
          <button
            type="button"
            onClick={() => onSelectType('land')}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
              activeType === 'land'
                ? 'bg-primary text-white shadow-xs'
                : 'bg-background border border-border text-foreground hover:border-primary/50'
            }`}
          >
            <span>ที่ดิน</span>
            <span
              className={`px-1.5 py-0.5 rounded-full text-[10px] ${
                activeType === 'land' ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'
              }`}
            >
              {counts.land}
            </span>
          </button>

          <div className="h-5 w-px bg-border mx-1 hidden sm:block"></div>

          {/* Price Range button */}
          <button
            type="button"
            onClick={onOpenFilterModal}
            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-background border border-border text-xs font-medium text-muted hover:text-foreground hover:border-primary/50 transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[16px]">payments</span>
            <span>ช่วงราคา</span>
            <span className="material-symbols-outlined text-[14px]">expand_more</span>
          </button>

          {/* Bedrooms button */}
          <button
            type="button"
            onClick={onOpenFilterModal}
            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-background border border-border text-xs font-medium text-muted hover:text-foreground hover:border-primary/50 transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[16px]">bed</span>
            <span>ห้องนอน</span>
            <span className="material-symbols-outlined text-[14px]">expand_more</span>
          </button>

          {/* More Filters button (S07) */}
          <button
            type="button"
            onClick={onOpenFilterModal}
            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-background border border-border text-xs font-medium text-muted hover:text-foreground hover:border-primary/50 transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[16px]">tune</span>
            <span>ตัวกรองเพิ่มเติม</span>
          </button>
        </div>

        {/* 3-View Switcher Segmented Pill (Agoda style) */}
        <div className="flex items-center gap-2 shrink-0 self-end md:self-auto">
          <div className="inline-flex p-1 rounded-xl bg-background border border-border shadow-2xs">
            {/* List View option */}
            <button
              type="button"
              onClick={() => onChangeView('list')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                activeView === 'list'
                  ? 'bg-primary text-white font-semibold shadow-xs'
                  : 'text-muted hover:text-foreground'
              }`}
            >
              <span className="material-symbols-outlined text-[16px]">format_list_bulleted</span>
              <span>รายการ</span>
            </button>

            {/* Photo View option */}
            <button
              type="button"
              onClick={() => onChangeView('photo')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                activeView === 'photo'
                  ? 'bg-primary text-white font-semibold shadow-xs'
                  : 'text-muted hover:text-foreground'
              }`}
            >
              <span className="material-symbols-outlined text-[16px]">grid_view</span>
              <span>รูปภาพ</span>
            </button>

            {/* Map View option */}
            <button
              type="button"
              onClick={() => onChangeView('map')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                activeView === 'map'
                  ? 'bg-primary text-white font-semibold shadow-xs'
                  : 'text-muted hover:text-foreground'
              }`}
            >
              <span className="material-symbols-outlined text-[16px]">map</span>
              <span>แผนที่</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
