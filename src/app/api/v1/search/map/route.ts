import { NextRequest, NextResponse } from 'next/server';
import { query, SqlParam } from '@/lib/db';
import { numParam, enumParam, errorResponse, BadRequest, DEAL_TYPES, PROPERTY_TYPES, toDbPropertyType } from '@/lib/api-params';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const minLng = numParam(searchParams, 'min_lng', { min: -180, max: 180 });
    const minLat = numParam(searchParams, 'min_lat', { min: -90, max: 90 });
    const maxLng = numParam(searchParams, 'max_lng', { min: -180, max: 180 });
    const maxLat = numParam(searchParams, 'max_lat', { min: -90, max: 90 });
    const propertyType = enumParam(searchParams, 'property_type', PROPERTY_TYPES);
    const dealType = enumParam(searchParams, 'deal_type', DEAL_TYPES);

    const bbox = [minLng, minLat, maxLng, maxLat];
    const given = bbox.filter((v) => v !== null).length;
    if (given !== 0 && given !== 4) {
      throw new BadRequest('bbox requires all of min_lng, min_lat, max_lng, max_lat');
    }
    if (given === 4 && (minLng! >= maxLng! || minLat! >= maxLat!)) {
      throw new BadRequest('bbox min values must be less than max values');
    }

    const conditions: string[] = ["status IN ('active', 'reserved')"];
    const values: SqlParam[] = [];
    let paramIndex = 1;

    // Spatial bounding-box filter
    if (given === 4) {
      conditions.push(
        `ST_Intersects(display_location, ST_MakeEnvelope($${paramIndex++}, $${paramIndex++}, $${paramIndex++}, $${paramIndex++}, 4326)::geography)`
      );
      values.push(minLng!, minLat!, maxLng!, maxLat!);
    }
    if (dealType) {
      conditions.push(`deal_type = $${paramIndex++}`);
      values.push(dealType);
    }
    if (propertyType) {
      conditions.push(`property_type_code = $${paramIndex++}`);
      values.push(toDbPropertyType(propertyType));
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
  } catch (error) {
    return errorResponse('/search/map', error);
  }
}
