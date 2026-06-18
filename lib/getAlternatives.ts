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
      return items.sort(
        (a, b) =>
          Number(b.reason.toLowerCase().includes("sugar")) -
          Number(a.reason.toLowerCase().includes("sugar"))
      );
    }

    if (g.includes("weight")) {
      return items.sort((a, b) => b.score - a.score);
    }

    if (g.includes("muscle") || g.includes("athlete")) {
      return items.sort(
        (a, b) =>
          Number(b.reason.toLowerCase().includes("protein")) -
          Number(a.reason.toLowerCase().includes("protein"))
      );
    }

    return items;
  };

  if (
    lower.includes("cola") ||
    lower.includes("soda") ||
    lower.includes("pepsi") ||
    lower.includes("coke") ||
    lower.includes("sprite") ||
    lower.includes("fanta")
  ) {
    return prioritize([
      { name: "Coconut Water", score: 92, category: "Drink", reason: "Naturally hydrating and far less processed than soft drinks." },
      { name: "Fresh Lime Water", score: 90, category: "Drink", reason: "Refreshing and low sugar when made without added sweeteners." },
      { name: "Unsweetened Sparkling Water", score: 86, category: "Drink", reason: "Gives fizz without added sugar or artificial colors." },
      { name: "Plain Buttermilk", score: 84, category: "Drink", reason: "Cooling, lighter, and better for digestion when unsweetened." },
      { name: "Infused Water", score: 82, category: "Drink", reason: "Adds flavor without sugar, caffeine, or artificial colors." },
    ]);
  }

  if (
    lower.includes("energy drink") ||
    lower.includes("red bull") ||
    lower.includes("monster") ||
    lower.includes("sting")
  ) {
    return prioritize([
      { name: "Black Coffee", score: 82, category: "Drink", reason: "Provides caffeine without added sugar when consumed plain." },
      { name: "Green Tea", score: 88, category: "Drink", reason: "Light caffeine with antioxidants and no added sugar." },
      { name: "Coconut Water", score: 92, category: "Drink", reason: "Hydrates better without high caffeine or sugar load." },
      { name: "Lemon Water", score: 90, category: "Drink", reason: "Simple hydration without stimulants or artificial additives." },
    ]);
  }

  if (
    lower.includes("chip") ||
    lower.includes("lays") ||
    lower.includes("kurkure") ||
    lower.includes("bingo") ||
    lower.includes("doritos")
  ) {
    return prioritize([
      { name: "Roasted Makhana", score: 91, category: "Snack", reason: "Crunchy, lighter, and usually less processed than fried snacks." },
      { name: "Roasted Chickpeas", score: 88, category: "Snack", reason: "Higher protein and fiber compared with most chips." },
      { name: "Air-Popped Popcorn", score: 82, category: "Snack", reason: "Better when made with less oil, salt, and flavoring powder." },
      { name: "Roasted Peanuts", score: 82, category: "Snack", reason: "More protein and healthy fats than fried chips." },
      { name: "Homemade Chana Chaat", score: 89, category: "Snack", reason: "More fiber, protein, and fresh ingredients." },
    ]);
  }

  if (
    lower.includes("noodle") ||
    lower.includes("maggi") ||
    lower.includes("ramen") ||
    lower.includes("yippee")
  ) {
    return prioritize([
      { name: "Oats Upma", score: 88, category: "Meal", reason: "More fiber, simpler ingredients, and less processing." },
      { name: "Millet Noodles", score: 80, category: "Meal", reason: "Better grain profile than refined instant noodles." },
      { name: "Vegetable Poha", score: 84, category: "Meal", reason: "Simple, filling, and easier to make with vegetables." },
      { name: "Homemade Vermicelli Upma", score: 82, category: "Meal", reason: "Better when cooked with vegetables and less masala." },
      { name: "Vegetable Dalia", score: 87, category: "Meal", reason: "Higher fiber and less processed than instant noodles." },
    ]);
  }

  if (
    lower.includes("cookie") ||
    lower.includes("biscuit") ||
    lower.includes("oreo") ||
    lower.includes("bourbon")
  ) {
    return prioritize([
      { name: "Oat Cookies", score: 78, category: "Snack", reason: "Better if made with oats and less added sugar." },
      { name: "Dates with Nuts", score: 86, category: "Snack", reason: "Naturally sweet with fiber, minerals, and healthy fats." },
      { name: "Roasted Peanuts", score: 82, category: "Snack", reason: "More protein and fewer refined ingredients than biscuits." },
      { name: "Fruit Bowl", score: 90, category: "Snack", reason: "Naturally sweet and rich in fiber." },
      { name: "Homemade Ragi Cookies", score: 80, category: "Snack", reason: "Better grain profile when made with less sugar." },
    ]);
  }

  if (
    lower.includes("chocolate") ||
    lower.includes("candy") ||
    lower.includes("toffee") ||
    lower.includes("kitkat") ||
    lower.includes("dairy milk")
  ) {
    return prioritize([
      { name: "Dark Chocolate 70%+", score: 76, category: "Sweet", reason: "Better when cocoa is high and sugar is lower." },
      { name: "Dates", score: 84, category: "Sweet", reason: "Natural sweetness with fiber and minerals." },
      { name: "Fruit + Nuts", score: 88, category: "Sweet", reason: "More filling and nutrient-dense than candy." },
      { name: "Banana Peanut Butter Bites", score: 82, category: "Sweet", reason: "More satisfying with natural sweetness and healthy fats." },
      { name: "Homemade Cocoa Milk", score: 78, category: "Sweet", reason: "Better when sugar is controlled at home." },
    ]);
  }

  if (
    lower.includes("juice") ||
    lower.includes("frooti") ||
    lower.includes("maaza") ||
    lower.includes("slice") ||
    lower.includes("fruit drink")
  ) {
    return prioritize([
      { name: "Whole Fruit", score: 94, category: "Fruit", reason: "Keeps fiber intact and avoids concentrated added sugar." },
      { name: "Homemade Smoothie", score: 86, category: "Drink", reason: "Better when made without added sugar." },
      { name: "Infused Water", score: 82, category: "Drink", reason: "Hydrating with flavor but minimal sugar." },
      { name: "Fresh Lemon Water", score: 90, category: "Drink", reason: "Refreshing without packaged sugar load." },
      { name: "Tender Coconut Water", score: 92, category: "Drink", reason: "Natural hydration with fewer additives." },
    ]);
  }

  if (lower.includes("ice cream") || lower.includes("kulfi")) {
    return prioritize([
      { name: "Greek Yogurt with Fruit", score: 86, category: "Dessert", reason: "Higher protein and usually less sugar if unsweetened." },
      { name: "Frozen Banana", score: 84, category: "Dessert", reason: "Naturally sweet and less processed." },
      { name: "Fruit Bowl", score: 90, category: "Dessert", reason: "Fresh, fiber-rich, and lighter than frozen desserts." },
      { name: "Homemade Curd Parfait", score: 84, category: "Dessert", reason: "Better when made with fruit and no added sugar." },
      { name: "Chia Pudding", score: 82, category: "Dessert", reason: "More fiber and healthy fats when lightly sweetened." },
    ]);
  }

  if (
    lower.includes("bread") ||
    lower.includes("white bread") ||
    lower.includes("bun") ||
    lower.includes("pav")
  ) {
    return prioritize([
      { name: "Whole Wheat Bread", score: 78, category: "Bakery", reason: "More fiber than refined white bread." },
      { name: "Multigrain Bread", score: 80, category: "Bakery", reason: "Better grain diversity when made with real grains." },
      { name: "Ragi Roti", score: 88, category: "Meal", reason: "Higher fiber and minerals than refined bread." },
      { name: "Homemade Chapati", score: 86, category: "Meal", reason: "Less processed and easier to control ingredients." },
    ]);
  }

  if (
    lower.includes("cereal") ||
    lower.includes("corn flakes") ||
    lower.includes("chocos") ||
    lower.includes("muesli")
  ) {
    return prioritize([
      { name: "Plain Oats", score: 90, category: "Breakfast", reason: "High fiber and low sugar when unsweetened." },
      { name: "Homemade Muesli", score: 84, category: "Breakfast", reason: "Better when made with nuts, seeds, and no added sugar." },
      { name: "Vegetable Upma", score: 84, category: "Breakfast", reason: "More balanced and less sugary than packaged cereals." },
      { name: "Idli with Sambar", score: 86, category: "Breakfast", reason: "More filling and balanced with lentils." },
    ]);
  }

  if (
    lower.includes("namkeen") ||
    lower.includes("mixture") ||
    lower.includes("sev") ||
    lower.includes("bhujia")
  ) {
    return prioritize([
      { name: "Roasted Chana", score: 88, category: "Snack", reason: "Higher protein and less oily than namkeen." },
      { name: "Roasted Makhana", score: 91, category: "Snack", reason: "Crunchy with less oil and processing." },
      { name: "Sprouts Chaat", score: 92, category: "Snack", reason: "Fresh, protein-rich, and fiber-rich." },
      { name: "Boiled Corn Chaat", score: 82, category: "Snack", reason: "Better when made with less salt and butter." },
    ]);
  }

  if (
    lower.includes("cake") ||
    lower.includes("pastry") ||
    lower.includes("donut") ||
    lower.includes("muffin")
  ) {
    return prioritize([
      { name: "Banana Oats Muffin", score: 78, category: "Dessert", reason: "Better when made with oats and less sugar." },
      { name: "Fruit Bowl", score: 90, category: "Dessert", reason: "Naturally sweet and nutrient-dense." },
      { name: "Dates with Nuts", score: 86, category: "Dessert", reason: "Sweet but more filling and less refined." },
      { name: "Homemade Ragi Cake", score: 76, category: "Dessert", reason: "Better grain profile when sugar is controlled." },
    ]);
  }

  if (
    lower.includes("pizza") ||
    lower.includes("burger") ||
    lower.includes("fries")
  ) {
    return prioritize([
      { name: "Homemade Veg Sandwich", score: 80, category: "Meal", reason: "Better when made with whole grains and fresh vegetables." },
      { name: "Paneer Wrap", score: 78, category: "Meal", reason: "Can be higher protein and more balanced." },
      { name: "Vegetable Dosa", score: 82, category: "Meal", reason: "Less processed and easier to make balanced." },
      { name: "Grilled Sweet Potato", score: 84, category: "Snack", reason: "Better carb source than fries." },
    ]);
  }

  if (
    lower.includes("sauce") ||
    lower.includes("ketchup") ||
    lower.includes("mayonnaise") ||
    lower.includes("mayo")
  ) {
    return prioritize([
      { name: "Homemade Tomato Chutney", score: 82, category: "Condiment", reason: "Less sugar and fewer preservatives when homemade." },
      { name: "Hung Curd Dip", score: 84, category: "Condiment", reason: "Higher protein and lighter than mayonnaise." },
      { name: "Mint Chutney", score: 86, category: "Condiment", reason: "Fresh, flavorful, and low sugar." },
      { name: "Peanut Chutney", score: 80, category: "Condiment", reason: "More nutritious when made with less oil and salt." },
    ]);
  }

  if (
    lower.includes("protein bar") ||
    lower.includes("granola bar") ||
    lower.includes("energy bar")
  ) {
    return prioritize([
      { name: "Boiled Eggs", score: 90, category: "Protein", reason: "High protein with minimal processing." },
      { name: "Greek Yogurt", score: 86, category: "Protein", reason: "High protein and better when unsweetened." },
      { name: "Roasted Chickpeas", score: 88, category: "Protein Snack", reason: "Protein and fiber without hidden syrups." },
      { name: "Paneer Cubes", score: 82, category: "Protein", reason: "Simple protein source when consumed in moderation." },
    ]);
  }

  if (lower.includes("milkshake") || lower.includes("shake")) {
  return prioritize([
    { name: "Homemade Banana Smoothie", score: 84, category: "Drink", reason: "More natural and better when made without added sugar." },
    { name: "Plain Lassi", score: 82, category: "Drink", reason: "Better when unsweetened and made fresh." },
    { name: "Greek Yogurt Smoothie", score: 86, category: "Drink", reason: "Higher protein and more filling." },
    { name: "Fruit + Curd Bowl", score: 88, category: "Snack", reason: "Keeps fiber and protein together." },
  ]);
}

if (lower.includes("ready to eat") || lower.includes("frozen meal")) {
  return prioritize([
    { name: "Homemade Dal Rice", score: 88, category: "Meal", reason: "Less processed and more balanced." },
    { name: "Vegetable Khichdi", score: 90, category: "Meal", reason: "Simple, filling, and easy to digest." },
    { name: "Curd Rice", score: 84, category: "Meal", reason: "Cooling and less processed when homemade." },
    { name: "Chapati with Sabzi", score: 86, category: "Meal", reason: "Fresh and easier to control oil and salt." },
  ]);
}

if (lower.includes("coffee") || lower.includes("cold coffee")) {
  return prioritize([
    { name: "Black Coffee", score: 82, category: "Drink", reason: "Avoids sugar and creamers when consumed plain." },
    { name: "Unsweetened Iced Coffee", score: 80, category: "Drink", reason: "Lower sugar than packaged cold coffee." },
    { name: "Green Tea", score: 88, category: "Drink", reason: "Light caffeine and no added sugar." },
    { name: "Milk Coffee Without Sugar", score: 78, category: "Drink", reason: "Better when sugar is controlled." },
  ]);
}

if (lower.includes("tea") || lower.includes("iced tea")) {
  return prioritize([
    { name: "Green Tea", score: 88, category: "Drink", reason: "Low calorie and antioxidant-rich." },
    { name: "Lemon Tea Without Sugar", score: 84, category: "Drink", reason: "Refreshing with less sugar." },
    { name: "Herbal Tea", score: 86, category: "Drink", reason: "Caffeine-free and light." },
    { name: "Masala Chai With Less Sugar", score: 76, category: "Drink", reason: "Better when sugar is reduced." },
  ]);
}

if (lower.includes("yogurt") || lower.includes("flavoured yogurt")) {
  return prioritize([
    { name: "Plain Curd", score: 88, category: "Dairy", reason: "Less sugar and fewer additives." },
    { name: "Greek Yogurt", score: 86, category: "Dairy", reason: "Higher protein and more filling." },
    { name: "Curd with Fruit", score: 84, category: "Dairy", reason: "Natural sweetness with fiber." },
    { name: "Homemade Lassi", score: 82, category: "Dairy", reason: "Better when made without added sugar." },
  ]);
}

if (lower.includes("cheese") || lower.includes("cheese spread")) {
  return prioritize([
    { name: "Paneer", score: 82, category: "Dairy", reason: "Simple protein source with fewer additives." },
    { name: "Hung Curd Spread", score: 84, category: "Spread", reason: "Lighter and higher protein than cheese spread." },
    { name: "Peanut Chutney", score: 80, category: "Spread", reason: "More nutrient-dense when made fresh." },
    { name: "Avocado Spread", score: 82, category: "Spread", reason: "Healthy fats and less processing." },
  ]);
}

if (lower.includes("jam") || lower.includes("spread")) {
  return prioritize([
    { name: "Peanut Butter Without Sugar", score: 82, category: "Spread", reason: "More protein and healthy fats." },
    { name: "Fruit Compote", score: 78, category: "Spread", reason: "Better when made at home with less sugar." },
    { name: "Mashed Banana Spread", score: 84, category: "Spread", reason: "Natural sweetness with fiber." },
    { name: "Dates Paste", score: 80, category: "Spread", reason: "Natural sweetness and minerals." },
  ]);
}

if (lower.includes("breakfast bar") || lower.includes("snack bar")) {
  return prioritize([
    { name: "Trail Mix", score: 84, category: "Snack", reason: "Better when made with nuts and seeds." },
    { name: "Roasted Chana", score: 88, category: "Snack", reason: "Higher protein and fiber." },
    { name: "Fruit with Nuts", score: 88, category: "Snack", reason: "Balanced sweetness, fiber, and healthy fats." },
    { name: "Homemade Energy Balls", score: 80, category: "Snack", reason: "Better when made with dates, nuts, and no syrup." },
  ]);
}

if (lower.includes("soup") || lower.includes("instant soup")) {
  return prioritize([
    { name: "Homemade Vegetable Soup", score: 88, category: "Soup", reason: "Lower sodium and fresher ingredients." },
    { name: "Dal Soup", score: 90, category: "Soup", reason: "Higher protein and more filling." },
    { name: "Tomato Rasam", score: 84, category: "Soup", reason: "Light and usually less processed." },
    { name: "Clear Vegetable Broth", score: 82, category: "Soup", reason: "Hydrating and lighter than instant soup." },
  ]);
}

if (lower.includes("pasta") || lower.includes("macaroni")) {
  return prioritize([
    { name: "Whole Wheat Pasta", score: 78, category: "Meal", reason: "More fiber than refined pasta." },
    { name: "Vegetable Dalia", score: 87, category: "Meal", reason: "Less processed and more filling." },
    { name: "Millet Pasta", score: 82, category: "Meal", reason: "Better grain profile." },
    { name: "Homemade Tomato Pasta", score: 80, category: "Meal", reason: "Better when sauce is made fresh." },
  ]);
}

if (lower.includes("processed meat") || lower.includes("sausage") || lower.includes("salami")) {
  return prioritize([
    { name: "Grilled Chicken", score: 82, category: "Protein", reason: "Less processed and higher protein." },
    { name: "Boiled Eggs", score: 90, category: "Protein", reason: "Simple protein with minimal additives." },
    { name: "Paneer Tikka", score: 80, category: "Protein", reason: "Better when grilled and made fresh." },
    { name: "Sprouts Bowl", score: 92, category: "Protein", reason: "Plant protein with fiber." },
  ]);
}

if (lower.includes("fried") || lower.includes("pakoda") || lower.includes("samosa")) {
  return prioritize([
    { name: "Baked Samosa", score: 72, category: "Snack", reason: "Lower oil than deep-fried versions." },
    { name: "Sprouts Chaat", score: 92, category: "Snack", reason: "Fresh, filling, and protein-rich." },
    { name: "Roasted Chana", score: 88, category: "Snack", reason: "Crunchy with better protein and fiber." },
    { name: "Vegetable Sandwich", score: 80, category: "Snack", reason: "More balanced when made with whole grains." },
  ]);
}

if (lower.includes("sweet") || lower.includes("mithai") || lower.includes("laddu")) {
  return prioritize([
    { name: "Dates with Nuts", score: 86, category: "Sweet", reason: "Naturally sweet and more filling." },
    { name: "Fruit Bowl", score: 90, category: "Sweet", reason: "Fresh sweetness with fiber." },
    { name: "Homemade Til Laddu", score: 78, category: "Sweet", reason: "Better when sugar or jaggery is controlled." },
    { name: "Greek Yogurt with Fruit", score: 86, category: "Sweet", reason: "Higher protein and less refined sugar." },
  ]);
}

  return [];
}