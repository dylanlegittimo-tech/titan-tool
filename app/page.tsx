export default function Home() {
  return (
    <main className="min-h-screen p-8 bg-gray-50">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Titan Tool - Personalmanagement
        </h1>
        <p className="text-gray-600 mb-8">
          Willkommen zu deiner neuen Einsatz- und Absenzenplanung!
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-6 bg-white rounded-lg shadow border border-gray-200">
            <h2 className="text-xl font-semibold mb-2 text-gray-800">Einsatzplanung</h2>
            <p className="text-sm text-gray-500">Schichten und Arbeitszeiten verwalten.</p>
          </div>
          <div className="p-6 bg-white rounded-lg shadow border border-gray-200">
            <h2 className="text-xl font-semibold mb-2 text-gray-800">Absenzen & Urlaub</h2>
            <p className="text-sm text-gray-500">Ferienanträge und Ausfälle erfassen.</p>
          </div>
        </div>
      </div>
    </main>
  );
}