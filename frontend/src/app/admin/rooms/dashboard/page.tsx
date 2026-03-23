// src/app/admin/rooms/dashboard/page.tsx
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { apiFetch } from '@/lib/api/apiFetch';
import { ApiErrorResponse, ApiResult } from '@/lib/api/types';

type RoomStats = {
  totalRooms: number;
  roomsWithComputers: number;
  roomsWithoutComputers: number;
};

type SimpleRoom = {
  id: string;
  name: string;
  computerCount: number;
};

export default function RoomsDashboardPage() {
  const [stats, setStats] = useState<RoomStats | null>(null);
  const [rooms, setRooms] = useState<SimpleRoom[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      setLoading(true);
      setError(null);

      const [statsResult, roomsResult] = await Promise.all([
        apiFetch<RoomStats>('/rooms/stats/overview'),
        apiFetch<SimpleRoom[]>('/rooms/stats/with-count'),
      ]);

      function isError<T>(
        r: ApiResult<T>,
      ): r is { ok: false; error: ApiErrorResponse; userMessage: string } {
        return !r.ok;
      }

      if (isError(statsResult) || isError(roomsResult)) {
        const firstError = isError(statsResult)
          ? statsResult.userMessage
          : isError(roomsResult)
            ? roomsResult.userMessage
            : 'Fehler beim Laden der Daten.';

        setError(firstError);
        setLoading(false);
        return;
      }

      setStats(statsResult.data);
      setRooms(roomsResult.data);
      setLoading(false);
    }

    load();
  }, []);

  if (loading) {
    return <div className="p-6 text-sm">Lade Räume-Dashboard...</div>;
  }

  if (error || !stats) {
    return (
      <div className="p-6 text-sm text-red-600">
        Fehler: {error ?? 'Keine Dashboard-Daten verfügbar.'}
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="mb-2 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Räume-Dashboard</h1>
          <p className="mt-1 text-[11px] text-gray-500">
            Übersicht über alle Räume und deren Belegung mit Computern.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href="/admin/rooms/new"
            className="rounded-md bg-emerald-600 px-3 py-1 text-[11px] font-medium text-white hover:bg-emerald-700"
          >
            Neuen Raum anlegen
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
          <p className="text-[11px] font-medium uppercase tracking-wide text-gray-500">
            Räume insgesamt
          </p>
          <p className="mt-2 text-3xl font-semibold text-gray-900">
            {stats.totalRooms}
          </p>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
          <p className="text-[11px] font-medium uppercase tracking-wide text-gray-500">
            Mit Computern
          </p>
          <p className="mt-2 text-2xl font-semibold text-emerald-700">
            {stats.roomsWithComputers}
          </p>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
          <p className="text-[11px] font-medium uppercase tracking-wide text-gray-500">
            Ohne Computer
          </p>
          <p className="mt-2 text-2xl font-semibold text-gray-900">
            {stats.roomsWithoutComputers}
          </p>
        </div>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-4 text-xs shadow-sm">
        <h2 className="mb-2 text-sm font-semibold text-gray-900">
          Räume nach Anzahl Computer
        </h2>
        <table className="w-full table-fixed border-separate border-spacing-y-1">
          <tbody>
            {rooms.map((r) => (
              <tr
                key={r.id}
                className="rounded border border-gray-100 bg-white"
              >
                <td className="truncate px-2 py-1 text-gray-900">{r.name}</td>
                <td className="px-2 py-1 text-[11px] text-gray-500">
                  {r.computerCount} Computer
                </td>
                <td className="px-2 py-1 text-right text-[10px]">
                  <Link
                    href={`/admin/rooms/${r.id}`}
                    className="text-gray-500 underline hover:text-gray-800"
                  >
                    anzeigen
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
