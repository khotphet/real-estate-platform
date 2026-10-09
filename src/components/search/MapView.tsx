'use client';

import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { Listing } from '@/types/listing';

// Dynamic import with SSR disabled for Leaflet window compatibility
const LeafletMap = dynamic(() => import('./LeafletMap'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full min-h-[600px] bg-slate-100 flex items-center justify-center rounded-2xl">
      <div className="flex flex-col items-center gap-3 text-muted">
        <span className="material-symbols-outlined text-4xl animate-spin text-primary">progress_activity</span>
        <span className="text-sm font-semibold">กำลังโหลดแผนที่อุดรธานี...</span>
      </div>
    </div>
  ),
});

interface MapViewProps {
  listings: Listing[];
  onSelectListing?: (listing: Listing) => void;
}

export function MapView({ listings, onSelectListing }: MapViewProps) {
  const [selectedId, setSelectedId] = useState<string>(listings[0]?.id || '');
  const selectedListing = listings.find((l) => l.id === selectedId) || listings[0];

  const handleSelect = (item: Listing) => {
    setSelectedId(item.id);
    onSelectListing?.(item);
  };

  return (
    <div className="relative w-full h-[calc(100vh-140px)] min-h-[600px] bg-slate-100 rounded-2xl overflow-hidden border border-border shadow-xs">
      <LeafletMap
        listings={listings}
        selectedListing={selectedListing}
        onSelectListing={handleSelect}
      />

      {/* Bottom Floating Property Card (Synced with Selected Pin) */}
      {selectedListing && (
        <div className="absolute bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-96 z-30 pointer-events-auto">
          <div className="bg-surface/95 backdrop-blur-md rounded-2xl border border-border p-3.5 shadow-2xl flex gap-3 items-center">
            {/* Thumbnail */}
            <div className="relative w-24 h-24 rounded-xl overflow-hidden shrink-0 bg-slate-100">
              <Link href={`/listing/${selectedListing.code}`} className="block w-full h-full">
                <img
                  src={selectedListing.images[0]}
                  alt={selectedListing.title}
                  className="w-full h-full object-cover"
                />
              </Link>
              <span
                className={`absolute top-1.5 left-1.5 px-1.5 py-0.5 rounded-full text-[10px] font-bold text-white shadow-xs ${
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
                  {selectedListing.status === 'sold' && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-status-sold text-white">
                      ขายแล้ว
                    </span>
                  )}
                </div>

                <h4 className="text-xs font-bold text-foreground line-clamp-1 mt-1">
                  <Link href={`/listing/${selectedListing.code}`} className="hover:text-primary transition-colors">
                    {selectedListing.title}
                  </Link>
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
                  href={`/listing/${selectedListing.code}`}
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
