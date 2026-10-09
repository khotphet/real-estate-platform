import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const dealType = searchParams.get('deal_type');
    const propertyType = searchParams.get('property_type');
    const minPrice = searchParams.get('min_price');
    const maxPrice = searchParams.get('max_price');
    const bedrooms = searchParams.get('bedrooms');
    const q = searchParams.get('q');
    const limit = Math.min(Number(searchParams.get('limit')) || 20, 50);
    const offset = Number(searchParams.get('offset')) || 0;

    const conditions: string[] = ["status IN ('active', 'reserved')"];
    const values: any[] = [];
    let paramIndex = 1;

    if (dealType) {
      conditions.push(`deal_type = $${paramIndex++}`);
      values.push(dealType);
    }

    if (propertyType && propertyType !== 'all') {
      const typeCode = propertyType === 'townhome' ? 'townhouse' : propertyType;
      conditions.push(`property_type_code = $${paramIndex++}`);
      values.push(typeCode);
    }

    if (minPrice) {
      conditions.push(`price_thb >= $${paramIndex++}`);
      values.push(Number(minPrice));
    }

    if (maxPrice) {
      conditions.push(`price_thb <= $${paramIndex++}`);
      values.push(Number(maxPrice));
    }

    if (bedrooms) {
      conditions.push(`bedrooms >= $${paramIndex++}`);
      values.push(Number(bedrooms));
    }

    if (q && q.trim()) {
      conditions.push(`(title ILIKE $${paramIndex++} OR project_name ILIKE $${paramIndex - 1})`);
      values.push(`%${q.trim()}%`);
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
  } catch (error: any) {
    console.error('API /search/list error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Database query failed' },
      { status: 500 }
    );
  }
}
