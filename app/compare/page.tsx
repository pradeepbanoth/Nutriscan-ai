"use client";



import Image from "next/image";
import { useState } from "react";
import { searchProductByName } from "@/services/searchService";

type CompareProduct = {
  name?: string;
  brand?: string;
  image?: string;
  sugar?: number;
  fat?: number;
  salt?: number;
  nova?: number | string;
  nutriscore?: string;
  ingredients?: string;
};

function scoreProduct(product: CompareProduct) {
  let score = 100;

  if ((product.sugar ?? 0) > 10) score -= 25;
  if ((product.fat ?? 0) > 15) score -= 20;
  if ((product.salt ?? 0) > 1) score -= 20;

  const nova = Number(product.nova);
  if (nova >= 4) score -= 25;
  if (nova === 3) score -= 15;

  return Math.max(0, Math.min(100, score));
}

function getWinner(a: CompareProduct | null, b: CompareProduct | null) {
  if (!a || !b) return null;

  const aScore = scoreProduct(a);
  const bScore = scoreProduct(b);

  if (aScore === bScore) return "Both are similar";
  return aScore > bScore ? a.name : b.name;
}

export default function ComparePage() {
  const [queryA, setQueryA] = useState("");
  const [queryB, setQueryB] = useState("");
  const [productA, setProductA] = useState<CompareProduct | null>(null);
  const [productB, setProductB] = useState<CompareProduct | null>(null);
  const [loadingA, setLoadingA] = useState(false);
  const [loadingB, setLoadingB] = useState(false);

  const search = async (
    query: string,
    side: "a" | "b"
  ) => {
    if (!query.trim()) return;

   if (side === "a") {
  setLoadingA(true);
} else {
  setLoadingB(true);
}

    try {
      const product = await searchProductByName({ query });

      if (!product) {
        alert("No product found. Try a more specific name.");
        return;
      }

     if (side === "a") {
  setProductA(product as unknown as CompareProduct);
} else {
  setProductB(product as unknown as CompareProduct);
}
    } catch (error) {
      console.log(error);
      alert("Search failed. Please try again.");
    } finally {
     if (side === "a") {
  setLoadingA(false);
} else {
  setLoadingB(false);
}
    }
  };

  const winner = getWinner(productA, productB);

  return (
    <main className="min-h-screen bg-[#fff7ed]">
      <section className="max-w-6xl mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <p className="text-sm font-black uppercase tracking-wider text-orange-600">
            Compare Foods
          </p>

          <h1 className="mt-4 text-4xl md:text-6xl font-black text-gray-900">
            Choose the better option
          </h1>

          <p className="mt-6 max-w-2xl mx-auto text-lg text-gray-500">
            Compare two packaged foods side by side using sugar, fat, salt,
            processing level and PAUSTICA score.
          </p>
        </div>

        <div className="grid lg:grid-cols-[1fr_auto_1fr] gap-8 items-start">
          <CompareSearchCard
            title="Product A"
            query={queryA}
            setQuery={setQueryA}
            loading={loadingA}
            product={productA}
            onSearch={() => search(queryA, "a")}
          />

          <div className="hidden lg:flex h-full items-center justify-center">
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
                label="Sugar"
                a={`${productA.sugar ?? "N/A"} g`}
                b={`${productB.sugar ?? "N/A"} g`}
              />
              <CompareRow
                label="Fat"
                a={`${productA.fat ?? "N/A"} g`}
                b={`${productB.fat ?? "N/A"} g`}
              />
              <CompareRow
                label="Salt"
                a={`${productA.salt ?? "N/A"} g`}
                b={`${productB.salt ?? "N/A"} g`}
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
                PAUSTICA prefers the option with lower sugar, salt, fat and
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
                className="h-16 w-16 rounded-2xl object-cover bg-white"
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
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

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