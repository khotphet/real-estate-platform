'use client';

import React, { useState, useMemo } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { Listing } from '@/types/listing';
import { POINTS_OF_INTEREST } from '@/data/poi';

// Dynamic import with SSR disabled for Leaflet window compatibility
const LeafletMap = dynamic(() => import('./LeafletMap'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full min-h-[600px] bg-slate-100 flex items-center justify-center rounded-2xl">
      <div className="flex flex-col items-center gap-3 text-muted">
        <span className="material-symbols-outlined text-4xl animate-spin text-primary">progress_activity</span>
        <span className="text-sm font-semibold">กำลังโหลดแผนที่อสังหาริมทรัพย์...</span>
      </div>
    </div>
  ),
});

interface MapViewProps {
  listings: Listing[];
  onSelectListing?: (listing: Listing) => void;
  center?: { lat: number; lng: number };
  zoom?: number;
  provinceName?: string;
}

export function MapView({ listings, onSelectListing, center, zoom, provinceName }: MapViewProps) {
  const [selectedId, setSelectedId] = useState<string>(listings[0]?.id || '');
  const selectedListing = listings.find((l) => l.id === selectedId) || listings[0];
  const [mapZoomTrigger, setMapZoomTrigger] = useState<{ lat: number; lng: number; zoom: number } | undefined>(undefined);

  const handleSelect = (item: Listing) => {
    setSelectedId(item.id);
    onSelectListing?.(item);
  };

  // Find 3 closest POIs to the selected property
  const nearestPois = useMemo(() => {
    if (!selectedListing) return [];

    function getDistanceMeters(lat1: number, lon1: number, lat2: number, lon2: number) {
      const R = 6371e3;
      const phi1 = (lat1 * Math.PI) / 180;
      const phi2 = (lat2 * Math.PI) / 180;
      const deltaPhi = ((lat2 - lat1) * Math.PI) / 180;
      const deltaLambda = ((lon2 - lon1) * Math.PI) / 180;
      const a =
        Math.sin(deltaPhi / 2) * Math.sin(deltaPhi / 2) +
        Math.cos(phi1) * Math.cos(phi2) * Math.sin(deltaLambda / 2) * Math.sin(deltaLambda / 2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      return Math.round(R * c);
    }

    const poisInProvince = POINTS_OF_INTEREST.filter(
      (p) => !selectedListing.location.province || p.province === selectedListing.location.province
    )
      .map((p) => {
        const dist = getDistanceMeters(selectedListing.location.lat, selectedListing.location.lng, p.lat, p.lng);
        const distText = dist < 1000 ? `${dist} ม.` : `${(dist / 1000).toFixed(1)} กม.`;
        return { ...p, dist, distText };
      })
      .sort((a, b) => a.dist - b.dist);

    return poisInProvince.slice(0, 3);
  }, [selectedListing]);

  const handleZoomInToProperty = () => {
    if (selectedListing) {
      setMapZoomTrigger({
        lat: selectedListing.location.lat,
        lng: selectedListing.location.lng,
        zoom: 16,
      });
    }
  };

  return (
    <div className="relative w-full h-[calc(100vh-140px)] min-h-[600px] bg-slate-100 rounded-2xl overflow-hidden border border-border shadow-xs">
      <LeafletMap
        listings={listings}
        selectedListing={selectedListing}
        onSelectListing={handleSelect}
        center={mapZoomTrigger || center}
        zoom={mapZoomTrigger ? mapZoomTrigger.zoom : zoom}
        provinceName={provinceName}
      />

      {/* Bottom Floating Property Card (Synced with Selected Pin) */}
      {selectedListing && (
        <div className="absolute bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-[420px] z-30 pointer-events-auto">
          <div className="bg-surface/95 backdrop-blur-md rounded-2xl border border-border p-3.5 shadow-2xl flex flex-col gap-2.5">
            <div className="flex gap-3 items-center">
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
                  {selectedListing.dealType === 'sale' ? 'ขาย' : 'ให้เช่า'}
                </span>
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 text-xs text-muted mb-0.5">
                  <span className="font-mono font-semibold text-primary">{selectedListing.code}</span>
                  <span>•</span>
                  <span className="truncate">{selectedListing.location.subdistrict}, {selectedListing.location.province}</span>
                </div>

                <Link href={`/listing/${selectedListing.code}`} className="block">
                  <h3 className="font-bold text-foreground text-sm truncate hover:text-primary transition-colors">
                    {selectedListing.title}
                  </h3>
                </Link>

                <div className="text-base font-extrabold text-primary mt-1">
                  {selectedListing.priceFormatted}
                  {selectedListing.dealType === 'rent' && (
                    <span className="text-xs font-normal text-muted"> / เดือน</span>
                  )}
                </div>

                <div className="flex items-center gap-2 mt-1.5 text-[11px] text-muted">
                  {selectedListing.specs.bedrooms && (
                    <span className="flex items-center gap-0.5">
                      <span className="material-symbols-outlined text-[14px]">bed</span>
                      {selectedListing.specs.bedrooms} นอน
                    </span>
                  )}
                  {selectedListing.specs.usableAreaSqm && (
                    <span className="flex items-center gap-0.5">
                      <span className="material-symbols-outlined text-[14px]">straighten</span>
                      {selectedListing.specs.usableAreaSqm} ตร.ม.
                    </span>
                  )}
                  <span className="ml-auto text-primary font-semibold hover:underline cursor-pointer">
                    <Link href={`/listing/${selectedListing.code}`}>ดูข้อมูล →</Link>
                  </span>
                </div>
              </div>
            </div>

            {/* Proximity / Nearest POIs Row */}
            {nearestPois.length > 0 && (
              <div className="pt-2 border-t border-border flex items-center justify-between gap-1.5 text-[11px]">
                <div className="flex items-center gap-1.5 overflow-x-auto min-w-0">
                  <span className="font-bold text-muted text-[10px] shrink-0 uppercase tracking-wider">
                    ใกล้:
                  </span>
                  {nearestPois.map((p) => (
                    <span
                      key={p.id}
                      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-slate-100 text-foreground font-semibold shrink-0 text-[11px]"
                    >
                      <span className="text-[12px]">{p.subType === '7-Eleven' ? '🏪' : p.category === 'market' ? '🛒' : '🫧'}</span>
                      <span className="truncate max-w-[90px]">{p.name.replace(/สาขา/g, '')}</span>
                      <span className="font-bold text-primary">({p.distText})</span>
                    </span>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={handleZoomInToProperty}
                  className="px-2 py-1 rounded-lg bg-primary/10 text-primary hover:bg-primary hover:text-white font-bold text-[10px] shrink-0 transition-colors cursor-pointer flex items-center gap-0.5"
                  title="ซูมระดับถนนเพื่อดูระยะเดินจริง 500 ม."
                >
                  <span className="material-symbols-outlined text-[13px]">zoom_in</span>
                  <span>ซูมดูทำเล</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
