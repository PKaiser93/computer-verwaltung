// src/app/(public)/request/page.tsx
'use client';

import { useEffect, useState } from 'react';

type EmployeeOption = {
  id: string;
  name: string;
  email: string;
};

export default function WorkstationRequestPage() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [employees, setEmployees] = useState<EmployeeOption[]>([]);
  const [loadingEmployees, setLoadingEmployees] = useState(true);
  const [errorEmployees, setErrorEmployees] = useState<string | null>(null);
  const [computerType, setComputerType] = useState<'POOL' | 'PERSONALIZED'>(
    'POOL',
  );

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/employees`);
        if (!res.ok) throw new Error('Fehler beim Laden der Mitarbeiter');
        const data = await res.json();
        setEmployees(data);
      } catch (err: any) {
        setErrorEmployees(err.message ?? 'Unbekannter Fehler');
      } finally {
        setLoadingEmployees(false);
      }
    };
    load();
  }, []);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSuccess(null);
    setError(null);
    setLoading(true);

    const form = e.currentTarget;
    const formData = new FormData(form);

    const payload = {
      mitarbeiterId: formData.get('mitarbeiterId') as string,
      workTopic: formData.get('workTopic') as string,
      workType: formData.get('workType') as string,
      requestedComputerType: formData.get('requestedComputerType') as string,
      requestedOs: formData.get('requestedOs') || undefined,
      student: {
        firstName: formData.get('studentFirstName') as string,
        lastName: formData.get('studentLastName') as string,
        idmAccount: formData.get('studentIdm') as string,
        email: formData.get('studentEmail') as string,
      },
    };

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/workstation-requests`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        },
      );
      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || 'Fehler beim Absenden');
      }
      setSuccess('Antrag erfolgreich eingereicht.');
      form.reset();
    } catch (err: any) {
      setError(err.message ?? 'Unbekannter Fehler');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="mb-4 text-2xl font-semibold">
        Rechnerarbeitsplatz beantragen
      </h1>

      {success && (
        <div className="mb-4 rounded-md bg-green-50 px-4 py-2 text-sm text-green-800">
          {success}
        </div>
      )}
      {error && (
        <div className="mb-4 rounded-md bg-red-50 px-4 py-2 text-sm text-red-800">
          {error}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="space-y-6 rounded-xl border border-gray-200 bg-white p-6 shadow-sm"
      >
        <div className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Mitarbeiter
            </label>
            <select
              name="mitarbeiterId"
              required
              disabled={loadingEmployees || !!errorEmployees}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900 disabled:bg-gray-100"
              defaultValue=""
            >
              <option value="" disabled>
                {loadingEmployees
                  ? 'Lade Mitarbeiter...'
                  : errorEmployees
                    ? 'Fehler beim Laden'
                    : 'Bitte wählen'}
              </option>
              {employees.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name} ({m.email})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Arbeitsthema
            </label>
            <input
              name="workTopic"
              required
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Arbeitstyp
            </label>
            <select
              name="workType"
              required
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900"
            >
              <option value="BACHELOR">Bachelorarbeit</option>
              <option value="MASTER">Masterarbeit</option>
              <option value="FORSCHUNGSPRAKTIKUM">Forschungspraktikum</option>
            </select>
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-sm font-semibold text-gray-700">
            Studentendaten
          </h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Vorname
              </label>
              <input
                name="studentFirstName"
                required
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Nachname
              </label>
              <input
                name="studentLastName"
                required
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900"
              />
            </div>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              IdM-Kennung
            </label>
            <input
              name="studentIdm"
              required
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              FAU-E-Mail
            </label>
            <input
              type="email"
              name="studentEmail"
              required
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900"
            />
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-sm font-semibold text-gray-700">Rechnerwunsch</h2>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Computertyp
            </label>
            <select
              name="requestedComputerType"
              required
              value={computerType}
              onChange={(e) =>
                setComputerType(e.target.value as 'POOL' | 'PERSONALIZED')
              }
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900"
            >
              <option value="POOL">Pool-Rechner</option>
              <option value="PERSONALIZED">Personalisierter Rechner</option>
            </select>
          </div>

          {computerType === 'PERSONALIZED' && (
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Betriebssystem (nur personalisiert)
              </label>
              <select
                name="requestedOs"
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900"
                required={computerType === 'PERSONALIZED'}
              >
                <option value="">Bitte wählen</option>
                <option value="WINDOWS">Windows</option>
                <option value="LINUX">Linux</option>
              </select>
            </div>
          )}
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 disabled:bg-gray-400"
          >
            {loading ? 'Sende...' : 'Antrag abschicken'}
          </button>
        </div>
      </form>
    </div>
  );
}
