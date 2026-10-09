'use client';

import React from 'react';
import Link from 'next/link';
import { Listing } from '@/types/listing';

interface PhotoViewProps {
  listings: Listing[];
  onSelectListing?: (listing: Listing) => void;
}

export function PhotoView({ listings, onSelectListing }: PhotoViewProps) {
  return (
    <div className="flex flex-col gap-6">
      {listings.map((item) => {
        const isReserved = item.status === 'reserved';

        return (
          <div
            key={item.id}
            className="group bg-surface rounded-2xl border border-border overflow-hidden hover:shadow-lg transition-all"
          >
            {/* Immersive Photo Grid / Banner */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-2 p-2 bg-slate-50">
              {/* Main Big Photo (Col 1-2) */}
              <div className="relative lg:col-span-2 h-72 sm:h-96 rounded-xl overflow-hidden bg-slate-200">
                <Link href={`/listing/${item.code}`} className="block w-full h-full">
                  <img
                    src={item.images[0]}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-300"
                  />
                </Link>

                {/* Overlaid Badges */}
                <div className="absolute top-4 left-4 flex items-center gap-2">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold text-white shadow-xs ${
                      item.dealType === 'sale' ? 'bg-primary' : 'bg-blue-600'
                    }`}
                  >
                    {item.dealType === 'sale' ? 'ขาย' : 'เช่า'}
                  </span>

                  {isReserved ? (
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-status-reserved text-white flex items-center gap-1.5 shadow-xs">
                      <span className="w-2 h-2 rounded-full bg-white animate-pulse"></span>
                      <span>ติดจอง</span>
                    </span>
                  ) : (
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-status-active text-white flex items-center gap-1.5 shadow-xs">
                      <span className="w-2 h-2 rounded-full bg-white"></span>
                      <span>ว่าง</span>
                    </span>
                  )}

                  {item.isVerified && (
                    <span className="px-2.5 py-1 rounded-full bg-white/90 backdrop-blur-xs text-emerald-800 text-xs font-semibold flex items-center gap-1 shadow-xs">
                      <span className="material-symbols-outlined text-[15px] text-emerald-600">verified</span>
                      <span>Verified</span>
                    </span>
                  )}
                </div>

                {/* Heart & Share Buttons */}
                <div className="absolute top-4 right-4 flex items-center gap-2">
                  <button
                    type="button"
                    aria-label="แชร์"
                    className="w-9 h-9 rounded-full bg-white/90 hover:bg-white text-muted hover:text-foreground flex items-center justify-center shadow-xs transition-colors"
                  >
                    <span className="material-symbols-outlined text-[18px]">share</span>
                  </button>
                  <button
                    type="button"
                    aria-label="บันทึก"
                    className="w-9 h-9 rounded-full bg-white/90 hover:bg-white text-muted hover:text-red-500 flex items-center justify-center shadow-xs transition-colors"
                  >
                    <span className="material-symbols-outlined text-[18px]">favorite</span>
                  </button>
                </div>

                {/* Floating Price Pill on image */}
                <div className="absolute bottom-4 left-4 px-4 py-2 rounded-xl bg-black/75 backdrop-blur-sm text-white flex flex-col shadow-md">
                  <span className="text-2xl font-black tracking-tight">{item.priceFormatted}</span>
                  <span className="text-[11px] text-slate-300 font-medium">{item.title}</span>
                </div>

                {/* Total Photos Badge */}
                <div className="absolute bottom-4 right-4 px-3 py-1.5 rounded-lg bg-black/75 backdrop-blur-sm text-white text-xs font-medium flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[16px]">photo_library</span>
                  <span>+{item.photoCount} รูปภาพ</span>
                </div>
              </div>

              {/* Side Photo Previews (Col 3 on desktop) */}
              <div className="hidden lg:flex flex-col gap-2 h-96">
                <div className="relative flex-1 rounded-xl overflow-hidden bg-slate-200">
                  <img
                    src={item.images[0]}
                    alt="preview"
                    className="w-full h-full object-cover filter brightness-95 hover:brightness-105 transition-all"
                  />
                  <div className="absolute inset-0 bg-primary/10"></div>
                </div>
                <div className="relative flex-1 rounded-xl overflow-hidden bg-slate-200 flex items-center justify-center">
                  <img
                    src={item.images[0]}
                    alt="preview"
                    className="w-full h-full object-cover filter blur-[1px] brightness-75"
                  />
                  <span className="absolute text-white font-bold text-sm flex items-center gap-1">
                    <span className="material-symbols-outlined text-[18px]">visibility</span>
                    <span>ดูภาพทั้งหมด</span>
                  </span>
                </div>
              </div>
            </div>

            {/* Info & Specs Bar */}
            <div className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 text-xs text-muted">
                  <span className="material-symbols-outlined text-[16px] text-primary">location_on</span>
                  <span>{item.location.address}</span>
                  {item.location.nearLandmark && (
                    <>
                      <span>•</span>
                      <span className="text-primary font-medium">{item.location.nearLandmark}</span>
                    </>
                  )}
                </div>

                <h3 className="mt-1 text-lg font-bold text-foreground hover:text-primary transition-colors">
                  <Link href={`/listing/${item.code}`}>{item.title}</Link>
                </h3>

                {/* Specs Row */}
                <div className="mt-3 flex items-center flex-wrap gap-4 text-xs font-medium text-foreground">
                  {item.specs.usableAreaSqm && (
                    <span className="inline-flex items-center gap-1.5 bg-background px-3 py-1.5 rounded-lg border border-border">
                      <span className="material-symbols-outlined text-[16px] text-muted">square_foot</span>
                      <span>{item.specs.usableAreaSqm} ตร.ม.</span>
                    </span>
                  )}
                  {item.specs.landAreaSqwa && (
                    <span className="inline-flex items-center gap-1.5 bg-background px-3 py-1.5 rounded-lg border border-border">
                      <span className="material-symbols-outlined text-[16px] text-muted">aspect_ratio</span>
                      <span>{item.specs.landAreaSqwa} ตร.ว.</span>
                    </span>
                  )}
                  {item.specs.bedrooms !== undefined && item.specs.bedrooms > 0 && (
                    <span className="inline-flex items-center gap-1.5 bg-background px-3 py-1.5 rounded-lg border border-border">
                      <span className="material-symbols-outlined text-[16px] text-muted">bed</span>
                      <span>{item.specs.bedrooms} ห้องนอน</span>
                    </span>
                  )}
                  {item.specs.bathrooms !== undefined && item.specs.bathrooms > 0 && (
                    <span className="inline-flex items-center gap-1.5 bg-background px-3 py-1.5 rounded-lg border border-border">
                      <span className="material-symbols-outlined text-[16px] text-muted">bathtub</span>
                      <span>{item.specs.bathrooms} ห้องน้ำ</span>
                    </span>
                  )}
                  {item.specs.parking && (
                    <span className="inline-flex items-center gap-1.5 bg-background px-3 py-1.5 rounded-lg border border-border">
                      <span className="material-symbols-outlined text-[16px] text-muted">local_parking</span>
                      <span>{item.specs.parking} คัน</span>
                    </span>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-3 shrink-0">
                <Link
                  href={`/listing/${item.code}`}
                  className="px-5 py-2.5 rounded-xl border border-border hover:border-primary text-foreground font-semibold text-xs transition-colors"
                >
                  ดูรายละเอียด
                </Link>
                <Link
                  href="#chat"
                  className="px-5 py-2.5 rounded-xl bg-primary hover:bg-[#115e59] text-white font-semibold text-xs shadow-xs transition-colors flex items-center gap-1.5"
                >
                  <span className="material-symbols-outlined text-[16px]">chat</span>
                  <span>ติดต่อสอบถาม</span>
                </Link>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
