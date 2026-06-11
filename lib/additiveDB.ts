export type AdditiveRisk = "low" | "medium" | "high";

export type AdditiveInfo = {
  name: string;
  risk: AdditiveRisk;
  penalty: number;
  reason: string;
  scientificView: string;
};

export const additiveDB: Record<string, AdditiveInfo> = {
  e102: {
    name: "Tartrazine",
    risk: "high",
    penalty: 5,
    reason: "Synthetic yellow food color used in processed foods and drinks.",
    scientificView:
      "Some consumers may be sensitive to synthetic colors. Intake should be limited, especially for children.",
  },
  e110: {
    name: "Sunset Yellow FCF",
    risk: "high",
    penalty: 5,
    reason: "Synthetic orange-yellow color often used in sweets and beverages.",
    scientificView:
      "Artificial colors are approved in many regions but may be better limited in frequent consumption.",
  },
  e122: {
    name: "Carmoisine",
    risk: "medium",
    penalty: 4,
    reason: "Synthetic red color used in confectionery and desserts.",
    scientificView:
      "Generally regulated, but some users prefer avoiding artificial colors.",
  },
  e124: {
    name: "Ponceau 4R",
    risk: "high",
    penalty: 5,
    reason: "Synthetic red color commonly used in highly processed foods.",
    scientificView:
      "Artificial color intake is best minimized, especially in children’s foods.",
  },
  e129: {
    name: "Allura Red AC",
    risk: "medium",
    penalty: 4,
    reason: "Synthetic red color used in drinks, candy, and snacks.",
    scientificView:
      "Approved for use in some countries, but artificial colors remain controversial for sensitive users.",
  },
  e211: {
    name: "Sodium Benzoate",
    risk: "high",
    penalty: 8,
    reason: "Preservative used in acidic foods and soft drinks.",
    scientificView:
      "Generally permitted within limits, but frequent intake from processed foods should be moderated.",
  },
  e202: {
    name: "Potassium Sorbate",
    risk: "medium",
    penalty: 3,
    reason: "Preservative used to prevent mold and yeast growth.",
    scientificView:
      "Considered safe within allowed levels, but indicates a more processed product.",
  },
  e220: {
    name: "Sulphur Dioxide",
    risk: "medium",
    penalty: 4,
    reason: "Preservative used in dried fruits, juices, and packaged foods.",
    scientificView:
      "Can trigger sensitivity in some people, especially those with asthma.",
  },
  e250: {
    name: "Sodium Nitrite",
    risk: "high",
    penalty: 8,
    reason: "Preservative used in processed meats.",
    scientificView:
      "Processed meat preservatives are best limited due to long-term health concerns.",
  },
  e320: {
    name: "BHA",
    risk: "high",
    penalty: 8,
    reason: "Synthetic antioxidant used to preserve fats and oils.",
    scientificView:
      "Controversial additive. Some health agencies advise limiting exposure.",
  },
  e321: {
    name: "BHT",
    risk: "medium",
    penalty: 5,
    reason: "Synthetic antioxidant used in processed foods.",
    scientificView:
      "Permitted in regulated amounts, but frequent exposure is best minimized.",
  },
  e330: {
    name: "Citric Acid",
    risk: "low",
    penalty: 1,
    reason: "Acidity regulator commonly used in packaged foods.",
    scientificView:
      "Generally considered safe and commonly found in foods.",
  },
  e407: {
    name: "Carrageenan",
    risk: "medium",
    penalty: 4,
    reason: "Thickener used in dairy alternatives and processed foods.",
    scientificView:
      "Food-grade carrageenan is allowed, but some consumers report digestive sensitivity.",
  },
  e412: {
    name: "Guar Gum",
    risk: "low",
    penalty: 1,
    reason: "Thickener and stabilizer used in sauces and dairy products.",
    scientificView:
      "Generally considered safe; may cause bloating in sensitive users.",
  },
  e415: {
    name: "Xanthan Gum",
    risk: "low",
    penalty: 1,
    reason: "Thickener used in sauces, dressings, and gluten-free foods.",
    scientificView:
      "Generally considered safe in typical food quantities.",
  },
  e420: {
    name: "Sorbitol",
    risk: "medium",
    penalty: 3,
    reason: "Sugar alcohol sweetener used in sugar-free foods.",
    scientificView:
      "Can cause digestive discomfort when consumed in large amounts.",
  },
  e621: {
    name: "MSG",
    risk: "medium",
    penalty: 3,
    reason: "Flavor enhancer used in savory packaged foods.",
    scientificView:
      "Generally recognized as safe, but some users prefer limiting it due to sensitivity.",
  },
  e951: {
    name: "Aspartame",
    risk: "medium",
    penalty: 5,
    reason: "Artificial sweetener used in diet drinks and sugar-free foods.",
    scientificView:
      "Approved within daily intake limits, but not suitable for people with PKU.",
  },
  e950: {
    name: "Acesulfame K",
    risk: "medium",
    penalty: 4,
    reason: "Artificial sweetener often used with other sweeteners.",
    scientificView:
      "Approved within limits, but frequent intake of artificial sweeteners should be moderated.",
  },
  e955: {
    name: "Sucralose",
    risk: "medium",
    penalty: 4,
    reason: "Artificial sweetener used in low-calorie foods and drinks.",
    scientificView:
      "Approved for use, but long-term frequent consumption is still debated.",
  },
    e100: {
    name: "Curcumin",
    risk: "low",
    penalty: 0,
    reason: "Natural yellow color derived from turmeric.",
    scientificView:
      "Generally considered safe in typical food-use amounts.",
  },
  e101: {
    name: "Riboflavin",
    risk: "low",
    penalty: 0,
    reason: "Vitamin B2 used as a yellow color.",
    scientificView:
      "Commonly used and generally considered safe in permitted amounts.",
  },
  e104: {
    name: "Quinoline Yellow",
    risk: "medium",
    penalty: 4,
    reason: "Synthetic yellow-green food color.",
    scientificView:
      "Permitted in some regions but artificial colors are better limited, especially for children.",
  },
  e120: {
    name: "Cochineal / Carmine",
    risk: "low",
    penalty: 1,
    reason: "Natural red color derived from insects.",
    scientificView:
      "Generally permitted, but may not suit vegan diets and can trigger allergy in rare cases.",
  },
  e127: {
    name: "Erythrosine",
    risk: "high",
    penalty: 7,
    reason: "Synthetic red food dye used in some candies and decorations.",
    scientificView:
      "Artificial colors are regulated, but frequent intake is best minimized.",
  },
  e131: {
    name: "Patent Blue V",
    risk: "medium",
    penalty: 4,
    reason: "Synthetic blue food color.",
    scientificView:
      "Approved in some regions within limits, but artificial colors may be avoided by sensitive users.",
  },
  e132: {
    name: "Indigo Carmine",
    risk: "medium",
    penalty: 3,
    reason: "Synthetic blue food color.",
    scientificView:
      "Generally regulated, but indicates a more processed product.",
  },
  e133: {
    name: "Brilliant Blue FCF",
    risk: "medium",
    penalty: 3,
    reason: "Synthetic blue color used in drinks and sweets.",
    scientificView:
      "Permitted within limits, but artificial color exposure should be moderate.",
  },
  e140: {
    name: "Chlorophylls",
    risk: "low",
    penalty: 0,
    reason: "Natural green color from plants.",
    scientificView:
      "Generally considered safe in typical food-use amounts.",
  },
  e150d: {
    name: "Sulphite Ammonia Caramel",
    risk: "medium",
    penalty: 3,
    reason: "Caramel color used in soft drinks and sauces.",
    scientificView:
      "Permitted within limits, but often appears in highly processed foods.",
  },
  e160a: {
    name: "Beta-Carotene",
    risk: "low",
    penalty: 0,
    reason: "Orange color related to vitamin A compounds.",
    scientificView:
      "Generally safe in normal food-use quantities.",
  },
  e160b: {
    name: "Annatto",
    risk: "low",
    penalty: 1,
    reason: "Natural orange-red color used in cheese and snacks.",
    scientificView:
      "Generally permitted, though rare sensitivities can occur.",
  },
  e171: {
    name: "Titanium Dioxide",
    risk: "high",
    penalty: 8,
    reason: "White colorant formerly used in some foods and candies.",
    scientificView:
      "Regulatory views differ by region; best treated cautiously in food products.",
  },
  e200: {
    name: "Sorbic Acid",
    risk: "low",
    penalty: 1,
    reason: "Preservative used to prevent mold and yeast growth.",
    scientificView:
      "Generally considered safe within permitted limits.",
  },
  e210: {
    name: "Benzoic Acid",
    risk: "medium",
    penalty: 4,
    reason: "Preservative used in acidic foods and drinks.",
    scientificView:
      "Permitted within limits, but frequent intake from processed foods should be moderated.",
  },
  e212: {
    name: "Potassium Benzoate",
    risk: "medium",
    penalty: 5,
    reason: "Preservative used in soft drinks and acidic foods.",
    scientificView:
      "Allowed within limits, but frequent exposure through processed drinks should be limited.",
  },
  e213: {
    name: "Calcium Benzoate",
    risk: "medium",
    penalty: 4,
    reason: "Preservative used in acidic packaged foods.",
    scientificView:
      "Permitted within limits, but indicates a preserved processed product.",
  },
  e221: {
    name: "Sodium Sulphite",
    risk: "medium",
    penalty: 4,
    reason: "Preservative used in dried fruits and processed foods.",
    scientificView:
      "Sulphites can trigger sensitivity in some people, especially those with asthma.",
  },
  e223: {
    name: "Sodium Metabisulphite",
    risk: "medium",
    penalty: 5,
    reason: "Sulphite preservative used in packaged foods.",
    scientificView:
      "Can cause reactions in sulphite-sensitive users.",
  },
  e224: {
    name: "Potassium Metabisulphite",
    risk: "medium",
    penalty: 5,
    reason: "Sulphite preservative used in beverages and preserved foods.",
    scientificView:
      "Permitted within limits, but sensitivity is possible in some users.",
  },
  e251: {
    name: "Sodium Nitrate",
    risk: "high",
    penalty: 7,
    reason: "Preservative used in cured and processed meats.",
    scientificView:
      "Processed meat preservatives should be limited in frequent diets.",
  },
  e252: {
    name: "Potassium Nitrate",
    risk: "high",
    penalty: 7,
    reason: "Preservative used in cured meat products.",
    scientificView:
      "Often associated with processed meat products, which are best consumed occasionally.",
  },
  e260: {
    name: "Acetic Acid",
    risk: "low",
    penalty: 0,
    reason: "Acidity regulator naturally present in vinegar.",
    scientificView:
      "Generally considered safe in normal food amounts.",
  },
  e270: {
    name: "Lactic Acid",
    risk: "low",
    penalty: 0,
    reason: "Acidity regulator used in many foods.",
    scientificView:
      "Generally considered safe in typical food-use amounts.",
  },
  e282: {
    name: "Calcium Propionate",
    risk: "medium",
    penalty: 3,
    reason: "Preservative commonly used in bread and baked goods.",
    scientificView:
      "Permitted within limits, but indicates a longer-shelf-life processed food.",
  },
  e296: {
    name: "Malic Acid",
    risk: "low",
    penalty: 0,
    reason: "Acidity regulator found naturally in fruits.",
    scientificView:
      "Generally considered safe in typical food-use amounts.",
  },
  e300: {
    name: "Ascorbic Acid",
    risk: "low",
    penalty: 0,
    reason: "Vitamin C used as antioxidant.",
    scientificView:
      "Generally safe and commonly used to prevent oxidation.",
  },
  e301: {
    name: "Sodium Ascorbate",
    risk: "low",
    penalty: 0,
    reason: "Vitamin C salt used as antioxidant.",
    scientificView:
      "Generally considered safe in food-use amounts.",
  },
  e306: {
    name: "Tocopherols",
    risk: "low",
    penalty: 0,
    reason: "Vitamin E compounds used as antioxidants.",
    scientificView:
      "Generally safe in typical food-use quantities.",
  },
  e322: {
    name: "Lecithins",
    risk: "low",
    penalty: 1,
    reason: "Emulsifier often derived from soy or sunflower.",
    scientificView:
      "Generally considered safe, but soy-derived lecithin may matter for soy-sensitive users.",
  },
  e331: {
    name: "Sodium Citrates",
    risk: "low",
    penalty: 1,
    reason: "Acidity regulator and stabilizer.",
    scientificView:
      "Generally considered safe in permitted food-use quantities.",
  },
  e339: {
    name: "Sodium Phosphates",
    risk: "medium",
    penalty: 4,
    reason: "Stabilizer and acidity regulator used in processed foods.",
    scientificView:
      "Phosphate additives may be worth limiting in frequent highly processed foods.",
  },
  e341: {
    name: "Calcium Phosphates",
    risk: "low",
    penalty: 1,
    reason: "Stabilizer, anti-caking agent, or calcium source.",
    scientificView:
      "Generally permitted, though additive phosphate intake should remain moderate.",
  },
  e414: {
    name: "Acacia Gum",
    risk: "low",
    penalty: 1,
    reason: "Stabilizer and thickener used in drinks and sweets.",
    scientificView:
      "Generally considered safe; digestive sensitivity is possible in high amounts.",
  },
  e422: {
    name: "Glycerol",
    risk: "low",
    penalty: 1,
    reason: "Humectant used to retain moisture.",
    scientificView:
      "Generally considered safe in typical food quantities.",
  },
  e440: {
    name: "Pectins",
    risk: "low",
    penalty: 0,
    reason: "Plant-based gelling agent used in jams and fruit products.",
    scientificView:
      "Generally safe and commonly derived from fruits.",
  },
  e450: {
    name: "Diphosphates",
    risk: "medium",
    penalty: 4,
    reason: "Stabilizer and raising agent in processed foods.",
    scientificView:
      "Phosphate additives are best moderated in highly processed diets.",
  },
  e471: {
    name: "Mono- and Diglycerides of Fatty Acids",
    risk: "low",
    penalty: 2,
    reason: "Emulsifier used in bakery and processed foods.",
    scientificView:
      "Generally permitted, but indicates industrial processing.",
  },
  e472e: {
    name: "DATEM",
    risk: "medium",
    penalty: 3,
    reason: "Emulsifier used in commercial bread and bakery products.",
    scientificView:
      "Permitted within limits, but often indicates ultra-processed bakery formulation.",
  },
  e500: {
    name: "Sodium Carbonates",
    risk: "low",
    penalty: 0,
    reason: "Raising agent and acidity regulator.",
    scientificView:
      "Generally considered safe in normal food-use amounts.",
  },
};