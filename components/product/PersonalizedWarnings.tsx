type Warning = {
  level: string;
  title: string;
  message: string;
};

type PersonalizedWarningsProps = {
  warnings: Warning[];
};

export default function PersonalizedWarnings({
  warnings,
}: PersonalizedWarningsProps) {
  if (warnings.length === 0) return null;

  return (
    <div className="mt-6 space-y-3">
      {warnings.map((warning, index) => (
        <div
          key={index}
          className={`rounded-[20px] border p-5 ${
            warning.level === "High"
              ? "bg-red-50 border-red-200 text-red-700"
              : "bg-yellow-50 border-yellow-200 text-yellow-700"
          }`}
        >
          <p className="font-black mb-2">{warning.title}</p>
          <p className="text-sm leading-relaxed">{warning.message}</p>
        </div>
      ))}
    </div>
  );
}