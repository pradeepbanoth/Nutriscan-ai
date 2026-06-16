type NutritionDetailsProps = {
  calories?: number;
  protein?: number;
  carbs?: number;
  sugar: number;
  fat: number;
};

export default function NutritionDetails({
  calories,
  protein,
  carbs,
  sugar,
  fat,
}: NutritionDetailsProps) {
  const items = [
    ["Calories", calories || 0, ""],
    ["Protein", protein || 0, "g"],
    ["Carbs", carbs || 0, "g"],
    ["Sugar", sugar, "g"],
    ["Fat", fat, "g"],
  ];

  return (
    <details className="mt-5 rounded-[24px] border border-orange-100 bg-white p-5">
      <summary className="cursor-pointer font-black text-gray-900">
        Nutrition Details
      </summary>

      <div className="mt-5 grid grid-cols-2 gap-4 md:grid-cols-5">
        {items.map(([label, value, unit]) => (
          <div key={label} className="rounded-2xl bg-orange-50 p-4">
            <p className="text-xs text-gray-400">{label}</p>
            <p className="font-black text-orange-600">
              {value}
              {unit}
            </p>
          </div>
        ))}
      </div>
    </details>
  );
}