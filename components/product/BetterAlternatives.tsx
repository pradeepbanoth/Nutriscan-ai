import Image from "next/image";

type Alternative = {
  name: string;
  brand?: string;
  image?: string;
};

type BetterAlternativesProps = {
  alternatives: Alternative[];
};

export default function BetterAlternatives({
  alternatives,
}: BetterAlternativesProps) {
  if (alternatives.length === 0) return null;

  return (
    <section className="mt-6 rounded-[32px] border border-green-100 bg-white p-5 shadow-sm">
      <p className="text-xs font-black uppercase tracking-wide text-green-600">
        Better Alternatives
      </p>

      <h3 className="mt-1 text-2xl font-black text-gray-900">
        Cleaner choices to try
      </h3>

      <p className="mt-2 text-sm text-gray-500">
        Options that may be better based on available nutrition data.
      </p>

      <div className="mt-5 space-y-3">
        {alternatives.slice(0, 3).map((item, index) => (
          <div
            key={`${item.name}-${index}`}
            className="rounded-[24px] border border-orange-100 bg-orange-50/40 p-4"
          >
            <div className="flex items-center gap-4">
              {item.image ? (
                <Image
                  src={item.image}
                  alt={item.name}
                  width={72}
                  height={72}
                  className="h-[72px] w-[72px] rounded-[20px] border border-orange-100 bg-white object-cover"
                  unoptimized
                />
              ) : (
                <div className="h-[72px] w-[72px] rounded-[20px] border border-orange-100 bg-white" />
              )}

              <div className="min-w-0 flex-1">
                <p className="line-clamp-2 text-base font-black text-gray-900">
                  {item.name}
                </p>

                <p className="mt-1 truncate text-sm font-semibold text-gray-500">
                  {item.brand || "Brand unavailable"}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}