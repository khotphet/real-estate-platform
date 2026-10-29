import { NextRequest, NextResponse } from 'next/server';
import { PointOfInterest, POINTS_OF_INTEREST } from '@/data/poi';

export const dynamic = 'force-dynamic';

// In-memory cache for live POI queries to avoid hitting Overpass rate limits
interface CacheEntry {
  data: PointOfInterest[];
  expiresAt: number;
}
const cache = new Map<string, CacheEntry>();

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const minLat = searchParams.get('minLat');
    const minLng = searchParams.get('minLng');
    const maxLat = searchParams.get('maxLat');
    const maxLng = searchParams.get('maxLng');

    const centerLat = searchParams.get('lat');
    const centerLng = searchParams.get('lng');
    const radius = searchParams.get('radius') || '1500';

    let overpassFilter = '';
    let cacheKey = '';

    if (centerLat && centerLng) {
      const lat = parseFloat(centerLat);
      const lng = parseFloat(centerLng);
      const rad = parseInt(radius, 10);
      cacheKey = `around_${lat.toFixed(3)}_${lng.toFixed(3)}_${rad}`;
      overpassFilter = `
        node["shop"="convenience"](around:${rad},${lat},${lng});
        node["amenity"="marketplace"](around:${rad},${lat},${lng});
        node["shop"="supermarket"](around:${rad},${lat},${lng});
        node["shop"="laundry"](around:${rad},${lat},${lng});
        node["amenity"="pharmacy"](around:${rad},${lat},${lng});
        node["amenity"="charging_station"](around:${rad},${lat},${lng});
      `;
    } else if (minLat && minLng && maxLat && maxLng) {
      const s = parseFloat(minLat);
      const w = parseFloat(minLng);
      const n = parseFloat(maxLat);
      const e = parseFloat(maxLng);

      // Guard: bbox cannot be overly massive (limit to ~0.4 deg for fast response)
      if (Math.abs(n - s) > 0.4 || Math.abs(e - w) > 0.4) {
        return NextResponse.json({
          source: 'curated_fallback',
          count: 0,
          pois: [],
          message: 'ซูมเข้าใกล้กว่านี้เพื่อดึงข้อมูลสด (Zoom in closer for live scan)',
        });
      }

      cacheKey = `bbox_${s.toFixed(3)}_${w.toFixed(3)}_${n.toFixed(3)}_${e.toFixed(3)}`;
      overpassFilter = `
        node["shop"="convenience"](${s},${w},${n},${e});
        node["amenity"="marketplace"](${s},${w},${n},${e});
        node["shop"="supermarket"](${s},${w},${n},${e});
        node["shop"="laundry"](${s},${w},${n},${e});
        node["amenity"="pharmacy"](${s},${w},${n},${e});
        node["amenity"="charging_station"](${s},${w},${n},${e});
      `;
    } else {
      return NextResponse.json(
        { error: 'Missing coordinates (bbox minLat,minLng,maxLat,maxLng or lat,lng required)' },
        { status: 400 }
      );
    }

    // Check Cache (5 minutes TTL)
    const now = Date.now();
    const cached = cache.get(cacheKey);
    if (cached && cached.expiresAt > now) {
      return NextResponse.json({
        source: 'live_cache',
        count: cached.data.length,
        pois: cached.data,
      });
    }

    // Overpass Query
    const overpassQuery = `[out:json][timeout:12];(${overpassFilter});out body 35;`;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 9000);

    const response = await fetch('https://overpass-api.de/api/interpreter', {
      method: 'POST',
      headers: {
        'User-Agent': 'MapNest-RealEstate-Platform/1.0 (contact@mapnest.io)',
        'Content-Type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json',
      },
      body: 'data=' + encodeURIComponent(overpassQuery),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`Overpass returned status ${response.status}`);
    }

    const data = await response.json();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const elements: any[] = data.elements || [];

    // Transform OSM nodes into PointOfInterest format
    const livePois: PointOfInterest[] = elements.map((el) => {
      const tags = el.tags || {};
      const rawName = tags['name:th'] || tags.name || tags.brand || '';
      const shop = tags.shop || '';
      const amenity = tags.amenity || '';

      let category: 'convenience' | 'market' | 'service' = 'convenience';
      let categoryLabel = 'ร้านสะดวกซื้อ';
      let subType = 'ร้านสะดวกซื้อ';
      let color = '#16a34a';
      let icon = 'storefront';
      let cleanName = rawName;

      // Classify
      if (shop === 'convenience' || tags.brand === '7-Eleven') {
        category = 'convenience';
        categoryLabel = 'ร้านสะดวกซื้อ 24 ชม.';
        subType = '7-Eleven';
        color = '#16a34a';
        icon = 'storefront';

        if (rawName.toLowerCase().includes('cj') || tags.brand?.toLowerCase().includes('cj')) {
          subType = 'CJ More';
          cleanName = rawName || 'CJ More';
        } else if (rawName.toLowerCase().includes('lotus') || tags.brand?.toLowerCase().includes('lotus')) {
          subType = 'Lotus Go Fresh';
          cleanName = rawName || "Lotus's Go Fresh";
        } else if (!cleanName) {
          cleanName = '7-Eleven';
        }
      } else if (amenity === 'marketplace' || shop === 'supermarket') {
        category = 'market';
        categoryLabel = 'ตลาดสด & ซูเปอร์มาร์เก็ต';
        subType = amenity === 'marketplace' ? 'ตลาดสด' : 'ซูเปอร์มาร์เก็ต';
        color = '#ea580c';
        icon = 'shopping_basket';
        if (!cleanName) cleanName = 'ตลาดสดชุมชน';
      } else if (shop === 'laundry' || amenity === 'pharmacy' || amenity === 'charging_station') {
        category = 'service';
        categoryLabel = 'ร้านบริการ';
        icon = 'local_laundry_service';
        color = '#0284c7';

        if (shop === 'laundry') {
          subType = 'ร้านสะดวกซัก';
          color = '#0284c7';
          icon = 'local_laundry_service';
          if (!cleanName) cleanName = 'Otteri / ร้านสะดวกซัก 24h';
        } else if (amenity === 'charging_station') {
          subType = 'EV Charger';
          color = '#059669';
          icon = 'ev_station';
          if (!cleanName) cleanName = 'สถานีชาร์จรถไฟฟ้า EV';
        } else if (amenity === 'pharmacy') {
          subType = 'ร้านขายยา';
          color = '#0d9488';
          icon = 'medical_services';
          if (!cleanName) cleanName = 'ร้านขายยาและเวชภัณฑ์';
        }
      }

      return {
        id: `osm-${el.id}`,
        name: cleanName,
        category,
        categoryLabel,
        subType,
        province: '', // Live data from GPS
        lat: el.lat,
        lng: el.lon,
        distanceDesc: tags['opening_hours'] ? `เวลาทำการ: ${tags['opening_hours']}` : 'พิกัดสดจริงจากดาวเทียม',
        icon,
        color,
      };
    });

    // Save to Cache (5 minutes)
    cache.set(cacheKey, {
      data: livePois,
      expiresAt: now + 5 * 60 * 1000,
    });

    return NextResponse.json({
      source: 'live_overpass_osm',
      count: livePois.length,
      pois: livePois,
    });
  } catch (error: any) {
    console.warn('Overpass API query failed or timed out, returning fallback:', error.message);
    // Graceful fallback to curated data
    return NextResponse.json({
      source: 'curated_fallback',
      count: POINTS_OF_INTEREST.length,
      pois: POINTS_OF_INTEREST,
      warning: 'Live scan momentarily busy, displaying verified local stations',
    });
  }
}
