// src/app/admin/rooms/new/page.tsx
'use client';

import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { apiFetch } from '@/lib/api/apiFetch';
import { useToast } from '@/lib/toast/ToastContext';

type CreateRoomDto = {
  name: string;
};

type Room = {
  id: string;
  name: string;
};

export default function NewRoomPage() {
  const router = useRouter();
  const { showToast } = useToast();
  const [name, setName] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;

    setSubmitting(true);
    setError(null);

    const result = await apiFetch<Room>('/rooms', {
      method: 'POST',
      body: { name: name.trim() } as CreateRoomDto,
    });

    if (!result.ok) {
      setError(result.userMessage ?? 'Raum konnte nicht angelegt werden.');
      setSubmitting(false);
      return;
    }

    // Erfolg-Toast
    showToast(`Raum "${result.data.name}" wurde angelegt.`, 'success');

    // Redirect
    router.push('/admin/rooms/dashboard');
  }

  return (
    <div className="p-6 space-y-6 max-w-md">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Neuen Raum anlegen</h1>
        <Link
          href="/admin/rooms"
          className="text-[11px] text-gray-600 hover:text-gray-900 underline"
        >
          Zurück zu Räume
        </Link>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="name"
            className="block text-[11px] font-medium text-gray-700"
          >
            Raumname
          </label>
          <input
            id="name"
            name="name"
            type="text"
            required
            maxLength={100}
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-[13px] shadow-sm focus:border-emerald-600 focus:outline-none focus:ring-1 focus:ring-emerald-600"
            placeholder="z.B. H12/01.34 oder CIP-Pool 1"
          />
          <p className="mt-1 text-[10px] text-gray-500">
            Name muss eindeutig sein (wird als Schlüssel für Zuweisungen
            genutzt).
          </p>
        </div>

        {error && <p className="text-[11px] text-red-600">{error}</p>}

        <button
          type="submit"
          disabled={submitting || !name.trim()}
          className="inline-flex items-center rounded-md bg-emerald-600 px-4 py-2 text-[11px] font-medium text-white hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-emerald-300"
        >
          {submitting ? 'Speichere...' : 'Raum anlegen'}
        </button>
      </form>
    </div>
  );
}
