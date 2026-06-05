export type SmartAlternative = {
  name: string;
  score: number;
  reason: string;
  category: string;
};

export function getAlternatives(
  productName: string,
  goal?: string
): SmartAlternative[] {
const lower = productName.toLowerCase();
const prioritize = (items: SmartAlternative[]) => {
  if (!goal) return items;

  const g = goal.toLowerCase();

  if (g.includes("diabetes")) {
    return items.sort((a, b) =>
      Number(b.reason.toLowerCase().includes("sugar")) -
      Number(a.reason.toLowerCase().includes("sugar"))
    );
  }

  if (g.includes("weight")) {
    return items.sort((a, b) => b.score - a.score);
  }

  if (g.includes("muscle") || g.includes("athlete")) {
    return items.sort((a, b) =>
      Number(b.reason.toLowerCase().includes("protein")) -
      Number(a.reason.toLowerCase().includes("protein"))
    );
  }

  return items;
};

  if (lower.includes("cola") || lower.includes("soda") || lower.includes("pepsi") || lower.includes("coke")) {
    return prioritize([
      { name: "Coconut Water", score: 92, category: "Drink", reason: "Naturally hydrating and far less processed than soft drinks." },
      { name: "Fresh Lime Water", score: 90, category: "Drink", reason: "Refreshing and low sugar when made without added sweeteners." },
      { name: "Unsweetened Sparkling Water", score: 86, category: "Drink", reason: "Gives fizz without added sugar or artificial colors." },
    ]);
  }

  if (lower.includes("chip") || lower.includes("lays") || lower.includes("kurkure") || lower.includes("bingo")) {
    return prioritize([
      { name: "Roasted Makhana", score: 91, category: "Snack", reason: "Crunchy, lighter, and usually less processed than fried snacks." },
      { name: "Roasted Chickpeas", score: 88, category: "Snack", reason: "Higher protein and fiber compared with most chips." },
      { name: "Air-Popped Popcorn", score: 82, category: "Snack", reason: "Better when made with less oil, salt, and flavoring powder." },
    ]);
  }

  if (lower.includes("noodle") || lower.includes("maggi") || lower.includes("ramen")) {
    return prioritize([
      { name: "Oats Upma", score: 88, category: "Meal", reason: "More fiber, simpler ingredients, and less processing." },
      { name: "Millet Noodles", score: 80, category: "Meal", reason: "Better grain profile than refined instant noodles." },
      { name: "Vegetable Poha", score: 84, category: "Meal", reason: "Simple, filling, and easier to make with vegetables." },
    ]);
  }

  if (lower.includes("cookie") || lower.includes("biscuit") || lower.includes("oreo")) {
    return prioritize([
      { name: "Oat Cookies", score: 78, category: "Snack", reason: "Better if made with oats and less added sugar." },
      { name: "Dates with Nuts", score: 86, category: "Snack", reason: "Naturally sweet with fiber, minerals, and healthy fats." },
      { name: "Roasted Peanuts", score: 82, category: "Snack", reason: "More protein and fewer refined ingredients than biscuits." },
    ]);
  }

  if (lower.includes("chocolate") || lower.includes("candy") || lower.includes("toffee")) {
    return prioritize([
      { name: "Dark Chocolate 70%+", score: 76, category: "Sweet", reason: "Better when cocoa is high and sugar is lower." },
      { name: "Dates", score: 84, category: "Sweet", reason: "Natural sweetness with fiber and minerals." },
      { name: "Fruit + Nuts", score: 88, category: "Sweet", reason: "More filling and nutrient-dense than candy." },
    ]);
  }

  if (lower.includes("juice") || lower.includes("frooti") || lower.includes("maaza") || lower.includes("slice")) {
    return prioritize([
      { name: "Whole Fruit", score: 94, category: "Fruit", reason: "Keeps fiber intact and avoids concentrated added sugar." },
      { name: "Homemade Smoothie", score: 86, category: "Drink", reason: "Better when made without added sugar." },
      { name: "Infused Water", score: 82, category: "Drink", reason: "Hydrating with flavor but minimal sugar." },
    ]);
  }

  if (lower.includes("ice cream") || lower.includes("kulfi")) {
    return prioritize([
      { name: "Greek Yogurt with Fruit", score: 86, category: "Dessert", reason: "Higher protein and usually less sugar if unsweetened." },
      { name: "Frozen Banana", score: 84, category: "Dessert", reason: "Naturally sweet and less processed." },
      { name: "Fruit Bowl", score: 90, category: "Dessert", reason: "Fresh, fiber-rich, and lighter than frozen desserts." },
    ]);
  }

  return [];
}