// src/app/page.tsx
import Link from 'next/link';

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gray-50">
      <div className="mx-auto flex max-w-4xl flex-col gap-10 px-6 py-16">
        <header>
          <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
            Rechenzentrum · Mitarbeitende
          </p>
          <h1 className="mt-2 text-3xl font-semibold text-gray-900">
            Startseite für Mitarbeitende
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            Diese Seite richtet sich ausschließlich an Mitarbeitende, die
            Rechnerarbeitsplätze betreuen und Anträge verwalten.
          </p>
        </header>

        <section className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="rounded-xl border border-gray-200 bg-white p-4 text-xs shadow-sm">
            <h2 className="text-sm font-semibold text-gray-900">
              Rechnerarbeitsplatz-Anträge
            </h2>
            <p className="mt-2 text-[11px] text-gray-600">
              Studierende stellen ihren Antrag über die separate Antragsseite.
              Hier finden Sie alle eingegangenen Anträge zur weiteren
              Bearbeitung.
            </p>
            <div className="mt-3">
              <Link
                href="/request"
                className="text-[11px] font-medium text-gray-900 underline hover:text-gray-700"
              >
                Zur Antragsseite für Studierende
              </Link>
            </div>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-4 text-xs shadow-sm">
            <h2 className="text-sm font-semibold text-gray-900">
              Admin-Bereich
            </h2>
            <p className="mt-2 text-[11px] text-gray-600">
              Im Admin-Bereich können Sie Computer, Räume, Studierende und
              Anträge verwalten.
            </p>
            <div className="mt-3">
              <Link
                href="/admin"
                className="text-[11px] font-medium text-gray-900 underline hover:text-gray-700"
              >
                Zum Admin-Dashboard
              </Link>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
