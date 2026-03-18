// src/app/admin/computers/new/page.tsx
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { apiFetch } from '@/lib/api/apiFetch';
import { useToast } from '@/lib/toast/ToastContext';

type Room = {
  id: string;
  name: string;
};

type Employee = {
  id: string;
  name: string;
};

type Student = {
  id: string;
  name: string;
};

type Computer = {
  id: string;
  name: string;
  type: 'computer' | 'printer' | 'device';
  ipAddress?: string | null;
  status: 'active' | 'inactive' | 'maintenance';
  raumId?: string | null;
  mitarbeiterId?: string | null;
  studentId?: string | null;
};

export default function NewComputerPage() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [loadingMeta, setLoadingMeta] = useState(true);
  const [metaError, setMetaError] = useState<string | null>(null);

  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState<string | null>(null);

  const { showToast } = useToast();

  useEffect(() => {
    async function loadMeta() {
      setLoadingMeta(true);
      setMetaError(null);

      const [roomsRes, employeesRes, studentsRes] = await Promise.all([
        apiFetch<Room[]>('/rooms'),
        apiFetch<Employee[]>('/employees'),
        apiFetch<Student[]>('/students'),
      ]);

      if (!roomsRes.ok || !employeesRes.ok || !studentsRes.ok) {
        const firstError =
          roomsRes.ok === false
            ? roomsRes.userMessage
            : employeesRes.ok === false
              ? employeesRes.userMessage
              : studentsRes.ok === false
                ? studentsRes.userMessage
                : 'Fehler beim Laden der Stammdaten';
        setMetaError(firstError);
        showToast(firstError, 'error');
        setLoadingMeta(false);
        return;
      }

      setRooms(roomsRes.data);
      setEmployees(employeesRes.data);
      setStudents(studentsRes.data);
      setLoadingMeta(false);
    }

    loadMeta();
  }, [showToast]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitError(null);
    setSubmitSuccess(null);
    setSubmitting(true);

    const form = e.currentTarget;
    const formData = new FormData(form);

    const payload = {
      name: formData.get('name') as string,
      type: formData.get('type') as Computer['type'],
      ipAddress: (formData.get('ipAddress') as string) || undefined,
      status: formData.get('status') as Computer['status'],
      raumId: (formData.get('raumId') as string) || undefined,
      mitarbeiterId: (formData.get('mitarbeiterId') as string) || undefined,
      studentId: (formData.get('studentId') as string) || undefined,
    };

    const result = await apiFetch<Computer>('/computers', {
      method: 'POST',
      body: JSON.stringify(payload),
    });

    if (!result.ok) {
      setSubmitError(result.userMessage);
      showToast(result.userMessage, 'error');
    } else {
      setSubmitSuccess('Computer wurde erfolgreich angelegt.');
      showToast('Computer wurde erfolgreich angelegt.', 'success');
      form.reset();
    }

    setSubmitting(false);
  }

  return (
    <div className="p-6">
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Neuen Computer anlegen</h1>
        <Link
          href="/admin/computers"
          className="text-xs text-gray-600 hover:text-gray-900"
        >
          ← Zurück zur Übersicht
        </Link>
      </div>

      {metaError && (
        <div className="mb-4 rounded-md bg-red-50 px-4 py-2 text-xs text-red-800">
          {metaError}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="space-y-6 rounded-xl border border-gray-200 bg-white p-6 text-xs shadow-sm"
      >
        {submitSuccess && (
          <div className="rounded-md bg-green-50 px-4 py-2 text-xs text-green-800">
            {submitSuccess}
          </div>
        )}
        {submitError && (
          <div className="rounded-md bg-red-50 px-4 py-2 text-xs text-red-800">
            {submitError}
          </div>
        )}

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Name
            </label>
            <input
              name="name"
              required
              className="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Typ
            </label>
            <select
              name="type"
              required
              defaultValue="computer"
              className="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900"
            >
              <option value="computer">Rechner</option>
              <option value="printer">Drucker</option>
              <option value="device">Gerät</option>
            </select>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              IP-Adresse
            </label>
            <input
              name="ipAddress"
              placeholder="optional"
              className="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Status
            </label>
            <select
              name="status"
              required
              defaultValue="active"
              className="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900"
            >
              <option value="active">aktiv</option>
              <option value="inactive">inaktiv</option>
              <option value="maintenance">Wartung</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Raum
            </label>
            <select
              name="raumId"
              disabled={loadingMeta || !!metaError}
              className="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900 disabled:bg-gray-100"
              defaultValue=""
            >
              <option value="">Kein Raum</option>
              {rooms.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Mitarbeiter
            </label>
            <select
              name="mitarbeiterId"
              disabled={loadingMeta || !!metaError}
              className="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900 disabled:bg-gray-100"
              defaultValue=""
            >
              <option value="">Kein Mitarbeiter</option>
              {employees.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Student
            </label>
            <select
              name="studentId"
              disabled={loadingMeta || !!metaError}
              className="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900 disabled:bg-gray-100"
              defaultValue=""
            >
              <option value="">Kein Student</option>
              {students.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-2">
          <Link
            href="/admin/computers"
            className="inline-flex items-center rounded-md border border-gray-300 px-3 py-2 text-xs font-medium text-gray-700 hover:bg-gray-50"
          >
            Abbrechen
          </Link>
          <button
            type="submit"
            disabled={submitting}
            className="inline-flex items-center rounded-md bg-gray-900 px-4 py-2 text-xs font-medium text-white hover:bg-gray-800 disabled:bg-gray-400"
          >
            {submitting ? 'Speichere...' : 'Computer speichern'}
          </button>
        </div>
      </form>
    </div>
  );
}
