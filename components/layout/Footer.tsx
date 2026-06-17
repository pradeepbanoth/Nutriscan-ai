"use client";

import Link from "next/link";

type Props = {
  onUpgrade: () => void;
};

export default function Footer({ onUpgrade }: Props) {
  return (
    <footer className="mt-20 border-t border-orange-100 bg-white">
  <div className="max-w-7xl mx-auto px-6 py-12">
    <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
      <div>
        <p className="text-xl font-black text-gray-900">
          PAUSTICA
        </p>
        <p className="mt-3 max-w-sm text-sm text-gray-500 leading-relaxed">
          Food intelligence made simple for everyday choices.
        </p>
      </div>

      <div>
        <p className="text-sm font-black text-gray-900 mb-4">
          Product
        </p>
        <div className="space-y-3 text-sm font-bold text-gray-500">
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="block hover:text-orange-500 transition"
          >
            Scanner
          </button>
          <Link href="/dashboard" className="block hover:text-orange-500 transition">
            Dashboard
          </Link>
          <button
            onClick={onUpgrade}
            className="block hover:text-orange-500 transition"
          >
            Premium
          </button>
        </div>
      </div>

      <div>
        <p className="text-sm font-black text-gray-900 mb-4">
          Support
        </p>
        <div className="space-y-3 text-sm font-bold text-gray-500">
          <Link href="/trust" className="block hover:text-orange-500 transition">
            Got a Question?
          </Link>
          <a
            href="mailto:banothpradeep0203@gmail.com"
            className="block hover:text-orange-500 transition"
          >
            Contact
          </a>
          <Link href="/trust#privacy" className="block hover:text-orange-500 transition">
            Privacy & Terms
          </Link>
        </div>
      </div>
    </div>

    <div className="mt-10 border-t border-orange-100 pt-6 flex flex-col md:flex-row justify-between gap-4 text-sm text-gray-400">
      <p>© 2026 PAUSTICA. All rights reserved.</p>
      <p>Made for smarter food decisions.</p>
    </div>
  </div>
</footer>
  );
}