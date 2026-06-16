import Image from "next/image";
import type { Product } from "@/hooks/useFoodLibrary";



type Props = {
  scanHistory: Product[];
  onSelect: (item: Product) => void;
  onClear: () => void;
};

export default function ScanHistory({
  scanHistory,
  onSelect,
  onClear,
}: Props) {
  if (scanHistory.length === 0) return null;

  return (
    <details className="max-w-6xl mx-auto mt-8 bg-white rounded-[32px] border border-orange-100 shadow-xl p-6">

      <div className="flex items-center justify-between mb-6">

        <summary className="cursor-pointer text-2xl font-black text-gray-900 list-none">
          Recent Scans
        </summary>

        <button
          onClick={onClear}
          className="text-sm font-bold text-red-500 bg-red-50 px-4 py-2 rounded-full border border-red-100"
        >
          Clear History
        </button>

      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

        {scanHistory.map((item) => (

          <button
            key={item.id}
            onClick={() => onSelect(item)}
            className="text-left bg-white rounded-[32px] border border-orange-100 p-5 shadow-lg hover:transition-all"
          >

            <div className="flex items-start gap-3">

              {item.image && (
                <Image
                  src={item.image}
                  alt={item.name}
                  width={64}
                  height={64}
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

        ))}

      </div>

    </details>
  );
}