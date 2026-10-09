'use client';

import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import type { Listing } from '@/types/listing';

interface LeafletMapProps {
  listings: Listing[];
  selectedListing?: Listing;
  onSelectListing?: (listing: Listing) => void;
  onBoundsChange?: (bounds: { minLat: number; maxLat: number; minLng: number; maxLng: number }) => void;
}

const UDON_CENTER = { lat: 17.4138, lng: 102.7872 }; // Udon Thani Center

const UDON_LANDMARKS = [
  { name: 'หนองประจักษ์', icon: 'water', lat: 17.4225, lng: 102.7842 },
  { name: 'เซ็นทรัล อุดรฯ', icon: 'shopping_bag', lat: 17.4052, lng: 102.7995 },
  { name: 'UD Town', icon: 'storefront', lat: 17.4068, lng: 102.8055 },
  { name: 'สนามบินอุดรธานี', icon: 'flight', lat: 17.3865, lng: 102.7885 },
  { name: 'รพ.กรุงเทพ อุดร', icon: 'local_hospital', lat: 17.4140, lng: 102.7930 },
];

export default function LeafletMap({
  listings,
  selectedListing,
  onSelectListing,
  onBoundsChange,
}: LeafletMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const mapRef = useRef<any>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const markersGroupRef = useRef<any>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const activeTileLayerRef = useRef<any>(null);
  const [mapReady, setMapReady] = useState(false);
  const [mapStyle, setMapStyle] = useState<'street' | 'satellite'>('street');
  const [isMoved, setIsMoved] = useState(false);

  // Initialize Map
  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    function initMap() {
      if (!containerRef.current) return;

      // Clean container if re-initializing
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      if ((containerRef.current as any)._leaflet_id) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        delete (containerRef.current as any)._leaflet_id;
      }

      const map = L.map(containerRef.current, {
        center: [UDON_CENTER.lat, UDON_CENTER.lng],
        zoom: 13,
        zoomControl: false,
        attributionControl: false,
      });

      // Humanitarian OpenStreetMap tiles (Clean, modern, NO API KEY required, NO watermark)
      const streetLayer = L.tileLayer(
        'https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png',
        {
          maxZoom: 19,
          subdomains: ['a', 'b', 'c'],
        }
      );

      streetLayer.addTo(map);
      activeTileLayerRef.current = streetLayer;

      // Layer group for property pins
      const markersGroup = L.layerGroup().addTo(map);
      markersGroupRef.current = markersGroup;

      // Add landmarks
      UDON_LANDMARKS.forEach((lm) => {
        const landmarkIcon = L.divIcon({
          className: 'leaflet-landmark-marker',
          html: `
            <div class="map-landmark-badge">
              <span class="material-symbols-outlined" style="font-size: 13px; color: #0f766e;">${lm.icon}</span>
              <span>${lm.name}</span>
            </div>
          `,
          iconSize: [120, 24],
          iconAnchor: [60, 12],
        });
        L.marker([lm.lat, lm.lng], { icon: landmarkIcon, interactive: false }).addTo(map);
      });

      // Track drag / move
      map.on('moveend', () => {
        setIsMoved(true);
        if (onBoundsChange) {
          const b = map.getBounds();
          onBoundsChange({
            minLat: b.getSouth(),
            maxLat: b.getNorth(),
            minLng: b.getWest(),
            maxLng: b.getEast(),
          });
        }
      });

      mapRef.current = map;
      setMapReady(true);
    }

    initMap();

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
        setMapReady(false);
      }
    };
  }, [onBoundsChange]);

  // Handle Tile Style Change
  useEffect(() => {
    if (!mapReady || !mapRef.current) return;

    function updateTile() {
      if (activeTileLayerRef.current) {
        mapRef.current.removeLayer(activeTileLayerRef.current);
      }

      let newLayer;
      if (mapStyle === 'satellite') {
        newLayer = L.tileLayer(
          'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
          { maxZoom: 18 }
        );
      } else {
        newLayer = L.tileLayer(
          'https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png',
          { maxZoom: 19, subdomains: ['a', 'b', 'c'] }
        );
      }

      newLayer.addTo(mapRef.current);
      activeTileLayerRef.current = newLayer;
    }

    updateTile();
  }, [mapStyle, mapReady]);

  // Update Markers when map is ready or when listings or selectedListing changes
  useEffect(() => {
    if (!mapReady || !mapRef.current || !markersGroupRef.current) return;

    function updateMarkers() {
      markersGroupRef.current.clearLayers();

      listings.forEach((item) => {
        const isSelected = selectedListing?.id === item.id;
        const isReserved = item.status === 'reserved';
        const isSold = item.status === 'sold';

        const customIcon = L.divIcon({
          className: 'leaflet-custom-marker',
          html: `
            <div class="map-price-pill ${isSelected ? 'selected' : ''} ${isReserved ? 'reserved' : ''} ${isSold ? 'sold' : ''}">
              <img src="${item.images[0]}" class="pill-thumb" alt="" />
              <span class="pill-price">${item.pinPrice}</span>
              ${isReserved ? '<span class="pill-dot"></span>' : ''}
            </div>
          `,
          iconSize: [90, 32],
          iconAnchor: [45, 16],
        });

        const marker = L.marker([item.location.lat, item.location.lng], {
          icon: customIcon,
          zIndexOffset: isSelected ? 1000 : 10,
        });

        marker.on('click', () => {
          onSelectListing?.(item);
          mapRef.current?.panTo([item.location.lat, item.location.lng], {
            animate: true,
            duration: 0.4,
          });
        });

        marker.addTo(markersGroupRef.current);
      });
    }

    updateMarkers();
  }, [mapReady, listings, selectedListing, onSelectListing]);

  // Zoom controls
  const handleZoomIn = () => mapRef.current?.zoomIn();
  const handleZoomOut = () => mapRef.current?.zoomOut();
  const handleResetCenter = () => {
    mapRef.current?.flyTo([UDON_CENTER.lat, UDON_CENTER.lng], 13);
    setIsMoved(false);
  };

  return (
    <div className="relative w-full h-full min-h-[600px] overflow-hidden rounded-2xl">
      {/* Map DOM Canvas */}
      <div ref={containerRef} className="w-full h-full min-h-[600px] z-10" />

      {/* Floating Map Controls (Top Right) */}
      <div className="absolute top-4 right-4 z-20 flex flex-col gap-2">
        {/* Zoom Controls */}
        <div className="bg-surface/95 backdrop-blur-xs rounded-xl border border-border shadow-md p-1 flex flex-col gap-1">
          <button
            type="button"
            onClick={handleZoomIn}
            className="w-9 h-9 rounded-lg hover:bg-slate-100 flex items-center justify-center text-foreground font-bold transition-colors cursor-pointer"
            title="ซูมเข้า"
          >
            <span className="material-symbols-outlined text-[20px]">add</span>
          </button>
          <div className="h-px bg-border mx-1"></div>
          <button
            type="button"
            onClick={handleZoomOut}
            className="w-9 h-9 rounded-lg hover:bg-slate-100 flex items-center justify-center text-foreground font-bold transition-colors cursor-pointer"
            title="ซูมออก"
          >
            <span className="material-symbols-outlined text-[20px]">remove</span>
          </button>
        </div>

        {/* Center / Locate Me */}
        <button
          type="button"
          onClick={handleResetCenter}
          className="w-10 h-10 rounded-xl bg-surface/95 backdrop-blur-xs border border-border shadow-md flex items-center justify-center text-primary hover:bg-primary/10 transition-colors cursor-pointer"
          title="จัดกึ่งกลางเมืองอุดรฯ"
        >
          <span className="material-symbols-outlined text-[20px]">my_location</span>
        </button>

        {/* Map Layer Switcher */}
        <button
          type="button"
          onClick={() => setMapStyle((s) => (s === 'street' ? 'satellite' : 'street'))}
          className="px-3 py-1.5 rounded-xl bg-surface/95 backdrop-blur-xs border border-border shadow-md text-xs font-semibold text-foreground hover:bg-slate-50 transition-colors flex items-center gap-1.5 cursor-pointer"
        >
          <span className="material-symbols-outlined text-[16px] text-primary">
            {mapStyle === 'street' ? 'satellite_alt' : 'map'}
          </span>
          <span>{mapStyle === 'street' ? 'ดาวเทียม' : 'แผนที่'}</span>
        </button>
      </div>

      {/* "ค้นหาในบริเวณนี้" button when map is dragged */}
      {isMoved && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20">
          <button
            type="button"
            onClick={() => setIsMoved(false)}
            className="px-4 py-2 rounded-full bg-surface/95 backdrop-blur-md border border-border shadow-lg text-xs font-bold text-primary hover:bg-primary hover:text-white transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <span className="material-symbols-outlined text-[16px]">refresh</span>
            <span>ค้นหาในบริเวณนี้ ({listings.length} รายการ)</span>
          </button>
        </div>
      )}
    </div>
  );
}
