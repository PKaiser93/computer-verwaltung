// src/app/admin/computers/dashboard/page.tsx
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { apiFetch } from '@/lib/api/apiFetch';

type ComputerStatus = 'active' | 'inactive' | 'maintenance';

type ComputerStats = {
  totalComputers: number;
  activeComputers: number;
  inactiveComputers: number;
  maintenanceComputers: number;
  occupiedComputers: number; // mit studentId != null
  unassignedComputers: number; // ohne studentId und ohne mitarbeiterId
};

type SimpleComputer = {
  id: string;
  name: string;
  status: ComputerStatus;
  ipAddress?: string | null;
};

export default function ComputerDashboardPage() {
  const [stats, setStats] = useState<ComputerStats | null>(null);
  const [withoutRoom, setWithoutRoom] = useState<SimpleComputer[]>([]);
  const [withoutAssignment, setWithoutAssignment] = useState<SimpleComputer[]>(
    [],
  );
  const [maintenance, setMaintenance] = useState<SimpleComputer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      setLoading(true);
      setError(null);

      const [
        statsResult,
        withoutRoomResult,
        withoutAssignmentResult,
        maintenanceResult,
      ] = await Promise.all([
        apiFetch<ComputerStats>('/computers/stats/overview'),
        apiFetch<SimpleComputer[]>('/computers/stats/without-room'),
        apiFetch<SimpleComputer[]>('/computers/stats/without-assignment'),
        apiFetch<SimpleComputer[]>('/computers/stats/maintenance'),
      ]);

      if (
        !statsResult.ok ||
        !withoutRoomResult.ok ||
        !withoutAssignmentResult.ok ||
        !maintenanceResult.ok
      ) {
        const firstError = !statsResult.ok
          ? statsResult.userMessage
          : !withoutRoomResult.ok
            ? withoutRoomResult.userMessage
            : !withoutAssignmentResult.ok
              ? withoutAssignmentResult.userMessage
              : maintenanceResult.userMessage;
        setError(firstError);
        setLoading(false);
        return;
      }

      setStats(statsResult.data);
      setWithoutRoom(withoutRoomResult.data);
      setWithoutAssignment(withoutAssignmentResult.data);
      setMaintenance(maintenanceResult.data);
      setLoading(false);
    }

    load();
  }, []);

  if (loading) {
    return <div className="p-6 text-sm">Lade Computer-Dashboard...</div>;
  }

  if (error) {
    return (
      <div className="p-6 text-sm text-red-600">
        Fehler beim Laden des Dashboards: {error}
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="p-6 text-sm text-red-600">
        Keine Dashboard-Daten verfügbar.
      </div>
    );
  }

  const freeComputers = stats.totalComputers - stats.occupiedComputers;

  return (
    <div className="p-6 space-y-6">
      <div className="mb-2 flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Computer-Dashboard</h1>
        <Link
          href="/admin/computers"
          className="text-xs text-gray-600 hover:text-gray-900"
        >
          → Zur Computerliste
        </Link>
      </div>

      {/* KPI-Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
        <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
          <p className="text-[11px] font-medium uppercase tracking-wide text-gray-500">
            Computer insgesamt
          </p>
          <p className="mt-2 text-3xl font-semibold text-gray-900">
            {stats.totalComputers}
          </p>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
          <p className="text-[11px] font-medium uppercase tracking-wide text-gray-500">
            Aktiv
          </p>
          <p className="mt-2 text-2xl font-semibold text-emerald-700">
            {stats.activeComputers}
          </p>
          <p className="text-[11px] text-gray-500">
            {stats.inactiveComputers} inaktiv
          </p>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
          <p className="text-[11px] font-medium uppercase tracking-wide text-gray-500">
            Wartung
          </p>
          <p className="mt-2 text-2xl font-semibold text-amber-700">
            {stats.maintenanceComputers}
          </p>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
          <p className="text-[11px] font-medium uppercase tracking-wide text-gray-500">
            Belegt / frei
          </p>
          <p className="mt-2 text-sm text-gray-900">
            <span className="font-semibold text-sky-700">
              {stats.occupiedComputers}
            </span>{' '}
            belegt ·{' '}
            <span className="font-semibold text-gray-700">{freeComputers}</span>{' '}
            frei
          </p>
        </div>
      </div>

      {/* Listen */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="rounded-xl border border-gray-200 bg-white p-4 text-xs shadow-sm">
          <h2 className="mb-2 text-sm font-semibold text-gray-900">
            Computer ohne Raum
          </h2>
          {withoutRoom.length === 0 ? (
            <p className="text-[11px] text-gray-500">
              Alle Computer sind einem Raum zugeordnet.
            </p>
          ) : (
            <table className="w-full table-fixed border-separate border-spacing-y-1">
              <tbody>
                {withoutRoom.map((c) => (
                  <tr
                    key={c.id}
                    className="rounded border border-gray-100 bg-white"
                  >
                    <td className="truncate px-2 py-1 text-gray-900">
                      {c.name}
                    </td>
                    <td className="px-2 py-1 text-right text-[10px] font-mono text-gray-500">
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

        <div className="rounded-xl border border-gray-200 bg-white p-4 text-xs shadow-sm">
          <h2 className="mb-2 text-sm font-semibold text-gray-900">
            Computer ohne Zuordnung
          </h2>
          <p className="mb-1 text-[11px] text-gray-500">
            Weder Student noch Mitarbeiter zugeordnet.
          </p>
          {withoutAssignment.length === 0 ? (
            <p className="text-[11px] text-gray-500">
              Alle Computer sind zugeordnet.
            </p>
          ) : (
            <table className="w-full table-fixed border-separate border-spacing-y-1">
              <tbody>
                {withoutAssignment.map((c) => (
                  <tr
                    key={c.id}
                    className="rounded border border-gray-100 bg-white"
                  >
                    <td className="truncate px-2 py-1 text-gray-900">
                      {c.name}
                    </td>
                    <td className="px-2 py-1 text-right text-[10px] font-mono text-gray-500">
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

        <div className="rounded-xl border border-gray-200 bg-white p-4 text-xs shadow-sm">
          <h2 className="mb-2 text-sm font-semibold text-gray-900">
            Computer in Wartung
          </h2>
          {maintenance.length === 0 ? (
            <p className="text-[11px] text-gray-500">
              Aktuell sind keine Computer im Wartungsstatus.
            </p>
          ) : (
            <table className="w-full table-fixed border-separate border-spacing-y-1">
              <tbody>
                {maintenance.map((c) => (
                  <tr
                    key={c.id}
                    className="rounded border border-gray-100 bg-white"
                  >
                    <td className="truncate px-2 py-1 text-gray-900">
                      {c.name}
                    </td>
                    <td className="px-2 py-1 text-right text-[10px] font-mono text-gray-500">
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
    </div>
  );
}
