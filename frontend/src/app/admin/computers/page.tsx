// src/app/admin/computers/page.tsx
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { apiFetch } from '@/lib/api/apiFetch';

type Room = {
  id: string;
  name: string;
};

type Student = {
  id: string;
  name: string;
  email: string | null;
  pool: boolean;
};

type Employee = {
  id: string;
  name: string;
  email: string;
};

type Computer = {
  id: string;
  name: string;
  type: 'computer' | 'printer' | 'device';
  ipAddress?: string | null;
  status: 'active' | 'inactive' | 'maintenance';
  raum?: Room | null;
  mitarbeiter?: Employee | null;
  student?: Student | null;
};

type ComputersResponse = {
  data: Computer[];
  meta: {
    page: number;
    limit: number;
    total: number;
    pageCount: number;
  };
};

const statusStyles: Record<Computer['status'], string> = {
  active: 'bg-green-100 text-green-800 border border-green-300',
  inactive: 'bg-gray-100 text-gray-700 border border-gray-300',
  maintenance: 'bg-yellow-100 text-yellow-800 border border-yellow-300',
};

const typeLabels: Record<Computer['type'], string> = {
  computer: 'Rechner',
  printer: 'Drucker',
  device: 'Gerät',
};

export default function ComputersAdminPage() {
  const [computers, setComputers] = useState<Computer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      setLoading(true);
      setError(null);

      const result = await apiFetch<ComputersResponse>('/computers');

      if (!result.ok) {
        setError(result.userMessage);
      } else {
        setComputers(result.data.data);
      }

      setLoading(false);
    }
    load();
  }, []);

  if (loading) return <div className="p-6 text-sm">Lade Computer...</div>;
  if (error)
    return <div className="p-6 text-sm text-red-600">Fehler: {error}</div>;

  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Computerverwaltung</h1>
          <p className="mt-1 text-[11px] text-gray-500">
            Übersicht aller Computer mit Zuordnungen und Status.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href="/admin/computers/dashboard"
            className="inline-flex items-center rounded-md border border-gray-300 px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50"
          >
            Dashboard
          </Link>
          <Link
            href="/admin/computers/new"
            className="inline-flex items-center rounded-md bg-gray-900 px-3 py-1.5 text-xs font-medium text-white hover:bg-gray-800"
          >
            Neuen Computer anlegen
          </Link>
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        <table className="min-w-full text-xs">
          <thead className="bg-gray-50">
            <tr className="text-[11px] font-semibold uppercase tracking-wide text-gray-500">
              <th className="px-3 py-2 text-left">Name</th>
              <th className="px-3 py-2 text-left">Typ</th>
              <th className="px-3 py-2 text-left">IP</th>
              <th className="px-3 py-2 text-left">Status</th>
              <th className="px-3 py-2 text-left">Raum</th>
              <th className="px-3 py-2 text-left">Student</th>
              <th className="px-3 py-2 text-right">Aktionen</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {computers.map((c) => (
              <tr key={c.id} className="transition-colors hover:bg-gray-50">
                <td className="max-w-[220px] truncate px-3 py-2 font-medium text-gray-900">
                  {c.name}
                </td>

                <td className="px-3 py-2 text-[11px] text-gray-700">
                  {typeLabels[c.type]}
                </td>

                <td className="px-3 py-2 text-[11px] font-mono text-gray-600">
                  {c.ipAddress ?? '–'}
                </td>

                <td className="px-3 py-2">
                  <span
                    className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium ${
                      statusStyles[c.status]
                    }`}
                  >
                    {c.status}
                  </span>
                </td>

                <td className="px-3 py-2 text-[11px] text-gray-700">
                  {c.raum?.name ?? (
                    <span className="text-gray-400">Kein Raum</span>
                  )}
                </td>

                <td className="px-3 py-2 text-[11px] text-gray-700">
                  {c.student ? (
                    <>
                      <div>{c.student.name}</div>
                      <div className="text-[10px] text-gray-500">
                        {c.student.email ?? '–'} ·{' '}
                        {c.student.pool ? 'Pool' : 'pers.'}
                      </div>
                    </>
                  ) : (
                    <span className="text-gray-400">Kein Student</span>
                  )}
                </td>

                <td className="px-3 py-2 text-right">
                  <Link
                    href={`/admin/computers/${c.id}`}
                    className="text-[11px] text-gray-600 underline hover:text-gray-900"
                  >
                    Bearbeiten
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
