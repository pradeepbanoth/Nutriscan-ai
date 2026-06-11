import { additiveDB } from "./additiveDB";

export type ProductForHealthEngine = {
  sugar?: number;
  salt?: number;
  fat?: number;
  protein?: number;
  carbs?: number;
  calories?: number;
  fiber?: number;
  saturatedFat?: number;
  sodium?: number;
  nova?: string | number;
  ingredients?: string;
  healthGoal?: PersonalHealthGoal;
  servingSize?: number
};

export type AdditiveInsight = {
  code: string;
  name: string;
  risk: "low" | "medium" | "high";
  reason: string;
  scientificView: string;
};

export type HealthEngineResult = {
  score: number;
  grade: "A" | "B" | "C" | "D" | "E";
  label: string;
  verdict: string;
  positives: string[];
  warnings: string[];
  additiveInsights: AdditiveInsight[];
  breakdown: {
    nutrition: number;
    ingredients: number;
    additives: number;
    processing: number;
    personalization: number;
  };
};

export type PersonalHealthGoal =
  | "General Wellness"
  | "Weight Loss"
  | "Diabetes Friendly"
  | "Muscle Gain"
  | "Heart Health"
  | "Kids Nutrition";

function clamp(value: number, min = 0, max = 100) {
  return Math.max(min, Math.min(max, value));
}

function scoreSugar(sugar: number) {
  if (sugar <= 5) return 10;
  if (sugar <= 10) return 7;
  if (sugar <= 15) return 4;
  if (sugar <= 20) return 2;
  return 0;
}

function scoreSalt(salt: number) {
  if (salt <= 0.3) return 10;
  if (salt <= 1) return 7;
  if (salt <= 1.5) return 4;
  if (salt <= 2) return 2;
  return 0;
}

function scoreFat(fat: number) {
  if (fat <= 3) return 10;
  if (fat <= 10) return 7;
  if (fat <= 20) return 4;
  if (fat <= 30) return 2;
  return 0;
}

function scoreFiber(fiber: number) {
  if (fiber >= 8) return 10;
  if (fiber >= 5) return 7;
  if (fiber >= 3) return 4;
  if (fiber >= 1) return 2;
  return 0;
}

function getIngredientCount(ingredients?: string) {
  if (!ingredients) return 0;

  return ingredients
    .split(/,|;|\./)
    .map((item) => item.trim())
    .filter(Boolean).length;
}

function scoreIngredientCount(count: number) {
  if (count === 0) return 8;
  if (count <= 5) return 25;
  if (count <= 10) return 18;
  if (count <= 15) return 10;
  return 0;
}

function scoreNova(nova?: string | number) {
  const value = Number(nova);

  if (value === 1) return 10;
  if (value === 2) return 8;
  if (value === 3) return 5;
  if (value === 4) return 0;

  return 5;
}

function getGrade(score: number): HealthEngineResult["grade"] {
  if (score >= 85) return "A";
  if (score >= 70) return "B";
  if (score >= 55) return "C";
  if (score >= 40) return "D";
  return "E";
}

function getLabel(score: number) {
  if (score >= 85) return "Excellent Choice";
  if (score >= 70) return "Good Choice";
  if (score >= 55) return "Moderate Choice";
  if (score >= 40) return "Poor Choice";
  return "Avoid Often";
}

function getVerdict(
  score: number,
  warnings: string[],
  positives: string[]
) {
  if (score >= 85) {
    return "An excellent choice with strong nutritional quality and few concerns.";
  }

  if (score >= 70) {
    return warnings.length === 0
      ? "A good everyday option with balanced nutrition."
      : "Generally a good choice, though there are a few nutritional considerations.";
  }

  if (score >= 55) {
    return "Reasonable in moderation, but there are nutritional trade-offs worth considering.";
  }

  if (score >= 40) {
    return "Several concerns were detected. Consider healthier alternatives when possible.";
  }

  return "Frequent consumption is not recommended due to multiple nutritional or processing concerns.";
}

export function analyzeHealth(product: ProductForHealthEngine): HealthEngineResult {
  const sugar = product.sugar ?? 0;
  const salt = product.salt ?? 0;
  const fat = product.fat ?? 0;
  const calories = product.calories ?? 0;
  const carbs = product.carbs ?? 0;
  const fiber = product.fiber ?? 0;
  const saturatedFat = product.saturatedFat ?? 0;
  const protein = product.protein ?? 0;
  const ingredients = product.ingredients ?? "";
  const servingSize = product.servingSize ?? 0;
  const servingMultiplier = servingSize > 0 ? servingSize / 100 : 0;

  const positives: string[] = [];
  const warnings: string[] = [];

  const sugarScore = scoreSugar(sugar);
  const saltScore = scoreSalt(salt);
  const fatScore = scoreFat(fat);


  let nutrition = sugarScore + saltScore + fatScore;

  let nutrientDensityBonus = 0;

// Protein bonus
if (protein >= 15) {
  nutrition += 10;
} else if (protein >= 10) {
  nutrition += 7;
} else if (protein >= 5) {
  nutrition += 4;
}

if (protein >= 20) {
  nutrientDensityBonus += 6;
} else if (protein >= 15) {
  nutrientDensityBonus += 4;
} else if (protein >= 10) {
  nutrientDensityBonus += 2;
}

if (protein >= 10) {
  positives.push("Good protein content");
} else if (protein >= 5) {
  positives.push("Some protein present");
}

// Fiber bonus
if (fiber >= 8) {
  nutrition += 8;
} else if (fiber >= 5) {
  nutrition += 5;
} else if (fiber >= 3) {
  nutrition += 2;
}

if (fiber >= 10) {
  nutrientDensityBonus += 6;
} else if (fiber >= 7) {
  nutrientDensityBonus += 4;
} else if (fiber >= 5) {
  nutrientDensityBonus += 2;
}

if (sugar > 0 && fiber > 0) {
  const sugarFiberRatio = sugar / fiber;

  if (sugarFiberRatio <= 1) {
    nutrientDensityBonus += 4;
    positives.push("Good sugar-to-fiber balance");
  }

  if (sugarFiberRatio >= 5) {
    warnings.push("Poor sugar-to-fiber balance");
  }
}

// Calorie moderation
if (calories > 500) {
  nutrition -= 4;
} else if (calories > 350) {
  nutrition -= 2;
}

if (calories > 0) {
  const proteinDensity = (protein * 4) / calories;

  if (proteinDensity >= 0.15) {
    nutrientDensityBonus += 3;
    positives.push("Protein-dense food");
  }
}

nutrition = clamp(
  nutrition + nutrientDensityBonus,
  0,
  40
);

  if (sugar <= 5) positives.push("Low sugar");
  if (sugar > 15) warnings.push(`High sugar (${sugar}g per 100g)`);

  if (salt <= 0.3) positives.push("Low salt");
  if (salt > 1.5) warnings.push(`High salt (${salt}g per 100g)`);

  if (fat <= 3) positives.push("Low fat");
  if (fat > 20) warnings.push(`High fat (${fat}g per 100g)`);

if (servingMultiplier > 0) {
  const sugarPerServing = sugar * servingMultiplier;
  const saltPerServing = salt * servingMultiplier;
  const fatPerServing = fat * servingMultiplier;
  const caloriesPerServing = calories * servingMultiplier;

  if (sugarPerServing > 10) {
    warnings.push(
      `One serving has about ${Math.round(sugarPerServing)}g sugar`
    );
  }

  if (saltPerServing > 1) {
    warnings.push(
      `One serving has about ${saltPerServing.toFixed(1)}g salt`
    );
  }

  if (fatPerServing > 15) {
    warnings.push(
      `One serving has about ${Math.round(fatPerServing)}g fat`
    );
  }

  if (caloriesPerServing > 250) {
    warnings.push(
      `One serving has about ${Math.round(caloriesPerServing)} calories`
    );
  }
}

if (fiber >= 5) {
  positives.push("Good source of fiber");
}

if (fiber < 1) {
  warnings.push("Very low fiber content");
}

  const ingredientCount = getIngredientCount(ingredients);
  let ingredientScore = scoreIngredientCount(ingredientCount);

  if (ingredientCount > 0 && ingredientCount <= 5) {
    positives.push("Short ingredient list");
  }

  if (ingredientCount > 15) {
    warnings.push("Long ingredient list");
  }

  const lowerIngredients = ingredients.toLowerCase();

  const detectedAdditives = Object.entries(additiveDB).filter(
  ([code, additive]) => {
    const ingredientText = lowerIngredients;

    return (
      ingredientText.includes(code.toLowerCase()) ||
      ingredientText.includes(additive.name.toLowerCase())
    );
  }
);

let additivePenalty = 0;
let highRiskAdditives = 0;
let mediumRiskAdditives = 0;
let lowRiskAdditives = 0;

const additiveInsights: AdditiveInsight[] = [];

detectedAdditives.forEach(([code, additive]) => {
  additivePenalty += additive.penalty;

  if (additive.risk === "high") {
  highRiskAdditives++;
}

if (additive.risk === "medium") {
  mediumRiskAdditives++;
}

if (additive.risk === "low") {
  lowRiskAdditives++;
}

  warnings.push(
    `${additive.name} (${code.toUpperCase()}) - ${additive.risk} risk`
  );
  additiveInsights.push({
  code: code.toUpperCase(),
  name: additive.name,
  risk: additive.risk,
  reason: additive.reason,
  scientificView: additive.scientificView,
});
});

ingredientScore = clamp(
  ingredientScore - Math.min(additivePenalty, 10),
  0,
  25
);

let additiveScore = clamp(
  15 - additivePenalty,
  0,
  15
);

if (highRiskAdditives >= 2) {
  additiveScore = Math.max(additiveScore - 2, 0);
}

if (highRiskAdditives >= 4) {
  additiveScore = Math.max(additiveScore - 3, 0);
}

if (highRiskAdditives >= 2) {
  warnings.push(
    `${highRiskAdditives} high-risk additives detected`
  );
}

if (mediumRiskAdditives >= 3) {
  warnings.push(
    `${mediumRiskAdditives} medium-risk additives detected`
  );
}

if (
  highRiskAdditives === 0 &&
  mediumRiskAdditives === 0 &&
  lowRiskAdditives > 0
) {
  positives.push(
    "Only low-risk food additives detected"
  );
}

 let personalization = 10;
const healthGoal = product.healthGoal ?? "General Wellness";

if (healthGoal === "Diabetes Friendly") {
  if (sugar > 10) {
    personalization -= 5;
    warnings.push("High sugar for a diabetes-friendly goal");
  }

  if (carbs > 30) {
    personalization -= 3;
    warnings.push("High carbs for blood-sugar control");
  }

  if (fiber >= 5) {
    positives.push("Good fiber support for blood-sugar balance");
  }
}

if (healthGoal === "Weight Loss") {
  if (calories > 300) {
    personalization -= 4;
    warnings.push("Calorie dense for a weight-loss goal");
  }

  if (protein >= 10) {
    positives.push("Protein may support fullness");
  }

  if (fiber >= 5) {
    positives.push("Fiber may support fullness");
  }
}

if (healthGoal === "Muscle Gain") {
  if (protein >= 15) {
    positives.push("Strong protein support for muscle gain");
  } else if (protein >= 10) {
    positives.push("Good protein for muscle-gain goal");
  } else {
    personalization -= 3;
    warnings.push("Low protein for a muscle-gain goal");
  }
  if (fiber >= 5) {
  positives.push("Good fiber content");
}

if (fiber >= 8) {
  positives.push("Excellent fiber content");
}
}

if (healthGoal === "Heart Health") {
  if (salt > 1.5) {
    personalization -= 4;
    warnings.push("High salt for a heart-health goal");
  }

  if (saturatedFat > 5 || fat > 20) {
    personalization -= 4;
    warnings.push("High fat or saturated fat for a heart-health goal");
  }

  if (fiber >= 5) {
    positives.push("Fiber supports heart-health goals");
  }
}

if (healthGoal === "Kids Nutrition") {
  if (sugar > 10) {
    personalization -= 4;
    warnings.push("High sugar for kids nutrition");
  }

  if (additivePenalty > 4) {
    personalization -= 4;
    warnings.push("Contains additives worth limiting for kids");
  }

  if (protein >= 5) {
    positives.push("Some protein for kids nutrition");
  }
  if (calories > 500) {
  warnings.push("High calorie density");
}

if (fiber < 1 && Number(product.nova) >= 4) {
  warnings.push("Very low fiber for a highly processed product");
}
}

personalization = clamp(personalization, 0, 10);
  let processing = scoreNova(product.nova);

const novaValue = Number(product.nova);

if (novaValue === 4) {
  warnings.push("Ultra-processed product");
}

if (novaValue === 4 && additivePenalty >= 5) {
  processing = Math.max(processing - 2, 0);
  warnings.push("Ultra-processed with multiple additives");
}

if (novaValue === 4 && sugar > 10) {
  processing = Math.max(processing - 2, 0);
  warnings.push("Ultra-processed and high in sugar");
}

if (novaValue === 4 && fiber < 2) {
  processing = Math.max(processing - 1, 0);
  warnings.push("Ultra-processed with low fiber");
}

if (novaValue <= 2 && ingredientCount > 0 && additivePenalty === 0) {
  positives.push("Lower processing level");
}

if (novaValue <= 2 && ingredientCount <= 5 && ingredientCount > 0) {
  processing = Math.min(processing + 1, 10);
  positives.push("Simple, minimally processed profile");
}

  const total = clamp(
    nutrition + ingredientScore + additiveScore + processing + personalization
  );

  return {
    score: Math.round(total),
    grade: getGrade(total),
    label: getLabel(total),
    verdict: getVerdict(
 total,
  warnings,
  positives
),
    positives: positives.slice(0, 5),
    warnings: warnings.slice(0, 6),
    additiveInsights,
    breakdown: {
      nutrition: Math.round(nutrition),
      ingredients: Math.round(ingredientScore),
      additives: Math.round(additiveScore),
      processing: Math.round(processing),
      personalization,
    },
  };
}