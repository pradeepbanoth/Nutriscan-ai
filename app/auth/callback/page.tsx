"use client";

export default function AuthCallbackPage() {
  return (
    <main className="min-h-screen bg-[#fff7ed] flex items-center justify-center px-6">
      <div className="w-full max-w-md bg-white border border-orange-100 rounded-[32px] shadow-2xl p-8 text-center">
        <h1 className="text-4xl font-black text-gray-900 mb-4">
          Email Verified
        </h1>

        <p className="text-gray-500 mb-8">
          Your email has been verified successfully. You can now login to PAUSTICA AI.
        </p>

        <a
          href="/auth"
          className="block w-full py-4 rounded-2xl text-white font-bold bg-orange-500"
        >
          Go to Login
        </a>

        <a
          href="/"
          className="block mt-6 text-sm font-bold text-orange-600"
        >
          Back to Home
        </a>
      </div>
    </main>
  );
}