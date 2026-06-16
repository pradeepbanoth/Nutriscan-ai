import { ingredientIntelligence } from "@/lib/ingredientIntelligence";

const harmfulIngredients = [
  "palm oil",
  "high fructose corn syrup",
  "msg",
  "monosodium glutamate",
  "aspartame",
  "sodium benzoate",
  "artificial flavor",
  "artificial colour",
  "artificial color",
  "yellow 5",
  "red 40",
  "sucralose",
  "acesulfame k",
  "maltodextrin",
  "corn syrup",
  "ins 211",
  "ins211",
  "e211",
  "ins 621",
  "ins621",
  "e621",
  "ins 950",
  "ins950",
  "e950",
  "ins 951",
  "ins951",
  "e951",
  "ins 330",
  "ins330",
  "e330",
  "potassium sorbate",
  "carrageenan",
  "titanium dioxide",
  "polysorbate 80",
  "potassium benzoate",
  "xanthan gum",
  "guar gum",
  "erythritol",
  "stevia",
];

const ingredientAliases: Record<string, string> = {
  e621: "msg",
  ins621: "msg",
  "ins 621": "msg",
  "monosodium glutamate": "msg",
  e211: "sodium benzoate",
  ins211: "sodium benzoate",
  "ins 211": "sodium benzoate",
  e950: "acesulfame k",
  ins950: "acesulfame k",
  "ins 950": "acesulfame k",
  e951: "aspartame",
  ins951: "aspartame",
  "ins 951": "aspartame",
  e330: "ins 330",
  ins330: "ins 330",
};

export function useIngredientInsights(product: any) {
  const detectedHarmful =
    product?.ingredients
      ?.toLowerCase()
      ?.split(",")
      ?.filter((ingredient: string) =>
        harmfulIngredients.some((harmful) => ingredient.includes(harmful))
      ) || [];

  const ingredientInsights = detectedHarmful
    .map((ingredient: string) => {
      const rawKey = ingredient
        .trim()
        .toLowerCase()
        .replace(/[\-\(\)]/g, " ")
        .replace(/\s+/g, " ");

      const normalizedKey = ingredientAliases[rawKey] || rawKey;

      return {
        ingredient,
        info: ingredientIntelligence[normalizedKey],
      };
    })
    .filter((item: any) => item.info);

  const highRiskIngredients = ingredientInsights.filter(
    (item: any) => item.info?.risk === "High"
  ).length;

  const mediumRiskIngredients = ingredientInsights.filter(
    (item: any) => item.info?.risk === "Medium"
  ).length;

  const lowRiskIngredients = ingredientInsights.filter(
    (item: any) => item.info?.risk === "Low"
  ).length;

  const ingredientQuality =
    highRiskIngredients >= 2
      ? "Poor"
      : highRiskIngredients >= 1
      ? "Fair"
      : mediumRiskIngredients >= 3
      ? "Moderate"
      : ingredientInsights.length > 0
      ? "Good"
      : "Excellent";

  return {
    detectedHarmful,
    ingredientInsights,
    highRiskIngredients,
    mediumRiskIngredients,
    lowRiskIngredients,
    ingredientQuality,
  };
}