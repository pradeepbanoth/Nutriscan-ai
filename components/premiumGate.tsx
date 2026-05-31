type PremiumGateProps = {
  title?: string;
  description?: string;
};

export default function PremiumGate({
  title = "Premium Feature",
  description = "Upgrade to PAUSTICA Premium to unlock this feature.",
}: PremiumGateProps) {
  return (
    <div className="bg-white border border-orange-100 rounded-[36px] shadow-2xl p-8 text-center max-w-xl mx-auto">
      <div className="w-16 h-16 rounded-3xl bg-orange-100 text-orange-600 flex items-center justify-center mx-auto mb-5 text-2xl font-black">
        P
      </div>

      <h2 className="text-3xl font-black text-gray-900 mb-3">
        {title}
      </h2>

      <p className="text-gray-500 mb-8">
        {description}
      </p>

      <a
        href="/pricing"
        className="inline-block px-8 py-4 rounded-2xl bg-orange-500 text-white font-bold"
      >
        View Premium Plans
      </a>
    </div>
  );
}