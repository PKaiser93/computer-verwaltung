// src/app/admin/rooms/[id]/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { apiFetch } from '@/lib/api/apiFetch';
import { ApiErrorResponse, ApiResult } from '@/lib/api/types';

type Room = {
  id: string;
  name: string;
};

type SimpleComputer = {
  id: string;
  name: string;
  status: 'active' | 'inactive' | 'maintenance';
  ipAddress?: string | null;
};

type RoomWithComputers = Room & {
  computers: SimpleComputer[];
};

export default function RoomDetailPage() {
  const params = useParams<{ id: string }>();
  const id = params.id;

  const [room, setRoom] = useState<RoomWithComputers | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      setLoading(true);
      setError(null);

      const result = await apiFetch<RoomWithComputers>(`/rooms/${id}`);

      function isError<T>(
        r: ApiResult<T>,
      ): r is { ok: false; error: ApiErrorResponse; userMessage: string } {
        return !r.ok;
      }

      if (isError(result)) {
        setError(result.userMessage);
        setLoading(false);
        return;
      }

      setRoom(result.data);
      setLoading(false);
    }

    load();
  }, [id]);

  if (loading) {
    return <div className="p-6 text-sm">Lade Raum...</div>;
  }

  if (error || !room) {
    return (
      <div className="p-6 text-sm text-red-600">
        Fehler: {error ?? 'Raum nicht gefunden.'}
      </div>
    );
  }

  const computerCount = room.computers.length;
  const maintenanceCount = room.computers.filter(
    (c) => c.status === 'maintenance',
  ).length;

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">{room.name}</h1>
          <p className="mt-1 text-[11px] text-gray-500">
            Detailansicht des Raums mit zugeordneten Computern.
          </p>
        </div>
        <Link
          href="/admin/rooms/dashboard"
          className="text-[11px] text-gray-600 hover:text-gray-900 underline"
        >
          ← Zurück zum Räume-Dashboard
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
          <p className="text-[11px] font-medium uppercase tracking-wide text-gray-500">
            Computer in diesem Raum
          </p>
          <p className="mt-2 text-2xl font-semibold text-gray-900">
            {computerCount}
          </p>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
          <p className="text-[11px] font-medium uppercase tracking-wide text-gray-500">
            In Wartung
          </p>
          <p className="mt-2 text-2xl font-semibold text-amber-700">
            {maintenanceCount}
          </p>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
          <p className="text-[11px] font-medium uppercase tracking-wide text-gray-500">
            Aktive Rechner
          </p>
          <p className="mt-2 text-2xl font-semibold text-emerald-700">
            {room.computers.filter((c) => c.status === 'active').length}
          </p>
        </div>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-4 text-xs shadow-sm">
        <div className="mb-2 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-gray-900">
            Rechner in diesem Raum
          </h2>
          <Link
            href="/admin/computers/new"
            className="rounded-md bg-gray-900 px-3 py-1 text-[11px] font-medium text-white hover:bg-gray-800"
          >
            Neuen Computer anlegen
          </Link>
        </div>

        {room.computers.length === 0 ? (
          <p className="text-[11px] text-gray-500">
            Diesem Raum sind derzeit keine Computer zugeordnet.
          </p>
        ) : (
          <table className="w-full table-fixed border-separate border-spacing-y-1">
            <thead>
              <tr className="text-[11px] text-gray-500">
                <th className="px-2 py-1 text-left">Name</th>
                <th className="px-2 py-1 text-left">Status</th>
                <th className="px-2 py-1 text-left">IP-Adresse</th>
                <th className="px-2 py-1 text-right">Aktionen</th>
              </tr>
            </thead>
            <tbody>
              {room.computers.map((c) => (
                <tr
                  key={c.id}
                  className="rounded border border-gray-100 bg-white"
                >
                  <td className="truncate px-2 py-1 text-gray-900">{c.name}</td>
                  <td className="px-2 py-1 text-[11px] text-gray-700">
                    {c.status === 'active'
                      ? 'Aktiv'
                      : c.status === 'inactive'
                        ? 'Inaktiv'
                        : 'Wartung'}
                  </td>
                  <td className="px-2 py-1 text-[11px] text-gray-500">
                    {c.ipAddress ?? '–'}
                  </td>
                  <td className="px-2 py-1 text-right text-[10px]">
                    <Link
                      href={`/admin/computers/${c.id}`}
                      className="text-gray-500 underline hover:text-gray-800"
                    >
                      bearbeiten
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
