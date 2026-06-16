import Image from "next/image";

type ProductHeaderProps = {
  image?: string;
  name: string;
  brand: string;
  category: string;
  isFavorite: boolean;
  onToggleFavorite: () => void;
};

export default function ProductHeader({
  image,
  name,
  brand,
  category,
  isFavorite,
  onToggleFavorite,
}: ProductHeaderProps) {
  return (
    <div className="text-center">
      {image && (
        <Image
          src={image}
          alt={name}
          width={160}
          height={160}
          className="mx-auto h-36 w-36 rounded-[32px] border border-orange-100 object-cover shadow-md sm:h-44 sm:w-44"
          unoptimized
        />
      )}

      <h2 className="mt-6 text-2xl font-black leading-tight text-gray-900 sm:text-4xl">
        {name}
      </h2>

      <p className="mt-2 text-sm text-gray-500 sm:text-base">{brand}</p>

      <div className="mt-5 flex justify-center gap-3">
        <span className="inline-flex rounded-full border border-orange-100 bg-orange-50 px-4 py-2 text-sm font-black text-orange-600">
          {category}
        </span>

        <button
          onClick={onToggleFavorite}
          className={`rounded-full border px-4 py-2 font-bold transition-all ${
            isFavorite
              ? "border-orange-500 bg-orange-500 text-white"
              : "border-orange-100 bg-white text-orange-600"
          }`}
        >
          {isFavorite ? "Saved" : "Save"}
        </button>
      </div>
    </div>
  );
}