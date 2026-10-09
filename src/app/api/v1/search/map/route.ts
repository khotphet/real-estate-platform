import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const minLng = searchParams.get('min_lng');
    const minLat = searchParams.get('min_lat');
    const maxLng = searchParams.get('max_lng');
    const maxLat = searchParams.get('max_lat');
    const propertyType = searchParams.get('property_type');
    const dealType = searchParams.get('deal_type');

    const conditions: string[] = ["status IN ('active', 'reserved')"];
    const values: any[] = [];
    let paramIndex = 1;

    // Spatial Bounding Box Filter using ST_MakeEnvelope
    if (minLng && minLat && maxLng && maxLat) {
      conditions.push(
        `ST_Intersects(display_location, ST_MakeEnvelope($${paramIndex++}, $${paramIndex++}, $${paramIndex++}, $${paramIndex++}, 4326)::geography)`
      );
      values.push(Number(minLng), Number(minLat), Number(maxLng), Number(maxLat));
    }

    if (dealType) {
      conditions.push(`deal_type = $${paramIndex++}`);
      values.push(dealType);
    }

    if (propertyType && propertyType !== 'all') {
      const typeCode = propertyType === 'townhome' ? 'townhouse' : propertyType;
      conditions.push(`property_type_code = $${paramIndex++}`);
      values.push(typeCode);
    }

    const whereClause = `WHERE ${conditions.join(' AND ')}`;

    const sql = `
      SELECT 
        listing_id as id,
        public_code as code,
        title,
        deal_type,
        CASE WHEN property_type_code = 'townhouse' THEN 'townhome' ELSE property_type_code END as property_type,
        price_thb as price,
        CASE 
          WHEN price_thb >= 1000000 THEN '฿' || ROUND(price_thb::numeric / 1000000, 2) || 'M'
          ELSE '฿' || TO_CHAR(price_thb, 'FM999,999')
        END as pin_price,
        status,
        ST_X(display_location::geometry) as lng,
        ST_Y(display_location::geometry) as lat,
        project_name,
        cover_url
      FROM m3_discovery.listing_index
      ${whereClause}
      ORDER BY rank_score DESC
      LIMIT 100;
    `;

    const pins = await query(sql, values);

    return NextResponse.json({
      success: true,
      count: pins.length,
      pins,
    });
  } catch (error: any) {
    console.error('API /search/map error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Spatial map query failed' },
      { status: 500 }
    );
  }
}
