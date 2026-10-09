'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Listing } from '@/types/listing';

interface ListViewProps {
  listings: Listing[];
  onSelectListing?: (listing: Listing) => void;
}

export function ListView({ listings, onSelectListing }: ListViewProps) {
  return (
    <div className="flex flex-col gap-4">
      {listings.map((item) => {
        const isReserved = item.status === 'reserved';

        return (
          <div
            key={item.id}
            className="group relative bg-surface rounded-2xl border border-border overflow-hidden hover:shadow-md hover:border-primary/40 transition-all flex flex-col md:flex-row"
          >
            {/* Image Section */}
            <div className="relative w-full md:w-80 h-56 md:h-auto shrink-0 bg-slate-100 overflow-hidden">
              <img
                src={item.images[0]}
                alt={item.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />

              {/* Photo Count Pill */}
              <div className="absolute bottom-3 right-3 px-2 py-1 rounded-md bg-black/60 backdrop-blur-xs text-white text-[11px] font-medium flex items-center gap-1">
                <span className="material-symbols-outlined text-[14px]">photo_camera</span>
                <span>{item.photoCount}</span>
              </div>

              {/* Top Badges */}
              <div className="absolute top-3 left-3 flex items-center gap-1.5 flex-wrap">
                {/* Deal Type Badge */}
                <span
                  className={`px-2.5 py-0.5 rounded-full text-xs font-semibold text-white ${
                    item.dealType === 'sale' ? 'bg-primary' : 'bg-blue-600'
                  }`}
                >
                  {item.dealType === 'sale' ? 'ขาย' : 'เช่า'}
                </span>

                {/* Status Badge */}
                {isReserved ? (
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-status-reserved text-white flex items-center gap-1 shadow-2xs">
                    <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></span>
                    <span>ติดจอง</span>
                  </span>
                ) : (
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-status-active text-white flex items-center gap-1 shadow-2xs">
                    <span className="w-1.5 h-1.5 rounded-full bg-white"></span>
                    <span>ว่าง</span>
                  </span>
                )}
              </div>

              {/* Heart Favorite Button */}
              <button
                type="button"
                aria-label="บันทึกทรัพย์"
                className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 hover:bg-white text-muted hover:text-red-500 flex items-center justify-center shadow-xs transition-colors"
              >
                <span className="material-symbols-outlined text-[18px]">favorite</span>
              </button>
            </div>

            {/* Content Section */}
            <div className="p-5 flex-1 flex flex-col justify-between gap-3">
              <div>
                {/* Price and Verified Row */}
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-extrabold text-foreground tracking-tight">
                      {item.priceFormatted}
                    </span>
                    {item.dealType === 'rent' && (
                      <span className="text-xs text-muted font-medium">รวมส่วนกลางแล้ว</span>
                    )}
                  </div>

                  {item.isVerified && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-medium">
                      <span className="material-symbols-outlined text-[14px]">verified</span>
                      <span>ยืนยันแล้ว</span>
                    </span>
                  )}
                </div>

                {/* Title */}
                <h3 className="mt-2 text-base font-bold text-foreground group-hover:text-primary transition-colors line-clamp-1">
                  <Link href={`#property-${item.code}`}>{item.title}</Link>
                </h3>

                {/* Location */}
                <div className="mt-1 flex items-center gap-1 text-xs text-muted">
                  <span className="material-symbols-outlined text-[15px] text-primary shrink-0">location_on</span>
                  <span className="line-clamp-1">{item.location.address}</span>
                </div>

                {/* Description Snippet */}
                <p className="mt-2 text-xs text-muted line-clamp-2 leading-relaxed">
                  {item.description}
                </p>
              </div>

              {/* Specs and Meta Footer */}
              <div className="pt-3 border-t border-border flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                {/* Specs Row */}
                <div className="flex items-center flex-wrap gap-2 text-foreground font-medium">
                  {item.specs.usableAreaSqm && (
                    <span className="inline-flex items-center gap-1">
                      <span className="text-muted">พื้นที่</span>
                      <span>{item.specs.usableAreaSqm} ตร.ม.</span>
                    </span>
                  )}
                  {item.specs.landAreaSqwa && (
                    <span className="inline-flex items-center gap-1">
                      <span className="text-muted">ที่ดิน</span>
                      <span>{item.specs.landAreaSqwa} ตร.ว.</span>
                    </span>
                  )}
                  {item.specs.bedrooms !== undefined && item.specs.bedrooms > 0 && (
                    <>
                      <span className="text-border">•</span>
                      <span>{item.specs.bedrooms} นอน</span>
                    </>
                  )}
                  {item.specs.bathrooms !== undefined && item.specs.bathrooms > 0 && (
                    <>
                      <span className="text-border">•</span>
                      <span>{item.specs.bathrooms} น้ำ</span>
                    </>
                  )}
                  {item.specs.floor && (
                    <>
                      <span className="text-border">•</span>
                      <span>ชั้น {item.specs.floor}</span>
                    </>
                  )}
                </div>

                {/* Updated timestamp */}
                <span className="text-muted text-[11px] shrink-0 self-end sm:self-auto">
                  {item.updatedAt}
                </span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
