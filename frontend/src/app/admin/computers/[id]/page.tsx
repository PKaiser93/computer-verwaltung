// src/app/admin/computers/[id]/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { apiFetch } from '@/lib/api/apiFetch';
import { useToast } from '@/lib/toast/ToastContext';

const API_URL = process.env.NEXT_PUBLIC_API_URL!;

type Room = { id: string; name: string };
type Employee = { id: string; name: string };
type Student = { id: string; name: string };

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

type ApiErrorResponse = {
  statusCode: number;
  code?: string;
  message: string | string[];
};

export default function EditComputerPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const id = params.id;
  const { showToast } = useToast();

  const [computer, setComputer] = useState<Computer | null>(null);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState<string | null>(null);
  const [studentError, setStudentError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      setLoading(true);
      setError(null);

      const [computerResult, roomsResult, employeesResult, studentsResult] =
        await Promise.all([
          apiFetch<Computer>(`/computers/${id}`),
          apiFetch<Room[]>(`/rooms`),
          apiFetch<Employee[]>(`/employees`),
          apiFetch<Student[]>(`/students`),
        ]);

      if (!computerResult.ok) {
        setError(computerResult.userMessage);
        showToast(computerResult.userMessage, 'error');
        setLoading(false);
        return;
      }
      if (!roomsResult.ok || !employeesResult.ok || !studentsResult.ok) {
        const firstError =
          roomsResult.ok === false
            ? roomsResult.userMessage
            : employeesResult.ok === false
              ? employeesResult.userMessage
              : studentsResult.ok === false
                ? studentsResult.userMessage
                : 'Fehler beim Laden der Stammdaten.';
        setError(firstError);
        showToast(firstError, 'error');
        setLoading(false);
        return;
      }

      const computerJson = computerResult.data;
      setComputer({
        id: computerJson.id,
        name: computerJson.name,
        type: computerJson.type,
        ipAddress: computerJson.ipAddress,
        status: computerJson.status,
        raumId: computerJson.raumId ?? null,
        mitarbeiterId: computerJson.mitarbeiterId ?? null,
        studentId: computerJson.studentId ?? null,
      });
      setRooms(roomsResult.data);
      setEmployees(employeesResult.data);
      setStudents(studentsResult.data);

      setLoading(false);
    }

    load();
  }, [id, showToast]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!computer) return;

    setSaveError(null);
    setSaveSuccess(null);
    setStudentError(null);
    setSaving(true);

    const form = e.currentTarget;
    const formData = new FormData(form);

    const payload = {
      name: formData.get('name') as string,
      type: formData.get('type') as string,
      ipAddress: (formData.get('ipAddress') as string) || null,
      status: formData.get('status') as string,
      raumId: (formData.get('raumId') as string) || null,
      mitarbeiterId: (formData.get('mitarbeiterId') as string) || null,
      studentId: (formData.get('studentId') as string) || null,
    };

    const result = await apiFetch<Computer>(`/computers/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(payload),
    });

    if (!result.ok) {
      setSaveError(result.userMessage);
      showToast(result.userMessage, 'error');

      const err = result.error as ApiErrorResponse;
      if (err.code === 'STUDENT_ALREADY_ASSIGNED') {
        setStudentError(
          'Dieser Student ist bereits einem anderen Computer zugeordnet.',
        );
      }
    } else {
      setComputer(result.data);
      setSaveSuccess('Änderungen gespeichert.');
      showToast('Änderungen gespeichert.', 'success');
    }

    setSaving(false);
  }

  if (loading) {
    return <div className="p-6 text-sm">Lade Computer...</div>;
  }

  if (error || !computer) {
    return (
      <div className="p-6 text-sm text-red-600">
        Fehler: {error ?? 'Computer nicht gefunden'}
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Computer bearbeiten</h1>
        <Link
          href="/admin/computers"
          className="text-xs text-gray-600 hover:text-gray-900"
        >
          ← Zurück zur Übersicht
        </Link>
      </div>

      <form
        onSubmit={handleSubmit}
        className="space-y-6 rounded-xl border border-gray-200 bg-white p-6 text-xs shadow-sm"
      >
        {saveSuccess && (
          <div className="rounded-md bg-green-50 px-4 py-2 text-xs text-green-800">
            {saveSuccess}
          </div>
        )}
        {saveError && (
          <div className="rounded-md bg-red-50 px-4 py-2 text-xs text-red-800">
            {saveError}
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
              defaultValue={computer.name}
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
              defaultValue={computer.type}
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
              defaultValue={computer.ipAddress ?? ''}
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
              defaultValue={computer.status}
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
              defaultValue={computer.raumId ?? ''}
              className="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900"
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
              defaultValue={computer.mitarbeiterId ?? ''}
              className="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900"
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
              defaultValue={computer.studentId ?? ''}
              className={`w-full rounded-md border px-3 py-2 shadow-sm focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900 ${
                studentError ? 'border-red-400' : 'border-gray-300'
              }`}
            >
              <option value="">Kein Student</option>
              {students.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
            {studentError && (
              <p className="mt-1 text-[11px] text-red-600">{studentError}</p>
            )}
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-2">
          <button
            type="button"
            onClick={() => router.push('/admin/computers')}
            className="inline-flex items-center rounded-md border border-gray-300 px-3 py-2 text-xs font-medium text-gray-700 hover:bg-gray-50"
          >
            Abbrechen
          </button>
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center rounded-md bg-gray-900 px-4 py-2 text-xs font-medium text-white hover:bg-gray-800 disabled:bg-gray-400"
          >
            {saving ? 'Speichere...' : 'Änderungen speichern'}
          </button>
        </div>
      </form>
    </div>
  );
}
