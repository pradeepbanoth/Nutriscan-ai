type RiskSummaryCardsProps = {
  sugar: number;
  fat: number;
  salt: number;
  nova: string | number;
};

export default function RiskSummaryCards({
  sugar,
  fat,
  salt,
  nova,
}: RiskSummaryCardsProps) {
  const cards = [
    {
      label: "Sugar Risk",
      value: sugar > 15 ? "High" : sugar > 7 ? "Medium" : "Low",
    },
    {
      label: "Fat Risk",
      value: fat > 20 ? "High" : fat > 10 ? "Medium" : "Low",
    },
    {
      label: "Salt Risk",
      value: salt > 1.5 ? "High" : salt > 0.5 ? "Medium" : "Low",
    },
    {
      label: "Processing",
      value: Number(nova) >= 4 ? "Ultra" : Number(nova) >= 3 ? "Processed" : "Low",
    },
  ];

  return (
    <div className="mt-5 grid grid-cols-2 gap-4 md:grid-cols-4">
      {cards.map((card) => (
        <div
          key={card.label}
          className="rounded-[20px] border border-orange-100 bg-white p-4"
        >
          <p className="mb-1 text-xs text-gray-400">{card.label}</p>
          <p className="font-black text-orange-600">{card.value}</p>
        </div>
      ))}
    </div>
  );
}