import { RoleGuard } from '@/components/auth/RoleGuard';
import { ROUTE_ACCESS } from '@/lib/access';

export default function Layout({ children }: { children: React.ReactNode }) {
  return <RoleGuard access={ROUTE_ACCESS['/demand/create']}>{children}</RoleGuard>;
}
