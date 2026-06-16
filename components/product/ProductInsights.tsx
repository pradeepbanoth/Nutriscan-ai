type ProductInsightsProps = {
  positives: string[];

  warnings: string[];
};

export default function ProductInsights({
  positives,

  warnings,
}: ProductInsightsProps) {
  return (
    <div className="mt-5 grid gap-4 md:grid-cols-2">
      <div className="rounded-[20px] border border-green-100 bg-green-50 p-5">
        <h4 className="mb-3 font-black text-green-700">
          Positives
        </h4>

        <ul className="space-y-2 text-sm text-green-800">
          {positives.map((item) => (
            <li key={item}>
              {item}
            </li>
          ))}
        </ul>
      </div>

      <div className="rounded-[20px] border border-red-100 bg-red-50 p-5">
        <h4 className="mb-3 font-black text-red-700">
          Warnings
        </h4>

        <ul className="space-y-2 text-sm text-red-800">
          {warnings.map((item) => (
            <li key={item}>
              {item}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
