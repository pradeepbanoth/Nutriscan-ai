export const ingredientIntelligence: Record<
  string,
  {
    risk: "Low" | "Medium" | "High";
    why: string;
    scientificView: string;
    recommendation: string;
  }
> = {
  "palm oil": {
    risk: "Medium",
    why: "Palm oil is high in saturated fat. Frequent intake may contribute to higher calorie and saturated fat consumption.",
    scientificView: "Generally safe in moderation, but regular high intake may not be ideal for heart health.",
    recommendation: "Consume occasionally and prefer products with healthier oils when possible.",
  },

  "high fructose corn syrup": {
    risk: "High",
    why: "High fructose corn syrup is a concentrated sweetener that can increase sugar intake quickly.",
    scientificView: "High intake of added sugars is linked with obesity, insulin resistance, and metabolic risk.",
    recommendation: "Avoid frequent consumption and choose lower-sugar alternatives.",
  },

  msg: {
    risk: "Medium",
    why: "MSG is a flavor enhancer used in processed foods. Some people may feel sensitivity symptoms.",
    scientificView: "Generally recognized as safe for most people, but processed foods containing MSG may also be high in salt.",
    recommendation: "Safe occasionally, but avoid relying heavily on highly processed snacks.",
  },

  "monosodium glutamate": {
    risk: "Medium",
    why: "Monosodium glutamate is another name for MSG and is used to enhance savory flavor.",
    scientificView: "Generally considered safe for most people, though some individuals report sensitivity.",
    recommendation: "Consume in moderation, especially if the product is also salty or ultra-processed.",
  },

  aspartame: {
    risk: "Medium",
    why: "Aspartame is an artificial sweetener used in low-calorie products.",
    scientificView: "Approved for use within accepted daily intake limits, but some users prefer avoiding artificial sweeteners.",
    recommendation: "Use occasionally and avoid excessive intake.",
  },

  "sodium benzoate": {
    risk: "Medium",
    why: "Sodium benzoate is a preservative used to extend shelf life.",
    scientificView: "Allowed in regulated amounts, but frequent intake of preservative-heavy foods is not ideal.",
    recommendation: "Choose fresher or less processed foods when possible.",
  },

  "artificial flavor": {
    risk: "Medium",
    why: "Artificial flavors are added to improve taste but usually indicate higher processing.",
    scientificView: "Many are permitted in food use, but they do not add nutritional value.",
    recommendation: "Prefer foods with natural ingredients and fewer additives.",
  },

  "artificial colour": {
    risk: "Medium",
    why: "Artificial colours improve appearance but are usually found in highly processed foods.",
    scientificView: "Some artificial colours are debated for sensitivity in children and frequent intake is best limited.",
    recommendation: "Prefer products without artificial colours, especially for children.",
  },

  "artificial color": {
    risk: "Medium",
    why: "Artificial colors improve appearance but usually indicate higher processing.",
    scientificView: "Some artificial colors are debated for sensitivity in children and frequent intake is best limited.",
    recommendation: "Prefer naturally colored foods and limit frequent consumption.",
  },

  "yellow 5": {
    risk: "Medium",
    why: "Yellow 5 is a synthetic food dye often used in processed snacks and drinks.",
    scientificView: "Approved in regulated amounts, but some people may be sensitive to synthetic dyes.",
    recommendation: "Limit products with synthetic dyes, especially for children.",
  },

  "red 40": {
    risk: "Medium",
    why: "Red 40 is a synthetic food dye commonly used in candies, drinks, and snacks.",
    scientificView: "Approved in regulated amounts, but synthetic dyes remain controversial for frequent child consumption.",
    recommendation: "Prefer dye-free alternatives where possible.",
  },

  sucralose: {
    risk: "Medium",
    why: "Sucralose is an artificial sweetener used to reduce sugar content.",
    scientificView: "Approved within daily intake limits, but long-term high intake remains debated.",
    recommendation: "Use occasionally and prefer naturally low-sugar foods.",
  },

  maltodextrin: {
    risk: "Medium",
    why: "Maltodextrin is a processed carbohydrate that can raise blood sugar quickly.",
    scientificView: "Commonly used as a thickener or filler, but it has a high glycemic index.",
    recommendation: "Limit if you are managing blood sugar or weight.",
  },

  "corn syrup": {
    risk: "High",
    why: "Corn syrup is an added sugar that increases total sugar load.",
    scientificView: "Frequent added sugar intake is linked with metabolic health risks.",
    recommendation: "Choose lower-sugar products when possible.",
  },

  "acesulfame k": {
  risk: "Medium",
  why: "Artificial sweetener commonly used in diet beverages and sugar-free foods.",
  scientificView: "Approved by regulators, but often found in highly processed foods.",
  recommendation: "Consume in moderation.",
},

"potassium sorbate": {
  risk: "Low",
  why: "Preservative used to prevent mold and yeast growth.",
  scientificView: "Generally regarded as safe in approved quantities.",
  recommendation: "Safe for occasional consumption.",
},

"carrageenan": {
  risk: "Medium",
  why: "Thickening agent used in dairy alternatives and processed foods.",
  scientificView: "Food-grade carrageenan is approved, though some debate exists regarding digestive sensitivity.",
  recommendation: "Monitor if you experience digestive discomfort.",
},

"ins 211": {
  risk: "Medium",
  why: "INS 211 is sodium benzoate, a common preservative.",
  scientificView: "Approved in regulated amounts.",
  recommendation: "Limit frequent intake of heavily preserved foods.",
},

"ins 621": {
  risk: "Medium",
  why: "INS 621 is monosodium glutamate (MSG), a flavor enhancer.",
  scientificView: "Generally recognized as safe for most consumers.",
  recommendation: "Consume in moderation.",
},

"ins 950": {
  risk: "Medium",
  why: "INS 950 is acesulfame potassium, an artificial sweetener.",
  scientificView: "Approved within regulatory limits.",
  recommendation: "Limit frequent intake of artificially sweetened products.",
},

"ins 951": {
  risk: "Medium",
  why: "INS 951 is aspartame, a low-calorie sweetener.",
  scientificView: "Approved by food safety authorities within daily intake limits.",
  recommendation: "Consume in moderation.",
},

"ins 330": {
  risk: "Low",
  why: "Citric acid used for acidity regulation.",
  scientificView: "Widely regarded as safe.",
  recommendation: "Generally safe.",
},

"titanium dioxide": {
  risk: "Medium",
  why: "Used as a whitening agent in some processed foods.",
  scientificView: "Regulatory treatment varies across regions.",
  recommendation: "Limit unnecessary intake.",
},

"polysorbate 80": {
  risk: "Medium",
  why: "Emulsifier used to improve texture and stability.",
  scientificView: "Approved in regulated quantities.",
  recommendation: "Consume processed foods in moderation.",
},

"potassium benzoate": {
  risk: "Medium",
  why: "Preservative used in beverages and packaged foods.",
  scientificView: "Generally safe in approved amounts.",
  recommendation: "Limit excessive intake.",
},

"xanthan gum": {
  risk: "Low",
  why: "Common thickener used in sauces and gluten-free foods.",
  scientificView: "Generally considered safe.",
  recommendation: "Safe for most consumers.",
},

"guar gum": {
  risk: "Low",
  why: "Plant-derived thickening agent.",
  scientificView: "Widely used and generally safe.",
  recommendation: "Safe for regular consumption.",
},

"erythritol": {
  risk: "Low",
  why: "Sugar alcohol used as a low-calorie sweetener.",
  scientificView: "Generally regarded as safe.",
  recommendation: "Consume in moderation if sensitive to sugar alcohols.",
},

"stevia": {
  risk: "Low",
  why: "Natural sweetener extracted from stevia leaves.",
  scientificView: "Widely accepted as safe.",
  recommendation: "Good alternative to added sugar.",
},



"ins 202": {
  risk: "Low",
  why: "INS 202 is potassium sorbate, a common preservative.",
  scientificView: "Allowed in regulated amounts and widely used in packaged foods.",
  recommendation: "Acceptable occasionally. Choose fresh foods when possible.",
},

"bha": {
  risk: "Medium",
  why: "BHA is an antioxidant preservative used to prevent fats from becoming rancid.",
  scientificView: "Regulatory views vary, and some consumers prefer avoiding it.",
  recommendation: "Limit frequent intake of foods containing BHA.",
},

"bht": {
  risk: "Medium",
  why: "BHT is a synthetic antioxidant preservative used in packaged foods.",
  scientificView: "Approved in some regions within limits, but frequent intake of preservative-heavy foods is not ideal.",
  recommendation: "Consume occasionally and prefer minimally processed options.",
},

"tert-butylhydroquinone": {
  risk: "Medium",
  why: "TBHQ is a preservative used to extend shelf life of oils and fried snacks.",
  scientificView: "Approved within limits, but usually found in ultra-processed foods.",
  recommendation: "Limit frequent consumption of foods containing TBHQ.",
},

"tbhq": {
  risk: "Medium",
  why: "TBHQ is used to preserve oils and prevent oxidation in snacks and fried products.",
  scientificView: "Permitted in regulated amounts, but often signals heavy processing.",
  recommendation: "Avoid daily intake of TBHQ-containing packaged snacks.",
},

"sodium nitrite": {
  risk: "High",
  why: "Sodium nitrite is used in processed meats for preservation and color.",
  scientificView: "Processed meats with nitrites are associated with higher long-term health risk when consumed frequently.",
  recommendation: "Limit processed meats and choose fresh protein sources more often.",
},

"sodium nitrate": {
  risk: "Medium",
  why: "Sodium nitrate is used as a preservative, especially in cured meats.",
  scientificView: "Frequent intake of cured and processed meats is generally discouraged.",
  recommendation: "Consume rarely and prefer fresh, unprocessed foods.",
},

"potassium nitrate": {
  risk: "Medium",
  why: "Potassium nitrate is a curing preservative used in some processed meats.",
  scientificView: "Usually safe within limits, but cured meats should not be daily staples.",
  recommendation: "Limit frequent consumption.",
},

"calcium propionate": {
  risk: "Low",
  why: "Calcium propionate is used to prevent mold growth in bread and bakery products.",
  scientificView: "Generally recognized as safe in permitted amounts.",
  recommendation: "Usually safe, but choose fresh bakery products when possible.",
},

"ins 282": {
  risk: "Low",
  why: "INS 282 is calcium propionate, commonly used in bread preservation.",
  scientificView: "Approved in regulated amounts.",
  recommendation: "Acceptable occasionally; fresh foods are better for daily use.",
},

"sodium metabisulphite": {
  risk: "Medium",
  why: "Sodium metabisulphite is a preservative used in dried foods, juices, and packaged products.",
  scientificView: "Can trigger sensitivity in some people, especially those sensitive to sulphites.",
  recommendation: "Avoid if sensitive to sulphites or asthma-prone.",
},

"sodium metabisulfite": {
  risk: "Medium",
  why: "Sodium metabisulfite is a sulphite preservative used to prevent spoilage and browning.",
  scientificView: "Permitted in foods, but sulphite-sensitive individuals may react.",
  recommendation: "Limit if you are sensitive to preservatives or sulphites.",
},

"sulphur dioxide": {
  risk: "Medium",
  why: "Sulphur dioxide is a preservative used in dried fruits, juices, and beverages.",
  scientificView: "Allowed in limits, but may affect sulphite-sensitive people.",
  recommendation: "Avoid if you have sulphite sensitivity.",
},

"sulfur dioxide": {
  risk: "Medium",
  why: "Sulfur dioxide is used as a preservative in some packaged and dried foods.",
  scientificView: "Can cause sensitivity reactions in some individuals.",
  recommendation: "Consume cautiously if sensitive to sulphites.",
},

"potassium metabisulphite": {
  risk: "Medium",
  why: "Potassium metabisulphite is a sulphite preservative used in beverages and processed foods.",
  scientificView: "Approved in regulated amounts but may trigger sensitivity.",
  recommendation: "Avoid if sulphite-sensitive.",
},

"potassium metabisulfite": {
  risk: "Medium",
  why: "Potassium metabisulfite is used to preserve color and freshness.",
  scientificView: "Sulphites are generally safe for most people but may affect sensitive individuals.",
  recommendation: "Limit if you notice sensitivity.",
},

"benzoic acid": {
  risk: "Medium",
  why: "Benzoic acid is a preservative used in acidic foods and beverages.",
  scientificView: "Allowed in regulated amounts, but frequent preservative-heavy foods are not ideal.",
  recommendation: "Consume occasionally and prefer fresher options.",
},

"sorbic acid": {
  risk: "Low",
  why: "Sorbic acid is a preservative used to prevent mold and yeast.",
  scientificView: "Generally considered safe in approved amounts.",
  recommendation: "Usually safe for most people.",
},
};