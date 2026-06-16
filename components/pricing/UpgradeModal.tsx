"use client";

type Props = {
  open: boolean;
  onClose: () => void;
  dailyScansUsed: number;
  freeDailyScanLimit: number;
};

export default function UpgradeModal({
  open,
  onClose,
  dailyScansUsed,
  freeDailyScanLimit,
}: Props) {
  if (!open) return null;

  return (
  <div className="fixed inset-0 z-[100] bg-black/50 flex items-center justify-center p-6">
    <div className="bg-white max-w-lg w-full rounded-[32px] p-8 shadow-2xl">
      <h2 className="heading-font text-xl font-black text-gray-900 mb-3">
        PAUSTICA Premium
      </h2>

      <p className="text-gray-500 mb-6">
      You've used {dailyScansUsed} / {freeDailyScanLimit} free scans today. Upgrade to unlock unlimited scans, AI coach, weekly reports and advanced analysis.
      </p>

      <div className="space-y-3 mb-8">
        <div>✓ Unlimited Scans</div>
        <div>✓ AI Food Coach</div>
        <div>✓ Weekly Reports</div>
        <div>✓ Advanced Ingredient Analysis</div>
        <div>✓ Family Profiles</div>
      </div>

      <button
        className="w-full py-4 rounded-[20px] bg-orange-500 text-white font-black mb-3"
      >
        Coming Soon
      </button>

      <button
        onClick={() => onClose()}
        className="w-full py-4 rounded-[20px] bg-gray-100 text-gray-700 font-bold"
      >
        Close
      </button>
    </div>
  </div>

  );
}