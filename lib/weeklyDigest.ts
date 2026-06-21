type WeeklyScan = {
  product_name: string;
  brand: string | null;
  sugar: number | null;
  fat: number | null;
  salt: number | null;
  nova: string | null;
};

export function generateWeeklyDigest(scans: WeeklyScan[]) {
  const totalScans = scans.length;

  const highSugarCount = scans.filter((item) => (item.sugar || 0) > 15).length;

  const ultraProcessedCount = scans.filter(
    (item) => Number(item.nova) >= 4
  ).length;

  const mainRisk =
    highSugarCount >= ultraProcessedCount && highSugarCount > 0
      ? "High Sugar"
      : ultraProcessedCount > 0
      ? "Ultra-Processed Foods"
      : "No major pattern detected";

  const recommendation =
    mainRisk === "High Sugar"
      ? "Try reducing sugary drinks and sweet packaged snacks this week."
      : mainRisk === "Ultra-Processed Foods"
      ? "Try choosing fewer ultra-processed foods and more whole-food options."
      : "Keep building healthy habits with balanced food choices.";

  return {
    totalScans,
    highSugarCount,
    ultraProcessedCount,
    mainRisk,
    recommendation,
  };
}