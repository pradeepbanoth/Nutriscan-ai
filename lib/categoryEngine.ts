import { categoryDictionary } from "./categoryDictionary";

export function detectProductCategory(input: {
  name?: string;
  category?: string;
  ingredients?: string;
}) {
  const text =
    `${input.name ?? ""} ${input.category ?? ""} ${input.ingredients ?? ""}`
      .toLowerCase();

 let bestCategory = "Unknown";
let bestScore = 0;

for (const [category, keywords] of Object.entries(categoryDictionary)) {
  let score = 0;

  for (const keyword of keywords) {
    if (text.includes(keyword.toLowerCase())) {
      score++;
    }
  }

  if (score > bestScore) {
    bestScore = score;
    bestCategory = category;
  }
}

return bestCategory;
}