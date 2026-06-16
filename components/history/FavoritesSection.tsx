import Image from "next/image";
import type { Product } from "@/hooks/useFoodLibrary";

type Props = {
  favorites: Product[];
  onSelect: (item: Product) => void;
  onRemove: (name: string) => void;
};

export default function FavoritesSection({
  favorites,
  onSelect,
  onRemove,
}: Props) {
  if (favorites.length === 0) return null;

  return (
    <div className="max-w-6xl mx-auto mt-20 text-left">
      <h2 className="text-3xl font-black text-gray-900 mb-6">
        Favorites
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {favorites.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-[32px] border border-orange-100 p-5 shadow-lg"
          >
            <button onClick={() => onSelect(item)} className="w-full text-left">
              <div className="flex items-center gap-4">
                {item.image && (
                  <Image
                    src={item.image}
                    alt={item.name}
                    width={80}
                    height={80}
                    className="rounded-[20px] object-cover border border-orange-100"
                    unoptimized
                  />
                )}

                <div className="flex-1">
                  <h3 className="font-black text-gray-900 line-clamp-2">
                    {item.name}
                  </h3>

                  <p className="text-sm text-gray-400 mb-3">
                    {item.brand}
                  </p>

                  <div className="inline-flex px-3 py-1 rounded-full text-xs font-bold bg-orange-100 text-orange-700">
                    Tap to view
                  </div>
                </div>
              </div>
            </button>

            <button
              onClick={() => onRemove(item.name)}
              className="mt-4 w-full text-sm font-bold text-red-500 bg-red-50 px-4 py-2 rounded-full border border-red-100"
            >
              Remove
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}