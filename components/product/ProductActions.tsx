import Link from "next/link";

type ProductActionsProps = {
  productSlug: string;
  onLogFood: () => void;
};

export default function ProductActions({
  productSlug,
  onLogFood,
}: ProductActionsProps) {
  return (
    <div className="mt-6 flex flex-col gap-3 sm:flex-row">
      <button
        onClick={onLogFood}
        className="inline-flex justify-center rounded-[20px] bg-orange-500 px-6 py-4 font-black text-white"
      >
        Log Food
      </button>

      <Link
        href={`/product/${productSlug}`}
        className="inline-flex justify-center rounded-[20px] bg-gray-900 px-6 py-4 font-black text-white"
      >
        View Full Analysis
      </Link>
    </div>
  );
}