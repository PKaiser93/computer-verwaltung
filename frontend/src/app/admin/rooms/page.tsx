// src/app/admin/rooms/page.tsx
'use client';

import Link from 'next/link';

export default function RoomsPage() {
  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Räume</h1>
        <div className="flex items-center gap-2">
          <Link
            href="/admin/rooms/dashboard"
            className="text-[11px] text-gray-600 hover:text-gray-900 underline"
          >
            Zum Räume-Dashboard
          </Link>
          <Link
            href="/admin/rooms/new"
            className="rounded-md bg-emerald-600 px-3 py-1 text-[11px] font-medium text-white hover:bg-emerald-700"
          >
            Neuen Raum anlegen
          </Link>
        </div>
      </div>

      <p className="text-[11px] text-gray-500">
        Hier könnte später eine detaillierte Raumliste mit Filter/Suche stehen.
      </p>
    </div>
  );
}
