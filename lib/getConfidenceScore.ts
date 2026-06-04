export function getConfidenceScore(product: {
  image?: string;
  ingredients?: string;
  nutriscore?: string;
  nova?: string | number;
  sugar?: number;
  fat?: number;
  salt?: number;
}) {
  const checks = {
    image: Boolean(product.image),
    ingredients:
      Boolean(product.ingredients) &&
      product.ingredients !== "Ingredients unavailable",
    nutriscore:
      Boolean(product.nutriscore) &&
      product.nutriscore !== "unknown",
    nova:
      Boolean(product.nova) &&
      product.nova !== "N/A",
    nutrition:
      product.sugar !== undefined &&
      product.fat !== undefined &&
      product.salt !== undefined,
  };

  const passed = Object.values(checks).filter(Boolean).length;
  const score = Math.round((passed / Object.keys(checks).length) * 100);

  const label =
    score >= 90 ? "Excellent" :
    score >= 70 ? "Good" :
    score >= 50 ? "Fair" :
    "Limited";

  return {
    label,
    score,
    checks,
  };
}