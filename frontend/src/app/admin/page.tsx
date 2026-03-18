// src/app/admin/page.tsx
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { apiFetch } from '@/lib/api/apiFetch';

type AdminStats = {
  totalComputers: number;
  pendingRequests: number;
  occupiedComputers: number;
};

type EmployeeStats = {
  totalEmployees: number;
  employeesWithComputers: number;
};

type StudentStats = {
  totalStudents: number;
  poolStudents: number;
  personalStudents: number;
};

export default function AdminDashboardPage() {
  const [adminStats, setAdminStats] = useState<AdminStats | null>(null);
  const [employeeStats, setEmployeeStats] = useState<EmployeeStats | null>(
    null,
  );
  const [studentStats, setStudentStats] = useState<StudentStats | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      setLoading(true);
      setError(null);

      const [adminRes, empRes, studRes] = await Promise.all([
        apiFetch<AdminStats>('/stats/admin'),
        apiFetch<EmployeeStats>('/stats/employees'),
        apiFetch<StudentStats>('/stats/students'),
      ]);

      if (!adminRes.ok || !empRes.ok || !studRes.ok) {
        const firstError = !adminRes.ok
          ? adminRes.userMessage
          : !empRes.ok
            ? empRes.userMessage
            : studRes.userMessage;
        setError(firstError);
        setLoading(false);
        return;
      }

      setAdminStats(adminRes.data);
      setEmployeeStats(empRes.data);
      setStudentStats(studRes.data);
      setLoading(false);
    }

    load();
  }, []);

  const freeComputers =
    (adminStats?.totalComputers ?? 0) - (adminStats?.occupiedComputers ?? 0);
  const employeesWithoutComputers =
    (employeeStats?.totalEmployees ?? 0) -
    (employeeStats?.employeesWithComputers ?? 0);

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Admin Dashboard</h1>
          <p className="mt-1 text-[11px] text-gray-500">
            Überblick über Computer, Anträge, Mitarbeitende und Studierende.
          </p>
        </div>
      </div>

      {/* Top KPIs über alles */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
        <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
          <p className="text-[11px] font-medium uppercase tracking-wide text-gray-500">
            Computer insgesamt
          </p>
          <p className="mt-2 text-3xl font-semibold text-gray-900">
            {loading ? '–' : (adminStats?.totalComputers ?? 0)}
          </p>
          <p className="mt-1 text-[11px] text-gray-500">
            {loading
              ? ''
              : `${adminStats?.occupiedComputers ?? 0} belegt, ${freeComputers} frei`}
          </p>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
          <p className="text-[11px] font-medium uppercase tracking-wide text-gray-500">
            Offene Anträge
          </p>
          <p className="mt-2 text-3xl font-semibold text-gray-900">
            {loading ? '–' : (adminStats?.pendingRequests ?? 0)}
          </p>
          <p className="mt-1 text-[11px] text-gray-500">
            Rechnerarbeitsplatz-Anträge im Status PENDING.
          </p>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
          <p className="text-[11px] font-medium uppercase tracking-wide text-gray-500">
            Mitarbeitende
          </p>
          <p className="mt-2 text-3xl font-semibold text-gray-900">
            {loading ? '–' : (employeeStats?.totalEmployees ?? 0)}
          </p>
          <p className="mt-1 text-[11px] text-gray-500">
            {loading
              ? ''
              : `${employeeStats?.employeesWithComputers ?? 0} mit, ${employeesWithoutComputers} ohne Computer`}
          </p>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
          <p className="text-[11px] font-medium uppercase tracking-wide text-gray-500">
            Studierende
          </p>
          <p className="mt-2 text-3xl font-semibold text-gray-900">
            {loading ? '–' : (studentStats?.totalStudents ?? 0)}
          </p>
          <p className="mt-1 text-[11px] text-gray-500">
            {loading
              ? ''
              : `${studentStats?.poolStudents ?? 0} Pool, ${
                  studentStats?.personalStudents ?? 0
                } personalisiert`}
          </p>
        </div>
      </div>

      {error && (
        <p className="text-[11px] text-red-600">Fehler beim Laden: {error}</p>
      )}

      {/* Einstiege in Detail-Dashboards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Link
          href="/admin/computers/dashboard"
          className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm hover:border-gray-300 hover:bg-gray-50"
        >
          <h2 className="text-sm font-semibold text-gray-900">
            Computer-Dashboard
          </h2>
          <p className="mt-1 text-[11px] text-gray-500">
            Auslastung, belegte Plätze und besondere Computer-Situationen.
          </p>
        </Link>

        <Link
          href="/admin/employees/dashboard"
          className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm hover:border-gray-300 hover:bg-gray-50"
        >
          <h2 className="text-sm font-semibold text-gray-900">
            Mitarbeiter-Dashboard
          </h2>
          <p className="mt-1 text-[11px] text-gray-500">
            Mitarbeitende mit/ohne Computer und Zuordnungen.
          </p>
        </Link>

        <Link
          href="/admin/students/dashboard"
          className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm hover:border-gray-300 hover:bg-gray-50"
        >
          <h2 className="text-sm font-semibold text-gray-900">
            Studenten-Dashboard
          </h2>
          <p className="mt-1 text-[11px] text-gray-500">
            Pool vs. personalisiert und Studierende ohne Computer.
          </p>
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Link
          href="/admin/rooms/dashboard"
          className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm hover:border-gray-300 hover:bg-gray-50"
        >
          <h2 className="text-sm font-semibold text-gray-900">
            Räume-Dashboard
          </h2>
          <p className="mt-1 text-[11px] text-gray-500">
            Räume mit/ohne Computer und Verteilung.
          </p>
        </Link>

        <Link
          href="/admin/requests"
          className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm hover:border-gray-300 hover:bg-gray-50"
        >
          <h2 className="text-sm font-semibold text-gray-900">
            Arbeitsplatz-Anträge
          </h2>
          <p className="mt-1 text-[11px] text-gray-500">
            Eingegangene Anträge prüfen, genehmigen oder ablehnen.
          </p>
        </Link>

        <Link
          href="/admin/computers"
          className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm hover:border-gray-300 hover:bg-gray-50"
        >
          <h2 className="text-sm font-semibold text-gray-900">
            Computerverwaltung
          </h2>
          <p className="mt-1 text-[11px] text-gray-500">
            Einzelne Computer sehen, bearbeiten und anlegen.
          </p>
        </Link>
      </div>
    </div>
  );
}
