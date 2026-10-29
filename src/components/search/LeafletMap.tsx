'use client';

import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { Plus, Minus, Crosshair, RotateCw } from 'lucide-react';
import type { Listing } from '@/types/listing';
import { THAILAND_CENTER } from '@/data/provinces';
import { POINTS_OF_INTEREST, PoiCategory, PointOfInterest } from '@/data/poi';

interface LeafletMapProps {
  listings: Listing[];
  selectedListing?: Listing;
  onSelectListing?: (listing: Listing) => void;
  onBoundsChange?: (bounds: { minLat: number; maxLat: number; minLng: number; maxLng: number }) => void;
  center?: { lat: number; lng: number };
  zoom?: number;
  provinceName?: string;
  onZoomToStreet?: () => void;
}

const NATIONWIDE_LANDMARKS = [
  // อุดรธานี
  { province: 'อุดรธานี', name: 'หนองประจักษ์', emoji: '🌳', lat: 17.4225, lng: 102.7842 },
  { province: 'อุดรธานี', name: 'เซ็นทรัล อุดรฯ', emoji: '🏬', lat: 17.4052, lng: 102.7995 },
  { province: 'อุดรธานี', name: 'UD Town', emoji: '🛍️', lat: 17.4068, lng: 102.8055 },
  { province: 'อุดรธานี', name: 'สนามบินอุดรธานี', emoji: '✈️', lat: 17.3865, lng: 102.7885 },

  // กรุงเทพมหานคร
  { province: 'กรุงเทพมหานคร', name: 'สยามพารากอน', emoji: '🏬', lat: 13.7460, lng: 100.5348 },
  { province: 'กรุงเทพมหานคร', name: 'ไอคอนสยาม', emoji: '🏬', lat: 13.7267, lng: 100.5105 },
  { province: 'กรุงเทพมหานคร', name: 'สุวรรณภูมิ (BKK)', emoji: '✈️', lat: 13.6900, lng: 100.7501 },

  // เชียงใหม่
  { province: 'เชียงใหม่', name: 'วันนิมมาน', emoji: '🛍️', lat: 18.7998, lng: 98.9682 },
  { province: 'เชียงใหม่', name: 'ประตูท่าแพ', emoji: '🏰', lat: 18.7877, lng: 98.9933 },

  // ชลบุรี
  { province: 'ชลบุรี', name: 'หาดพัทยา', emoji: '🏖️', lat: 12.9350, lng: 100.8810 },

  // ภูเก็ต
  { province: 'ภูเก็ต', name: 'หาดป่าตอง', emoji: '🏖️', lat: 7.8960, lng: 98.2970 },
  { province: 'ภูเก็ต', name: 'สนามบินภูเก็ต (HKT)', emoji: '✈️', lat: 8.1130, lng: 98.3160 },

  // ขอนแก่น
  { province: 'ขอนแก่น', name: 'เซ็นทรัล ขอนแก่น', emoji: '🏬', lat: 16.4325, lng: 102.8240 },
];

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

// Generate realistic, recognizable brand badge HTML
function getPoiMarkerHtml(poi: PointOfInterest, isDetailed: boolean) {
  if (poi.subType === '7-Eleven') {
    return `
      <div class="map-brand-badge brand-7eleven" title="${poi.name}">
        <span class="brand-logo-7">7</span>
        <span>7-Eleven</span>
        ${isDetailed ? `<span style="font-size:10px; opacity:0.9;">(${poi.name.replace('7-Eleven', '').replace('สาขา', '').trim()})</span>` : ''}
      </div>
    `;
  }
  if (poi.subType === 'CJ More') {
    return `
      <div class="map-brand-badge brand-cj" title="${poi.name}">
        <span class="brand-logo-cj">CJ</span>
        <span>CJ More</span>
      </div>
    `;
  }
  if (poi.subType === 'Lotus Go Fresh') {
    return `
      <div class="map-brand-badge brand-lotus" title="${poi.name}">
        <span class="brand-logo-lotus">Lotus</span>
        <span>Go Fresh</span>
      </div>
    `;
  }
  if (poi.category === 'market') {
    return `
      <div class="map-brand-badge brand-market" title="${poi.name}">
        <span class="badge-emoji">🛒</span>
        <span>${poi.name}</span>
      </div>
    `;
  }
  if (poi.subType === 'ร้านสะดวกซัก') {
    return `
      <div class="map-brand-badge brand-laundry" title="${poi.name}">
        <span class="badge-emoji">🫧</span>
        <span>${poi.name}</span>
      </div>
    `;
  }
  if (poi.subType === 'EV Charger') {
    return `
      <div class="map-brand-badge brand-ev" title="${poi.name}">
        <span class="badge-emoji">⚡</span>
        <span>${poi.name}</span>
      </div>
    `;
  }
  if (poi.subType === 'ร้านขายยา') {
    return `
      <div class="map-brand-badge brand-pharmacy" title="${poi.name}">
        <span class="badge-emoji">💊</span>
        <span>${poi.name}</span>
      </div>
    `;
  }
  return `
    <div class="map-brand-badge brand-service" title="${poi.name}">
      <span class="badge-emoji">📍</span>
      <span>${poi.name}</span>
    </div>
  `;
}

export default function LeafletMap({
  listings,
  selectedListing,
  onSelectListing,
  onBoundsChange,
  center,
  zoom,
  provinceName,
}: LeafletMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const mapRef = useRef<any>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const markersGroupRef = useRef<any>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const landmarksGroupRef = useRef<any>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const poiGroupRef = useRef<any>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const proximityGroupRef = useRef<any>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const activeTileLayerRef = useRef<any>(null);

  const [mapReady, setMapReady] = useState(false);
  // Default to Google Maps streets view with Thai labels
  const [mapStyle, setMapStyle] = useState<'google_streets' | 'google_satellite' | 'osm'>('google_streets');
  const [isMoved, setIsMoved] = useState(false);
  const [currentZoom, setCurrentZoom] = useState<number>(zoom || 13);

  // Active POI Category toggles
  const [activePoiCategories, setActivePoiCategories] = useState<PoiCategory[]>([
    'convenience',
    'market',
    'service',
  ]);

  const togglePoiCategory = (cat: PoiCategory) => {
    setActivePoiCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );
  };

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

      const initialCenter = center || { lat: 13.736717, lng: 100.523186 };
      const initialZoom = zoom || (center ? 12 : 6);

      const map = L.map(containerRef.current, {
        center: [initialCenter.lat, initialCenter.lng],
        zoom: initialZoom,
        zoomControl: false,
        attributionControl: false,
      });

      // Google Maps Real Street Layer with Thai Language
      const googleStreetLayer = L.tileLayer(
        'https://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}&hl=th',
        {
          maxZoom: 20,
          subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
        }
      );

      googleStreetLayer.addTo(map);
      activeTileLayerRef.current = googleStreetLayer;

      // Layer groups in order
      proximityGroupRef.current = L.layerGroup().addTo(map);
      poiGroupRef.current = L.layerGroup().addTo(map);
      landmarksGroupRef.current = L.layerGroup().addTo(map);
      markersGroupRef.current = L.layerGroup().addTo(map);

      // Track drag / move and zoom
      map.on('moveend', () => {
        setIsMoved(true);
        setCurrentZoom(map.getZoom());
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

      map.on('zoomend', () => {
        setCurrentZoom(map.getZoom());
      });

      mapRef.current = map;
      setCurrentZoom(initialZoom);
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

  // Handle Tile Style Change: Google Maps / Google Satellite / OSM
  useEffect(() => {
    if (!mapReady || !mapRef.current) return;

    function updateTile() {
      if (activeTileLayerRef.current) {
        mapRef.current.removeLayer(activeTileLayerRef.current);
      }

      let newLayer;
      if (mapStyle === 'google_satellite') {
        newLayer = L.tileLayer(
          'https://{s}.google.com/vt/lyrs=y&x={x}&y={y}&z={z}&hl=th',
          { maxZoom: 20, subdomains: ['mt0', 'mt1', 'mt2', 'mt3'] }
        );
      } else if (mapStyle === 'osm') {
        newLayer = L.tileLayer(
          'https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png',
          { maxZoom: 19, subdomains: ['a', 'b', 'c'] }
        );
      } else {
        // Default: Real Google Maps Streets (Thai language, native Google colors)
        newLayer = L.tileLayer(
          'https://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}&hl=th',
          { maxZoom: 20, subdomains: ['mt0', 'mt1', 'mt2', 'mt3'] }
        );
      }

      newLayer.addTo(mapRef.current);
      activeTileLayerRef.current = newLayer;
    }

    updateTile();
  }, [mapStyle, mapReady]);

  // Pan / FlyTo when center or zoom changes
  useEffect(() => {
    if (!mapReady || !mapRef.current || !center) return;
    mapRef.current.flyTo([center.lat, center.lng], zoom || 12, {
      animate: true,
      duration: 0.8,
    });
    setIsMoved(false);
  }, [center?.lat, center?.lng, zoom, mapReady]);

  // Update Landmarks with recognizable emojis
  useEffect(() => {
    if (!mapReady || !mapRef.current || !landmarksGroupRef.current) return;
    landmarksGroupRef.current.clearLayers();

    const activeLandmarks = provinceName && provinceName !== 'all'
      ? NATIONWIDE_LANDMARKS.filter((l) => l.province === provinceName)
      : NATIONWIDE_LANDMARKS;

    activeLandmarks.forEach((lm) => {
      const landmarkIcon = L.divIcon({
        className: 'leaflet-landmark-marker',
        html: `
          <div class="map-landmark-badge">
            <span style="font-size: 13px;">${lm.emoji}</span>
            <span>${lm.name}</span>
          </div>
        `,
        iconSize: [120, 24],
        iconAnchor: [60, 12],
      });
      L.marker([lm.lat, lm.lng], { icon: landmarkIcon, interactive: false }).addTo(landmarksGroupRef.current);
    });
  }, [mapReady, provinceName]);

  // Update POI Markers based on zoom & filters
  useEffect(() => {
    if (!mapReady || !mapRef.current || !poiGroupRef.current) return;
    poiGroupRef.current.clearLayers();

    if (currentZoom < 11) return;

    const relevantPois = POINTS_OF_INTEREST.filter((poi) => {
      if (provinceName && provinceName !== 'all' && poi.province !== provinceName) {
        return false;
      }
      return activePoiCategories.includes(poi.category);
    });

    relevantPois.forEach((poi) => {
      const isDetailed = currentZoom >= 14;

      const poiIcon = L.divIcon({
        className: 'leaflet-poi-marker',
        html: getPoiMarkerHtml(poi, isDetailed),
        iconSize: [130, 26],
        iconAnchor: [65, 13],
      });

      const marker = L.marker([poi.lat, poi.lng], {
        icon: poiIcon,
        zIndexOffset: 150,
      });

      marker.bindPopup(`
        <div style="font-family: inherit; font-size: 12px; line-height: 1.4; min-width: 170px; padding: 2px;">
          <div style="font-weight: 700; color: ${poi.color}; font-size: 13px; margin-bottom: 2px;">
            ${poi.name}
          </div>
          <div style="display: inline-block; font-size: 10px; font-weight: 700; padding: 2px 6px; background: #f1f5f9; border-radius: 6px; color: #334155; margin-bottom: 5px;">
            ${poi.categoryLabel} • ${poi.subType}
          </div>
          <div style="color: #64748b; font-size: 11px;">
            ${poi.distanceDesc || ''}
          </div>
        </div>
      `);

      marker.addTo(poiGroupRef.current);
    });
  }, [mapReady, provinceName, activePoiCategories, currentZoom]);

  // Update Proximity Halo and Walking Connectors when selectedListing changes
  useEffect(() => {
    if (!mapReady || !mapRef.current || !proximityGroupRef.current) return;
    proximityGroupRef.current.clearLayers();

    if (!selectedListing) return;

    const propLat = selectedListing.location.lat;
    const propLng = selectedListing.location.lng;

    // 1. Draw 500m Walking Radius Circle
    const circle = L.circle([propLat, propLng], {
      radius: 500,
      color: '#0F766E',
      fillColor: '#0F766E',
      fillOpacity: 0.08,
      weight: 1.5,
      dashArray: '5, 5',
    });
    circle.addTo(proximityGroupRef.current);

    // 2. Find closest POI for each active category
    const categories: PoiCategory[] = ['convenience', 'market', 'service'];
    categories.forEach((cat) => {
      if (!activePoiCategories.includes(cat)) return;

      const candidates = POINTS_OF_INTEREST.filter(
        (p) => p.category === cat && (!selectedListing.location.province || p.province === selectedListing.location.province)
      )
        .map((p) => ({
          ...p,
          dist: getDistanceMeters(propLat, propLng, p.lat, p.lng),
        }))
        .sort((a, b) => a.dist - b.dist);

      const closest = candidates[0];
      if (closest && closest.dist <= 2500) {
        // Draw dashed connector line from property to nearest POI
        const line = L.polyline(
          [
            [propLat, propLng],
            [closest.lat, closest.lng],
          ],
          {
            color: closest.color,
            weight: 2,
            dashArray: '4, 6',
            opacity: 0.85,
          }
        );
        line.addTo(proximityGroupRef.current);

        // Midpoint badge
        const midLat = (propLat + closest.lat) / 2;
        const midLng = (propLng + closest.lng) / 2;
        const walkMin = Math.max(1, Math.round(closest.dist / 80));
        const distText = closest.dist < 1000 ? `${closest.dist} ม.` : `${(closest.dist / 1000).toFixed(1)} กม.`;

        const distBadge = L.divIcon({
          className: 'leaflet-proximity-badge',
          html: `
            <div class="proximity-pill" style="background: ${closest.color}">
              <span>🚶 ${distText} (${walkMin}น.)</span>
            </div>
          `,
          iconSize: [90, 20],
          iconAnchor: [45, 10],
        });

        L.marker([midLat, midLng], { icon: distBadge, interactive: false }).addTo(
          proximityGroupRef.current
        );
      }
    });
  }, [mapReady, selectedListing, activePoiCategories]);

  // Update Property Markers
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
          zIndexOffset: isSelected ? 1000 : 200,
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
    if (center) {
      mapRef.current?.flyTo([center.lat, center.lng], zoom || 12);
    } else {
      mapRef.current?.flyTo([THAILAND_CENTER.lat, THAILAND_CENTER.lng], 6);
    }
    setIsMoved(false);
  };

  const handleZoomToStreetLevel = () => {
    if (selectedListing) {
      mapRef.current?.flyTo(
        [selectedListing.location.lat, selectedListing.location.lng],
        16,
        { animate: true, duration: 0.8 }
      );
    } else if (center) {
      mapRef.current?.flyTo([center.lat, center.lng], 15, { animate: true, duration: 0.8 });
    }
  };

  return (
    <div className="relative w-full h-full min-h-[600px] overflow-hidden rounded-2xl">
      {/* Map DOM Canvas */}
      <div ref={containerRef} className="w-full h-full min-h-[600px] z-10" />

      {/* Floating POI Layer Toggles (Top Left - Single Row Horizontal Scroll) */}
      <div className="absolute top-3 left-3 z-20 flex items-center gap-1.5 max-w-[calc(100%-125px)] sm:max-w-[calc(100%-150px)] overflow-x-auto no-scrollbar pointer-events-auto py-0.5">
        <span className="hidden md:inline-flex shrink-0 px-2.5 py-1 rounded-lg bg-surface/90 backdrop-blur-xs text-[10px] font-bold text-muted border border-border shadow-xs uppercase tracking-wider">
          ชั้นข้อมูล:
        </span>

        {/* 7-Eleven / Convenience button */}
        <button
          type="button"
          onClick={() => togglePoiCategory('convenience')}
          className={`shrink-0 px-2.5 py-1.5 rounded-xl text-xs font-bold border transition-all flex items-center gap-1.5 shadow-sm cursor-pointer ${
            activePoiCategories.includes('convenience')
              ? 'bg-emerald-700 text-white border-emerald-800 ring-2 ring-emerald-500/20'
              : 'bg-surface/85 backdrop-blur-xs text-muted border-border hover:text-foreground opacity-60'
          }`}
          title="เปิด/ปิด หมุดร้านสะดวกซื้อ 7-Eleven, CJ, Lotus"
        >
          <span className="bg-white text-emerald-800 text-[10px] font-black px-1.5 py-0.2 rounded">7</span>
          <span>ร้านสะดวกซื้อ</span>
        </button>

        {/* Market button */}
        <button
          type="button"
          onClick={() => togglePoiCategory('market')}
          className={`shrink-0 px-2.5 py-1.5 rounded-xl text-xs font-bold border transition-all flex items-center gap-1.5 shadow-sm cursor-pointer ${
            activePoiCategories.includes('market')
              ? 'bg-amber-600 text-white border-amber-700 ring-2 ring-amber-500/20'
              : 'bg-surface/85 backdrop-blur-xs text-muted border-border hover:text-foreground opacity-60'
          }`}
          title="เปิด/ปิด หมุดตลาดสด และไนท์มาร์เก็ต"
        >
          <span>🛒</span>
          <span>ตลาดสด & นัด</span>
        </button>

        {/* Service / Laundry button */}
        <button
          type="button"
          onClick={() => togglePoiCategory('service')}
          className={`shrink-0 px-2.5 py-1.5 rounded-xl text-xs font-bold border transition-all flex items-center gap-1.5 shadow-sm cursor-pointer ${
            activePoiCategories.includes('service')
              ? 'bg-sky-600 text-white border-sky-700 ring-2 ring-sky-500/20'
              : 'bg-surface/85 backdrop-blur-xs text-muted border-border hover:text-foreground opacity-60'
          }`}
          title="เปิด/ปิด หมุดร้านบริการ ซักรีด 24h, ร้านยา, ชาร์จ EV"
        >
          <span>🫧</span>
          <span>ร้านบริการ & ซักรีด</span>
        </button>
      </div>

      {/* "ค้นหาในบริเวณนี้" button - Placed neatly at top-14 center, NEVER overlapping top chips */}
      {isMoved && (
        <div className="absolute top-14 left-1/2 -translate-x-1/2 z-25 pointer-events-auto animate-in fade-in slide-in-from-top-2 duration-200">
          <button
            type="button"
            onClick={() => setIsMoved(false)}
            className="px-4 py-2 rounded-full bg-white/95 backdrop-blur-md border border-slate-200 shadow-xl text-xs font-bold text-slate-800 hover:text-primary hover:bg-white active:scale-95 transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap ring-1 ring-black/5"
          >
            <RotateCw className="w-3.5 h-3.5 text-primary animate-spin-once" />
            <span>ค้นหาในบริเวณนี้ ({listings.length} รายการ)</span>
          </button>
        </div>
      )}

      {/* Street View Zoom / 500m Walking Helper - Placed at bottom-left on desktop (100% collision-free) */}
      {selectedListing && (
        <div className="absolute bottom-4 left-4 z-20 hidden md:flex items-center gap-2 pointer-events-auto">
          {currentZoom < 14 ? (
            <button
              type="button"
              onClick={handleZoomToStreetLevel}
              className="px-3.5 py-2 rounded-xl bg-surface/95 backdrop-blur-md border border-primary/30 text-primary hover:bg-primary hover:text-white shadow-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <span>🔍</span>
              <span>ซูมระดับถนน 500 ม. ดูร้านใกล้เคียง</span>
            </button>
          ) : (
            <div className="px-3.5 py-2 rounded-xl bg-primary text-white shadow-lg text-xs font-bold flex items-center gap-1.5">
              <span>🎯</span>
              <span>รัศมีเดิน 500 ม. รอบแปลงที่เลือก</span>
            </div>
          )}
        </div>
      )}

      {/* Floating Map Controls (Top Right) */}
      <div className="absolute top-3 right-3 z-20 flex flex-col items-end gap-2 pointer-events-none">
        {/* Layer Switcher: Real Google Maps / Satellite */}
        <div className="pointer-events-auto bg-surface/95 backdrop-blur-md rounded-xl border border-border shadow-md p-1 flex flex-col gap-1">
          <button
            type="button"
            onClick={() => setMapStyle('google_streets')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              mapStyle === 'google_streets'
                ? 'bg-primary text-white shadow-xs'
                : 'text-muted hover:text-foreground hover:bg-slate-50'
            }`}
            title="Google Maps สไตล์มาตรฐาน ภาษาไทย"
          >
            <span>🗺️</span>
            <span className="hidden sm:inline">Google Maps</span>
          </button>
          <button
            type="button"
            onClick={() => setMapStyle('google_satellite')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              mapStyle === 'google_satellite'
                ? 'bg-primary text-white shadow-xs'
                : 'text-muted hover:text-foreground hover:bg-slate-50'
            }`}
            title="ภาพถ่ายดาวเทียม Google คมชัดสูง"
          >
            <span>🛰️</span>
            <span className="hidden sm:inline">ดาวเทียม</span>
          </button>
        </div>

        {/* Zoom Controls (+ / -) */}
        <div className="pointer-events-auto w-10 bg-surface/95 backdrop-blur-md rounded-xl border border-border shadow-md flex flex-col items-center overflow-hidden">
          <button
            type="button"
            onClick={handleZoomIn}
            className="w-10 h-10 flex items-center justify-center text-slate-700 hover:bg-slate-100 hover:text-primary active:scale-95 transition-all cursor-pointer"
            title="ซูมเข้า"
            aria-label="ซูมเข้า"
          >
            <Plus className="w-5 h-5 stroke-[2.5]" />
          </button>
          <div className="w-6 h-px bg-border"></div>
          <button
            type="button"
            onClick={handleZoomOut}
            className="w-10 h-10 flex items-center justify-center text-slate-700 hover:bg-slate-100 hover:text-primary active:scale-95 transition-all cursor-pointer"
            title="ซูมออก"
            aria-label="ซูมออก"
          >
            <Minus className="w-5 h-5 stroke-[2.5]" />
          </button>
        </div>

        {/* Center / Locate Me */}
        <button
          type="button"
          onClick={handleResetCenter}
          className="pointer-events-auto w-10 h-10 rounded-xl bg-surface/95 backdrop-blur-md border border-border shadow-md flex items-center justify-center text-primary hover:bg-primary/10 active:scale-95 transition-all cursor-pointer"
          title="จัดกึ่งกลางแผนที่"
          aria-label="จัดกึ่งกลางแผนที่"
        >
          <Crosshair className="w-5 h-5 stroke-[2.2]" />
        </button>
      </div>
    </div>
  );
}
