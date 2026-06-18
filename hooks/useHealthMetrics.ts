/* eslint-disable @typescript-eslint/no-explicit-any */

import { analyzeHealth } from "@/lib/healthEngine";
import { detectProductCategory } from "@/lib/categoryEngine";
import { getConfidenceScore } from "@/lib/getConfidenceScore";
import { getPersonalizedWarning } from "@/lib/getPersonalizedWarning";
import { HealthGoal } from "@/lib/goalScoring";
export function useHealthMetrics(
  product: any,
  selectedGoal: HealthGoal,
  ingredientInsights: any[],
  userHeight: string,
  userWeight: string,
  userAge: string
) {
  const productCategory = product
    ? detectProductCategory({
        name: product.name,
        category: product.category,
        ingredients: product.ingredients,
      })
    : "Unknown";

  const healthAnalysis = product
    ? analyzeHealth({
        sugar: product.sugar,
        fat: product.fat,
        salt: product.salt,
        protein: product.protein,
        carbs: product.carbs,
        calories: product.calories,
        nova: product.nova,
        ingredients: product.ingredients,
        healthGoal: selectedGoal,
        fiber: product.fiber,
        saturatedFat: product.saturatedFat,
        sodium: product.sodium,
        servingSize: 0,
      })
    : null;

  const confidence = product
    ? getConfidenceScore(product)
    : null;

  const personalizedWarnings = product
    ? getPersonalizedWarning(
        selectedGoal,
        product.sugar,
        product.fat,
        product.salt,
        Number(product.nova),
        ingredientInsights.length
      )
    : [];

  const bmi =
    Number(userHeight) > 0
      ? Number(userWeight) /
        Math.pow(Number(userHeight) / 100, 2)
      : 0;

  const bmiCategory =
    bmi === 0
      ? "Not calculated"
      : bmi < 18.5
      ? "Underweight"
      : bmi < 25
      ? "Healthy range"
      : bmi < 30
      ? "Overweight"
      : "Obese range";

  const bmr =
    Number(userWeight) > 0 &&
    Number(userHeight) > 0 &&
    Number(userAge) > 0
      ? 10 * Number(userWeight) +
        6.25 * Number(userHeight) -
        5 * Number(userAge) +
        5
      : 0;

  const dailyCalorieTarget =
    bmr === 0
      ? 0
      : selectedGoal === "Weight Loss"
      ? Math.round(bmr + 200)
      : selectedGoal === "Muscle Gain"
      ? Math.round(bmr + 700)
      : Math.round(bmr + 400);

  return {
    productCategory,
    healthAnalysis,
    personalizedWarnings,
    bmi,
    bmiCategory,
    dailyCalorieTarget,
  };
}