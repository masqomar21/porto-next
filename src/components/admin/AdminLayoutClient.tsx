'use client';

import React, { useState } from 'react';
import Sidebar from './Sidebar';
import { Menu } from 'lucide-react';

export default function AdminLayoutClient({
  children,
  initials,
  email,
}: {
  children: React.ReactNode;
  initials: string;
  email: string;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      {/* Sidebar with control for mobile visibility */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      {/* Main content area */}
      <div className="flex-1 lg:ml-64 min-h-screen flex flex-col">
        <header className="h-16 bg-card border-b border-border flex items-center justify-between lg:justify-end px-6 md:px-12 sticky top-0 z-40">
          {/* Mobile hamburger menu button */}
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden p-2 rounded-md hover:bg-muted text-foreground transition-colors cursor-pointer"
            aria-label="Open sidebar"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 px-3 py-1.5 bg-card border border-border rounded-md shadow-xs">
            <div className="w-6 h-6 bg-foreground rounded-xs flex items-center justify-center text-[10px] font-bold text-background uppercase">
              {initials}
            </div>
            <span className="text-xs font-mono font-medium text-foreground">{email}</span>
          </div>
        </header>

        <main className="p-6 md:p-10 w-full max-w-full flex-1">
          {children}
        </main>
      </div>
    </div>
  );
}
