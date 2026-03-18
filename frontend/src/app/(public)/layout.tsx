// src/app/(public)/layout.tsx
import type { ReactNode } from 'react';
import { PublicNavbar } from '@/components/PublicNavbar';

export default function PublicLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <PublicNavbar />
      <main className="mx-auto max-w-6xl px-6 py-6">{children}</main>
    </div>
  );
}
