export function parseFatSecretNutrition(description: string) {
  const calories = description.match(/Calories:\s*([\d.]+)kcal/i);

  const fat = description.match(/Fat:\s*([\d.]+)g/i);

  const saturatedFat =
    description.match(/Saturated Fat:\s*([\d.]+)g/i) ||
    description.match(/Sat Fat:\s*([\d.]+)g/i);

  const carbs = description.match(/Carbs:\s*([\d.]+)g/i);

  const fiber =
    description.match(/Fiber:\s*([\d.]+)g/i) ||
    description.match(/Fibre:\s*([\d.]+)g/i);

  const protein = description.match(/Protein:\s*([\d.]+)g/i);

  const sodium =
  description.match(/Sodium:\s*([\d.]+)mg/i) ||
  description.match(/Salt:\s*([\d.]+)mg/i);

const sugar =
  description.match(/Sugar:\s*([\d.]+)g/i) ||
  description.match(/Sugars:\s*([\d.]+)g/i);
 return {
  calories: calories ? Number(calories[1]) : 0,

  fat: fat ? Number(fat[1]) : 0,

  saturatedFat: saturatedFat
    ? Number(saturatedFat[1])
    : 0,

  carbs: carbs ? Number(carbs[1]) : 0,

  fiber: fiber ? Number(fiber[1]) : 0,

  protein: protein ? Number(protein[1]) : 0,

  sugar: sugar ? Number(sugar[1]) : 0,

  sodium: sodium ? Number(sodium[1]) : 0,

  salt: sodium
    ? Number(sodium[1]) / 1000 * 2.54
    : 0,
};
}