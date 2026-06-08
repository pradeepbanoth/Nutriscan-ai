export function parseFatSecretNutrition(description: string) {
  const calories = description.match(/Calories:\s*([\d.]+)kcal/i);
  const fat = description.match(/Fat:\s*([\d.]+)g/i);
  const carbs = description.match(/Carbs:\s*([\d.]+)g/i);
  const protein = description.match(/Protein:\s*([\d.]+)g/i);

  return {
    calories: calories ? Number(calories[1]) : 0,
    fat: fat ? Number(fat[1]) : 0,
    carbs: carbs ? Number(carbs[1]) : 0,
    protein: protein ? Number(protein[1]) : 0,
  };
}