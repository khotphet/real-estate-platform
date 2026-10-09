import { NextResponse } from 'next/server';

export class BadRequest extends Error {}

/** Optional non-negative number param. Throws BadRequest when present but invalid. */
export function numParam(sp: URLSearchParams, name: string, opts: { min?: number; max?: number } = {}): number | null {
  const raw = sp.get(name);
  if (raw === null || raw.trim() === '') return null;
  const n = Number(raw);
  if (!Number.isFinite(n)) throw new BadRequest(`${name} must be a number`);
  if (opts.min !== undefined && n < opts.min) throw new BadRequest(`${name} must be >= ${opts.min}`);
  if (opts.max !== undefined && n > opts.max) throw new BadRequest(`${name} must be <= ${opts.max}`);
  return n;
}

/** Optional enum param. Throws BadRequest when present but not allowed. */
export function enumParam<T extends string>(sp: URLSearchParams, name: string, allowed: readonly T[]): T | null {
  const raw = sp.get(name);
  if (raw === null || raw === '' || raw === 'all') return null;
  if (!(allowed as readonly string[]).includes(raw)) {
    throw new BadRequest(`${name} must be one of: ${allowed.join(', ')}`);
  }
  return raw as T;
}

export const DEAL_TYPES = ['sale', 'rent'] as const;
export const PROPERTY_TYPES = ['condo', 'house', 'townhome', 'land'] as const;

/** Frontend uses 'townhome'; DB property_types uses 'townhouse'. */
export const toDbPropertyType = (t: string) => (t === 'townhome' ? 'townhouse' : t);

/** Map errors to responses without leaking DB internals. */
export function errorResponse(route: string, error: unknown) {
  if (error instanceof BadRequest) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
  console.error(`API ${route} error:`, error);
  return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
}
