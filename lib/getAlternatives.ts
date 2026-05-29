export function getAlternatives(productName: string) {
  const lower = productName.toLowerCase();

  if (lower.includes("cola") || lower.includes("soda") || lower.includes("pepsi")) {
    return ["Coconut Water", "Sparkling Water", "Fresh Lime Soda"];
  }

  if (lower.includes("chip") || lower.includes("lays") || lower.includes("kurkure")) {
    return ["Roasted Makhana", "Air Popped Popcorn", "Roasted Chickpeas"];
  }

  if (lower.includes("noodle") || lower.includes("maggi")) {
    return ["Millet Noodles", "Whole Wheat Noodles", "Oats Upma"];
  }

  if (lower.includes("cookie") || lower.includes("biscuit")) {
    return ["Oat Cookies", "Nut Bars", "Dry Fruits"];
  }

  if (lower.includes("chocolate")) {
    return ["Dark Chocolate", "Dates", "Protein Bar"];
  }

  return [];
}