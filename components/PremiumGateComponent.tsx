import Link from "next/link";

type PremiumGateProps = {
  title?: string;
  description?: string;
};

export default function PremiumGate({
  title = "Premium Feature",
  description = "Upgrade to PAUSTICA Premium to unlock this feature.",
}: PremiumGateProps) {
  return (
    <div className="mx-auto max-w-xl rounded-3xl border border-orange-100 bg-white p-8 text-center shadow-sm">
      <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-3xl bg-orange-100 text-2xl font-black text-orange-600">
        P
      </div>

      <h2 className="text-3xl font-black text-gray-900">{title}</h2>

      <p className="mt-3 text-gray-500">{description}</p>

      <Link
        href="/pricing"
        className="mt-8 inline-block rounded-2xl bg-orange-500 px-8 py-4 font-black text-white"
      >
        View Premium Plans
      </Link>
    </div>
  );
}