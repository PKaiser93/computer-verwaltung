// src/app/admin/layout.tsx
import type { ReactNode } from 'react';
import { AdminNavbar } from '@/components/AdminNavbar';
import { AdminProviders } from './AdminProviders';

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <AdminProviders>
      <div className="min-h-screen bg-gray-100">
        <AdminNavbar />
        <main className="mx-auto max-w-6xl py-6 px-6">{children}</main>
      </div>
    </AdminProviders>
  );
}
