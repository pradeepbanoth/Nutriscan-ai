export type HealthGoal =
  | "General Wellness"
  | "Weight Loss"
  | "Diabetes Friendly"
  | "Muscle Gain"
  | "Heart Health"
  | "Kids Nutrition";

export function calculateGoalScore(
  goal: HealthGoal,
  sugar: number,
  fat: number,
  salt: number,
  nova: number,
  harmfulCount: number
) {
  let score = 100;

  switch (goal) {
    case "Weight Loss":
      score -= sugar * 2;
      score -= fat * 1.5;
      score -= salt * 5;
      break;

    case "Diabetes Friendly":
      score -= sugar * 3;
      score -= fat * 0.5;
      score -= salt * 3;
      break;

    case "Muscle Gain":
      score -= sugar * 1;
      score -= fat * 0.5;
      score -= salt * 2;
      break;

    case "Heart Health":
      score -= fat * 2;
      score -= salt * 10;
      score -= sugar * 1;
      break;

    case "Kids Nutrition":
      score -= sugar * 2.5;
      score -= fat * 1;
      score -= salt * 4;
      break;

    default:
      score -= sugar * 1.5;
      score -= fat * 0.8;
      score -= salt * 10;
  }

  score -= nova >= 4 ? 20 : nova >= 3 ? 10 : 0;
  score -= harmfulCount * 6;

  return Math.max(0, Math.min(100, Math.round(score)));
}