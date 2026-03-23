// src/app/admin/employees/dashboard/page.tsx
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { apiFetch } from '@/lib/api/apiFetch';
import { ApiErrorResponse, ApiResult } from '@/lib/api/types';

type EmployeeStats = {
  totalEmployees: number;
  employeesWithComputers: number;
};

type SimpleEmployee = {
  id: string;
  name: string;
  email: string;
};

export default function EmployeesDashboardPage() {
  const [stats, setStats] = useState<EmployeeStats | null>(null);
  const [withoutComputers, setWithoutComputers] = useState<SimpleEmployee[]>(
    [],
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      setLoading(true);
      setError(null);

      const [statsResult, withoutResult] = await Promise.all([
        apiFetch<EmployeeStats>('/stats/employees'),
        apiFetch<SimpleEmployee[]>('/stats/employees/without-computers'),
      ]);

      function isError<T>(
        r: ApiResult<T>,
      ): r is { ok: false; error: ApiErrorResponse; userMessage: string } {
        return !r.ok;
      }

      if (isError(statsResult) || isError(withoutResult)) {
        const firstError = isError(statsResult)
          ? statsResult.userMessage
          : isError(withoutResult)
            ? withoutResult.userMessage
            : 'Fehler beim Laden des Dashboards.';

        setError(firstError);
        setLoading(false);
        return;
      }

      setStats(statsResult.data);
      setWithoutComputers(withoutResult.data);
      setLoading(false);
    }

    load();
  }, []);

  if (loading) {
    return <div className="p-6 text-sm">Lade Mitarbeiter-Dashboard...</div>;
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
        <h1 className="text-2xl font-semibold">Mitarbeiter-Dashboard</h1>
        <Link
          href="/admin/employees"
          className="text-xs text-gray-600 hover:text-gray-900"
        >
          → Zur Mitarbeiterliste
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
          <p className="text-[11px] font-medium uppercase tracking-wide text-gray-500">
            Mitarbeitende insgesamt
          </p>
          <p className="mt-2 text-3xl font-semibold text-gray-900">
            {stats.totalEmployees}
          </p>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
          <p className="text-[11px] font-medium uppercase tracking-wide text-gray-500">
            Mit Computer
          </p>
          <p className="mt-2 text-2xl font-semibold text-emerald-700">
            {stats.employeesWithComputers}
          </p>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
          <p className="text-[11px] font-medium uppercase tracking-wide text-gray-500">
            Ohne Computer
          </p>
          <p className="mt-2 text-2xl font-semibold text-gray-900">
            {stats.totalEmployees - stats.employeesWithComputers}
          </p>
        </div>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-4 text-xs shadow-sm">
        <h2 className="mb-2 text-sm font-semibold text-gray-900">
          Mitarbeitende ohne Computer
        </h2>
        {withoutComputers.length === 0 ? (
          <p className="text-[11px] text-gray-500">
            Alle Mitarbeitenden haben mindestens einen Computer.
          </p>
        ) : (
          <table className="w-full table-fixed border-separate border-spacing-y-1">
            <tbody>
              {withoutComputers.map((m) => (
                <tr
                  key={m.id}
                  className="rounded border border-gray-100 bg-white"
                >
                  <td className="truncate px-2 py-1 text-gray-900">{m.name}</td>
                  <td className="px-2 py-1 text-[10px] text-gray-500">
                    {m.email}
                  </td>
                  <td className="px-2 py-1 text-right text-[10px]">
                    <Link
                      href={`/admin/employees/${m.id}`}
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
