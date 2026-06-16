/* eslint-disable @typescript-eslint/no-explicit-any */

import Image from "next/image";

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
    <div className="max-w-2xl mx-auto mt-4">
      <div className="relative">
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            id="paustica-search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
               setSuggestions([]);

if (!canRunAction(lastSearchClickRef, 1500)) return;

searchProduct();
              }
            }}
            placeholder="Search product name..."
            className="flex-1 px-6 py-4 rounded-[20px] border border-orange-100 bg-white outline-none font-semibold shadow-sm"
          />

          <button
            disabled={loading}
            onClick={() => {
              if (!canRunAction(lastSearchClickRef, 1500)) return;
              searchProduct();
            }}
            className="px-6 py-4 rounded-[20px] bg-orange-500 text-white font-bold disabled:opacity-50"
          >
            {loading ? "Searching..." : "Search"}
          </button>
        </div>

        {suggestions.length > 0 && (
          <div className="absolute left-0 right-0 top-full z-50 mt-3 overflow-hidden rounded-[32px] border border-orange-100 bg-white shadow-2xl">
            {suggestions.slice(0, 5).map((item: any, index: number) => (
              <button
                key={index}
                onClick={() => {
                  setSearchQuery(item.product_name || "");
                  analyzeSelectedProduct(item);
                }}
                className="flex w-full items-center gap-4 px-5 py-4 text-left hover:bg-orange-50"
              >
                {item.image_front_url ? (
                  <Image
                    src={item.image_front_url}
                    alt={item.product_name}
                    width={48}
                    height={48}
                    className="rounded-[20px] object-cover border border-orange-100"
                    unoptimized
                  />
                ) : (
                  <div className="h-12 w-12 rounded-[20px] bg-orange-50 border border-orange-100" />
                )}

                <div>
                  <p className="font-bold text-gray-900">
                    {item.product_name || "Unknown Product"}
                  </p>
                  <p className="text-sm text-gray-500">
                    {item.brands || "Unknown Brand"}
                  </p>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}