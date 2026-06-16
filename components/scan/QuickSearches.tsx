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
    <div className="mt-4 flex flex-wrap justify-center gap-2">
      {items.map((item) => (
        <button
          key={item}
          onClick={() => {
            setSearchQuery(item);

            if (recentSearches.length > 0) {
              saveRecentSearch(item);
              setTimeout(() => {
                searchProduct();
              }, 0);
            }
          }}
          className="rounded-full border border-orange-100 bg-orange-50 px-4 py-2 text-sm font-bold text-orange-600 hover:bg-white"
        >
          {item}
        </button>
      ))}
    </div>
  );
}