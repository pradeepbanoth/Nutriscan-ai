export function getConfidenceScore(product: {
  image?: string;
  ingredients?: string;
  nutriscore?: string;
  nova?: string | number;
  sugar?: number;
  fat?: number;
  salt?: number;
}) {
  let score = 0;

  if (product.image) score += 20;
  if (product.ingredients && product.ingredients !== "Ingredients unavailable") score += 30;
  if (product.nutriscore && product.nutriscore !== "unknown") score += 15;
  if (product.nova && product.nova !== "N/A") score += 15;
  if (product.sugar !== undefined) score += 7;
  if (product.fat !== undefined) score += 6;
  if (product.salt !== undefined) score += 7;

  if (score >= 80) return { label: "High", score };
  if (score >= 50) return { label: "Medium", score };
  return { label: "Low", score };
}