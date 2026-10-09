import type { UserRole } from '@/context/AuthContext';

/**
 * Who may open each route. Single source of truth for the Navbar and <RoleGuard>.
 *  - 'public'        : anyone, including guests
 *  - 'auth'          : any logged-in user
 *  - UserRole[]      : only these roles
 *
 * NOTE: this is client-side gating for the prototype. When real sessions exist,
 * the same rules must also be enforced server-side (middleware + API).
 */
export type Access = 'public' | 'auth' | UserRole[];

export const ROUTE_ACCESS: Record<string, Access> = {
  '/': 'public',
  '/compare': 'public',
  '/demands': 'public',
  '/role-selection': 'public',
  '/saved': 'auth',
  '/appointments': 'auth',
  '/messages': 'auth',
  '/account': 'auth',
  '/demand/create': 'auth',
  '/my-listings': ['owner', 'agent'],
  '/post': ['owner', 'agent'],
  '/packages': ['owner', 'agent'],
  '/agent-hub': ['agent'],
  '/admin': ['admin'],
};

export function canAccess(access: Access, role: UserRole | null | undefined): boolean {
  if (access === 'public') return true;
  if (!role) return false;
  if (access === 'auth') return true;
  return access.includes(role);
}

export function canAccessPath(path: string, role: UserRole | null | undefined): boolean {
  return canAccess(ROUTE_ACCESS[path] ?? 'public', role);
}
