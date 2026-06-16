type HealthScoreCardProps = {
  score: number;
  label: string;
  badgeClass: string;
  ringColor: string;
  scoreOffset: number;
  scoreCircumference: number;
  topReasons: {
    label: string;
    type: string;
  }[];
  confidenceScore: number;
};

export default function HealthScoreCard({
  score,
  label,
  badgeClass,
  ringColor,
  scoreOffset,
  scoreCircumference,
  topReasons,
  confidenceScore,
}: HealthScoreCardProps) {
  return (
    <div className="rounded-[36px] bg-orange-50 p-5 sm:p-6 shadow-sm">
      <p className="text-sm font-black text-gray-500">
        AI Health Score
      </p>

      <div className="mt-4 flex flex-col md:flex-row gap-6">
        <div>
          <div className="relative mx-auto h-40 w-40 md:mx-0">
            <svg className="h-40 w-40 -rotate-90" viewBox="0 0 120 120">
              <circle cx="60" cy="60" r="54" stroke="#e5e7eb" strokeWidth="10" fill="none" />
              <circle
                cx="60"
                cy="60"
                r="54"
                stroke={ringColor}
                strokeWidth="10"
                fill="none"
                strokeLinecap="round"
                strokeDasharray={scoreCircumference}
                strokeDashoffset={scoreOffset}
              />
            </svg>

            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <p className="text-4xl font-black text-gray-900">{score}</p>
              <p className="text-xs font-semibold text-gray-400">out of 100</p>
            </div>
          </div>

          <div className="mt-4 flex justify-center md:justify-start">
            <span className={`inline-flex items-center rounded-full border px-6 py-3 text-xl font-black shadow-sm ${badgeClass}`}>
              {label}
            </span>
          </div>
        </div>

        <div className="flex-1 rounded-[28px] border border-orange-100 bg-white p-5">
          <p className="text-sm font-black text-gray-900 mb-4">
            Why this score?
          </p>

          <div className="space-y-3">
            {topReasons.slice(0, 3).map((reason) => (
              <div key={reason.label} className="flex items-center justify-between gap-3 text-sm">
                <span className="font-semibold text-gray-600">{reason.label}</span>

                <span
                  className={`rounded-full px-3 py-1 text-xs font-black ${
                    reason.type === "bad"
                      ? "bg-red-50 text-red-600"
                      : "bg-green-50 text-green-600"
                  }`}
                >
                  {reason.type === "bad" ? "Needs attention" : "Good"}
                </span>
              </div>
            ))}
          </div>

          <div className="mt-6">
            <div className="mb-1 flex justify-between text-xs text-gray-500">
              <span>Analysis Confidence</span>
              <span>{confidenceScore}%</span>
            </div>

            <div className="h-2 overflow-hidden rounded-full bg-gray-100">
              <div
                className="h-full rounded-full bg-green-500"
                style={{ width: `${confidenceScore}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}