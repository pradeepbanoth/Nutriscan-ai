"use client";



import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import posthog from "posthog-js";

import PremiumGate from "@/components/PremiumGateComponent";
import { usePremium } from "@/hooks/usePremium";
import { AnalyticsEvents } from "@/lib/analyticsEvents";
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
  allergyMatched?: boolean;
  matchedAllergies?: string[];
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

function getVerdict(score: number) {
  if (score >= 80) return "Better choice";
  if (score >= 60) return "Moderate choice";
  if (score >= 40) return "Limit consumption";
  return "Avoid often";
}

function getWinner(productA: CompareProduct, productB: CompareProduct) {
  const scoreA = scoreProduct(productA);
  const scoreB = scoreProduct(productB);

  if (Math.abs(scoreA - scoreB) <= 3) {
    return {
      label: "Both are similar",
      reason: "Their PAUSTICA scores are close, so check ingredients and personal goals before choosing.",
    };
  }

  const winner = scoreA > scoreB ? productA : productB;

  return {
    label: winner.name || "Better product",
    reason: "PAUSTICA prefers the option with better nutrition balance and lower processing risk.",
  };
}

export default function ComparePage() {
  const [queryA, setQueryA] = useState("");
  const [queryB, setQueryB] = useState("");
  const [productA, setProductA] = useState<CompareProduct | null>(null);
  const [productB, setProductB] = useState<CompareProduct | null>(null);
  const [loadingSide, setLoadingSide] = useState<"a" | "b" | null>(null);
  const [error, setError] = useState("");

  const trackedComparisonRef = useRef("");

  const { loading: premiumLoading, isPremium } = usePremium();

  const comparison = useMemo(() => {
    if (!productA || !productB) return null;

    const scoreA = scoreProduct(productA);
    const scoreB = scoreProduct(productB);
    const winner = getWinner(productA, productB);

    return {
      scoreA,
      scoreB,
      verdictA: getVerdict(scoreA),
      verdictB: getVerdict(scoreB),
      winner,
    };
  }, [productA, productB]);

  useEffect(() => {
    if (!productA || !productB || !comparison) return;

    const key = `${productA.name}-${productB.name}-${comparison.winner.label}`;

    if (trackedComparisonRef.current === key) return;

    trackedComparisonRef.current = key;

    posthog.capture(AnalyticsEvents.COMPARE_USED, {
      product_a: productA.name,
      product_b: productB.name,
      score_a: comparison.scoreA,
      score_b: comparison.scoreB,
      winner: comparison.winner.label,
    });
  }, [productA, productB, comparison]);

  const search = async (query: string, side: "a" | "b") => {
    const cleanQuery = query.trim();

    if (!cleanQuery || loadingSide) return;

    setError("");
    setLoadingSide(side);

    try {
      const product = await searchProductByName({ query: cleanQuery });

      if (!product) {
        setError("No product found. Try a more specific product name.");
        return;
      }

      if (side === "a") {
        setProductA(product as CompareProduct);
      } else {
        setProductB(product as CompareProduct);
      }
    } catch (err) {
      console.error("Compare search failed:", err);
      setError("Search failed. Please try again.");
    } finally {
      setLoadingSide(null);
    }
  };

  if (premiumLoading) {
    return (
      <main className="min-h-screen bg-[#fff7ed] flex items-center justify-center">
        <p className="text-gray-500 font-bold">Checking premium access...</p>
      </main>
    );
  }

  if (!isPremium) {
    return (
      <main className="min-h-screen bg-[#fff7ed] flex items-center justify-center px-6">
        <PremiumGate
          title="Product Comparison is Premium"
          description="Upgrade to compare foods side by side and choose healthier options."
        />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#fff7ed]">
      <section className="mx-auto max-w-6xl px-6 py-20">
        <div className="mb-14 text-center">
          <p className="text-sm font-black uppercase tracking-wider text-orange-600">
            Compare Foods
          </p>

          <h1 className="mt-4 text-4xl font-black text-gray-900 md:text-6xl">
            Choose the better option
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-gray-500">
            Compare packaged foods using sugar, fat, salt, processing level,
            allergy signals, and PAUSTICA scores.
          </p>
        </div>

        {error && (
          <div className="mb-8 rounded-3xl border border-red-200 bg-red-50 p-5 text-center font-bold text-red-600">
            {error}
          </div>
        )}

        <div className="grid items-start gap-8 lg:grid-cols-[1fr_auto_1fr]">
          <CompareSearchCard
            title="Product A"
            query={queryA}
            setQuery={setQueryA}
            loading={loadingSide === "a"}
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
            loading={loadingSide === "b"}
            product={productB}
            onSearch={() => search(queryB, "b")}
          />
        </div>

        {productA && productB && comparison && (
          <ComparisonResult
            productA={productA}
            productB={productB}
            scoreA={comparison.scoreA}
            scoreB={comparison.scoreB}
            verdictA={comparison.verdictA}
            verdictB={comparison.verdictB}
            winner={comparison.winner}
          />
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
          className="rounded-2xl bg-orange-500 px-6 py-4 text-sm font-black text-white disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? "Searching..." : "Search"}
        </button>
      </div>

      {product && <ProductPreview product={product} />}
    </div>
  );
}

function ProductPreview({ product }: { product: CompareProduct }) {
  const score = scoreProduct(product);

  return (
    <div className="mt-8 rounded-3xl border border-gray-100 bg-orange-50/50 p-5">
      <div className="flex items-center gap-4">
        {product.image ? (
          <Image
            src={product.image}
            alt={product.name || "Product"}
            width={72}
            height={72}
            className="h-18 w-18 rounded-2xl bg-white object-cover"
            unoptimized
          />
        ) : (
          <div className="h-18 w-18 rounded-2xl bg-white" />
        )}

        <div className="min-w-0">
          <h3 className="truncate font-black text-gray-900">
            {product.name || "Unknown product"}
          </h3>

          <p className="truncate text-sm font-semibold text-gray-500">
            {product.brand || "Unknown brand"}
          </p>

          <p className="mt-1 text-sm font-black text-orange-600">
            Score: {score}/100
          </p>

          {product.allergyMatched && product.matchedAllergies?.length ? (
            <p className="mt-1 text-xs font-black text-red-600">
              Contains: {product.matchedAllergies.join(", ")}
            </p>
          ) : null}
        </div>
      </div>
    </div>
  );
}

function ComparisonResult({
  productA,
  productB,
  scoreA,
  scoreB,
  verdictA,
  verdictB,
  winner,
}: {
  productA: CompareProduct;
  productB: CompareProduct;
  scoreA: number;
  scoreB: number;
  verdictA: string;
  verdictB: string;
  winner: {
    label: string;
    reason: string;
  };
}) {
  return (
    <div className="mt-12 rounded-3xl border border-gray-100 bg-white p-8 shadow-sm">
      <h2 className="text-3xl font-black text-gray-900">
        Comparison Result
      </h2>

      <div className="mt-8 overflow-hidden rounded-3xl border border-gray-100">
        <CompareRow label="PAUSTICA Score" a={`${scoreA}/100`} b={`${scoreB}/100`} />
        <CompareRow label="Verdict" a={verdictA} b={verdictB} />
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
          {winner.label}
        </h3>

        <p className="mt-3 text-gray-500">{winner.reason}</p>
      </div>
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