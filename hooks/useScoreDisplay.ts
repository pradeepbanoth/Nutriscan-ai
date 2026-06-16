export function useScoreDisplay(healthAnalysis: any, product: any) {
  const healthScore = healthAnalysis?.score ?? 0;
  const scoreLabel = healthAnalysis?.label ?? "Moderate Choice";

  const scoreRingColor =
    healthScore >= 80
      ? "#16a34a"
      : healthScore >= 60
      ? "#ca8a04"
      : healthScore >= 40
      ? "#ca8a04"
      : "#dc2626";

  const scoreCircumference = 2 * Math.PI * 54;
  const scoreOffset =
    scoreCircumference - (healthScore / 100) * scoreCircumference;

  const healthColor =
    healthScore >= 80
      ? "green"
      : healthScore >= 60
      ? "yellow"
      : healthScore >= 40
      ? "orange"
      : "red";

  const confidenceScore = product
    ? [product.image, product.ingredients, product.nutriscore, product.nova].filter(Boolean)
        .length * 25
    : 0;

  const healthBadgeClass =
    healthColor === "green"
      ? "bg-green-100 text-green-700 border-green-200"
      : healthColor === "yellow"
      ? "bg-yellow-100 text-yellow-700 border-yellow-200"
      : healthColor === "orange"
      ? "bg-orange-100 text-yellow-700 border-orange-200"
      : "bg-red-100 text-red-700 border-red-200";

  const topReasons = product
    ? [
        {
          label:
            product.sugar <= 7
              ? "Low sugar"
              : product.sugar > 15
              ? "High sugar"
              : "Moderate sugar",
          type: product.sugar > 15 ? "bad" : "good",
        },
        {
          label:
            product.salt <= 0.5
              ? "Low salt"
              : product.salt > 1.5
              ? "High salt"
              : "Moderate salt",
          type: product.salt > 1.5 ? "bad" : "good",
        },
        {
          label: Number(product.nova) >= 4 ? "Ultra processed" : "Lower processing",
          type: Number(product.nova) >= 4 ? "bad" : "good",
        },
      ]
    : [];

  const breakdown = healthAnalysis?.breakdown ?? {
    nutrition: 0,
    ingredients: 0,
    additives: 0,
    processing: 0,
    personalization: 0,
  };

  return {
    healthScore,
    scoreLabel,
    scoreRingColor,
    scoreCircumference,
    scoreOffset,
    confidenceScore,
    healthBadgeClass,
    topReasons,
    breakdown,
  };
}