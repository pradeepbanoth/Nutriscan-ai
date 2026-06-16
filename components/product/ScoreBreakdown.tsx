type ScoreBreakdownProps = {
  breakdown: {
    nutrition: number;
    ingredients: number;
    additives: number;
    processing: number;
    personalization: number;
  };
};

export default function ScoreBreakdown({ breakdown }: ScoreBreakdownProps) {
  const items = [
    ["Nutrition Quality", breakdown.nutrition, 40],
    ["Ingredient Quality", breakdown.ingredients, 25],
    ["Additive Safety", breakdown.additives, 15],
    ["Processing Level", breakdown.processing, 10],
    ["Personalization", breakdown.personalization, 10],
  ];

  return (
    <details className="mt-5 rounded-[32px] border border-orange-100 bg-white p-5 shadow-sm">
      <summary className="cursor-pointer text-lg font-black text-gray-900">
        Score Breakdown
      </summary>

      <div className="mt-4 space-y-3">
        {items.map(([label, value, max]) => (
          <div key={label} className="flex justify-between">
            <span>{label}</span>
            <span className="font-bold text-green-600">
              {value}/{max}
            </span>
          </div>
        ))}
      </div>
    </details>
  );
}