export function getQuickVerdict(
  score: number,
  sugar: number,
  salt: number,
  nova: number,
  additives: number
) {
  const reasons = [];

  if (sugar > 15) reasons.push("High sugar content");
  if (salt > 1.5) reasons.push("High sodium content");
  if (nova >= 4) reasons.push("Ultra-processed food");
  if (additives > 0) reasons.push("Contains additives");

  if (score >= 80) {
    return {
      title: "Excellent Choice",
      recommendation: "Suitable for regular consumption",
      reasons,
    };
  }

  if (score >= 60) {
    return {
      title: "Moderate Choice",
      recommendation: "Consume in moderation",
      reasons,
    };
  }

  return {
    title: "Limit Consumption",
    recommendation: "Occasional consumption recommended",
    reasons,
  };
}