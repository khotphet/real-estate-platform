'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Listing } from '@/types/listing';

interface MapViewProps {
  listings: Listing[];
  onSelectListing?: (listing: Listing) => void;
}

export function MapView({ listings, onSelectListing }: MapViewProps) {
  const [selectedId, setSelectedId] = useState<string>(listings[0]?.id || '');
  const selectedListing = listings.find((l) => l.id === selectedId) || listings[0];

  // Simplified relative visual coordinate mapping for Udon Thani center demo
  // Udon center is approx 17.41 N, 102.79 E
  const getMapPosition = (lat: number, lng: number) => {
    // scale roughly to percentage of map canvas
    const x = Math.min(Math.max(((lng - 102.75) / (102.83 - 102.75)) * 100, 10), 90);
    const y = Math.min(Math.max((1 - (lat - 17.38) / (17.45 - 17.38)) * 100, 10), 85);
    return { top: `${y}%`, left: `${x}%` };
  };

  return (
    <div className="relative w-full h-[calc(100vh-140px)] min-h-[600px] bg-slate-100 rounded-2xl overflow-hidden border border-border shadow-xs">
      {/* Map Canvas Background (Simulated Vector / Satellite Hybrid base) */}
      <div className="absolute inset-0 bg-[#e5eef4] overflow-hidden">
        {/* Decorative Grid Lines / Road Network Pattern */}
        <svg className="w-full h-full opacity-40" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="road-grid" width="120" height="120" patternUnits="userSpaceOnUse">
              <path d="M 120 0 L 0 120 M 0 0 L 120 120" fill="none" stroke="#cbd5e1" strokeWidth="2" />
              <circle cx="60" cy="60" r="35" fill="none" stroke="#94a3b8" strokeWidth="1" strokeDasharray="4 4" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#road-grid)" />
        </svg>

        {/* Lake Nong Prajak Simulation */}
        <div
          className="absolute rounded-full bg-[#bfdbfe] border-2 border-[#93c5fd] opacity-80"
          style={{ top: '35%', left: '35%', width: '140px', height: '90px' }}
        >
          <span className="absolute inset-0 flex items-center justify-center text-[10px] font-bold text-sky-700">
            หนองประจักษ์
          </span>
        </div>

        {/* Central Plaza Udon Landmark */}
        <div
          className="absolute rounded-lg bg-slate-200 border border-slate-300 p-1.5 shadow-2xs flex items-center gap-1"
          style={{ top: '55%', left: '60%' }}
        >
          <span className="material-symbols-outlined text-[14px] text-primary">shopping_bag</span>
          <span className="text-[10px] font-semibold text-slate-700">เซ็นทรัล อุดรฯ</span>
        </div>

        {/* UD Town Landmark */}
        <div
          className="absolute rounded-lg bg-slate-200 border border-slate-300 p-1.5 shadow-2xs flex items-center gap-1"
          style={{ top: '58%', left: '72%' }}
        >
          <span className="material-symbols-outlined text-[14px] text-primary">storefront</span>
          <span className="text-[10px] font-semibold text-slate-700">UD Town</span>
        </div>
      </div>

      {/* Map Control Buttons (Top-Right) */}
      <div className="absolute top-4 right-4 z-20 flex flex-col gap-2">
        <div className="bg-surface rounded-xl border border-border shadow-sm p-1 flex flex-col gap-1">
          <button
            type="button"
            className="w-9 h-9 rounded-lg hover:bg-background flex items-center justify-center text-foreground font-bold transition-colors"
            title="ซูมเข้า"
          >
            <span className="material-symbols-outlined text-[20px]">add</span>
          </button>
          <div className="h-px bg-border mx-1"></div>
          <button
            type="button"
            className="w-9 h-9 rounded-lg hover:bg-background flex items-center justify-center text-foreground font-bold transition-colors"
            title="ซูมออก"
          >
            <span className="material-symbols-outlined text-[20px]">remove</span>
          </button>
        </div>

        <button
          type="button"
          className="w-10 h-10 rounded-xl bg-surface border border-border shadow-sm flex items-center justify-center text-primary hover:bg-primary/5 transition-colors"
          title="ตำแหน่งปัจจุบัน"
        >
          <span className="material-symbols-outlined text-[20px]">my_location</span>
        </button>

        <button
          type="button"
          className="px-3 py-1.5 rounded-xl bg-surface border border-border shadow-sm text-xs font-semibold text-foreground hover:bg-background transition-colors flex items-center gap-1"
        >
          <span className="material-symbols-outlined text-[16px] text-primary">layers</span>
          <span>ดาวเทียม</span>
        </button>
      </div>

      {/* Interactive Agoda-style Price Pill Pins */}
      {listings.map((item) => {
        const isSelected = item.id === selectedId;
        const isReserved = item.status === 'reserved';
        const pos = getMapPosition(item.location.lat, item.location.lng);

        return (
          <div
            key={item.id}
            style={{ top: pos.top, left: pos.left }}
            className="absolute z-10 -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-transform hover:scale-110 active:scale-95"
            onClick={() => {
              setSelectedId(item.id);
              onSelectListing?.(item);
            }}
          >
            <div
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full shadow-md transition-all ${
                isSelected
                  ? 'bg-primary text-white ring-3 ring-primary/30 z-30 scale-105'
                  : isReserved
                  ? 'bg-white border-2 border-status-reserved text-foreground'
                  : 'bg-white border border-border text-foreground hover:border-primary'
              }`}
            >
              {/* Thumbnail Circle */}
              <div className="w-5 h-5 rounded-full overflow-hidden shrink-0 bg-slate-200">
                <img src={item.images[0]} alt="" className="w-full h-full object-cover" />
              </div>

              {/* Price Tag */}
              <span className={`text-xs font-bold ${isSelected ? 'text-white' : 'text-slate-900'}`}>
                {item.pinPrice}
              </span>

              {/* Reserved Indicator if applicable */}
              {isReserved && !isSelected && (
                <span className="w-2 h-2 rounded-full bg-status-reserved"></span>
              )}
            </div>
          </div>
        );
      })}

      {/* Bottom Floating Property Card (Synced with Selected Pin) */}
      {selectedListing && (
        <div className="absolute bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-96 z-20">
          <div className="bg-surface rounded-2xl border border-border p-3.5 shadow-xl flex gap-3 items-center backdrop-blur-xs">
            {/* Thumbnail */}
            <div className="relative w-24 h-24 rounded-xl overflow-hidden shrink-0 bg-slate-100">
              <img
                src={selectedListing.images[0]}
                alt={selectedListing.title}
                className="w-full h-full object-cover"
              />
              <span
                className={`absolute top-1.5 left-1.5 px-1.5 py-0.5 rounded-full text-[10px] font-bold text-white ${
                  selectedListing.dealType === 'sale' ? 'bg-primary' : 'bg-blue-600'
                }`}
              >
                {selectedListing.dealType === 'sale' ? 'ขาย' : 'เช่า'}
              </span>
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0 flex flex-col justify-between h-24 py-0.5">
              <div>
                <div className="flex items-center justify-between gap-1">
                  <span className="text-base font-extrabold text-foreground leading-tight">
                    {selectedListing.priceFormatted}
                  </span>
                  {selectedListing.status === 'reserved' && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-status-reserved text-white">
                      ติดจอง
                    </span>
                  )}
                </div>

                <h4 className="text-xs font-bold text-foreground line-clamp-1 mt-1">
                  {selectedListing.title}
                </h4>
                <p className="text-[11px] text-muted line-clamp-1 mt-0.5">
                  {selectedListing.location.address}
                </p>
              </div>

              <div className="flex items-center justify-between pt-1 border-t border-border/60">
                <span className="text-[11px] font-medium text-foreground">
                  {selectedListing.specs.usableAreaSqm || selectedListing.specs.landAreaSqwa}{' '}
                  {selectedListing.specs.usableAreaSqm ? 'ตร.ม.' : 'ตร.ว.'}
                </span>
                <Link
                  href={`#property-${selectedListing.code}`}
                  className="text-xs font-semibold text-primary hover:underline flex items-center gap-0.5"
                >
                  <span>ดูรายละเอียด</span>
                  <span className="material-symbols-outlined text-[14px]">chevron_right</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
