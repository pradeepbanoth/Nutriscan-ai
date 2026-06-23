/* eslint-disable @typescript-eslint/no-explicit-any */

import Image from "next/image";
import type React from "react";
import posthog from "posthog-js";
import { AnalyticsEvents } from "@/lib/analyticsEvents";

type SearchSectionProps = {
  searchQuery: string;
  setSearchQuery: (value: string) => void;
  suggestions: any[];
  setSuggestions: (value: any[]) => void;
  loading: boolean;
  searchProduct: () => void;
  analyzeSelectedProduct: (item: Record<string, unknown>) => void;
  canRunAction: (
    ref: React.MutableRefObject<number>,
    delay: number
  ) => boolean;
  lastSearchClickRef: React.MutableRefObject<number>;
};

export default function SearchSection({
  searchQuery,
  setSearchQuery,
  suggestions,
  setSuggestions,
  loading,
  searchProduct,
  analyzeSelectedProduct,
  canRunAction,
  lastSearchClickRef,
}: SearchSectionProps) {
  return (
    <section className="rounded-3xl border border-gray-100 bg-white p-8 shadow-sm">
      <div className="mb-8">
        <p className="text-sm font-black uppercase tracking-wider text-orange-600">
          Product search
        </p>

        <h2 className="mt-3 text-3xl font-black text-gray-900">
          Search food manually
        </h2>

        <p className="mt-3 text-gray-500">
          Type a product name to find nutrition details, ingredients, scores and
          smarter alternatives.
        </p>
      </div>

      <div className="relative">
        <div className="grid gap-3 sm:grid-cols-[1fr_auto]">
          <input
            id="paustica-search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key !== "Enter") return;

setSuggestions([]);

if (!canRunAction(lastSearchClickRef, 1500)) return;

posthog.capture(AnalyticsEvents.SEARCH_STARTED, {
  source: "enter_key",

  query_length: searchQuery.trim().length,
});

searchProduct();
            }}
            placeholder="Search product name..."
            className="w-full rounded-2xl border border-gray-100 bg-orange-50/50 px-5 py-4 font-bold text-gray-900 outline-none transition focus:border-orange-300 focus:bg-white"
          />

          <button
            type="button"
            disabled={loading || !searchQuery.trim()}
           onClick={() => {
  if (!canRunAction(lastSearchClickRef, 1500)) return;

  posthog.capture(AnalyticsEvents.SEARCH_STARTED, {
    source: "search_button",

    query_length: searchQuery.trim().length,
  });

  searchProduct();
}}
            className="rounded-2xl bg-orange-500 px-6 py-4 text-sm font-black text-white transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? "Searching..." : "Search"}
          </button>
        </div>

        {suggestions.length > 0 && (
          <div className="absolute left-0 right-0 top-full z-50 mt-3 overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-xl">
            {suggestions.slice(0, 5).map((item: any, index: number) => (
              <button
                key={`${item.product_name || "product"}-${index}`}
                type="button"
               onClick={() => {
  posthog.capture(AnalyticsEvents.SEARCH_COMPLETED, {
    source: "suggestion",

    product_name: item.product_name,

    brand: item.brands,
  });

  setSearchQuery(item.product_name || "");

  setSuggestions([]);

  analyzeSelectedProduct(item);
}}
                className="flex w-full items-center gap-4 px-5 py-4 text-left transition hover:bg-orange-50"
              >
                {item.image_front_url ? (
                  <Image
                    src={item.image_front_url}
                    alt={item.product_name || "Product image"}
                    width={52}
                    height={52}
                    className="h-13 w-13 rounded-2xl border border-gray-100 object-cover"
                    unoptimized
                  />
                ) : (
                  <div className="h-13 w-13 shrink-0 rounded-2xl border border-gray-100 bg-orange-50" />
                )}

                <div className="min-w-0">
                  <p className="truncate font-black text-gray-900">
                    {item.product_name || "Unknown Product"}
                  </p>

                  <p className="truncate text-sm font-semibold text-gray-500">
                    {item.brands || "Unknown Brand"}
                  </p>

                  {item.allergyMatched && item.matchedAllergies?.length > 0 && (
                   <p className="mt-1 text-xs font-black text-red-600">
                           Contains: {item.matchedAllergies.join(", ")}
                        </p>
                   )}
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}