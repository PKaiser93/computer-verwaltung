// src/app/admin/requests/page.tsx
'use client';

import { useEffect, useState } from 'react';
import {
  fetchWorkstationRequests,
  updateWorkstationRequestStatus,
  WorkstationRequest,
} from '@/lib/api';
import { useToast } from '@/lib/toast/ToastContext';

const statusStyles: Record<'PENDING' | 'APPROVED' | 'REJECTED', string> = {
  PENDING: 'bg-yellow-100 text-yellow-800 border border-yellow-300',
  APPROVED: 'bg-green-100 text-green-800 border border-green-300',
  REJECTED: 'bg-red-100 text-red-800 border border-red-300',
};

export default function AdminRequestsPage() {
  const [requests, setRequests] = useState<WorkstationRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);
  const { showToast } = useToast();

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchWorkstationRequests();
        setRequests(data);
      } catch (err: any) {
        const message =
          err.message ?? 'Unbekannter Fehler beim Laden der Anträge.';
        setError(message);
        showToast(message, 'error');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [showToast]);

  const handleAction = async (
    request: WorkstationRequest,
    action: 'approve' | 'reject',
  ) => {
    const note = window.prompt(
      `Optionale Notiz für ${
        action === 'approve' ? 'Genehmigung' : 'Ablehnung'
      } von Antrag #${request.id}:`,
      request.adminNote ?? '',
    );

    setActionLoadingId(request.id);
    try {
      const updated = await updateWorkstationRequestStatus(
        request.id,
        action,
        note ?? undefined,
      );
      setRequests((prev) =>
        prev.map((r) => (r.id === updated.id ? updated : r)),
      );
      showToast(
        `Antrag #${request.id} wurde ${
          action === 'approve' ? 'genehmigt' : 'abgelehnt'
        }.`,
        'success',
      );
    } catch (err: any) {
      const message = err.message ?? 'Fehler bei der Aktion';
      showToast(message, 'error');
      alert(message);
    } finally {
      setActionLoadingId(null);
    }
  };

  if (loading) {
    return <p className="p-6 text-sm">Lade Anträge...</p>;
  }

  if (error) {
    return <p className="p-6 text-sm text-red-600">Fehler: {error}</p>;
  }

  if (requests.length === 0) {
    return <p className="p-6 text-sm">Keine Anträge vorhanden.</p>;
  }

  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">
            Rechnerarbeitsplatz-Anträge
          </h1>
          <p className="mt-1 text-[11px] text-gray-500">
            Offene und bearbeitete Anträge von Studierenden.
          </p>
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        <table className="min-w-full text-xs">
          <thead className="bg-gray-50">
            <tr className="text-[11px] font-semibold uppercase tracking-wide text-gray-500">
              <th className="px-3 py-2 text-left">ID</th>
              <th className="px-3 py-2 text-left">Thema</th>
              <th className="px-3 py-2 text-left">Student</th>
              <th className="px-3 py-2 text-left">Mitarbeiter</th>
              <th className="px-3 py-2 text-left">Status</th>
              <th className="px-3 py-2 text-left">Admin-Notiz</th>
              <th className="px-3 py-2 text-left">Erstellt am</th>
              <th className="px-3 py-2 text-right">Aktionen</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {requests.map((r) => (
              <tr key={r.id} className="transition-colors hover:bg-gray-50">
                <td className="max-w-[160px] truncate px-3 py-2 font-mono text-[10px] text-gray-500">
                  {r.id}
                </td>

                <td className="px-3 py-2 font-medium text-gray-900">
                  {r.workTopic}
                </td>

                <td className="px-3 py-2">
                  <div className="text-xs text-gray-900">
                    {r.studentFirstName} {r.studentLastName}
                  </div>
                  <div className="text-[11px] text-gray-500">
                    {r.studentIdm} · {r.studentEmail}
                  </div>
                </td>

                <td className="px-3 py-2">
                  <div className="text-xs text-gray-900">
                    {r.mitarbeiterName}
                  </div>
                  <div className="text-[11px] text-gray-500">
                    Mitarbeiter #{r.mitarbeiterId}
                  </div>
                </td>

                <td className="px-3 py-2">
                  <span
                    className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium ${
                      statusStyles[r.status]
                    }`}
                  >
                    {r.status}
                  </span>
                </td>

                <td className="px-3 py-2 text-center">
                  {r.adminNote ? (
                    <span
                      className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-gray-100 text-[11px] font-medium text-gray-700 hover:bg-gray-200 cursor-help"
                      title={r.adminNote}
                    >
                      i
                    </span>
                  ) : (
                    <span className="text-[11px] text-gray-400">–</span>
                  )}
                </td>

                <td className="px-3 py-2 text-[11px] text-gray-500">
                  {new Date(r.createdAt).toLocaleString('de-DE')}
                </td>

                <td className="px-3 py-2 text-right">
                  {r.status === 'PENDING' ? (
                    <div className="inline-flex gap-2">
                      <button
                        className="inline-flex items-center rounded-md bg-green-600 px-2 py-1 text-[11px] font-medium text-white hover:bg-green-700 disabled:cursor-not-allowed disabled:bg-green-300"
                        disabled={
                          actionLoadingId === r.id || r.status === 'APPROVED'
                        }
                        onClick={() => handleAction(r, 'approve')}
                      >
                        {actionLoadingId === r.id && r.status !== 'APPROVED'
                          ? '...'
                          : 'Genehmigen'}
                      </button>
                      <button
                        className="inline-flex items-center rounded-md bg-red-600 px-2 py-1 text-[11px] font-medium text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:bg-red-300"
                        disabled={
                          actionLoadingId === r.id || r.status === 'REJECTED'
                        }
                        onClick={() => handleAction(r, 'reject')}
                      >
                        {actionLoadingId === r.id && r.status !== 'REJECTED'
                          ? '...'
                          : 'Ablehnen'}
                      </button>
                    </div>
                  ) : (
                    <span className="text-[11px] italic text-gray-400">
                      Bereits {r.status}
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
