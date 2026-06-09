export function createCanonicalProductSlug(name: string) {
  let slug = name.toLowerCase().trim();

  slug = slug
    .replace(/\bcocacola\b/g, "coca cola")
    .replace(/\bcoke\b/g, "coca cola")
    .replace(/\bcoca\s*cola\b/g, "coca cola")
    .replace(/\bzro\b/g, "zero")
    .replace(/\bsans sucre\b/g, "zero sugar")
    .replace(/\bsans cafine\b/g, "caffeine free")
    .replace(/\bsans caffeine\b/g, "caffeine free");

  slug = slug
    .replace(/\b(original taste|original|classic|top quality)\b/g, "")
    .replace(/\b(can|bottle|bottles|pet|pack|pk|ct)\b/g, "")
    .replace(/\b\d+(\.\d+)?\s?(ml|cl|l|ltr|liter|litre|oz|fl oz|g|kg)\b/g, "")
    .replace(/\b\d+\b/g, "")
    .replace(/[^a-z0-9\s-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  const bundles: Array<[RegExp, string]> = [
    [/\bdiet\s+coca\s+cola\b/g, "diet coke"],
    [/\bcoca\s+cola\s+diet\b/g, "diet coke"],
    [/\bdiet\s+coke\b/g, "diet coke"],

    [/\bcoca\s+cola\s+zero\s+sugar\b/g, "coca cola zero"],
    [/\bcoca\s+cola\s+zero\b/g, "coca cola zero"],
    [/\bcoke\s+zero\s+sugar\b/g, "coca cola zero"],
    [/\bcoke\s+zero\b/g, "coca cola zero"],

    [/\bsprite\b/g, "sprite"],
    [/\bcappy\s+pulpy\b/g, "cappy pulpy"],
    [/\bhawai\s+tropical\b/g, "hawai tropical"],
  ];

  for (const [pattern, replacement] of bundles) {
    if (pattern.test(slug)) {
      slug = replacement;
      break;
    }
  }

  return slug
    .replace(/\bpet\b/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\s+/g, "-");
}