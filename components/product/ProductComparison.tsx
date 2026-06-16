type ComparisonItem = {
  name: string;
  score: number;
  sugar: string | number;
  processing: string;
  verdict: string;
};

type ProductComparisonProps = {
  comparisons: ComparisonItem[];
};

export default function ProductComparison({
  comparisons,
}: ProductComparisonProps) {
  if (comparisons.length === 0) return null;

  return (
    <div className="hidden md:block mt-10 text-left">
      <div className="bg-white border border-orange-100 rounded-[32px] p-8 shadow-xl">
        <h3 className="text-2xl font-black text-gray-900 mb-6">
          Product Comparison
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-orange-100">
                <th className="py-3 text-gray-500">Product</th>
                <th className="py-3 text-gray-500">Score</th>
                <th className="py-3 text-gray-500">Sugar</th>
                <th className="py-3 text-gray-500">Processing</th>
                <th className="py-3 text-gray-500">Verdict</th>
              </tr>
            </thead>

            <tbody>
              {comparisons.map((item) => (
                <tr key={item.name} className="border-b border-orange-50">
                  <td className="py-4 font-black text-gray-900">
                    {item.name}
                  </td>

                  <td className="py-4">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-black ${
                        item.score >= 75
                          ? "bg-green-100 text-green-700"
                          : item.score >= 50
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {item.score}/100
                    </span>
                  </td>

                  <td className="py-4 text-gray-700">{item.sugar}</td>
                  <td className="py-4 text-gray-700">{item.processing}</td>
                  <td className="py-4 text-gray-700">{item.verdict}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}