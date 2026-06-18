type QuickSearchesProps = {
  recentSearches: string[];
  searchQuery: string;
  setSearchQuery: (value: string) => void;
  saveRecentSearch: (value: string) => void;
  searchProduct: () => void;
};

export default function QuickSearches({
  recentSearches,
  searchQuery,
  setSearchQuery,
  saveRecentSearch,
  searchProduct,
}: QuickSearchesProps) {
  if (searchQuery.length !== 0) return null;

  const items =
    recentSearches.length > 0
      ? recentSearches
      : ["Diet Coke", "Maggi", "Nutella", "Red Bull", "Lay's"];

  return (
    <section className="mt-10 rounded-3xl border border-gray-100 bg-white p-8 shadow-sm">
      <div className="mb-6">
        <p className="text-sm font-black uppercase tracking-wider text-orange-600">
          Quick searches
        </p>

        <h3 className="mt-3 text-2xl font-black text-gray-900">
          Popular foods
        </h3>

        <p className="mt-2 text-gray-500">
          Start instantly with recent or commonly searched products.
        </p>
      </div>

      <div className="flex flex-wrap gap-3">
        {items.map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => {
              setSearchQuery(item);

              saveRecentSearch(item);

              setTimeout(() => {
                searchProduct();
              }, 0);
            }}
            className="rounded-full border border-gray-100 bg-orange-50 px-5 py-3 text-sm font-black text-orange-600 transition hover:bg-orange-100"
          >
            {item}
          </button>
        ))}
      </div>
    </section>
  );
}