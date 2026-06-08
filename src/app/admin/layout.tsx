import { getSession } from '@/lib/session';
import AdminLayoutClient from '@/components/admin/AdminLayoutClient';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();

  if (!session) {
    return <>{children}</>;
  }

  const initials = session?.email?.slice(0, 2).toUpperCase() ?? 'AD';
  const email = session?.email ?? 'Admin';

  return (
    <AdminLayoutClient initials={initials} email={email}>
      {children}
    </AdminLayoutClient>
  );
}
