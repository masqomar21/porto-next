import { getSession } from '@/lib/session';
import Sidebar from '@/components/admin/Sidebar';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();
  const initials = session?.email?.slice(0, 2).toUpperCase() ?? 'AD';

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      <Sidebar />
      <div className="flex-1 lg:ml-64 min-h-screen flex flex-col">
        <header className="h-16 bg-card border-b border-border flex items-center justify-end px-6 md:px-12 sticky top-0 z-40">
          <div className="flex items-center gap-2 px-4 py-1.5 bg-muted/30 border border-border rounded-full">
            <div className="w-7 h-7 bg-gradient-to-br from-violet-600 to-fuchsia-600 rounded-full flex items-center justify-center text-xs font-bold text-white shadow-sm">
              {initials}
            </div>
            <span className="text-sm text-muted-foreground">{session?.email ?? 'Admin'}</span>
          </div>
        </header>
        <main className="p-6 md:p-12 max-w-6xl w-full mx-auto flex-1">
          {children}
        </main>
      </div>
    </div>
  );
}
