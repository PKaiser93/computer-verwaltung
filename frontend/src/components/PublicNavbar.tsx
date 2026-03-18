// src/components/PublicNavbar.tsx
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const publicNavItems = [
  { href: '/', label: 'Start' },
  { href: '/request', label: 'Antrag stellen' },
];

export function PublicNavbar() {
  const pathname = usePathname();

  return (
    <nav className="border-b border-gray-200 bg-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3">
        <Link href="/" className="text-base font-semibold text-gray-900">
          Rechnerverwaltung
        </Link>
        <div className="flex items-center gap-4 text-sm">
          {publicNavItems.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`rounded-md px-3 py-1 transition-colors ${
                  active
                    ? 'bg-gray-900 text-white'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
