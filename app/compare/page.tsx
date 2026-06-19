"use client";

import Image from "next/image";
import { useState } from "react";
import { searchProductByName } from "@/services/searchService";

type CompareProduct = {
  name?: string;
  brand?: string;
  image?: string;
  sugar?: number | null;
  fat?: number | null;
  salt?: number | null;
  nova?: number | string | null;
  nutriscore?: string | null;
  ingredients?: string | null;
};

function safeNumber(value: unknown) {
  const number = Number(value);
  return Number.isFinite(number) ? number : 0;
}

function scoreProduct(product: CompareProduct) {
  let score = 100;

  const sugar = safeNumber(product.sugar);
  const fat = safeNumber(product.fat);
  const salt = safeNumber(product.salt);
  const nova = safeNumber(product.nova);

  if (sugar > 22.5) score -= 30;
  else if (sugar > 10) score -= 18;

  if (fat > 17.5) score -= 20;
  else if (fat > 10) score -= 10;

  if (salt > 1.5) score -= 25;
  else if (salt > 0.75) score -= 12;

  if (nova >= 4) score -= 25;
  else if (nova === 3) score -= 12;

  return Math.max(0, Math.min(100, score));
}

function getWinner(a: CompareProduct | null, b: CompareProduct | null) {
  if (!a || !b) return null;

  const aScore = scoreProduct(a);
  const bScore = scoreProduct(b);

  if (Math.abs(aScore - bScore) <= 3) return "Both are similar";
  return aScore > bScore ? a.name || "Product A" : b.name || "Product B";
}

function getVerdict(product: CompareProduct) {
  const score = scoreProduct(product);

  if (score >= 80) return "Better choice";
  if (score >= 60) return "Moderate choice";
  if (score >= 40) return "Limit consumption";
  return "Avoid often";
}

export default function ComparePage() {
  const [queryA, setQueryA] = useState("");
  const [queryB, setQueryB] = useState("");
  const [productA, setProductA] = useState<CompareProduct | null>(null);
  const [productB, setProductB] = useState<CompareProduct | null>(null);
  const [loadingA, setLoadingA] = useState(false);
  const [loadingB, setLoadingB] = useState(false);

  const search = async (query: string, side: "a" | "b") => {
    const cleanQuery = query.trim();

    if (!cleanQuery) return;

    if (side === "a") setLoadingA(true);
    else setLoadingB(true);

    try {
      const product = await searchProductByName({ query: cleanQuery });

      if (!product) {
        alert("No product found. Try a more specific name.");
        return;
      }

      if (side === "a") setProductA(product as CompareProduct);
      else setProductB(product as CompareProduct);
    } catch (error) {
      console.log(error);
      alert("Search failed. Please try again.");
    } finally {
      if (side === "a") setLoadingA(false);
      else setLoadingB(false);
    }
  };

  const winner = getWinner(productA, productB);

  return (
    <main className="min-h-screen bg-[#fff7ed]">
      <section className="mx-auto max-w-6xl px-6 py-20">
        <div className="mb-16 text-center">
          <p className="text-sm font-black uppercase tracking-wider text-orange-600">
            Compare Foods
          </p>

          <h1 className="mt-4 text-4xl font-black text-gray-900 md:text-6xl">
            Choose the better option
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-500">
            Compare two packaged foods using sugar, fat, salt, processing level,
            and PAUSTICA score.
          </p>
        </div>

        <div className="grid items-start gap-8 lg:grid-cols-[1fr_auto_1fr]">
          <CompareSearchCard
            title="Product A"
            query={queryA}
            setQuery={setQueryA}
            loading={loadingA}
            product={productA}
            onSearch={() => search(queryA, "a")}
          />

          <div className="hidden h-full items-center justify-center lg:flex">
            <div className="rounded-full bg-gray-900 px-5 py-3 text-sm font-black text-white">
              VS
            </div>
          </div>

          <CompareSearchCard
            title="Product B"
            query={queryB}
            setQuery={setQueryB}
            loading={loadingB}
            product={productB}
            onSearch={() => search(queryB, "b")}
          />
        </div>

        {productA && productB && (
          <div className="mt-12 rounded-3xl border border-gray-100 bg-white p-8 shadow-sm">
            <h2 className="text-3xl font-black text-gray-900">
              Comparison Result
            </h2>

            <div className="mt-8 overflow-hidden rounded-3xl border border-gray-100">
              <CompareRow
                label="PAUSTICA Score"
                a={`${scoreProduct(productA)}/100`}
                b={`${scoreProduct(productB)}/100`}
              />

              <CompareRow
                label="Verdict"
                a={getVerdict(productA)}
                b={getVerdict(productB)}
              />

              <CompareRow
                label="Sugar"
                a={`${safeNumber(productA.sugar)} g`}
                b={`${safeNumber(productB.sugar)} g`}
              />

              <CompareRow
                label="Fat"
                a={`${safeNumber(productA.fat)} g`}
                b={`${safeNumber(productB.fat)} g`}
              />

              <CompareRow
                label="Salt"
                a={`${safeNumber(productA.salt)} g`}
                b={`${safeNumber(productB.salt)} g`}
              />

              <CompareRow
                label="Processing"
                a={`NOVA ${productA.nova ?? "N/A"}`}
                b={`NOVA ${productB.nova ?? "N/A"}`}
              />

              <CompareRow
                label="NutriScore"
                a={String(productA.nutriscore ?? "N/A").toUpperCase()}
                b={String(productB.nutriscore ?? "N/A").toUpperCase()}
              />
            </div>

            <div className="mt-8 rounded-3xl bg-orange-50 p-8">
              <p className="text-sm font-black uppercase tracking-wider text-orange-600">
                Better choice
              </p>

              <h3 className="mt-3 text-3xl font-black text-gray-900">
                {winner}
              </h3>

              <p className="mt-3 text-gray-500">
                PAUSTICA prefers the food with lower sugar, salt, fat, and a
                lower processing level.
              </p>
            </div>
          </div>
        )}
      </section>
    </main>
  );
}

function CompareSearchCard({
  title,
  query,
  setQuery,
  loading,
  product,
  onSearch,
}: {
  title: string;
  query: string;
  setQuery: (value: string) => void;
  loading: boolean;
  product: CompareProduct | null;
  onSearch: () => void;
}) {
  return (
    <div className="rounded-3xl border border-gray-100 bg-white p-8 shadow-sm">
      <h2 className="text-2xl font-black text-gray-900">{title}</h2>

      <div className="mt-6 grid gap-3 sm:grid-cols-[1fr_auto]">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") onSearch();
          }}
          placeholder="Search product..."
          className="rounded-2xl border border-gray-100 bg-orange-50/50 px-5 py-4 font-bold outline-none focus:border-orange-300 focus:bg-white"
        />

        <button
          onClick={onSearch}
          disabled={loading || !query.trim()}
          className="rounded-2xl bg-orange-500 px-6 py-4 text-sm font-black text-white disabled:opacity-50"
        >
          {loading ? "Searching..." : "Search"}
        </button>
      </div>

      {product && (
        <div className="mt-8 rounded-3xl border border-gray-100 bg-orange-50/50 p-5">
          <div className="flex items-center gap-4">
            {product.image ? (
              <Image
                src={product.image}
                alt={product.name || "Product"}
                width={64}
                height={64}
                className="h-16 w-16 rounded-2xl bg-white object-cover"
                unoptimized
              />
            ) : (
              <div className="h-16 w-16 rounded-2xl bg-white" />
            )}

            <div>
              <h3 className="font-black text-gray-900">
                {product.name || "Unknown product"}
              </h3>

              <p className="text-sm font-semibold text-gray-500">
                {product.brand || "Unknown brand"}
              </p>

              <p className="mt-1 text-sm font-black text-orange-600">
                Score: {scoreProduct(product)}/100
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

<div className="mt-6 rounded-3xl bg-white border border-orange-100 p-6">

  <h4 className="font-black text-gray-900">
    Why?
  </h4>

  <ul className="mt-4 space-y-3 text-gray-600">

    <li>✓ Lower sugar content</li>

    <li>✓ Less processed</li>

    <li>✓ Better nutrition profile</li>

  </ul>

</div>

function CompareRow({
  label,
  a,
  b,
}: {
  label: string;
  a: string;
  b: string;
}) {
  return (
    <div className="grid grid-cols-3 border-b border-gray-100 last:border-b-0">
      <div className="bg-orange-50 px-4 py-4 font-black text-gray-900">
        {label}
      </div>

      <div className="px-4 py-4 font-bold text-gray-600">{a}</div>

      <div className="px-4 py-4 font-bold text-gray-600">{b}</div>
    </div>
  );
}