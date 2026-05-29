export default function ScanPage() {
  return (
    <main className="min-h-screen bg-orange-50 flex items-center justify-center p-8">
      <div className="bg-white rounded-3xl border border-orange-100 shadow-xl p-10 text-center max-w-md">
        <h1 className="text-3xl font-black text-gray-900 mb-4">
          PAUSTICA Scanner
        </h1>

        <p className="text-gray-500">
          Scanner is available on the home page.
        </p>

        <a
          href="/"
          className="inline-block mt-6 px-6 py-3 rounded-2xl bg-orange-500 text-white font-bold"
        >
          Go to Home
        </a>
      </div>
    </main>
  );
}