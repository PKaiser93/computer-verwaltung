// src/app/admin/students/dashboard/page.tsx
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { apiFetch } from '@/lib/api/apiFetch';

type StudentStats = {
  totalStudents: number;
  poolStudents: number;
  personalStudents: number;
  studentsWithComputer: number;
};

type SimpleStudent = {
  id: string;
  name: string;
  email: string | null;
};

export default function StudentsDashboardPage() {
  const [stats, setStats] = useState<StudentStats | null>(null);
  const [withoutComputer, setWithoutComputer] = useState<SimpleStudent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      setLoading(true);
      setError(null);

      const [statsResult, withoutCompResult] = await Promise.all([
        apiFetch<StudentStats>('/stats/students'),
        apiFetch<SimpleStudent[]>('/stats/students/without-computer'),
      ]);

      if (!statsResult.ok || !withoutCompResult.ok) {
        const firstError = !statsResult.ok
          ? statsResult.userMessage
          : withoutCompResult.userMessage;
        setError(firstError);
        setLoading(false);
        return;
      }

      setStats(statsResult.data);
      setWithoutComputer(withoutCompResult.data);
      setLoading(false);
    }

    load();
  }, []);

  if (loading) {
    return <div className="p-6 text-sm">Lade Studenten-Dashboard...</div>;
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
        <h1 className="text-2xl font-semibold">Studenten-Dashboard</h1>
        <Link
          href="/admin/students"
          className="text-xs text-gray-600 hover:text-gray-900"
        >
          → Zur Studierendenliste
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
        <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
          <p className="text-[11px] font-medium uppercase tracking-wide text-gray-500">
            Studierende insgesamt
          </p>
          <p className="mt-2 text-3xl font-semibold text-gray-900">
            {stats.totalStudents}
          </p>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
          <p className="text-[11px] font-medium uppercase tracking-wide text-gray-500">
            Pool-Studierende
          </p>
          <p className="mt-2 text-2xl font-semibold text-sky-700">
            {stats.poolStudents}
          </p>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
          <p className="text-[11px] font-medium uppercase tracking-wide text-gray-500">
            Personalisiert
          </p>
          <p className="mt-2 text-2xl font-semibold text-emerald-700">
            {stats.personalStudents}
          </p>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
          <p className="text-[11px] font-medium uppercase tracking-wide text-gray-500">
            Mit Computer
          </p>
          <p className="mt-2 text-2xl font-semibold text-gray-900">
            {stats.studentsWithComputer}
          </p>
        </div>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-4 text-xs shadow-sm">
        <h2 className="mb-2 text-sm font-semibold text-gray-900">
          Studierende ohne Computer
        </h2>
        {withoutComputer.length === 0 ? (
          <p className="text-[11px] text-gray-500">
            Allen relevanten Studierenden ist ein Computer zugeordnet.
          </p>
        ) : (
          <table className="w-full table-fixed border-separate border-spacing-y-1">
            <tbody>
              {withoutComputer.map((s) => (
                <tr
                  key={s.id}
                  className="rounded border border-gray-100 bg-white"
                >
                  <td className="truncate px-2 py-1 text-gray-900">{s.name}</td>
                  <td className="px-2 py-1 text-[10px] text-gray-500">
                    {s.email ?? '–'}
                  </td>
                  <td className="px-2 py-1 text-right text-[10px]">
                    <Link
                      href={`/admin/students/${s.id}`}
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
