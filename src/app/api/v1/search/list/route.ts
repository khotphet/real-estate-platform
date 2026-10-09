import { NextRequest, NextResponse } from 'next/server';
import { query, SqlParam } from '@/lib/db';
import { numParam, enumParam, errorResponse, DEAL_TYPES, PROPERTY_TYPES, toDbPropertyType } from '@/lib/api-params';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const dealType = enumParam(searchParams, 'deal_type', DEAL_TYPES);
    const propertyType = enumParam(searchParams, 'property_type', PROPERTY_TYPES);
    const minPrice = numParam(searchParams, 'min_price', { min: 0 });
    const maxPrice = numParam(searchParams, 'max_price', { min: 0 });
    const bedrooms = numParam(searchParams, 'bedrooms', { min: 0, max: 20 });
    const q = searchParams.get('q')?.trim().slice(0, 100) || null;
    const limit = Math.trunc(numParam(searchParams, 'limit', { min: 1, max: 50 }) ?? 20);
    const offset = Math.trunc(numParam(searchParams, 'offset', { min: 0 }) ?? 0);

    const conditions: string[] = ["status IN ('active', 'reserved')"];
    const values: SqlParam[] = [];
    let paramIndex = 1;

    if (dealType) {
      conditions.push(`deal_type = $${paramIndex++}`);
      values.push(dealType);
    }
    if (propertyType) {
      conditions.push(`property_type_code = $${paramIndex++}`);
      values.push(toDbPropertyType(propertyType));
    }
    if (minPrice !== null) {
      conditions.push(`price_thb >= $${paramIndex++}`);
      values.push(minPrice);
    }
    if (maxPrice !== null) {
      conditions.push(`price_thb <= $${paramIndex++}`);
      values.push(maxPrice);
    }
    if (bedrooms !== null) {
      conditions.push(`bedrooms >= $${paramIndex++}`);
      values.push(bedrooms);
    }
    if (q) {
      conditions.push(`(title ILIKE $${paramIndex} OR project_name ILIKE $${paramIndex})`);
      paramIndex++;
      values.push(`%${q}%`);
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

    const countSql = `SELECT count(*) as total FROM m3_discovery.listing_index ${whereClause};`;
    const countRes = await query<{ total: string }>(countSql, values);
    const total = Number(countRes[0]?.total || 0);

    const dataSql = `
      SELECT 
        listing_id as id,
        public_code as code,
        title,
        deal_type,
        CASE WHEN property_type_code = 'townhouse' THEN 'townhome' ELSE property_type_code END as property_type,
        price_thb as price,
        status,
        bedrooms,
        bathrooms,
        usable_area_sqm,
        land_area_sqw,
        ST_X(display_location::geometry) as lng,
        ST_Y(display_location::geometry) as lat,
        project_name,
        cover_url,
        poster_role,
        agent_verified,
        published_at
      FROM m3_discovery.listing_index
      ${whereClause}
      ORDER BY rank_score DESC, published_at DESC
      LIMIT $${paramIndex++} OFFSET $${paramIndex++};
    `;

    const rows = await query(dataSql, [...values, limit, offset]);

    return NextResponse.json({
      success: true,
      total,
      limit,
      offset,
      items: rows,
    });
  } catch (error) {
    return errorResponse('/search/list', error);
  }
}
