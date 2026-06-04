import { HealthGoal } from "./goalScoring";

export function getPersonalizedWarning(
  goal: HealthGoal,
  sugar: number,
  fat: number,
  salt: number,
  nova: number,
  additives: number
) {
  if (goal === "Diabetes Friendly" && sugar > 10) {
    return {
      level: "High",
      title: "Not ideal for diabetes-friendly goal",
      message:
        "This product has high sugar per 100g, which may contribute to blood sugar spikes.",
    };
  }

  if (goal === "Weight Loss" && (sugar > 12 || fat > 18)) {
    return {
      level: "Medium",
      title: "May not support weight-loss goal",
      message:
        "This product is calorie-dense due to sugar or fat. Consume occasionally and check portion size.",
    };
  }

  if (goal === "Heart Health" && (salt > 1.2 || fat > 15)) {
    return {
      level: "High",
      title: "Not ideal for heart-health goal",
      message:
        "This product may contain high salt or fat, which may not support a heart-health-focused diet.",
    };
  }

  if (goal === "Kids Nutrition" && (sugar > 12 || additives > 0)) {
    return {
      level: "Medium",
      title: "Use caution for kids",
      message:
        "This product may contain added sugar or additives. Prefer simpler foods for children when possible.",
    };
  }

  if (goal === "Muscle Gain" && sugar > 18 && nova >= 4) {
    return {
      level: "Medium",
      title: "Low-quality muscle-gain choice",
      message:
        "This product may provide calories, but ultra-processed high-sugar foods are not ideal for quality nutrition.",
    };
  }

  if (nova >= 4 && additives >= 2) {
    return {
      level: "Medium",
      title: "Highly processed product",
      message:
        "This product appears highly processed and contains multiple additives. Best consumed occasionally.",
    };
  }

  return null;
}